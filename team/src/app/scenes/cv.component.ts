import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CV_TEXT } from '../content';
import { PulseApiService } from '../services/pulse-api.service';
import { UiService } from '../services/ui.service';

const TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/msword': 'Word',
};
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Tu lugar en el equipo: CV y enlaces, justo antes de ver la estrella. Es
 * opcional y tiene su propia autorización; lo que se sube no entra a
 * D.A.L.A., no se analiza con IA y se guarda separado de los eventos.
 */
@Component({
  selector: 'synapxix-cv',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="beat cvStep">
      <p class="eyebrow"><b>TU LUGAR EN EL EQUIPO</b> · OPCIONAL</p>
      <h2 class="beatTitle">{{ text.title }}</h2>
      <p class="beatNote wide">{{ text.lead }}</p>

      <label class="dropZone" [class.has]="file()" (dragover)="$event.preventDefault()" (drop)="drop($event)">
        <input type="file" accept=".pdf,.doc,.docx,application/pdf" (change)="pick($event)" />
        @if (file(); as f) {
          <b>{{ f.name }}</b>
          <span>{{ kind(f) }} · {{ (f.size / 1024 / 1024).toFixed(1) }} MB · tocá para cambiarlo</span>
        } @else {
          <b>Arrastrá tu CV o tocá para elegirlo</b>
          <span>PDF o Word, hasta 5 MB</span>
        }
      </label>

      <label class="field cvLinks">
        Enlaces (uno por línea)
        <textarea [(ngModel)]="links" name="links" rows="2" placeholder="https://linkedin.com/in/…&#10;https://github.com/…"></textarea>
      </label>

      <label class="consentCheck" [class.on]="accepted">
        <input type="checkbox" [(ngModel)]="accepted" name="cvConsent" />
        <span>{{ text.consent }}</span>
      </label>

      @if (error()) {
        <div class="formError">{{ error() }}</div>
      }
      <div class="microActions">
        <button class="btn ghost" (click)="done.emit()">LO HAGO DESPUÉS</button>
        <button class="btn primary" [disabled]="saving() || !ready()" (click)="save()">
          {{ saving() ? 'GUARDANDO…' : 'GUARDAR Y VER MI ESTRELLA →' }}
        </button>
      </div>
    </div>
  `,
})
export class CvComponent {
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly text = CV_TEXT;
  readonly file = signal<File | null>(null);
  readonly saving = signal(false);
  readonly error = signal('');
  links = '';
  accepted = false;

  kind(f: File) {
    return TYPES[f.type] ?? 'Archivo';
  }

  linkList() {
    return this.links
      .split(/\s+/)
      .map((l) => l.trim())
      .filter(Boolean);
  }

  ready() {
    return this.accepted && (this.file() !== null || this.linkList().length > 0);
  }

  pick(event: Event) {
    this.setFile((event.target as HTMLInputElement).files?.[0] ?? null);
  }

  drop(event: DragEvent) {
    event.preventDefault();
    this.setFile(event.dataTransfer?.files?.[0] ?? null);
  }

  async save() {
    if (!this.ready()) return;
    this.saving.set(true);
    this.error.set('');
    try {
      const f = this.file();
      const cv = f ? { filename: f.name, mime: f.type, base64: await toBase64(f) } : undefined;
      await this.api.saveCv({ consent: true, cv, links: this.linkList() });
      this.ui.toast('Guardado. Solo lo ve el equipo autorizado.');
      this.done.emit();
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      this.error.set(
        message.includes('invalid_link')
          ? 'Revisá los enlaces: tienen que empezar con https://'
          : message.includes('file_too_large')
            ? 'El archivo supera los 5 MB.'
            : 'No pudimos guardarlo. Podés intentarlo de nuevo o hacerlo después.',
      );
    } finally {
      this.saving.set(false);
    }
  }

  private setFile(f: File | null) {
    this.error.set('');
    if (!f) return;
    if (!TYPES[f.type]) {
      this.error.set('Subí un PDF o un documento de Word.');
      return;
    }
    if (f.size > MAX_BYTES) {
      this.error.set('El archivo supera los 5 MB.');
      return;
    }
    this.file.set(f);
  }
}

/** Contenido del archivo en base64 (sin el prefijo data:). */
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
