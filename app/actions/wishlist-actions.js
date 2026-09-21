'use server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Toggle Saree in User's Wishlist / Shortlist
 */
export async function toggleWishlist(productId) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Please sign in to shortlist sarees' };
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      revalidatePath('/account');
      return { success: true, shortlisted: false };
    } else {
      await prisma.wishlist.create({
        data: {
          userId: session.userId,
          productId,
        },
      });
      revalidatePath('/account');
      return { success: true, shortlisted: true };
    }
  } catch (error) {
    console.error('toggleWishlist error:', error);
    return { success: false, error: error.message };
  }
}
