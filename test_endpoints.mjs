import http from 'http';

const BASE_URL = 'http://localhost:3000';

const endpoints = [
  // Public Storefront Pages
  { name: 'Homepage (Hero & Collections)', path: '/', expectedStatus: 200 },
  { name: 'Shop Catalog (All Sarees)', path: '/shop', expectedStatus: 200 },
  { name: 'Shop Filter (Riwaayat-e-Chiffon)', path: '/shop?category=riwaayat-e-chiffon', expectedStatus: 200 },
  { name: 'Shop Filter (Georgette Reet)', path: '/shop?category=georgette-reet', expectedStatus: 200 },
  { name: 'Shop Filter (Silk Noorani)', path: '/shop?category=silk-noorani', expectedStatus: 200 },
  { name: 'Shop Filter (Organza Adaa)', path: '/shop?category=organza-adaa', expectedStatus: 200 },
  { name: 'Shop Filter (Banarasi Virasat)', path: '/shop?category=banarasi-virasat', expectedStatus: 200 },
  { name: 'Shop Sort (Price Low to High)', path: '/shop?sort=price-low', expectedStatus: 200 },
  { name: 'Shop Sort (Price High to Low)', path: '/shop?sort=price-high', expectedStatus: 200 },
  { name: 'Product Detail (Sunset Ombre)', path: '/product/sunset-ombre-chiffon-cutdana-moti-sequin-saree', expectedStatus: 200 },
  { name: 'About & Royal Heritage Page', path: '/about', expectedStatus: 200 },
  { name: 'Contact & Concierge Page', path: '/contact', expectedStatus: 200 },
  { name: 'Patron Account Portal', path: '/account', expectedStatus: 200 },
  { name: 'Checkout Page', path: '/checkout', expectedStatus: 200 },

  // Admin Controls & Atelier Management
  { name: 'Admin Controls Dashboard', path: '/admin-controls', expectedStatus: 200 },
  { name: 'Admin Catalog & Saree CRUD', path: '/admin-controls/products', expectedStatus: 200 },
  { name: 'Admin Order Pipeline & Loom Videos', path: '/admin-controls/orders', expectedStatus: 200 },
  { name: 'Admin Patron Directory', path: '/admin-controls/customers', expectedStatus: 200 },
  { name: 'Admin Concierge Inquiries', path: '/admin-controls/messages', expectedStatus: 200 },

  // API Documentation & Authentication
  { name: 'Interactive Swagger UI', path: '/api-docs', expectedStatus: 200 },
  { name: 'OpenAPI 3.0 JSON Specification', path: '/api/docs/spec', expectedStatus: 200 },
  { name: 'Better Auth Session Endpoint', path: '/api/auth/get-session', expectedStatus: 200 },
];

async function checkEndpoint(ep) {
  const url = `${BASE_URL}${ep.path}`;
  const start = Date.now();

  try {
    const res = await fetch(url);
    const duration = Date.now() - start;
    const isOk = res.status === ep.expectedStatus;

    console.log(
      `${isOk ? '✅' : '❌'} [${res.status}] ${ep.name.padEnd(38)} -> ${ep.path} (${duration}ms)`
    );

    if (!isOk) {
      const text = await res.text();
      console.error(`   Error details: ${text.slice(0, 200)}`);
    }
    return isOk;
  } catch (err) {
    console.error(`❌ [ERR] ${ep.name.padEnd(38)} -> ${err.message}`);
    return false;
  }
}

async function runTests() {
  console.log('========================================================================');
  console.log('🔍 Comprehensive Verification of All Vitasta Endpoints & API Routes');
  console.log('========================================================================\n');

  let passed = 0;
  for (const ep of endpoints) {
    const ok = await checkEndpoint(ep);
    if (ok) passed++;
  }

  console.log('\n========================================================================');
  console.log(`📊 Summary: ${passed}/${endpoints.length} Endpoints Passed`);
  console.log('========================================================================');

  if (passed === endpoints.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
