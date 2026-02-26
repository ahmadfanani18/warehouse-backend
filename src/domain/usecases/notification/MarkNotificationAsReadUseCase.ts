import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError, NotFoundError } from '../../../domain/errors/AppError';

export interface MarkNotificationAsReadDTO {
  userId: string;
  notificationId: string;
}

@injectable()
export class MarkNotificationAsReadUseCase {
  private prisma = new PrismaClient();

  async execute(dto: MarkNotificationAsReadDTO): Promise<Result<void>> {
    try {
      const { userId, notificationId } = dto;
      
      const notification = await this.prisma.notification.findFirst({
        where: { id: notificationId, userId }
      });

      if (!notification) {
        return Result.fail(new NotFoundError('Notifikasi tidak ditemukan'));
      }

      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });

      return Result.ok(undefined);

    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal menandai notifikasi telah dibaca'));
    }
  }
}
