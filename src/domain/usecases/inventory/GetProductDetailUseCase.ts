import { injectable, inject } from 'tsyringe';
import { IInventoryRepository } from '../../repositories/IInventoryRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { Product } from '../../entities/Product';
import { Inventory } from '../../entities/Inventory';

export interface GetProductDetailDTO {
  sku: string;
  warehouseId?: string;
}

@injectable()
export class GetProductDetailUseCase {
  constructor(
    @inject('IInventoryRepository') private inventoryRepo: IInventoryRepository
  ) {}

  async execute(dto: GetProductDetailDTO): Promise<Result<{ product: Product; inventories: Inventory[] }>> {
    try {
      if (!dto.sku) {
        return Result.fail(new ValidationError('SKU harus disertakan'));
      }

      const product = await this.inventoryRepo.findProductBySku(dto.sku);
      if (!product) {
        return Result.fail(new NotFoundError('Produk tidak ditemukan'));
      }

      const inventories = await this.inventoryRepo.getInventoriesByProductId(product.id, dto.warehouseId);

      return Result.ok({ product, inventories });
    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil detail produk'));
    }
  }
}
