import { Router } from 'express';
import playersController from './players.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.get('/team/:teamId', playersController.getByTeam);
router.get('/:id', playersController.getById);
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), playersController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), playersController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), playersController.delete);

export default router;
