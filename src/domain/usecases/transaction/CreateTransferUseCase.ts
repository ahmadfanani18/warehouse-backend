import { injectable, inject } from 'tsyringe';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, ValidationError } from '../../../domain/errors/AppError';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/Transaction';

export interface CreateTransferDTO {
  sourceWarehouseId: string;
  targetWarehouseId: string;
  items: { sku: string; productId: string; quantity: number }[];
  notes?: string;
  createdBy: string;
}

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('ITransactionRepository') private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: CreateTransferDTO): Promise<Result<Transaction>> {
    try {
      if (!dto.sourceWarehouseId || !dto.targetWarehouseId || !dto.items || dto.items.length === 0) {
        return Result.fail(new ValidationError('Gudang asal, tujuan, dan item harus diisi'));
      }

      if (dto.sourceWarehouseId === dto.targetWarehouseId) {
        return Result.fail(new ValidationError('Gudang tujuan tidak boleh sama dengan gudang asal'));
      }

      // Membutuhkan approval, jadi default status PENDING
      const transaction = await this.transactionRepo.createTransaction({
        type: TransactionType.TRANSFER,
        warehouseId: dto.sourceWarehouseId,
        targetWarehouseId: dto.targetWarehouseId,
        supplier: null,
        destination: null,
        notes: dto.notes || null,
        createdBy: dto.createdBy,
        status: TransactionStatus.PENDING, 
        items: dto.items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      });

      return Result.ok(transaction);
    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal membuat transaksi transfer'));
    }
  }
}
