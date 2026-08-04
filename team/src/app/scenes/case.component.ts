import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CASE_SUBJECT, CASE_TASKS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Escena 5 — El caso exprés. Tres toques: dos de rigor (¿hecho o lectura?)
 * y uno de política (mínima ayuda eficaz). La traza de M. en tres líneas.
 * Corre como sesión del instrumento `categorization`.
 */
@Component({
  selector: 'synapxix-case',
  standalone: true,
  template: `
    <div class="scene-panel game-panel">
      <div class="scene-heading" style="text-align: center; margin: 0 auto 8px">
        <span class="eyebrow">FINAL · AHORA EL SISTEMA SOS VOS</span>
        <h2>La traza de {{ subject.name }}, {{ subject.age }}.</h2>
      </div>

      <div class="case-board slim">
        <div class="case-trace">
          @for (line of subject.trace; track line; let i = $index) {
            <div><i>E{{ i + 1 }}</i>{{ line }}</div>
          }
        </div>
      </div>

      <p class="case-prompt">{{ prompt() }}</p>

      @if (task().kind === 'clasificar') {
        <div class="statement-card" [class.shake]="shaking()">“{{ currentStatement().text }}”</div>
        <div class="bucket-row two">
          @for (bucket of task().buckets!; track bucket.id) {
            <button class="bucket" (click)="placeStatement(bucket.id)">
              <b>{{ bucket.label }}</b>
              <small>{{ bucket.hintText }}</small>
            </button>
          }
        </div>
      } @else {
        <div class="case-options">
          @for (option of task().options!; track option.id; let i = $index) {
            <button
              class="case-option"
              [class.chosen]="chosen() === option.id"
              [disabled]="chosen() !== ''"
              (click)="pickOption(option.id)"
            >
              <i>{{ ['A', 'B', 'C'][i] }}</i>
              {{ option.text }}
            </button>
          }
        </div>
      }

      @if (ticker(); as t) {
        <div class="insight-ticker" [class.warn]="t.warn">{{ t.text }}</div>
      }
    </div>
  `,
})
export class CaseComponent implements OnInit {
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<void>();

  readonly subject = CASE_SUBJECT;
  readonly tasks = CASE_TASKS;
  readonly taskIndex = signal(0);
  readonly statementIndex = signal(0);
  readonly chosen = signal('');
  readonly shaking = signal(false);
  readonly ticker = signal<{ text: string; warn?: boolean } | null>(null);

  private attempt = 1;
  private failedThis = false;
  private shownAt = Date.now();
  private locked = false;
  private adapter: ReturnType<PulseSessionService['startInstrument']> | null = null;

  ngOnInit() {
    this.adapter = this.session.startInstrument('categorization');
    this.presentTask();
  }

  task() {
    return this.tasks[this.taskIndex()];
  }

  prompt() {
    return this.task().prompt;
  }

  currentStatement() {
    return this.task().statements![this.statementIndex()];
  }

  private presentTask() {
    const task = this.task();
    this.session.interact({ kind: 'task_shown', taskId: task.taskId, skillIds: [task.skillId] });
    this.statementIndex.set(0);
    this.chosen.set('');
    this.attempt = 1;
    this.failedThis = false;
    this.shownAt = Date.now();
  }

  placeStatement(bucketId: string) {
    if (this.locked) return;
    const statement = this.currentStatement();
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
      this.shaking.set(true);
      setTimeout(() => this.shaking.set(false), 400);
      this.ticker.set({ text: '¿Está en la traza, o lo pusiste vos?', warn: true });
      return;
    }

    this.ticker.set(statement.why ? { text: `✓ ${statement.why}` } : null);
    this.locked = true;
    setTimeout(() => {
      this.attempt = 1;
      this.failedThis = false;
      if (this.statementIndex() < this.task().statements!.length - 1) {
        this.statementIndex.update((i) => i + 1);
        this.shownAt = Date.now();
        this.locked = false;
      } else {
        this.completeTask();
      }
    }, statement.why ? 1700 : 620);
  }

  pickOption(optionId: string) {
    if (this.locked) return;
    const option = this.task().options!.find((o) => o.id === optionId);
    if (!option) return;

    if (this.failedThis) {
      this.session.interact({ kind: 'retry', taskId: this.task().taskId, attempt: ++this.attempt });
    }
    this.session.interact({
      kind: 'answer',
      taskId: this.task().taskId,
      correct: option.correct,
      latencyMs: Date.now() - this.shownAt,
      attempt: this.attempt,
    });

    if (!option.correct) {
      this.failedThis = true;
      this.ticker.set({ text: option.why, warn: true });
      return;
    }

    this.chosen.set(optionId);
    this.ticker.set({ text: `✓ ${option.why}` });
    this.locked = true;
    setTimeout(() => this.completeTask(), 2200);
  }

  private completeTask() {
    this.ticker.set(null);
    this.session.interact({ kind: 'complete', taskId: this.task().taskId });
    if (this.taskIndex() < this.tasks.length - 1) {
      this.taskIndex.update((i) => i + 1);
      this.presentTask();
      this.locked = false;
    } else {
      void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
    }
  }
}
