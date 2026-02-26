import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetStockReportUseCase } from '../../domain/usecases/report/GetStockReportUseCase';
import { GetFinancialReportUseCase } from '../../domain/usecases/report/GetFinancialReportUseCase';
import { GetExpenditureReportUseCase } from '../../domain/usecases/report/GetExpenditureReportUseCase';

@injectable()
export class ReportController {
  constructor(
    @inject(GetStockReportUseCase) private getStockReportUseCase: GetStockReportUseCase,
    @inject(GetFinancialReportUseCase) private getFinancialReportUseCase: GetFinancialReportUseCase,
    @inject(GetExpenditureReportUseCase) private getExpenditureReportUseCase: GetExpenditureReportUseCase
  ) {}

  getStockReport = async (req: Request, res: Response): Promise<void> => {
    const warehouseId = (req.query.warehouseId as string | undefined) || (req as any).warehouseId;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await this.getStockReportUseCase.execute({ warehouseId, startDate, endDate });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json(result.value);
  };

  getFinancialReport = async (req: Request, res: Response): Promise<void> => {
    // Only SUPER_ADMIN allowed, checked by middleware
    const warehouseId = req.query.warehouseId as string | undefined;

    const result = await this.getFinancialReportUseCase.execute({ warehouseId });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json(result.value);
  };

  getExpenditureReport = async (req: Request, res: Response): Promise<void> => {
    // Only SUPER_ADMIN allowed, checked by middleware
    const warehouseId = req.query.warehouseId as string | undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await this.getExpenditureReportUseCase.execute({ warehouseId, startDate, endDate });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json(result.value);
  };
}
