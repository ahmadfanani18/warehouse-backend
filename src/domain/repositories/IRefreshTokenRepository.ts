export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IRefreshTokenRepository {
  create(userId: string, hashedToken: string, expiresAt: Date): Promise<void>;
  findByToken(hashedToken: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  deleteByUserId(userId: string): Promise<void>;
  deleteByToken(hashedToken: string): Promise<void>;
  deleteExpired(): Promise<number>;
}
