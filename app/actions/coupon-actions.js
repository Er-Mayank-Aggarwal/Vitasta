'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { revalidatePath } from 'next/cache';

/**
 * Get all coupons
 */
export async function getAdminCoupons() {
  try {
    await requireAdmin();

    const coupons = await prisma.coupon.findMany({
      orderBy: { expiresAt: 'asc' },
    });

    return { success: true, coupons };
  } catch (error) {
    console.error('getAdminCoupons error:', error);
    return { success: false, error: error.message, coupons: [] };
  }
}

/**
 * Create a new coupon
 */
export async function createCoupon(data) {
  try {
    await requireAdmin();

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase().trim(),
        discountType: data.discountType,
        value: data.value,
        minimumOrder: data.minimumOrder || null,
        maximumDiscount: data.maximumDiscount || null,
        usageLimit: data.usageLimit || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    revalidatePath('/admin-controls/coupons');
    return { success: true, data: coupon };
  } catch (error) {
    console.error('createCoupon error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update existing coupon
 */
export async function updateCoupon(id, data) {
  try {
    await requireAdmin();

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        code: data.code ? data.code.toUpperCase().trim() : undefined,
        discountType: data.discountType,
        value: data.value,
        minimumOrder: data.minimumOrder || null,
        maximumDiscount: data.maximumDiscount || null,
        usageLimit: data.usageLimit || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
      },
    });

    revalidatePath('/admin-controls/coupons');
    return { success: true, data: updated };
  } catch (error) {
    console.error('updateCoupon error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Toggle coupon active status
 */
export async function toggleCoupon(id) {
  try {
    await requireAdmin();

    const current = await prisma.coupon.findUnique({ where: { id } });
    if (!current) throw new Error('Coupon not found');

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: !current.isActive },
    });

    revalidatePath('/admin-controls/coupons');
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete coupon
 */
export async function deleteCoupon(id) {
  try {
    await requireAdmin();

    await prisma.coupon.delete({ where: { id } });

    revalidatePath('/admin-controls/coupons');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Validate coupon code (public / checkout)
 */
export async function validateCoupon(code, orderSubtotal = 0) {
  try {
    if (!code) return { valid: false, error: 'Coupon code required' };

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon || !coupon.isActive) {
      return { valid: false, error: 'Invalid or inactive coupon code' };
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return { valid: false, error: 'This royal voucher has expired' };
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }

    if (coupon.minimumOrder && orderSubtotal < coupon.minimumOrder) {
      return {
        valid: false,
        error: `Minimum order of ₹${coupon.minimumOrder.toLocaleString('en-IN')} required`,
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderSubtotal * coupon.value) / 100;
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    discountAmount = Math.min(discountAmount, orderSubtotal);

    return {
      valid: true,
      discountAmount,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
      },
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
