import { beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add this to your package.json test scripts:
// "test": "dotenv -e .env.test -- vitest run"

beforeAll(async () => {
  // Optional: Connect to test DB
  await prisma.$connect();
});

export async function truncateDB() {
  try {
    // Standard deleteMany to prevent Postgres AccessExclusiveLock hanging
    // Delete dependent tables first to respect foreign keys
    await prisma.transactionItem.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.category.deleteMany();
    
    // Delete isolated or weakly referenced tables
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.refreshToken.deleteMany();
    
    // Delete core mapping and master tables
    await prisma.userWarehouse.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error({ error });
  }
}

// Removed global afterAll disconnect to prevent Prisma from hanging on subsequent tests in sequential mode

export { prisma };
