import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FORMAT_LABELS, FORMAT_ORDER, MISSIONS, MODES, type FormatId } from '../content';
import type { SceneObservation } from '../scene-observation';
import { UiService } from '../services/ui.service';

export type Mode = 'con_pista' | 'sin_pista';
export interface Prep {
  mode: Mode;
  format: FormatId | null;
}

/**
 * Preparación de una misión: dos decisiones en una pantalla. El modo (con o
 * sin pista) siempre; el formato de entrada en las misiones que lo ofrecen,
 * en orden alternado. Se registran al empezar, con lo que estaba ofrecido.
 */
@Component({
  selector: 'synapxix-mission-prep',
  standalone: true,
  template: `
    <div class="prep">
      <span class="prepIcon">{{ mission.icon }}</span>
      <h2>{{ mission.name }}</h2>
      <p class="prepGoal">{{ mission.goal }}</p>

      <div class="prepRow">
        <small>¿CÓMO LA JUEGAS?</small>
        <div class="choiceGrid two">
          @for (m of modes; track m.id) {
            <button class="choice" [class.selected]="mode() === m.id" (click)="mode.set(m.id)">
              <span class="choiceIcon">{{ m.icon }}</span>
              <span><strong>{{ m.label }}</strong><small>{{ m.copy }}</small></span>
            </button>
          }
        </div>
      </div>

      @if (formats.length) {
        <div class="prepRow">
          <small>¿POR DÓNDE ENTRAS?</small>
          <div class="segmented">
            @for (f of formats; track f) {
              <button [class.selected]="format() === f" (click)="format.set(f)">{{ labels[f].icon }} {{ labels[f].label }}</button>
            }
          </div>
        </div>
      }

      <button class="btn primary" [disabled]="!ready()" (click)="start()">EMPEZAR →</button>
    </div>
  `,
})
export class MissionPrepComponent implements OnInit {
  private readonly ui = inject(UiService);

  @Input({ required: true }) scene!: 'observatorio' | 'ciclo' | 'camara';
  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() begin = new EventEmitter<Prep>();

  readonly modes = MODES;
  readonly labels = FORMAT_LABELS;
  readonly mode = signal<Mode | null>(null);
  readonly format = signal<FormatId | null>(null);
  formats: FormatId[] = [];
  mission = MISSIONS[0];

  ngOnInit() {
    this.mission = MISSIONS.find((m) => m.scene === this.scene)!;
    this.formats = this.scene === 'observatorio' ? [] : FORMAT_ORDER[this.scene];
    this.observe.emit({ type: 'choice_offered', opportunity: this.modeOpp(), payload: { options: MODES.map((m) => m.id) } });
    if (this.formats.length) {
      this.observe.emit({ type: 'choice_offered', opportunity: this.formatOpp(), payload: { options: this.formats } });
    }
  }

  ready() {
    return this.mode() !== null && (this.formats.length === 0 || this.format() !== null);
  }

  start() {
    const mode = this.mode();
    if (!mode || !this.ready()) return;
    this.observe.emit({ type: 'choice_made', opportunity: this.modeOpp(), payload: { choice: mode } });
    if (this.formats.length) {
      this.observe.emit({ type: 'choice_made', opportunity: this.formatOpp(), payload: { choice: this.format() } });
    }
    this.ui.tone(700);
    this.begin.emit({ mode, format: this.format() });
  }

  private modeOpp() {
    return { id: `${this.scene}:modo`, kind: 'eleccion_desafio' };
  }

  private formatOpp() {
    return { id: `${this.scene}:formato`, kind: 'eleccion_formato' };
  }
}
