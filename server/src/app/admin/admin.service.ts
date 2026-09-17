import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { Prisma } from '@prisma/client';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(dto: GetUsersDto, reqUser: Record<string, any>) {
    const { page = 1, limit = 20, institutionId, search } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.app_userWhereInput = {
      role: 'student', // Admin/teacher usually looks for students
    };

    if (search) {
      where.OR = [
        { firstname: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (institutionId) {
      where.userStructures = {
        some: {
          structure: {
            institution_id: institutionId,
          },
        },
      };
    }

    // Role specific restrictions
    const roles = reqUser?.realm_access?.roles || [];
    if (roles.includes('teacher') && !roles.includes('director')) {
      // Teachers only see their own students via UserLink
      where.linksTo = {
        some: {
          id_user_from: reqUser.sub,
        },
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.app_user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          user_id: true,
          firstname: true,
          lastname: true,
          email: true,
          created_at: true,
          active: true,
        },
      }),
      this.prisma.app_user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserMetrics(userId: string) {
    const user = await this.prisma.app_user.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const metrics = await this.prisma.cognitiveMetric.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return metrics;
  }

  async getInstitutionStats(institutionId: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { institution_id: institutionId },
    });

    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    // Students in the institution
    const totalStudents = await this.prisma.app_user.count({
      where: {
        role: 'student',
        userStructures: {
          some: {
            structure: {
              institution_id: institutionId,
            },
          },
        },
      },
    });

    // To get sessions, we need users from this institution
    const usersInInstitution = await this.prisma.app_user.findMany({
      where: {
        userStructures: {
          some: { structure: { institution_id: institutionId } },
        },
      },
      select: { user_id: true },
    });
    
    const userIds = usersInInstitution.map(u => u.user_id);

    const totalSessions = await this.prisma.gameSession.count({
      where: {
        user_id: { in: userIds },
      },
    });

    const metrics = await this.prisma.cognitiveMetric.aggregate({
      where: {
        user_id: { in: userIds },
      },
      _avg: {
        accuracy: true,
        cognitive_load: true,
        reaction_time: true,
      },
    });

    return {
      institutionId,
      name: institution.name,
      totalStudents,
      totalSessions,
      averages: {
        accuracy: metrics._avg.accuracy || 0,
        cognitiveLoad: metrics._avg.cognitive_load || 0,
        reactionTime: metrics._avg.reaction_time || 0,
      },
    };
  }
}
