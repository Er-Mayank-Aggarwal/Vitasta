'use server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { placeOrderSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

/**
 * Place a new Atelier Bespoke Order / Consultation
 */
export async function createOrder(orderInput) {
  try {
    const validated = placeOrderSchema.parse(orderInput);
    const session = await getSession();
    const userId = session?.userId || null;

    const subtotal = validated.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const total = subtotal; // Complimentary shipping & finishing

    // If user wants to save address or is logged in
    let addressId = validated.addressId || null;
    if (userId && validated.saveAddress && !addressId) {
      const newAddress = await prisma.address.create({
        data: {
          userId,
          fullName: validated.fullName,
          phone: validated.phone,
          addressLine1: validated.addressLine1,
          addressLine2: validated.addressLine2 || null,
          city: validated.city,
          state: validated.state,
          pincode: validated.pincode,
          country: 'India',
        },
      });
      addressId = newAddress.id;
    }

    const orderNumber = `VSA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId,
        userName: validated.fullName,
        userEmail: validated.email,
        userPhone: validated.phone,
        orderStatus: 'PENDING',
        statusLabel: 'Pending Atelier Consultation',
        subtotal,
        total,
        notes: validated.notes || null,
        shippingAddressJson: JSON.stringify({
          fullName: validated.fullName,
          phone: validated.phone,
          addressLine1: validated.addressLine1,
          addressLine2: validated.addressLine2,
          city: validated.city,
          state: validated.state,
          pincode: validated.pincode,
          country: 'India',
        }),
        timelineJson: JSON.stringify([
          {
            status: 'PENDING',
            title: 'Atelier Order Initiated',
            description: 'Your bespoke order has been registered at our Jodhpur Atelier.',
            timestamp: new Date().toISOString(),
          },
        ]),
        items: {
          create: validated.items.map((item) => ({
            productId: item.id,
            title: item.title,
            category: item.category || 'Royal Saree',
            fabric: item.fabric || 'Pure Silk',
            color: item.color || 'Royal Classic',
            unitPrice: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image,
          })),
        },
        payment: {
          create: {
            paymentMethod: 'ATELIER_INVOICE_TRANSFER',
            amount: total,
            status: 'PENDING',
          },
        },
        history: {
          create: {
            status: 'PENDING',
            note: 'Order placed by client',
          },
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath('/account');
    revalidatePath('/admin-controls/orders');

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  } catch (error) {
    console.error('createOrder error:', error);
    return { success: false, error: error.message || 'Failed to place order' };
  }
}

/**
 * Fetch Order details by ID (for Confirmation / Invoice / Status Tracking)
 */
export async function getOrderById(orderId) {
  try {
    let order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payment: true,
        shipment: true,
        history: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      order = await prisma.order.findUnique({
        where: { orderNumber: orderId },
        include: {
          items: true,
          payment: true,
          shipment: true,
          history: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, order };
  } catch (error) {
    console.error('getOrderById error:', error);
    return { success: false, error: 'Failed to fetch order details' };
  }
}
