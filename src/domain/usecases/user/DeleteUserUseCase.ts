import { IUserRepository } from '../../repositories/IUserRepository';
import { Result } from '../../errors/Result';
import { NotFoundError } from '../../errors/AppError';
import { injectable, inject } from 'tsyringe';

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string): Promise<Result<void>> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      return Result.fail(new NotFoundError('User tidak ditemukan'));
    }

    // Soft delete is done in repository level (or we pass isActive: false)
    await this.userRepo.delete(id);

    return Result.ok(undefined);
  }
}
