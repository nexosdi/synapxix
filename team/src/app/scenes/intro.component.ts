import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { EN_UNA_FRASE, NAME_BEATS, NO_SOMOS, NOMBRE, POR_QUE, QUE_ES, QUE_ES_SINTESIS, TRAYECTORIA, TRAYECTORIA_CIERRE } from '../content';
import { UiService } from '../services/ui.service';
import { BrandIconComponent } from './brand-icon.component';

/** Vértices de un pentágono (en % del lienzo): la estrella de la marca. */
const NODES = Array.from({ length: 5 }, (_, k) => {
  const a = (-90 + k * 72) * (Math.PI / 180);
  return { x: 50 + 38 * Math.cos(a), y: 50 + 38 * Math.sin(a) };
});

/** Escena «¿por qué?»: cinco estudiantes y el camino que les llega. */
const KIDS = [70, 185, 300, 415, 530];
const FUTURE_TINTS = ['#1e90ff', '#0a4fbf', '#4aa8ff', '#1569d6', '#7cc0ff'];
const FUTURE_MARKS = ['star', 'circle', 'square', 'triangle', 'heart'];

const BEATS = 5;

/**
 * Acto I · Synapxix. Qué es, por qué existe y de dónde viene, en cuatro
 * escenas y un cierre; una idea fuerte y una interacción simple por escena,
 * en el lienzo del Manual de Marca. Cada escena cabe en la pantalla de un
 * computador sin desplazarse. Nada de esto se registra: todavía no hay
 * consentimiento, todo queda en esta pantalla.
 */
