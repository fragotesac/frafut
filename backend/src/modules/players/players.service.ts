import prisma from '../../config/database';
import { ApiError } from '../../utils/response';

class PlayersService {
  async create(data: any) {
    return await prisma.player.create({
      data,
      include: {
        team: {
          select: { id: true, name: true, logo: true },
        },
      },
    });
  }

  async getByTeam(teamId: string) {
    return await prisma.player.findMany({
      where: { teamId },
      orderBy: { jerseyNumber: 'asc' },
      include: {
        team: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async getById(id: string) {
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
        events: {
          include: {
            match: {
              include: {
                championship: {
                  select: { id: true, name: true },
                },
                homeTeam: {
                  select: { id: true, name: true },
                },
                awayTeam: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!player) {
      throw new ApiError('Jugador no encontrado', 404);
    }

    // Calcular estadísticas
    const goals = player.events.filter((e) => e.eventType === 'GOAL').length;
    const yellowCards = player.events.filter((e) => e.eventType === 'YELLOW_CARD').length;
    const redCards = player.events.filter((e) => e.eventType === 'RED_CARD').length;

    return {
      ...player,
      stats: { goals, yellowCards, redCards },
    };
  }

  async update(id: string, data: any) {
    return await prisma.player.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await prisma.player.delete({ where: { id } });
    return { message: 'Jugador eliminado exitosamente' };
  }
}

export default new PlayersService();
