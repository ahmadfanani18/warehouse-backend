import { Product } from '../entities/Product';
import { Inventory } from '../entities/Inventory';

export interface GetInventoriesParams {
  warehouseId?: string;
  categoryId?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface IInventoryRepository {
  createProductWithInitialStock(
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    warehouseId: string,
    initialStock: number
  ): Promise<{ product: Product; inventory: Inventory }>;

  findProductBySku(sku: string): Promise<Product | null>;
  findProductById(id: string): Promise<Product | null>;

  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  getInventories(params: GetInventoriesParams): Promise<{ data: Inventory[]; total: number }>;
  
  // Gets all inventory records for a specific product across all warehouses, or a specific warehouse
  getInventoriesByProductId(productId: string, warehouseId?: string): Promise<Inventory[]>;
}