@Component({
  selector: 'synapxix-intro',
  standalone: true,
  imports: [BrandIconComponent],
  template: `
    <div class="act1">
      @switch (beat()) {
        @case (0) {
          <div class="beat split nameBeat">
            <div class="splitCopy">
              <h1 class="brandWord" [class.learned]="learned()">Synapxix</h1>
              <p class="beatAsk">{{ learned() ? nombre.learned : nombre.ask }}</p>
              @if (learned()) {
                @for (line of nombre.story; track line) {
                  <p class="storyLine">{{ line }}</p>
                }
                <p class="beatNote">{{ nombre.note }}</p>
                <button class="btn primary" (click)="next()">SEGUIR →</button>
              }
            </div>
            <div class="synapse" [class.done]="learned()">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                @for (l of lines(); track $index) {
                  <line [attr.x1]="l.x1" [attr.y1]="l.y1" [attr.x2]="l.x2" [attr.y2]="l.y2" />
                }
                @if (learned()) {
                  @for (l of starLines; track $index) {
                    <line class="starLine" [attr.x1]="l.x1" [attr.y1]="l.y1" [attr.x2]="l.x2" [attr.y2]="l.y2" />
                  }
                }
              </svg>
              @if (learned()) {
                <img class="synapseLogo" src="logo-isotipo.png" alt="Isotipo de Synapxix" />
              }
              @for (n of nodes; track $index; let k = $index) {
                <button
                  class="neuron"
                  [class.lit]="order().includes(k)"
                  [style.left.%]="n.x"
                  [style.top.%]="n.y"
                  [attr.aria-label]="order().includes(k) ? beats[order().indexOf(k)] : 'Punto ' + (k + 1)"
                  (click)="connect(k)"
                >
                  @if (order().includes(k)) {
                    <span class="beatWord" [class.below]="n.y > 50">{{ beats[order().indexOf(k)] }}</span>
                  }
                </button>
              }
            </div>
          </div>
        }

        @case (1) {
          <div class="beat wideBeat">
            <h2 class="beatTitle">¿Qué es Synapxix?</h2>
            <p class="beatNote">Tocá cada pieza.</p>
            <div class="pieces">
              @for (p of queEs; track p.id) {
                <button class="piece" [class.open]="opened().includes(p.id)" [attr.aria-expanded]="opened().includes(p.id)" (click)="open(p.id)">
                  <span class="pieceIcon"><synapxix-icon [name]="p.icon" /></span>
                  <b>{{ p.label }}</b>
                  @if (opened().includes(p.id)) {
                    <span class="pieceText">{{ p.text }}</span>
                  }
                </button>
              }
            </div>
            @if (opened().length === queEs.length) {
              <div class="synthesis">
                <p>{{ sintesis }}</p>
                <div class="notChips">
                  @for (n of noSomos; track n) {
                    <span>{{ n }}</span>
                  }
                </div>
              </div>
              <button class="btn primary" (click)="next()">SEGUIR →</button>
            }
          </div>
        }

        @case (2) {
          <div class="beat wideBeat">
            <h2 class="beatTitle">¿Por qué lo hacemos?</h2>
            <p class="beatNote wide">{{ porQue.intro }}</p>
            <div class="whyStage" [class.future]="side() === 'futuro'">
              <svg viewBox="0 0 600 270" role="img" [attr.aria-label]="side() === 'hoy' ? porQue.hoy.caption : porQue.futuro.caption">
                <!-- Hoy: una sola fuente, el mismo camino recto para todos -->
                <g class="today">
                  <rect x="250" y="14" width="100" height="46" rx="12" class="source" />
                  <path d="M285 28h30M285 37h30M285 46h20" class="sourceLines" />
                  @for (x of kids; track x) {
                    <path [attr.d]="'M300 60 L300 92 L' + x + ' 92 L' + x + ' 168'" class="pathToday" />
                  }
                </g>
                <!-- Lo que buscamos: un camino por estudiante, con evidencia en el trayecto -->
                <g class="future">
                  <path class="sourceStar" [attr.d]="sourceStar" />
                  @for (x of kids; track x; let i = $index) {
                    <path [attr.d]="futurePath(x, i)" class="pathFuture" [attr.stroke]="tints[i]" />
                    @for (t of [0.35, 0.65]; track t) {
                      <circle [attr.cx]="dotOn(x, i, t).x" [attr.cy]="dotOn(x, i, t).y" r="4" [attr.fill]="tints[i]" class="evidenceDot" />
                    }
                  }
                </g>
                @for (x of kids; track x; let i = $index) {
                  <g class="kid" [attr.transform]="'translate(' + x + ' 196)'">
                    <circle cy="-14" r="15" class="kidHead" [attr.fill]="side() === 'futuro' ? tints[i] : null" />
                    <path d="M-24 44 Q-24 8 0 8 Q24 8 24 44 Z" class="kidBody" [attr.fill]="side() === 'futuro' ? tints[i] : null" />
                    <path [attr.d]="mark(i)" class="kidMark" />
                  </g>
                }
              </svg>
              <div class="whyCaption">
                <div class="segmented big" role="tablist">
                  <button role="tab" [attr.aria-selected]="side() === 'hoy'" [class.selected]="side() === 'hoy'" (click)="setSide('hoy')">
                    {{ porQue.hoy.label }}
                  </button>
                  <button role="tab" [attr.aria-selected]="side() === 'futuro'" [class.selected]="side() === 'futuro'" (click)="setSide('futuro')">
                    {{ porQue.futuro.label }} →
                  </button>
                </div>
                <b>{{ side() === 'hoy' ? porQue.hoy.caption : porQue.futuro.caption }}</b>
                <ul>
                  @for (i of side() === 'hoy' ? porQue.hoy.items : porQue.futuro.items; track i) {
                    <li>{{ i }}</li>
                  }
                </ul>
              </div>
            </div>
            @if (sawFuture()) {
              <p class="beatAsk">{{ porQue.reveal }}</p>
              <button class="btn primary" (click)="next()">SEGUIR →</button>
            }
          </div>
        }

        @case (3) {
          <div class="beat">
            <h2 class="beatTitle">Nuestra trayectoria</h2>
            <p class="beatNote">Tocá cada hito, en el orden que quieras.</p>
            <ol class="route" aria-label="Trayectoria de Synapxix">
              @for (h of hitos; track h.id; let i = $index) {
                <li [class.seen]="visited().includes(h.id)" [class.now]="hito() === h.id">
                  <button (click)="visit(h.id)" [attr.aria-pressed]="hito() === h.id">
                    <span class="routeIcon"><synapxix-icon [name]="h.icon" /></span>
                    <span class="routeLabel">{{ i + 1 }}. {{ h.title }}</span>
                  </button>
                </li>
              }
            </ol>
            @if (currentHito(); as h) {
              <article class="hitoCard">
                <span class="routeIcon big"><synapxix-icon [name]="h.icon" /></span>
                <div>
                  <h3>{{ h.title }}</h3>
                  <p>{{ h.text }}</p>
                </div>
              </article>
            }
            @if (visited().length === hitos.length) {
              <p class="beatAsk">{{ trayectoriaCierre }}</p>
              <button class="btn primary" (click)="next()">SEGUIR →</button>
            }
          </div>
        }

        @case (4) {
          <div class="beat split closing">
            <img class="closingArt" src="ilustracion-estrella.png" alt="Una niña sostiene el isotipo de Synapxix con una sonrisa." />
            <div class="splitCopy">
              <small class="closingKicker">SYNAPXIX, EN UNA FRASE</small>
              <p class="closingText">{{ frase.text }}</p>
              <p class="beatNote">{{ frase.dala }}</p>
              <button class="btn primary" (click)="done.emit()">CONTINUAR →</button>
              <p class="beatNote soft">{{ frase.next }}</p>
            </div>
          </div>
        }
      }

      <div class="beatDots" aria-hidden="true">
        @for (b of beatList; track b) {
          <i [class.on]="beat() >= b"></i>
        }
      </div>
    </div>
  `,
})
export class IntroComponent {
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly nombre = NOMBRE;
  readonly beats = NAME_BEATS;
  readonly nodes = NODES;
  readonly queEs = QUE_ES;
  readonly sintesis = QUE_ES_SINTESIS;
  readonly noSomos = NO_SOMOS;
  readonly porQue = POR_QUE;
  readonly hitos = TRAYECTORIA;
  readonly trayectoriaCierre = TRAYECTORIA_CIERRE;
  readonly frase = EN_UNA_FRASE;
  readonly kids = KIDS;
  readonly tints = FUTURE_TINTS;
  readonly beatList = Array.from({ length: BEATS }, (_, i) => i);
  readonly beat = signal(0);

