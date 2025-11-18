import { Request, Response, NextFunction } from 'express';
import teamsService from './teams.service';
import { sendSuccess } from '../../utils/response';

class TeamsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const team = await teamsService.create({
        ...req.body,
        managerId: req.user?.userId,
      });
      sendSuccess(res, team, 'Equipo creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teams = await teamsService.getAll();
      sendSuccess(res, teams);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const team = await teamsService.getById(req.params.id);
      sendSuccess(res, team);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const team = await teamsService.update(req.params.id, req.body);
      sendSuccess(res, team, 'Equipo actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await teamsService.delete(req.params.id);
      sendSuccess(res, null, 'Equipo eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

export default new TeamsController();
