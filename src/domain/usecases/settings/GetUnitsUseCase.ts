import { injectable, inject } from 'tsyringe';
import { IUnitRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Unit } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { InternalServerError } from '../../errors/AppError';

@injectable()
export class GetUnitsUseCase {
  constructor(@inject('IUnitRepository') private readonly unitRepo: IUnitRepository) {}

  async execute(): Promise<Result<Unit[]>> {
    try {
      const units = await this.unitRepo.findAll();
      return Result.ok(units);
    } catch (error: any) {
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
