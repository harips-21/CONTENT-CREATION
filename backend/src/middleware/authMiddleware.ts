import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required.' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'ai-content-studio-super-secret-jwt-key-2026';

  jwt.verify(token, secret, (err, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid or expired token.' });
      return;
    }
    req.user = { id: decoded.id, email: decoded.email };
    next();
  });
};
