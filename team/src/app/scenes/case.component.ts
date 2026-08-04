import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CASE_SUBJECT, CASE_TASKS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Escena 5 — El caso: la prueba de rigor del maestro (§5.2).
 * Una traza real de conducta y tres operaciones del sistema, hechas a mano:
 * separar observado de inferido, sostener la hipótesis que la evidencia
 * aguanta, y elegir la intervención de mínima ayuda eficaz.
 *
 * Corre como sesión del instrumento `categorization` (clasificar lecturas
 * ES categorizar): eventos canónicos, evidencia real.
 */
@Component({
  selector: 'synapxix-case',
  standalone: true,
  template: `
    <div class="scene-panel">
      <div class="scene-heading">
        <span class="eyebrow">EL CASO · OPERÁS VOS EL SISTEMA</span>
        <h2>Esto hace D.A.L.A.<br /><em>Ahora hacelo vos.</em></h2>
        <p>
          Una traza real de conducta. Tu trabajo es el del motor: leer sin sobreinferir,
          hipotetizar con alternativas y decidir con límites.
        </p>
      </div>

      <div class="case-board">
        <div class="case-person">
          <div class="avatar">{{ subject.name }}</div>
          <div>
            <span>SUJETO SINTÉTICO · {{ subject.age }}</span>
            <h3>La traza de {{ subject.name }}</h3>
            <p>{{ subject.context }}</p>
          </div>
        </div>
        <div class="case-trace">
          @for (line of subject.trace; track line; let i = $index) {
            <div><i>E{{ i + 1 }}</i>{{ line }}</div>
          }
        </div>
      </div>

      <div class="game-toolbar" style="margin-top: 28px">
        <span class="task-count">Operación {{ taskIndex() + 1 }} / {{ tasks.length }} · {{ stepLabel() }}</span>
      </div>

      <p class="scene-lead" style="font-size: 17px; font-weight: 700; color: var(--px-ink)">
        {{ task().prompt }}
      </p>

      @if (task().kind === 'clasificar') {
        <div class="statement-card">“{{ currentStatement().text }}”</div>
        @if (feedback(); as fb) {
          <div class="feedback-banner" [class.good]="fb.good" [class.bad]="!fb.good">{{ fb.text }}</div>
        }
        <div class="bucket-row">
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
        @if (feedback(); as fb) {
          <div class="feedback-banner" [class.good]="fb.good" [class.bad]="!fb.good">{{ fb.text }}</div>
        }
      }

      <div class="scene-actions">
        <span>inferir emociones sin evidencia está prohibido en el piloto — también acá</span>
        <span></span>
      </div>
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
  readonly feedback = signal<{ good: boolean; text: string } | null>(null);

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

  currentStatement() {
    return this.task().statements![this.statementIndex()];
  }

  stepLabel() {
    switch (this.task().kind) {
      case 'clasificar':
        return 'rigor observacional';
      case 'hipotesis':
        return 'hipótesis con alternativas';
      default:
        return 'política de decisión';
    }
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
      this.feedback.set({
        good: false,
        text: 'Cuidado: ¿está en la traza, o lo pusiste vos? Releé los eventos E1–E5.',
      });
      return;
    }

    const why = statement.why ? ` ${statement.why}` : '';
    this.feedback.set({ good: true, text: `Exacto.${why}` });
    this.locked = true;
    setTimeout(() => {
      this.feedback.set(null);
      this.attempt = 1;
      this.failedThis = false;
      if (this.statementIndex() < this.task().statements!.length - 1) {
        this.statementIndex.update((i) => i + 1);
        this.shownAt = Date.now();
        this.locked = false;
      } else {
        this.completeTask();
      }
    }, statement.why ? 2600 : 900);
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
      this.feedback.set({ good: false, text: option.why + ' Elegí otra.' });
      return;
    }

    this.chosen.set(optionId);
    this.feedback.set({ good: true, text: option.why });
    this.locked = true;
    setTimeout(() => this.completeTask(), 3200);
  }

  private completeTask() {
    this.feedback.set(null);
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
