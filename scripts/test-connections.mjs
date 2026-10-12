import { prisma } from '../lib/prisma.js';
import { v2 as cloudinary } from 'cloudinary';
import Razorpay from 'razorpay';

const results = [];

function recordResult(service, status, details, latencyMs = null) {
  results.push({ service, status, details, latencyMs });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️ ' : '❌';
  const timing = latencyMs !== null ? ` (${latencyMs}ms)` : '';
  console.log(`${icon} [${status}] ${service}${timing}: ${details}`);
}

async function testDatabase() {
  console.log('\n--- 1. Testing Neon PostgreSQL Database Connection ---');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    recordResult('Database (Neon PostgreSQL)', 'FAIL', 'DATABASE_URL environment variable is missing.');
    return;
  }

  try {
    let cleanUrl = dbUrl;
    if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
      cleanUrl = cleanUrl.slice(1, -1);
    }
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname;
    const dbName = parsed.pathname.replace(/^\//, '');
    const schema = parsed.searchParams.get('schema') || 'public';
    console.log(`   Host: ${host} | Database: ${dbName} | Target Schema: ${schema}`);

    const start = performance.now();
    const rawResult = await prisma.$queryRaw`SELECT 1::int as connected, current_database()::text as db, current_schema()::text as schema`;
    const latency = Math.round(performance.now() - start);

    if (rawResult && rawResult.length > 0) {
      const [productCount, userCount, orderCount, categoryCount, couponCount] = await Promise.all([
        prisma.product.count().catch(e => `Error: ${e.message}`),
        prisma.user.count().catch(e => `Error: ${e.message}`),
        prisma.order.count().catch(e => `Error: ${e.message}`),
        prisma.category.count().catch(e => `Error: ${e.message}`),
        prisma.coupon.count().catch(e => `Error: ${e.message}`),
      ]);

      const countsSummary = `Products: ${productCount}, Users: ${userCount}, Orders: ${orderCount}, Categories: ${categoryCount}, Coupons: ${couponCount}`;
      recordResult(
        'Database (Neon PostgreSQL)',
        'PASS',
        `Connected & authenticated. Active DB: "${rawResult[0].db}", Schema: "${rawResult[0].schema}". Table records: [${countsSummary}]`,
        latency
      );
    } else {
      recordResult('Database (Neon PostgreSQL)', 'FAIL', 'Query executed but returned empty response.', latency);
    }
  } catch (err) {
    recordResult('Database (Neon PostgreSQL)', 'FAIL', `Connection failed: ${err.message}`);
  }
}

async function testCloudinary() {
  console.log('\n--- 2. Testing Cloudinary CDN Connection ---');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    const missing = [
      !cloudName && 'CLOUDINARY_CLOUD_NAME',
      !apiKey && 'CLOUDINARY_API_KEY',
      !apiSecret && 'CLOUDINARY_API_SECRET'
    ].filter(Boolean).join(', ');
    recordResult('Cloudinary CDN', 'FAIL', `Missing credentials: ${missing}`);
    return;
  }

  if (cloudName.startsWith('napi_')) {
    recordResult(
      'Cloudinary CDN',
      'FAIL',
      `CLOUDINARY_CLOUD_NAME starts with "napi_". This is a Neon API Key, NOT a Cloudinary Cloud Name. Please provide your real Cloudinary Cloud Name.`
    );
    return;
  }

  if (cloudName.includes('YOUR_') || apiKey.includes('YOUR_') || apiSecret.includes('YOUR_')) {
    recordResult('Cloudinary CDN', 'WARN', 'Cloudinary contains placeholder template values (YOUR_CLOUDINARY_...).');
    return;
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const start = performance.now();
    const pingRes = await cloudinary.api.ping();
    const latency = Math.round(performance.now() - start);

    if (pingRes?.status === 'ok') {
      recordResult(
        'Cloudinary CDN',
        'PASS',
        `Authenticated and healthy for cloud "${cloudName}" (status: ok).`,
        latency
      );
    } else {
      recordResult('Cloudinary CDN', 'WARN', `Ping response: ${JSON.stringify(pingRes)}`, latency);
    }
  } catch (err) {
    const msg = err.error?.message || err.message || JSON.stringify(err);
    recordResult('Cloudinary CDN', 'FAIL', `Authentication failed: ${msg}`);
  }
}

