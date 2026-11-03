import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CICLO_SYNAPXIX } from '../content';
import { BrandIconComponent } from './brand-icon.component';

/**
 * El ciclo de Synapxix con D.A.L.A. al centro (referencia: «¿Cómo
 * modelamos el aprendizaje?»). Una señal recorre el ciclo paso a paso; tocar
 * una etapa la muestra y pausa el recorrido un momento. Coordenadas en el
 * mismo sistema que el SVG (100 × 68), así que tarjetas y flechas coinciden.
 */
@Component({
  selector: 'synapxix-ciclo',
  standalone: true,
  imports: [BrandIconComponent],
  template: `
    <figure class="cycle" aria-label="Ciclo de Synapxix">
      <div class="cycleStage">
        <svg viewBox="0 0 100 68" aria-hidden="true">
          <defs>
            <marker id="cycleArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.6" markerHeight="3.6" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" />
            </marker>
          </defs>
          @for (p of paths; track $index; let i = $index) {
            <path class="cycleLink" [class.on]="via() === i" [attr.d]="p" marker-end="url(#cycleArrow)" />
          }
          @if (signalPath(); as d) {
            @for (k of [tick()]; track k) {
              <circle r="1.4" class="cycleSignal">
                <animateMotion dur="1.2s" fill="freeze" [attr.path]="d" />
              </circle>
            }
          }
        </svg>
        @for (s of steps; track s.id; let i = $index) {
          <button
            class="cycleNode"
            [class.hub]="s.id === 'dala'"
            [class.on]="active() === i"
            [style.left.%]="s.x"
            [style.top.%]="(s.y / 68) * 100"
            (click)="pick(i)"
          >
            @if (s.id === 'dala') {
              <b>D.A.L.A.</b><small>Procesamiento IA</small>
            } @else {
              <span class="cycleIcon"><synapxix-icon [name]="s.icon" /></span>
              <span class="cycleLabel">{{ s.label }}</span>
            }
          </button>
        }
      </div>
      <figcaption class="cycleCaption" aria-live="polite">
        <b>{{ current().label }}</b> {{ current().text }}
      </figcaption>
    </figure>
  `,
})
export class CicloSynapxixComponent implements OnInit, OnDestroy {
  readonly steps = CICLO_SYNAPXIX;
  /** Flecha que llega a cada etapa (índice + 1): cuenta → experiencia → … */
  readonly paths = [
    'M25 10.5 L38 10.2',
    'M50 16 L50 26',
    'M58 34 L76 34',
    'M86 40 Q85 56 61 59',
    'M39 59 Q15 56 14 40',
    'M15 27 Q20 13 38 11.5',
  ];
  readonly active = signal(0);
  /** Cambia en cada paso para reiniciar la animación de la señal. */
  readonly tick = signal(0);
  readonly current = computed(() => this.steps[this.active()]);
  /** Flecha por la que llegó la señal a la etapa activa (−1 al empezar). */
  readonly via = signal(-1);
  readonly signalPath = computed(() => this.paths[this.via()] ?? null);

  private timer: ReturnType<typeof setInterval> | null = null;
  private pausedUntil = 0;

  ngOnInit() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.timer = setInterval(() => {
      if (Date.now() < this.pausedUntil) return;
      // Después de la cuenta, el ciclo da vueltas entre experiencia y contenido.
      this.go(this.active() === this.steps.length - 1 ? 1 : this.active() + 1);
    }, 2200);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  pick(i: number) {
    this.pausedUntil = Date.now() + 6000;
    this.go(i);
  }

  private go(i: number) {
    // De contenido personalizado se vuelve a la experiencia: el ciclo se cierra.
    const from = this.active();
    this.via.set(i === 0 ? -1 : from === this.steps.length - 1 && i === 1 ? this.paths.length - 1 : i - 1);
    this.active.set(i);
    this.tick.update((t) => t + 1);
  }
}
