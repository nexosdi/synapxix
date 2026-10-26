import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FORMAT_LABELS, FORMAT_ORDER, type FormatId } from '../content';
import type { SceneObservation } from '../scene-observation';
import { UiService } from '../services/ui.service';

/**
 * Elección de formato antes de una misión. Tres entradas comparables al
 * mismo reto, en orden alternado entre misiones: lo elegido se contrasta
 * con la puerta declarada en el portal (coherencia declarado/observado).
 */
@Component({
  selector: 'synapxix-format-choice',
  standalone: true,
  template: `
    <div class="formatChoice">
      <p class="eyebrow"><b>ANTES DE EMPEZAR</b> · ELIGE CÓMO ENTRAR</p>
      <h2>{{ title }}</h2>
      <p class="lead">Las tres llevan al mismo reto. Elige la que te resulte más natural ahora.</p>
      <div class="choiceGrid">
        @for (id of order; track id) {
          <button class="choice" (click)="pick(id)">
            <span class="choiceIcon">{{ labels[id].icon }}</span>
            <span>
              <strong>{{ labels[id].label }}</strong>
              <small>{{ labels[id].copy }}</small>
            </span>
          </button>
        }
      </div>
    </div>
  `,
})
export class FormatChoiceComponent implements OnInit {
  private readonly ui = inject(UiService);

  @Input({ required: true }) scene!: 'ciclo' | 'camara';
  @Input() title = '';
  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() chosen = new EventEmitter<FormatId>();

  readonly labels = FORMAT_LABELS;
  order: FormatId[] = [];

  ngOnInit() {
    this.order = FORMAT_ORDER[this.scene];
    this.observe.emit({ type: 'choice_offered', opportunity: this.opp(), payload: { options: this.order } });
  }

  pick(id: FormatId) {
    this.observe.emit({ type: 'choice_made', opportunity: this.opp(), payload: { choice: id } });
    this.ui.tone(650);
    this.chosen.emit(id);
  }

  private opp() {
    return { id: `${this.scene}:formato`, kind: 'eleccion_formato' };
  }
}
