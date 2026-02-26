import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetInventoriesUseCase } from '../../domain/usecases/inventory/GetInventoriesUseCase';
import { CreateProductUseCase } from '../../domain/usecases/inventory/CreateProductUseCase';
import { GetProductDetailUseCase } from '../../domain/usecases/inventory/GetProductDetailUseCase';
import { UpdateProductUseCase } from '../../domain/usecases/inventory/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../domain/usecases/inventory/DeleteProductUseCase';

@injectable()
export class InventoryController {
  constructor(
    @inject(GetInventoriesUseCase) private getInventoriesUseCase: GetInventoriesUseCase,
    @inject(CreateProductUseCase) private createProductUseCase: CreateProductUseCase,
    @inject(GetProductDetailUseCase) private getProductDetailUseCase: GetProductDetailUseCase,
    @inject(UpdateProductUseCase) private updateProductUseCase: UpdateProductUseCase,
    @inject(DeleteProductUseCase) private deleteProductUseCase: DeleteProductUseCase
  ) {}

  getInventories = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const warehouseId = (req.query.warehouseId as string | undefined) || (req as any).warehouseId;
    const categoryId = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await this.getInventoriesUseCase.execute({ page, limit, warehouseId, categoryId, search });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    const { data, total } = result.value!;
    res.status(200).json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  };

  getProductDetail = async (req: Request, res: Response): Promise<void> => {
    const sku = req.params.sku as string;
    const warehouseId = req.query.warehouseId as string | undefined;

    const result = await this.getProductDetailUseCase.execute({ sku, warehouseId });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json(result.value);
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    const { sku, name, categoryId, unitId, warehouseId, purchasePrice, stock } = req.body;

    const result = await this.createProductUseCase.execute({
      sku, name, categoryId, unitId, warehouseId, purchasePrice, stock
    });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(201).json({
      message: 'Produk dan stok awal berhasil ditambahkan',
      data: result.value
    });
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const sku = req.params.sku as string;
    const { name, categoryId, unitId, purchasePrice } = req.body;

    const result = await this.updateProductUseCase.execute({
      sku, name, categoryId, unitId, purchasePrice
    });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json({
      message: 'Produk berhasil diupdate',
      data: result.value
    });
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const sku = req.params.sku as string;
    const result = await this.deleteProductUseCase.execute(sku);

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json({ message: 'Produk berhasil dihapus' });
  };
}
