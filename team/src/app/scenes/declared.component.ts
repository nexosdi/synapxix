import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FEEDBACK_MODES, WORK_RHYTHMS } from '../content';
import { PulseApiService } from '../services/pulse-api.service';

/**
 * Escena 6 — El acuerdo. Todo lo de esta pantalla es DECLARADO: la persona
 * lo dice, decide si se comparte, y nunca se mezcla con la evidencia
 * conductual (vive en team, no en dala). Transparencia por rol, en chico.
 */
@Component({
  selector: 'synapxix-declared',
  standalone: true,
  template: `
    <div class="scene-panel">
      <div class="contract-grid">
        <div class="scene-heading">
          <span class="eyebrow">EL ACUERDO · DECLARADO, NO INFERIDO</span>
          <h2>La conducta da señales.<br /><em>Vos tenés la última palabra.</em></h2>
          <p>
            Lo que sigue no se infiere: lo declarás vos. Sirve para ajustar tu integración al
            equipo — y el sistema lo trata como declaración tuya, con tu control.
          </p>
        </div>
        <div class="privacy-card">
          <span>CONTROL DE INFORMACIÓN</span>
          <b>{{ share() ? 'Compartir con el equipo' : 'Solo en mi resultado' }}</b>
          <button class="toggle" [class.on]="share()" (click)="share.set(!share())" aria-label="Cambiar permiso de compartir">
            <i></i>
          </button>
        </div>
      </div>

      <div class="contract-options">
        <div>
          <span>Cuando una tarea es nueva…</span>
          @for (rhythm of workRhythms; track rhythm.id) {
            <button [class.active]="workRhythm() === rhythm.id" (click)="workRhythm.set(rhythm.id)">
              {{ rhythm.label }}
              <small>{{ rhythm.copy }}</small>
            </button>
          }
        </div>
        <div>
          <span>El feedback me sirve más cuando…</span>
          @for (mode of feedbackModes; track mode.id) {
            <button [class.active]="feedbackMode() === mode.id" (click)="feedbackMode.set(mode.id)">
              {{ mode.label }}
              <small>{{ mode.copy }}</small>
            </button>
          }
        </div>
      </div>

      <div class="scope-explainer">
        <div>
          <span class="scope-icon">VOS</span>
          <p><b>Tu lectura</b> incluye señales, alternativas no descartadas, límites y próxima validación.</p>
        </div>
        <div>
          <span class="scope-icon team">SYN</span>
          <p><b>La vista de equipo</b> conserva solo lo operativo: integración, ritmo y feedback declarados.</p>
        </div>
        <div>
          <span class="scope-icon no">×</span>
          <p><b>No generamos</b> diagnóstico, ranking, emoción inferida ni predicción de desempeño.</p>
        </div>
      </div>

      @if (error()) {
        <div class="feedback-banner bad">{{ error() }}</div>
      }

      <div class="scene-actions">
        <span>transparencia por rol: cada quien ve lo que le corresponde, en su idioma</span>
        <button class="primary" [disabled]="!workRhythm() || !feedbackMode() || saving()" (click)="save()">
          {{ saving() ? 'Guardando…' : 'Ver mi Primer Pulso' }} <span>→</span>
        </button>
      </div>
    </div>
  `,
})
export class DeclaredComponent {
  private readonly api = inject(PulseApiService);

  @Input({ required: true }) entryMode!: 'explore' | 'map' | 'story';
  @Output() done = new EventEmitter<void>();

  readonly workRhythms = WORK_RHYTHMS;
  readonly feedbackModes = FEEDBACK_MODES;
  readonly workRhythm = signal<'prototype' | 'align' | 'hybrid' | ''>('');
  readonly feedbackMode = signal<'direct' | 'questions' | 'context' | ''>('');
  readonly share = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');

  async save() {
    this.saving.set(true);
    this.error.set('');
    try {
      await this.api.saveDeclared({
        entryMode: this.entryMode,
        workRhythm: this.workRhythm() || undefined,
        feedbackMode: this.feedbackMode() || undefined,
        shareConditions: this.share(),
      });
      this.done.emit();
    } catch {
      this.error.set('No pudimos guardar. Probá de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }
}
