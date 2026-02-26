import { IUserRepository } from '../../repositories/IUserRepository';
import { Result } from '../../errors/Result';
import { User } from '../../entities/User';
import { NotFoundError } from '../../errors/AppError';
import { injectable, inject } from 'tsyringe';

export interface UpdateProfileDTO {
  userId: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

@injectable()
export class UpdateProfileUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: UpdateProfileDTO): Promise<Result<User>> {
    const user = await this.userRepo.findById(dto.userId);
    if (!user) {
      return Result.fail(new NotFoundError('User tidak ditemukan'));
    }

    const updatedUser = await this.userRepo.update(user.id, {
      name: dto.name,
      avatarUrl: dto.avatarUrl,
      // phone: dto.phone, // Assuming phone is added to schema later if needed
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return Result.ok(userWithoutPassword as User);
  }
}
