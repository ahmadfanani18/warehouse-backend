import { injectable, inject } from 'tsyringe';
import { ITransactionRepository } from '../../repositories/ITransactionRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { Transaction, TransactionStatus, TransactionType } from '../../entities/Transaction';

export interface RejectTransferDTO {
  transactionId: string;
  approvedBy: string; // The person who rejects it
  reason: string;
}

@injectable()
export class RejectTransferUseCase {
  constructor(
    @inject('ITransactionRepository') private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: RejectTransferDTO): Promise<Result<Transaction>> {
    try {
      if (!dto.transactionId || !dto.approvedBy || !dto.reason) {
        return Result.fail(new ValidationError('ID Transaksi, user, dan alasan penolakan harus diisi'));
      }

      const transaction = await this.transactionRepo.findById(dto.transactionId);
      
      if (!transaction) {
        return Result.fail(new NotFoundError('Transaksi tidak ditemukan'));
      }

      if (transaction.type !== TransactionType.TRANSFER) {
         return Result.fail(new ValidationError('Hanya transaksi TRANSFER yang bisa ditolak'));
      }

      if (transaction.status !== TransactionStatus.PENDING) {
         return Result.fail(new ValidationError(`Transaksi transfer sudah memiliki status: ${transaction.status}`));
      }

      const updatedTransaction = await this.transactionRepo.updateTransactionStatus(
        dto.transactionId,
        TransactionStatus.REJECTED,
        dto.approvedBy,
        `Ditolak: ${dto.reason}`
      );

      return Result.ok(updatedTransaction);
    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal menolak transaksi transfer'));
    }
  }
}
