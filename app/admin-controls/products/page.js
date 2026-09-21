import { prisma } from '@/lib/prisma';
import AdminProductsClient from './AdminProductsClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let products = [];
  let categories = [];

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: { category: true, images: true, inventory: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);
  } catch (error) {
    console.error('Error loading products for admin:', error);
  }

  return (
    <AdminProductsClient
      initialProducts={products || []}
      categories={categories || []}
    />
  );
}
