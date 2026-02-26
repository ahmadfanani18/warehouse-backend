import { injectable, inject } from 'tsyringe';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { Transaction, TransactionStatus, TransactionType } from '../../entities/Transaction';

export interface ApproveTransferDTO {
  transactionId: string;
  approvedBy: string;
  notes?: string;
}

@injectable()
export class ApproveTransferUseCase {
  constructor(
    @inject('ITransactionRepository') private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: ApproveTransferDTO): Promise<Result<Transaction>> {
    try {
      if (!dto.transactionId || !dto.approvedBy) {
        return Result.fail(new ValidationError('ID Transaksi dan user persetujuan harus diisi'));
      }

      const transaction = await this.transactionRepo.findById(dto.transactionId);
      
      if (!transaction) {
        return Result.fail(new NotFoundError('Transaksi tidak ditemukan'));
      }

      if (transaction.type !== TransactionType.TRANSFER) {
        return Result.fail(new ValidationError('Hanya transaksi TRANSFER yang bisa mendapatkan persetujuan'));
      }

      if (transaction.status !== TransactionStatus.PENDING) {
        return Result.fail(new ValidationError(`Transaksi transfer sudah memiliki status: ${transaction.status}`));
      }

      const updatedTransaction = await this.transactionRepo.updateTransactionStatus(
        dto.transactionId,
        TransactionStatus.APPROVED,
        dto.approvedBy,
        dto.notes
      );

      return Result.ok(updatedTransaction);
    } catch (error: any) {
      if (error.message && error.message.includes('Stok tidak mencukupi')) {
         return Result.fail(new ValidationError(error.message));
      }
      return Result.fail(new InternalServerError('Gagal menyetujui transaksi transfer'));
    }
  }
}
