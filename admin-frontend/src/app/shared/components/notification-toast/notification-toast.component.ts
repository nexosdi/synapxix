import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification, NotificationType } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.css'],
})
export class NotificationToastComponent {
  private readonly svc = inject(NotificationService);

  /** Currently visible toasts (capped at 3) */
  readonly visibleToasts = signal<(Notification & { leaving: boolean })[]>([]);

  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly processedIds = new Set<string>();

  constructor() {
    // effect() runs synchronously whenever toastQueue signal changes —
    // zero latency, no polling needed.
    effect(() => {
      const queued = this.svc.toastQueue();
      for (const notif of queued) {
        if (!this.processedIds.has(notif.id) && this.visibleToasts().length < 3) {
          this.processedIds.add(notif.id);
          this.showToast(notif);
        }
      }
    });
  }

  private showToast(notif: Notification): void {
    this.visibleToasts.update((list) => [...list, { ...notif, leaving: false }]);
    // Auto-dismiss after 4s
    const t = setTimeout(() => this.startLeave(notif.id), 4000);
    this.timers.set(notif.id, t);
  }

  startLeave(id: string): void {
    this.visibleToasts.update((list) =>
      list.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => this.removeToast(id), 320);
  }

  private removeToast(id: string): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.processedIds.delete(id);
    this.visibleToasts.update((list) => list.filter((t) => t.id !== id));
    this.svc.dismissToast(id);
  }

  getIcon(type: string): string {
    return NotificationService.iconForType(type as NotificationType);
  }

  trackById(_: number, item: Notification) {
    return item.id;
  }
}
