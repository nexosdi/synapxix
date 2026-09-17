import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { linkType } from '@prisma/client';

@Injectable()
export class TeacherAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // If there's no user, let standard auth guards handle it
    if (!user || !user.sub) {
      return true;
    }

    // Admins bypass this check
    const roles = user.realm_access?.roles || [];
    if (roles.includes('admin') || roles.includes('neops_admin')) {
      return true;
    }

    // Identify the target student ID from params
    const targetId = request.params.studentId || request.params.userId || request.params.id;

    if (!targetId) {
      // If there is no specific ID in the params, it means it's a list route.
      // List routes should be filtered at the service level, not by this Guard.
      return true;
    }
    
    // If user is accessing their own profile/data, allow it
    if (targetId === user.sub) {
      return true;
    }

    // Check if the user is a teacher linked to this student
    const link = await this.prisma.userLink.findFirst({
      where: {
        id_user_from: user.sub,
        id_user_to: targetId,
        link_type: linkType.TEACHER,
      },
    });

    if (!link) {
      throw new ForbiddenException('No tienes acceso a los datos de este estudiante.');
    }

    return true;
  }
}
