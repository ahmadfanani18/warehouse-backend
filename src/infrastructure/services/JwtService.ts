import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import { IJwtService, JwtPayload } from '../../domain/services/IJwtService';
import { User } from '../../domain/entities/User';
import { AuthTokens } from '../../domain/types/SharedTypes';
import { UnauthorizedError } from '../../domain/errors/AppError';

@injectable()
export class JwtService implements IJwtService {
  private readonly accessSecret = process.env.JWT_SECRET || 'super-secret';
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-super-secret';

  async generateTokenPair(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      warehouseIds: user.assignedWarehouseIds,
    };

    const accessToken = jwt.sign(payload, this.accessSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.accessSecret) as JwtPayload;
    } catch (e) {
      throw new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }

  generateResetToken(userId: string): string {
    return jwt.sign({ sub: userId }, this.accessSecret, { expiresIn: '1h' });
  }

  verifyResetToken(token: string): { sub: string } {
    try {
      return jwt.verify(token, this.accessSecret) as { sub: string };
    } catch (e) {
      throw new UnauthorizedError('Token reset password tidak valid atau kedaluwarsa');
    }
  }
}
