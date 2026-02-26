import { injectable, inject } from 'tsyringe';
import { IInventoryRepository } from '../../repositories/IInventoryRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { Product } from '../../entities/Product';

export interface UpdateProductDTO {
  sku: string;
  name?: string;
  categoryId?: string;
  unitId?: string;
  purchasePrice?: number;
}

@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject('IInventoryRepository') private inventoryRepo: IInventoryRepository
  ) {}

  async execute(dto: UpdateProductDTO): Promise<Result<Product>> {
    try {
      if (!dto.sku) {
        return Result.fail(new ValidationError('SKU harus disertakan'));
      }

      const existingProduct = await this.inventoryRepo.findProductBySku(dto.sku);
      if (!existingProduct) {
        return Result.fail(new NotFoundError('Produk tidak ditemukan'));
      }

      const product = await this.inventoryRepo.updateProduct(existingProduct.id, {
        name: dto.name,
        categoryId: dto.categoryId,
        unitId: dto.unitId,
        purchasePrice: dto.purchasePrice,
      });

      return Result.ok(product);
    } catch (error: any) {
      if (error.code === 'P2003') {
         return Result.fail(new ValidationError('Kategori, atau Satuan tidak ditemukan'));
      }
      return Result.fail(new InternalServerError('Gagal mengupdate produk'));
    }
  }
}
