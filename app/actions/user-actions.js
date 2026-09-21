'use server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileUpdateSchema, addressSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

async function getUserId() {
  const session = await getSession();
  return session?.userId || null;
}

/**
 * Get current user profile with addresses, orders, and shortlist
 */
export async function getUserProfile() {
  const userId = await getUserId();
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        gender: true,
        dob: true,
        role: true,
        membershipTier: true,
        createdAt: true,
      },
    });
    return user;
  } catch (e) {
    console.error('getUserProfile error:', e);
    return null;
  }
}

/**
 * Update user avatar image (Cloudinary Data URL or URL string)
 */
export async function updateUserAvatar(imageDataUrl) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  if (!imageDataUrl || typeof imageDataUrl !== 'string') {
    return { success: false, error: 'Invalid image data' };
  }

  // Max 5MB base64 check
  if (imageDataUrl.length > 5 * 1024 * 1024) {
    return { success: false, error: 'Image file exceeds 5MB. Please choose a smaller portrait.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageDataUrl },
    });
    revalidatePath('/account');
    return { success: true };
  } catch (e) {
    console.error('updateUserAvatar error:', e);
    return { success: false, error: 'Failed to update profile portrait' };
  }
}

/**
 * Get user orders with items and status timeline
 */
export async function getUserOrders() {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
        },
        shipment: true,
        address: true,
        items: true,
      },
    });
    return orders;
  } catch (e) {
    console.error('getUserOrders error:', e);
    return [];
  }
}

/**
 * Get user addresses
 */
export async function getUserAddresses() {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
    return addresses;
  } catch (e) {
    console.error('getUserAddresses error:', e);
    return [];
  }
}

/**
 * Update user personal details
 */
export async function updateUserProfile(formData) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  const parsed = profileUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || 'Invalid input';
    return { success: false, error: firstError };
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        gender: parsed.data.gender || null,
        dob: parsed.data.dob ? new Date(parsed.data.dob) : null,
      },
    });

    revalidatePath('/account');
    return { success: true, user };
  } catch (e) {
    console.error('updateUserProfile error:', e);
    if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
      return { success: false, error: 'Email is already registered with another patron account.' };
    }
    return { success: false, error: 'Failed to update atelier profile.' };
  }
}

/**
 * Add / Save Address
 */
export async function addAddress(formData) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          userId,
          fullName: formData.fullName || user.name || 'Patron',
          phone: formData.phone || user.phone || '',
          addressLine1: formData.street || formData.addressLine1 || '',
          addressLine2: formData.landmark || formData.addressLine2 || null,
          city: formData.city || 'Jodhpur',
          district: formData.district || null,
          state: formData.state || 'Rajasthan',
          country: formData.country || 'India',
          pincode: formData.zipCode || formData.pincode || '',
          isDefault: Boolean(formData.isDefault),
        },
      });

      if (formData.isDefault) {
        await tx.address.updateMany({
          where: { userId, id: { not: address.id } },
          data: { isDefault: false },
        });
      }
    });

    revalidatePath('/account');
    return { success: true };
  } catch (e) {
    console.error('addAddress error:', e);
    return { success: false, error: 'Failed to save royal delivery address' };
  }
}

export const saveAddress = addAddress;

/**
 * Delete Address
 */
export async function deleteAddress(addressId) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  try {
    await prisma.address.delete({
      where: { id: addressId, userId },
    });
    revalidatePath('/account');
    return { success: true };
  } catch (e) {
    console.error('deleteAddress error:', e);
    return { success: false, error: 'Failed to remove address' };
  }
}

/**
 * Set Default Address
 */
export async function setDefaultAddress(addressId) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: 'Not authenticated' };

  try {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId, userId },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath('/account');
    return { success: true };
  } catch (e) {
    console.error('setDefaultAddress error:', e);
    return { success: false, error: 'Failed to set default delivery address' };
  }
}
