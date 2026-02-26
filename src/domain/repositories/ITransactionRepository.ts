import { Transaction, TransactionType, TransactionStatus } from '../entities/Transaction';

export interface CreateTransactionDTO {
  type: TransactionType;
  warehouseId: string | null;
  targetWarehouseId: string | null;
  supplier: string | null;
  destination: string | null;
  notes: string | null;
  createdBy: string;
  status: TransactionStatus;
  items: { productId: string; quantity: number }[];
}

export interface GetTransactionsParams {
  warehouseId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page: number;
  limit: number;
}

export interface ITransactionRepository {
  createTransaction(data: CreateTransactionDTO): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  updateTransactionStatus(id: string, status: TransactionStatus, approvedBy: string, notes?: string): Promise<Transaction>;
  getTransactions(params: GetTransactionsParams): Promise<{ data: Transaction[]; total: number }>;
}
