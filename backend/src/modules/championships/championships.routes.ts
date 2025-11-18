import { Router } from 'express';
import { body } from 'express-validator';
import championshipsController from './championships.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validator';

const router = Router();

const createValidation = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('location').notEmpty().withMessage('La ubicación es requerida'),
  body('startDate').isISO8601().withMessage('Fecha de inicio inválida'),
  body('category').notEmpty().withMessage('La categoría es requerida'),
  validateRequest,
];

// GET /api/championships
router.get('/', championshipsController.getAll);

// GET /api/championships/:id
router.get('/:id', championshipsController.getById);

// POST /api/championships (requiere autenticación)
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'ORGANIZER'),
  createValidation,
  championshipsController.create
);

// PUT /api/championships/:id (requiere autenticación)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'ORGANIZER'),
  championshipsController.update
);

// DELETE /api/championships/:id (requiere autenticación)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'ORGANIZER'),
  championshipsController.delete
);

// POST /api/championships/:id/teams (agregar equipo)
router.post(
  '/:id/teams',
  authenticate,
  authorize('ADMIN', 'ORGANIZER'),
  championshipsController.addTeam
);

// DELETE /api/championships/:id/teams/:teamId (remover equipo)
router.delete(
  '/:id/teams/:teamId',
  authenticate,
  authorize('ADMIN', 'ORGANIZER'),
  championshipsController.removeTeam
);

export default router;
