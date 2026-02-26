import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';
import { TransactionType } from '../../entities/Transaction';

export interface GetExpenditureReportDTO {
  startDate?: Date;
  endDate?: Date;
  warehouseId?: string;
}

export interface ExpenditureReportResponse {
  totalExpenditure: number;
  transactions: {
    referenceNumber: string;
    date: Date;
    type: string;
    warehouse: string;
    totalValue: number;
  }[];
}

@injectable()
export class GetExpenditureReportUseCase {
  private prisma = new PrismaClient();

  async execute(dto: GetExpenditureReportDTO): Promise<Result<ExpenditureReportResponse>> {
    try {
      const { warehouseId, startDate, endDate } = dto;
      
      let whereAuth: any = {
        type: TransactionType.STOCK_IN
      };
      
      if (warehouseId) {
         whereAuth.warehouseId = warehouseId;
      }
      
      if (startDate || endDate) {
         whereAuth.createdAt = {};
         if (startDate) whereAuth.createdAt.gte = startDate;
         if (endDate) whereAuth.createdAt.lte = endDate;
      }

      const inboundTransactions = await this.prisma.transaction.findMany({
        where: whereAuth,
        include: {
          items: {
             include: { product: true }
          },
          warehouse: true
        },
        orderBy: { createdAt: 'desc' }
      });

      let totalExpenditure = 0;
      
      const transactions = inboundTransactions.map(trx => {
        let value = 0;
        for (const item of trx.items) {
           if (item.product.purchasePrice) {
              value += item.quantity * Number(item.product.purchasePrice);
           }
        }
        totalExpenditure += value;
        
        return {
          referenceNumber: trx.referenceNumber,
          date: trx.createdAt,
          type: trx.type,
          warehouse: trx.warehouse?.name || 'N/A',
          totalValue: value
        };
      });

      return Result.ok({
        totalExpenditure,
        transactions
      });

    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil laporan pengeluaran'));
    }
  }
}
