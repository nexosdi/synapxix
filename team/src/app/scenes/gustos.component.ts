import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { INTEREST_FAMILIES, INTEREST_PAIRS, PUERTAS } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService } from '../services/pulse-api.service';
import { UiService } from '../services/ui.service';

const PUERTA = { id: 'gustos:puerta', kind: 'declaracion' };

/**
 * Escena gustos. Una pregunta por pantalla, respuesta de un toque:
 * cómo prefiere entender algo nuevo y seis pares de actividades. Todo
 * viaja como declaración (origen reported) y luego se contrasta con lo que
 * la persona elige al jugar.
 */
@Component({
  selector: 'synapxix-gustos',
  standalone: true,
  template: `
    <div class="gustos">
      <div class="quizDots" aria-hidden="true">
        @for (i of steps; track i) {
          <i [class.on]="i <= step()"></i>
        }
      </div>

      @if (step() === 0) {
        <h2 class="quizAsk">¿Cómo prefieres entender algo nuevo?</h2>
        <div class="choiceGrid three">
          @for (p of puertas; track p.id) {
            <button class="choice" (click)="declare(p.id, p.label)">
              <span class="choiceIcon">{{ p.icon }}</span>
              <strong>{{ p.label }}</strong>
            </button>
          }
        </div>
      } @else {
        <h2 class="quizAsk">¿Qué te tienta más?</h2>
        <div class="pair">
          @for (a of pair(); track a.text; let i = $index) {
            <button class="pairCard" (click)="choose(i)">{{ a.text }}</button>
            @if (i === 0) {
              <span class="pairOr">o</span>
            }
          }
        </div>
      }
    </div>
  `,
})
export class GustosComponent implements OnInit {
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly puertas = PUERTAS;
  readonly steps = Array.from({ length: INTEREST_PAIRS.length + 1 }, (_, i) => i);
  readonly step = signal(0);

  ngOnInit() {
    this.observe.emit({ type: 'options_presented', opportunity: PUERTA, payload: { options: PUERTAS.map((p) => p.id) } });
  }

  pair() {
    return INTEREST_PAIRS[this.step() - 1];
  }

  declare(value: string, label: string) {
    this.observe.emit({ type: 'declaration_made', opportunity: PUERTA, origin: 'reported', payload: { field: 'puerta', value, label } });
    void this.api.saveDeclared({ portal: value }).catch(() => undefined);
    this.advance();
  }

  choose(side: number) {
    const k = this.step() - 1;
    const option = INTEREST_PAIRS[k][side];
    this.observe.emit({
      type: 'declaration_made',
      opportunity: this.pairOpp(k),
      origin: 'reported',
      payload: { field: 'interes', value: option.family, label: INTEREST_FAMILIES[option.family], activity: option.text },
    });
    this.advance();
  }

  private advance() {
    this.ui.tone(560 + this.step() * 40);
    if (this.step() >= INTEREST_PAIRS.length) {
      this.done.emit();
      return;
    }
    this.step.update((s) => s + 1);
    const k = this.step() - 1;
    this.observe.emit({
      type: 'options_presented',
      opportunity: this.pairOpp(k),
      payload: { options: INTEREST_PAIRS[k].map((o) => o.family) },
    });
  }

  private pairOpp(k: number) {
    return { id: `gustos:par-${k + 1}`, kind: 'preferencia' };
  }
}
