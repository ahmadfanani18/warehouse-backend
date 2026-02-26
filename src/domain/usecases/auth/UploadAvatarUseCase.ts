import { IUserRepository } from '../../repositories/IUserRepository';
import { Result } from '../../errors/Result';
import { User } from '../../entities/User';
import { NotFoundError } from '../../errors/AppError';
import { injectable, inject } from 'tsyringe';

// A mock upload service type for actual implementation
export interface IStorageService {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
}

@injectable()
export class UploadAvatarUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string, fileData: { buffer: Buffer; name: string; type: string }): Promise<Result<{ avatarUrl: string }>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return Result.fail(new NotFoundError('User tidak ditemukan'));
    }

    // 1. In real app, we would inject a storage service and upload the buffer
    // const avatarUrl = await this.storageService.uploadFile(fileData.buffer, fileData.name, fileData.type);
    
    // 2. For now, simulate returning a stub URL
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
    
    // 3. Update user 
    await this.userRepo.update(user.id, { avatarUrl });

    return Result.ok({ avatarUrl });
  }
}
