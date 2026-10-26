import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MISSIONS, type MissionScreen } from '../content';
import type { SceneObservation } from '../scene-observation';
import { UiService } from '../services/ui.service';

/** Posición de cada misión en el mapa (en % del lienzo). */
const SPOTS = [
  { x: 50, y: 14 },
  { x: 16, y: 78 },
  { x: 84, y: 78 },
];

/**
 * Escena mapa. El núcleo con sus tres misiones: la persona elige el orden.
 * Cada vez que el mapa aparece ofrece las que faltan (choice_offered) y
 * registra la elegida.
 */
@Component({
  selector: 'synapxix-mapa',
  standalone: true,
  template: `
    <div class="mapa">
      <h2 class="quizAsk">{{ remaining().length ? (completed.length ? 'Sigue por…' : 'Elige por dónde entrar') : 'Núcleo completo' }}</h2>
      <div class="core">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          @for (s of spots; track $index; let i = $index) {
            <line x1="50" y1="52" [attr.x2]="s.x" [attr.y2]="s.y" [class.on]="isDone(missions[i].screen)" />
          }
        </svg>
        <div class="coreHeart" [class.full]="!remaining().length">{{ completed.length }}/3</div>
        @for (m of missions; track m.screen; let i = $index) {
          <button
            class="missionNode"
            [class.done]="isDone(m.screen)"
            [style.left.%]="spots[i].x"
            [style.top.%]="spots[i].y"
            [disabled]="isDone(m.screen)"
            (click)="play(m.screen)"
          >
            <i>{{ isDone(m.screen) ? '✓' : m.icon }}</i>
            <strong>{{ m.name }}</strong>
            <small>{{ m.goal }}</small>
          </button>
        }
      </div>
      @if (!remaining().length) {
        <button class="btn primary" (click)="finish.emit()">VER QUÉ TE PROPONE LA IA →</button>
      }
    </div>
  `,
})
export class MapaComponent implements OnInit {
  private readonly ui = inject(UiService);

  @Input() completed: MissionScreen[] = [];
  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() chosen = new EventEmitter<MissionScreen>();
  @Output() finish = new EventEmitter<void>();

  readonly missions = MISSIONS;
  readonly spots = SPOTS;

  ngOnInit() {
    const remaining = this.remaining();
    if (remaining.length) {
      this.observe.emit({ type: 'choice_offered', opportunity: this.opp(), payload: { options: remaining.map((m) => m.scene) } });
    }
  }

  remaining() {
    return MISSIONS.filter((m) => !this.completed.includes(m.screen));
  }

  isDone(screen: MissionScreen) {
    return this.completed.includes(screen);
  }

  play(screen: MissionScreen) {
    if (this.isDone(screen)) return;
    const mission = MISSIONS.find((m) => m.screen === screen)!;
    this.observe.emit({ type: 'choice_made', opportunity: this.opp(), payload: { choice: mission.scene } });
    this.ui.tone(680);
    this.chosen.emit(screen);
  }

  private opp() {
    return { id: `mapa:ruta-${this.completed.length + 1}`, kind: 'eleccion_ruta' };
  }
}
