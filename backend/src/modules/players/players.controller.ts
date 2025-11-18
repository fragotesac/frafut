import { Request, Response, NextFunction } from 'express';
import playersService from './players.service';
import { sendSuccess } from '../../utils/response';

class PlayersController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const player = await playersService.create(req.body);
      sendSuccess(res, player, 'Jugador creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async getByTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const players = await playersService.getByTeam(req.params.teamId);
      sendSuccess(res, players);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const player = await playersService.getById(req.params.id);
      sendSuccess(res, player);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const player = await playersService.update(req.params.id, req.body);
      sendSuccess(res, player, 'Jugador actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await playersService.delete(req.params.id);
      sendSuccess(res, null, 'Jugador eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

export default new PlayersController();
