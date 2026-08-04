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
          <span class="eyebrow">ÚLTIMO PASO · LO DECLARÁS VOS</span>
          <h2>Dos preguntas<br /><em>y vemos tu pulso.</em></h2>
          <p>Esto no se infiere: lo decís vos, y elegís si el equipo lo ve.</p>
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

      @if (error()) {
        <div class="feedback-banner bad">{{ error() }}</div>
      }

      <div class="scene-actions">
        <span>sin diagnóstico, sin ranking, sin predicción de desempeño</span>
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