async function testRazorpay() {
  console.log('\n--- 3. Testing Razorpay Payment Gateway ---');
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  if (!keyId || !keySecret) {
    recordResult('Razorpay Gateway', 'WARN', 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not defined in .env.');
    return;
  }

  if (keyId.includes('YOUR_') || keySecret.includes('YOUR_') || keyId === 'rzp_test_VitastaDemoKey') {
    recordResult('Razorpay Gateway', 'WARN', `Configured with placeholder/demo credentials (${keyId}). Mock checkout is enabled.`);
    return;
  }

  try {
    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const start = performance.now();
    const response = await rzp.orders.all({ count: 1 });
    const latency = Math.round(performance.now() - start);

    if (response && response.items !== undefined) {
      const matchPublic = publicKeyId === keyId ? 'matches NEXT_PUBLIC_RAZORPAY_KEY_ID' : '⚠️ MISMATCH with NEXT_PUBLIC_RAZORPAY_KEY_ID';
      recordResult(
        'Razorpay Gateway',
        'PASS',
        `Live API credentials authenticated successfully (Key: ${keyId.slice(0, 10)}..., ${matchPublic}).`,
        latency
      );
    } else {
      recordResult('Razorpay Gateway', 'WARN', `Unexpected API response format: ${JSON.stringify(response)}`, latency);
    }
  } catch (err) {
    const desc = err.error?.description || err.message || 'Authentication failed';
    recordResult('Razorpay Gateway', 'FAIL', `Authentication failed: ${desc}. Verify key ID and key secret match.`);
  }
}

async function testBetterAuth() {
  console.log('\n--- 4. Testing Better Auth & App URLs ---');
  const secret = process.env.BETTER_AUTH_SECRET;
  const authUrl = process.env.BETTER_AUTH_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  let authOk = true;
  const notes = [];

  if (!secret) {
    notes.push('BETTER_AUTH_SECRET is not set');
    authOk = false;
  } else if (secret.length < 32) {
    notes.push(`BETTER_AUTH_SECRET is short (${secret.length} chars, recommended >= 32)`);
  } else if (secret.includes('YOUR_GENERATED')) {
    notes.push('BETTER_AUTH_SECRET has placeholder value');
    authOk = false;
  }

  if (!authUrl) {
    notes.push('BETTER_AUTH_URL not set');
  }
  if (!appUrl) {
    notes.push('NEXT_PUBLIC_APP_URL not set');
  }

  if (authOk) {
    recordResult('Better Auth & URLs', 'PASS', `App URL: ${appUrl || authUrl || 'default'} | Secret length: ${secret?.length || 0} chars.`);
  } else {
    recordResult('Better Auth & URLs', 'WARN', notes.join('; '));
  }
}

async function testGoogleOAuth() {
  console.log('\n--- 5. Testing Google OAuth 2.0 Credentials ---');
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    recordResult('Google OAuth', 'WARN', 'GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not provided.');
    return;
  }

  if (clientId.includes('YOUR_') || clientSecret.includes('YOUR_')) {
    recordResult('Google OAuth', 'WARN', 'Contains placeholder template values (YOUR_GOOGLE_CLIENT_...).');
    return;
  }

  const isGoogleFmt = clientId.endsWith('.apps.googleusercontent.com');
  const fmtNote = isGoogleFmt ? 'Valid Google client ID format' : 'Client ID does not end with .apps.googleusercontent.com';

  try {
    const start = performance.now();
    const res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
    const latency = Math.round(performance.now() - start);

    if (res.ok) {
      recordResult('Google OAuth', 'PASS', `${fmtNote}. Google OpenID endpoint reachable.`, latency);
    } else {
      recordResult('Google OAuth', 'WARN', `Google endpoint status: ${res.status}`, latency);
    }
  } catch (err) {
    recordResult('Google OAuth', 'WARN', `Cannot reach Google OpenID endpoint: ${err.message}`);
  }
}

async function main() {
  console.log('========================================================================');
  console.log('🔍 Vitasta Atelier - Comprehensive Environment & Connection Test');
  console.log('========================================================================');
  console.log(`Node.js Version: ${process.version}`);
  console.log(`Environment file: .env\n`);

  await testDatabase();
  await testCloudinary();
  await testRazorpay();
  await testBetterAuth();
  await testGoogleOAuth();

  console.log('\n========================================================================');
  console.log('📊 Environment Verification Summary');
  console.log('========================================================================');
  const passCount = results.filter(r => r.status === 'PASS').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;

  console.log(`Passed: ${passCount} | Warnings: ${warnCount} | Failed: ${failCount}\n`);

  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'WARN' ? '⚠️ ' : '❌';
    console.log(`${icon} ${r.service}: ${r.status}`);
  }
  console.log('========================================================================\n');

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Fatal error during connection test:', err);
  process.exit(1);
});
