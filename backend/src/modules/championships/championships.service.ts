import prisma from '../../config/database';
import { ApiError } from '../../utils/response';
import { ChampionshipStatus } from '@prisma/client';

interface CreateChampionshipData {
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  category: string;
  rules?: string;
  creatorId: string;
}

/**
 * Servicio de campeonatos
 */
class ChampionshipsService {
  /**
   * Crear nuevo campeonato
   */
  async create(data: CreateChampionshipData) {
    const championship = await prisma.championship.create({
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        category: data.category,
        rules: data.rules,
        creatorId: data.creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return championship;
  }

  /**
   * Obtener todos los campeonatos
   */
  async getAll(filters?: { status?: ChampionshipStatus }) {
    const championships = await prisma.championship.findMany({
      where: filters,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            teams: true,
            matches: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return championships;
  }

  /**
   * Obtener campeonato por ID
   */
  async getById(id: string) {
    const championship = await prisma.championship.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        teams: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                logo: true,
                category: true,
              },
            },
          },
        },
        matches: {
          include: {
            homeTeam: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
            awayTeam: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
          orderBy: {
            matchDate: 'asc',
          },
        },
        standings: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
          orderBy: [
            { points: 'desc' },
            { goalDifference: 'desc' },
            { goalsFor: 'desc' },
          ],
        },
      },
    });

    if (!championship) {
      throw new ApiError('Campeonato no encontrado', 404);
    }

    return championship;
  }

  /**
   * Actualizar campeonato
   */
  async update(id: string, data: Partial<CreateChampionshipData>) {
    const championship = await prisma.championship.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        category: data.category,
        rules: data.rules,
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return championship;
  }

  /**
   * Eliminar campeonato
   */
  async delete(id: string) {
    await prisma.championship.delete({
      where: { id },
    });

    return { message: 'Campeonato eliminado exitosamente' };
  }

  /**
   * Agregar equipo a campeonato
   */
  async addTeam(championshipId: string, teamId: string) {
    // Verificar que el campeonato existe
    const championship = await prisma.championship.findUnique({
      where: { id: championshipId },
    });

    if (!championship) {
      throw new ApiError('Campeonato no encontrado', 404);
    }

    // Verificar que el equipo existe
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new ApiError('Equipo no encontrado', 404);
    }

    // Agregar equipo al campeonato
    const teamChampionship = await prisma.teamChampionship.create({
      data: {
        championshipId,
        teamId,
      },
      include: {
        team: true,
      },
    });

    // Crear entrada en la tabla de posiciones
    await prisma.standing.create({
      data: {
        championshipId,
        teamId,
      },
    });

    return teamChampionship;
  }

  /**
   * Remover equipo de campeonato
   */
  async removeTeam(championshipId: string, teamId: string) {
    await prisma.teamChampionship.delete({
      where: {
        championshipId_teamId: {
          championshipId,
          teamId,
        },
      },
    });

    // Eliminar de la tabla de posiciones
    await prisma.standing.deleteMany({
      where: {
        championshipId,
        teamId,
      },
    });

    return { message: 'Equipo removido del campeonato exitosamente' };
  }
}

export default new ChampionshipsService();
