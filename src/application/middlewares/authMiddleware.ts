import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IJwtService } from '../../domain/services/IJwtService';
import { JwtPayload } from '../../domain/services/IJwtService';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  try {
    const jwtService = container.resolve<IJwtService>('IJwtService');
    const decoded = jwtService.verifyAccessToken(token);
    req.user = decoded; // Attach user claims ke request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token tidak valid atau expired' });
  }
}
