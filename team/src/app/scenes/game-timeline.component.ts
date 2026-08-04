import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { TIMELINE_TASKS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Nivel 2 — "El ciclo" (instrumento `timeline-order`).
 * Una sola secuencia: el latido de D.A.L.A. "Cambiar de enfoque" (armar
 * desde el final) emite un `strategy_changed` genuino.
 */
@Component({
  selector: 'synapxix-game-timeline',
  standalone: true,
  template: `
    <div class="scene-panel game-panel">
      <div class="scene-heading" style="text-align: center; margin: 0 auto 8px">
        <span class="eyebrow">NIVEL 2 · EL CICLO</span>
        <h2>{{ task().intro }}</h2>
      </div>

      <div class="game-toolbar">
        <span class="task-count">{{ placed().length }} / {{ task().steps.length }} · {{ reverse() ? 'desde el final' : 'desde el inicio' }}</span>
        <button class="chip-btn" (click)="switchStrategy()">⇄ Otro enfoque</button>
        <button class="chip-btn" [disabled]="hinted()" (click)="hint()">💡 Pista</button>
      </div>

      <div class="timeline-built">
        @if (placed().length === 0) {
          <span class="placeholder">{{ reverse() ? '¿Cómo TERMINA el ciclo?' : '¿Cómo EMPIEZA el ciclo?' }}</span>
        }
        @for (step of displayPlaced(); track step; let last = $last) {
          <span class="placed">{{ step }}</span>
          @if (!last) {
            <span class="arrow">→</span>
          }
        }
      </div>

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

      @if (ticker(); as t) {
        <div class="insight-ticker" [class.warn]="t.warn">{{ t.text }}</div>
      }
    </div>
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
  readonly ticker = signal<{ text: string; warn?: boolean } | null>(null);

  private attempt = 1;
  private failedThis = false;
  private locked = false;
  private adapter: ReturnType<PulseSessionService['startInstrument']> | null = null;

  ngOnInit() {
    this.adapter = this.session.startInstrument('timeline-order');
    this.presentTask();
  }

  task() {
    return this.tasks[this.taskIndex()];
  }

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
    this.ticker.set({ text: `⇄ Ahora armás ${to.split('-').join(' ')}. A veces el final revela el principio.` });
  }

  hint() {
    if (this.locked) return;
    this.hinted.set(true);
    this.session.interact({ kind: 'hint', taskId: this.task().taskId, level: 1 });
  }

  pick(step: string) {
    if (this.locked) return;
    const correct = step === this.expected();

    if (this.failedThis && !correct) {
      this.session.interact({ kind: 'retry', taskId: this.task().taskId, attempt: ++this.attempt });
    }
    this.session.interact({ kind: 'answer', taskId: this.task().taskId, correct, attempt: this.attempt });

    if (!correct) {
      this.failedThis = true;
      this.ticker.set({ text: '¿Qué necesita existir antes de ese paso?', warn: true });
      return;
    }

    this.hinted.set(false);
    this.placed.update((prev) => [...prev, step]);
    this.ticker.set(null);

    if (this.placed().length === this.task().steps.length) {
      this.session.interact({ kind: 'complete', taskId: this.task().taskId });
      this.ticker.set({ text: `✓ ${this.task().closing}` });
      this.locked = true;
      setTimeout(() => {
        if (this.taskIndex() < this.tasks.length - 1) {
          this.taskIndex.update((i) => i + 1);
          this.presentTask();
          this.locked = false;
        } else {
          void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
        }
      }, 1600);
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
