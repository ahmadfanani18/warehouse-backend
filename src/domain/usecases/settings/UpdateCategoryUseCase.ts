import { injectable, inject } from 'tsyringe';
import { ICategoryRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Category } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { NotFoundError, ValidationError, InternalServerError } from '../../errors/AppError';

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

@injectable()
export class UpdateCategoryUseCase {
  constructor(@inject('ICategoryRepository') private readonly categoryRepo: ICategoryRepository) {}

  async execute(id: string, data: UpdateCategoryDTO): Promise<Result<Category>> {
    try {
      const existing = await this.categoryRepo.findById(id);
      if (!existing) {
        return Result.fail(new NotFoundError('Kategori'));
      }

      const updated = await this.categoryRepo.update(id, data);
      return Result.ok(updated);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return Result.fail(new ValidationError('Kategori dengan nama ini sudah ada'));
      }
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
