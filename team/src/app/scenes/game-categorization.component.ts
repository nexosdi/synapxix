import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { level1Tasks, type CategorizationTask } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Nivel 1 — "¿Dónde vive?" (instrumento `categorization`).
 * Cartas de una línea, un toque por decisión, avance inmediato. Una carta
 * es propia del área elegida. El porqué aparece como insight ambiental,
 * nunca como bloqueo.
 */
@Component({
  selector: 'synapxix-game-categorization',
  standalone: true,
  template: `
    <div class="scene-panel game-panel">
      <div class="scene-heading" style="text-align: center; margin: 0 auto 8px">
        <span class="eyebrow">NIVEL 1 · ¿DÓNDE VIVE?</span>
        <h2>Cada pieza tiene su casa.</h2>
      </div>

      <div class="game-toolbar">
        <span class="task-count">{{ done_() }} / {{ total() }}</span>
        @if (streak() >= 2) {
          <span class="streak">⚡ x{{ streak() }}</span>
        }
        <button class="chip-btn" [disabled]="hinted()" (click)="hint()">💡 Pista</button>
      </div>

      <div class="statement-card" [class.shake]="shaking()">“{{ current().text }}”</div>

      <div class="bucket-row">
        @for (bucket of task().buckets; track bucket.id) {
          <button
            class="bucket"
            [class.hinted]="hinted() && bucket.id === current().bucket"
            (click)="place(bucket.id)"
          >
            <b>{{ bucket.label }}</b>
            <small>{{ bucket.hintText }}</small>
          </button>
        }
      </div>

      @if (ticker(); as t) {
        <div class="insight-ticker" [class.warn]="t.warn">{{ t.text }}</div>
      }
    </div>
  `,
})
export class GameCategorizationComponent implements OnInit {
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<void>();

  tasks: CategorizationTask[] = [];
  readonly taskIndex = signal(0);
  readonly statementIndex = signal(0);
  readonly hinted = signal(false);
  readonly shaking = signal(false);
  readonly streak = signal(0);
  readonly ticker = signal<{ text: string; warn?: boolean } | null>(null);

  private attempt = 1;
  private failedThis = false;
  private shownAt = Date.now();
  private locked = false;
  private adapter: ReturnType<PulseSessionService['startInstrument']> | null = null;

  ngOnInit() {
    this.tasks = level1Tasks(this.session.area());
    this.adapter = this.session.startInstrument('categorization');
    this.presentTask();
  }

  task() {
    return this.tasks[this.taskIndex()];
  }

  current() {
    return this.task().statements[this.statementIndex()];
  }

  total() {
    return this.tasks.reduce((acc, t) => acc + t.statements.length, 0);
  }

  done_() {
    return this.tasks.slice(0, this.taskIndex()).reduce((acc, t) => acc + t.statements.length, 0) + this.statementIndex();
  }

  private presentTask() {
    const task = this.task();
    this.session.interact({ kind: 'task_shown', taskId: task.taskId, skillIds: [task.skillId] });
    this.shownAt = Date.now();
  }

  hint() {
    if (this.locked) return;
    this.hinted.set(true);
    this.session.interact({ kind: 'hint', taskId: this.task().taskId, level: 1 });
  }

  place(bucketId: string) {
    if (this.locked) return;
    const statement = this.current();
    const correct = statement.bucket === bucketId;

    if (this.failedThis) {
      this.session.interact({ kind: 'retry', taskId: this.task().taskId, attempt: ++this.attempt });
    }
    this.session.interact({
      kind: 'answer',
      taskId: this.task().taskId,
      correct,
      latencyMs: Date.now() - this.shownAt,
      attempt: this.attempt,
    });

    if (!correct) {
      this.failedThis = true;
      this.streak.set(0);
      this.shaking.set(true);
      setTimeout(() => this.shaking.set(false), 400);
      this.ticker.set({ text: 'Ahí no — pensá en la función, no en cómo suena.', warn: true });
      return;
    }

    if (!this.failedThis && !this.hinted()) this.streak.update((s) => s + 1);
    this.ticker.set(statement.why ? { text: `✓ ${statement.why}` } : null);
    this.advance();
  }

  private advance() {
    this.attempt = 1;
    this.failedThis = false;
    this.hinted.set(false);
    this.locked = true;
    setTimeout(() => {
      if (this.statementIndex() < this.task().statements.length - 1) {
        this.statementIndex.update((i) => i + 1);
        this.shownAt = Date.now();
        this.locked = false;
        return;
      }
      this.session.interact({ kind: 'complete', taskId: this.task().taskId });
      if (this.taskIndex() < this.tasks.length - 1) {
        this.taskIndex.update((i) => i + 1);
        this.statementIndex.set(0);
        this.presentTask();
        this.locked = false;
        return;
      }
      void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
    }, 620);
  }
}
