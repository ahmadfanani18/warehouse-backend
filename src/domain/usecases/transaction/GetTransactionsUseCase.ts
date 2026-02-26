import { injectable, inject } from 'tsyringe';
import { ITransactionRepository, GetTransactionsParams } from '../../repositories/ITransactionRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/Transaction';

export interface GetTransactionsDTO {
  warehouseId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page: number;
  limit: number;
}

@injectable()
export class GetTransactionsUseCase {
  constructor(
    @inject('ITransactionRepository') private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: GetTransactionsDTO): Promise<Result<{ data: Transaction[]; total: number }>> {
    try {
      const result = await this.transactionRepo.getTransactions(dto);
      return Result.ok(result);
    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil data transaksi'));
    }
  }
}
