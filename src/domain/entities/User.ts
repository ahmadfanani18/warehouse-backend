export type Role = 'SUPER_ADMIN' | 'WH_MANAGER' | 'STAFF';

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  assignedWarehouseIds: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
