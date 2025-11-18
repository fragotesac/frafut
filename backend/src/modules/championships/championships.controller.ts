import { Request, Response, NextFunction } from 'express';
import championshipsService from './championships.service';
import { sendSuccess } from '../../utils/response';

class ChampionshipsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const championship = await championshipsService.create({
        ...req.body,
        creatorId: req.user!.userId,
      });

      sendSuccess(res, championship, 'Campeonato creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;
      const championships = await championshipsService.getAll(
        status ? { status: status as any } : undefined
      );

      sendSuccess(res, championships, 'Campeonatos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const championship = await championshipsService.getById(id);

      sendSuccess(res, championship, 'Campeonato obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const championship = await championshipsService.update(id, req.body);

      sendSuccess(res, championship, 'Campeonato actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await championshipsService.delete(id);

      sendSuccess(res, null, 'Campeonato eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async addTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { teamId } = req.body;

      const result = await championshipsService.addTeam(id, teamId);

      sendSuccess(res, result, 'Equipo agregado al campeonato exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async removeTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, teamId } = req.params;

      await championshipsService.removeTeam(id, teamId);

      sendSuccess(res, null, 'Equipo removido del campeonato exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

export default new ChampionshipsController();
