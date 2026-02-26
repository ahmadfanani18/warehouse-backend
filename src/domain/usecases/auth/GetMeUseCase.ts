import { IUserRepository } from '../../repositories/IUserRepository';
import { Result } from '../../errors/Result';
import { User } from '../../entities/User';
import { NotFoundError } from '../../errors/AppError';
import { injectable, inject } from 'tsyringe';

@injectable()
export class GetMeUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string): Promise<Result<User>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return Result.fail(new NotFoundError('User tidak ditemukan'));
    }

    // Omit password field
    const { password: _, ...userWithoutPassword } = user;
    return Result.ok(userWithoutPassword as User);
  }
}
