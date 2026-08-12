import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CYCLE_PANEL, PORTALS } from '../content';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Pantalla 2 — El portal: una señal DECLARADA (no inferencia) que adapta el
 * lenguaje inicial, junto al panel de lo que hace D.A.L.A.
 */
@Component({
  selector: 'synapxix-portal',
  standalone: true,
  template: `
    <div class="world">
      <div>
        <p class="eyebrow"><b>SEÑAL DECLARADA</b> · NO ES INFERENCIA</p>
        <h2>¿Por qué puerta quieres entrar?</h2>
        <p class="lead">Esto adapta el lenguaje inicial. No suma puntos ni define tu perfil.</p>
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
export class PortalComponent {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<void>();

  readonly portals = PORTALS;
  readonly cyclePanel = CYCLE_PANEL;
  readonly portal = signal<'visual' | 'story' | 'logic' | ''>('');

  choose(id: 'visual' | 'story' | 'logic') {
    this.portal.set(id);
    this.session.tone(650);
  }

  continue_() {
    const portal = this.portal();
    if (!portal) return;
    void this.api.saveDeclared({ portal });
    this.done.emit();
  }
}
