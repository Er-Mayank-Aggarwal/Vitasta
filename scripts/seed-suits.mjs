import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const suitCategories = [
  {
    id: "modal-bandhej-suits",
    name: "Modal Bandhej Zari Suits",
    slug: "modal-bandhej-suits",
    fabric: "Pure Modal & Bandhani",
    tagline: "Intricate Zari Weaving & Traditional Bandhej",
    description: "Exquisite unstitched 3-piece luxury suit sets crafted in pure Modal fabric, adorned with intricate Zari weaving, traditional Bandhani bottoms, and opulent Bandhej dupattas with rich zari borders.",
    type: "suit"
  },
  {
    id: "cotton-bandhej-cutwork-suits",
    name: "Cotton Bandhej Cutwork Suits",
    slug: "cotton-bandhej-cutwork-suits",
    fabric: "Pure Cotton & Chiffon",
    tagline: "Artisanal Cutwork & Handcrafted Bandhani",
    description: "Graceful unstitched 3-piece kurta sets crafted in breathable pure cotton with fine cutwork embroidery, paired with traditional Bandhani bottoms and pure chiffon Bandhej dupattas.",
    type: "suit"
  }
];

const newSuitProducts = [
  {
    id: 22,
    slug: "modal-bandhej-zari-unstitched-suit-set-classic-red",
    title: "Modal Bandhej Zari Unstitched Suit Set – Classic Red",
    price: 3999,
    currency: "INR",
    price_formatted: "₹3,999",
    category_id: "modal-bandhej-suits",
    category_name: "Modal Bandhej Zari Suits",
    product_type: "SUIT",
    description: "An exquisite unstitched 3-piece luxury suit set crafted in pure Modal fabric in a vibrant Classic Red hue. The kurta is adorned with intricate Zari weaving, paired with a matching pure Modal bottom featuring traditional Bandhani patterns. The ensemble is completed with an opulent Modal dupatta highlighted by authentic Bandhej motifs and a rich Zari border.\n\nPerfect for festive celebrations, traditional ceremonies, weddings, and special occasions.",
    specifications: {
      product_category: "Unstitched 3-Piece Suit Set",
      fabric: "Pure Modal",
      kurta_work: "Intricate Zari Weaving",
      bottom_fabric: "Pure Modal",
      bottom_work: "Traditional Bandhani",
      dupatta_fabric: "Pure Modal",
      dupatta_work: "Bandhej with Zari Border",
      color: "Classic Red",
      set_includes: "Kurta Fabric, Bottom Fabric & Dupatta",
      occasion: "Festive, Traditional & Occasion Wear",
      material_care: "Dry Clean Recommended (to preserve delicate Bandhej patterns & zari weaving)",
      country_of_origin: "India (Jodhpur Hub)"
    },
    images: [
      {
        original_filename: "modal-red-1.jpg",
        asset_path: "/images/suits/modal-red-1.jpg",
        cdn_url: "/images/suits/modal-red-1.jpg",
        is_primary: true
      },
      {
        original_filename: "modal-red-2.jpg",
        asset_path: "/images/suits/modal-red-2.jpg",
        cdn_url: "/images/suits/modal-red-2.jpg",
        is_primary: false
      }
    ],
    primary_image: "/images/suits/modal-red-1.jpg"
  },
  {
    id: 23,
    slug: "modal-bandhej-zari-unstitched-suit-set-royal-blue",
    title: "Modal Bandhej Zari Unstitched Suit Set – Royal Blue",
    price: 3999,
    currency: "INR",
    price_formatted: "₹3,999",
    category_id: "modal-bandhej-suits",
    category_name: "Modal Bandhej Zari Suits",
    product_type: "SUIT",
    description: "A regal unstitched 3-piece suit set in deep Royal Blue, crafted in pure Modal fabric. Highlights include fine Zari weaving across the kurta fabric, coordinating Modal bottom featuring traditional Bandhani, and a graceful Modal dupatta with artisan Bandhej work and shimmering Zari borders.\n\nIdeal for festive gatherings, evening celebrations, and royal heritage occasions.",
    specifications: {
      product_category: "Unstitched 3-Piece Suit Set",
      fabric: "Pure Modal",
      kurta_work: "Intricate Zari Weaving",
      bottom_fabric: "Pure Modal",
      bottom_work: "Traditional Bandhani",
      dupatta_fabric: "Pure Modal",
      dupatta_work: "Bandhej with Zari Border",
      color: "Royal Blue",
      set_includes: "Kurta Fabric, Bottom Fabric & Dupatta",
      occasion: "Festive, Traditional & Occasion Wear",
      material_care: "Dry Clean Recommended (to preserve delicate Bandhej patterns & zari weaving)",
      country_of_origin: "India (Jodhpur Hub)"
    },
    images: [
      {
        original_filename: "modal-blue-1.jpg",
        asset_path: "/images/suits/modal-blue-1.jpg",
        cdn_url: "/images/suits/modal-blue-1.jpg",
        is_primary: true
      },
      {
        original_filename: "modal-blue-2.jpg",
        asset_path: "/images/suits/modal-blue-2.jpg",
        cdn_url: "/images/suits/modal-blue-2.jpg",
        is_primary: false
      }
    ],
    primary_image: "/images/suits/modal-blue-1.jpg"
  },
  {
    id: 24,
    slug: "modal-bandhej-zari-unstitched-suit-set-emerald-green",
    title: "Modal Bandhej Zari Unstitched Suit Set – Emerald Green",
    price: 3999,
    currency: "INR",
    price_formatted: "₹3,999",
    category_id: "modal-bandhej-suits",
    category_name: "Modal Bandhej Zari Suits",
    product_type: "SUIT",
    description: "A stunning Emerald Green unstitched 3-piece suit set crafted in pure Modal fabric. The kurta fabric features delicate all-over Zari weaving, accompanied by a pure Modal bottom adorned with traditional hand-tied Bandhani, and a statement Modal dupatta with rich Bandhej craftsmanship and finished Zari borders.\n\nPerfect for poojas, festive occasions, weddings, and traditional celebrations.",
    specifications: {
      product_category: "Unstitched 3-Piece Suit Set",
      fabric: "Pure Modal",
      kurta_work: "Intricate Zari Weaving",
      bottom_fabric: "Pure Modal",
      bottom_work: "Traditional Bandhani",
      dupatta_fabric: "Pure Modal",
      dupatta_work: "Bandhej with Zari Border",
      color: "Emerald Green",
      set_includes: "Kurta Fabric, Bottom Fabric & Dupatta",
      occasion: "Festive, Traditional & Occasion Wear",
      material_care: "Dry Clean Recommended (to preserve delicate Bandhej patterns & zari weaving)",
      country_of_origin: "India (Jodhpur Hub)"
    },
    images: [
      {
        original_filename: "modal-green-1.jpg",
        asset_path: "/images/suits/modal-green-1.jpg",
        cdn_url: "/images/suits/modal-green-1.jpg",
        is_primary: true
      },
      {
        original_filename: "modal-green-2.jpg",
        asset_path: "/images/suits/modal-green-2.jpg",
        cdn_url: "/images/suits/modal-green-2.jpg",
        is_primary: false
      }
    ],
    primary_image: "/images/suits/modal-green-1.jpg"
  },
  {
    id: 25,
    slug: "pure-cotton-bandhej-cutwork-unstitched-suit-powder-blue",
    title: "Pure Cotton Bandhej Cutwork Unstitched 3 Piece Kurta Set – Powder Blue",
    price: 2499,
    currency: "INR",
    price_formatted: "₹2,499",
    category_id: "cotton-bandhej-cutwork-suits",
    category_name: "Cotton Bandhej Cutwork Suits",
    product_type: "SUIT",
    description: "A refreshing Powder Blue 3-piece unstitched kurta set crafted in pure breathable cotton. Features delicate artisan cutwork embroidery on the kurta, paired with pure cotton Bandhani bottom fabric, and a feather-light pure chiffon dupatta with authentic Bandhej motifs.\n\nEffortlessly chic and comfortable for casual wear, summer festivities, and intimate day gatherings.",
    specifications: {
      product_category: "3-Piece Suit Set",
      fabric: "Pure Cotton",
      kurta_work: "Artisanal Cutwork",
      bottom_fabric: "Pure Cotton",
      bottom_work: "Traditional Bandhani",
      dupatta_fabric: "Pure Chiffon",
      dupatta_work: "Handcrafted Bandhej",
      color: "Powder Blue",
      set_includes: "Kurta, Pant & Dupatta",
      occasion: "Casual, Festive & Traditional Wear",
      material_care: "Dry Clean or Gentle Hand Wash Recommended",
      country_of_origin: "India (Jodhpur Hub)"
    },
    images: [
      {
        original_filename: "cotton-powder-blue-1.jpg",
        asset_path: "/images/suits/cotton-powder-blue-1.jpg",
        cdn_url: "/images/suits/cotton-powder-blue-1.jpg",
        is_primary: true
      },
      {
        original_filename: "cotton-powder-blue-2.jpg",
        asset_path: "/images/suits/cotton-powder-blue-2.jpg",
        cdn_url: "/images/suits/cotton-powder-blue-2.jpg",
        is_primary: false
      }
    ],
    primary_image: "/images/suits/cotton-powder-blue-1.jpg"
  },
  {
    id: 26,
    slug: "pure-cotton-bandhej-cutwork-unstitched-suit-coral-red",
    title: "Pure Cotton Bandhej Cutwork Unstitched 3 Piece Kurta Set – Coral Red",
    price: 2499,
    currency: "INR",
    price_formatted: "₹2,499",
    category_id: "cotton-bandhej-cutwork-suits",
    category_name: "Cotton Bandhej Cutwork Suits",
    product_type: "SUIT",
    description: "An energetic Coral Red unstitched 3-piece kurta set crafted in pure cotton. Features intricate cutwork detailing across the kurta fabric, matched with authentic pure cotton Bandhani pant fabric, and an airy pure chiffon dupatta with delicate Bandhej.\n\nA perfect blend of Rajasthani heritage craft and modern comfortable silhouettes.",
    specifications: {
      product_category: "3-Piece Suit Set",
      fabric: "Pure Cotton",
      kurta_work: "Artisanal Cutwork",
      bottom_fabric: "Pure Cotton",
      bottom_work: "Traditional Bandhani",
      dupatta_fabric: "Pure Chiffon",
      dupatta_work: "Handcrafted Bandhej",
      color: "Coral Red",
      set_includes: "Kurta, Pant & Dupatta",
      occasion: "Casual, Festive & Traditional Wear",
      material_care: "Dry Clean or Gentle Hand Wash Recommended",
      country_of_origin: "India (Jodhpur Hub)"
    },
    images: [
      {
        original_filename: "cotton-coral-red-1.jpg",
        asset_path: "/images/suits/cotton-coral-red-1.jpg",
        cdn_url: "/images/suits/cotton-coral-red-1.jpg",
        is_primary: true
      },
      {
        original_filename: "cotton-coral-red-2.jpg",
        asset_path: "/images/suits/cotton-coral-red-2.jpg",
        cdn_url: "/images/suits/cotton-coral-red-2.jpg",
        is_primary: false
      }
    ],
    primary_image: "/images/suits/cotton-coral-red-1.jpg"
  },
  {
    id: 27,
    slug: "pure-cotton-bandhej-cutwork-unstitched-suit-sunshine-yellow",
    title: "Pure Cotton Bandhej Cutwork Unstitched 3 Piece Kurta Set – Sunshine Yellow",
    price: 2499,
    currency: "INR",
    price_formatted: "₹2,499",
    category_id: "cotton-bandhej-cutwork-suits",
    category_name: "Cotton Bandhej Cutwork Suits",
    product_type: "SUIT",
    description: "A radiant Sunshine Yellow unstitched 3-piece kurta set in pure cotton. Designed with fine cutwork embroidery on the kurta, paired with pure cotton Bandhani bottom fabric and a pure chiffon Bandhej dupatta that adds an airy, joyful drape.\n\nIdeal for Haldi functions, festive pujas, and bright daytime celebrations.",
    specifications: {
      product_category: "3-Piece Suit Set",
      fabric: "Pure Cotton",
      kurta_work: "Artisanal Cutwork",
      bottom_fabric: "Pure Cotton",
      bottom_work: "Traditional Bandhani",
      dupatta_fabric: "Pure Chiffon",
      dupatta_work: "Handcrafted Bandhej",
      color: "Sunshine Yellow",
      set_includes: "Kurta, Pant & Dupatta",
      occasion: "Casual, Festive & Traditional Wear",
      material_care: "Dry Clean or Gentle Hand Wash Recommended",
      country_of_origin: "India (Jodhpur Hub)"
    },
    images: [
      {
        original_filename: "cotton-sunshine-yellow-1.jpg",
        asset_path: "/images/suits/cotton-sunshine-yellow-1.jpg",
        cdn_url: "/images/suits/cotton-sunshine-yellow-1.jpg",
        is_primary: true
      },
      {
        original_filename: "cotton-sunshine-yellow-2.jpg",
        asset_path: "/images/suits/cotton-sunshine-yellow-2.jpg",
        cdn_url: "/images/suits/cotton-sunshine-yellow-2.jpg",
        is_primary: false
      }
    ],
    primary_image: "/images/suits/cotton-sunshine-yellow-1.jpg"
  },
  {
    id: 28,
    slug: "pure-cotton-bandhej-cutwork-unstitched-suit-blush-pink",
    title: "Pure Cotton Bandhej Cutwork Unstitched 3 Piece Kurta Set – Blush Pink",
    price: 2499,
    currency: "INR",
    price_formatted: "₹2,499",
    category_id: "cotton-bandhej-cutwork-suits",
    category_name: "Cotton Bandhej Cutwork Suits",
    product_type: "SUIT",
    description: "A subtle and elegant Blush Pink 3-piece unstitched kurta set in pure cotton. Features delicate cutwork detailing on the kurta fabric, complemented by pure cotton Bandhani bottom fabric and an ethereal pure chiffon Bandhej dupatta.\n\nGraceful, feminine, and versatile for work wear, intimate family get-togethers, and festivities.",
    specifications: {
      product_category: "3-Piece Suit Set",
      fabric: "Pure Cotton",
      kurta_work: "Artisanal Cutwork",
      bottom_fabric: "Pure Cotton",
      bottom_work: "Traditional Bandhani",
      dupatta_fabric: "Pure Chiffon",
      dupatta_work: "Handcrafted Bandhej",
      color: "Blush Pink",
      set_includes: "Kurta, Pant & Dupatta",
      occasion: "Casual, Festive & Traditional Wear",
      material_care: "Dry Clean or Gentle Hand Wash Recommended",
      country_of_origin: "India (Jodhpur Hub)"
    },
    images: [
      {
        original_filename: "cotton-blush-pink-1.jpg",
        asset_path: "/images/suits/cotton-blush-pink-1.jpg",
        cdn_url: "/images/suits/cotton-blush-pink-1.jpg",
        is_primary: true
      },
      {
        original_filename: "cotton-blush-pink-2.jpg",
        asset_path: "/images/suits/cotton-blush-pink-2.jpg",
        cdn_url: "/images/suits/cotton-blush-pink-2.jpg",
        is_primary: false
      }
    ],
    primary_image: "/images/suits/cotton-blush-pink-1.jpg"
  },
  {
    id: 29,
    slug: "pure-cotton-bandhej-cutwork-unstitched-suit-rose-pink",
    title: "Pure Cotton Bandhej Cutwork Unstitched 3 Piece Kurta Set – Rose Pink",
    price: 2499,
    currency: "INR",
    price_formatted: "₹2,499",
    category_id: "cotton-bandhej-cutwork-suits",
    category_name: "Cotton Bandhej Cutwork Suits",
    product_type: "SUIT",
    description: "A rich Rose Pink unstitched 3-piece kurta set in pure premium cotton. Featuring fine handcrafted cutwork across the kurta, accompanied by pure cotton Bandhani pant fabric and a lightweight pure chiffon Bandhej dupatta.\n\nSophisticated and lively, ideal for festivals, temple visits, and celebratory gatherings.",
    specifications: {
      product_category: "3-Piece Suit Set",
      fabric: "Pure Cotton",
      kurta_work: "Artisanal Cutwork",
      bottom_fabric: "Pure Cotton",
      bottom_work: "Traditional Bandhani",
      dupatta_fabric: "Pure Chiffon",
      dupatta_work: "Handcrafted Bandhej",
      color: "Rose Pink",
      set_includes: "Kurta, Pant & Dupatta",
      occasion: "Casual, Festive & Traditional Wear",
      material_care: "Dry Clean or Gentle Hand Wash Recommended",
      country_of_origin: "India (Jodhpur Hub)"
    },
    images: [
      {
        original_filename: "cotton-rose-pink-1.jpg",
        asset_path: "/images/suits/cotton-rose-pink-1.jpg",
        cdn_url: "/images/suits/cotton-rose-pink-1.jpg",
        is_primary: true
      },
      {
        original_filename: "cotton-rose-pink-2.jpg",
        asset_path: "/images/suits/cotton-rose-pink-2.jpg",
        cdn_url: "/images/suits/cotton-rose-pink-2.jpg",
        is_primary: false
      }
    ],
    primary_image: "/images/suits/cotton-rose-pink-1.jpg"
  }
];

