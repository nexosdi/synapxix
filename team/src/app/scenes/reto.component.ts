import { Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { DESAFIOS, PRIORIZAR, RONDAS, type DesafioId } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import type { Mode } from './desafio.component';
import { EstrellaComponent } from './estrella.component';

type Phase = 'answering' | 'failed' | 'solved' | 'skipped';

/**
 * El desafío elegido. «Priorizar» es ordenar: tocar es acción, deshacer es
 * revisión, empezar desde el final es un cambio de estrategia. «Informe» y
 * «mensaje» son rondas de elegir una opción entre cuatro: cambiar antes de
 * confirmar es revisión y descartar una es la pista. En todos, omitir queda
 * disponible tras un error y el porqué es opcional. Cada tarea resuelta
 * enciende un destello en la estrella.
 */
@Component({
  selector: 'synapxix-reto',
  standalone: true,
  imports: [EstrellaComponent],
  template: `
    <div class="beat split starBuild reto">
      <div class="splitCopy">
        <p class="eyebrow">
          <b>MIÉRCOLES</b> · {{ meta().name.toUpperCase() }}
          @if (!ordering) {
            · {{ roundIndex() + 1 }} DE {{ rounds.length }}
          }
        </p>
        @if (!finished()) {
          <div class="gameHead">
            <h2 class="quizAsk">{{ ordering ? priorizar.ask : config.ask }}</h2>
            <div class="gameTools">
              <button class="tool" (click)="openInstructions()">? Consigna</button>
              @if (withHint) {
                <button class="tool" [disabled]="hinted() || closed()" (click)="hint()">
                  ✦ {{ ordering ? 'Pedir pista' : config.hint }}
                </button>
              }
            </div>
          </div>

          @if (ordering) {
            <div class="timelinePool">
              @for (step of priorizar.pool; track step) {
                <button class="token" [class.used]="order().includes(step)" [disabled]="closed()" (click)="place(step)">{{ step }}</button>
              }
            </div>
            <ol class="orderList">
              @if (order().length === 0) {
                <li class="empty">{{ fromEnd ? 'Empezá por lo último que harías' : 'Tocá las tareas en orden' }}</li>
              }
              @for (step of order(); track step; let i = $index) {
                <li><b>{{ fromEnd ? priorizar.steps.length - i : i + 1 }}</b>{{ step }}</li>
              }
            </ol>
            @if (!closed()) {
              <div class="timelineControls">
                <div class="approach">
                  <button class="btn secondary" [disabled]="order().length === 0" (click)="undo()">↶ Deshacer</button>
                  <button class="btn soft" (click)="shift()">⇄ {{ fromEnd ? 'Empezar por el principio' : 'Empezar por el final' }}</button>
                </div>
                <button class="btn primary" [disabled]="order().length !== priorizar.steps.length" (click)="verifyOrder()">CONFIRMAR ORDEN</button>
              </div>
            }
            @if (hinted()) {
              <div class="hintBox">{{ priorizar.hint }}</div>
            }
          } @else {
            <p class="roundContext">{{ round().context }}</p>
            <div class="roundOptions" [class.codeOptions]="desafio === 'codigo'">
              @for (o of round().options; track o.text; let i = $index) {
                <button
                  class="claim"
                  [class.selected]="selected() === i"
                  [class.discarded]="discarded() === i"
                  [disabled]="closed() || discarded() === i"
                  (click)="select(i)"
                >
                  <p>{{ o.text }}</p>
                </button>
              }
            </div>
            @if (!closed()) {
              <div class="timelineControls">
                <span></span>
                <button class="btn primary" [disabled]="selected() === null" (click)="verifyRound()">{{ config.verify }}</button>
              </div>
            }
          }

          @if (phase() === 'failed') {
            <div class="feedback bad">
              <b>Todavía no.</b>{{ ordering ? '¿Qué conviene saber antes de construir?' : config.wrong }}
              <div class="feedbackActions">
                <button class="btn ghost" (click)="skip()">Omitir y seguir →</button>
              </div>
            </div>
          }
          @if (phase() === 'solved') {
            <div class="feedback">
              <b>{{ ordering ? 'Semana ordenada.' : config.right }}</b>
              @if (whyOpen()) {
                <span class="whyText">{{ ordering ? priorizar.why : round().why }}</span>
              }
              <div class="feedbackActions">
                @if (!whyOpen()) {
                  <button class="btn ghost" (click)="openWhy()">¿Por qué?</button>
                }
                <button class="btn primary" (click)="advance()">SEGUIR →</button>
              </div>
            </div>
          }
          @if (phase() === 'skipped') {
            <div class="feedback">
              <b>Seguimos.</b>
              <div class="feedbackActions"><button class="btn primary" (click)="advance()">SEGUIR →</button></div>
            </div>
          }
        } @else {
          <h2 class="quizAsk">Desafío terminado.</h2>
          <p class="beatNote">Lo que hiciste queda registrado tal cual: qué tocaste, si cambiaste, si pediste la pista. Sin puntajes.</p>
          <button class="btn primary" (click)="done.emit()">TERMINAR EL MIÉRCOLES →</button>
        }
      </div>
      <synapxix-estrella [state]="session.estrella()" />
    </div>
  `,
})
export class RetoComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Input({ required: true }) desafio!: DesafioId;
  @Input({ required: true }) mode!: Mode;
  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly priorizar = PRIORIZAR;
  config = RONDAS.informe;
  rounds = RONDAS.informe.rounds;
  ordering = false;
  withHint = true;
  fromEnd = false;

  readonly meta = computed(() => DESAFIOS.find((d) => d.id === this.desafioId())!);
  private readonly desafioId = signal<DesafioId>('priorizar');
  readonly roundIndex = signal(0);
  readonly order = signal<string[]>([]);
  readonly selected = signal<number | null>(null);
  readonly discarded = signal<number | null>(null);
  readonly hinted = signal(false);
  readonly whyOpen = signal(false);
  readonly phase = signal<Phase>('answering');
  readonly finished = signal(false);

  private attempt = 0;
  private scene = '';

  ngOnInit() {
    this.desafioId.set(this.desafio);
    this.scene = this.meta().scene;
    this.ordering = this.desafio === 'priorizar';
    if (this.desafio !== 'priorizar') {
      this.config = RONDAS[this.desafio];
      this.rounds = this.config.rounds;
    }
    this.withHint = this.mode === 'con_pista';
    this.observe.emit({ type: 'instruction_presented', opportunity: this.consigna() });
    this.present();
  }

  round() {
    return this.rounds[this.roundIndex()];
  }

  closed() {
    return this.phase() === 'solved' || this.phase() === 'skipped';
  }

  openInstructions() {
    this.observe.emit({ type: 'instructions_opened', opportunity: this.consigna() });
    this.ui.openModal(this.ordering ? PRIORIZAR.instructions : this.config.instructions);
  }

  hint() {
    if (!this.withHint || this.hinted() || this.closed()) return;
    this.hinted.set(true);
    const opportunity = this.task();
    this.observe.emit({ type: 'hint_requested', opportunity, payload: { level: 1 } });
    if (this.ordering) {
      this.observe.emit({ type: 'support_delivered', opportunity, payload: { support: 'pista' } });
      return;
    }
    // Descarta una opción que no es la buscada y que no está seleccionada.
    const pick = this.round().options.findIndex((o, i) => !o.ok && i !== this.selected());
    this.discarded.set(pick);
    this.observe.emit({ type: 'support_delivered', opportunity, payload: { support: 'descartar', item: pick + 1 } });
    this.ui.toast('Una opción quedó descartada.');
  }

  // ── Priorizar ─────────────────────────────────────────────────────────

  place(step: string) {
    if (this.closed() || this.order().includes(step)) return;
    this.order.update((prev) => [...prev, step]);
    this.observe.emit({ type: 'action_performed', opportunity: this.task(), payload: { action: 'place', item: step, position: this.order().length } });
    this.ui.tone(600);
  }

  undo() {
    const last = this.order()[this.order().length - 1];
    if (this.closed() || !last) return;
    this.order.update((prev) => prev.slice(0, -1));
    this.observe.emit({ type: 'answer_revised', opportunity: this.task(), payload: { action: 'undo', item: last } });
  }

  shift() {
    if (this.closed()) return;
    const from = this.fromEnd ? 'desde_el_principio' : 'desde_el_final';
    this.fromEnd = !this.fromEnd;
    this.observe.emit({
      type: 'strategy_changed',
      opportunity: this.task(),
      payload: { from, to: this.fromEnd ? 'desde_el_final' : 'desde_el_principio' },
    });
    this.order.set([]);
    this.ui.tone(760);
  }

  verifyOrder() {
    const placed = this.fromEnd ? [...this.order()].reverse() : this.order();
    this.submit(JSON.stringify(placed) === JSON.stringify(PRIORIZAR.steps), { order: placed });
  }

  // ── Informe y mensaje ─────────────────────────────────────────────────

  select(index: number) {
    if (this.closed() || this.discarded() === index || this.selected() === index) return;
    const previous = this.selected();
    this.selected.set(index);
    this.observe.emit({
      type: previous === null ? 'action_performed' : 'answer_revised',
      opportunity: this.task(),
      payload: { action: 'select', item: index + 1, ...(previous === null ? {} : { previous: previous + 1 }) },
    });
  }

  verifyRound() {
    const index = this.selected();
    if (index === null || this.closed()) return;
    this.submit(this.round().options[index].ok, { choice: index + 1 });
  }

  // ── Común ─────────────────────────────────────────────────────────────

  skip() {
    if (this.phase() !== 'failed') return;
    this.observe.emit({ type: 'task_skipped', opportunity: this.task() });
    this.phase.set('skipped');
  }

  openWhy() {
    this.whyOpen.set(true);
    this.observe.emit({ type: 'exploration_opened', opportunity: this.why() });
    this.session.estrella.update((e) => ({ ...e, logros: e.logros + 1 }));
  }

  advance() {
    if (!this.ordering && this.roundIndex() < this.rounds.length - 1) {
      this.roundIndex.update((i) => i + 1);
      this.present();
      return;
    }
    this.finished.set(true);
  }

  private submit(correct: boolean, detail: Record<string, unknown>) {
    this.attempt += 1;
    this.observe.emit({ type: 'response_submitted', opportunity: this.task(), payload: { correct, attempt: this.attempt, ...detail } });
    if (!correct) {
      this.phase.set('failed');
      this.ui.tone(230);
      return;
    }
    this.ui.tone(760);
    this.observe.emit({ type: 'task_completed', opportunity: this.task() });
    this.observe.emit({ type: 'exploration_offered', opportunity: this.why() });
    this.session.estrella.update((e) => ({ ...e, logros: e.logros + 1 }));
    this.phase.set('solved');
  }

  private present() {
    const opportunity = this.task();
    this.selected.set(null);
    this.discarded.set(null);
    this.hinted.set(false);
    this.whyOpen.set(false);
    this.phase.set('answering');
    this.attempt = 0;
    const options = this.ordering ? PRIORIZAR.pool : this.round().options.map((_, i) => i + 1);
    this.observe.emit({ type: 'task_presented', opportunity });
    this.observe.emit({ type: 'options_presented', opportunity, payload: { options } });
    if (this.withHint) {
      this.observe.emit({ type: 'support_available', opportunity, payload: { support: this.ordering ? 'pista' : 'descartar' } });
    }
  }

  private consigna() {
    return { id: `${this.scene}:consigna`, kind: 'consigna' };
  }

  private task() {
    return { id: `${this.scene}:${this.ordering ? 'orden' : this.round().id}`, kind: 'tarea' };
  }

  private why() {
    return { id: `${this.task().id}:porque`, kind: 'exploracion' };
  }
}
