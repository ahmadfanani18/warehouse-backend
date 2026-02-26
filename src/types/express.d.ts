import { JwtPayload } from '../domain/services/IJwtService';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
