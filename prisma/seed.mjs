import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('--- Vitasta Atelier Database Seeder ---');

  // 1. Read JSON data files
  const categoriesPath = path.join(__dirname, '..', 'data', 'categories.json');
  const productsPath = path.join(__dirname, '..', 'data', 'products.json');
  const brandPath = path.join(__dirname, '..', 'data', 'brand.json');

  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const brandData = JSON.parse(fs.readFileSync(brandPath, 'utf8'));

  console.log('Cleaning existing catalog & store tables...');
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brandSettings.deleteMany();

  // 2. Seed Brand Settings
  console.log('Seeding Brand Settings...');
  await prisma.brandSettings.create({
    data: {
      id: 'singleton',
      announcementText: 'Royal Heritage Atelier • Complimentary Loom Inspection Video & Sovereign Insured Delivery',
      whatsappSupport: brandData.contact_support.phone,
      emailSupport: brandData.contact_support.email,
      dispatchTimeline: brandData.policies.crafting_and_shipping.timeline || '15–30 Days (Handcrafted)',
      originHub: brandData.origin || 'Jodhpur, Rajasthan, India',
    },
  });

  // 3. Seed Categories
  console.log(`Seeding ${categoriesData.length} Categories...`);
  for (const cat of categoriesData) {
    await prisma.category.create({
      data: {
        id: cat.id,
        slug: cat.id,
        name: cat.name,
        tagline: cat.tagline,
        fabric: cat.fabric,
        description: cat.description,
      },
    });
    console.log(`+ Category: ${cat.name}`);
  }

  // 4. Seed Products
  console.log(`Seeding ${productsData.length} Royal Sarees...`);
  for (const p of productsData) {
    const specs = p.specifications || {};
    const createdProduct = await prisma.product.create({
      data: {
        legacyId: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: Number(p.price),
        currency: p.currency || 'INR',
        categoryId: p.category_id,
        primaryImage: p.primary_image || (p.images && p.images[0] ? p.images[0].cdn_url || p.images[0].asset_path : ''),
        fabric: specs.fabric || 'Pure Premium Silk',
        blouseFabric: specs.blouse_fabric || null,
        work: specs.work || 'Handcrafted Zardozi & Aari Work',
        design: specs.design || null,
        color: specs.color || 'Royal Classic',
        blouseColor: specs.blouse_color || null,
        sareeLength: specs.saree_length || '5.5 Metres',
        blouseLength: specs.blouse_length || '1 Metre',
        materialCare: specs.material_care || 'Dry Clean Only',
        origin: specs.country_of_origin ? `${specs.country_of_origin} (Jodhpur Hub)` : 'Jodhpur, Rajasthan, India',
        stockStatus: 'MADE_TO_ORDER',
        isActive: true,
        isFeatured: true,
        images: {
          create: (p.images || []).map((img, idx) => ({
            assetPath: img.asset_path || img.cdn_url,
            cdnUrl: img.cdn_url || img.asset_path,
            originalFilename: img.original_filename || null,
            isPrimary: Boolean(img.is_primary || idx === 0),
            sortOrder: idx,
          })),
        },
        inventory: {
          create: {
            quantity: 15,
            reservedQuantity: 0,
            lowStockThreshold: 2,
          },
        },
      },
    });
    console.log(`+ Saree [${createdProduct.legacyId}]: ${createdProduct.title.substring(0, 45)}...`);
  }

  console.log('Seeding completed successfully with all 21 sarees!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
