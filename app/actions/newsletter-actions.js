'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Subscribe email to newsletter
 */
export async function subscribeNewsletter(email) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    const cleanEmail = email.toLowerCase().trim();

    await prisma.newsletter.upsert({
      where: { email: cleanEmail },
      update: {},
      create: { email: cleanEmail },
    });

    revalidatePath('/admin-controls/subscribers');
    return { success: true, message: 'Thank you for joining the Vitasta Royal Circle!' };
  } catch (error) {
    console.error('subscribeNewsletter error:', error);
    return { success: false, error: error.message };
  }
}
