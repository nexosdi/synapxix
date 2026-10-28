import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FUENTES_BUCKETS, FUENTES_CARDS, FUENTES_HINT } from '../content';
import type { SceneObservation } from '../scene-observation';
import { UiService } from '../services/ui.service';

const SCENE = 'fuentes';

type Phase = 'answering' | 'failed' | 'solved';

/**
 * Escena 08 · ¿Evidencia o hipótesis? Tres tarjetas nuevas, una a la vez:
 * dato observado, declaración o inferencia. Aclaración disponible; tras un
 * error, reintentar u omitir. Anticipa el Observatorio sin repetir tarjetas.
 */
@Component({
  selector: 'synapxix-fuentes',
  standalone: true,
  template: `
    <div class="micro">
      <p class="eyebrow"><b>MICRODESAFÍO 2 / 2</b> · TARJETA {{ index() + 1 }} DE {{ cards.length }}</p>
      <h2 class="quizAsk">Un dato, lo que alguien dice y lo que suponemos no son lo mismo.</h2>

      <div class="sourceCard" [class.solved]="phase() === 'solved'">{{ card().text }}</div>

      <div class="choiceGrid three">
        @for (b of buckets; track b.id) {
          <button
            class="choice"
            [class.right]="phase() === 'solved' && card().kind === b.id"
            [disabled]="phase() === 'solved'"
            (click)="answer(b.id)"
          >
            <strong>{{ b.label }}</strong>
          </button>
        }
      </div>

      @switch (phase()) {
        @case ('answering') {
          <div class="microActions">
            <button class="tool" [disabled]="hinted()" (click)="hint()">✦ Pedir aclaración</button>
          </div>
          @if (hinted()) {
            <p class="hintLine">{{ hintText }}</p>
          }
        }
        @case ('failed') {
          <div class="feedback bad">
            <b>Todavía no.</b>Probá otra categoría.
            <div class="feedbackActions"><button class="btn ghost" (click)="skip()">Omitir esta tarjeta →</button></div>
          </div>
        }
        @case ('solved') {
          <div class="feedback">
            <b>Bien separada.</b>
            <div class="feedbackActions">
              <button class="btn primary" (click)="next()">{{ last() ? 'VER MI PRIMERA INSTANTÁNEA →' : 'SIGUIENTE →' }}</button>
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class FuentesComponent implements OnInit {
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly cards = FUENTES_CARDS;
  readonly buckets = FUENTES_BUCKETS;
  readonly hintText = FUENTES_HINT;
  readonly index = signal(0);
  readonly phase = signal<Phase>('answering');
  readonly hinted = signal(false);
  private attempt = 0;

  ngOnInit() {
    this.present();
  }

  card() {
    return this.cards[this.index()];
  }

  last() {
    return this.index() === this.cards.length - 1;
  }

  private opp() {
    return { id: `${SCENE}:${this.card().id}`, kind: 'tarea' };
  }

  private present() {
    const opportunity = this.opp();
    this.attempt = 0;
    this.phase.set('answering');
    this.hinted.set(false);
    this.observe.emit({ type: 'task_presented', opportunity });
    this.observe.emit({ type: 'options_presented', opportunity, payload: { options: this.buckets.map((b) => b.id) } });
    this.observe.emit({ type: 'support_available', opportunity, payload: { support: 'aclaracion' } });
  }

  hint() {
    if (this.hinted()) return;
    this.hinted.set(true);
    this.observe.emit({ type: 'hint_requested', opportunity: this.opp(), payload: { level: 1 } });
    this.observe.emit({ type: 'support_delivered', opportunity: this.opp(), payload: { support: 'aclaracion' } });
  }

  answer(bucket: string) {
    if (this.phase() === 'solved') return;
    const correct = this.card().kind === bucket;
    this.attempt += 1;
    this.observe.emit({ type: 'response_submitted', opportunity: this.opp(), payload: { correct, attempt: this.attempt, choice: bucket } });
    if (!correct) {
      this.phase.set('failed');
      this.ui.tone(230);
      return;
    }
    this.observe.emit({ type: 'task_completed', opportunity: this.opp() });
    this.phase.set('solved');
    this.ui.tone(720);
  }

  skip() {
    this.observe.emit({ type: 'task_skipped', opportunity: this.opp() });
    this.next();
  }

  next() {
    if (this.last()) {
      this.done.emit();
      return;
    }
    this.index.update((i) => i + 1);
    this.present();
  }
}
