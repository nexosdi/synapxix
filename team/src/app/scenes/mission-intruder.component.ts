import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FORMAT_INTROS, FORMAT_LABELS, MISSION3_INSTRUCTIONS, MISSION3_ROUNDS, type FormatId } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { MissionPrepComponent, type Prep } from './mission-prep.component';

const SCENE = 'camara';
const CONSIGNA = { id: `${SCENE}:consigna`, kind: 'consigna' };

type Phase = 'answering' | 'failed' | 'solved';

/**
 * Misión 03 · Cámara de eco. Dos rondas: entre afirmaciones que respetan la
 * evidencia, una dice más de lo que puede sostener. Cambiar la selección
 * antes de verificar es una revisión; descartar una opción es apoyo.
 */
@Component({
  selector: 'synapxix-mission-intruder',
  standalone: true,
  imports: [MissionPrepComponent],
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">MISIÓN 03 / CÁMARA DE ECO</span>
        <div class="signalMeter">
          <header><span>SEÑALES</span><b>{{ session.emittedCount() }}</b></header>
          <div class="meter"><i [style.width.%]="(roundIndex() / rounds.length) * 100"></i></div>
        </div>
      </aside>

      <div class="game">
        @if (!format()) {
          <synapxix-mission-prep scene="camara" (observe)="observe.emit($event)" (begin)="start($event)" />
        } @else if (!finished()) {
          <div class="gameHead">
            <div>
              <h2>Encuentra la frase que dice demasiado.</h2>
              <p class="formatIntro"><b>{{ formatLabel() }}</b>{{ intro() }}</p>
            </div>
            <div class="gameTools">
              <button class="tool" (click)="openInstructions()">? Consigna</button>
              @if (withHint) {
                <button class="tool" [disabled]="hinted() || phase() === 'solved'" (click)="hint()">✦ Descartar una</button>
              }
            </div>
          </div>

          <div class="intruderGrid">
            @for (claim of round().claims; track claim.text; let i = $index) {
              <button
                class="claim"
                [class.selected]="selected() === i"
                [class.discarded]="discarded() === i"
                [disabled]="phase() === 'solved' || discarded() === i"
                (click)="select(i)"
              >
                <small>AFIRMACIÓN {{ pad(i + 1) }}</small>
                <p>“{{ claim.text }}”</p>
              </button>
            }
          </div>

          <div class="timelineControls">
            <span class="eyebrow" style="margin: 0"><b>RONDA {{ pad(roundIndex() + 1) }}</b> / {{ pad(rounds.length) }}</span>
            @if (phase() !== 'solved') {
              <button class="btn primary" [disabled]="selected() === null" (click)="verify()">VERIFICAR ELECCIÓN</button>
            }
          </div>

          @if (phase() === 'failed') {
            <div class="feedback bad">
              <b>Esa frase cuida el alcance.</b>Busca la que convierte un momento en identidad.
              <div class="feedbackActions">
                <button class="btn ghost" (click)="skip()">Omitir esta ronda →</button>
              </div>
            </div>
          }
          @if (phase() === 'solved') {
            <div class="feedback">
              <b>Sobreinferencia detectada.</b>
              @if (whyOpen()) {
                <span class="whyText">{{ round().why }}</span>
              }
              <div class="feedbackActions">
                @if (!whyOpen()) {
                  <button class="btn ghost" (click)="openWhy()">¿Por qué?</button>
                }
                <button class="btn primary" (click)="advance()">Siguiente →</button>
              </div>
            </div>
          }
        } @else {
          <div class="promptCard">
            <small>CÁMARA COMPLETA</small>
            <p>Detectaste frases que dicen demasiado.</p>
          </div>
          <button class="btn primary" style="margin-top: 14px" (click)="done.emit()">VOLVER AL MAPA →</button>
        }
      </div>
    </div>
  `,
})
export class MissionIntruderComponent {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly rounds = MISSION3_ROUNDS;
  readonly format = signal<FormatId | null>(null);
  readonly roundIndex = signal(0);
  readonly selected = signal<number | null>(null);
  readonly discarded = signal<number | null>(null);
  readonly hinted = signal(false);
  readonly whyOpen = signal(false);
  readonly phase = signal<Phase>('answering');
  readonly finished = signal(false);

  private attempt = 0;

  round() {
    return this.rounds[this.roundIndex()];
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  formatLabel() {
    const f = this.format();
    return f ? FORMAT_LABELS[f].label : '';
  }

  intro() {
    const f = this.format();
    return f ? FORMAT_INTROS.camara[f] : '';
  }

  withHint = true;

  start(prep: Prep) {
    this.withHint = prep.mode === 'con_pista';
    this.format.set(prep.format);
    this.observe.emit({ type: 'instruction_presented', opportunity: CONSIGNA });
    this.present();
  }

  private opp() {
    return { id: `${SCENE}:${this.round().id}`, kind: 'tarea' };
  }

  private present() {
    const opportunity = this.opp();
    this.selected.set(null);
    this.discarded.set(null);
    this.hinted.set(false);
    this.whyOpen.set(false);
    this.phase.set('answering');
    this.attempt = 0;
    this.observe.emit({ type: 'task_presented', opportunity });
    this.observe.emit({
      type: 'options_presented',
      opportunity,
      payload: { options: this.round().claims.map((_, i) => i + 1) },
    });
    if (this.withHint) this.observe.emit({ type: 'support_available', opportunity, payload: { support: 'descartar' } });
  }

  select(index: number) {
    if (this.phase() === 'solved' || this.discarded() === index || this.selected() === index) return;
    const previous = this.selected();
    this.selected.set(index);
    this.observe.emit({
      type: previous === null ? 'action_performed' : 'answer_revised',
      opportunity: this.opp(),
      payload: { action: 'select', item: index + 1, ...(previous === null ? {} : { previous: previous + 1 }) },
    });
  }

  openInstructions() {
    this.observe.emit({ type: 'instructions_opened', opportunity: CONSIGNA });
    this.ui.openModal(MISSION3_INSTRUCTIONS);
  }

  hint() {
    if (!this.withHint || this.hinted() || this.phase() === 'solved') return;
    this.hinted.set(true);
    const opportunity = this.opp();
    this.observe.emit({ type: 'hint_requested', opportunity, payload: { level: 1 } });
    // Descarta una afirmación responsable que no esté seleccionada, si la hay.
    const claims = this.round().claims;
    const pick = claims.findIndex((c, i) => !c.bad && i !== this.selected());
    this.discarded.set(pick);
    if (this.selected() === pick) this.selected.set(null);
    this.observe.emit({ type: 'support_delivered', opportunity, payload: { support: 'descartar', item: pick + 1 } });
    this.ui.toast('Una afirmación responsable quedó descartada.');
  }

  verify() {
    const index = this.selected();
    if (index === null || this.phase() === 'solved') return;
    this.attempt += 1;
    const correct = this.round().claims[index].bad;
    this.observe.emit({
      type: 'response_submitted',
      opportunity: this.opp(),
      payload: { correct, attempt: this.attempt, choice: index + 1 },
    });
    if (!correct) {
      this.phase.set('failed');
      this.ui.tone(230);
      return;
    }
    this.ui.tone(760);
    this.observe.emit({ type: 'task_completed', opportunity: this.opp() });
    this.observe.emit({ type: 'exploration_offered', opportunity: this.whyOpp() });
    this.phase.set('solved');
  }

  skip() {
    if (this.phase() !== 'failed') return;
    this.observe.emit({ type: 'task_skipped', opportunity: this.opp() });
    this.advance();
  }

  openWhy() {
    this.whyOpen.set(true);
    this.observe.emit({ type: 'exploration_opened', opportunity: this.whyOpp() });
  }

  advance() {
    if (this.roundIndex() < this.rounds.length - 1) {
      this.roundIndex.update((i) => i + 1);
      this.present();
      return;
    }
    this.finished.set(true);
  }

  private whyOpp() {
    return { id: `${this.opp().id}:porque`, kind: 'exploracion' };
  }
}
