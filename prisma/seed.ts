import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Hashed password for 'password123'
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Default Warehouse
  const warehouse = await prisma.warehouse.upsert({
    where: { code: 'WH01' },
    update: {},
    create: {
      id: 'wh-1',
      name: 'Gudang Pusat Jakarta',
      code: 'WH01',
      address: 'Jl. Jendral Sudirman No. 1, Jakarta Pusat',
      isActive: true,
    },
  });

  console.log(`Created warehouse: ${warehouse.name}`);

  // 2. Create SUPER_ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@warehouse.com' },
    update: {},
    create: {
      email: 'admin@warehouse.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      isActive: true,
      lastLoginAt: new Date(),
    },
  });
  console.log(`Created user: ${admin.email} [${admin.role}]`);

  // 3. Create WH_MANAGER
  const manager = await prisma.user.upsert({
    where: { email: 'manager@warehouse.com' },
    update: {},
    create: {
      email: 'manager@warehouse.com',
      password: hashedPassword,
      name: 'Warehouse Manager',
      role: Role.WH_MANAGER,
      isActive: true,
      lastLoginAt: new Date(),
      warehouses: {
        create: {
          warehouse: { connect: { id: warehouse.id } },
        },
      },
    },
  });
  console.log(`Created user: ${manager.email} [${manager.role}]`);

  // 4. Create STAFF
  const staff = await prisma.user.upsert({
    where: { email: 'staff@warehouse.com' },
    update: {},
    create: {
      email: 'staff@warehouse.com',
      password: hashedPassword,
      name: 'Staff Gudang',
      role: Role.STAFF,
      isActive: true,
      lastLoginAt: new Date(),
      warehouses: {
        create: {
          warehouse: { connect: { id: warehouse.id } },
        },
      },
    },
  });
  console.log(`Created user: ${staff.email} [${staff.role}]`);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
