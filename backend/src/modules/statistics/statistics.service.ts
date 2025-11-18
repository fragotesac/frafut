import prisma from '../../config/database';

class StatisticsService {
  /**
   * Obtener tabla de posiciones de un campeonato
   */
  async getStandings(championshipId: string) {
    return await prisma.standing.findMany({
      where: { championshipId },
      include: {
        team: {
          select: { id: true, name: true, logo: true },
        },
      },
      orderBy: [
        { points: 'desc' },
        { goalDifference: 'desc' },
        { goalsFor: 'desc' },
      ],
    });
  }

  /**
   * Obtener tabla de goleadores de un campeonato
   */
  async getTopScorers(championshipId: string, limit: number = 20) {
    const goalEvents = await prisma.matchEvent.findMany({
      where: {
        match: {
          championshipId,
        },
        eventType: 'GOAL',
      },
      include: {
        player: {
          include: {
            team: {
              select: { id: true, name: true, logo: true },
            },
          },
        },
      },
    });

    // Agrupar goles por jugador
    const scorersMap = new Map();

    goalEvents.forEach((event) => {
      if (!event.player) return;

      const playerId = event.player.id;
      if (scorersMap.has(playerId)) {
        scorersMap.get(playerId).goals += 1;
      } else {
        scorersMap.set(playerId, {
          player: event.player,
          goals: 1,
        });
      }
    });

    // Convertir a array y ordenar
    const scorers = Array.from(scorersMap.values())
      .sort((a, b) => b.goals - a.goals)
      .slice(0, limit);

    return scorers;
  }

  /**
   * Obtener jugadores con más tarjetas
   */
  async getCardStats(championshipId: string) {
    const cardEvents = await prisma.matchEvent.findMany({
      where: {
        match: {
          championshipId,
        },
        eventType: {
          in: ['YELLOW_CARD', 'RED_CARD'],
        },
      },
      include: {
        player: {
          include: {
            team: {
              select: { id: true, name: true, logo: true },
            },
          },
        },
      },
    });

    // Agrupar tarjetas por jugador
    const cardsMap = new Map();

    cardEvents.forEach((event) => {
      if (!event.player) return;

      const playerId = event.player.id;
      if (cardsMap.has(playerId)) {
        const stats = cardsMap.get(playerId);
        if (event.eventType === 'YELLOW_CARD') {
          stats.yellowCards += 1;
        } else {
          stats.redCards += 1;
        }
      } else {
        cardsMap.set(playerId, {
          player: event.player,
          yellowCards: event.eventType === 'YELLOW_CARD' ? 1 : 0,
          redCards: event.eventType === 'RED_CARD' ? 1 : 0,
        });
      }
    });

    // Convertir a array y ordenar por total de tarjetas
    const cardStats = Array.from(cardsMap.values())
      .map((stat) => ({
        ...stat,
        totalCards: stat.yellowCards + stat.redCards * 2, // Ponderar rojas x2
      }))
      .sort((a, b) => b.totalCards - a.totalCards);

    return cardStats;
  }
}

export default new StatisticsService();