  // 1 · el nombre: la sinapsis de cinco puntos.
  readonly order = signal<number[]>([]);
  readonly learned = computed(() => this.order().length === NODES.length);
  readonly lines = computed(() => {
    const o = this.order();
    return o.slice(1).map((k, i) => ({ x1: NODES[o[i]].x, y1: NODES[o[i]].y, x2: NODES[k].x, y2: NODES[k].y }));
  });
  readonly starLines = NODES.map((n, k) => {
    const m = NODES[(k + 2) % 5];
    return { x1: n.x, y1: n.y, x2: m.x, y2: m.y };
  });

  // 2 · qué es.
  readonly opened = signal<string[]>([]);

  // 3 · por qué.
  readonly side = signal<'hoy' | 'futuro'>('hoy');
  readonly sawFuture = signal(false);
  readonly sourceStar = starPath(300, 38, 26, 11);

  // 4 · trayectoria.
  readonly hito = signal<string | null>(null);
  readonly visited = signal<string[]>([]);
  readonly currentHito = computed(() => TRAYECTORIA.find((h) => h.id === this.hito()) ?? null);

  connect(k: number) {
    if (this.order().includes(k)) return;
    this.order.update((o) => [...o, k]);
    this.ui.tone(440 + this.order().length * 70);
  }

  open(id: string) {
    if (this.opened().includes(id)) return;
    this.opened.update((o) => [...o, id]);
    this.ui.tone(520 + this.opened().length * 50);
  }

  setSide(side: 'hoy' | 'futuro') {
    this.side.set(side);
    if (side === 'futuro') this.sawFuture.set(true);
    this.ui.tone(side === 'futuro' ? 700 : 460);
  }

  /** Camino propio de cada estudiante: curva distinta desde la estrella. */
  futurePath(x: number, i: number) {
    const bend = [-70, 50, -40, 60, -55][i];
    return `M300 62 C ${300 + bend} 110, ${x - bend} 120, ${x} 168`;
  }

  /** Punto de evidencia sobre la curva (Bézier cúbica) en t. */
  dotOn(x: number, i: number, t: number) {
    const bend = [-70, 50, -40, 60, -55][i];
    const p = [
      [300, 62],
      [300 + bend, 110],
      [x - bend, 120],
      [x, 168],
    ];
    const u = 1 - t;
    const c = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return { x: c.reduce((s, k, j) => s + k * p[j][0], 0), y: c.reduce((s, k, j) => s + k * p[j][1], 0) };
  }

  /** Marca sobre el pecho: igual para todos hoy, propia en el futuro. */
  mark(i: number) {
    const shape = this.side() === 'futuro' ? FUTURE_MARKS[i] : 'circle';
    switch (shape) {
      case 'star':
        return starPath(0, 26, 8, 3.4);
      case 'square':
        return 'M-6 20h12v12h-12z';
      case 'triangle':
        return 'M0 18l8 14h-16z';
      case 'heart':
        return 'M0 32c-6-4-9-7-9-10a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-3 6-9 10z';
      default:
        return 'M-6 26a6 6 0 1 0 12 0a6 6 0 1 0-12 0';
    }
  }

  visit(id: string) {
    this.hito.set(id);
    if (!this.visited().includes(id)) this.visited.update((v) => [...v, id]);
    this.ui.tone(500 + this.visited().length * 60);
  }

  next() {
    this.beat.update((b) => b + 1);
    this.ui.tone(620);
  }
}

/** Estrella de 5 puntas con vértices suavizados (la del isotipo). */
function starPath(cx: number, cy: number, outer: number, inner: number) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const mid = (i: number) => {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % 10];
    return [(x1 + x2) / 2, (y1 + y2) / 2];
  };
  let d = `M ${mid(9)[0].toFixed(1)} ${mid(9)[1].toFixed(1)} `;
  for (let i = 0; i < 10; i++) {
    const [x, y] = pts[i];
    const [mx, my] = mid(i);
    d += `Q ${x.toFixed(1)} ${y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)} `;
  }
  return d + 'Z';
}
