import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { MISSION1_BUCKETS, MISSION1_CARDS, MISSION1_HINT, MISSION1_INSTRUCTIONS } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { MissionPrepComponent, type Prep } from './mission-prep.component';

const SCENE = 'observatorio';
const CONSIGNA = { id: `${SCENE}:consigna`, kind: 'consigna' };

type Phase = 'answering' | 'failed' | 'solved';

/**
 * Misión 01 · Observatorio. Seis tarjetas, cada una una oportunidad con
 * pista disponible. Tras un error la persona elige entre reintentar u
 * omitir; tras acertar, abrir o no el porqué. Ninguna elección es mejor:
 * todas quedan registradas con lo que estaba disponible.
 */
@Component({
  selector: 'synapxix-mission-categorize',
  standalone: true,
  imports: [MissionPrepComponent],
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">MISIÓN 01 / OBSERVATORIO</span>
        <div class="signalMeter">
          <header><span>SEÑALES</span><b>{{ session.emittedCount() }}</b></header>
          <div class="meter"><i [style.width.%]="(index() / cards.length) * 100"></i></div>
        </div>
      </aside>

      <div class="game">
        @if (!prep()) {
          <synapxix-mission-prep scene="observatorio" (observe)="observe.emit($event)" (begin)="start($event)" />
        } @else {
        <div class="gameHead">
          <div>
            <h2>¿Qué tipo de señal es?</h2>
          </div>
          <div class="gameTools">
            <button class="tool" (click)="openInstructions()">? Consigna</button>
            @if (withHint()) {
              <button class="tool" [disabled]="hinted() || phase() === 'solved' || finished()" (click)="hint()">✦ Pedir pista</button>
            }
          </div>
        </div>

        <div class="cardArena">
          @for (bucket of buckets; track bucket.id) {
            <div class="bucket">
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
            <small>TARJETA {{ pad(index() + 1) }} / {{ pad(cards.length) }}</small>
            <p>{{ card.text }}</p>
            @if (phase() !== 'solved') {
              <div class="promptActions">
                @for (bucket of buckets; track bucket.id) {
                  <button (click)="answer(bucket.id)">Es {{ bucket.label.toLowerCase() }}</button>
                }
              </div>
            }
          </div>

          @if (phase() === 'failed') {
            <div class="feedback bad">
              <b>Todavía no.</b>¿Ocurrió, lo dijo alguien o es una suposición?
              <div class="feedbackActions">
                <button class="btn ghost" (click)="skip()">Omitir esta tarjeta →</button>
              </div>
            </div>
          }
          @if (phase() === 'solved') {
            <div class="feedback">
              <b>Señal bien separada.</b>
              @if (whyOpen()) {
                <span class="whyText">{{ card.why }}</span>
              }
              <div class="feedbackActions">
                @if (!whyOpen()) {
                  <button class="btn ghost" (click)="openWhy()">¿Por qué?</button>
                }
                <button class="btn primary" (click)="next()">Siguiente →</button>
              </div>
            </div>
          }
        } @else {
          <div class="promptCard">
            <small>OBSERVATORIO COMPLETO</small>
            <p>{{ summary() }}</p>
          </div>
          <button class="btn primary" style="margin-top: 14px" (click)="done.emit()">VOLVER AL MAPA →</button>
        }
        }
      </div>
    </div>
  `,
})
export class MissionCategorizeComponent {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly buckets = MISSION1_BUCKETS;
  readonly cards = MISSION1_CARDS;
  readonly index = signal(0);
  readonly phase = signal<Phase>('answering');
  readonly hinted = signal(false);
  readonly whyOpen = signal(false);
  readonly finished = signal(false);
  readonly placed = signal<Record<string, string[]>>({ observed: [], reported: [], inferred: [] });

  private attempt = 0;
  private skipped = 0;

  readonly prep = signal<Prep | null>(null);

  withHint() {
    return this.prep()?.mode === 'con_pista';
  }

  start(prep: Prep) {
    this.prep.set(prep);
    this.observe.emit({ type: 'instruction_presented', opportunity: CONSIGNA });
    this.present();
  }

  current() {
    return this.finished() ? null : this.cards[this.index()];
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  summary() {
    const solved = this.cards.length - this.skipped;
    return `${solved} de ${this.cards.length} señales separadas.`;
  }

  private opp() {
    return { id: `${SCENE}:${this.cards[this.index()].id}`, kind: 'tarea' };
  }

  private present() {
    const opportunity = this.opp();
    this.attempt = 0;
    this.phase.set('answering');
    this.hinted.set(false);
    this.whyOpen.set(false);
    this.observe.emit({ type: 'task_presented', opportunity });
    this.observe.emit({ type: 'options_presented', opportunity, payload: { options: this.buckets.map((b) => b.id) } });
    if (this.withHint()) this.observe.emit({ type: 'support_available', opportunity, payload: { support: 'pista' } });
  }

  openInstructions() {
    this.observe.emit({ type: 'instructions_opened', opportunity: CONSIGNA });
    this.ui.openModal(MISSION1_INSTRUCTIONS);
  }

  hint() {
    if (!this.withHint() || this.hinted() || this.phase() === 'solved' || this.finished()) return;
    this.hinted.set(true);
    const opportunity = this.opp();
    this.observe.emit({ type: 'hint_requested', opportunity, payload: { level: 1 } });
    this.observe.emit({ type: 'support_delivered', opportunity, payload: { support: 'pista' } });
    this.ui.openModal(MISSION1_HINT);
  }

  answer(bucketId: string) {
    const card = this.current();
    if (!card || this.phase() === 'solved') return;
    const correct = card.kind === bucketId;
    this.attempt += 1;
    this.observe.emit({
      type: 'response_submitted',
      opportunity: this.opp(),
      payload: { correct, attempt: this.attempt, choice: bucketId },
    });
    if (!correct) {
      this.phase.set('failed');
      this.ui.tone(230);
      return;
    }
    this.ui.tone(720);
    this.observe.emit({ type: 'task_completed', opportunity: this.opp() });
    this.placed.update((prev) => ({ ...prev, [card.kind]: [...prev[card.kind], card.text] }));
    this.observe.emit({ type: 'exploration_offered', opportunity: this.whyOpp() });
    this.phase.set('solved');
  }

  skip() {
    if (this.phase() !== 'failed') return;
    this.observe.emit({ type: 'task_skipped', opportunity: this.opp() });
    this.skipped += 1;
    this.advance();
  }

  openWhy() {
    this.whyOpen.set(true);
    this.observe.emit({ type: 'exploration_opened', opportunity: this.whyOpp() });
  }

  next() {
    this.advance();
  }

  private whyOpp() {
    return { id: `${this.opp().id}:porque`, kind: 'exploracion' };
  }

  private advance() {
    if (this.index() < this.cards.length - 1) {
      this.index.update((i) => i + 1);
      this.present();
      return;
    }
    this.finished.set(true);
  }
}
