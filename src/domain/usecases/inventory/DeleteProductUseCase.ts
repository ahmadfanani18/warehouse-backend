import { injectable, inject } from 'tsyringe';
import { IInventoryRepository } from '../../repositories/IInventoryRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, NotFoundError, ValidationError } from '../../../domain/errors/AppError';

@injectable()
export class DeleteProductUseCase {
  constructor(
    @inject('IInventoryRepository') private inventoryRepo: IInventoryRepository
  ) {}

  async execute(sku: string): Promise<Result<void>> {
    try {
      if (!sku) {
        return Result.fail(new ValidationError('SKU harus disertakan'));
      }

      const existingProduct = await this.inventoryRepo.findProductBySku(sku);
      if (!existingProduct) {
        return Result.fail(new NotFoundError('Produk tidak ditemukan'));
      }

      await this.inventoryRepo.deleteProduct(existingProduct.id);

      return Result.ok();
    } catch (error: any) {
      if (error.code === 'P2003') {
         return Result.fail(new ValidationError('Produk tidak bisa dihapus karena ada di riwayat stok atau transaksi'));
      }
      return Result.fail(new InternalServerError('Gagal menghapus produk'));
    }
  }
}
