import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { TIMELINE_TASKS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Reto 2 — Instrumento `timeline-order`.
 * Además de respuestas y reintentos, este reto expone el botón
 * "cambiar de enfoque" (construir desde el final): un `strategy_changed`
 * genuino que alimenta la flexibilidad estratégica.
 */
@Component({
  selector: 'synapxix-game-timeline',
  standalone: true,
  template: `
    <section class="scene-panel">
      <span class="eyebrow">RETO 2 · EL CICLO VIVO</span>
      <h2>{{ task().title }}</h2>
      <p class="scene-lead">{{ task().intro }}</p>

      <div class="game-toolbar">
        <span class="task-count">Secuencia {{ taskIndex() + 1 }} de {{ tasks.length }} · modo: {{ reverse() ? 'desde el final' : 'desde el inicio' }}</span>
        <button class="chip-btn" (click)="switchStrategy()">⇄ Cambiar de enfoque</button>
        <button class="chip-btn" [disabled]="hinted()" (click)="hint()">💡 Pista</button>
        <button class="chip-btn" [disabled]="placed().length === 0" (click)="reset()">↺ Reordenar</button>
      </div>

      <div class="timeline-built">
        @if (placed().length === 0) {
          <span style="color: var(--sx-text-muted); font-weight: 600">
            {{ reverse() ? 'Elegí el ÚLTIMO paso primero…' : 'Elegí el PRIMER paso…' }}
          </span>
        }
        @for (step of displayPlaced(); track step; let last = $last) {
          <span class="placed">{{ step }}</span>
          @if (!last) {
            <span class="arrow">→</span>
          }
        }
      </div>

      @if (feedback(); as fb) {
        <div class="feedback-banner" [class.good]="fb.good" [class.bad]="!fb.good">{{ fb.text }}</div>
      }

      <div class="timeline-pool">
        @for (step of pool(); track step) {
          <button
            class="step-chip"
            [disabled]="placed().includes(step)"
            [class.hinted]="hinted() && step === expected()"
            (click)="pick(step)"
          >
            {{ step }}
          </button>
        }
      </div>
    </section>
  `,
})
export class GameTimelineComponent implements OnInit {
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<void>();

  readonly tasks = TIMELINE_TASKS;
  readonly taskIndex = signal(0);
  readonly placed = signal<string[]>([]);
  readonly pool = signal<string[]>([]);
  readonly reverse = signal(false);
  readonly hinted = signal(false);
  readonly feedback = signal<{ good: boolean; text: string } | null>(null);

  private attempt = 1;
  private failedThis = false;
  /** Bloquea interacciones durante la transición: evita dobles avances. */
  private locked = false;
  private adapter: ReturnType<PulseSessionService['startInstrument']> | null = null;

  ngOnInit() {
    this.adapter = this.session.startInstrument('timeline-order');
    this.presentTask();
  }

  task() {
    return this.tasks[this.taskIndex()];
  }

  /** El paso que corresponde ahora según el modo (inicio o final). */
  expected(): string {
    const steps = this.task().steps;
    const n = this.placed().length;
    return this.reverse() ? steps[steps.length - 1 - n] : steps[n];
  }

  displayPlaced(): string[] {
    return this.reverse() ? [...this.placed()].reverse() : this.placed();
  }

  private presentTask() {
    const task = this.task();
    this.session.interact({ kind: 'task_shown', taskId: task.taskId, skillIds: [task.skillId] });
    this.pool.set(this.shuffle(task.steps));
    this.placed.set([]);
    this.reverse.set(false);
    this.hinted.set(false);
    this.attempt = 1;
    this.failedThis = false;
  }

  switchStrategy() {
    if (this.locked) return;
    const from = this.reverse() ? 'desde-el-final' : 'desde-el-inicio';
    const to = this.reverse() ? 'desde-el-inicio' : 'desde-el-final';
    this.session.interact({ kind: 'strategy_shift', taskId: this.task().taskId, from, to });
    this.reverse.update((r) => !r);
    this.placed.set([]);
    this.hinted.set(false);
    this.feedback.set({ good: true, text: `Nuevo enfoque: construir ${to.split('-').join(' ')}. Cambiar de estrategia a tiempo es una señal, no una derrota.` });
  }

  hint() {
    if (this.locked) return;
    this.hinted.set(true);
    this.session.interact({ kind: 'hint', taskId: this.task().taskId, level: 1 });
  }

  reset() {
    if (this.locked) return;
    this.session.interact({ kind: 'retry', taskId: this.task().taskId, attempt: ++this.attempt });
    this.placed.set([]);
    this.hinted.set(false);
    this.feedback.set(null);
  }

  pick(step: string) {
    if (this.locked) return;
    const correct = step === this.expected();

    if (this.failedThis && correct === false) {
      // ya venía de un error: este nuevo intento fallido también es reintento
      this.session.interact({ kind: 'retry', taskId: this.task().taskId, attempt: ++this.attempt });
    }

    this.session.interact({
      kind: 'answer',
      taskId: this.task().taskId,
      correct,
      attempt: this.attempt,
    });

    if (!correct) {
      this.failedThis = true;
      this.feedback.set({ good: false, text: 'Ese paso va en otro momento del ciclo. Mirá lo ya colocado y probá otro.' });
      return;
    }

    this.hinted.set(false);
    this.placed.update((prev) => [...prev, step]);
    this.feedback.set(null);

    if (this.placed().length === this.task().steps.length) {
      this.session.interact({ kind: 'complete', taskId: this.task().taskId });
      this.feedback.set({ good: true, text: '¡Secuencia completa!' });
      this.locked = true;
      setTimeout(() => {
        this.feedback.set(null);
        if (this.taskIndex() < this.tasks.length - 1) {
          this.taskIndex.update((i) => i + 1);
          this.presentTask();
          this.locked = false;
        } else {
          void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
        }
      }, 900);
    }
  }

  private shuffle<T>(items: readonly T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
