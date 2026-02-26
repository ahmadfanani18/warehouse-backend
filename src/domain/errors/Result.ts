import { AppError } from './AppError';

export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly error?: AppError,
  ) {}

  static ok<T>(value?: T): Result<T> {
    return new Result(true, value);
  }

  static fail<T>(error: AppError): Result<T> {
    return new Result<T>(false, undefined, error);
  }
}
