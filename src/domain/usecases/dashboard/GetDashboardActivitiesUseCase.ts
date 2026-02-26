import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../domain/errors/Result';
import { InternalServerError } from '../../../domain/errors/AppError';
import { Role } from '@prisma/client';

export interface DashboardActivitiesDTO {
  warehouseId?: string;
  role: string;
  userId: string;
  limit?: number;
}

export interface ActivityResponse {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user: string;
}

@injectable()
export class GetDashboardActivitiesUseCase {
  private prisma = new PrismaClient();

  async execute(dto: DashboardActivitiesDTO): Promise<Result<ActivityResponse[]>> {
    try {
      const { warehouseId, role, userId, limit = 5 } = dto;
      
      const isSuperAdmin = role === Role.SUPER_ADMIN;

      let whereAuth: any = {};
      
      // Jika Staff, hanya aktivitasnya sendiri
      if (role === Role.STAFF) {
         whereAuth.createdBy = userId;
      } else if (!isSuperAdmin && warehouseId) {
         // Manager: semua aktivitas di gudangnya
         whereAuth.OR = [
           { warehouseId: warehouseId },
           { targetWarehouseId: warehouseId }
         ];
      }

      const transactions = await this.prisma.transaction.findMany({
        where: whereAuth,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          creator: true
        }
      });

      const activities: ActivityResponse[] = transactions.map((t: any) => ({
        id: t.id,
        type: t.type,
        // Simplifikasi description untuk dashboard
        description: `${t.type} ${t.referenceNumber}`, 
        timestamp: t.createdAt,
        user: `${t.creator.name} (${t.creator.role})`
      }));

      return Result.ok(activities);

    } catch (error: any) {
      return Result.fail(new InternalServerError('Gagal mengambil aktivitas terbaru'));
    }
  }
}
