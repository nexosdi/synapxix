import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { MISSION1_BUCKETS, MISSION1_HINT, MISSION1_INSTRUCTIONS, MISSION1_TASKS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

/**
 * Misión 01 / Observatorio — instrumento `categorization`.
 * Separar señal de historia: observado / declarado / inferido. Cada tarjeta
 * bien colocada se archiva visualmente en su categoría; equivocarse no
 * resta y queda registrado como reintento (eso también es señal).
 */
@Component({
  selector: 'synapxix-mission-categorize',
  standalone: true,
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">MISIÓN 01 / OBSERVATORIO</span>
        <h3>Separa señal de historia.</h3>
        <p>Una experiencia nunca envía "es impulsivo" o "se frustró". Envía hechos con contexto.</p>
        <div class="signalMeter">
          <header><span>SEÑALES CAPTURADAS</span><b>{{ session.emittedCount() }}</b></header>
          <div class="meter"><i [style.width.%]="meterPct()"></i></div>
        </div>
        <div class="capture">
          <b>D.A.L.A. observa:</b><br />
          latencia, acierto, revisión, reintento, ayuda y tarea. No inferirá personalidad.
        </div>
      </aside>

      <div class="game">
        <div class="gameHead">
          <div>
            <p class="eyebrow"><b>INSTRUMENTO</b> · CATEGORIZATION</p>
            <h2>¿Qué tipo de señal es?</h2>
            <p>Clasifica cada tarjeta. Equivocarte no resta nada.</p>
          </div>
          <div class="gameTools">
            <button class="tool" (click)="openInstructions()">? Consigna</button>
            <button class="tool" (click)="hint()">✦ Pedir pista</button>
          </div>
        </div>

        <div class="cardArena">
          @for (bucket of buckets; track bucket.id) {
            <div class="bucket" [class.pulseHint]="hinted() && bucket.id === current()?.kind">
              <div class="bucketHead">
                <i>{{ bucket.icon }}</i>
                <div>
                  <strong>{{ bucket.label }}</strong>
                  <small>{{ bucket.hint }}</small>
                </div>
              </div>
              <div class="slot">
                @for (card of placed()[bucket.id]; track card) {
                  <div class="placedCard">{{ card }}</div>
                }
              </div>
            </div>
          }
        </div>

        @if (current(); as card) {
          <div class="promptCard">
            <small>TARJETA {{ pad(cardNumber()) }} / 06</small>
            <p>{{ card.text }}</p>
            <div class="promptActions">
              @for (bucket of buckets; track bucket.id) {
                <button (click)="answer(bucket.id)">Es {{ bucket.label.toLowerCase() }}</button>
              }
            </div>
          </div>
        } @else {
          <div class="promptCard">
            <small>OBSERVATORIO COMPLETO</small>
            <p>Nodo de evidencia activado.</p>
          </div>
        }

        @if (feedback(); as fb) {
          <div class="feedback" [class.bad]="!fb.good"><b>{{ fb.title }}</b>{{ fb.text }}</div>
        }

        @if (finished()) {
          <button class="btn primary" style="margin-top: 14px" (click)="continue_()">
            ACTIVAR SIGUIENTE NODO →
          </button>
        }
      </div>
    </div>
  `,
})
export class MissionCategorizeComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly buckets = MISSION1_BUCKETS;
  readonly tasks = MISSION1_TASKS;
  readonly taskIndex = signal(0);
  readonly cardIndex = signal(0);
  readonly hinted = signal(false);
  readonly finished = signal(false);
  readonly feedback = signal<{ good: boolean; title: string; text: string } | null>(null);
  readonly placed = signal<Record<string, string[]>>({ observed: [], reported: [], inferred: [] });
  readonly meterPct = computed(() => Math.min(100, (this.session.emittedCount() / 34) * 100));

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

  current() {
    return this.finished() ? null : this.task().cards[this.cardIndex()];
  }

  cardNumber() {
    return this.taskIndex() * 3 + this.cardIndex() + 1;
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  private presentTask() {
    const task = this.task();
    this.session.interact(
      { kind: 'task_shown', taskId: task.taskId, skillIds: [task.skillId], difficulty: 0.42 },
    );
    this.shownAt = Date.now();
  }

  openInstructions() {
    this.session.interact({ kind: 'instructions_opened', taskId: this.task().taskId });
    this.ui.openModal(MISSION1_INSTRUCTIONS);
  }

  hint() {
    if (this.locked || this.finished() || this.hinted()) return;
    this.hinted.set(true);
    this.session.interact({ kind: 'hint', taskId: this.task().taskId, level: 1 });
    this.ui.openModal(MISSION1_HINT);
  }

  answer(bucketId: string) {
    if (this.locked || this.finished()) return;
    const card = this.current();
    if (!card) return;
    const correct = card.kind === bucketId;

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
      this.session.tone(230);
      this.feedback.set({
        good: false,
        title: 'Todavía no.',
        text: 'Pregunta: ¿esto ocurrió, fue declarado o es una interpretación? Puedes reintentar sin penalización.',
      });
      return;
    }

    this.session.tone(720);
    this.feedback.set({ good: true, title: 'Señal bien separada.', text: card.onCorrect });
    this.placed.update((prev) => ({ ...prev, [card.kind]: [...prev[card.kind], card.text] }));
    this.locked = true;
    setTimeout(() => {
      this.attempt = 1;
      this.failedThis = false;
      this.hinted.set(false);
      this.feedback.set(null);
      if (this.cardIndex() < this.task().cards.length - 1) {
        this.cardIndex.update((i) => i + 1);
        this.shownAt = Date.now();
        this.locked = false;
        return;
      }
      this.session.interact({ kind: 'complete', taskId: this.task().taskId });
      if (this.taskIndex() < this.tasks.length - 1) {
        this.taskIndex.update((i) => i + 1);
        this.cardIndex.set(0);
        this.presentTask();
        this.locked = false;
        return;
      }
      this.finished.set(true);
      this.locked = false;
    }, 1400);
  }

  continue_() {
    void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
  }
}
