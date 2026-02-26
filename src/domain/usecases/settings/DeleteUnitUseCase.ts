import { injectable, inject } from 'tsyringe';
import { IUnitRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Result } from '../../errors/Result';
import { NotFoundError, InternalServerError } from '../../errors/AppError';

@injectable()
export class DeleteUnitUseCase {
  constructor(@inject('IUnitRepository') private readonly unitRepo: IUnitRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      const existing = await this.unitRepo.findById(id);
      if (!existing) {
        return Result.fail(new NotFoundError('Satuan'));
      }

      await this.unitRepo.delete(id);
      return Result.ok();
    } catch (error: any) {
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
