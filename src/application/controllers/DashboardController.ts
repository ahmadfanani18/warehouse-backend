import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetDashboardSummaryUseCase } from '../../domain/usecases/dashboard/GetDashboardSummaryUseCase';
import { GetDashboardActivitiesUseCase } from '../../domain/usecases/dashboard/GetDashboardActivitiesUseCase';

@injectable()
export class DashboardController {
  constructor(
    @inject(GetDashboardSummaryUseCase) private getDashboardSummaryUseCase: GetDashboardSummaryUseCase,
    @inject(GetDashboardActivitiesUseCase) private getDashboardActivitiesUseCase: GetDashboardActivitiesUseCase
  ) {}

  getSummary = async (req: Request, res: Response): Promise<void> => {
    const warehouseId = (req.query.warehouseId as string | undefined) || (req as any).warehouseId;
    const role = req.user!.role;

    const result = await this.getDashboardSummaryUseCase.execute({ warehouseId, role });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json(result.value);
  };

  getActivities = async (req: Request, res: Response): Promise<void> => {
    const warehouseId = (req.query.warehouseId as string | undefined) || (req as any).warehouseId;
    const role = req.user!.role;
    const userId = req.user!.sub;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    const result = await this.getDashboardActivitiesUseCase.execute({ warehouseId, role, userId, limit });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json({ activities: result.value });
  };
}
