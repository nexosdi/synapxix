import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { INTRUDER_TASKS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Reto 3 — Instrumento `intruder`: "El detector de test disfrazado".
 * Directo del maestro §5.2: cada ronda enfrenta sobreinferencias reales
 * (las que la v1 del producto cometía) contra lecturas válidas bajo v3.
 */
@Component({
  selector: 'synapxix-game-intruder',
  standalone: true,
  template: `
    <div class="scene-panel">
      <div class="scene-heading">
        <span class="eyebrow">RETO 3 · EL DETECTOR DE TEST DISFRAZADO</span>
        <h2>Una de estas frases<br /><em>es una sobreinferencia.</em></h2>
        <p>{{ task().prompt }}</p>
      </div>

      <div class="game-toolbar">
        <span class="task-count">Ronda {{ taskIndex() + 1 }} / {{ tasks.length }}</span>
        <button class="chip-btn" [disabled]="cleared().length > 0 || found()" (click)="hint()">💡 Descartar una segura</button>
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

      @if (feedback(); as fb) {
        <div class="feedback-banner" [class.good]="fb.good" [class.bad]="!fb.good">{{ fb.text }}</div>
      }
      @if (found()) {
        <div class="feedback-banner info">{{ task().why }}</div>
      }

      <div class="scene-actions">
        <span>la intrusa siempre suena razonable — por eso el detector importa</span>
        <span></span>
      </div>
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
  readonly feedback = signal<{ good: boolean; text: string } | null>(null);

  private attempt = 1;
  private failedThis = false;
  private shownAt = Date.now();
  /** Bloquea interacciones durante la transición: evita dobles avances. */
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
    this.feedback.set(null);
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
      this.feedback.set({
        good: false,
        text: 'Esa lectura sí es legítima bajo v3. La sobreinferencia sigue suelta — buscá la que promete saber demasiado.',
      });
      return;
    }

    this.found.set(true);
    this.feedback.set({ good: true, text: '¡Detectada!' });
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
    }, 3400);
  }
}
