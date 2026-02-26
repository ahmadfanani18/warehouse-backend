import { injectable, inject } from 'tsyringe';
import { IWarehouseRepository } from '../../repositories/IWarehouseSettingsRepository';
import { Warehouse } from '../../entities/WarehouseAndSettings';
import { Result } from '../../errors/Result';
import { ValidationError, NotFoundError, InternalServerError } from '../../errors/AppError';

export interface CreateWarehouseDTO {
  code: string;
  name: string;
  address?: string;
  isActive?: boolean;
}

@injectable()
export class CreateWarehouseUseCase {
  constructor(@inject('IWarehouseRepository') private readonly warehouseRepo: IWarehouseRepository) {}

  async execute(data: CreateWarehouseDTO): Promise<Result<Warehouse>> {
    if (!data.code || !data.name) {
      return Result.fail(new ValidationError('Kode dan nama gudang harus diisi'));
    }

    try {
      const warehouse = await this.warehouseRepo.create({
        code: data.code,
        name: data.name,
        address: data.address ?? null,
        isActive: data.isActive ?? true,
      });
      return Result.ok(warehouse);
    } catch (error: any) {
      if (error.code === 'P2002') { // Prisma unique constraint violation
        return Result.fail(new ValidationError('Kode gudang sudah digunakan'));
      }
      return Result.fail(new InternalServerError(error.message));
    }
  }
}
