import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe';
import { IRefreshTokenRepository, RefreshToken } from '../../domain/repositories/IRefreshTokenRepository';

@injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  private prisma = new PrismaClient();

  async create(userId: string, hashedToken: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });
  }

  async findByToken(hashedToken: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: { token: hashedToken },
    });
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.prisma.refreshToken.findMany({
      where: { userId },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteByToken(hashedToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token: hashedToken },
    });
  }

  async deleteExpired(): Promise<number> {
    const res = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    return res.count;
  }
}
