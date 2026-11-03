import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { EQUIPO, ESTILOS, SITUACIONES } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { EstrellaComponent } from './estrella.component';

const SCENE = 'equipo';
const RESUMEN = { id: `${SCENE}:resumen`, kind: 'recomendacion_ia' };

/** Color de la cuenta que deja cada momento de equipo en la estrella. */
const APOYO_COLOR: Record<string, string> = { solo: '#FFD93D', persona: '#FF8FB1', ia: '#8EC5FF', despues: '#C9D6EA' };
const VERDICT_COLOR: Record<string, string> = { approved: '#C9D6EA', edited: '#1E90FF', rejected: '#0A4FBF' };

type Step = 'situacion-1' | 'situacion-2' | 'situacion-3' | 'situacion-4' | 'apoyo-1' | 'resumen' | 'apoyo-2' | 'fin';
const STEPS: Step[] = ['situacion-1', 'situacion-2', 'situacion-3', 'situacion-4', 'apoyo-1', 'resumen', 'apoyo-2', 'fin'];
type Verdict = (typeof EQUIPO.resumen.verdicts)[number]['id'];

/**
 * Jueves · Con el equipo. Cuatro situaciones de todos los días con las
 * mismas cuatro formas de actuar (hablarlo de frente, ofrecer ayuda,
 * ajustar el plan, sumar a alguien más) en distinto orden; dos momentos
 * para elegir a quién recurrir; y un resumen de la IA que le asigna a Lucía
 * una tarea que no tomó. Ninguna opción es la correcta: se registra qué
 * estaba disponible y qué eligió, y cada momento suma una cuenta a la
 * estrella.
 */
