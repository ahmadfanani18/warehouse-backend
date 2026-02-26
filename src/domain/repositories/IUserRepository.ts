import { User, Role } from '../entities/User';
import { PaginatedResult } from '../types/SharedTypes';

export interface UserFilter {
  search?: string;
  role?: Role;
  warehouseId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role: Role;
  warehouseIds: string[];
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  password?: string;
  avatarUrl?: string;
  role?: Role;
  isActive?: boolean;
  warehouseIds?: string[];
  lastLoginAt?: Date;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filter?: UserFilter): Promise<PaginatedResult<User>>;
  create(data: CreateUserDTO): Promise<User>;
  update(id: string, data: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}
