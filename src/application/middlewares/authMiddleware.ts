import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { IJwtService } from '../../domain/services/IJwtService';
import { JwtPayload } from '../../domain/services/IJwtService';



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

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
       res.status(401).json({ error: 'Belum login' });
       return;
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Akses ditolak.' });
      return;
    }
    
    next();
  };
}
