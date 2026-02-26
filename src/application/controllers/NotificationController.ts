import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetNotificationsUseCase } from '../../domain/usecases/notification/GetNotificationsUseCase';
import { MarkNotificationAsReadUseCase } from '../../domain/usecases/notification/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../domain/usecases/notification/MarkAllNotificationsAsReadUseCase';

@injectable()
export class NotificationController {
  constructor(
    @inject(GetNotificationsUseCase) private getNotificationsUseCase: GetNotificationsUseCase,
    @inject(MarkNotificationAsReadUseCase) private markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    @inject(MarkAllNotificationsAsReadUseCase) private markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase
  ) {}

  getNotifications = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.sub;

    const result = await this.getNotificationsUseCase.execute({ userId });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json(result.value);
  };

  markAsRead = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.sub;
    const notificationId = req.params.id as string;

    const result = await this.markNotificationAsReadUseCase.execute({ userId, notificationId });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json({ message: 'Notifikasi telah dibaca' });
  };

  markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.sub;

    const result = await this.markAllNotificationsAsReadUseCase.execute({ userId });

    if (!result.isSuccess) {
      const error = result.error;
      res.status(error?.statusCode || 500).json({ error: error?.message });
      return;
    }

    res.status(200).json({ message: 'Semua notifikasi telah dibaca' });
  };
}
