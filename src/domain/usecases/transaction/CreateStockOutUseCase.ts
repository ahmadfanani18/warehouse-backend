import { injectable, inject } from 'tsyringe';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, ValidationError } from '../../../domain/errors/AppError';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/Transaction';

export interface CreateStockOutDTO {
  warehouseId: string;
  items: { sku: string; productId: string; quantity: number }[];
  destination?: string;
  notes?: string;
  createdBy: string;
}

@injectable()
export class CreateStockOutUseCase {
  constructor(
    @inject('ITransactionRepository') private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: CreateStockOutDTO): Promise<Result<Transaction>> {
    try {
      if (!dto.warehouseId || !dto.items || dto.items.length === 0) {
        return Result.fail(new ValidationError('Gudang dan item harus diisi'));
      }

      const transaction = await this.transactionRepo.createTransaction({
        type: TransactionType.STOCK_OUT,
        warehouseId: dto.warehouseId,
        targetWarehouseId: null,
        supplier: null,
        destination: dto.destination || null,
        notes: dto.notes || null,
        createdBy: dto.createdBy,
        status: TransactionStatus.COMPLETED, 
        items: dto.items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      });

      return Result.ok(transaction);
    } catch (error: any) {
      if (error.message && error.message.includes('Stok tidak mencukupi')) {
        return Result.fail(new ValidationError(error.message));
      }
      return Result.fail(new InternalServerError('Gagal membuat transaksi stock out'));
    }
  }
}
