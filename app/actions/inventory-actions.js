'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { revalidatePath } from 'next/cache';

/**
 * Get all inventory items
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

    const stockItems = products.map((p) => ({
      productId: p.id,
      productName: p.title,
      productSlug: p.slug,
      categoryName: p.category?.name || 'Saree Collection',
      price: p.price,
      primaryImage: p.primaryImage,
      quantity: p.inventory?.quantity !== undefined ? p.inventory.quantity : 10,
      lowStockThreshold: p.inventory?.lowStockThreshold || 2,
      stockStatus: p.stockStatus,
    }));

    return { success: true, inventory: stockItems };
  } catch (error) {
    console.error('getAdminInventory error:', error);
    return { success: false, error: error.message, inventory: [] };
  }
}

/**
 * Update stock for a product
 */
export async function updateStock(productId, quantity, stockStatus) {
  try {
    await requireAdmin();

    const qty = Math.max(0, Number(quantity));

    // Upsert inventory record
    await prisma.inventory.upsert({
      where: { productId },
      update: { quantity: qty },
      create: {
        productId,
        quantity: qty,
        lowStockThreshold: 2,
      },
    });

    if (stockStatus) {
      await prisma.product.update({
        where: { id: productId },
        data: { stockStatus },
      });
    }

    revalidatePath('/admin-controls/inventory');
    revalidatePath('/admin-controls/products');
    return { success: true, quantity: qty };
  } catch (error) {
    console.error('updateStock error:', error);
    return { success: false, error: error.message };
  }
}
