import { PrismaClient, Warehouse as PrismaWarehouse, Category as PrismaCategory, Unit as PrismaUnit } from '@prisma/client';
import { injectable } from 'tsyringe';
import { IWarehouseRepository, ICategoryRepository, IUnitRepository } from '../../domain/repositories/IWarehouseSettingsRepository';
import { Warehouse, Category, Unit } from '../../domain/entities/WarehouseAndSettings';

@injectable()
export class PrismaWarehouseRepository implements IWarehouseRepository {
  private prisma = new PrismaClient();

  private toDomain(w: PrismaWarehouse): Warehouse {
    return { ...w };
  }

  async findAll(): Promise<Warehouse[]> {
    const data = await this.prisma.warehouse.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return data.map(this.toDomain);
  }

  async findById(id: string): Promise<Warehouse | null> {
    const w = await this.prisma.warehouse.findUnique({ where: { id } });
    return w ? this.toDomain(w) : null;
  }

  async create(data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse> {
    const w = await this.prisma.warehouse.create({ data });
    return this.toDomain(w);
  }

  async update(id: string, data: Partial<Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Warehouse> {
    const w = await this.prisma.warehouse.update({
      where: { id },
      data
    });
    return this.toDomain(w);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.warehouse.update({
      where: { id },
      data: { isActive: false }
    });
  }
}

@injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  private prisma = new PrismaClient();

  private toDomain(c: PrismaCategory): Category {
    return { ...c };
  }

  async findAll(): Promise<Category[]> {
    const data = await this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return data.map(this.toDomain);
  }

  async findById(id: string): Promise<Category | null> {
    const c = await this.prisma.category.findUnique({ where: { id } });
    return c ? this.toDomain(c) : null;
  }

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const c = await this.prisma.category.create({ data });
    return this.toDomain(c);
  }

  async update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> {
    const c = await this.prisma.category.update({
      where: { id },
      data
    });
    return this.toDomain(c);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}

@injectable()
export class PrismaUnitRepository implements IUnitRepository {
  private prisma = new PrismaClient();

  private toDomain(u: PrismaUnit): Unit {
    return { ...u };
  }

  async findAll(): Promise<Unit[]> {
    const data = await this.prisma.unit.findMany({
      orderBy: { name: 'asc' }
    });
    return data.map(this.toDomain);
  }

  async findById(id: string): Promise<Unit | null> {
    const u = await this.prisma.unit.findUnique({ where: { id } });
    return u ? this.toDomain(u) : null;
  }

  async create(data: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> {
    const u = await this.prisma.unit.create({ data });
    return this.toDomain(u);
  }

  async update(id: string, data: Partial<Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Unit> {
    const u = await this.prisma.unit.update({
      where: { id },
      data
    });
    return this.toDomain(u);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.unit.delete({ where: { id } });
  }
}
