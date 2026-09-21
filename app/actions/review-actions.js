'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Submit a customer review
 */
export async function submitReview(data) {
  try {
    const session = await getSession();
    const { productId, rating, comment } = data;

    if (!session?.userId) {
      return { success: false, error: 'Please sign in to submit your royal review' };
    }

    if (!rating || rating < 1 || rating > 5) {
      return { success: false, error: 'Please provide a star rating between 1 and 5' };
    }

    const review = await prisma.review.create({
      data: {
        userId: session.userId,
        productId,
        rating: Number(rating),
        comment: comment?.trim() || '',
        isPublished: true, // auto publish or pending
      },
    });

    revalidatePath(`/product`);
    revalidatePath('/admin-controls/reviews');
    return { success: true, review };
  } catch (error) {
    console.error('submitReview error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get product reviews
 */
export async function getProductReviews(productId) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isPublished: true,
      },
      include: {
        user: { select: { name: true, membershipTier: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, reviews };
  } catch (error) {
    return { success: false, error: error.message, reviews: [] };
  }
}
