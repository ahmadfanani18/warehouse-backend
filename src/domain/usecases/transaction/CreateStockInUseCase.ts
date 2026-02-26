import { injectable, inject } from 'tsyringe';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, ValidationError } from '../../../domain/errors/AppError';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/Transaction';

export interface CreateStockInDTO {
  warehouseId: string;
  items: { sku: string; productId: string; quantity: number }[];
  supplier?: string;
  notes?: string;
  createdBy: string;
}

@injectable()
export class CreateStockInUseCase {
  constructor(
    @inject('ITransactionRepository') private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: CreateStockInDTO): Promise<Result<Transaction>> {
    try {
      if (!dto.warehouseId || !dto.items || dto.items.length === 0) {
        return Result.fail(new ValidationError('Gudang dan item harus diisi'));
      }

      for (const item of dto.items) {
        if (item.quantity <= 0) {
          return Result.fail(new ValidationError('Kuantitas item harus lebih dari 0'));
        }
      }

      const transaction = await this.transactionRepo.createTransaction({
        type: TransactionType.STOCK_IN,
        warehouseId: dto.warehouseId,
        targetWarehouseId: null,
        supplier: dto.supplier || null,
        destination: null,
        notes: dto.notes || null,
        createdBy: dto.createdBy,
        status: TransactionStatus.COMPLETED, // Langsung selesai untuk stock in biasa (tergantung rule bisnis)
        items: dto.items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      });

      return Result.ok(transaction);
    } catch (error: any) {
      if (error instanceof ValidationError) return Result.fail(error);
      return Result.fail(new InternalServerError('Gagal membuat transaksi stock in'));
    }
  }
}
