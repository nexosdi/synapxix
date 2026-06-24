
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@synapxix/prisma-client';
import {
  GlobalCognitiveAverageDto,
  IndividualCognitiveAverageDto,
  ClassProgressDto,
  StudentProgressDto,
} from './dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculates the global cognitive average for all users.
   * @returns The global cognitive average.
   */
  async getGlobalCognitiveAverage(): Promise<GlobalCognitiveAverageDto> {
    const cognitiveAverages = await this.prisma.cognitiveMetric.aggregate({
      _avg: {
        accuracy: true,
        reaction_time: true,
        cognitive_load: true,
      },
    });

    return {
      accuracy: cognitiveAverages._avg.accuracy || 0,
      reaction_time: cognitiveAverages._avg.reaction_time || 0,
      cognitive_load: cognitiveAverages._avg.cognitive_load || 0,
    };
  }

  /**
   * Calculates the cognitive average for a specific user.
   * @param userId The user id.
   * @returns The individual cognitive average.
   */
  async getIndividualCognitiveAverage(
    userId: string,
  ): Promise<IndividualCognitiveAverageDto> {
    const cognitiveAverages = await this.prisma.cognitiveMetric.aggregate({
      _avg: {
        accuracy: true,
        reaction_time: true,
        cognitive_load: true,
      },
      where: {
        user_id: userId,
      },
    });

    return {
      user_id: userId,
      accuracy: cognitiveAverages._avg.accuracy || 0,
      reaction_time: cognitiveAverages._avg.reaction_time || 0,
      cognitive_load: cognitiveAverages._avg.cognitive_load || 0,
    };
  }

  /**
   * Calculates the progress of a class.
   * @param classId The class id.
   * @returns The class progress.
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
      progress: classProgress._avg.progress || 0,
    };
  }

  /**
   * Calculates the progress of a student.
   * @param studentId The student id.
   * @returns The student progress.
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
      progress: studentProgress._avg.progress || 0,
    };
  }
}
