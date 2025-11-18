import prisma from '../../config/database';
import { ApiError } from '../../utils/response';
import { EventType } from '@prisma/client';

class MatchesService {
  async create(data: any) {
    return await prisma.match.create({
      data,
      include: {
        championship: {
          select: { id: true, name: true },
        },
        homeTeam: {
          select: { id: true, name: true, logo: true },
        },
        awayTeam: {
          select: { id: true, name: true, logo: true },
        },
      },
    });
  }

  async getByChampionship(championshipId: string) {
    return await prisma.match.findMany({
      where: { championshipId },
      include: {
        homeTeam: {
          select: { id: true, name: true, logo: true },
        },
        awayTeam: {
          select: { id: true, name: true, logo: true },
        },
      },
      orderBy: { matchDate: 'asc' },
    });
  }

  async getById(id: string) {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        championship: {
          select: { id: true, name: true, category: true },
        },
        homeTeam: {
          select: { id: true, name: true, logo: true },
        },
        awayTeam: {
          select: { id: true, name: true, logo: true },
        },
        events: {
          include: {
            player: {
              select: { id: true, firstName: true, lastName: true, jerseyNumber: true },
            },
          },
          orderBy: { minute: 'asc' },
        },
      },
    });

    if (!match) {
      throw new ApiError('Partido no encontrado', 404);
    }

    return match;
  }

  async update(id: string, data: any) {
    return await prisma.match.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await prisma.match.delete({ where: { id } });
    return { message: 'Partido eliminado exitosamente' };
  }

  /**
   * Agregar evento al partido (gol, tarjeta, etc.)
   */
  async addEvent(matchId: string, eventData: any) {
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      throw new ApiError('Partido no encontrado', 404);
    }

    // Crear el evento
    const event = await prisma.matchEvent.create({
      data: {
        matchId,
        eventType: eventData.eventType,
        minute: eventData.minute,
        description: eventData.description,
        playerId: eventData.playerId,
        teamId: eventData.teamId,
        playerOutId: eventData.playerOutId,
      },
      include: {
        player: {
          select: { id: true, firstName: true, lastName: true, jerseyNumber: true },
        },
      },
    });

    // Si es un gol, actualizar el marcador
    if (eventData.eventType === EventType.GOAL || eventData.eventType === EventType.OWN_GOAL) {
      const isHomeTeamGoal = eventData.teamId === match.homeTeamId;
      const isOwnGoal = eventData.eventType === EventType.OWN_GOAL;

      // En gol en contra, el gol se cuenta para el equipo contrario
      const incrementHome = (isHomeTeamGoal && !isOwnGoal) || (!isHomeTeamGoal && isOwnGoal);

      await prisma.match.update({
        where: { id: matchId },
        data: {
          homeScore: incrementHome ? match.homeScore + 1 : match.homeScore,
          awayScore: !incrementHome ? match.awayScore + 1 : match.awayScore,
        },
      });

      // Actualizar tabla de posiciones si el partido está finalizado
      if (match.status === 'FINISHED') {
        await this.updateStandings(matchId);
      }
    }

    // Si es final de partido, actualizar estado y standings
    if (eventData.eventType === EventType.FULL_TIME) {
      await prisma.match.update({
        where: { id: matchId },
        data: { status: 'FINISHED' },
      });

      await this.updateStandings(matchId);
    }

    return event;
  }

  /**
   * Obtener eventos de un partido
   */
  async getEvents(matchId: string) {
    return await prisma.matchEvent.findMany({
      where: { matchId },
      include: {
        player: {
          select: { id: true, firstName: true, lastName: true, jerseyNumber: true },
        },
      },
      orderBy: { minute: 'asc' },
    });
  }

  /**
   * Actualizar tabla de posiciones basado en resultado de partido
   */
  async updateStandings(matchId: string) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || match.status !== 'FINISHED') {
      return;
    }

    const { homeTeamId, awayTeamId, homeScore, awayScore, championshipId } = match;

    // Determinar resultado
    const homeWin = homeScore > awayScore;
    const draw = homeScore === awayScore;
    const awayWin = awayScore > homeScore;

    // Actualizar standing del equipo local
    await prisma.standing.update({
      where: {
        championshipId_teamId: {
          championshipId,
          teamId: homeTeamId,
        },
      },
      data: {
        played: { increment: 1 },
        won: homeWin ? { increment: 1 } : undefined,
        drawn: draw ? { increment: 1 } : undefined,
        lost: awayWin ? { increment: 1 } : undefined,
        goalsFor: { increment: homeScore },
        goalsAgainst: { increment: awayScore },
        goalDifference: { increment: homeScore - awayScore },
        points: { increment: homeWin ? 3 : draw ? 1 : 0 },
      },
    });

    // Actualizar standing del equipo visitante
    await prisma.standing.update({
      where: {
        championshipId_teamId: {
          championshipId,
          teamId: awayTeamId,
        },
      },
      data: {
        played: { increment: 1 },
        won: awayWin ? { increment: 1 } : undefined,
        drawn: draw ? { increment: 1 } : undefined,
        lost: homeWin ? { increment: 1 } : undefined,
        goalsFor: { increment: awayScore },
        goalsAgainst: { increment: homeScore },
        goalDifference: { increment: awayScore - homeScore },
        points: { increment: awayWin ? 3 : draw ? 1 : 0 },
      },
    });
  }
}

export default new MatchesService();
