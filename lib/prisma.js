import 'dotenv/config';
import dns from 'node:dns';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

neonConfig.webSocketConstructor = ws;

let connectionString = process.env.DATABASE_URL || '';

if (connectionString && connectionString.startsWith('"') && connectionString.endsWith('"')) {
  connectionString = connectionString.slice(1, -1);
}

if (!connectionString) {
  console.warn("DATABASE_URL environment variable is not defined.");
}

const createPrismaClient = () => {
  try {
    const adapter = new PrismaNeon(
      { connectionString, max: 10, idleTimeoutMillis: 30000 },
      { schema: 'vitasta' }
    );
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error("Prisma Neon Adapter creation failed, falling back:", err);
    return new PrismaClient();
  }
};

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
