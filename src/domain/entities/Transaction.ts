import { User } from './User';
import { Warehouse } from './WarehouseAndSettings';
import { Product } from './Product';

export enum TransactionType {
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT',
  TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  createdAt?: string | Date;

  // relations
  product?: Product;
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  type: TransactionType;
  status: TransactionStatus;
  
  warehouseId: string | null;
  targetWarehouseId: string | null;
  supplier: string | null;
  destination: string | null;
  notes: string | null;

  createdBy: string;
  approvedBy: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // relations
  items?: TransactionItem[];
  creator?: User;
  approver?: User;
  warehouse?: Warehouse;
  targetWarehouse?: Warehouse;
}
