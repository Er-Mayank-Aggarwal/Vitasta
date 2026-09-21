import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../lib/prisma.js';

const auth = betterAuth({
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

async function main() {
  console.log('--- Vitasta User & Orders Seeder ---');

  // 1. Create Admin User
  console.log('Seeding Atelier Admin User...');
  let adminUser = await prisma.user.findUnique({ where: { email: 'admin@vitasta.com' } });
  if (!adminUser) {
    const adminRes = await auth.api.signUpEmail({
      body: {
        email: 'admin@vitasta.com',
        password: 'password123',
        name: 'Smita Saraswat',
      },
    });
    console.log('Admin account created via Better Auth:', adminRes.user?.id);
  }

  await prisma.user.update({
    where: { email: 'admin@vitasta.com' },
    data: {
      role: 'ADMIN',
      phone: '+91 88240 17443',
      membershipTier: 'Atelier Sovereign Founder',
      emailVerified: true,
    },
  });
  console.log('✓ Admin (admin@vitasta.com / password123) role set to ADMIN.');

  // 2. Create Demo Royal Patron User
  console.log('Seeding Demo Royal Patron...');
  let patronUser = await prisma.user.findUnique({ where: { email: 'patron@vitasta.luxury' } });
  if (!patronUser) {
    const patronRes = await auth.api.signUpEmail({
      body: {
        email: 'patron@vitasta.luxury',
        password: 'password123',
        name: 'Maharani Gayatri Devi',
      },
    });
    console.log('Patron account created via Better Auth:', patronRes.user?.id);
  }

  patronUser = await prisma.user.update({
    where: { email: 'patron@vitasta.luxury' },
    data: {
      role: 'CLIENT',
      phone: '+91 98290 12345',
      membershipTier: 'Imperial Patron',
      emailVerified: true,
    },
  });
  console.log('✓ Patron (patron@vitasta.luxury / vitasta@patron) configured.');

  // 3. Create Sample Delivery Addresses for Patron & Admin
  const existingAddress = await prisma.address.findFirst({ where: { userId: patronUser.id } });
  let patronAddressId;
  if (!existingAddress) {
    const addr = await prisma.address.create({
      data: {
        userId: patronUser.id,
        fullName: 'Maharani Gayatri Devi',
        phone: '+91 98290 12345',
        addressLine1: 'Rambagh Palace Estate, Suite 101',
        addressLine2: 'Bhawani Singh Road',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        pincode: '302005',
        isDefault: true,
      },
    });
    patronAddressId = addr.id;
    console.log('✓ Created Royal Address for patron.');
  } else {
    patronAddressId = existingAddress.id;
  }

  // 4. Create Sample Orders for Patron if none exist
  const products = await prisma.product.findMany({ take: 4 });
  const existingOrders = await prisma.order.findMany({ where: { userId: patronUser.id } });

  if (existingOrders.length === 0 && products.length > 0) {
    console.log('Seeding sample orders with loom video verifications...');

    // Order 1: Video Verified / In Loom Weaving
    const p1 = products[0];
    await prisma.order.create({
      data: {
        orderNumber: 'VIT-ROYAL-8891',
        userId: patronUser.id,
        addressId: patronAddressId,
        userName: 'Maharani Gayatri Devi',
        userEmail: 'patron@vitasta.luxury',
        userPhone: '+91 98290 12345',
        orderStatus: 'VIDEO_VERIFIED',
        paymentStatus: 'SUCCESS',
        statusLabel: 'Video Verified & Dispatched',
        preDispatchVideoUrl: 'https://res.cloudinary.com/sjl1rfvu/video/upload/v1789675057/vitasta/loom-dispatch-sample.mp4',
        courierName: 'BlueDart Sovereign Luxury Courier',
        trackingNumber: 'BD-VT-78901234IN',
        subtotal: p1.price,
        discount: 0,
        finishingCharges: 0,
        deliveryCharge: 0,
        tax: 0,
        total: p1.price,
        shippingAddressJson: JSON.stringify({
          fullName: 'Maharani Gayatri Devi',
          phone: '+91 98290 12345',
          addressLine1: 'Rambagh Palace Estate, Suite 101',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302005',
        }),
        items: {
          create: [
            {
              productId: p1.id,
              title: p1.title,
              category: 'Royal Masterpiece',
              fabric: p1.fabric,
              color: p1.color,
              unitPrice: p1.price,
              quantity: 1,
              image: p1.primaryImage,
            },
          ],
        },
        shipment: {
          create: {
            courierName: 'BlueDart Sovereign Luxury Courier',
            trackingNumber: 'BD-VT-78901234IN',
          },
        },
        payment: {
          create: {
            amount: p1.price,
            status: 'SUCCESS',
            paymentMethod: 'ROYAL_CONCIERGE_UPI',
            transactionId: 'TXN-VIT-998822',
          },
        },
      },
    });

    // Order 2: In Production / Loom Weaving
    if (products.length > 1) {
      const p2 = products[1];
      await prisma.order.create({
        data: {
          orderNumber: 'VIT-ROYAL-9042',
          userId: patronUser.id,
          addressId: patronAddressId,
          userName: 'Maharani Gayatri Devi',
          userEmail: 'patron@vitasta.luxury',
          userPhone: '+91 98290 12345',
          orderStatus: 'LOOM_WEAVING',
          paymentStatus: 'SUCCESS',
          statusLabel: 'Handcrafting on Jodhpur Loom',
          subtotal: p2.price,
          discount: 0,
          finishingCharges: 0,
          deliveryCharge: 0,
          tax: 0,
          total: p2.price,
          shippingAddressJson: JSON.stringify({
            fullName: 'Maharani Gayatri Devi',
            phone: '+91 98290 12345',
            addressLine1: 'Rambagh Palace Estate, Suite 101',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302005',
          }),
          items: {
            create: [
              {
                productId: p2.id,
                title: p2.title,
                category: 'Heritage Adda Handloom',
                fabric: p2.fabric,
                color: p2.color,
                unitPrice: p2.price,
                quantity: 1,
                image: p2.primaryImage,
              },
            ],
          },
        },
      });
    }

    console.log('✓ Seeded demo royal orders.');
  }

  // 5. Seed sample coupons
  const existingCoupons = await prisma.coupon.findMany();
  if (existingCoupons.length === 0) {
    await prisma.coupon.createMany({
      data: [
        {
          code: 'ROYAL10',
          discountType: 'PERCENTAGE',
          value: 10,
          minimumOrder: 5000,
          maximumDiscount: 5000,
          isActive: true,
        },
        {
          code: 'ATELIERWELCOME',
          discountType: 'PERCENTAGE',
          value: 15,
          minimumOrder: 10000,
          maximumDiscount: 10000,
          isActive: true,
        },
        {
          code: 'VIRASAT2000',
          discountType: 'FIXED',
          value: 2000,
          minimumOrder: 25000,
          isActive: true,
        },
      ],
    });
    console.log('✓ Seeded royal coupons.');
  }

  // 6. Seed sample newsletter subscribers
  const existingSubscribers = await prisma.newsletter.findMany();
  if (existingSubscribers.length === 0) {
    await prisma.newsletter.createMany({
      data: [
        { email: 'radhika.singh@royalheritage.in' },
        { email: 'ananya.sharma@delhiart.org' },
        { email: 'meera.rathore@jodhpurpalace.com' },
      ],
      skipDuplicates: true,
    });
    console.log('✓ Seeded sample royal subscribers.');
  }

  // 7. Seed sample contact inquiries
  const existingMessages = await prisma.contactMessage.findMany();
  if (existingMessages.length === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: 'Sunita Mehra',
          email: 'sunita@mumbaiclub.in',
          phone: '+91 98200 44556',
          subject: 'Bespoke Bridal Zardozi Consultation',
          message: 'Interested in custom colour dyed organza saree with heavy gotta patti for wedding in Udaipur this December.',
          isRead: false,
        },
        {
          name: 'Kavita Singhal',
          email: 'kavita@bangalore.io',
          phone: '+91 99001 88223',
          subject: 'Pre-dispatch Video Inquiry',
          message: 'Can I view the loom video before making full payment for the Banarasi Katan saree?',
          isRead: false,
        },
      ],
    });
    console.log('✓ Seeded sample inquiries.');
  }

  console.log('All users, credentials, orders, and telemetry seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
