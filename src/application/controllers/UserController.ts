import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { GetMeUseCase } from '../../domain/usecases/auth/GetMeUseCase';
import { UpdateProfileUseCase } from '../../domain/usecases/auth/UpdateProfileUseCase';
import { UploadAvatarUseCase } from '../../domain/usecases/auth/UploadAvatarUseCase';
import { GetUsersUseCase } from '../../domain/usecases/user/GetUsersUseCase';
import { CreateUserUseCase } from '../../domain/usecases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '../../domain/usecases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../domain/usecases/user/DeleteUserUseCase';

@injectable()
export class UserController {
  constructor(
    @inject(GetMeUseCase) private readonly getMeUseCase: GetMeUseCase,
    @inject(UpdateProfileUseCase) private readonly updateProfileUseCase: UpdateProfileUseCase,
    @inject(UploadAvatarUseCase) private readonly uploadAvatarUseCase: UploadAvatarUseCase,
    @inject(GetUsersUseCase) private readonly getUsersUseCase: GetUsersUseCase,
    @inject(CreateUserUseCase) private readonly createUserUseCase: CreateUserUseCase,
    @inject(UpdateUserUseCase) private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(DeleteUserUseCase) private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await this.getMeUseCase.execute(userId);
      if (!result.isSuccess) {
        return res.status(404).json({ error: result.error?.message });
      }

      return res.status(200).json({ data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, phone } = req.body;
      const result = await this.updateProfileUseCase.execute({ userId, name, phone });

      if (!result.isSuccess) {
        return res.status(400).json({ error: result.error?.message });
      }

      return res.status(200).json({ message: 'Profile updated', data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  };

  uploadAvatar = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Multer will attach the file to req.file
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'File avatar harus disertakan' });
      }

      const result = await this.uploadAvatarUseCase.execute(userId, {
        buffer: file.buffer,
        name: file.originalname,
        type: file.mimetype
      });

      if (!result.isSuccess) {
        return res.status(400).json({ error: result.error?.message });
      }

      return res.status(200).json({ data: { avatarUrl: result.value?.avatarUrl } });
    } catch (error: any) {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      const { page, limit, search, role, warehouseId } = req.query;
      const result = await this.getUsersUseCase.execute({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        role: role as string,
        warehouseId: typeof warehouseId === 'string' ? warehouseId : undefined,
      });

      if (!result.isSuccess) {
        return res.status(400).json({ error: result.error?.message });
      }

      return res.status(200).json(result.value); // getUsers already returns PaginatedResult which has { data: [...], total, ... }
    } catch (error: any) {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const result = await this.createUserUseCase.execute(req.body);

      if (!result.isSuccess) {
        return res.status(400).json({ error: result.error?.message });
      }

      return res.status(201).json({ data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.updateUserUseCase.execute({ id, ...req.body });

      if (!result.isSuccess) {
        return res.status(400).json({ error: result.error?.message });
      }

      return res.status(200).json({ data: result.value });
    } catch (error: any) {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.deleteUserUseCase.execute(id as string);

      if (!result.isSuccess) {
        return res.status(400).json({ error: result.error?.message });
      }

      return res.status(200).json({ message: 'User dinonaktifkan' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  };
}
