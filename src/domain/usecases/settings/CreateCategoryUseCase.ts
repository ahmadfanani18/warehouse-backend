import { injectable, inject } from 'tsyringe';
import { ICategoryRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Category } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { ValidationError, InternalServerError } from '../../errors/AppError';

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

@injectable()
export class CreateCategoryUseCase {
  constructor(@inject('ICategoryRepository') private readonly categoryRepo: ICategoryRepository) {}

  async execute(data: CreateCategoryDTO): Promise<Result<Category>> {
    if (!data.name) {
      return Result.fail(new ValidationError('Nama kategori harus diisi'));
    }

    try {
      const category = await this.categoryRepo.create({
        ...data,
        description: data.description ?? null,
      });
      return Result.ok(category);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return Result.fail(new ValidationError('Kategori dengan nama ini sudah ada'));
      }
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
