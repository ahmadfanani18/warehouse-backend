import { Request, Response, NextFunction } from 'express';
import { Role } from '../../domain/entities/User';
import { ForbiddenError } from '../../domain/errors/AppError';

export const roleMiddleware = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      const err = new ForbiddenError('Anda tidak memiliki akses untuk aksi ini');
      return res.status(err.statusCode).json({ error: err.message });
    }
    next();
  };
};
