import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/response';

/**
 * Middleware global para manejo de errores
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Error de validación de Prisma
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación de datos',
    });
  }

  // Error de Prisma (registro duplicado, etc.)
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      error: 'Error en la operación de base de datos',
    });
  }

  // Error genérico
  return res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
  });
};
