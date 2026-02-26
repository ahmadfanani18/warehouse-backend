import { IInventoryRepository, GetInventoriesParams } from '../../domain/repositories/IInventoryRepository';
import { Product } from '../../domain/entities/Product';
import { Inventory } from '../../domain/entities/Inventory';
import { PrismaClient, Prisma } from '@prisma/client';
import { injectable } from 'tsyringe';

@injectable()
export class PrismaInventoryRepository implements IInventoryRepository {
  private prisma = new PrismaClient();

  async createProductWithInitialStock(
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    warehouseId: string,
    initialStock: number
  ): Promise<{ product: Product; inventory: Inventory }> {
    const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.create({
        data: {
          sku: productData.sku,
          name: productData.name,
          categoryId: productData.categoryId,
          unitId: productData.unitId,
          purchasePrice: productData.purchasePrice ? new Prisma.Decimal(productData.purchasePrice) : null,
        },
        include: {
          category: true,
          unit: true
        }
      });

      const inventory = await tx.inventory.create({
        data: {
          productId: product.id,
          warehouseId,
          stock: initialStock,
        },
        include: {
          warehouse: true,
          product: {
            include: { category: true, unit: true }
          }
        }
      });

      return { product, inventory };
    });

    return {
      product: this.toProductDomain(result.product),
      inventory: this.toInventoryDomain(result.inventory)
    };
  }

  async findProductBySku(sku: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      include: { category: true, unit: true }
    });
    return product ? this.toProductDomain(product) : null;
  }

  async findProductById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, unit: true }
    });
    return product ? this.toProductDomain(product) : null;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const data: any = { ...updates };
    if (updates.purchasePrice !== undefined) {
      data.purchasePrice = updates.purchasePrice !== null ? new Prisma.Decimal(updates.purchasePrice) : null;
    }

    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: { category: true, unit: true }
    });
    return this.toProductDomain(product);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id }
    });
  }

  async getInventories(params: GetInventoriesParams): Promise<{ data: Inventory[]; total: number }> {
    const { warehouseId, categoryId, search, page, limit } = params;

    const where: Prisma.InventoryWhereInput = {};

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    if (search || categoryId) {
      where.product = {
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } }
          ]
        } : {}),
        ...(categoryId ? { categoryId } : {})
      };
    }

    const [inventories, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          warehouse: true,
          product: {
            include: { category: true, unit: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.inventory.count({ where })
    ]);

    return {
      data: inventories.map((inv: any) => this.toInventoryDomain(inv)),
      total
    };
  }

  async getInventoriesByProductId(productId: string, warehouseId?: string): Promise<Inventory[]> {
    const where: Prisma.InventoryWhereInput = { productId };
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    const inventories = await this.prisma.inventory.findMany({
      where,
      include: {
        warehouse: true,
        product: {
          include: { category: true, unit: true }
        }
      }
    });

    return inventories.map((inv: any) => this.toInventoryDomain(inv));
  }

  private toProductDomain(prismaProduct: any): Product {
    return {
      id: prismaProduct.id,
      sku: prismaProduct.sku,
      name: prismaProduct.name,
      categoryId: prismaProduct.categoryId,
      unitId: prismaProduct.unitId,
      purchasePrice: prismaProduct.purchasePrice ? prismaProduct.purchasePrice.toNumber() : null,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
      // mapping relations if they exist
      ...(prismaProduct.category && {
        category: {
          id: prismaProduct.category.id,
          name: prismaProduct.category.name,
          description: prismaProduct.category.description,
          createdAt: prismaProduct.category.createdAt,
          updatedAt: prismaProduct.category.updatedAt
        }
      }),
      ...(prismaProduct.unit && {
        unit: {
          id: prismaProduct.unit.id,
          name: prismaProduct.unit.name,
          abbreviation: prismaProduct.unit.abbreviation,
          createdAt: prismaProduct.unit.createdAt,
          updatedAt: prismaProduct.unit.updatedAt
        }
      })
    };
  }

  private toInventoryDomain(prismaInventory: any): Inventory {
    return {
      id: prismaInventory.id,
      productId: prismaInventory.productId,
      warehouseId: prismaInventory.warehouseId,
      stock: prismaInventory.stock,
      createdAt: prismaInventory.createdAt,
      updatedAt: prismaInventory.updatedAt,
      ...(prismaInventory.product && { product: this.toProductDomain(prismaInventory.product) }),
      ...(prismaInventory.warehouse && {
        warehouse: {
          id: prismaInventory.warehouse.id,
          code: prismaInventory.warehouse.code,
          name: prismaInventory.warehouse.name,
          address: prismaInventory.warehouse.address,
          isActive: prismaInventory.warehouse.isActive,
          createdAt: prismaInventory.warehouse.createdAt,
          updatedAt: prismaInventory.warehouse.updatedAt
        }
      })
    };
  }
}
