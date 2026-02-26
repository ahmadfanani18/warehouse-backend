import { IRefreshTokenRepository } from '../../repositories/IRefreshTokenRepository';
import { Result } from '../../errors/Result';
import { IHashService } from '../../services/IHashService';
import { injectable, inject } from 'tsyringe';

@injectable()
export class LogoutUseCase {
  constructor(
    @inject('IRefreshTokenRepository') private readonly refreshTokenRepo: IRefreshTokenRepository,
    @inject('IHashService') private readonly hashService: IHashService,
  ) {}

  async execute(userId: string, incomingRefreshToken?: string): Promise<Result<void>> {
    // For simplicity, let's delete all tokens for the user on logout.
    await this.refreshTokenRepo.deleteByUserId(userId);
    
    return Result.ok(undefined);
  }
}
