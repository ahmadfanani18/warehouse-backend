import { injectable, inject } from 'tsyringe';
import { IWarehouseRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Warehouse } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { NotFoundError, ValidationError, InternalServerError } from '../../errors/AppError';

export interface UpdateWarehouseDTO {
  code?: string;
  name?: string;
  address?: string;
  isActive?: boolean;
}

@injectable()
export class UpdateWarehouseUseCase {
  constructor(@inject('IWarehouseRepository') private readonly warehouseRepo: IWarehouseRepository) {}

  async execute(id: string, data: UpdateWarehouseDTO): Promise<Result<Warehouse>> {
    try {
      const existing = await this.warehouseRepo.findById(id);
      if (!existing) {
        return Result.fail(new NotFoundError('Gudang'));
      }

      const updated = await this.warehouseRepo.update(id, data);
      return Result.ok(updated);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return Result.fail(new ValidationError('Kode gudang sudah digunakan'));
      }
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
