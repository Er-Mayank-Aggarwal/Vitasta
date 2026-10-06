import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function updatePrices() {
  console.log('=== Increasing All Product Prices by ₹1000 ===\n');

  // 1. Update data/products.json
  const productsPath = path.join(rootDir, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  console.log('--- Updating data/products.json ---');
  for (const p of products) {
    const oldPrice = p.price;
    const newPrice = oldPrice + 1000;
    p.price = newPrice;
    p.price_formatted = '₹' + newPrice.toLocaleString('en-IN');
    console.log(`[Product ${p.id}] ${p.title.slice(0, 40)}: ₹${oldPrice} -> ₹${newPrice} (${p.price_formatted})`);
  }
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log('✅ data/products.json updated successfully.\n');

  // 2. Update data/site_data.json
  const siteDataPath = path.join(rootDir, 'data', 'site_data.json');
  if (fs.existsSync(siteDataPath)) {
    const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
    if (Array.isArray(siteData.products)) {
      for (const p of siteData.products) {
        const oldPrice = p.price;
        const newPrice = oldPrice + 1000;
        p.price = newPrice;
        p.price_formatted = '₹' + newPrice.toLocaleString('en-IN');
      }
    }
    fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
    console.log('✅ data/site_data.json updated successfully.\n');
  }

  // 3. Update generate_data.py
  const generateDataPath = path.join(rootDir, 'generate_data.py');
  if (fs.existsSync(generateDataPath)) {
    let pyContent = fs.readFileSync(generateDataPath, 'utf8');
    // Regex replace price entries in products_raw
    // "price": 16999,
    // "price_formatted": "₹16,999",
    pyContent = pyContent.replace(/"price":\s*(\d+)/g, (match, priceStr) => {
      const oldVal = parseInt(priceStr, 10);
      const newVal = oldVal + 1000;
      return `"price": ${newVal}`;
    });

    pyContent = pyContent.replace(/"price_formatted":\s*"₹([0-9,]+)"/g, (match, formattedStr) => {
      const numVal = parseInt(formattedStr.replace(/,/g, ''), 10);
      const newVal = numVal + 1000;
      return `"price_formatted": "₹${newVal.toLocaleString('en-IN')}"`;
    });

    fs.writeFileSync(generateDataPath, pyContent, 'utf8');
    console.log('✅ generate_data.py updated successfully.\n');
  }

  // 4. Update Database via Prisma
  try {
    console.log('--- Updating Database via Prisma ---');
    const dbProducts = await prisma.product.findMany();
    console.log(`Found ${dbProducts.length} products in database.`);

    for (const dbP of dbProducts) {
      const oldPrice = Number(dbP.price);
      const newPrice = oldPrice + 1000;
      await prisma.product.update({
        where: { id: dbP.id },
        data: { price: newPrice },
      });
      console.log(`[DB Product ID: ${dbP.id} | Legacy: ${dbP.legacyId}] Updated: ₹${oldPrice} -> ₹${newPrice}`);
    }
    console.log('✅ Database products updated successfully.\n');
  } catch (err) {
    console.error('⚠️ Database update note / error:', err.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('=== All Price Updates Completed Successfully ===');
}

updatePrices().catch((err) => {
  console.error('Fatal error updating prices:', err);
  process.exit(1);
});
