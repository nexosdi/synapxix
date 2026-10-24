import { Test, TestingModule } from '@nestjs/testing';
import { TeacherInsightsCron } from '../teacher-insights.cron';
import { TeacherInsightsService } from '../teacher-insights.service';

describe('TeacherInsightsCron', () => {
  let cron: TeacherInsightsCron;
  let teacherInsightsService: jest.Mocked<TeacherInsightsService>;

  beforeEach(async () => {
    const mockService = {
      generateWeeklyReportsForAllTeachers: jest.fn().mockResolvedValue({ processed: 2, failed: 0 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherInsightsCron,
        {
          provide: TeacherInsightsService,
          useValue: mockService,
        },
      ],
    }).compile();

    cron = module.get<TeacherInsightsCron>(TeacherInsightsCron);
    teacherInsightsService = module.get(TeacherInsightsService);
  });

  it('should be defined', () => {
    expect(cron).toBeDefined();
  });

  describe('handleWeeklyInsightsGeneration', () => {
    it('should calculate dates and trigger report generation for all teachers', async () => {
      await cron.handleWeeklyInsightsGeneration();

      expect(teacherInsightsService.generateWeeklyReportsForAllTeachers).toHaveBeenCalledTimes(1);

      const [periodStart, periodEnd] =
        teacherInsightsService.generateWeeklyReportsForAllTeachers.mock.calls[0];

      expect(periodStart).toBeInstanceOf(Date);
      expect(periodEnd).toBeInstanceOf(Date);
      expect(periodStart.getTime()).toBeLessThan(periodEnd.getTime());

      const diffInDays = (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffInDays).toBe(7);
    });

    it('should catch errors gracefully without throwing', async () => {
      teacherInsightsService.generateWeeklyReportsForAllTeachers.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await expect(cron.handleWeeklyInsightsGeneration()).resolves.not.toThrow();
    });
  });
});
