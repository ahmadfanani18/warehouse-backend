import { ITransactionRepository, CreateTransactionDTO, GetTransactionsParams } from '../../domain/repositories/ITransactionRepository';
import { Transaction, TransactionType, TransactionStatus } from '../../domain/entities/Transaction';
import { PrismaClient, Prisma } from '@prisma/client';
import { injectable } from 'tsyringe';

@injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  private prisma = new PrismaClient();

  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const { type, warehouseId, targetWarehouseId, supplier, destination, notes, createdBy, status, items } = data;

    // Generate unique reference number based on type and timestamp
    const dateStr = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    let prefix = 'TRX';
    if (type === TransactionType.STOCK_IN) prefix = 'IN';
    if (type === TransactionType.STOCK_OUT) prefix = 'OUT';
    if (type === TransactionType.TRANSFER) prefix = 'TRF';
    const referenceNumber = `${prefix}-${dateStr}-${randomStr}`;

    const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create Transaction
      const transaction = await tx.transaction.create({
        data: {
          referenceNumber,
          type,
          status,
          warehouseId,
          targetWarehouseId,
          supplier,
          destination,
          notes,
          createdBy,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity
            }))
          }
        },
        include: {
          creator: true,
          approver: true,
          warehouse: true,
          targetWarehouse: true,
          items: {
            include: { product: { include: { category: true, unit: true } } }
          }
        }
      });

      // 2. Adjust Inventories if status is COMPLETED (for STOCK_IN and STOCK_OUT)
      if (status === TransactionStatus.COMPLETED) {
        for (const item of items) {
          if (type === TransactionType.STOCK_IN && warehouseId) {
             await this.increaseStock(tx, item.productId, warehouseId, item.quantity);
          } else if (type === TransactionType.STOCK_OUT && warehouseId) {
             await this.decreaseStock(tx, item.productId, warehouseId, item.quantity);
          } 
        }
      }

      // TRANSFER logic adjusts stock upon approval (handled in updateTransactionStatus)

      return transaction;
    });

    return this.toDomain(result);
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        creator: true,
        approver: true,
        warehouse: true,
        targetWarehouse: true,
        items: {
          include: { product: { include: { category: true, unit: true } } }
        }
      }
    });
    return transaction ? this.toDomain(transaction) : null;
  }

  async updateTransactionStatus(id: string, status: TransactionStatus, approvedBy: string, notes?: string): Promise<Transaction> {
    const transactionData = await this.prisma.transaction.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!transactionData) {
      throw new Error('Transaksi tidak ditemukan');
    }

    const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedTx = await tx.transaction.update({
        where: { id },
        data: { 
          status, 
          approvedBy,
          ...(notes && { notes: transactionData.notes ? `${transactionData.notes}\n${notes}` : notes })
        },
        include: {
          creator: true,
          approver: true,
          warehouse: true,
          targetWarehouse: true,
          items: {
            include: { product: { include: { category: true, unit: true } } }
          }
        }
      });

      // Adjust stock for TRANSFER if APPROVED
      if (transactionData.type === TransactionType.TRANSFER && status === TransactionStatus.APPROVED) {
         if (!transactionData.warehouseId || !transactionData.targetWarehouseId) {
           throw new Error('Data warehouse tidak lengkap untuk transfer');
         }

         for (const item of transactionData.items) {
           // Decrease from source
           await this.decreaseStock(tx, item.productId, transactionData.warehouseId, item.quantity);
           // Increase in target
           await this.increaseStock(tx, item.productId, transactionData.targetWarehouseId, item.quantity);
         }
      }

      return updatedTx;
    });

    return this.toDomain(result);
  }

  async getTransactions(params: GetTransactionsParams): Promise<{ data: Transaction[]; total: number }> {
    const { warehouseId, type, status, startDate, endDate, search, page, limit } = params;

    const where: Prisma.TransactionWhereInput = {};

    if (type) where.type = type;
    if (status) where.status = status;

    if (warehouseId) {
      where.OR = [
        { warehouseId: warehouseId },
        { targetWarehouseId: warehouseId }
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    if (search) {
      where.referenceNumber = { contains: search, mode: 'insensitive' };
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: true,
          approver: true,
          warehouse: true,
          targetWarehouse: true,
          items: {
            include: { product: { include: { category: true, unit: true } } }
          }
        }
      }),
      this.prisma.transaction.count({ where })
    ]);

    return {
      data: transactions.map((t: any) => this.toDomain(t)),
      total
    };
  }

  // --- Helper Methods ---

  private async increaseStock(tx: Prisma.TransactionClient, productId: string, warehouseId: string, quantity: number) {
    // Upsert inventori. Jika sudah ada, tambah. Jika tidak, buat baru.
    await tx.inventory.upsert({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId
        }
      },
      create: {
        productId,
        warehouseId,
        stock: quantity
      },
      update: {
        stock: { increment: quantity }
      }
    });
  }

  private async decreaseStock(tx: Prisma.TransactionClient, productId: string, warehouseId: string, quantity: number) {
    const currentInv = await tx.inventory.findUnique({
      where: {
        productId_warehouseId: { productId, warehouseId }
      }
    });

    if (!currentInv || currentInv.stock < quantity) {
      throw new Error(`Stok tidak mencukupi untuk product ${productId} di gudang ${warehouseId}`);
    }

    await tx.inventory.update({
      where: {
        productId_warehouseId: { productId, warehouseId }
      },
      data: {
        stock: { decrement: quantity }
      }
    });
  }

  private toDomain(record: any): Transaction {
    return {
      id: record.id,
      referenceNumber: record.referenceNumber,
      type: record.type as TransactionType,
      status: record.status as TransactionStatus,
      warehouseId: record.warehouseId,
      targetWarehouseId: record.targetWarehouseId,
      supplier: record.supplier,
      destination: record.destination,
      notes: record.notes,
      createdBy: record.createdBy,
      approvedBy: record.approvedBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      // mapping relations
      ...(record.creator && {
        creator: {
          id: record.creator.id,
          name: record.creator.name,
          email: record.creator.email,
          role: record.creator.role,
        } as any
      }),
      ...(record.approver && {
        approver: {
          id: record.approver.id,
          name: record.approver.name,
          email: record.approver.email,
          role: record.approver.role,
        } as any
      }),
      ...(record.warehouse && { warehouse: record.warehouse }),
      ...(record.targetWarehouse && { targetWarehouse: record.targetWarehouse }),
      ...(record.items && {
        items: record.items.map((item: any) => ({
          id: item.id,
          transactionId: item.transactionId,
          productId: item.productId,
          quantity: item.quantity,
          createdAt: item.createdAt,
          ...(item.product && {
            product: {
              id: item.product.id,
              sku: item.product.sku,
              name: item.product.name,
              category: item.product.category,
              unit: item.product.unit,
            }
          })
        }))
      })
    };
  }
}
