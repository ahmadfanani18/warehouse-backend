import { injectable, inject } from 'tsyringe';
import { IUnitRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Unit } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { NotFoundError, ValidationError, InternalServerError } from '../../errors/AppError';

export interface UpdateUnitDTO {
  name?: string;
  abbreviation?: string;
}

@injectable()
export class UpdateUnitUseCase {
  constructor(@inject('IUnitRepository') private readonly unitRepo: IUnitRepository) {}

  async execute(id: string, data: UpdateUnitDTO): Promise<Result<Unit>> {
    try {
      const existing = await this.unitRepo.findById(id);
      if (!existing) {
        return Result.fail(new NotFoundError('Satuan'));
      }

      const updated = await this.unitRepo.update(id, data);
      return Result.ok(updated);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return Result.fail(new ValidationError('Satuan dengan nama atau singkatan ini sudah ada'));
      }
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
