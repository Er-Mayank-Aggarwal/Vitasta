import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Set up WebSocket constructor for Neon only if native WebSocket is absent
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const DEFAULT_DATABASE_URL = "postgresql://neondb_owner:npg_DEQj0xMOwX8P@ep-young-dust-aoun8xk9.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&schema=vitasta";

let connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

if (connectionString && connectionString.startsWith('"') && connectionString.endsWith('"')) {
  connectionString = connectionString.slice(1, -1);
}

if (!connectionString || connectionString === 'undefined' || connectionString.trim() === '') {
  connectionString = DEFAULT_DATABASE_URL;
}

const createPrismaClient = () => {
  try {
    const adapter = new PrismaNeon(
      { connectionString, max: 10, idleTimeoutMillis: 30000 },
      { schema: 'vitasta' }
    );
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error("Prisma Neon Adapter creation failed, falling back to standard PrismaClient:", err);
    return new PrismaClient();
  }
};

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
