import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CONTRAST_CARD, MISSION1_BUCKETS, MISSION1_HINT } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import type { AssignedStep } from './shadow.component';

const OPP = { id: `contraste:${CONTRAST_CARD.id}`, kind: 'tarea' };

/**
 * Escena contraste. Una tarjeta nueva de la misma habilidad, con o sin
 * pista según el contenido que asignó el veredicto. Su resultado cierra el
 * ciclo: queda como outcome de la decisión y entra a la nueva instantánea,
 * encadenada a la anterior.
 */
@Component({
  selector: 'synapxix-contrast',
  standalone: true,
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">CONTRASTE / RESULTADO</span>
        <span class="chainNote">la decisión se comprueba con una tarea nueva</span>
      </aside>

      <div class="game">
        <div class="gameHead">
          <div>
            <p class="eyebrow"><b>PASO ASIGNADO</b> · {{ step.assigned.label }}</p>
            <h2>Una tarjeta más, para comprobar.</h2>
            <p>
              {{ step.assigned.content.hintAvailable ? 'Esta vez la pista está disponible, por si la quieres.' : 'Esta vez no hay pista: es una comprobación sin apoyo.' }}
              Lo que pase aquí actualiza tu retrato.
            </p>
          </div>
          @if (step.assigned.content.hintAvailable) {
            <div class="gameTools">
              <button class="tool" [disabled]="hinted() || phase() === 'solved' || phase() === 'skipped'" (click)="hint()">✦ Pedir pista</button>
            </div>
          }
        </div>

        <div class="promptCard">
          <small>TARJETA DE CONTRASTE</small>
          <p>{{ card.text }}</p>
          @if (phase() === 'answering' || phase() === 'failed') {
            <div class="promptActions">
              @for (bucket of buckets; track bucket.id) {
                <button (click)="answer(bucket.id)">Es {{ bucket.label.toLowerCase() }}</button>
              }
            </div>
          }
        </div>

        @if (phase() === 'failed') {
          <div class="feedback bad">
            <b>Todavía no.</b>Puedes reintentar o dejarla aquí.
            <div class="feedbackActions"><button class="btn ghost" (click)="skip()">Omitir →</button></div>
          </div>
        }
        @if (phase() === 'solved' || phase() === 'skipped') {
          <div class="feedback">
            <b>{{ phase() === 'solved' ? 'Resuelta.' : 'Registrada.' }}</b>{{ card.why }}
            <div class="feedbackActions">
              <button class="btn primary" [disabled]="closing()" (click)="finish()">
                {{ closing() ? 'ACTUALIZANDO…' : 'VER MI RETRATO →' }}
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ContrastComponent implements OnInit {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Input({ required: true }) step!: AssignedStep;
  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly card = CONTRAST_CARD;
  readonly buckets = MISSION1_BUCKETS;
  readonly phase = signal<'answering' | 'failed' | 'solved' | 'skipped'>('answering');
  readonly hinted = signal(false);
  readonly closing = signal(false);

  private attempt = 0;

  ngOnInit() {
    this.observe.emit({ type: 'task_presented', opportunity: OPP });
    this.observe.emit({ type: 'options_presented', opportunity: OPP, payload: { options: this.buckets.map((b) => b.id) } });
    if (this.step.assigned.content.hintAvailable) {
      this.observe.emit({ type: 'support_available', opportunity: OPP, payload: { support: 'pista' } });
    }
  }

  hint() {
    if (this.hinted()) return;
    this.hinted.set(true);
    this.observe.emit({ type: 'hint_requested', opportunity: OPP, payload: { level: 1 } });
    this.observe.emit({ type: 'support_delivered', opportunity: OPP, payload: { support: 'pista' } });
    this.ui.openModal(MISSION1_HINT);
  }

  answer(bucketId: string) {
    const correct = this.card.kind === bucketId;
    this.attempt += 1;
    this.observe.emit({ type: 'response_submitted', opportunity: OPP, payload: { correct, attempt: this.attempt, choice: bucketId } });
    if (!correct) {
      this.phase.set('failed');
      this.ui.tone(230);
      return;
    }
    this.ui.tone(720);
    this.observe.emit({ type: 'task_completed', opportunity: OPP });
    this.phase.set('solved');
  }

  skip() {
    this.observe.emit({ type: 'task_skipped', opportunity: OPP });
    this.phase.set('skipped');
  }

  /** El resultado cierra el ciclo de la decisión antes de recalcular el retrato. */
  async finish() {
    this.closing.set(true);
    const solved = this.phase() === 'solved';
    try {
      await this.session.flush();
      await this.api.recordOutcome(this.step.decisionId, this.step.assigned.id, {
        independiente: solved && this.attempt === 1 && !this.hinted(),
        resuelta: solved,
        intentos: this.attempt,
        pista_usada: this.hinted(),
        omitida: !solved,
      });
    } catch {
      this.ui.toast('El resultado quedó en cola; tu retrato se calcula igual con los eventos.');
    } finally {
      this.closing.set(false);
      this.done.emit();
    }
  }
}
