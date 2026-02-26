import { IUserRepository } from '../../repositories/IUserRepository';
import { Result } from '../../errors/Result';
import { User } from '../../entities/User';
import { injectable, inject } from 'tsyringe';

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  warehouseId?: string;
}

export interface PaginatedUsers {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@injectable()
export class GetUsersUseCase {
  constructor(
    @inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<Result<PaginatedUsers>> {
    // 1. We will ask repository for list and count 
    const filter = {
      page: Math.max(1, query.page || 1),
      limit: Math.max(1, query.limit || 10),
      search: query.search,
      role: query.role as any, // Will be casted to Role enum in repo
      warehouseId: query.warehouseId,
    };

    const paginatedResult = await this.userRepo.findAll(filter);

    // 2. Omit passwords
    const data = paginatedResult.data.map(u => {
      const { password: _, ...rest } = u;
      return rest as User;
    });

    return Result.ok({
      data,
      meta: {
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages
      }
    });
  }
}
