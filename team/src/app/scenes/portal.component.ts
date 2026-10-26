import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CYCLE_PANEL, PORTALS } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService } from '../services/pulse-api.service';
import { UiService } from '../services/ui.service';

const OPP = { id: 'portal:puerta', kind: 'declaracion' };

/**
 * Escena portal — una preferencia DECLARADA (origen reported), que luego se
 * contrasta con las elecciones de formato de las misiones 2 y 3.
 */
@Component({
  selector: 'synapxix-portal',
  standalone: true,
  template: `
    <div class="world">
      <div>
        <p class="eyebrow"><b>SEÑAL DECLARADA</b> · NO ES INFERENCIA</p>
        <h2>¿Por qué puerta quieres entrar?</h2>
        <p class="lead">Lo que digas aquí queda como declaración. Más adelante podrás elegir de nuevo, y el retrato mostrará si ambas cosas coinciden.</p>
        <div class="choiceGrid">
          @for (p of portals; track p.id) {
            <button class="choice" [class.selected]="portal() === p.id" (click)="choose(p.id)">
              <span class="choiceIcon">{{ p.icon }}</span>
              <span>
                <strong>{{ p.label }}</strong>
                <small>{{ p.copy }}</small>
              </span>
            </button>
          }
        </div>
        <p class="footNote">D.A.L.A. mantiene separado lo declarado de lo observado.</p>
      </div>
      <div class="panel">
        <div class="panelHead">
          <span class="num">02</span>
          <div><small>LO QUE HACE D.A.L.A.</small><h2>Un ciclo, no una etiqueta</h2></div>
        </div>
        <div class="codeList">
          @for (line of cyclePanel; track line) {
            <div class="code">{{ line }}</div>
          }
        </div>
        <button class="btn primary wide" [disabled]="!portal()" (click)="continue_()">
          FIJAR MI PUERTA →
        </button>
      </div>
    </div>
  `,
})
export class PortalComponent implements OnInit {
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly portals = PORTALS;
  readonly cyclePanel = CYCLE_PANEL;
  readonly portal = signal<'visual' | 'story' | 'logic' | ''>('');

  ngOnInit() {
    this.observe.emit({ type: 'options_presented', opportunity: OPP, payload: { options: PORTALS.map((p) => p.id) } });
  }

  choose(id: 'visual' | 'story' | 'logic') {
    this.portal.set(id);
    this.ui.tone(650);
  }

  continue_() {
    const portal = this.portal();
    if (!portal) return;
    const label = PORTALS.find((p) => p.id === portal)?.label ?? portal;
    this.observe.emit({
      type: 'declaration_made',
      opportunity: OPP,
      origin: 'reported',
      payload: { field: 'puerta', value: portal, label },
    });
    void this.api.saveDeclared({ portal });
    this.done.emit();
  }
}
