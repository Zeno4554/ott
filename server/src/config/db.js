import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

// Reuse a single PrismaClient instance across the app (and across hot reloads
// in dev) to avoid exhausting the Postgres connection pool.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isProd ? ['error', 'warn'] : ['error', 'warn', 'query'],
  });

if (!env.isProd) {
  globalForPrisma.prisma = prisma;
}
