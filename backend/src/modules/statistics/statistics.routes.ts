import { Router } from 'express';
import statisticsController from './statistics.controller';

const router = Router();

router.get('/championships/:championshipId/standings', statisticsController.getStandings);
router.get('/championships/:championshipId/top-scorers', statisticsController.getTopScorers);
router.get('/championships/:championshipId/cards', statisticsController.getCardStats);

export default router;
