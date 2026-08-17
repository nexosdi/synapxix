import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { KeycloakJwtPayload } from '../../../auth/jwt.strategy';
import { TeacherInsightsService } from './teacher-insights.service';
import { TeacherInsightReportResponseDto } from './dto/teacher-insights-report-response.dto';


@ApiTags('Teacher Insights')
@Controller('teacher-insights')
@UseGuards(JwtAuthGuard)
export class TeacherInsightsController {
  constructor(
    private readonly teacherInsightsService: TeacherInsightsService,
    private readonly prisma: PrismaService,
  ) {}


  @Get(':teacherId')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getReports(
    @Param('teacherId') teacherId: string,
    @Req() req: Request & { user: KeycloakJwtPayload },
    @Query('limit') limit?: string,
  ): Promise<TeacherInsightReportResponseDto[]> {
    await this.assertCanAccess(teacherId, req);

    const reports = await this.teacherInsightsService.getReportsForTeacher(
      teacherId,
      limit ? Number(limit) : undefined,
    );

    return reports.map((r) => ({
      reportId: r.report_id,
      teacherId: r.teacher_id,
      periodStart: r.period_start,
      periodEnd: r.period_end,
      studentCount: r.student_count,
      activeStudents: r.active_students,
      reportText: r.report_text,
      status: r.status,
      createdAt: r.created_at,
    }));
  }

  @Post(':teacherId/generate')
  async generateNow(
    @Param('teacherId') teacherId: string,
    @Req() req: Request & { user: KeycloakJwtPayload },
  ): Promise<TeacherInsightReportResponseDto> {
    await this.assertCanAccess(teacherId, req, true);

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setHours(0, 0, 0, 0);
    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() - 7);

    const report = await this.teacherInsightsService.generateWeeklyReportForTeacher(
      teacherId,
      periodStart,
      periodEnd,
    );

    return {
      reportId: report.report_id,
      teacherId: report.teacher_id,
      periodStart: report.period_start,
      periodEnd: report.period_end,
      studentCount: report.student_count,
      activeStudents: report.active_students,
      reportText: report.report_text,
      status: report.status,
      createdAt: report.created_at,
    };
  }

  private async assertCanAccess(
    teacherId: string,
    req: Request & { user: KeycloakJwtPayload },
    requireStaff = false,
  ): Promise<void> {
    const requestingUser = req.user;
    const isOwnData = requestingUser.sub === teacherId;

    const user = await this.prisma.app_user.findUnique({
      where: { user_id: requestingUser.sub },
    });
    const isTeacherOrAdmin = !!user && ['teacher', 'admin'].includes(user.role);

    const allowed = requireStaff ? isTeacherOrAdmin : isOwnData || isTeacherOrAdmin;

    if (!allowed) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
  }
}