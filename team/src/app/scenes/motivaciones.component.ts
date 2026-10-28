import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { MOTIVATION_ASKS, MOTIVATION_PAIRS, MOTIVATORS } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { EstrellaComponent, topOf } from './estrella.component';

const SCENE = 'motivaciones';

/**
 * Martes · Lo que te mueve. Seis elecciones entre pares de motivaciones;
 * cada una aparece tres veces y cambia de lado. Cada elección es una
 * declaración y suma una cuenta a la estrella; la más elegida le da forma
 * al aura.
 */
@Component({
  selector: 'synapxix-motivaciones',
  standalone: true,
  imports: [EstrellaComponent],
  template: `
    <div class="beat split starBuild">
      <div class="splitCopy">
        <p class="eyebrow"><b>MARTES</b> · LO QUE TE MUEVE · {{ index() + 1 }} DE {{ pairs.length }}</p>
        <h2 class="quizAsk">{{ ask() }}</h2>
        <div class="pairCards">
          @for (m of pair(); track m) {
            <button class="pairCard" (click)="choose(m)">
              <b>{{ phrase(m) }}</b>
            </button>
          }
        </div>
        <p class="beatNote soft">Las dos valen. Elegí la que pesa más hoy, sin pensarlo mucho.</p>
      </div>
      <synapxix-estrella [state]="session.estrella()" />
    </div>
  `,
})
export class MotivacionesComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly pairs = MOTIVATION_PAIRS;
  readonly motivators = MOTIVATORS;
  readonly index = signal(0);
  readonly pair = computed(() => MOTIVATION_PAIRS[this.index()]);
  readonly ask = computed(() => MOTIVATION_ASKS[this.index()]);

  /** La frase de esta aparición: la primera vez la primera, y así. */
  phrase(m: string) {
    const seen = MOTIVATION_PAIRS.slice(0, this.index()).filter((p) => p.includes(m)).length;
    return MOTIVATORS[m].texts[seen];
  }

  ngOnInit() {
    this.session.estrella.update((e) => ({ ...e, motivaciones: [] }));
    this.present();
  }

  choose(value: string) {
    this.observe.emit({
      type: 'declaration_made',
      opportunity: this.opp(),
      origin: 'reported',
      payload: { field: 'motivacion', value, label: MOTIVATORS[value].label, text: this.phrase(value) },
    });
    this.session.estrella.update((e) => ({ ...e, motivaciones: [...e.motivaciones, value] }));
    this.ui.tone(560 + this.index() * 40);
    if (this.index() >= MOTIVATION_PAIRS.length - 1) {
      const top = topOf(this.session.estrella().motivaciones);
      if (top) void this.api.saveDeclared({ perfil: { motivacion: MOTIVATORS[top].label } }).catch(() => undefined);
      this.done.emit();
      return;
    }
    this.index.update((i) => i + 1);
    this.present();
  }

  private present() {
    this.observe.emit({ type: 'options_presented', opportunity: this.opp(), payload: { options: [...this.pair()] } });
  }

  private opp() {
    return { id: `${SCENE}:par-${this.index() + 1}`, kind: 'motivacion' };
  }
}
