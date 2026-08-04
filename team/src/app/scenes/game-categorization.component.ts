import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { BUCKETS, CATEGORIZATION_TASKS, type Bucket } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Reto 1 — Instrumento `categorization` (primera validación D.A.L.A.).
 * Cada colocación emite `answer_submitted`; el reintento tras error emite
 * `attempt_repeated`; la pista emite `hint_requested` — y la regla de
 * evidencia ya sabe que un acierto con pista no cuenta como dominio.
 */
@Component({
  selector: 'synapxix-game-categorization',
  standalone: true,
  template: `
    <section class="scene-panel">
      <span class="eyebrow">RETO 1 · LA CONSTELACIÓN DE IDEAS</span>
      <h2>¿Misión, visión<br /><em>o principio D.A.L.A.?</em></h2>
      <p class="scene-lead">
        Cada frase pertenece a un lugar. Colocala donde corresponde. Si dudás, hay una pista —
        usarla también es información valiosa (y jamás en tu contra).
      </p>

      <div class="game-toolbar">
        <span class="task-count">Tanda {{ taskIndex() + 1 }} de {{ tasks.length }} · frase {{ statementIndex() + 1 }} de 3</span>
        <button class="chip-btn" [disabled]="hinted()" (click)="hint()">💡 Pista</button>
      </div>

      <div class="statement-card">“{{ current().text }}”</div>

      @if (feedback(); as fb) {
        <div class="feedback-banner" [class.good]="fb.good" [class.bad]="!fb.good">{{ fb.text }}</div>
      }

      <div class="bucket-row">
        @for (bucket of buckets; track bucket.id) {
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
    </section>
  `,
})
export class GameCategorizationComponent implements OnInit {
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<void>();

  readonly tasks = CATEGORIZATION_TASKS;
  readonly buckets = BUCKETS;
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

  current() {
    return this.tasks[this.taskIndex()].statements[this.statementIndex()];
  }

  private task() {
    return this.tasks[this.taskIndex()];
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

  place(bucket: Bucket) {
    if (this.locked) return;
    const statement = this.current();
    const correct = statement.bucket === bucket;

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
      this.feedback.set({ good: false, text: 'Ahí no vive esa idea. Releela y probá de nuevo — insistir con ajuste suma.' });
      return;
    }

    this.feedback.set({ good: true, text: this.hinted() ? 'Correcto (con pista: cuenta distinto, y está bien).' : '¡Justo ahí!' });
    this.advance();
  }

  private advance() {
    this.attempt = 1;
    this.failedThis = false;
    this.hinted.set(false);
    this.locked = true;
    setTimeout(() => {
      this.feedback.set(null);
      if (this.statementIndex() < 2) {
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
    }, 700);
  }
}
