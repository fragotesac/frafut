import { Request, Response, NextFunction } from 'express';
import matchesService from './matches.service';
import { sendSuccess } from '../../utils/response';

class MatchesController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const match = await matchesService.create(req.body);
      sendSuccess(res, match, 'Partido creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async getByChampionship(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matches = await matchesService.getByChampionship(req.params.championshipId);
      sendSuccess(res, matches);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const match = await matchesService.getById(req.params.id);
      sendSuccess(res, match);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const match = await matchesService.update(req.params.id, req.body);
      sendSuccess(res, match, 'Partido actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await matchesService.delete(req.params.id);
      sendSuccess(res, null, 'Partido eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async addEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await matchesService.addEvent(req.params.id, req.body);
      sendSuccess(res, event, 'Evento agregado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const events = await matchesService.getEvents(req.params.id);
      sendSuccess(res, events);
    } catch (error) {
      next(error);
    }
  }
}

export default new MatchesController();
