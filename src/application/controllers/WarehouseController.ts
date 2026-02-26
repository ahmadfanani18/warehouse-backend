import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetWarehousesUseCase } from '../../domain/usecases/warehouse/GetWarehousesUseCase';
import { CreateWarehouseUseCase } from '../../domain/usecases/warehouse/CreateWarehouseUseCase';
import { UpdateWarehouseUseCase } from '../../domain/usecases/warehouse/UpdateWarehouseUseCase';
import { DeleteWarehouseUseCase } from '../../domain/usecases/warehouse/DeleteWarehouseUseCase';
import { Role } from '../../domain/entities/User';
import { ForbiddenError } from '../../domain/errors/AppError';

@injectable()
export class WarehouseController {
  constructor(
    @inject(GetWarehousesUseCase) private readonly getWarehousesUseCase: GetWarehousesUseCase,
    @inject(CreateWarehouseUseCase) private readonly createWarehouseUseCase: CreateWarehouseUseCase,
    @inject(UpdateWarehouseUseCase) private readonly updateWarehouseUseCase: UpdateWarehouseUseCase,
    @inject(DeleteWarehouseUseCase) private readonly deleteWarehouseUseCase: DeleteWarehouseUseCase
  ) {}

  getWarehouses = async (req: Request, res: Response) => {
    try {
      // TODO: Filter warehouses based on user assigned rights if not SUPER_ADMIN
      const result = await this.getWarehousesUseCase.execute();
      
      if (!result.isSuccess) {
        return res.status(500).json({ error: result.error?.message });
      }

      // If user is Staff or Manager, they can only see warehouses they are assigned to
      let data = result.value;
      /* 
      // If we strictly implement assigned warehouses for all views:
      if (req.user && req.user.role !== Role.SUPER_ADMIN) {
         if (req.user.assignedWarehouseIds && req.user.assignedWarehouseIds.length > 0) {
            data = data.filter(w => req.user!.assignedWarehouseIds!.includes(w.id));
         } else {
            data = [];
         }
      }
      */

      return res.status(200).json({ data });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createWarehouse = async (req: Request, res: Response) => {
    try {
      const result = await this.createWarehouseUseCase.execute(req.body);

      if (!result.isSuccess) {
         // handle known errors (e.g validation)
         const err = result.error as any;
         const code = err.statusCode || 400;
         return res.status(code).json({ error: err.message });
      }

      return res.status(201).json({ message: 'Gudang berhasil ditambahkan', data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateWarehouse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.updateWarehouseUseCase.execute(id as string, req.body);

      if (!result.isSuccess) {
         const err = result.error as any;
         const code = err.statusCode || 400;
         return res.status(code).json({ error: err.message });
      }

      return res.status(200).json({ message: 'Gudang berhasil diupdate', data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteWarehouse = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.deleteWarehouseUseCase.execute(id as string);

      if (!result.isSuccess) {
         const err = result.error as any;
         const code = err.statusCode || 400;
         return res.status(code).json({ error: err.message });
      }

      return res.status(200).json({ message: 'Gudang berhasil dinonaktifkan' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}
