import { Category, Unit } from './WarehouseAndSettings';

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  unitId: string;
  purchasePrice: number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // Optional relations
  category?: Category;
  unit?: Unit;
}
