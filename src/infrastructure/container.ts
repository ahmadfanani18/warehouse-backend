import 'reflect-metadata';
import { container } from 'tsyringe';

import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from './repositories/PrismaRefreshTokenRepository';
import { PrismaWarehouseRepository, PrismaCategoryRepository, PrismaUnitRepository } from './repositories/PrismaWarehouseSettingsRepository';
import { PrismaInventoryRepository } from './repositories/PrismaInventoryRepository';
import { PrismaTransactionRepository } from './repositories/PrismaTransactionRepository';
import { JwtService } from './services/JwtService';
import { HashService } from './services/HashService';

import { LoginUseCase } from '../domain/usecases/auth/LoginUseCase';
import { LogoutUseCase } from '../domain/usecases/auth/LogoutUseCase';
import { GetMeUseCase } from '../domain/usecases/auth/GetMeUseCase';
import { UpdateProfileUseCase } from '../domain/usecases/auth/UpdateProfileUseCase';
import { UploadAvatarUseCase } from '../domain/usecases/auth/UploadAvatarUseCase';
import { ForgotPasswordUseCase } from '../domain/usecases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../domain/usecases/auth/ResetPasswordUseCase';
import { GetUsersUseCase } from '../domain/usecases/user/GetUsersUseCase';
import { CreateUserUseCase } from '../domain/usecases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '../domain/usecases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../domain/usecases/user/DeleteUserUseCase';

import { AuthController } from '../application/controllers/AuthController';
import { UserController } from '../application/controllers/UserController';

// Register Repositories
container.register('IUserRepository', { useClass: PrismaUserRepository });
container.register('IRefreshTokenRepository', { useClass: PrismaRefreshTokenRepository });
container.register('IWarehouseRepository', { useClass: PrismaWarehouseRepository });
container.register('ICategoryRepository', { useClass: PrismaCategoryRepository });
container.register('IUnitRepository', { useClass: PrismaUnitRepository });
container.register('IInventoryRepository', { useClass: PrismaInventoryRepository });
container.register('ITransactionRepository', { useClass: PrismaTransactionRepository });
// Register Services
container.register('IJwtService', { useClass: JwtService });
container.register('IHashService', { useClass: HashService });

// Register Auth UseCases
container.register(LoginUseCase, {
  useFactory: (c) =>
    new LoginUseCase(
      c.resolve('IUserRepository'),
      c.resolve('IJwtService'),
      c.resolve('IHashService'),
      c.resolve('IRefreshTokenRepository')
    ),
});

container.register(LogoutUseCase, {
  useFactory: (c) => new LogoutUseCase(c.resolve('IRefreshTokenRepository'), c.resolve('IHashService')),
});

container.register(GetMeUseCase, {
  useFactory: (c) => new GetMeUseCase(c.resolve('IUserRepository')),
});

container.register(UpdateProfileUseCase, {
  useFactory: (c) => new UpdateProfileUseCase(c.resolve('IUserRepository')),
});

container.register(UploadAvatarUseCase, {
  useFactory: (c) => new UploadAvatarUseCase(c.resolve('IUserRepository')),
});

container.register(ForgotPasswordUseCase, {
  useFactory: (c) => new ForgotPasswordUseCase(c.resolve('IUserRepository')),
});

container.register(ResetPasswordUseCase, {
  useFactory: (c) => new ResetPasswordUseCase(
    c.resolve('IUserRepository'),
    c.resolve('IHashService'),
    c.resolve('IJwtService')
  ),
});

// Register User Management UseCases
container.register(GetUsersUseCase, {
  useFactory: (c) => new GetUsersUseCase(c.resolve('IUserRepository')),
});

container.register(CreateUserUseCase, {
  useFactory: (c) => new CreateUserUseCase(c.resolve('IUserRepository'), c.resolve('IHashService')),
});

container.register(UpdateUserUseCase, {
  useFactory: (c) => new UpdateUserUseCase(c.resolve('IUserRepository')),
});

container.register(DeleteUserUseCase, {
  useFactory: (c) => new DeleteUserUseCase(c.resolve('IUserRepository')),
});

// Register Controllers
container.register(AuthController, { useClass: AuthController });
container.register(UserController, { useClass: UserController });

export { container };
