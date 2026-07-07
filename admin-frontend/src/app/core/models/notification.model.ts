export type NotificationType = 'achievement' | 'feedback' | 'ranking';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
}

/** Shape expected from GET /api/notifications */
export interface NotificationApiResponse {
  notifications: Notification[];
}
