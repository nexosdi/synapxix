import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { NAME_BEATS, PURPOSE, UNIQUE_PARTS } from '../content';
import { UiService } from '../services/ui.service';

interface Orbit {
  color: string;
  dots: Array<{ x: number; y: number; r: number }>;
}

/** Vértices de un pentágono (en % del lienzo): la estrella de la marca. */
const NODES = Array.from({ length: 5 }, (_, k) => {
  const a = (-90 + k * 72) * (Math.PI / 180);
  return { x: 50 + 36 * Math.cos(a), y: 50 + 36 * Math.sin(a) };
});

/**
 * Acto I · Synapxix. Antes de pedir nada, la marca se aprende jugando:
 * el nombre se arma conectando una sinapsis (Manual de Marca: "fue diseñado
 * para ser aprendido"), la singularidad se construye tocando, y el propósito
 * aparece al unir IA y juego. Nada de esto se registra: aún no hay
 * consentimiento.
 */
@Component({
  selector: 'synapxix-intro',
  standalone: true,
  template: `
    <div class="act1">
      @switch (beat()) {
        @case (0) {
          <div class="beat">
            <h1 class="brandWord" [class.learned]="learned()">Synapxix</h1>
            <p class="beatAsk">{{ learned() ? 'Así aprende un cerebro. Así se llama Synapxix.' : '¿Qué significa? Conecta los puntos.' }}</p>
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
                <img class="synapseLogo" src="logo-light.png" alt="Isotipo de Synapxix" />
              }
              @for (n of nodes; track $index; let k = $index) {
                <button
                  class="neuron"
                  [class.lit]="order().includes(k)"
                  [style.left.%]="n.x"
                  [style.top.%]="n.y"
                  [attr.aria-label]="'Punto ' + (k + 1)"
                  (click)="connect(k)"
                >
                  @if (order().includes(k)) {
                    <span class="beatWord" [class.below]="n.y > 50">{{ beats[order().indexOf(k)] }}</span>
                  }
                </button>
              }
            </div>
            @if (learned()) {
              <p class="beatNote">Fue diseñado para ser aprendido.</p>
              <button class="btn primary" (click)="next()">SEGUIR →</button>
            }
          </div>
        }

        @case (1) {
          <div class="beat">
            <p class="beatKicker">Cada persona es una combinación única de</p>
            <div class="uniqueStage" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                @for (o of orbits(); track $index) {
                  @for (d of o.dots; track $index) {
                    <circle class="orbitDot" [attr.cx]="d.x" [attr.cy]="d.y" [attr.r]="d.r" [attr.fill]="o.color" />
                  }
                }
                <path class="coreStar" [attr.d]="starPath" />
              </svg>
            </div>
            <div class="uniqueParts">
              @for (p of parts; track p.id) {
                <button class="partChip" [class.on]="added().includes(p.id)" [style.--c]="p.color" (click)="add(p.id)">
                  <i></i>{{ p.label }}
                </button>
              }
            </div>
            @if (added().length === parts.length) {
              <p class="beatAsk">…y nadie tiene la tuya.</p>
              <button class="btn primary" (click)="next()">SEGUIR →</button>
            }
          </div>
        }

        @case (2) {
          <div class="beat">
            @if (!fused()) {
              <p class="beatKicker">¿Qué pasa si unes</p>
              <div class="fuse">
                <button class="fuseChip" [class.on]="picked().includes('ia')" (click)="pick('ia')">Inteligencia artificial</button>
                <span class="fusePlus">+</span>
                <button class="fuseChip" [class.on]="picked().includes('juego')" (click)="pick('juego')">La magia del juego</button>
              </div>
              <p class="beatNote">Toca las dos.</p>
            } @else {
              <h2 class="fused">Experiencias que comprenden cómo aprende cada persona.</h2>
              <div class="purpose">
                <article><small>MISIÓN</small><p>{{ purpose.mission }}</p></article>
                <article><small>VISIÓN</small><p>{{ purpose.vision }}</p></article>
              </div>
              <button class="btn primary" (click)="done.emit()">ENTRAR AL NÚCLEO →</button>
            }
          </div>
        }
      }

      <div class="beatDots" aria-hidden="true">
        @for (b of [0, 1, 2]; track b) {
          <i [class.on]="beat() >= b"></i>
        }
      </div>
    </div>
  `,
})
export class IntroComponent {
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly beats = NAME_BEATS;
  readonly nodes = NODES;
  readonly parts = UNIQUE_PARTS;
  readonly purpose = PURPOSE;
  readonly beat = signal(0);

  // Paso 0: la sinapsis.
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

  // Paso 1: la combinación única.
  readonly added = signal<string[]>([]);
  readonly orbits = signal<Orbit[]>([]);
  readonly starPath = starPath(100, 100, 30, 14);

  // Paso 2: IA + juego.
  readonly picked = signal<string[]>([]);
  readonly fused = computed(() => this.picked().length === 2);

  connect(k: number) {
    if (this.order().includes(k)) return;
    this.order.update((o) => [...o, k]);
    this.ui.tone(440 + this.order().length * 70);
  }

  add(id: string) {
    if (this.added().includes(id)) return;
    const color = UNIQUE_PARTS.find((p) => p.id === id)!.color;
    // Cada toque deja una órbita distinta: depende del instante en que ocurre.
    const seed = performance.now();
    const ring = 52 + this.added().length * 20;
    const count = 3 + (Math.floor(seed) % 4);
    const dots = Array.from({ length: count }, (_, i) => {
      const a = (seed / 97 + (i * 2 * Math.PI) / count) % (2 * Math.PI);
      return { x: 100 + ring * Math.cos(a), y: 100 + ring * Math.sin(a), r: 3 + ((seed + i * 31) % 4) };
    });
    this.added.update((a) => [...a, id]);
    this.orbits.update((o) => [...o, { color, dots }]);
    this.ui.tone(520 + this.added().length * 60);
  }

  pick(id: string) {
    if (this.picked().includes(id)) return;
    this.picked.update((p) => [...p, id]);
    this.ui.tone(this.fused() ? 760 : 560);
  }

  next() {
    this.beat.update((b) => b + 1);
    this.ui.tone(620);
  }
}

/** Estrella de 5 puntas con vértices suavizados. */
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
