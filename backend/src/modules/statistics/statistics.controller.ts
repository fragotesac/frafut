import { Request, Response, NextFunction } from 'express';
import statisticsService from './statistics.service';
import { sendSuccess } from '../../utils/response';

class StatisticsController {
  async getStandings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const standings = await statisticsService.getStandings(req.params.championshipId);
      sendSuccess(res, standings);
    } catch (error) {
      next(error);
    }
  }

  async getTopScorers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const scorers = await statisticsService.getTopScorers(req.params.championshipId, limit);
      sendSuccess(res, scorers);
    } catch (error) {
      next(error);
    }
  }

  async getCardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cards = await statisticsService.getCardStats(req.params.championshipId);
      sendSuccess(res, cards);
    } catch (error) {
      next(error);
    }
  }
}

export default new StatisticsController();
