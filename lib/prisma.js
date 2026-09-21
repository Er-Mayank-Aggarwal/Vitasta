import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/client/index.js';
import ws from 'ws';

// Set up WebSocket constructor for Neon
neonConfig.webSocketConstructor = ws;

let connectionString = process.env.DATABASE_URL;

if (connectionString && connectionString.startsWith('"') && connectionString.endsWith('"')) {
  connectionString = connectionString.slice(1, -1);
}

if (!connectionString || connectionString === 'undefined' || connectionString.trim() === '') {
  console.error("CRITICAL: DATABASE_URL is undefined or empty!");
  connectionString = "postgresql://localhost";
}

const createPrismaClient = () => {
  try {
    const adapter = new PrismaNeon({ connectionString }, { schema: 'vitasta' });
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error("Prisma Client creation failed:", err);
    throw err;
  }
};

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
