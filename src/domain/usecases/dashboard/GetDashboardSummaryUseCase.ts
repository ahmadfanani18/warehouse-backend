import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';
import { TransactionType, TransactionStatus } from '../../entities/Transaction';
import { Role } from '@prisma/client';

export interface DashboardSummaryDTO {
  warehouseId?: string;
  role: string;
}

export interface DashboardSummaryResponse {
  totalInventoryValue?: number;
  totalItems: number;
  lowStockCount: number;
  pendingTransfers?: number;
}

@injectable()
export class GetDashboardSummaryUseCase {
  private prisma = new PrismaClient();

  async execute(dto: DashboardSummaryDTO): Promise<Result<DashboardSummaryResponse>> {
    try {
      const { warehouseId, role } = dto;
      
      const isSuperAdmin = role === Role.SUPER_ADMIN;
      const isManager = role === Role.WH_MANAGER;

      let whereInventory: any = {};
      if (warehouseId) {
         whereInventory.warehouseId = warehouseId;
      }

      // 1. Total Items (Sum of all stocks)
      const totalItemsResult = await this.prisma.inventory.aggregate({
        where: whereInventory,
        _sum: { stock: true }
      });
      const totalItems = totalItemsResult._sum.stock || 0;

      // 2. Low Stock Count
      // Ambil threshold dari settings. Karena ini dummy/hardcoded di contract, pakai 10 dulu
      // Idealnya get dari Settings table
      let threshold = 10; 
      const lowStockCount = await this.prisma.inventory.count({
        where: {
          ...whereInventory,
          stock: { lt: threshold }
        }
      });

      // 3. Pending Transfers (only for Manager acting as target warehouse, or Super Admin)
      let pendingTransfers = 0;
      if (isManager || isSuperAdmin) {
         let pendingWhere: any = {
           type: TransactionType.TRANSFER,
           status: TransactionStatus.PENDING
         };
         if (warehouseId) pendingWhere.targetWarehouseId = warehouseId;

         pendingTransfers = await this.prisma.transaction.count({
           where: pendingWhere
         });
      }

      // 4. Total Inventory Value (Only for Super Admin)
      let totalInventoryValue = undefined;
      if (isSuperAdmin) {
         // Harus join inventory dengan product untuk get purchasePrice
         const inventories = await this.prisma.inventory.findMany({
           where: whereInventory,
           include: { product: true }
         });

         let value = 0;
         for (const inv of inventories) {
            if (inv.product.purchasePrice) {
               value += inv.stock * Number(inv.product.purchasePrice);
            }
         }
         totalInventoryValue = value;
      }

      return Result.ok({
        totalItems,
        lowStockCount,
        ...(isSuperAdmin && { totalInventoryValue }),
        ...((isManager || isSuperAdmin) && { pendingTransfers })
      });

    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil ringkasan dashboard'));
    }
  }
}
