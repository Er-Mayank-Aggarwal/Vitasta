import { prisma } from '../lib/prisma.js';

async function migrate() {
  console.log('--- Applying Suit Columns Migration ---');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE vitasta."Category" ADD COLUMN IF NOT EXISTS "type" TEXT DEFAULT 'saree';
    ALTER TABLE vitasta."Product" ADD COLUMN IF NOT EXISTS "productType" TEXT DEFAULT 'SAREE';
    ALTER TABLE vitasta."Product" ADD COLUMN IF NOT EXISTS "bottomFabric" TEXT;
    ALTER TABLE vitasta."Product" ADD COLUMN IF NOT EXISTS "bottomWork" TEXT;
    ALTER TABLE vitasta."Product" ADD COLUMN IF NOT EXISTS "dupattaFabric" TEXT;
    ALTER TABLE vitasta."Product" ADD COLUMN IF NOT EXISTS "dupattaWork" TEXT;
    ALTER TABLE vitasta."Product" ADD COLUMN IF NOT EXISTS "setIncludes" TEXT;
    ALTER TABLE vitasta."Product" ADD COLUMN IF NOT EXISTS "occasion" TEXT;
  `);
  console.log('✅ Columns added/verified successfully!');
  await prisma.$disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
