import 'dotenv/config';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('\n========================================================');
  console.log('🏛️  Vitasta Atelier: Database Schema & Seeder Check');
  console.log('========================================================');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('⚠️  DATABASE_URL environment variable is missing. Skipping auto-initialization.');
    return;
  }

  // -------------------------------------------------------------
  // STEP 1: Synchronize / Push Database Schema (Idempotent)
  // -------------------------------------------------------------
  console.log('🔄 Step 1: Checking database schema and ensuring tables exist...');
  try {
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      env: process.env,
    });
    console.log('✅ Step 1: Database schema is synchronized.');
  } catch (err) {
    console.error('❌ Failed to push Prisma schema to database:', err.message);
    throw err;
  }

  // -------------------------------------------------------------
  // STEP 2: Configure Better Auth for User Seeding
  // -------------------------------------------------------------
  const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || 'vitasta-s4r33-at3l13r-auth-s3cr3t-2026-k3y',
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    database: prismaAdapter(prisma, { provider: 'pg' }),
    emailAndPassword: { enabled: true },
    user: {
      additionalFields: {
        phone: { type: 'string', required: false },
        role: { type: 'string', required: false, defaultValue: 'CLIENT' },
        membershipTier: { type: 'string', required: false, defaultValue: 'Royal Patron' },
      },
    },
  });

  // -------------------------------------------------------------
  // STEP 3: Ensure Admin User Exists & Has ADMIN Role
  // -------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@vitasta.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  const adminName = process.env.ADMIN_NAME || 'Smita Saraswat';
  const adminPhone = process.env.ADMIN_PHONE || '+91 88240 17443';

  console.log(`👤 Step 2: Checking Atelier Admin account (${adminEmail})...`);
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    console.log(`   Admin user not found. Auto-creating admin user (${adminEmail})...`);
    try {
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });
      console.log('   Admin credentials registered successfully.');
    } catch (authErr) {
      console.warn('   Note on Better Auth sign-up:', authErr.message || authErr);
    }
  }

  // Ensure Admin role and verified status
  await prisma.user.updateMany({
    where: { email: adminEmail },
    data: {
      role: 'ADMIN',
      membershipTier: 'Atelier Sovereign Founder',
      phone: adminPhone,
      emailVerified: true,
    },
  });
  console.log(`✅ Step 2: Admin user (${adminEmail}) is active with ADMIN role.`);

  // -------------------------------------------------------------
  // STEP 4: Ensure Brand Settings Exist
  // -------------------------------------------------------------
  const brandSettingsCount = await prisma.brandSettings.count();
  if (brandSettingsCount === 0) {
    console.log('⚙️  Step 3: Seeding Brand Settings singleton...');
    const brandPath = path.join(__dirname, '..', 'data', 'brand.json');
    let brandData = {};
    if (fs.existsSync(brandPath)) {
      brandData = JSON.parse(fs.readFileSync(brandPath, 'utf8'));
    }

    await prisma.brandSettings.create({
      data: {
        id: 'singleton',
        announcementText: 'Royal Heritage Atelier • Complimentary Loom Inspection Video & Sovereign Insured Delivery',
        whatsappSupport: brandData.contact_support?.phone || '+91 88240 17443',
        emailSupport: brandData.contact_support?.email || 'vitastabysmita@gmail.com',
        dispatchTimeline: brandData.policies?.crafting_and_shipping?.timeline || '15–30 Days (Handcrafted)',
        originHub: brandData.origin || 'Jodhpur, Rajasthan, India',
      },
    });
    console.log('✅ Brand Settings initialized.');
  } else {
    console.log('✅ Step 3: Brand Settings already present.');
  }

  // -------------------------------------------------------------
  // STEP 5: Ensure Catalog (Categories & Products) Exists
  // -------------------------------------------------------------
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    console.log('📦 Step 4: Catalog empty. Auto-seeding Categories and Products...');
    const categoriesPath = path.join(__dirname, '..', 'data', 'categories.json');
    const productsPath = path.join(__dirname, '..', 'data', 'products.json');

    if (fs.existsSync(categoriesPath) && fs.existsSync(productsPath)) {
      const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

      // Seed categories
      for (const cat of categoriesData) {
        await prisma.category.upsert({
          where: { id: cat.id },
          update: {},
          create: {
            id: cat.id,
            slug: cat.id,
            name: cat.name,
            tagline: cat.tagline,
            fabric: cat.fabric,
            description: cat.description,
          },
        });
      }
      console.log(`   + Seeded ${categoriesData.length} Categories.`);

      // Seed products
      for (const p of productsData) {
        const specs = p.specifications || {};
        await prisma.product.create({
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
      }
      console.log(`   + Seeded ${productsData.length} Luxury Sarees.`);
    }
    console.log('✅ Step 4: Catalog auto-seeding completed.');
  } else {
    console.log(`✅ Step 4: Catalog already populated (${categoryCount} categories found).`);
  }

  // -------------------------------------------------------------
  // STEP 6: Ensure Default Coupons Exist
  // -------------------------------------------------------------
  const couponCount = await prisma.coupon.count();
  if (couponCount === 0) {
    console.log('🏷️  Step 5: Seeding welcome coupons...');
    await prisma.coupon.createMany({
      data: [
        { code: 'ROYAL10', discountType: 'PERCENTAGE', value: 10, minimumOrder: 5000, maximumDiscount: 5000, isActive: true },
        { code: 'ATELIERWELCOME', discountType: 'PERCENTAGE', value: 15, minimumOrder: 10000, maximumDiscount: 10000, isActive: true },
        { code: 'VIRASAT2000', discountType: 'FIXED', value: 2000, minimumOrder: 25000, isActive: true },
      ],
      skipDuplicates: true,
    });
    console.log('✅ Step 5: Default coupons initialized.');
  } else {
    console.log('✅ Step 5: Coupons already present.');
  }

  console.log('✨ All database checks and initializations completed successfully.\n');
}

initDatabase()
  .catch((err) => {
    console.error('❌ Database auto-initialization encountered an error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
