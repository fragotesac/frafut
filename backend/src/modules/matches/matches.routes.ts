import { Router } from 'express';
import matchesController from './matches.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.get('/championship/:championshipId', matchesController.getByChampionship);
router.get('/:id', matchesController.getById);
router.get('/:id/events', matchesController.getEvents);
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), matchesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), matchesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), matchesController.delete);
router.post('/:id/events', authenticate, authorize('ADMIN', 'ORGANIZER'), matchesController.addEvent);

export default router;
