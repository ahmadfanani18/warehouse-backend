import { injectable, inject } from 'tsyringe';
import { IInventoryRepository, GetInventoriesParams } from '../../repositories/IInventoryRepository';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';
import { Inventory } from '../../entities/Inventory';

export interface GetInventoriesDTO extends GetInventoriesParams {}

@injectable()
export class GetInventoriesUseCase {
  constructor(
    @inject('IInventoryRepository') private inventoryRepo: IInventoryRepository
  ) {}

  async execute(dto: GetInventoriesDTO): Promise<Result<{ data: Inventory[]; total: number }>> {
    try {
      const result = await this.inventoryRepo.getInventories({
        warehouseId: dto.warehouseId,
        categoryId: dto.categoryId,
        search: dto.search,
        page: dto.page || 1,
        limit: dto.limit || 10,
      });

      return Result.ok(result);
    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil data inventory'));
    }
  }
}
