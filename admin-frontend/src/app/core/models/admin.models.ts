export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  institutionId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserMetrics {
  totalSessions: number;
  totalTimeSpentMinutes: number;
  averageScore: number;
  gamesPlayed: {
    gameId: string;
    gameName: string;
    playCount: number;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
