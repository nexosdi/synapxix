import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { TRABAJO } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { EstrellaComponent } from './estrella.component';

const SCENE = 'trabajo';

/**
 * Viernes · Cómo trabajás. Seis preguntas de un toque: forma de trabajo,
 * horario, canal, devoluciones, ritmo y reacción cuando algo no sale. Son
 * acuerdos de trabajo declarados, no evidencia: se guardan en el perfil y
 * cada respuesta cambia algo de la estrella.
 */
@Component({
  selector: 'synapxix-trabajo',
  standalone: true,
  imports: [EstrellaComponent],
  template: `
    <div class="beat split starBuild">
      <div class="splitCopy">
        <p class="eyebrow"><b>VIERNES</b> · CÓMO TRABAJÁS · {{ index() + 1 }} DE {{ questions.length }}</p>
        <h2 class="quizAsk">{{ question().ask }}</h2>
        <div class="starOptions">
          @for (o of question().options; track o.value) {
            <button class="starOption" (click)="answer(o.value, o.text)">{{ o.text }}</button>
          }
        </div>
        <p class="beatNote soft">Lo usamos para armar tus acuerdos con el equipo. Podés cambiarlo cuando quieras.</p>
      </div>
      <synapxix-estrella [state]="session.estrella()" />
    </div>
  `,
})
export class TrabajoComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly questions = TRABAJO;
  readonly index = signal(0);
  readonly question = computed(() => TRABAJO[this.index()]);
  private readonly labels: Record<string, string> = {};

  ngOnInit() {
    this.present();
  }

  answer(value: string, text: string) {
    const q = this.question();
    this.observe.emit({ type: 'declaration_made', opportunity: this.opp(), origin: 'reported', payload: { field: q.id, value, label: text } });
    this.session.estrella.update((e) => ({ ...e, trabajo: { ...e.trabajo, [q.id]: value } }));
    this.labels[q.id] = text;
    this.ui.tone(560 + this.index() * 40);
    if (this.index() >= TRABAJO.length - 1) {
      void this.api.saveDeclared({ perfil: { trabajo: { ...this.labels } } }).catch(() => undefined);
      this.done.emit();
      return;
    }
    this.index.update((i) => i + 1);
    this.present();
  }

  private present() {
    this.observe.emit({ type: 'options_presented', opportunity: this.opp(), payload: { options: this.question().options.map((o) => o.value) } });
  }

  private opp() {
    return { id: `${SCENE}:${this.question().id}`, kind: 'declaracion' };
  }
}
