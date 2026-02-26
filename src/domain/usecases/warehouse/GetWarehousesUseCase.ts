import { injectable, inject } from 'tsyringe';
import { IWarehouseRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Warehouse } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { InternalServerError } from '../../errors/AppError';

@injectable()
export class GetWarehousesUseCase {
  constructor(@inject('IWarehouseRepository') private readonly warehouseRepo: IWarehouseRepository) {}

  async execute(): Promise<Result<Warehouse[]>> {
    try {
      const warehouses = await this.warehouseRepo.findAll();
      return Result.ok(warehouses);
    } catch (error: any) {
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
