export abstract class AppError extends Error {
  abstract readonly statusCode: number;
}

export class InvalidCredentialsError extends AppError {
  readonly statusCode = 401;
  constructor(msg = 'Email atau password salah') {
    super(msg);
  }
}

export class UnauthorizedError extends AppError {
  readonly statusCode = 401;
  constructor(msg = 'Unauthorized') {
    super(msg);
  }
}

export class ForbiddenError extends AppError {
  readonly statusCode = 403;
  constructor(msg = 'Akses ditolak') {
    super(msg);
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  constructor(entity: string) {
    super(`${entity} tidak ditemukan`);
  }
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
  constructor(msg: string) {
    super(msg);
  }
}

export class ValidationError extends AppError {
  readonly statusCode = 422;
  constructor(msg: string) {
    super(msg);
  }
}

export class InternalServerError extends AppError {
  readonly statusCode = 500;
  constructor(msg = 'Internal Server Error') {
    super(msg);
  }
}
