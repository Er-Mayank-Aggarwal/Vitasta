'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { invalidateProductCache } from '@/app/actions/product-actions';
import { revalidatePath } from 'next/cache';

/**
 * Get all inventory items with full stock, reservations, and low stock indicators
 */
export async function getAdminInventory() {
  try {
    await requireAdmin();

    const products = await prisma.product.findMany({
      include: {
        inventory: true,
        category: true,
      },
      orderBy: { title: 'asc' },
    });

    const stockItems = products.map((p) => {
      const inv = p.inventory;
      const quantity = inv?.quantity !== undefined ? inv.quantity : 10;
      const reservedQuantity = inv?.reservedQuantity || 0;
      const lowStockThreshold = inv?.lowStockThreshold || 2;

      return {
        productId: p.id,
        productName: p.title,
        productSlug: p.slug,
        categoryName: p.category?.name || 'Saree Collection',
        price: p.price,
        primaryImage: p.primaryImage,
        quantity,
        reservedQuantity,
        totalCapacity: quantity + reservedQuantity,
        lowStockThreshold,
        stockStatus: p.stockStatus,
        updatedAt: inv?.updatedAt ? inv.updatedAt.toISOString() : p.updatedAt.toISOString(),
      };
    });

    return { success: true, inventory: stockItems };
  } catch (error) {
    console.error('getAdminInventory error:', error);
    return { success: false, error: error.message, inventory: [] };
  }
}

/**
 * Update stock for a product with status and threshold controls
 */
export async function updateStock(productId, optionsOrQuantity, stockStatus, lowStockThreshold) {
  try {
    await requireAdmin();

    let qty;
    let status = stockStatus;
    let threshold = lowStockThreshold;
    let reserved = undefined;

    if (typeof optionsOrQuantity === 'object' && optionsOrQuantity !== null) {
      qty = optionsOrQuantity.quantity !== undefined ? Number(optionsOrQuantity.quantity) : undefined;
      status = optionsOrQuantity.stockStatus !== undefined ? optionsOrQuantity.stockStatus : status;
      threshold = optionsOrQuantity.lowStockThreshold !== undefined ? Number(optionsOrQuantity.lowStockThreshold) : threshold;
      reserved = optionsOrQuantity.reservedQuantity !== undefined ? Number(optionsOrQuantity.reservedQuantity) : undefined;
    } else if (optionsOrQuantity !== undefined) {
      qty = Number(optionsOrQuantity);
    }

    if (qty !== undefined) {
      qty = Math.max(0, qty);
    }

    const updateData = {};
    if (qty !== undefined) updateData.quantity = qty;
    if (threshold !== undefined) updateData.lowStockThreshold = Math.max(1, Number(threshold));
    if (reserved !== undefined) updateData.reservedQuantity = Math.max(0, Number(reserved));

    // Upsert inventory record
    const updatedInv = await prisma.inventory.upsert({
      where: { productId },
      update: updateData,
      create: {
        productId,
        quantity: qty !== undefined ? qty : 10,
        lowStockThreshold: threshold !== undefined ? Number(threshold) : 2,
        reservedQuantity: reserved !== undefined ? Number(reserved) : 0,
      },
    });

    // Auto-compute stock status if not explicitly provided
    let finalStatus = status;
    if (!finalStatus && qty !== undefined) {
      if (qty === 0) {
        finalStatus = 'OUT_OF_STOCK';
      }
    }

    if (finalStatus) {
      await prisma.product.update({
        where: { id: productId },
        data: { stockStatus: finalStatus },
      });
    }

    await invalidateProductCache();

    revalidatePath('/admin-controls/inventory');
    revalidatePath('/admin-controls/products');
    revalidatePath('/shop');

    return {
      success: true,
      quantity: updatedInv.quantity,
      reservedQuantity: updatedInv.reservedQuantity,
      lowStockThreshold: updatedInv.lowStockThreshold,
      stockStatus: finalStatus,
    };
  } catch (error) {
    console.error('updateStock error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Adjust stock by delta (e.g. +1, -1, +5, -5)
 */
export async function adjustStock(productId, delta) {
  try {
    await requireAdmin();

    const inv = await prisma.inventory.findUnique({
      where: { productId },
    });

    const currentQty = inv ? inv.quantity : 10;
    const newQty = Math.max(0, currentQty + Number(delta));

    return await updateStock(productId, { quantity: newQty });
  } catch (error) {
    console.error('adjustStock error:', error);
    return { success: false, error: error.message };
  }
}
