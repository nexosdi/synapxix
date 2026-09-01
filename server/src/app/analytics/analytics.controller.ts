import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import {
  GlobalCognitiveAverageDto,
  IndividualCognitiveAverageDto,
  ClassProgressDto,
  StudentProgressDto,
  GlobalMotorAverageDto,
  GlobalEvaluativeAverageDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { KeycloakJwtPayload } from '../auth/jwt.strategy';
import { PrismaService } from '@nexosdi.synapxix/prisma';

/**
 * Controlador de Analíticas.
 * Protegido globalmente por `JwtAuthGuard`, asegura que todas las peticiones tengan un token válido de Keycloak.
 * Utiliza el objeto `req.user` para validar si el usuario que solicita los datos tiene permisos
 * sobre el recurso (ej. si es el mismo usuario, un profesor o un administrador).
 */
@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Retrieves the global cognitive average for all users.
   * @returns The global cognitive average.
   */
  @Get('global-average')
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for the analysis (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for the analysis (YYYY-MM-DD)',
  })
  async getGlobalCognitiveAverage(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<GlobalCognitiveAverageDto> {
    return this.analyticsService.getGlobalCognitiveAverage(startDate, endDate);
  }

  /**
   * Retrieves the cognitive average for a specific user.
   * @param userId The user id.
   * @returns The individual cognitive average.
   */
  @Get('individual-average/:userId')
  async getIndividualCognitiveAverage(
    @Param('userId') userId: string,
    @Req() req: Request & { user: KeycloakJwtPayload },
  ): Promise<IndividualCognitiveAverageDto> {
    const requestingUser = req?.user;
    if (!requestingUser?.sub) {
      throw new UnauthorizedException('Invalid or missing user token.');
    }

    const isOwnData = requestingUser.sub === userId;
    if (!isOwnData) {
      const user = await this.prisma.app_user.findUnique({
        where: { user_id: requestingUser.sub },
      });
      const isTeacherOrAdmin = user && ['teacher', 'admin'].includes(user.role);
      if (!isTeacherOrAdmin) {
        throw new UnauthorizedException(
          'You are not authorized to access this resource.',
        );
      }
    }

    return this.analyticsService.getIndividualCognitiveAverage(userId);
  }

  /**
   * Retrieves the progress of a class.
   * @param classId The class id.
   * @returns The class progress.
   */
  @Get('class-progress/:classId')
  async getClassProgress(
    @Param('classId') classId: string,
  ): Promise<ClassProgressDto> {
    return this.analyticsService.getClassProgress(classId);
  }

  /**
   * Retrieves the progress of a student.
   * @param studentId The student id.
   * @returns The student progress.
   */
  @Get('student-progress/:studentId')
  async getStudentProgress(
    @Param('studentId') studentId: string,
    @Req() req: Request & { user: KeycloakJwtPayload },
  ): Promise<StudentProgressDto> {
    const requestingUser = req?.user;
    if (!requestingUser?.sub) {
      throw new UnauthorizedException('Invalid or missing user token.');
    }

    const isOwnData = requestingUser.sub === studentId;
    if (!isOwnData) {
      const user = await this.prisma.app_user.findUnique({
        where: { user_id: requestingUser.sub },
      });
      const isTeacherOrAdmin = user && ['teacher', 'admin'].includes(user.role);
      if (!isTeacherOrAdmin) {
        throw new UnauthorizedException(
          'You are not authorized to access this resource.',
        );
      }
    }

    return this.analyticsService.getStudentProgress(studentId);
  }

  /**
   * Retrieves the global motor average.
   * @returns The global motor average.
   */
  @Get('global-motor-average')
  async getGlobalMotorAverage(): Promise<GlobalMotorAverageDto> {
    return this.analyticsService.getGlobalMotorAverage();
  }

  /**
   * Retrieves the global evaluative average.
   * @returns The global evaluative average.
   */
  @Get('global-evaluative-average')
  async getGlobalEvaluativeAverage(): Promise<GlobalEvaluativeAverageDto> {
    return this.analyticsService.getGlobalEvaluativeAverage();
  }
}
