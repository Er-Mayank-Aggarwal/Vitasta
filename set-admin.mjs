import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  const email = process.argv[2] || "mayank1gdsc@gmail.com";

  if (!process.argv[2]) {
    console.log(`No email provided. Usage: node set-admin.mjs <user_email>`);
    console.log(`Defaulting to: ${email}`);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log(`User ${email} not found in DB. Please sign in or register first.`);
    return;
  }

  await prisma.user.update({
    where: { email },
    data: { role: "ADMIN", membershipTier: "Royal Regent (Admin)" },
  });

  console.log(`Successfully elevated ${email} to ADMIN / Royal Regent role.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
