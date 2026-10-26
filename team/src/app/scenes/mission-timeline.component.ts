import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CYCLE_STEPS, FORMAT_INTROS, FORMAT_LABELS, MISSION2_HINT, MISSION2_INSTRUCTIONS, MISSION2_WHY, type FormatId } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { FormatChoiceComponent } from './format-choice.component';

const SCENE = 'ciclo';
const CONSIGNA = { id: `${SCENE}:consigna`, kind: 'consigna' };
const TASK = { id: `${SCENE}:secuencia`, kind: 'tarea' };
const WHY = { id: `${SCENE}:secuencia:porque`, kind: 'exploracion' };
/** Mezcla fija: comparable entre personas. */
const POOL = ['Intervención', 'Estado', 'Actualización', 'Evidencia', 'Outcome', 'Decisión'];

/**
 * Misión 02 · El ciclo. Construir la secuencia es acción, deshacer es
 * revisión, "cambiar enfoque" es un cambio de estrategia genuino, verificar
 * es la respuesta y omitir queda disponible tras un error.
 */
@Component({
  selector: 'synapxix-mission-timeline',
  standalone: true,
  imports: [FormatChoiceComponent],
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">MISIÓN 02 / CICLO</span>
        <div class="signalMeter">
          <header><span>SEÑALES</span><b>{{ session.emittedCount() }}</b></header>
          <div class="meter"><i [style.width.%]="(selected().length / steps.length) * 100"></i></div>
        </div>
      </aside>

      <div class="game">
        @if (!format()) {
          <synapxix-format-choice scene="ciclo" title="Cierra el ciclo." (observe)="observe.emit($event)" (chosen)="start($event)" />
        } @else {
          <div class="gameHead">
            <div>
              <p class="eyebrow"><b>ESCENA</b> · CICLO</p>
              <h2>Cierra el ciclo.</h2>
              <p class="formatIntro"><b>{{ formatLabel() }}</b>{{ intro() }}</p>
            </div>
            <div class="gameTools">
              <button class="tool" (click)="openInstructions()">? Consigna</button>
              <button class="tool" [disabled]="hintVisible() || closed()" (click)="hint()">✦ Pedir pista</button>
            </div>
          </div>

          <div class="timelinePool">
            @for (step of pool; track step) {
              <button class="token" [class.used]="selected().includes(step)" [disabled]="closed()" (click)="place(step)">
                {{ step }}
              </button>
            }
          </div>

          <div class="timeline">
            @if (selected().length === 0) {
              <span class="timelineEmpty">Toca las piezas para reconstruir el ciclo</span>
            }
            @for (step of selected(); track step) {
              <div class="stepChip">{{ step }}</div>
            }
          </div>

          @if (!closed()) {
            <div class="timelineControls">
              <div class="approach">
                <button class="btn secondary" [disabled]="selected().length === 0" (click)="undo()">↶ Deshacer</button>
                <button class="btn soft" (click)="shift()">⇄ Cambiar enfoque</button>
              </div>
              <button class="btn primary" [disabled]="selected().length !== steps.length" (click)="verify()">
                VERIFICAR CICLO
              </button>
            </div>
          }

          @if (hintVisible()) {
            <div class="hintBox">{{ hintText }}</div>
          }
          @if (failed() && !closed()) {
            <div class="feedback bad">
              <b>El ciclo todavía queda abierto.</b>Revisa qué debe existir antes de intervenir y qué debe observarse antes de actualizar.
              <div class="feedbackActions">
                <button class="btn ghost" (click)="skip()">Omitir y seguir →</button>
              </div>
            </div>
          }
          @if (outcome() === 'solved') {
            <div class="feedback">
              <b>Ciclo cerrado.</b>
              @if (whyOpen()) {
                <span class="whyText">{{ whyText }}</span>
              }
              <div class="feedbackActions">
                @if (!whyOpen()) {
                  <button class="btn ghost" (click)="openWhy()">¿Por qué?</button>
                }
                <button class="btn primary" (click)="done.emit()">CRUZAR A LA CÁMARA DE ECO →</button>
              </div>
            </div>
          }
          @if (outcome() === 'skipped') {
            <div class="feedback">
              <b>Seguimos.</b>Omitir también es una decisión válida y queda registrada como tal.
              <div class="feedbackActions">
                <button class="btn primary" (click)="done.emit()">CRUZAR A LA CÁMARA DE ECO →</button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class MissionTimelineComponent {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly steps = CYCLE_STEPS;
  readonly pool = POOL;
  readonly hintText = MISSION2_HINT;
  readonly whyText = MISSION2_WHY;
  readonly format = signal<FormatId | null>(null);
  readonly selected = signal<string[]>([]);
  readonly hintVisible = signal(false);
  readonly failed = signal(false);
  readonly whyOpen = signal(false);
  readonly outcome = signal<'solved' | 'skipped' | null>(null);

  private attempt = 0;
  private direction: 'adelante' | 'atras' = 'adelante';

  closed() {
    return this.outcome() !== null;
  }

  formatLabel() {
    const f = this.format();
    return f ? FORMAT_LABELS[f].label : '';
  }

  intro() {
    const f = this.format();
    return f ? FORMAT_INTROS.ciclo[f] : '';
  }

  start(format: FormatId) {
    this.format.set(format);
    this.observe.emit({ type: 'instruction_presented', opportunity: CONSIGNA });
    this.observe.emit({ type: 'task_presented', opportunity: TASK });
    this.observe.emit({ type: 'options_presented', opportunity: TASK, payload: { options: POOL } });
    this.observe.emit({ type: 'support_available', opportunity: TASK, payload: { support: 'pista' } });
  }

  openInstructions() {
    this.observe.emit({ type: 'instructions_opened', opportunity: CONSIGNA });
    this.ui.openModal(MISSION2_INSTRUCTIONS);
  }

  hint() {
    if (this.hintVisible() || this.closed()) return;
    this.observe.emit({ type: 'hint_requested', opportunity: TASK, payload: { level: 1 } });
    this.observe.emit({ type: 'support_delivered', opportunity: TASK, payload: { support: 'pista' } });
    this.hintVisible.set(true);
  }

  place(step: string) {
    if (this.closed() || this.selected().includes(step)) return;
    this.selected.update((prev) => [...prev, step]);
    this.observe.emit({
      type: 'action_performed',
      opportunity: TASK,
      payload: { action: 'place', item: step, position: this.selected().length },
    });
    this.ui.tone(600);
  }

  undo() {
    const current = this.selected();
    const last = current[current.length - 1];
    if (this.closed() || !last) return;
    this.selected.update((prev) => prev.slice(0, -1));
    this.observe.emit({ type: 'answer_revised', opportunity: TASK, payload: { action: 'undo', item: last } });
  }

  shift() {
    if (this.closed()) return;
    const from = this.direction;
    this.direction = from === 'adelante' ? 'atras' : 'adelante';
    this.observe.emit({ type: 'strategy_changed', opportunity: TASK, payload: { from, to: this.direction } });
    this.selected.set([]);
    this.ui.toast(
      this.direction === 'atras'
        ? 'Nuevo enfoque: reconstruye desde el efecto hacia atrás.'
        : 'Nuevo enfoque: reconstruye desde lo observado hacia adelante.',
    );
    this.ui.tone(760);
  }

  verify() {
    this.attempt += 1;
    const correct = JSON.stringify(this.selected()) === JSON.stringify(this.steps);
    this.observe.emit({
      type: 'response_submitted',
      opportunity: TASK,
      payload: { correct, attempt: this.attempt, order: this.selected() },
    });
    if (!correct) {
      this.failed.set(true);
      this.ui.tone(230);
      return;
    }
    this.ui.tone(760);
    this.observe.emit({ type: 'task_completed', opportunity: TASK });
    this.observe.emit({ type: 'exploration_offered', opportunity: WHY });
    this.outcome.set('solved');
  }

  skip() {
    if (!this.failed() || this.closed()) return;
    this.observe.emit({ type: 'task_skipped', opportunity: TASK });
    this.outcome.set('skipped');
  }

  openWhy() {
    this.whyOpen.set(true);
    this.observe.emit({ type: 'exploration_opened', opportunity: WHY });
  }
}
