import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { CreateStockInUseCase } from '../../domain/usecases/transaction/CreateStockInUseCase';
import { CreateStockOutUseCase } from '../../domain/usecases/transaction/CreateStockOutUseCase';
import { CreateTransferUseCase } from '../../domain/usecases/transaction/CreateTransferUseCase';
import { ApproveTransferUseCase } from '../../domain/usecases/transaction/ApproveTransferUseCase';
import { RejectTransferUseCase } from '../../domain/usecases/transaction/RejectTransferUseCase';
import { GetTransactionsUseCase } from '../../domain/usecases/transaction/GetTransactionsUseCase';
import { TransactionType, TransactionStatus } from '../../domain/entities/Transaction';

@injectable()
export class TransactionController {
  constructor(
    @inject(CreateStockInUseCase) private createStockInUseCase: CreateStockInUseCase,
    @inject(CreateStockOutUseCase) private createStockOutUseCase: CreateStockOutUseCase,
    @inject(CreateTransferUseCase) private createTransferUseCase: CreateTransferUseCase,
    @inject(ApproveTransferUseCase) private approveTransferUseCase: ApproveTransferUseCase,
    @inject(RejectTransferUseCase) private rejectTransferUseCase: RejectTransferUseCase,
    @inject(GetTransactionsUseCase) private getTransactionsUseCase: GetTransactionsUseCase
  ) {}

  createStockIn = async (req: Request, res: Response): Promise<void> => {
    const { warehouseId, items, supplier, notes } = req.body;
    const createdBy = req.user!.sub; // from authMiddleware

    const result = await this.createStockInUseCase.execute({
      warehouseId, items, supplier, notes, createdBy
    });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(201).json({
      message: 'Transaksi stock in berhasil dibuat',
      data: result.value
    });
  };

  createStockOut = async (req: Request, res: Response): Promise<void> => {
    const { warehouseId, items, destination, notes } = req.body;
    const createdBy = req.user!.sub;

    const result = await this.createStockOutUseCase.execute({
      warehouseId, items, destination, notes, createdBy
    });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(201).json({
      message: 'Transaksi stock out berhasil dibuat',
      data: result.value
    });
  };

  createTransfer = async (req: Request, res: Response): Promise<void> => {
    const { sourceWarehouseId, targetWarehouseId, items, notes } = req.body;
    const createdBy = req.user!.sub;

    const result = await this.createTransferUseCase.execute({
      sourceWarehouseId, targetWarehouseId, items, notes, createdBy
    });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(201).json({
      message: 'Transaksi transfer berhasil dibuat',
      data: result.value
    });
  };

  approveTransfer = async (req: Request, res: Response): Promise<void> => {
    const transactionId = req.params.id as string;
    const { notes } = req.body;
    const approvedBy = req.user!.sub;

    const result = await this.approveTransferUseCase.execute({ transactionId, approvedBy, notes });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json({
      message: 'Transaksi transfer berhasil disetujui',
      data: result.value
    });
  };

  rejectTransfer = async (req: Request, res: Response): Promise<void> => {
    const transactionId = req.params.id as string;
    const { reason } = req.body;
    const approvedBy = req.user!.sub;

    const result = await this.rejectTransferUseCase.execute({ transactionId, approvedBy, reason });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json({
      message: 'Transaksi transfer ditolak',
      data: result.value
    });
  };

  getPendingTransfers = async (req: Request, res: Response): Promise<void> => {
    const warehouseId = (req.query.warehouseId as string | undefined) || (req as any).warehouseId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.getTransactionsUseCase.execute({
      warehouseId, // Filter by warehouse ID (either source or target will be picked up)
      type: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      page,
      limit
    });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    const { data, total } = result.value!;
    
    // Additional filtering logic if warehouseId is specified: only show pending transfers where targetWarehouseId == warehouseId
    // since the API contract says: Role: WH_MANAGER (Untuk gudang tujuan transfer)
    let filteredData = data;
    if (warehouseId) {
      filteredData = data.filter(t => t.targetWarehouseId === warehouseId);
    }

    res.status(200).json({
      data: filteredData,
      total: filteredData.length, // approximation after filter
      page,
      limit,
      totalPages: Math.ceil(filteredData.length / limit)
    });
  }

  getHistory = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const warehouseId = (req.query.warehouseId as string | undefined) || (req as any).warehouseId;
    const type = req.query.type as TransactionType | undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const search = req.query.search as string | undefined;

    const result = await this.getTransactionsUseCase.execute({
      warehouseId, type, startDate, endDate, search, page, limit
    });

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
}
