import { IUserRepository } from '../../repositories/IUserRepository';
import { IJwtService } from '../../services/IJwtService';
import { IHashService } from '../../services/IHashService';
import { IRefreshTokenRepository } from '../../repositories/IRefreshTokenRepository';
import { Result } from '../../errors/Result';
import { InvalidCredentialsError } from '../../errors/AppError';
import { AuthTokens } from '../../types/SharedTypes';
import { User } from '../../entities/User';
import { injectable, inject } from 'tsyringe';

@injectable()
export class LoginUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
    @inject('IJwtService') private readonly jwtService: IJwtService,
    @inject('IHashService') private readonly hashService: IHashService,
    @inject('IRefreshTokenRepository') private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(email: string, password: string): Promise<Result<{ user: User; tokens: AuthTokens }>> {
    const cleanEmail = email.trim();
    const user = await this.userRepo.findByEmail(cleanEmail);
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

    // Exclude password before returning user
    const { password: _, ...userWithoutPassword } = user;
    return Result.ok({ user: userWithoutPassword as User, tokens });
  }
}
