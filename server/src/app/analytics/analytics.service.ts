import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import {
  GlobalCognitiveAverageDto,
  IndividualCognitiveAverageDto,
  ClassProgressDto,
  StudentProgressDto,
  GlobalMotorAverageDto,
  GlobalEvaluativeAverageDto,
} from './dto';

/**
 * Service for handling analytics-related operations.
 */
@Injectable()
export class AnalyticsService {
  /**
   * Creates an instance of AnalyticsService.
   * @param prisma The Prisma service.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculates the global cognitive average for all users.
   * This method aggregates the cognitive metrics for all users and returns the average accuracy, reaction time, and cognitive load.
   * @returns A promise that resolves to a GlobalCognitiveAverageDto object.
   */
  async getGlobalCognitiveAverage(
    startDate?: string,
    endDate?: string,
  ): Promise<GlobalCognitiveAverageDto> {
    const where: any = {};

    if (startDate) {
      where.created_at = { ...where.created_at, gte: new Date(startDate) };
    }

    if (endDate) {
      where.created_at = { ...where.created_at, lte: new Date(endDate) };
    }

    if (!startDate && !endDate) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      where.created_at = { gte: thirtyDaysAgo };
    }

    const cognitiveAverages = await this.prisma.cognitiveMetric.aggregate({
      where,
      _avg: {
        accuracy: true,
        reaction_time: true,
        cognitive_load: true,
        memory_retention: true,
        attention_span: true,
      },
    });

    return {
      accuracy: cognitiveAverages._avg.accuracy ?? 0,
      reaction_time: cognitiveAverages._avg.reaction_time ?? 0,
      cognitive_load: cognitiveAverages._avg.cognitive_load ?? 0,
      memory_retention: cognitiveAverages._avg.memory_retention ?? 0,
      attention_span: cognitiveAverages._avg.attention_span ?? 0,
    };
  }

  /**
   * Calculates the cognitive average for a specific user.
   * This method aggregates the cognitive metrics for a specific user and returns the average accuracy, reaction time, and cognitive load.
   * @param userId The ID of the user.
   * @returns A promise that resolves to an IndividualCognitiveAverageDto object.
   */
  async getIndividualCognitiveAverage(
    userId: string,
  ): Promise<IndividualCognitiveAverageDto> {
    const cognitiveAverages = await this.prisma.cognitiveMetric.aggregate({
      _avg: {
        accuracy: true,
        reaction_time: true,
        cognitive_load: true,
        memory_retention: true,
        attention_span: true,
      },
      where: {
        user_id: userId,
      },
    });

    return {
      user_id: userId,
      accuracy: cognitiveAverages._avg.accuracy ?? 0,
      reaction_time: cognitiveAverages._avg.reaction_time ?? 0,
      cognitive_load: cognitiveAverages._avg.cognitive_load ?? 0,
      memory_retention: cognitiveAverages._avg.memory_retention ?? 0,
      attention_span: cognitiveAverages._avg.attention_span ?? 0,
    };
  }

  /**
   * Calculates the progress of a class.
   * This method calculates the average progress of all users in a specific class.
   * @param classId The ID of the class.
   * @returns A promise that resolves to a ClassProgressDto object.
   */
  async getClassProgress(classId: string): Promise<ClassProgressDto> {
    const classProgress = await this.prisma.userContentProgress.aggregate({
      _avg: {
        progress: true,
      },
      where: {
        user: {
          userStructures: {
            some: {
              structure_id: classId,
            },
          },
        },
      },
    });

    return {
      class_id: classId,
      progress: classProgress._avg.progress ?? 0,
    };
  }

  /**
   * Calculates the progress of a student.
   * This method calculates the average progress of a specific student.
   * @param studentId The ID of the student.
   * @returns A promise that resolves to a StudentProgressDto object.
   */
  async getStudentProgress(studentId: string): Promise<StudentProgressDto> {
    const studentProgress = await this.prisma.userContentProgress.aggregate({
      _avg: {
        progress: true,
      },
      where: {
        user_id: studentId,
      },
    });

    return {
      student_id: studentId,
      progress: studentProgress._avg.progress ?? 0,
    };
  }

  /**
   * Calculates the global motor average.
   * This method calculates the average score and the rate of quick completions from all game attempts.
   * @returns A promise that resolves to a GlobalMotorAverageDto object.
   */
  async getGlobalMotorAverage(): Promise<GlobalMotorAverageDto> {
    const [avgScore, quickCompletions, totalAttempts] = await Promise.all([
      this.prisma.gameAttempt.aggregate({
        _avg: {
          score: true,
        },
      }),
      this.prisma.gameAttempt.count({
        where: {
          completed_quickly: true,
        },
      }),
      this.prisma.gameAttempt.count(),
    ]);

    return {
      average_score: avgScore._avg.score ?? 0,
      completed_quickly_rate:
        totalAttempts > 0 ? quickCompletions / totalAttempts : 0,
    };
  }

  /**
   * Calculates the global evaluative average.
   * This method calculates the success rate from all game attempts.
   * @returns A promise that resolves to a GlobalEvaluativeAverageDto object.
   */
  async getGlobalEvaluativeAverage(): Promise<GlobalEvaluativeAverageDto> {
    const [correctAttempts, totalAttempts] = await Promise.all([
      this.prisma.gameAttempt.count({
        where: {
          is_correct: true,
        },
      }),
      this.prisma.gameAttempt.count(),
    ]);

    return {
      success_rate: totalAttempts > 0 ? correctAttempts / totalAttempts : 0,
    };
  }
}
