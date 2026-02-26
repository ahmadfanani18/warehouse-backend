import { injectable, inject } from 'tsyringe';
import { IUnitRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Unit } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { ValidationError, InternalServerError } from '../../errors/AppError';

export interface CreateUnitDTO {
  name: string;
  abbreviation: string;
}

@injectable()
export class CreateUnitUseCase {
  constructor(@inject('IUnitRepository') private readonly unitRepo: IUnitRepository) {}

  async execute(data: CreateUnitDTO): Promise<Result<Unit>> {
    if (!data.name || !data.abbreviation) {
      return Result.fail(new ValidationError('Nama dan singkatan satuan harus diisi'));
    }

    try {
      const unit = await this.unitRepo.create(data);
      return Result.ok(unit);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return Result.fail(new ValidationError('Satuan dengan nama atau singkatan ini sudah ada'));
      }
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
