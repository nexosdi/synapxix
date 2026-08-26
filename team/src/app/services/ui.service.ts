import { Injectable, signal } from '@angular/core';

export interface ModalContent {
  title: string;
  text: string;
  list?: string[];
  /** Qué observa D.A.L.A. en esta misión. Transparencia, siempre a un toque. */
  observes?: string;
}

/** Toast y modal compartidos por toda la experiencia. */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly toastText = signal('');
  readonly toastVisible = signal(false);
  readonly modal = signal<ModalContent | null>(null);

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  toast(message: string) {
    this.toastText.set(message);
    this.toastVisible.set(true);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 2200);
  }

  openModal(content: ModalContent) {
    this.modal.set(content);
  }

  closeModal() {
    this.modal.set(null);
  }
}
