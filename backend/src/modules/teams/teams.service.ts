import prisma from '../../config/database';
import { ApiError } from '../../utils/response';

class TeamsService {
  async create(data: any) {
    return await prisma.team.create({
      data: {
        ...data,
      },
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async getAll() {
    return await prisma.team.findMany({
      include: {
        _count: {
          select: { players: true, championships: true },
        },
      },
    });
  }

  async getById(id: string) {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        players: {
          orderBy: { jerseyNumber: 'asc' },
        },
        championships: {
          include: {
            championship: {
              select: { id: true, name: true, category: true, status: true },
            },
          },
        },
        standings: {
          include: {
            championship: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!team) {
      throw new ApiError('Equipo no encontrado', 404);
    }

    return team;
  }

  async update(id: string, data: any) {
    return await prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await prisma.team.delete({ where: { id } });
    return { message: 'Equipo eliminado exitosamente' };
  }
}

export default new TeamsService();
