'use server';

import { prisma } from '@/lib/prisma';
import { contactMessageSchema, newsletterSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

/**
 * Submit Contact or Bespoke Atelier Consultation Message
 */
export async function submitContactMessage(formData) {
  try {
    const validated = contactMessageSchema.parse(formData);

    const message = await prisma.contactMessage.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        subject: validated.subject,
        message: validated.message,
      },
    });

    revalidatePath('/admin-controls/messages');
    return { success: true, messageId: message.id };
  } catch (error) {
    console.error('submitContactMessage error:', error);
    return { success: false, error: error.message || 'Failed to submit inquiry' };
  }
}

/**
 * Subscribe to Royal Atelier Newsletter
 */
export async function subscribeNewsletter(email) {
  try {
    const validated = newsletterSchema.parse({ email });

    await prisma.newsletter.upsert({
      where: { email: validated.email },
      update: {},
      create: { email: validated.email },
    });

    return { success: true };
  } catch (error) {
    console.error('subscribeNewsletter error:', error);
    return { success: false, error: error.message || 'Failed to subscribe' };
  }
}
