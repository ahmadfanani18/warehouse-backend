import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';

export interface GetFinancialReportDTO {
  warehouseId?: string;
}

export interface FinancialReportResponse {
  totalValue: number;
  items: {
    sku: string;
    name: string;
    stock: number;
    purchasePrice: number;
    totalValue: number;
    warehouse: string;
  }[];
}

@injectable()
export class GetFinancialReportUseCase {
  private prisma = new PrismaClient();

  async execute(dto: GetFinancialReportDTO): Promise<Result<FinancialReportResponse>> {
    try {
      const { warehouseId } = dto;
      
      let whereAuth: any = {};
      if (warehouseId) {
         whereAuth.warehouseId = warehouseId;
      }

      const inventories = await this.prisma.inventory.findMany({
        where: whereAuth,
        include: {
          product: true,
          warehouse: true
        }
      });

      let totalValue = 0;
      
      const items = inventories
        .filter(inv => inv.product.purchasePrice !== null)
        .map(inv => {
          const price = Number(inv.product.purchasePrice);
          const value = inv.stock * price;
          totalValue += value;
          
          return {
            sku: inv.product.sku,
            name: inv.product.name,
            stock: inv.stock,
            purchasePrice: price,
            totalValue: value,
            warehouse: inv.warehouse.name
          };
      });

      return Result.ok({
        totalValue,
        items
      });

    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil laporan keuangan'));
    }
  }
}
