import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { INTEREST_FAMILIES, SKILLS } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { EstrellaComponent } from './estrella.component';

const SCENE = 'superpoderes';
const LEARN = { id: `${SCENE}:aprender`, kind: 'declaracion' };
const PICKS = 3;

type Skill = (typeof SKILLS)[number];

/**
 * Lunes · Tus superpoderes. Doce habilidades, tres por familia: elige tres
 * que le salen natural y una que quiere aprender. Puede cambiar de idea
 * antes de confirmar; cada superpoder confirmado es una declaración
 * (origen reported) y la estrella suma una gema con cada toque.
 */
@Component({
  selector: 'synapxix-superpoderes',
  standalone: true,
  imports: [EstrellaComponent],
  template: `
    <div class="beat split starBuild">
      <div class="splitCopy">
        <p class="eyebrow"><b>LUNES</b> · TUS SUPERPODERES</p>
        @if (step() === 'elegir') {
          <h2 class="quizAsk">Elegí tres cosas que te salen natural.</h2>
          <p class="beatNote soft">No las que hacés todos los días: las que te salen sin esfuerzo. {{ picked().length }} de {{ picks }}.</p>
        } @else {
          <h2 class="quizAsk">¿Y una que te gustaría aprender acá?</h2>
          <p class="beatNote soft">Puede ser de cualquier familia. Nos sirve para saber con quién juntarte.</p>
        }
        <div class="skillGrid">
          @for (s of shown(); track s.id) {
            <button class="skillCard" [class.selected]="isPicked(s.id)" [attr.aria-pressed]="isPicked(s.id)" (click)="toggle(s)">
              <b>{{ s.label }}</b>
              <span>{{ s.text }}</span>
            </button>
          }
        </div>
        @if (step() === 'elegir') {
          <button class="btn primary" [disabled]="picked().length !== picks" (click)="confirm()">LISTO, ESTOS SON MIS TRES →</button>
        } @else {
          <button class="btn primary" [disabled]="!learn()" (click)="finish()">TERMINAR EL LUNES →</button>
        }
      </div>
      <synapxix-estrella [state]="session.estrella()" />
    </div>
  `,
})
export class SuperpoderesComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly picks = PICKS;
  readonly step = signal<'elegir' | 'aprender'>('elegir');
  readonly picked = signal<Skill[]>([]);
  readonly learn = signal<Skill | null>(null);
  readonly shown = computed(() => (this.step() === 'elegir' ? SKILLS : SKILLS.filter((s) => !this.picked().some((p) => p.id === s.id))));

  ngOnInit() {
    for (let k = 1; k <= PICKS; k++) {
      this.observe.emit({ type: 'options_presented', opportunity: this.opp(k), payload: { options: SKILLS.map((s) => s.id) } });
    }
  }

  isPicked(id: string) {
    return this.step() === 'elegir' ? this.picked().some((p) => p.id === id) : this.learn()?.id === id;
  }

  toggle(s: Skill) {
    if (this.step() === 'aprender') {
      this.learn.set(this.learn()?.id === s.id ? null : s);
      this.session.estrella.update((e) => ({ ...e, aprender: this.learn() ? { id: s.id, family: s.family, label: s.label } : null }));
    } else if (this.isPicked(s.id)) {
      this.picked.update((p) => p.filter((x) => x.id !== s.id));
    } else if (this.picked().length < PICKS) {
      this.picked.update((p) => [...p, s]);
    } else {
      this.ui.toast('Ya elegiste tres: tocá una para cambiarla.');
      return;
    }
    if (this.step() === 'elegir') {
      this.session.estrella.update((e) => ({ ...e, superpoderes: this.picked().map((p) => ({ id: p.id, family: p.family, label: p.label })) }));
    }
    this.ui.tone(560 + this.picked().length * 60);
  }

  confirm() {
    if (this.picked().length !== PICKS) return;
    this.picked().forEach((s, i) =>
      this.observe.emit({
        type: 'declaration_made',
        opportunity: this.opp(i + 1),
        origin: 'reported',
        payload: { field: 'superpoder', value: s.family, label: INTEREST_FAMILIES[s.family], skill: s.label, id: s.id },
      }),
    );
    this.step.set('aprender');
    this.observe.emit({ type: 'options_presented', opportunity: LEARN, payload: { options: this.shown().map((s) => s.id) } });
    this.ui.tone(720);
  }

  finish() {
    const l = this.learn();
    if (!l) return;
    this.observe.emit({ type: 'declaration_made', opportunity: LEARN, origin: 'reported', payload: { field: 'aprender', value: l.id, label: l.label } });
    void this.api.saveDeclared({ perfil: { superpoderes: this.picked().map((s) => s.label), aprender: l.label } }).catch(() => undefined);
    this.done.emit();
  }

  private opp(k: number) {
    return { id: `${SCENE}:${k}`, kind: 'habilidad' };
  }
}
