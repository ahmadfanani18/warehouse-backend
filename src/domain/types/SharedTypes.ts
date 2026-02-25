export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
