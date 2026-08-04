import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CATEGORIZATION_TASKS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Reto 1 — Instrumento `categorization`: "El mapa del sistema".
 * Dos niveles doctrinales: naturalezas de Synapxix y misión vs. excesos
 * eliminados. Cada colocación emite `answer_submitted`; el reintento tras
 * error, `attempt_repeated`; la pista, `hint_requested`.
 */
@Component({
  selector: 'synapxix-game-categorization',
  standalone: true,
  template: `
    <div class="scene-panel">
      <div class="scene-heading">
        <span class="eyebrow">RETO 1 · EL MAPA DEL SISTEMA</span>
        <h2>{{ task().title.split(',')[0] }},<br /><em>{{ task().title.split(',')[1] || 'un sistema' }}.</em></h2>
        <p>{{ task().intro }}</p>
      </div>

      <div class="game-toolbar">
        <span class="task-count">Tanda {{ taskIndex() + 1 }} / {{ tasks.length }} · pieza {{ statementIndex() + 1 }} / {{ task().statements.length }}</span>
        <button class="chip-btn" [disabled]="hinted()" (click)="hint()">💡 Pedir una pista</button>
      </div>

      <div class="statement-card">“{{ current().text }}”</div>

      @if (feedback(); as fb) {
        <div class="feedback-banner" [class.good]="fb.good" [class.bad]="!fb.good">{{ fb.text }}</div>
      }

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

      <div class="scene-actions">
        <span>usar la pista también es información — y jamás en tu contra</span>
        <span></span>
      </div>
    </div>
  `,
})
export class GameCategorizationComponent implements OnInit {
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<void>();

  readonly tasks = CATEGORIZATION_TASKS;
  readonly taskIndex = signal(0);
  readonly statementIndex = signal(0);
  readonly hinted = signal(false);
  readonly feedback = signal<{ good: boolean; text: string } | null>(null);

  private attempt = 1;
  private failedThis = false;
  private shownAt = Date.now();
  /** Bloquea interacciones durante la transición: evita dobles avances. */
  private locked = false;
  private adapter: ReturnType<PulseSessionService['startInstrument']> | null = null;

  ngOnInit() {
    this.adapter = this.session.startInstrument('categorization');
    this.presentTask();
  }

  task() {
    return this.tasks[this.taskIndex()];
  }

  current() {
    return this.task().statements[this.statementIndex()];
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
      // Volver a intentar tras un error: eso ES persistencia observable.
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
        text: 'Ahí no vive esa idea. Pensá en la función, no en cómo suena — y probá de nuevo.',
      });
      return;
    }

    const why = statement.why ? ` ${statement.why}` : '';
    this.feedback.set({
      good: true,
      text: (this.hinted() ? 'Correcto — con pista, que cuenta distinto y está bien.' : '¡Justo ahí!') + why,
    });
    this.advance();
  }

  private advance() {
    this.attempt = 1;
    this.failedThis = false;
    this.hinted.set(false);
    this.locked = true;
    const delay = this.current().why ? 2200 : 800;
    setTimeout(() => {
      this.feedback.set(null);
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
      // El reto terminó: queda bloqueado y el cierre es de ESTA sesión.
      void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
    }, delay);
  }
}
