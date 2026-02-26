import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';
import { IUserRepository, UserFilter, CreateUserDTO, UpdateUserDTO } from '../../domain/repositories/IUserRepository';
import { User, Role } from '../../domain/entities/User';
import { PaginatedResult } from '../../domain/types/SharedTypes';

@injectable()
export class PrismaUserRepository implements IUserRepository {
  private prisma = new PrismaClient();

  private toDomain(record: any): User {
    return {
      id: record.id,
      email: record.email,
      password: record.password,
      name: record.name,
      role: record.role as Role,
      avatarUrl: record.avatarUrl || undefined,
      phone: record.phone || undefined,
      isActive: record.isActive,
      assignedWarehouseIds: record.warehouses ? record.warehouses.map((w: any) => w.warehouseId) : [],
      lastLoginAt: record.lastLoginAt || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { warehouses: true },
    });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { warehouses: true },
    });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findAll(filter?: UserFilter): Promise<PaginatedResult<User>> {
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    if (filter?.role) {
      where.role = filter.role;
    }
    if (filter?.isActive !== undefined) {
      where.isActive = filter.isActive;
    }
    if (filter?.warehouseId) {
      where.warehouses = {
        some: { warehouseId: filter.warehouseId }
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { warehouses: true },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      data: users.map(u => this.toDomain(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        warehouses: {
          create: (data.warehouseIds || []).map(id => ({ warehouseId: id }))
        }
      },
      include: { warehouses: true }
    });
    return this.toDomain(user);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.lastLoginAt !== undefined) updateData.lastLoginAt = data.lastLoginAt;

    // Handle warehouse assignment if provided
    if (data.warehouseIds) {
      updateData.warehouses = {
        deleteMany: {},
        create: data.warehouseIds.map(wId => ({ warehouseId: wId }))
      };
    }

    const res = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { warehouses: true }
    });
    return this.toDomain(res);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
