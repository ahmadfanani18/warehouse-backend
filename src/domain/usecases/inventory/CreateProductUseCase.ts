import { injectable, inject } from 'tsyringe';
import { IInventoryRepository } from '../../repositories/IInventoryRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, ValidationError } from '../../../domain/errors/AppError';
import { Product } from '../../entities/Product';
import { Inventory } from '../../entities/Inventory';

export interface CreateProductDTO {
  sku: string;
  name: string;
  categoryId: string;
  unitId: string;
  warehouseId: string;
  purchasePrice?: number;
  stock: number;
}

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject('IInventoryRepository') private inventoryRepo: IInventoryRepository
  ) {}

  async execute(dto: CreateProductDTO): Promise<Result<{ product: Product; inventory: Inventory }>> {
    try {
      if (!dto.sku || !dto.name || !dto.categoryId || !dto.unitId || !dto.warehouseId) {
        return Result.fail(new ValidationError('Data produk dan gudang tidak lengkap'));
      }

      const existingProduct = await this.inventoryRepo.findProductBySku(dto.sku);
      if (existingProduct) {
        return Result.fail(new ValidationError('SKU sudah terdaftar'));
      }

      if (dto.stock < 0) {
        return Result.fail(new ValidationError('Stok awal tidak boleh negatif'));
      }

      const result = await this.inventoryRepo.createProductWithInitialStock(
        {
          sku: dto.sku,
          name: dto.name,
          categoryId: dto.categoryId,
          unitId: dto.unitId,
          purchasePrice: dto.purchasePrice ?? null,
        },
        dto.warehouseId,
        dto.stock
      );

      return Result.ok(result);
    } catch (error: any) {
      if (error.code === 'P2003') {
         return Result.fail(new ValidationError('Kategori, Satuan, atau Gudang tidak ditemukan'));
      }
      return Result.fail(new InternalServerError('Gagal membuat produk'));
    }
  }
}
