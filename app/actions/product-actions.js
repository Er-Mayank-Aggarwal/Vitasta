'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { productSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

// In-memory fast TTL Cache for high-performance sub-millisecond responses
const productCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function getCached(key) {
  const entry = productCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    productCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  productCache.set(key, { data, timestamp: Date.now() });
}

export async function invalidateProductCache() {
  productCache.clear();
}

/**
 * Fetch products with optional filtering and sorting
 */
export async function getProducts(options = {}) {
  try {
    const cacheKey = `products:${JSON.stringify(options)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

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

    const result = {
      success: true,
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };

    setCache(cacheKey, result);
    return result;
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
    const cacheKey = `product:slug:${slug}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

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

    const result = { success: true, product };
    setCache(cacheKey, result);
    return result;
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

    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        fabric: validated.fabric,
        work: validated.work,
        color: validated.color,
        price: validated.price,
        originalPrice: validated.originalPrice,
        stock: validated.stock,
        isFeatured: validated.isFeatured || false,
        isActive: validated.isActive ?? true,
        loomTimeDays: validated.loomTimeDays || 21,
        blouseIncluded: validated.blouseIncluded ?? true,
        drapeLength: validated.drapeLength || '5.5 meters',
        primaryImage: validated.images?.[0] || '',
        categoryId: validated.categoryId,
        images: {
          create: (validated.images || []).map((cdnUrl, idx) => ({
            cdnUrl,
            sortOrder: idx,
            isPrimary: idx === 0,
          })),
        },
      },
    });

    invalidateProductCache();
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin-controls/products');

    return { success: true, product };
  } catch (error) {
    console.error('createProduct error:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

/**
 * Admin: Update existing saree product
 */
export async function updateProduct(id, formData) {
  try {
    await requireAdmin();
    const validated = productSchema.parse(formData);

    // Delete existing images and re-create if images array is provided
    if (validated.images && validated.images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        fabric: validated.fabric,
        work: validated.work,
        color: validated.color,
        price: validated.price,
        originalPrice: validated.originalPrice,
        stock: validated.stock,
        isFeatured: validated.isFeatured,
        isActive: validated.isActive,
        loomTimeDays: validated.loomTimeDays,
        blouseIncluded: validated.blouseIncluded,
        drapeLength: validated.drapeLength,
        primaryImage: validated.images?.[0] || undefined,
        categoryId: validated.categoryId,
        images: validated.images
          ? {
              create: validated.images.map((cdnUrl, idx) => ({
                cdnUrl,
                sortOrder: idx,
                isPrimary: idx === 0,
              })),
            }
          : undefined,
      },
    });

    invalidateProductCache();
    revalidatePath('/shop');
    revalidatePath('/');
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
    const product = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
    await prisma.product.delete({ where: { id } });

    invalidateProductCache();
    revalidatePath('/shop');
    revalidatePath('/');
    if (product?.slug) revalidatePath(`/product/${product.slug}`);
    revalidatePath('/admin-controls/products');

    return { success: true };
  } catch (error) {
    console.error('deleteProduct error:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

/**
 * Admin: Toggle Featured status
 */
export async function toggleProductFeatured(id, currentStatus) {
  try {
    await requireAdmin();
    await prisma.product.update({
      where: { id },
      data: { isFeatured: !currentStatus },
    });

    invalidateProductCache();
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin-controls/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update featured status' };
  }
}

/**
 * Admin: Toggle Active/Archived status
 */
export async function toggleProductActive(id, currentStatus) {
  try {
    await requireAdmin();
    await prisma.product.update({
      where: { id },
      data: { isActive: !currentStatus },
    });

    invalidateProductCache();
    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin-controls/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update active status' };
  }
}
