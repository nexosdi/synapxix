import {
  Component,
  inject,
  signal,
  computed,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css'],
})
export class NotificationBellComponent {
  private readonly svc = inject(NotificationService);
  private readonly elRef = inject(ElementRef);

  readonly notifications = this.svc.notifications;
  readonly unreadCount = this.svc.unreadCount;

  readonly isOpen = signal(false);

  /** Badge label: shows count or "9+" when ≥10 */
  readonly badgeLabel = computed(() => {
    const c = this.unreadCount();
    return c >= 10 ? '9+' : String(c);
  });

  togglePanel(): void {
    this.isOpen.update((v) => !v);
  }

  markRead(id: string): void {
    this.svc.markRead(id);
  }

  markAllRead(): void {
    this.svc.markAllRead();
  }

  getIcon(type: string): string {
    return NotificationService.iconForType(type as any);
  }

  hasNotifications(): boolean {
    return this.notifications().length > 0;
  }

  trackById(_: number, item: Notification) {
    return item.id;
  }

  /** Close panel when user clicks outside */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