async function seedSuits() {
  console.log('=== Seeding Suit Categories and Products ===\n');

  // 1. Update data/products.json
  const productsPath = path.join(rootDir, 'data', 'products.json');
  let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  for (const newP of newSuitProducts) {
    const existingIdx = products.findIndex(p => p.slug === newP.slug || p.id === newP.id);
    if (existingIdx >= 0) {
      products[existingIdx] = newP;
    } else {
      products.push(newP);
    }
  }
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`✅ data/products.json updated (${products.length} total products).`);

  // 2. Update data/site_data.json
  const siteDataPath = path.join(rootDir, 'data', 'site_data.json');
  if (fs.existsSync(siteDataPath)) {
    const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
    siteData.products = products;
    fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
    console.log(`✅ data/site_data.json updated.`);
  }

  // 3. Upsert Categories into Prisma Database
  console.log('\n--- Upserting Categories in Database ---');
  for (const cat of suitCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug: cat.slug,
        fabric: cat.fabric,
        tagline: cat.tagline,
        description: cat.description,
        type: cat.type,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        fabric: cat.fabric,
        tagline: cat.tagline,
        description: cat.description,
        type: cat.type,
      },
    });
    console.log(`   + Category: ${cat.name} (${cat.id})`);
  }

  // 4. Upsert Products into Database
  console.log('\n--- Upserting 8 Suit Products in Database ---');
  for (const p of newSuitProducts) {
    const specs = p.specifications || {};
    
    // Check if product exists by slug
    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
      include: { images: true }
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          title: p.title,
          description: p.description,
          price: Number(p.price),
          categoryId: p.category_id,
          primaryImage: p.primary_image,
          fabric: specs.fabric,
          work: specs.kurta_work || 'Artisanal Cutwork & Handcrafted Bandhani',
          color: specs.color,
          productType: 'SUIT',
          bottomFabric: specs.bottom_fabric,
          bottomWork: specs.bottom_work,
          dupattaFabric: specs.dupatta_fabric,
          dupattaWork: specs.dupatta_work,
          setIncludes: specs.set_includes,
          occasion: specs.occasion,
          materialCare: specs.material_care,
          origin: specs.country_of_origin,
        }
      });
      console.log(`   + Updated existing product: ${p.title}`);
    } else {
      await prisma.product.create({
        data: {
          legacyId: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          price: Number(p.price),
          currency: 'INR',
          categoryId: p.category_id,
          primaryImage: p.primary_image,
          fabric: specs.fabric,
          work: specs.kurta_work || 'Artisanal Cutwork & Handcrafted Bandhani',
          color: specs.color,
          productType: 'SUIT',
          bottomFabric: specs.bottom_fabric,
          bottomWork: specs.bottom_work,
          dupattaFabric: specs.dupatta_fabric,
          dupattaWork: specs.dupatta_work,
          setIncludes: specs.set_includes,
          occasion: specs.occasion,
          materialCare: specs.material_care,
          origin: specs.country_of_origin,
          stockStatus: 'MADE_TO_ORDER',
          isActive: true,
          isFeatured: true,
          images: {
            create: p.images.map((img, idx) => ({
              assetPath: img.asset_path,
              cdnUrl: img.cdn_url,
              originalFilename: img.original_filename,
              isPrimary: Boolean(img.is_primary || idx === 0),
              sortOrder: idx,
            })),
          },
          inventory: {
            create: {
              quantity: 20,
              reservedQuantity: 0,
              lowStockThreshold: 2,
            },
          },
        },
      });
      console.log(`   + Created new product: ${p.title}`);
    }
  }

  const totalDbCount = await prisma.product.count();
  console.log(`\n🎉 Success! Total products now in database: ${totalDbCount}`);
  await prisma.$disconnect();
}

seedSuits().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
