import { Request, Response, NextFunction } from 'express';
import authService from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';

/**
 * Controlador de autenticación
 */
class AuthController {
  /**
   * POST /api/auth/register
   * Registrar nuevo usuario
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      sendSuccess(res, result, 'Usuario registrado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Iniciar sesión
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      sendSuccess(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Obtener perfil del usuario autenticado
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return sendError(res, 'Usuario no autenticado', 401);
      }

      const user = await authService.getProfile(req.user.userId);

      sendSuccess(res, user, 'Perfil obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Actualizar perfil del usuario
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        return sendError(res, 'Usuario no autenticado', 401);
      }

      const { firstName, lastName, phone } = req.body;

      const user = await authService.updateProfile(req.user.userId, {
        firstName,
        lastName,
        phone,
      });

      sendSuccess(res, user, 'Perfil actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
