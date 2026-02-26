import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';

export interface MarkAllNotificationsAsReadDTO {
  userId: string;
}

@injectable()
export class MarkAllNotificationsAsReadUseCase {
  private prisma = new PrismaClient();

  async execute(dto: MarkAllNotificationsAsReadDTO): Promise<Result<void>> {
    try {
      const { userId } = dto;

      await this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });

      return Result.ok(undefined);

    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal menandai semua notifikasi telah dibaca'));
    }
  }
}
