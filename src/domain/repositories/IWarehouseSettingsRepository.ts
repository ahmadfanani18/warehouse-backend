import { Warehouse, Category, Unit } from '../entities/WarehouseAndSettings';

export interface IWarehouseRepository {
  findAll(): Promise<Warehouse[]>;
  findById(id: string): Promise<Warehouse | null>;
  create(data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse>;
  update(id: string, data: Partial<Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Warehouse>;
  delete(id: string): Promise<void>;
}

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category>;
  update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category>;
  delete(id: string): Promise<void>;
}

export interface IUnitRepository {
  findAll(): Promise<Unit[]>;
  findById(id: string): Promise<Unit | null>;
  create(data: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit>;
  update(id: string, data: Partial<Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Unit>;
  delete(id: string): Promise<void>;
}
