import { IUserRepository } from '../../repositories/IUserRepository';
import { IHashService } from '../../services/IHashService';
import { IJwtService } from '../../services/IJwtService';
import { Result } from '../../errors/Result';
import { InvalidCredentialsError, NotFoundError } from '../../errors/AppError';
import { injectable, inject } from 'tsyringe';

export interface ResetPasswordDTO {
  token: string;
  newPassword?: string;
}

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
    @inject('IHashService') private readonly hashService: IHashService,
    @inject('IJwtService') private readonly jwtService: IJwtService,
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<Result<void>> {
    if (!dto.newPassword) {
      return Result.fail(new InvalidCredentialsError('Password baru harus diisi'));
    }

    try {
      // 1. Verify JWT reset token
      const payload = this.jwtService.verifyResetToken(dto.token);
      
      // 2. Find user
      const user = await this.userRepo.findById(payload.sub);
      if (!user) {
        return Result.fail(new NotFoundError('User tidak ditemukan'));
      }

      // 3. Hash new password and update
      const hashedNewPassword = await this.hashService.hash(dto.newPassword);
      await this.userRepo.update(user.id, { password: hashedNewPassword });

      return Result.ok(undefined);
    } catch (error: any) {
      return Result.fail(new InvalidCredentialsError('Token reset password tidak valid atau kedaluwarsa'));
    }
  }
}
