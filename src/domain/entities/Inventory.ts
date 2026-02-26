import { Product } from './Product';
import { Warehouse } from './WarehouseAndSettings';

export interface Inventory {
  id: string;
  productId: string;
  warehouseId: string;
  stock: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // Optional relations
  product?: Product;
  warehouse?: Warehouse;
}
