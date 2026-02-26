import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';

// Categories
import { GetCategoriesUseCase } from '../../domain/usecases/settings/GetCategoriesUseCase';
import { CreateCategoryUseCase } from '../../domain/usecases/settings/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '../../domain/usecases/settings/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../domain/usecases/settings/DeleteCategoryUseCase';

// Units
import { GetUnitsUseCase } from '../../domain/usecases/settings/GetUnitsUseCase';
import { CreateUnitUseCase } from '../../domain/usecases/settings/CreateUnitUseCase';
import { UpdateUnitUseCase } from '../../domain/usecases/settings/UpdateUnitUseCase';
import { DeleteUnitUseCase } from '../../domain/usecases/settings/DeleteUnitUseCase';

@injectable()
export class SettingsController {
  constructor(
    @inject(GetCategoriesUseCase) private readonly getCategoriesUseCase: GetCategoriesUseCase,
    @inject(CreateCategoryUseCase) private readonly createCategoryUseCase: CreateCategoryUseCase,
    @inject(UpdateCategoryUseCase) private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    @inject(DeleteCategoryUseCase) private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    
    @inject(GetUnitsUseCase) private readonly getUnitsUseCase: GetUnitsUseCase,
    @inject(CreateUnitUseCase) private readonly createUnitUseCase: CreateUnitUseCase,
    @inject(UpdateUnitUseCase) private readonly updateUnitUseCase: UpdateUnitUseCase,
    @inject(DeleteUnitUseCase) private readonly deleteUnitUseCase: DeleteUnitUseCase
  ) {}

  // --- CATEGORIES ---
  getCategories = async (req: Request, res: Response) => {
    try {
      const result = await this.getCategoriesUseCase.execute();
      if (!result.isSuccess) {
        return res.status(500).json({ error: result.error?.message });
      }
      return res.status(200).json({ data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const result = await this.createCategoryUseCase.execute(req.body);
      if (!result.isSuccess) {
         const err = result.error as any;
         return res.status(err.statusCode || 400).json({ error: err.message });
      }
      return res.status(201).json({ message: 'Kategori berhasil ditambahkan', data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const result = await this.updateCategoryUseCase.execute(req.params.id as string, req.body);
      if (!result.isSuccess) {
         const err = result.error as any;
         return res.status(err.statusCode || 400).json({ error: err.message });
      }
      return res.status(200).json({ message: 'Kategori berhasil diupdate', data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteCategoryUseCase.execute(req.params.id as string);
      if (!result.isSuccess) {
         const err = result.error as any;
         return res.status(err.statusCode || 400).json({ error: err.message });
      }
      return res.status(200).json({ message: 'Kategori berhasil dihapus' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  // --- UNITS ---
  getUnits = async (req: Request, res: Response) => {
    try {
      const result = await this.getUnitsUseCase.execute();
      if (!result.isSuccess) {
        return res.status(500).json({ error: result.error?.message });
      }
      return res.status(200).json({ data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  createUnit = async (req: Request, res: Response) => {
    try {
      const result = await this.createUnitUseCase.execute(req.body);
      if (!result.isSuccess) {
         const err = result.error as any;
         return res.status(err.statusCode || 400).json({ error: err.message });
      }
      return res.status(201).json({ message: 'Satuan berhasil ditambahkan', data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateUnit = async (req: Request, res: Response) => {
    try {
      const result = await this.updateUnitUseCase.execute(req.params.id as string, req.body);
      if (!result.isSuccess) {
         const err = result.error as any;
         return res.status(err.statusCode || 400).json({ error: err.message });
      }
      return res.status(200).json({ message: 'Satuan berhasil diupdate', data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteUnit = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteUnitUseCase.execute(req.params.id as string);
      if (!result.isSuccess) {
         const err = result.error as any;
         return res.status(err.statusCode || 400).json({ error: err.message });
      }
      return res.status(200).json({ message: 'Satuan berhasil dihapus' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}