@Component({
  selector: 'synapxix-equipo',
  standalone: true,
  imports: [EstrellaComponent],
  template: `
    <div class="beat split starBuild teamTask">
      <div class="splitCopy">
        <p class="eyebrow"><b>JUEVES</b> · CON EL EQUIPO · {{ position() }} DE {{ steps.length - 1 }}</p>

        @switch (kind()) {
          @case ('situacion') {
            @if (situacion(); as s) {
              <h2 class="quizAsk">{{ s.ask }}</h2>
              <p class="beatNote soft">¿Qué hacés primero?</p>
              <div class="teamOptions">
                @for (o of s.options; track o.value) {
                  <button class="starOption" (click)="act(o.value)">{{ o.text }}</button>
                }
              </div>
            }
          }
          @case ('resumen') {
            <p class="teamIntro">{{ equipo.intro }}</p>
            <h2 class="quizAsk">{{ equipo.resumen.ask }}</h2>
            <blockquote class="caseText">{{ equipo.resumen.text }}</blockquote>
            @if (reasonsOpen()) {
              <ul class="draftReasons">
                @for (r of equipo.resumen.reasons; track r) {
                  <li>{{ r }}</li>
                }
              </ul>
            } @else {
              <button class="linkBtn" (click)="openReasons()">Ver en qué se basa →</button>
            }
            @if (verdict(); as v) {
              <div class="feedback">
                <b>{{ verdictFeedback(v) }}</b>
                <div class="feedbackActions"><button class="btn primary" (click)="next()">SEGUIR →</button></div>
              </div>
            } @else {
              <div class="teamOptions three">
                @for (v of equipo.resumen.verdicts; track v.id) {
                  <button class="starOption" (click)="review(v.id)">{{ v.label }}</button>
                }
              </div>
            }
          }
          @case ('fin') {
            <h2 class="quizAsk">Listo el jueves.</h2>
            <p class="beatNote">Lo que elegiste en cada momento queda registrado con lo que tenías disponible. Ninguna opción era la correcta.</p>
            <button class="btn primary" (click)="done.emit()">TERMINAR EL JUEVES →</button>
          }
          @default {
            @if (apoyo(); as a) {
              <p class="teamIntro">{{ equipo.intro }}</p>
              <h2 class="quizAsk">{{ a.ask }}</h2>
              @if (picked(); as p) {
                <div class="feedback">
                  <b>{{ p.outcome }}</b>
                  <div class="feedbackActions"><button class="btn primary" (click)="next()">SEGUIR →</button></div>
                </div>
              } @else {
                <div class="teamOptions">
                  @for (o of a.options; track o.value) {
                    <button class="starOption" (click)="choose(o.value)">{{ o.text }}</button>
                  }
                </div>
              }
            }
          }
        }
      </div>
      <synapxix-estrella [state]="session.estrella()" />
    </div>
  `,
})
export class EquipoComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly equipo = EQUIPO;
  readonly steps = STEPS;
  readonly step = signal<Step>('situacion-1');
  readonly choice = signal<string | null>(null);
  readonly reasonsOpen = signal(false);
  readonly verdict = signal<Verdict | null>(null);

  readonly position = computed(() => Math.min(STEPS.indexOf(this.step()) + 1, STEPS.length - 1));
  readonly kind = computed(() => {
    const s = this.step();
    return s.startsWith('situacion') ? 'situacion' : s === 'resumen' || s === 'fin' ? s : 'apoyo';
  });
  readonly situacion = computed(() => SITUACIONES.find((x) => x.id === this.step()) ?? null);
  readonly apoyo = computed(() => EQUIPO.apoyos.find((a) => a.id === this.step()) ?? null);
  readonly picked = computed(() => this.apoyo()?.options.find((o) => o.value === this.choice()) ?? null);

  ngOnInit() {
    this.session.estrella.update((e) => ({ ...e, equipo: [] }));
    this.present();
  }

  /** Una situación de equipo: la forma de actuar elegida, y a la siguiente. */
  act(value: string) {
    const s = this.situacion();
    if (!s) return;
    this.observe.emit({ type: 'choice_made', opportunity: this.opp(s.id, 'situacion_equipo'), payload: { choice: value, label: ESTILOS[value].label } });
    this.bead(ESTILOS[value].color);
    this.ui.tone(600 + STEPS.indexOf(this.step()) * 30);
    this.next();
  }

  choose(value: string) {
    const a = this.apoyo();
    if (!a || this.choice()) return;
    this.choice.set(value);
    this.observe.emit({ type: 'choice_made', opportunity: this.opp(a.id, 'eleccion_apoyo'), payload: { choice: value } });
    this.bead(APOYO_COLOR[value]);
    this.ui.tone(620);
  }

  openReasons() {
    this.reasonsOpen.set(true);
    this.observe.emit({ type: 'reasons_opened', opportunity: RESUMEN });
  }

  review(v: Verdict) {
    this.verdict.set(v);
    const label = EQUIPO.resumen.verdicts.find((x) => x.id === v)!.label;
    this.observe.emit({ type: 'recommendation_reviewed', opportunity: RESUMEN, payload: { verdict: v, verdictLabel: label.toLowerCase() } });
    this.bead(VERDICT_COLOR[v]);
    this.ui.tone(v === 'approved' ? 300 : 720);
  }

  verdictFeedback(v: Verdict) {
    return EQUIPO.resumen.verdicts.find((x) => x.id === v)!.feedback;
  }

  next() {
    this.step.set(STEPS[STEPS.indexOf(this.step()) + 1] ?? 'fin');
    this.choice.set(null);
    this.present();
  }

  private bead(color: string) {
    this.session.estrella.update((e) => ({ ...e, equipo: [...e.equipo, color] }));
  }

  /** Cada momento se presenta con todo lo que estaba disponible. */
  private present() {
    const s = this.situacion();
    const a = this.apoyo();
    if (s) {
      this.observe.emit({ type: 'choice_offered', opportunity: this.opp(s.id, 'situacion_equipo'), payload: { options: s.options.map((o) => o.value) } });
    } else if (a) {
      this.observe.emit({ type: 'choice_offered', opportunity: this.opp(a.id, 'eleccion_apoyo'), payload: { options: a.options.map((o) => o.value) } });
    } else if (this.step() === 'resumen') {
      this.observe.emit({ type: 'recommendation_presented', opportunity: RESUMEN, payload: { draft: EQUIPO.resumen.text } });
    }
  }

  private opp(id: string, kind: string) {
    return { id: `${SCENE}:${id}`, kind };
  }
}
