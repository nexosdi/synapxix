import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { DESAFIOS, MODES, type DesafioId } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { BrandIconComponent } from './brand-icon.component';
import { EstrellaComponent } from './estrella.component';

const TAREA = { id: 'desafio:tarea', kind: 'eleccion_tarea' };
const MODO = { id: 'desafio:modo', kind: 'eleccion_desafio' };

export type Mode = 'con_pista' | 'sin_pista';
export interface DesafioChoice {
  id: DesafioId;
  mode: Mode;
}

/**
 * Miércoles · Un desafío a tu medida. Tres problemas reales del equipo, uno
 * por familia de habilidades, y si jugarlo con o sin pista. Las dos
 * elecciones se registran al empezar, con lo que estaba ofrecido; la
 * estrella toma el color del desafío elegido.
 */
@Component({
  selector: 'synapxix-desafio',
  standalone: true,
  imports: [BrandIconComponent, EstrellaComponent],
  template: `
    <div class="beat split starBuild">
      <div class="splitCopy">
        <p class="eyebrow"><b>MIÉRCOLES</b> · UN DESAFÍO A TU MEDIDA</p>
        <h2 class="quizAsk">¿Con cuál te animás?</h2>
        <div class="desafioCards">
          @for (d of desafios; track d.id) {
            <button class="desafioCard" [class.selected]="picked() === d.id" [attr.aria-pressed]="picked() === d.id" (click)="pick(d.id)">
              <span class="taskIcon"><synapxix-icon [name]="d.icon" /></span>
              <span>
                <small>{{ d.family.toUpperCase() }}</small>
                <b>{{ d.name }}</b>
                <span>{{ d.goal }}</span>
              </span>
            </button>
          }
        </div>
        <div class="prepRow">
          <small>¿CÓMO LO JUGÁS?</small>
          <div class="choiceGrid two">
            @for (m of modes; track m.id) {
              <button class="choice" [class.selected]="mode() === m.id" (click)="setMode(m.id)">
                <span class="choiceIcon">{{ m.icon }}</span>
                <span><strong>{{ m.label }}</strong><small>{{ m.copy }}</small></span>
              </button>
            }
          </div>
        </div>
        <button class="btn primary" [disabled]="!picked() || !mode()" (click)="start()">EMPEZAR →</button>
      </div>
      <synapxix-estrella [state]="session.estrella()" />
    </div>
  `,
})
export class DesafioComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() begin = new EventEmitter<DesafioChoice>();

  readonly desafios = DESAFIOS;
  readonly modes = MODES;
  readonly picked = signal<DesafioId | null>(null);
  readonly mode = signal<Mode | null>(null);

  ngOnInit() {
    this.observe.emit({ type: 'choice_offered', opportunity: TAREA, payload: { options: DESAFIOS.map((d) => d.id) } });
    this.observe.emit({ type: 'choice_offered', opportunity: MODO, payload: { options: MODES.map((m) => m.id) } });
  }

  pick(id: DesafioId) {
    this.picked.set(id);
    this.paint();
    this.ui.tone(620);
  }

  setMode(m: Mode) {
    this.mode.set(m);
    this.paint();
    this.ui.tone(m === 'sin_pista' ? 760 : 640);
  }

  start() {
    const id = this.picked();
    const mode = this.mode();
    if (!id || !mode) return;
    const d = DESAFIOS.find((x) => x.id === id)!;
    this.observe.emit({ type: 'choice_made', opportunity: TAREA, payload: { choice: id, families: d.families } });
    this.observe.emit({ type: 'choice_made', opportunity: MODO, payload: { choice: mode } });
    this.ui.tone(700);
    this.begin.emit({ id, mode });
  }

  /** El borde de la estrella se pinta con la familia del desafío elegido. */
  private paint() {
    const d = DESAFIOS.find((x) => x.id === this.picked());
    this.session.estrella.update((e) => ({
      ...e,
      desafio: d ? { family: d.families[0], mode: this.mode() ?? 'con_pista' } : e.desafio,
    }));
  }
}
