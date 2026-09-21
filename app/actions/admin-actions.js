'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { revalidatePath } from 'next/cache';

/**
 * Fetch overall statistics for the Admin Dashboard
 */
export async function getAdminStats() {
  try {
    await requireAdmin();

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      allOrders,
      unreadMessages,
      lowStockCount,
      totalReviews,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }).catch(() => 21),
      prisma.order.count().catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: { select: { name: true, email: true, membershipTier: true } },
        },
      }).catch(() => []),
      prisma.order.findMany({
        select: { total: true, orderStatus: true, createdAt: true },
      }).catch(() => []),
      prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0),
      prisma.inventory.count({ where: { quantity: { lte: 2 } } }).catch(() => 0),
      prisma.review.count().catch(() => 0),
    ]);

    const totalRevenue = allOrders
      .filter((o) => o.orderStatus !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingVideoInspections = allOrders.filter(
      (o) => o.orderStatus === 'IN_PRODUCTION' || o.orderStatus === 'LOOM_WEAVING'
    ).length;

    return {
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingVideoInspections,
        unreadMessages,
        lowStockCount,
        totalReviews,
        recentOrders,
      },
    };
  } catch (error) {
    console.error('getAdminStats error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all orders for the Admin Order Pipeline
 */
export async function getAdminOrders(statusFilter = 'ALL') {
  try {
    await requireAdmin();

    const where = {};
    if (statusFilter && statusFilter !== 'ALL') {
      where.orderStatus = statusFilter;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        user: { select: { name: true, email: true, phone: true, membershipTier: true } },
        history: { orderBy: { createdAt: 'desc' } },
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedOrders = orders.map(order => ({
      ...order,
      displayId: order.orderNumber || order.id.slice(0, 8).toUpperCase(),
      customer: {
        name: order.userName || order.user?.name || 'Royal Patron',
        email: order.userEmail || order.user?.email || 'client@vitasta.com',
        phone: order.userPhone || order.user?.phone || '+91 88240 17443',
      },
      status: order.orderStatus.toLowerCase(),
      date: order.createdAt,
      time: new Date(order.createdAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
    }));

    return { success: true, orders: formattedOrders };
  } catch (error) {
    console.error('getAdminOrders error:', error);
    return { success: false, error: error.message, orders: [] };
  }
}

/**
 * Update order status, dispatch video, tracking number
 */
export async function updateOrderStatus(params) {
  try {
    await requireAdmin();

    const {
      orderId,
      orderStatus,
      statusLabel,
      preDispatchVideoUrl,
      trackingNumber,
      courierName,
      notes,
    } = params;

    const dataToUpdate = {};
    if (orderStatus) dataToUpdate.orderStatus = orderStatus.toUpperCase();
    if (statusLabel) dataToUpdate.statusLabel = statusLabel;
    if (preDispatchVideoUrl !== undefined) dataToUpdate.preDispatchVideoUrl = preDispatchVideoUrl;
    if (trackingNumber !== undefined) dataToUpdate.trackingNumber = trackingNumber;
    if (courierName !== undefined) dataToUpdate.courierName = courierName;
    if (notes !== undefined) dataToUpdate.notes = notes;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...dataToUpdate,
        history: orderStatus ? {
          create: {
            status: orderStatus.toUpperCase(),
            note: notes || `Status updated to ${orderStatus}`,
          },
        } : undefined,
      },
      include: {
        history: true,
        items: true,
      },
    });

    revalidatePath('/admin-controls/orders');
    revalidatePath('/account');

    return { success: true, order: updated };
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get customer directory
 */
export async function getAdminCustomers() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      include: {
        orders: {
          select: { id: true, total: true, orderStatus: true, createdAt: true },
        },
        addresses: {
          select: { city: true, state: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const customers = users.map((u) => {
      const validOrders = u.orders.filter((o) => o.orderStatus !== 'CANCELLED');
      const totalSpent = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lastOrder = u.orders[0];

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        role: u.role,
        membershipTier: u.membershipTier || 'Royal Patron',
        city: u.addresses[0]?.city || 'Jodhpur',
        state: u.addresses[0]?.state || 'Rajasthan',
        totalOrders: u.orders.length,
        totalSpent,
        lastOrderDate: lastOrder ? lastOrder.createdAt : u.createdAt,
        joinedDate: u.createdAt,
        orders: u.orders,
      };
    });

    return { success: true, customers };
  } catch (error) {
    console.error('getAdminCustomers error:', error);
    return { success: false, error: error.message, customers: [] };
  }
}

/**
 * Update Customer Role
 */
export async function updateCustomerRole(userId, newRole) {
  try {
    await requireAdmin();

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath('/admin-controls/customers');
    return { success: true, user: updated };
  } catch (error) {
    console.error('updateCustomerRole error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get Contact Messages
 */
export async function getAdminMessages() {
  try {
    await requireAdmin();

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = messages.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone || 'N/A',
      subject: m.subject || 'Atelier Bespoke Inquiry',
      message: m.message,
      isRead: m.isRead,
      date: m.createdAt,
    }));

    return { success: true, messages: formatted };
  } catch (error) {
    console.error('getAdminMessages error:', error);
    return { success: false, error: error.message, messages: [] };
  }
}

/**
 * Mark Message Read
 */
export async function markMessageRead(id) {
  try {
    await requireAdmin();

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    revalidatePath('/admin-controls/messages');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete Message
 */
export async function deleteMessage(id) {
  try {
    await requireAdmin();

    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath('/admin-controls/messages');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get Newsletter Subscribers
 */
export async function getAdminSubscribers() {
  try {
    await requireAdmin();

    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = subscribers.map(s => ({
      id: s.id,
      email: s.email,
      date: s.createdAt,
    }));

    return { success: true, subscribers: formatted };
  } catch (error) {
    console.error('getAdminSubscribers error:', error);
    return { success: false, error: error.message, subscribers: [] };
  }
}

/**
 * Delete Subscriber
 */
export async function deleteSubscriber(id) {
  try {
    await requireAdmin();

    await prisma.newsletter.delete({
      where: { id },
    });

    revalidatePath('/admin-controls/subscribers');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get Reviews for moderation
 */
export async function getAdminReviews() {
  try {
    await requireAdmin();

    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { title: true, primaryImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = reviews.map(r => ({
      id: r.id,
      author: r.user?.name || 'Royal Patron',
      email: r.user?.email,
      productTitle: r.product?.title || 'Vitasta Handloom Saree',
      productImage: r.product?.primaryImage,
      rating: r.rating,
      comment: r.comment,
      isApproved: r.isPublished,
      date: r.createdAt,
    }));

    return { success: true, reviews: formatted };
  } catch (error) {
    console.error('getAdminReviews error:', error);
    return { success: false, error: error.message, reviews: [] };
  }
}

/**
 * Approve Review
 */
export async function approveReview(id) {
  try {
    await requireAdmin();

    await prisma.review.update({
      where: { id },
      data: { isPublished: true },
    });

    revalidatePath('/admin-controls/reviews');
    revalidatePath('/reviews');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete Review
 */
export async function deleteReview(id) {
  try {
    await requireAdmin();

    await prisma.review.delete({
      where: { id },
    });

    revalidatePath('/admin-controls/reviews');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
