import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { DALA_INTRO, DALA_RULES, NUCLEO } from '../content';
import type { SceneObservation } from '../scene-observation';
import { UiService } from '../services/ui.service';
import { BrandIconComponent } from './brand-icon.component';

const SCENE = 'nucleo';

/** Seis posiciones en anillo (en % del lienzo), empezando arriba. */
const RING = NUCLEO.map((_, k) => {
  const a = (-90 + k * 60) * (Math.PI / 180);
  return { x: 50 + 38 * Math.cos(a), y: 50 + 38 * Math.sin(a) };
});

/**
 * Escena 06 · El núcleo D.A.L.A. Abre con una diapositiva breve (qué es
 * D.A.L.A., en una frase) y después el anillo: los seis componentes del
 * ciclo, con el mismo vocabulario de la misión El ciclo. Abrir cada uno es
 * opcional y en cualquier orden: cada apertura es una exploración voluntaria
 * que queda registrada con el texto exacto que la persona vio.
 */
@Component({
  selector: 'synapxix-nucleo',
  standalone: true,
  imports: [BrandIconComponent],
  template: `
    @if (!inRing()) {
      <div class="act2 dalaIntro">
        <p class="eyebrow"><b>D.A.L.A.</b> · DYNAMIC ADAPTIVE LEARNING ARCHITECTURE</p>
        <h2>{{ intro.title }}</h2>
        <p class="dalaClaim">{{ intro.claim }}</p>
        <ol class="dalaSteps">
          @for (st of intro.steps; track st.label; let i = $index) {
            <li>
              <span class="pieceIcon"><synapxix-icon [name]="st.icon" /></span>
              <b>{{ i + 1 }}. {{ st.label }}</b>
              <span>{{ st.text }}</span>
            </li>
          }
        </ol>
        <button class="btn primary" (click)="enterRing()">ENTRAR AL NÚCLEO →</button>
      </div>
    } @else {
      <div class="act2">
        <p class="eyebrow"><b>D.A.L.A.</b> · DYNAMIC ADAPTIVE LEARNING ARCHITECTURE</p>
        <h2>Convierte decisiones en comprensión.</h2>

        <div class="nucleoGrid">
          <div class="ringStage">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle class="ringPath" cx="50" cy="50" r="38" />
              @for (p of ring; track $index; let k = $index) {
                @if (opened().includes(nodes[k].id)) {
                  <circle class="ringLit" [attr.cx]="p.x" [attr.cy]="p.y" r="9" />
                }
              }
            </svg>
            <div class="ringCore"><b>D.A.L.A.</b><span>{{ opened().length }} / {{ nodes.length }}</span></div>
            @for (n of nodes; track n.id; let k = $index) {
              <button
                class="ringNode"
                [class.open]="opened().includes(n.id)"
                [class.now]="current()?.id === n.id"
                [style.left.%]="ring[k].x"
                [style.top.%]="ring[k].y"
                (click)="open(n.id)"
              >
                <i>{{ k + 1 }}</i><span>{{ n.label }}</span>
              </button>
            }
          </div>

          <div class="nucleoSide">
            @if (current(); as n) {
              <div class="chainCard" [attr.data-step]="n.id">
                <p class="chainText">{{ n.text }}</p>
                <p class="chainAlt">{{ n.example }}</p>
              </div>
            } @else {
              <p class="beatNote">Tocá un componente. Abrí los que quieras, en el orden que quieras.</p>
            }

            <div class="rules">
              @for (r of rules; track r) {
                <span>{{ r }}</span>
              }
            </div>
            <button class="btn primary" (click)="done.emit()">PONERLO A PRUEBA →</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class NucleoComponent {
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly intro = DALA_INTRO;
  readonly nodes = NUCLEO;
  readonly ring = RING;
  readonly rules = DALA_RULES;
  readonly inRing = signal(false);
  readonly opened = signal<string[]>([]);
  private readonly showing = signal<string | null>(null);
  readonly current = computed(() => NUCLEO.find((n) => n.id === this.showing()) ?? null);

  /** Los componentes se ofrecen al entrar al anillo: ahí empieza la oportunidad. */
  enterRing() {
    this.inRing.set(true);
    for (const n of NUCLEO) this.observe.emit({ type: 'exploration_offered', opportunity: this.opp(n.id) });
    this.ui.tone(620);
  }

  open(id: string) {
    this.showing.set(id);
    if (this.opened().includes(id)) return;
    this.opened.update((o) => [...o, id]);
    const n = NUCLEO.find((x) => x.id === id)!;
    // Qué vio exactamente: el microdesafío posterior se interpreta con esto.
    this.observe.emit({ type: 'exploration_opened', opportunity: this.opp(id), payload: { text: n.text, example: n.example } });
    this.ui.tone(480 + this.opened().length * 55);
  }

  private opp(id: string) {
    return { id: `${SCENE}:${id}`, kind: 'exploracion' };
  }
}
