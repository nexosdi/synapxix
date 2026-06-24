
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Retrieves the global cognitive average for all users.
   * @returns The global cognitive average.
   */
  @Get('global-average')
  async getGlobalCognitiveAverage(): Promise<GlobalCognitiveAverageDto> {
    return this.analyticsService.getGlobalCognitiveAverage();
  }

  /**
   * Retrieves the cognitive average for a specific user.
   * @param userId The user id.
   * @returns The individual cognitive average.
   */
  @Get('individual-average/:userId')
  async getIndividualCognitiveAverage(
    @Param('userId') userId: string,
  ): Promise<IndividualCognitiveAverageDto> {
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
  ): Promise<StudentProgressDto> {
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
