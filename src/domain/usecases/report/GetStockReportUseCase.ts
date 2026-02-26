import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';

export interface GetStockReportDTO {
  warehouseId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface StockReportResponse {
  totalStock: number;
  lowStockItems: number;
  items: {
    sku: string;
    name: string;
    category: string;
    stock: number;
    warehouse: string;
  }[];
}

@injectable()
export class GetStockReportUseCase {
  private prisma = new PrismaClient();

  async execute(dto: GetStockReportDTO): Promise<Result<StockReportResponse>> {
    try {
      const { warehouseId, startDate, endDate } = dto;
      
      let whereAuth: any = {};
      if (warehouseId) {
         whereAuth.warehouseId = warehouseId;
      }
      
      if (startDate || endDate) {
         whereAuth.updatedAt = {};
         if (startDate) whereAuth.updatedAt.gte = startDate;
         if (endDate) whereAuth.updatedAt.lte = endDate;
      }

      const inventories = await this.prisma.inventory.findMany({
        where: whereAuth,
        include: {
          product: { include: { category: true } },
          warehouse: true
        }
      });

      const threshold = 10;
      let totalStock = 0;
      let lowStockItems = 0;
      
      const items = inventories.map(inv => {
        totalStock += inv.stock;
        if (inv.stock < threshold) lowStockItems++;
        
        return {
          sku: inv.product.sku,
          name: inv.product.name,
          category: inv.product.category.name,
          stock: inv.stock,
          warehouse: inv.warehouse.name
        };
      });

      return Result.ok({
        totalStock,
        lowStockItems,
        items
      });

    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil laporan stok'));
    }
  }
}
