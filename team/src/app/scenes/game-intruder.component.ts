import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { INTRUDER_TASKS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Nivel 3 — "La impostora" (instrumento `intruder`).
 * Dos rondas, un toque cada una: entre frases que son de los nuestros,
 * una sobreinferencia se esconde.
 */
@Component({
  selector: 'synapxix-game-intruder',
  standalone: true,
  template: `
    <div class="scene-panel game-panel">
      <div class="scene-heading" style="text-align: center; margin: 0 auto 8px">
        <span class="eyebrow">NIVEL 3 · LA IMPOSTORA</span>
        <h2>Una de estas frases<br /><em>no es de los nuestros.</em></h2>
      </div>

      <div class="game-toolbar">
        <span class="task-count">Ronda {{ taskIndex() + 1 }} / {{ tasks.length }}</span>
        <button class="chip-btn" [disabled]="cleared().length > 0 || found()" (click)="hint()">💡 Descartar una</button>
      </div>

      <div class="intruder-grid">
        @for (card of task().cards; track card.id) {
          <button
            class="intruder-card"
            [class.cleared]="cleared().includes(card.id)"
            [class.found]="found() && card.intruder"
            [disabled]="cleared().includes(card.id) || found()"
            (click)="pick(card.id)"
          >
            “{{ card.text }}”
          </button>
        }
      </div>

      @if (ticker(); as t) {
        <div class="insight-ticker" [class.warn]="t.warn">{{ t.text }}</div>
      }
    </div>
  `,
})
export class GameIntruderComponent implements OnInit {
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<void>();

  readonly tasks = INTRUDER_TASKS;
  readonly taskIndex = signal(0);
  readonly cleared = signal<string[]>([]);
  readonly found = signal(false);
  readonly ticker = signal<{ text: string; warn?: boolean } | null>(null);

  private attempt = 1;
  private failedThis = false;
  private shownAt = Date.now();
  private locked = false;
  private adapter: ReturnType<PulseSessionService['startInstrument']> | null = null;

  ngOnInit() {
    this.adapter = this.session.startInstrument('intruder');
    this.presentTask();
  }

  task() {
    return this.tasks[this.taskIndex()];
  }

  private presentTask() {
    const task = this.task();
    this.session.interact({ kind: 'task_shown', taskId: task.taskId, skillIds: [task.skillId] });
    this.cleared.set([]);
    this.found.set(false);
    this.ticker.set(null);
    this.attempt = 1;
    this.failedThis = false;
    this.shownAt = Date.now();
  }

  hint() {
    if (this.locked) return;
    this.session.interact({ kind: 'hint', taskId: this.task().taskId, level: 1 });
    const safe = this.task().cards.find((c) => !c.intruder && !this.cleared().includes(c.id));
    if (safe) this.cleared.update((prev) => [...prev, safe.id]);
  }

  pick(cardId: string) {
    if (this.locked) return;
    const card = this.task().cards.find((c) => c.id === cardId);
    if (!card) return;

    if (this.failedThis) {
      this.session.interact({ kind: 'retry', taskId: this.task().taskId, attempt: ++this.attempt });
    }
    this.session.interact({
      kind: 'answer',
      taskId: this.task().taskId,
      correct: card.intruder,
      latencyMs: Date.now() - this.shownAt,
      attempt: this.attempt,
    });

    if (!card.intruder) {
      this.failedThis = true;
      this.ticker.set({ text: 'Esa sí es nuestra. Buscá la que promete saber demasiado.', warn: true });
      return;
    }

    this.found.set(true);
    this.ticker.set({ text: `✓ ${this.task().why}` });
    this.session.interact({ kind: 'complete', taskId: this.task().taskId });
    this.locked = true;
    setTimeout(() => {
      if (this.taskIndex() < this.tasks.length - 1) {
        this.taskIndex.update((i) => i + 1);
        this.presentTask();
        this.locked = false;
      } else {
        void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
      }
    }, 2400);
  }
}
