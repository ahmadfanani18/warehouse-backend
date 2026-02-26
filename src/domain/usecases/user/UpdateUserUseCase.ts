import { IUserRepository, UpdateUserDTO } from '../../repositories/IUserRepository';
import { Result } from '../../errors/Result';
import { User } from '../../entities/User';
import { NotFoundError } from '../../errors/AppError';
import { injectable, inject } from 'tsyringe';

export interface UpdateUserRequest extends UpdateUserDTO {
  id: string;
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(req: UpdateUserRequest): Promise<Result<User>> {
    const { id, ...updateData } = req;
    
    const user = await this.userRepo.findById(id);
    if (!user) {
      return Result.fail(new NotFoundError('User tidak ditemukan'));
    }

    const updatedUser = await this.userRepo.update(id, updateData);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return Result.ok(userWithoutPassword as User);
  }
}
