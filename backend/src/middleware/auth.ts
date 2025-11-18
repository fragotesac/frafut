import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { sendError } from '../utils/response';

// Extender el tipo Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware para verificar autenticación JWT
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Token no proporcionado', 401, 'No autorizado');
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    const payload = verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    return sendError(res, 'Token inválido o expirado', 401, 'No autorizado');
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return sendError(res, 'Usuario no autenticado', 401, 'No autorizado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        'No tienes permisos para realizar esta acción',
        403,
        'Acceso denegado'
      );
    }

    next();
  };
};
