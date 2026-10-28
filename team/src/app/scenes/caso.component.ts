import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CASO_ANA } from '../content';
import type { SceneObservation } from '../scene-observation';
import { UiService } from '../services/ui.service';

const TASK = { id: 'caso:ana', kind: 'tarea' };
const WHY = { id: 'caso:ana:porque', kind: 'exploracion' };

type Phase = 'answering' | 'failed' | 'solved' | 'skipped';

/**
 * Escena 07 · Un caso, distintas lecturas. Tres frases sobre Ana: una se
 * sostiene con los datos, dos dicen más de lo que se sabe. Se puede cambiar
 * de elección antes de comprobar (revisión), pedir la pista y, tras un
 * error, reintentar u omitir. A Ana no se le atribuye nada.
 */
@Component({
  selector: 'synapxix-caso',
  standalone: true,
  template: `
    <div class="micro">
      <p class="eyebrow"><b>MICRODESAFÍO 1 / 2</b> · UN CASO</p>
      <blockquote class="caseText">{{ caso.situation }}</blockquote>
      <h2 class="quizAsk">{{ caso.ask }}</h2>

      <div class="readings" role="radiogroup">
        @for (o of caso.options; track o.id) {
          <button
            class="reading"
            role="radio"
            [attr.aria-checked]="selected() === o.id"
            [class.on]="selected() === o.id"
            [class.right]="phase() === 'solved' && o.ok"
            [disabled]="phase() === 'solved' || phase() === 'skipped'"
            (click)="select(o.id)"
          >
            {{ o.text }}
          </button>
        }
      </div>

      @switch (phase()) {
        @case ('answering') {
          <div class="microActions">
            <button class="tool" [disabled]="hinted()" (click)="hint()">✦ Pista</button>
            <button class="btn primary" [disabled]="!selected()" (click)="check()">COMPROBAR</button>
          </div>
          @if (hinted()) {
            <p class="hintLine">{{ caso.hint }}</p>
          }
        }
        @case ('failed') {
          <div class="feedback bad">
            <b>Esa dice más de lo que sabemos.</b>Cambiá tu elección y volvé a comprobar.
            <div class="feedbackActions">
              <button class="btn ghost" (click)="skip()">Omitir →</button>
            </div>
          </div>
        }
        @case ('solved') {
          <div class="feedback">
            <b>Esa se sostiene.</b>
            @if (whyOpen()) {
              <span class="whyText">{{ caso.why }}</span>
            }
            <div class="feedbackActions">
              @if (!whyOpen()) {
                <button class="btn ghost" (click)="openWhy()">¿Por qué?</button>
              }
              <button class="btn primary" (click)="done.emit()">SIGUIENTE →</button>
            </div>
          </div>
        }
        @case ('skipped') {
          <div class="feedback">
            <b>Sin problema.</b>La que se sostiene es la del medio: solo cuenta lo que pasó en esta misión.
            <div class="feedbackActions"><button class="btn primary" (click)="done.emit()">SIGUIENTE →</button></div>
          </div>
        }
      }
    </div>
  `,
})
export class CasoComponent implements OnInit {
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly caso = CASO_ANA;
  readonly selected = signal<string | null>(null);
  readonly phase = signal<Phase>('answering');
  readonly hinted = signal(false);
  readonly whyOpen = signal(false);
  private attempt = 0;

  ngOnInit() {
    this.observe.emit({ type: 'task_presented', opportunity: TASK });
    this.observe.emit({ type: 'options_presented', opportunity: TASK, payload: { options: CASO_ANA.options.map((o) => o.id) } });
    this.observe.emit({ type: 'support_available', opportunity: TASK, payload: { support: 'pista' } });
  }

  select(id: string) {
    if (this.selected() === id) return;
    // Primera elección = acción; cambiarla antes de comprobar = revisión.
    const first = this.selected() === null && this.phase() === 'answering';
    this.observe.emit({ type: first ? 'action_performed' : 'answer_revised', opportunity: TASK, payload: { action: 'select', item: id } });
    this.selected.set(id);
    if (this.phase() === 'failed') this.phase.set('answering');
    this.ui.tone(520);
  }

  hint() {
    if (this.hinted()) return;
    this.hinted.set(true);
    this.observe.emit({ type: 'hint_requested', opportunity: TASK, payload: { level: 1 } });
    this.observe.emit({ type: 'support_delivered', opportunity: TASK, payload: { support: 'pista' } });
  }

  check() {
    const choice = this.selected();
    if (!choice) return;
    const correct = CASO_ANA.options.find((o) => o.id === choice)?.ok === true;
    this.attempt += 1;
    this.observe.emit({ type: 'response_submitted', opportunity: TASK, payload: { correct, attempt: this.attempt, choice } });
    if (!correct) {
      this.phase.set('failed');
      this.ui.tone(230);
      return;
    }
    this.observe.emit({ type: 'task_completed', opportunity: TASK });
    this.observe.emit({ type: 'exploration_offered', opportunity: WHY });
    this.phase.set('solved');
    this.ui.tone(720);
  }

  skip() {
    this.observe.emit({ type: 'task_skipped', opportunity: TASK });
    this.phase.set('skipped');
  }

  openWhy() {
    this.whyOpen.set(true);
    this.observe.emit({ type: 'exploration_opened', opportunity: WHY });
  }
}
