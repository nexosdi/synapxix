import { Injectable, signal } from '@angular/core';

export interface ModalContent {
  title: string;
  text: string;
  list?: string[];
  /** Qué observa D.A.L.A. en esta misión. Transparencia, siempre a un toque. */
  observes?: string;
}

/** Toast, modal y sonido compartidos por toda la experiencia. */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly toastText = signal('');
  readonly toastVisible = signal(false);
  readonly modal = signal<ModalContent | null>(null);
  /** Sonido ambiental (WebAudio). La persona puede silenciarlo. */
  readonly soundOn = signal(true);

  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private audioCtx: AudioContext | null = null;

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

  /** Tono corto de interfaz. Falla en silencio si el navegador lo bloquea. */
  tone(freq = 520, duration = 0.06) {
    if (!this.soundOn()) return;
    try {
      this.audioCtx = this.audioCtx ?? new AudioContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.025, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // sin audio disponible: la experiencia sigue igual
    }
  }
}
