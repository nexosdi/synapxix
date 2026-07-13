import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { NgZone } from '@angular/core';
import { timer, switchMap, EMPTY } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification, NotificationApiResponse, NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http    = inject(HttpClient);
  private readonly ngZone  = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly api     = environment.apiUrl;

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

  constructor() {
    this.startPolling();
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

  /**
   * Runs the 30-second polling loop OUTSIDE Zone.js so the timer tick never
   * triggers a global change-detection cycle on its own.
   *
   * switchMap cancels any in-flight HTTP request before firing the next one,
   * preventing overlapping responses / race conditions.
   *
   * takeUntilDestroyed() tears down the subscription automatically when the
   * root injector is destroyed — no manual OnDestroy needed.
   *
   * TODO: flip environment.notificationsApiReady to true once
   * GET /api/notifications ships on the backend.
   */
  private startPolling(): void {
    if (!environment.notificationsApiReady) return;

    this.ngZone.runOutsideAngular(() => {
      timer(0, 30_000)
        .pipe(
          switchMap(() =>
            this.http
              .get<NotificationApiResponse>(`${this.api}/notifications`)
              .pipe(
                // Silent fail — keeps polling even if the endpoint isn't ready
                switchMap((res) => {
                  this.ngZone.run(() => this.mergeIncoming(res.notifications));
                  return EMPTY;
                })
              )
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({ error: () => {} });
    });
  }

  private mergeIncoming(incoming: Notification[]): void {
    const existingIds = new Set(this._notifications().map((n) => n.id));
    const fresh = incoming.filter((n) => !existingIds.has(n.id));

    if (fresh.length > 0) {
      this._notifications.update((prev) => [...fresh, ...prev]);
      // Cap queue so a notification burst doesn't grow it unbounded
      this._toastQueue.update((q) => [...q, ...fresh].slice(-20));
    }
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
