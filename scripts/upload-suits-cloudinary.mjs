import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'sjl1rfvu',
  api_key: process.env.CLOUDINARY_API_KEY || '278911177331486',
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadSuitsToCloudinary() {
  console.log('=== Uploading Suit Images to Cloudinary CDN ===\n');

  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET is missing in environment!');
  }

  const productsPath = path.join(rootDir, 'data', 'products.json');
  let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  const suitProducts = products.filter(p => p.product_type === 'SUIT');
  console.log(`Found ${suitProducts.length} suit products to upload.\n`);

  for (const product of suitProducts) {
    console.log(`Processing: [${product.id}] ${product.title}`);
    const folder = `vitasta/products/${product.slug}`;
    const updatedImages = [];

    for (let i = 0; i < product.images.length; i++) {
      const img = product.images[i];
      let localPath = img.asset_path;

      if (localPath.startsWith('/')) {
        localPath = path.join(rootDir, 'public', localPath.slice(1));
      } else if (!path.isAbsolute(localPath)) {
        localPath = path.join(rootDir, localPath);
      }

      if (!fs.existsSync(localPath)) {
        console.warn(`  ⚠️ File not found locally: ${localPath}`);
        updatedImages.push(img);
        continue;
      }

      console.log(`  Uploading image ${i + 1}/${product.images.length}: ${path.basename(localPath)}...`);
      try {
        const uploadRes = await cloudinary.uploader.upload(localPath, {
          folder,
          use_filename: true,
          unique_filename: true,
          resource_type: 'image',
        });

        const cdnUrl = uploadRes.secure_url;
        console.log(`    ✅ Uploaded: ${cdnUrl}`);

        updatedImages.push({
          original_filename: img.original_filename || path.basename(localPath),
          asset_path: cdnUrl,
          cdn_url: cdnUrl,
          is_primary: Boolean(img.is_primary || i === 0),
        });
      } catch (err) {
        console.error(`    ❌ Upload failed for ${localPath}:`, err.message);
        updatedImages.push(img);
      }
    }

    product.images = updatedImages;
    product.primary_image = updatedImages[0]?.cdn_url || updatedImages[0]?.asset_path || product.primary_image;

    // Update in database
    try {
      const dbProduct = await prisma.product.findUnique({
        where: { slug: product.slug },
      });

      if (dbProduct) {
        // Delete old image records for this product
        await prisma.productImage.deleteMany({
          where: { productId: dbProduct.id },
        });

        // Create new image records with CDN URLs
        await prisma.product.update({
          where: { id: dbProduct.id },
          data: {
            primaryImage: product.primary_image,
            images: {
              create: updatedImages.map((img, idx) => ({
                assetPath: img.cdn_url,
                cdnUrl: img.cdn_url,
                originalFilename: img.original_filename,
                isPrimary: Boolean(img.is_primary || idx === 0),
                sortOrder: idx,
              })),
            },
          },
        });
        console.log(`  ✨ Database updated with Cloudinary CDN URLs for: ${product.slug}\n`);
      }
    } catch (dbErr) {
      console.error(`  ⚠️ DB update error for ${product.slug}:`, dbErr.message);
    }
  }

  // Save data/products.json
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log('✅ data/products.json successfully updated with Cloudinary URLs.');

  // Save data/site_data.json
  const siteDataPath = path.join(rootDir, 'data', 'site_data.json');
  if (fs.existsSync(siteDataPath)) {
    const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
    siteData.products = products;
    fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
    console.log('✅ data/site_data.json successfully updated.');
  }

  console.log('\n🎉 All 16 Suit images are now live on Cloudinary CDN!');
  await prisma.$disconnect();
}

uploadSuitsToCloudinary().catch(err => {
  console.error('Fatal upload error:', err);
  process.exit(1);
});
