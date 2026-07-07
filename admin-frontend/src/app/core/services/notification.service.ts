import { Injectable, signal, computed, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Notification, NotificationApiResponse, NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  // ── State ────────────────────────────────────────────────────────────────
  private readonly _notifications = signal<Notification[]>([]);
  /** All notifications, newest first */
  readonly notifications = this._notifications.asReadonly();
  /** Count of unread notifications */
  readonly unreadCount = computed(() =>
    this._notifications().filter((n) => !n.read).length
  );

  /** Toasts are the last N notifications that haven't been dismissed yet */
  private readonly _toastQueue = signal<Notification[]>([]);
  readonly toastQueue = this._toastQueue.asReadonly();

  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /**
   * Push a new notification programmatically (e.g., triggered by a game event).
   * Also queues it as a toast.
   */
  push(partial: Omit<Notification, 'id' | 'read' | 'timestamp'>): void {
    const notif: Notification = {
      id: crypto.randomUUID(),
      read: false,
      timestamp: new Date().toISOString(),
      ...partial,
    };
    this._notifications.update((prev) => [notif, ...prev]);
    this._toastQueue.update((q) => [...q, notif]);
  }

  markRead(id: string): void {
    this._notifications.update((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllRead(): void {
    this._notifications.update((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  dismissToast(id: string): void {
    this._toastQueue.update((q) => q.filter((n) => n.id !== id));
    this.markRead(id);
  }

  // ── Polling ──────────────────────────────────────────────────────────────

  private startPolling(): void {
    if (!environment.notificationsApiReady) return;
    this.fetchNotifications();
    this.pollingInterval = setInterval(() => this.fetchNotifications(), 30_000);
  }

  private stopPolling(): void {
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * TODO: Replace mock URL with real endpoint GET /api/notifications once backend exists.
   * Expected response shape: NotificationApiResponse { notifications: Notification[] }
   *
   * Errors are NOT caught here — they propagate so the component can handle them gracefully.
   * Currently 404s are silently ignored via the subscribe error handler in the service itself
   * because there is no UI to surface polling errors (it just means "no new notifications").
   */
  private fetchNotifications(): void {
    this.http
      .get<NotificationApiResponse>(`${this.api}/notifications`)
      .subscribe({
        next: (response) => {
          const incoming = response.notifications;
          // Merge: add only new notifications (by id) and preserve local state
          const existingIds = new Set(this._notifications().map((n) => n.id));
          const fresh = incoming.filter((n) => !existingIds.has(n.id));

          if (fresh.length > 0) {
            this._notifications.update((prev) => [...fresh, ...prev]);
            // Queue fresh ones as toasts
            this._toastQueue.update((q) => [...q, ...fresh]);
          }
        },
        // Silent fail: backend endpoint doesn't exist yet, polling continues
        error: () => {},
      });
  }

  // ── Icon helper ──────────────────────────────────────────────────────────
  static iconForType(type: NotificationType): string {
    switch (type) {
      case 'achievement': return '🏆';
      case 'feedback':    return '💬';
      case 'ranking':     return '🚀';
    }
  }
}
