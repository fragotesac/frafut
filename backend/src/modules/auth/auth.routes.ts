import { Router } from 'express';
import { body } from 'express-validator';
import authController from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validator';

const router = Router();

/**
 * Validaciones para registro
 */
const registerValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName').notEmpty().withMessage('El nombre es requerido'),
  body('lastName').notEmpty().withMessage('El apellido es requerido'),
  validateRequest,
];

/**
 * Validaciones para login
 */
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validateRequest,
];

// POST /api/auth/register
router.post('/register', registerValidation, authController.register);

// POST /api/auth/login
router.post('/login', loginValidation, authController.login);

// GET /api/auth/me (protegido)
router.get('/me', authenticate, authController.getProfile);

// PUT /api/auth/profile (protegido)
router.put('/profile', authenticate, authController.updateProfile);

export default router;
