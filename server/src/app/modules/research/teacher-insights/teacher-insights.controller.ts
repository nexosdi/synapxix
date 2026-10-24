import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
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
import { TeacherAccessGuard } from '../../../auth/teacher-access.guard';
import { KeycloakJwtPayload } from '../../../auth/jwt.strategy';
import { TeacherInsightsService } from './teacher-insights.service';
import { TeacherInsightReportResponseDto } from './dto/teacher-insights-report-response.dto';

@ApiTags('Teacher Insights')
@Controller('teacher-insights')
@UseGuards(JwtAuthGuard, TeacherAccessGuard)
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
    
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<TeacherInsightReportResponseDto[]> {

    const reports = await this.teacherInsightsService.getReportsForTeacher(teacherId, limit);

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

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setUTCHours(0, 0, 0, 0);
    const periodStart = new Date(periodEnd);
    periodStart.setUTCDate(periodStart.getUTCDate() - 7);

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


}