import { injectable, inject } from 'tsyringe';
import { ICategoryRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Result } from '../../errors/Result';
import { NotFoundError, InternalServerError } from '../../errors/AppError';

@injectable()
export class DeleteCategoryUseCase {
  constructor(@inject('ICategoryRepository') private readonly categoryRepo: ICategoryRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      const existing = await this.categoryRepo.findById(id);
      if (!existing) {
        return Result.fail(new NotFoundError('Kategori'));
      }

      await this.categoryRepo.delete(id);
      return Result.ok();
    } catch (error: any) {
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
