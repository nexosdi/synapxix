
export interface GameTypeBreakdown {
  gameType: string;
  attempts: number;
  successRate: number;
  averageScore: number;
}

export interface StrugglingContent {
  contentId: string;
  title: string;
  averageProgress: number;
}

export interface TeacherMetricsSummaryDto {
  teacherId: string;
  periodStart: string;
  periodEnd: string;
  studentCount: number;
  activeStudents: number;

  cognitive: {
    accuracy: number;
    reactionTime: number;
    cognitiveLoad: number;
    memoryRetention: number;
    attentionSpan: number;
  };

  gameAttempts: {
    totalAttempts: number;
    successRate: number;
    averageScore: number;
    quickCompletionRate: number;
    byGameType: GameTypeBreakdown[];
  };

  contentProgress: {
    averageProgress: number;
    completedCount: number;
    strugglingContent: StrugglingContent[];
  };
}