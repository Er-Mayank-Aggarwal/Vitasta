import { prisma } from './lib/prisma.js';
import { createOrder, getOrderById } from './app/actions/checkout-actions.js';
import { createRazorpayOrder, verifyRazorpayPayment } from './app/actions/razorpay-actions.js';
import { getAdminStats } from './app/actions/admin-actions.js';

import { getAdminInventory } from './app/actions/inventory-actions.js';
import { getAdminCoupons, validateCoupon } from './app/actions/coupon-actions.js';
import { subscribeNewsletter } from './app/actions/newsletter-actions.js';
import { placeOrderSchema, productSchema } from './lib/validations.js';

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

async function runAllTests() {
  console.log('========================================================================');
  console.log('🧪 Vitasta Atelier Security, Validation & API Test Suite');
  console.log('========================================================================\n');

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: Server-Side Price Tampering Prevention
    // -------------------------------------------------------------------------
    console.log('📌 Test Suite 1: Price Tampering Defense in Checkout');
    const activeProduct = await prisma.product.findFirst({
      where: { isActive: true },
    });

    if (activeProduct) {
      console.log(`   Testing with saree "${activeProduct.title}" (Actual DB Price: ₹${activeProduct.price})`);

      // Attempt attack: user submits price = 1 INR instead of the actual price
      const attackPayload = {
        fullName: 'Security Test Patron',
        email: 'security.test@vitasta.luxury',
        phone: '9876543210',
        addressLine1: 'Atelier Test Suite Street 1',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        items: [
          {
            id: activeProduct.id,
            title: activeProduct.title,
            price: 1, // <--- TAMPERED PRICE
            quantity: 1,
            image: activeProduct.primaryImage || 'https://res.cloudinary.com/test.jpg',
          },
        ],
      };

      const orderResult = await createOrder(attackPayload);
      assert(orderResult.success === true, 'Order created successfully with server validation');

      if (orderResult.success && orderResult.orderId) {
        const savedOrder = await prisma.order.findUnique({
          where: { id: orderResult.orderId },
          include: { items: true },
        });

        assert(
          savedOrder.total === activeProduct.price,
          `Server enforced canonical DB price (Expected ₹${activeProduct.price}, Got ₹${savedOrder.total})`
        );
        assert(
          savedOrder.items[0].unitPrice === activeProduct.price,
          `OrderItem unitPrice matches database catalog price`
        );

        // Clean up test order
        await prisma.order.delete({ where: { id: orderResult.orderId } });
        // Restore inventory deducted during test
        const inv = await prisma.inventory.findUnique({ where: { productId: activeProduct.id } });
        if (inv) {
          await prisma.inventory.update({
            where: { productId: activeProduct.id },
            data: {
              quantity: inv.quantity + 1,
              reservedQuantity: Math.max(0, inv.reservedQuantity - 1),
            },
          });
        }
      }
    } else {
      console.log('   ⚠️ No active products found in DB for price tampering test.');
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 2: Admin Privilege & Security Boundary Enforcement
    // -------------------------------------------------------------------------
    console.log('\n📌 Test Suite 2: Admin Privilege Escalation Protection');
    const adminStatsRes = await getAdminStats();
    assert(
      adminStatsRes.success === false && adminStatsRes.error?.includes('Not authenticated'),
      'getAdminStats() rejects unauthenticated callers'
    );

    const adminInventoryRes = await getAdminInventory();
    assert(
      adminInventoryRes.success === false && adminInventoryRes.error?.includes('Not authenticated'),
      'getAdminInventory() rejects unauthenticated callers'
    );

    const adminCouponsRes = await getAdminCoupons();
    assert(
      adminCouponsRes.success === false && adminCouponsRes.error?.includes('Not authenticated'),
      'getAdminCoupons() rejects unauthenticated callers'
    );

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Order IDOR & Authorization Protection
    // -------------------------------------------------------------------------
    console.log('\n📌 Test Suite 3: Order Access Control & IDOR Defense');
    const existingOrder = await prisma.order.findFirst();
    if (existingOrder) {
      const secureAccess = await getOrderById(existingOrder.id, { requireAuth: true });
      assert(
        secureAccess.success === false && secureAccess.error?.includes('Unauthorized'),
        'getOrderById with requireAuth rejects unauthenticated callers'
      );
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Coupon Engine & Business Rules
    // -------------------------------------------------------------------------
    console.log('\n📌 Test Suite 4: Royal Coupon Engine & Validation');
    const invalidCoupon = await validateCoupon('NONEXISTENT_CODE_XYZ', 50000);
    assert(invalidCoupon.valid === false, 'Rejects non-existent coupons');

    // Test with existing coupon if any in DB
    const firstCoupon = await prisma.coupon.findFirst({ where: { isActive: true } });
    if (firstCoupon) {
      const validRes = await validateCoupon(firstCoupon.code, 100000);
      assert(validRes.valid === true, `Successfully validates active coupon "${firstCoupon.code}"`);
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 5: Newsletter & Contact Validation
    // -------------------------------------------------------------------------
    console.log('\n📌 Test Suite 5: Newsletter & Contact Validation');
    const invalidEmailRes = await subscribeNewsletter('not-an-email');
    assert(invalidEmailRes.success === false, 'Rejects invalid newsletter email format');

    const validEmailRes = await subscribeNewsletter('vitasta_ci_test@example.com');
    assert(validEmailRes.success === true, 'Accepts valid newsletter email and upserts record');
    await prisma.newsletter.deleteMany({ where: { email: 'vitasta_ci_test@example.com' } });

    // -------------------------------------------------------------------------
    // TEST SUITE 6: Zod Schema Boundaries
    // -------------------------------------------------------------------------
    console.log('\n📌 Test Suite 6: Zod Input Validation Boundaries');
    const invalidOrderSchema = placeOrderSchema.safeParse({
      email: 'invalid',
      fullName: '',
      phone: '123',
      addressLine1: '',
      city: '',
      state: '',
      pincode: '',
      items: [],
    });
    assert(!invalidOrderSchema.success, 'placeOrderSchema catches missing required fields');

    const invalidProductSchema = productSchema.safeParse({
      title: '',
      price: -500,
    });
    assert(!invalidProductSchema.success, 'productSchema rejects negative price and missing fields');

    // -------------------------------------------------------------------------
    // TEST SUITE 7: Razorpay Payment Gateway & Patron Customization Notes
    // -------------------------------------------------------------------------
    console.log('\n📌 Test Suite 7: Razorpay Gateway & Patron Customization Notes Persistence');
    if (activeProduct) {
      const notesOrderPayload = {
        fullName: 'Patron Maharani Test',
        email: 'maharani.test@vitasta.luxury',
        phone: '9876500000',
        addressLine1: 'Umaid Heritage Complex',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        notes: 'Custom unstitched heavy zari blouse with royal blue piping required for Diwali puja.',
        items: [
          {
            id: activeProduct.id,
            title: activeProduct.title,
            price: activeProduct.price,
            quantity: 1,
            image: activeProduct.primaryImage || 'https://res.cloudinary.com/test.jpg',
          },
        ],
      };

      const customOrderRes = await createOrder(notesOrderPayload);
      assert(customOrderRes.success === true, 'Order created with custom notes payload');

      if (customOrderRes.success && customOrderRes.orderId) {
        const orderFromDb = await prisma.order.findUnique({
          where: { id: customOrderRes.orderId },
        });

        assert(
          orderFromDb.notes === 'Custom unstitched heavy zari blouse with royal blue piping required for Diwali puja.',
          'Database verified: Patron customization note is stored accurately in Order.notes'
        );

        // Test Razorpay Order Generation
        const rzpGenRes = await createRazorpayOrder(customOrderRes.orderId);
        assert(rzpGenRes.success === true, 'Razorpay order generated with verified amount in paise');
        assert(rzpGenRes.amount === Math.round(activeProduct.price * 100), 'Razorpay amount matches total in paise');

        // Test Razorpay Payment Verification
        const rzpVerifyRes = await verifyRazorpayPayment({
          orderId: customOrderRes.orderId,
          razorpayOrderId: rzpGenRes.razorpayOrderId,
          razorpayPaymentId: 'pay_test_suite_success_99',
          razorpaySignature: 'test_signature',
        });

        assert(rzpVerifyRes.success === true, 'Razorpay payment verification updates order to SUCCESS');

        const updatedOrder = await prisma.order.findUnique({
          where: { id: customOrderRes.orderId },
          include: { payment: true },
        });

        assert(updatedOrder.paymentStatus === 'SUCCESS', 'Order paymentStatus marked as SUCCESS');
        assert(updatedOrder.payment?.paymentMethod === 'RAZORPAY_UPI_CARDS', 'Payment record created with RAZORPAY_UPI_CARDS');

        // Cleanup
        await prisma.order.delete({ where: { id: customOrderRes.orderId } });
        const inv = await prisma.inventory.findUnique({ where: { productId: activeProduct.id } });
        if (inv) {
          await prisma.inventory.update({
            where: { productId: activeProduct.id },
            data: {
              quantity: inv.quantity + 1,
              reservedQuantity: Math.max(0, inv.reservedQuantity - 1),
            },
          });
        }
      }
    }

    // -------------------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------------------

    console.log('\n========================================================================');
    console.log(`📊 Test Results: ${passedTests}/${totalTests} Tests Passed`);
    console.log('========================================================================\n');

    if (passedTests === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal Test Execution Error:', err);
    process.exit(1);
  }
}

runAllTests();
