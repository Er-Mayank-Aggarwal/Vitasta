'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { productSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

/**
 * Fetch products with optional filtering and sorting
 */
export async function getProducts(options = {}) {
  try {
    const {
      categoryId,
      fabric,
      search,
      sort = 'featured',
      limit = 50,
      page = 1,
    } = options;

    const where = {
      isActive: true,
    };

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    if (fabric && fabric !== 'all') {
      where.fabric = {
        contains: fabric,
        mode: 'insensitive',
      };
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { work: { contains: search, mode: 'insensitive' } },
        { color: { contains: search, mode: 'insensitive' } },
        { fabric: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy = { isFeatured: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      success: true,
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('getProducts error:', error);
    return { success: false, error: 'Failed to fetch catalog products', products: [] };
  }
}

/**
 * Fetch single product by slug or ID
 */
export async function getProductBySlug(slug) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: { select: { name: true, membershipTier: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return { success: false, error: 'Saree not found' };
    }

    return { success: true, product };
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return { success: false, error: 'Failed to load product' };
  }
}

/**
 * Admin: Create a new saree product
 */
export async function createProduct(formData) {
  try {
    await requireAdmin();

    const validated = productSchema.parse(formData);

    const product = await prisma.product.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        price: validated.price,
        originalPrice: validated.originalPrice || null,
        categoryId: validated.categoryId,
        fabric: validated.fabric,
        blouseFabric: validated.blouseFabric || null,
        work: validated.work,
        design: validated.design || null,
        color: validated.color,
        blouseColor: validated.blouseColor || null,
        sareeLength: validated.sareeLength,
        blouseLength: validated.blouseLength,
        materialCare: validated.materialCare,
        origin: validated.origin,
        stockStatus: validated.stockStatus,
        primaryImage: validated.primaryImage,
        isActive: validated.isActive,
        isFeatured: validated.isFeatured,
        images: {
          create: (validated.imageUrls || [validated.primaryImage]).map((url, idx) => ({
            assetPath: url,
            cdnUrl: url,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
        inventory: {
          create: {
            quantity: 10,
          },
        },
      },
    });

    revalidatePath('/shop');
    revalidatePath('/admin-controls/products');

    return { success: true, product };
  } catch (error) {
    console.error('createProduct error:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

/**
 * Admin: Update an existing product
 */
export async function updateProduct(id, formData) {
  try {
    await requireAdmin();

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        categoryId: formData.categoryId,
        fabric: formData.fabric,
        blouseFabric: formData.blouseFabric || null,
        work: formData.work,
        design: formData.design || null,
        color: formData.color,
        blouseColor: formData.blouseColor || null,
        materialCare: formData.materialCare,
        stockStatus: formData.stockStatus,
        primaryImage: formData.primaryImage,
        isFeatured: Boolean(formData.isFeatured),
        isActive: Boolean(formData.isActive),
      },
    });

    revalidatePath('/shop');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/admin-controls/products');

    return { success: true, product };
  } catch (error) {
    console.error('updateProduct error:', error);
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

/**
 * Admin: Delete a product
 */
export async function deleteProduct(id) {
  try {
    await requireAdmin();

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/shop');
    revalidatePath('/admin-controls/products');

    return { success: true };
  } catch (error) {
    console.error('deleteProduct error:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

/**
 * Admin: Toggle product featured status
 */
export async function toggleFeatured(id, currentStatus) {
  try {
    await requireAdmin();

    const updated = await prisma.product.update({
      where: { id },
      data: { isFeatured: !currentStatus },
    });

    revalidatePath('/shop');
    revalidatePath('/admin-controls/products');

    return { success: true, isFeatured: updated.isFeatured };
  } catch (error) {
    console.error('toggleFeatured error:', error);
    return { success: false, error: error.message || 'Failed to toggle featured' };
  }
}
