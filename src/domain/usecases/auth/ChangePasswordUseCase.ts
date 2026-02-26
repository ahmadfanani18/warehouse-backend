import { IUserRepository } from '../../repositories/IUserRepository';
import { IHashService } from '../../services/IHashService';
import { Result } from '../../errors/Result';
import { InvalidCredentialsError, NotFoundError } from '../../errors/AppError';
import { injectable, inject } from 'tsyringe';

export interface ChangePasswordDTO {
  userId: string;
  currentPassword?: string;
  newPassword?: string;
  isReset?: boolean;
}

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
    @inject('IHashService') private readonly hashService: IHashService,
  ) {}

  async execute(dto: ChangePasswordDTO): Promise<Result<void>> {
    const user = await this.userRepo.findById(dto.userId);
    if (!user) {
      return Result.fail(new NotFoundError('User tidak ditemukan'));
    }

    // Normal change password requires old password validation
    if (!dto.isReset) {
      if (!dto.currentPassword) {
        return Result.fail(new InvalidCredentialsError('Password lama harus diisi'));
      }
      const valid = await this.hashService.compare(dto.currentPassword, user.password);
      if (!valid) {
        return Result.fail(new InvalidCredentialsError('Password lama salah'));
      }
    }

    if (!dto.newPassword) {
      return Result.fail(new InvalidCredentialsError('Password baru harus diisi'));
    }

    const hashedNewPassword = await this.hashService.hash(dto.newPassword);
    await this.userRepo.update(user.id, { password: hashedNewPassword });

    return Result.ok(undefined);
  }
}
