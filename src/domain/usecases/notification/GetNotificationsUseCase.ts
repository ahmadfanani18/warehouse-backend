import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';

export interface GetNotificationsDTO {
  userId: string;
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata: any;
  createdAt: Date;
}

export interface GetNotificationsResponse {
  unreadCount: number;
  data: NotificationResponse[];
}

@injectable()
export class GetNotificationsUseCase {
  private prisma = new PrismaClient();

  async execute(dto: GetNotificationsDTO): Promise<Result<GetNotificationsResponse>> {
    try {
      const { userId } = dto;
      
      const notifications = await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      const unreadCount = notifications.filter(n => !n.isRead).length;

      const data = notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        metadata: n.metadata,
        createdAt: n.createdAt
      }));

      return Result.ok({
        unreadCount,
        data
      });

    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil daftar notifikasi'));
    }
  }
}
