import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FEEDBACK_MODES, WORK_RHYTHMS } from '../content';
import { PulseApiService } from '../services/pulse-api.service';

/**
 * Escena 5 — Acuerdo de colaboración. Todo lo de esta pantalla es DECLARADO:
 * la persona lo dice, decide si se comparte, y nunca se mezcla con la
 * evidencia conductual (vive en team, no en dala).
 */
@Component({
  selector: 'synapxix-declared',
  standalone: true,
  template: `
    <section class="scene-panel">
      <span class="eyebrow">ACUERDO DE COLABORACIÓN</span>
      <h2>La conducta da señales.<br /><em>Vos tenés la última palabra.</em></h2>
      <p class="scene-lead">
        Estas respuestas son declaradas por vos, no inferidas. Sirven para ajustar tu integración
        al equipo, y elegís si se comparten.
      </p>

      <h3 style="margin-top: 28px">Cuando una tarea es nueva…</h3>
      <div class="option-grid">
        @for (rhythm of workRhythms; track rhythm.id) {
          <button class="option-card" [class.active]="workRhythm() === rhythm.id" (click)="workRhythm.set(rhythm.id)">
            <b>{{ rhythm.label }}</b>
          </button>
        }
      </div>

      <h3>El feedback me sirve más cuando…</h3>
      <div class="option-grid">
        @for (mode of feedbackModes; track mode.id) {
          <button class="option-card" [class.active]="feedbackMode() === mode.id" (click)="feedbackMode.set(mode.id)">
            <b>{{ mode.label }}</b>
          </button>
        }
      </div>

      <div class="result-note">
        <b>Control de información:</b>
        {{ share() ? 'estas condiciones se compartirán con el equipo en la vista operativa.' : 'estas condiciones quedarán solo en tu resultado.' }}
        <button class="chip-btn" style="margin-left: 10px" (click)="share.set(!share())">
          {{ share() ? 'Dejar de compartir' : 'Compartir con el equipo' }}
        </button>
      </div>

      @if (error()) {
        <div class="feedback-banner bad">{{ error() }}</div>
      }

      <div class="scene-actions">
        <span class="scene-lead" style="font-size: 0.85rem">
          No generamos diagnóstico, ranking, emoción inferida ni predicción de desempeño.
        </span>
        <button class="btn btn-primary" [disabled]="!workRhythm() || !feedbackMode() || saving()" (click)="save()">
          {{ saving() ? 'Guardando…' : 'Ver mi Primer Pulso →' }}
        </button>
      </div>
    </section>
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
