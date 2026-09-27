'use server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { placeOrderSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

/**
 * Place a new Atelier Bespoke Order / Consultation with Atomic Inventory Locks
 */
export async function createOrder(orderInput) {
  try {
    const validated = placeOrderSchema.parse(orderInput);
    const session = await getSession();
    let userId = session?.userId || null;

    // Fallback: If no session was attached, match with registered patron by email
    if (!userId && validated.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validated.email.trim().toLowerCase() },
      });
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    const subtotal = validated.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const total = subtotal; // Complimentary shipping & finishing

    // Execute atomic transaction for inventory lock & order creation
    const createdOrder = await prisma.$transaction(async (tx) => {
      // 1. Concurrency Lock & Stock Verification for every saree in the bag
      for (const item of validated.items) {
        let inv = await tx.inventory.findUnique({
          where: { productId: item.id },
        });

        // If inventory record doesn't exist yet, initialize it
        if (!inv) {
          inv = await tx.inventory.create({
            data: {
              productId: item.id,
              quantity: 10,
              reservedQuantity: 0,
              lowStockThreshold: 2,
            },
          });
        }

        // Verify stock sufficiency
        if (inv.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${item.title}". Only ${inv.quantity} available in the atelier.`
          );
        }

        // Deduct available stock & increment reserved count
        const newQty = inv.quantity - item.quantity;
        const newReserved = inv.reservedQuantity + item.quantity;

        await tx.inventory.update({
          where: { productId: item.id },
          data: {
            quantity: newQty,
            reservedQuantity: newReserved,
          },
        });

        // If stock is exhausted, update product stockStatus
        if (newQty === 0) {
          await tx.product.update({
            where: { id: item.id },
            data: { stockStatus: 'OUT_OF_STOCK' },
          });
        }
      }

      // 2. Handle Address Book Integration
      let addressId = validated.addressId || null;
      if (userId && validated.saveAddress && !addressId) {
        try {
          const newAddress = await tx.address.create({
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
        } catch (err) {
          console.error('Failed to auto-save address in transaction:', err);
        }
      }

      const orderNumber = `VSA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // 3. Create Order and all related entities atomically
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          userName: validated.fullName,
          userEmail: validated.email.trim().toLowerCase(),
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
          shipment: {
            create: {
              courierName: 'BlueDart Sovereign Luxury Courier',
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
          history: true,
          shipment: true,
        },
      });

      return order;
    });

    revalidatePath('/account');
    revalidatePath('/admin-controls/orders');
    revalidatePath('/admin-controls/inventory');
    revalidatePath('/admin-controls/products');
    revalidatePath('/shop');
    revalidatePath('/checkout');

    return {
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
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
