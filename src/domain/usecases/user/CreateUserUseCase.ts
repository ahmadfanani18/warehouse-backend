import { IUserRepository, CreateUserDTO } from '../../repositories/IUserRepository';
import { IHashService } from '../../services/IHashService';
import { Result } from '../../errors/Result';
import { User } from '../../entities/User';
import { ConflictError, InvalidCredentialsError } from '../../errors/AppError';
import { injectable, inject } from 'tsyringe';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
    @inject('IHashService') private readonly hashService: IHashService,
  ) {}

  async execute(dto: CreateUserDTO): Promise<Result<User>> {
    // 1. Validasi manual sederhana (bisa didelegasikan ke Zod di Controller)
    if (!dto.email || !dto.password || !dto.name || !dto.role) {
      return Result.fail(new InvalidCredentialsError('Data user tidak lengkap'));
    }

    // 2. Cek email duplikat
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      return Result.fail(new ConflictError(`User dengan email ${dto.email} sudah terdaftar`));
    }

    // 3. Hash password
    const hashedPassword = await this.hashService.hash(dto.password);

    // 4. Create di repository
    const newUser = await this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    // 5. Hilangkan password dari output
    const { password: _, ...userWithoutPassword } = newUser;
    return Result.ok(userWithoutPassword as User);
  }
}
