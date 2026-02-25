import { IRefreshTokenRepository } from '../../repositories/IRefreshTokenRepository';
import { Result } from '../../errors/Result';
import { IHashService } from '../../services/IHashService';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(userId: string, incomingRefreshToken?: string): Promise<Result<void>> {
    // For simplicity, let's delete all tokens for the user on logout.
    await this.refreshTokenRepo.deleteByUserId(userId);
    
    return Result.ok(undefined);
  }
}
