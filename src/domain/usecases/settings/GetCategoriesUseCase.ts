import { injectable, inject } from 'tsyringe';
import { ICategoryRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Category } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { InternalServerError } from '../../errors/AppError';

@injectable()
export class GetCategoriesUseCase {
  constructor(@inject('ICategoryRepository') private readonly categoryRepo: ICategoryRepository) {}

  async execute(): Promise<Result<Category[]>> {
    try {
      const categories = await this.categoryRepo.findAll();
      return Result.ok(categories);
    } catch (error: any) {
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
