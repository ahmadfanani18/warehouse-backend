import { injectable, inject } from 'tsyringe';
import { IWarehouseRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Result } from '../../errors/Result';
import { NotFoundError, InternalServerError } from '../../errors/AppError';

@injectable()
export class DeleteWarehouseUseCase {
  constructor(@inject('IWarehouseRepository') private readonly warehouseRepo: IWarehouseRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      const existing = await this.warehouseRepo.findById(id);
      if (!existing) {
        return Result.fail(new NotFoundError('Gudang'));
      }

      await this.warehouseRepo.delete(id);
      return Result.ok();
    } catch (error: any) {
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
