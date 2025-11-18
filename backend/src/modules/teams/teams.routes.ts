import { Router } from 'express';
import teamsController from './teams.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.get('/', teamsController.getAll);
router.get('/:id', teamsController.getById);
router.post('/', authenticate, authorize('ADMIN', 'ORGANIZER'), teamsController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), teamsController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'ORGANIZER'), teamsController.delete);

export default router;
