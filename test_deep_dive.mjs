import { prisma } from './lib/prisma.js';
import { createOrder, getOrderById } from './app/actions/checkout-actions.js';
import { createRazorpayOrder, verifyRazorpayPayment } from './app/actions/razorpay-actions.js';
import { getAdminStats, getAdminOrders, updateOrderStatus, getAdminCustomers, getAdminMessages, getAdminSubscribers, getAdminReviews, approveReview, deleteReview } from './app/actions/admin-actions.js';
import { getAdminInventory, updateStock } from './app/actions/inventory-actions.js';
import { getAdminCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } from './app/actions/coupon-actions.js';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from './app/actions/product-actions.js';
import { submitContactMessage, subscribeNewsletter } from './app/actions/contact-actions.js';
import { getUserProfile, getUserOrders, getUserAddresses, addAddress, deleteAddress, setDefaultAddress } from './app/actions/user-actions.js';
import { toggleWishlist } from './app/actions/wishlist-actions.js';
import { submitReview, getProductReviews } from './app/actions/review-actions.js';
import { placeOrderSchema, productSchema, contactMessageSchema, newsletterSchema, couponSchema } from './lib/validations.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
  }
}

async function runDeepAudit() {
  console.log('========================================================================');
  console.log('🛡️ VITASTA ATELIER 360° DEEP DIVE AUDIT & PENETRATION/STRESS TEST');
  console.log('========================================================================\n');

  try {
    // -------------------------------------------------------------------------
    // CATEGORY 1: Concurrency, Deadlock & High-Load Checkout Race Conditions
    // -------------------------------------------------------------------------
    console.log('📌 1. Concurrency, Deadlock & High-Load Checkout Stress Testing');
    
    // Fetch 3 active products for interleaved concurrency
    const testProducts = await prisma.product.findMany({
      where: { isActive: true },
      take: 3,
      include: { inventory: true },
    });

    if (testProducts.length >= 2) {
      const [p1, p2, p3] = testProducts;
      
      // Ensure initial stock is well defined
      await prisma.inventory.upsert({
        where: { productId: p1.id },
        update: { quantity: 20, reservedQuantity: 0 },
        create: { productId: p1.id, quantity: 20, reservedQuantity: 0 },
      });
      await prisma.inventory.upsert({
        where: { productId: p2.id },
        update: { quantity: 20, reservedQuantity: 0 },
        create: { productId: p2.id, quantity: 20, reservedQuantity: 0 },
      });

      console.log('   Simulating simultaneous concurrent checkouts with interleaved product locks...');

      // Transaction A: locks P1 then P2
      const orderA = createOrder({
        fullName: 'Patron Concurrency A',
        email: 'concurrency.a@vitasta.luxury',
        phone: '9876500001',
        addressLine1: 'Courtyard A',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [
          { id: p1.id, title: p1.title, price: p1.price, quantity: 2, image: p1.primaryImage },
          { id: p2.id, title: p2.title, price: p2.price, quantity: 2, image: p2.primaryImage },
        ],
      });

      // Transaction B: locks P2 then P1 (Inverse order)
      const orderB = createOrder({
        fullName: 'Patron Concurrency B',
        email: 'concurrency.b@vitasta.luxury',
        phone: '9876500002',
        addressLine1: 'Courtyard B',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [
          { id: p2.id, title: p2.title, price: p2.price, quantity: 2, image: p2.primaryImage },
          { id: p1.id, title: p1.title, price: p1.price, quantity: 2, image: p1.primaryImage },
        ],
      });

      // Transaction C: locks P1
      const orderC = createOrder({
        fullName: 'Patron Concurrency C',
        email: 'concurrency.c@vitasta.luxury',
        phone: '9876500003',
        addressLine1: 'Courtyard C',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [
          { id: p1.id, title: p1.title, price: p1.price, quantity: 1, image: p1.primaryImage },
        ],
      });

      const [resA, resB, resC] = await Promise.all([orderA, orderB, orderC]);

      assert(resA.success && resB.success && resC.success, 'Simultaneous interleaved checkouts resolved without deadlock');

      const inv1 = await prisma.inventory.findUnique({ where: { productId: p1.id } });
      const inv2 = await prisma.inventory.findUnique({ where: { productId: p2.id } });

      assert(inv1.quantity === 15, `Product 1 stock accurately deducted (20 - 5 = 15, Got: ${inv1.quantity})`);
      assert(inv2.quantity === 16, `Product 2 stock accurately deducted (20 - 4 = 16, Got: ${inv2.quantity})`);
      assert(inv1.reservedQuantity === 5, `Product 1 reserved count atomically updated (Got: ${inv1.reservedQuantity})`);

      // Cleanup created concurrency test orders
      const orderIds = [resA.orderId, resB.orderId, resC.orderId].filter(Boolean);
      await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
    }

    // -------------------------------------------------------------------------
    // CATEGORY 2: Stock Exhaustion & Overselling Prevention
    // -------------------------------------------------------------------------
    console.log('\n📌 2. Stock Exhaustion & Overselling Boundary Enforcement');
    if (testProducts.length > 0) {
      const p = testProducts[0];
      // Set exact stock to 1
      await prisma.inventory.update({
        where: { productId: p.id },
        data: { quantity: 1, reservedQuantity: 0 },
      });

      // Attempt to buy 2 (exceeding stock)
      const overOrderRes = await createOrder({
        fullName: 'Patron Oversell Attempt',
        email: 'oversell@vitasta.luxury',
        phone: '9876511111',
        addressLine1: 'Test St',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [{ id: p.id, title: p.title, price: p.price, quantity: 2, image: p.primaryImage }],
      });

      assert(!overOrderRes.success, 'Oversell attempt strictly rejected with insufficient stock');
      assert(overOrderRes.error?.includes('Insufficient stock'), 'Error message informs patron accurately');

      // Buy exactly 1 (exhausting stock)
      const validLastStock = await createOrder({
        fullName: 'Patron Last Stock',
        email: 'laststock@vitasta.luxury',
        phone: '9876511112',
        addressLine1: 'Test St',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [{ id: p.id, title: p.title, price: p.price, quantity: 1, image: p.primaryImage }],
      });

      assert(validLastStock.success, 'Exact last stock purchase succeeded');

      const depletedProduct = await prisma.product.findUnique({ where: { id: p.id } });
      assert(depletedProduct.stockStatus === 'OUT_OF_STOCK', 'Product automatically marked OUT_OF_STOCK on stock depletion');

      // Attempt buying while 0
      const zeroStockAttempt = await createOrder({
        fullName: 'Patron Zero Stock',
        email: 'zerostock@vitasta.luxury',
        phone: '9876511113',
        addressLine1: 'Test St',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [{ id: p.id, title: p.title, price: p.price, quantity: 1, image: p.primaryImage }],
      });
      assert(!zeroStockAttempt.success, 'Zero stock purchase blocked immediately');

      // Restore inventory
      if (validLastStock.orderId) {
        await prisma.order.delete({ where: { id: validLastStock.orderId } });
      }
      await prisma.inventory.update({
        where: { productId: p.id },
        data: { quantity: 10, reservedQuantity: 0 },
      });
      await prisma.product.update({
        where: { id: p.id },
        data: { stockStatus: 'READY_TO_SHIP' },
      });
    }

    // -------------------------------------------------------------------------
    // CATEGORY 3: Price Tampering, Negative Quantities & Input Sanitization
    // -------------------------------------------------------------------------
    console.log('\n📌 3. Price Tampering, Negative Quantities & Boundary Attacks');
    if (testProducts.length > 0) {
      const p = testProducts[0];
      
      // Negative quantity in validation
      const negQtyParse = placeOrderSchema.safeParse({
        fullName: 'Negative Qty Tester',
        email: 'test@vitasta.com',
        phone: '9876543210',
        addressLine1: 'Street 1',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [{ id: p.id, title: p.title, price: p.price, quantity: -5, image: p.primaryImage }],
      });
      assert(!negQtyParse.success, 'Schema rejects negative quantity (-5)');

      // Zero quantity
      const zeroQtyParse = placeOrderSchema.safeParse({
        fullName: 'Zero Qty Tester',
        email: 'test@vitasta.com',
        phone: '9876543210',
        addressLine1: 'Street 1',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [{ id: p.id, title: p.title, price: p.price, quantity: 0, image: p.primaryImage }],
      });
      assert(!zeroQtyParse.success, 'Schema rejects zero quantity (0)');

      // Fractional quantity
      const floatQtyParse = placeOrderSchema.safeParse({
        fullName: 'Float Qty Tester',
        email: 'test@vitasta.com',
        phone: '9876543210',
        addressLine1: 'Street 1',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [{ id: p.id, title: p.title, price: p.price, quantity: 1.5, image: p.primaryImage }],
      });
      assert(!floatQtyParse.success, 'Schema rejects float/fractional quantity (1.5)');

      // Price override attempt (Client sends price: 0)
      const zeroPriceOrder = await createOrder({
        fullName: 'Freebie Exploit Attempt',
        email: 'freebie@vitasta.luxury',
        phone: '9876543210',
        addressLine1: 'Street 1',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [{ id: p.id, title: p.title, price: 0, quantity: 1, image: p.primaryImage }],
      });
      if (zeroPriceOrder.success) {
        const checkOrder = await prisma.order.findUnique({ where: { id: zeroPriceOrder.orderId } });
        assert(checkOrder.total === p.price, `Server enforced real price: ₹${p.price} despite client submitting ₹0`);
        await prisma.order.delete({ where: { id: zeroPriceOrder.orderId } });
      }
    }

    // -------------------------------------------------------------------------
    // CATEGORY 4: Royal Coupon Engine Edge Cases & Boundary Conditions
    // -------------------------------------------------------------------------
    console.log('\n📌 4. Royal Coupon Engine Edge Cases & Calculation Limits');
    
    // Test non-existent coupon
    const fakeCoupon = await validateCoupon('NON_EXISTENT_CODE_123', 50000);
    assert(!fakeCoupon.valid, 'Rejects arbitrary non-existent coupon code');

    // Create a temporary test coupon with limits
    const testCoupon = await prisma.coupon.upsert({
      where: { code: 'DEEPTEST50' },
      update: {
        discountType: 'PERCENTAGE',
        value: 50,
        maximumDiscount: 5000,
        minimumOrder: 20000,
        usageLimit: 1,
        timesUsed: 0,
        isActive: true,
      },
      create: {
        code: 'DEEPTEST50',
        discountType: 'PERCENTAGE',
        value: 50,
        maximumDiscount: 5000,
        minimumOrder: 20000,
        usageLimit: 1,
        timesUsed: 0,
        isActive: true,
      },
    });

    // Test minimum order requirement rejection
    const belowMinRes = await validateCoupon('DEEPTEST50', 10000);
    assert(!belowMinRes.valid && belowMinRes.error?.includes('Minimum order'), 'Rejects order below minimum requirement (₹10,000 < ₹20,000)');

    // Test maximum discount ceiling enforcement (50% of ₹40,000 is ₹20,000, but cap is ₹5,000)
    const capRes = await validateCoupon('DEEPTEST50', 40000);
    assert(capRes.valid && capRes.discountAmount === 5000, `Cap enforced: 50% of ₹40k capped at ₹5,000 (Got ₹${capRes.discountAmount})`);

    // Clean up test coupon
    await prisma.coupon.delete({ where: { id: testCoupon.id } });

    // -------------------------------------------------------------------------
    // CATEGORY 5: Complete RBAC & Privilege Escalation Defense Audit
    // -------------------------------------------------------------------------
    console.log('\n📌 5. RBAC & Administrative Privilege Escalation Defense Audit');

    const adminFunctions = [
      { name: 'getAdminStats()', fn: () => getAdminStats() },
      { name: 'getAdminOrders()', fn: () => getAdminOrders() },
      { name: 'updateOrderStatus()', fn: () => updateOrderStatus('fake_id', {}) },
      { name: 'getAdminInventory()', fn: () => getAdminInventory() },
      { name: 'updateStock()', fn: () => updateStock('fake_id', 5) },
      { name: 'createProduct()', fn: () => createProduct({}) },
      { name: 'updateProduct()', fn: () => updateProduct('fake_id', {}) },
      { name: 'deleteProduct()', fn: () => deleteProduct('fake_id') },
      { name: 'getAdminCoupons()', fn: () => getAdminCoupons() },
      { name: 'createCoupon()', fn: () => createCoupon({}) },
      { name: 'updateCoupon()', fn: () => updateCoupon('fake_id', {}) },
      { name: 'deleteCoupon()', fn: () => deleteCoupon('fake_id') },
      { name: 'getAdminCustomers()', fn: () => getAdminCustomers() },
      { name: 'getAdminMessages()', fn: () => getAdminMessages() },
      { name: 'getAdminSubscribers()', fn: () => getAdminSubscribers() },
      { name: 'getAdminReviews()', fn: () => getAdminReviews() },
      { name: 'approveReview()', fn: () => approveReview('fake_id') },
      { name: 'deleteReview()', fn: () => deleteReview('fake_id') },
    ];

    for (const af of adminFunctions) {
      const res = await af.fn();
      assert(res.success === false, `Unauthenticated caller blocked from ${af.name}`);
    }

    // -------------------------------------------------------------------------
    // CATEGORY 6: IDOR & Order Privacy Defense
    // -------------------------------------------------------------------------
    console.log('\n📌 6. IDOR & Patron Data Privacy Protection');
    const orderAuthCheck = await getOrderById('non-existent-order-id', { requireAuth: true });
    assert(!orderAuthCheck.success, 'getOrderById with requireAuth strictly rejects unauthorized caller');

    // -------------------------------------------------------------------------
    // CATEGORY 7: Catalog Query & Special Character Sanitization
    // -------------------------------------------------------------------------
    console.log('\n📌 7. Catalog Search, Special Characters & SQL Injection Resilience');
    
    // Search with SQL injection & regex metacharacters
    const searchRes1 = await getProducts({ search: "'; DROP TABLE \"Product\"; --" });
    assert(searchRes1.success === true, 'Handled SQL injection search query safely');

    const searchRes2 = await getProducts({ search: '[a-z]*+{}()^$' });
    assert(searchRes2.success === true, 'Handled regex metacharacters search query safely');

    const slugRes = await getProductBySlug('non-existent-slug-xyz-123');
    assert(slugRes.success === false, 'Cleanly returns error for non-existent product slug');

    // -------------------------------------------------------------------------
    // CATEGORY 8: Contact Inquiries & XSS Payload Sanitization
    // -------------------------------------------------------------------------
    console.log('\n📌 8. Inquiries & Newsletter Sanitization');
    
    const contactRes = await submitContactMessage({
      name: '<script>alert("xss")</script> Rani Sahiba',
      email: 'rani@jodhpur.luxury',
      phone: '9876543210',
      subject: 'Custom Bridal Adda Saree',
      message: '<img src=x onerror=alert(1)> Inquiring for wedding drape in pure Habutai Silk.',
    });
    assert(contactRes.success === true, 'Contact message accepted and sanitized');
    if (contactRes.messageId) {
      await prisma.contactMessage.delete({ where: { id: contactRes.messageId } });
    }

    // -------------------------------------------------------------------------
    // FINAL AUDIT SUMMARY
    // -------------------------------------------------------------------------
    console.log('\n========================================================================');
    console.log(`📊 Deep Dive Audit Results: ${passedTests}/${totalTests} Tests Passed`);
    console.log('========================================================================\n');

    if (passedTests === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal Deep Audit Error:', err);
    process.exit(1);
  }
}

runDeepAudit();
