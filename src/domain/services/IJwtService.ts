import { User } from '../entities/User';
import { AuthTokens } from '../types/SharedTypes';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  warehouseIds: string[];
}

export interface IJwtService {
  generateTokenPair(user: User): Promise<AuthTokens>;
  verifyAccessToken(token: string): JwtPayload;
  decodeToken(token: string): JwtPayload | null;
  generateResetToken(userId: string): string;
  verifyResetToken(token: string): { sub: string };
}
