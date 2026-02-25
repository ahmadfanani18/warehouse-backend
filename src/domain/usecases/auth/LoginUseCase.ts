import { IUserRepository } from '../../repositories/IUserRepository';
import { IJwtService } from '../../services/IJwtService';
import { IHashService } from '../../services/IHashService';
import { IRefreshTokenRepository } from '../../repositories/IRefreshTokenRepository';
import { Result } from '../../errors/Result';
import { InvalidCredentialsError } from '../../errors/AppError';
import { AuthTokens } from '../../types/SharedTypes';

export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly hashService: IHashService,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(email: string, password: string): Promise<Result<AuthTokens>> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.isActive) return Result.fail(new InvalidCredentialsError());

    const valid = await this.hashService.compare(password, user.password);
    if (!valid) return Result.fail(new InvalidCredentialsError());

    // Generate token pair
    const tokens = await this.jwtService.generateTokenPair(user);

    // Hash refresh token for DB storage
    const hashedRefresh = await this.hashService.hash(tokens.refreshToken);
    
    // Save to DB (expires in 30 days roughly)
    await this.refreshTokenRepo.create(
      user.id,
      hashedRefresh,
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    // Update lastLoginAt
    await this.userRepo.update(user.id, { lastLoginAt: new Date() });

    return Result.ok(tokens);
  }
}
