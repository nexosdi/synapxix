import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { PulseSessionService } from './services/pulse-session.service';
import { UiService } from './services/ui.service';
import { EntryComponent } from './scenes/entry.component';
import { VisionComponent } from './scenes/vision.component';
import { PortalComponent } from './scenes/portal.component';
import { MissionCategorizeComponent } from './scenes/mission-categorize.component';
import { MissionTimelineComponent } from './scenes/mission-timeline.component';
import { MissionIntruderComponent } from './scenes/mission-intruder.component';
import { ShadowComponent } from './scenes/shadow.component';
import { ResultComponent } from './scenes/result.component';

const SCREENS = ['entry', 'vision', 'portal', 'categorize', 'timeline', 'intruder', 'shadow', 'result'] as const;
type Screen = (typeof SCREENS)[number];

/**
 * Primer Pulso · onboarding web — cáscara de la experiencia.
 * Implementa el flujo del diseño de experiencia conectado al motor
 * D.A.L.A. real: cada misión es un instrumento con sesión propia y el
 * modelo dinámico de la persona se persiste en el servidor.
 */
@Component({
  selector: 'synapxix-root',
  standalone: true,
  imports: [
    EntryComponent,
    VisionComponent,
    PortalComponent,
    MissionCategorizeComponent,
    MissionTimelineComponent,
    MissionIntruderComponent,
    ShadowComponent,
    ResultComponent,
  ],
  template: `
    <div class="app">
      <div class="orb a"></div>
      <div class="orb b"></div>

      <header class="topbar">
        <div class="brand"><img src="logo-light.png" alt="" /><span>Synapxix</span></div>
        <div class="topright">
          <button class="sound" (click)="toggleSound()" aria-label="Activar o silenciar sonido">
            {{ session.soundOn() ? '♪' : '×' }}
          </button>
          <div class="status">
            <i class="dot" [class.live]="screen() !== 'entry'"></i>
            <span>{{ statusText() }}</span>
          </div>
        </div>
      </header>
      <div class="progress"><i [style.width.%]="progress()"></i></div>

      @switch (screen()) {
        @case ('entry') {
          <section class="screen"><synapxix-entry (done)="go('vision')" /></section>
        }
        @case ('vision') {
          <section class="screen"><synapxix-vision (done)="go('portal')" /></section>
        }
        @case ('portal') {
          <section class="screen"><synapxix-portal (done)="go('categorize')" /></section>
        }
        @case ('categorize') {
          <section class="screen"><synapxix-mission-categorize (done)="go('timeline')" /></section>
        }
        @case ('timeline') {
          <section class="screen"><synapxix-mission-timeline (done)="go('intruder')" /></section>
        }
        @case ('intruder') {
          <section class="screen"><synapxix-mission-intruder (done)="go('shadow')" /></section>
        }
        @case ('shadow') {
          <section class="screen"><synapxix-shadow (done)="go('result')" /></section>
        }
        @case ('result') {
          <section class="screen"><synapxix-result /></section>
        }
      }

      <footer class="footer">
        <span>v0.3 · PILOTO ADULTOS 21–36</span>
        <span>EVENTO → EVIDENCIA → ESTADO → DECISIÓN → OUTCOME</span>
      </footer>

      @if (session.pendingEvents() > 0) {
        <div class="syncPill">⇅ {{ session.pendingEvents() }} SEÑALES POR SINCRONIZAR</div>
      }

      <div class="toast" [class.show]="ui.toastVisible()">{{ ui.toastText() }}</div>

      @if (ui.modal(); as m) {
        <div class="modal" (click)="ui.closeModal()">
          <div class="modalCard" (click)="$event.stopPropagation()">
            <h3>{{ m.title }}</h3>
            <p>{{ m.text }}</p>
            @if (m.list?.length) {
              <ul>
                @for (item of m.list; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            }
            @if (m.observes) {
              <p class="observes"><b>QUÉ OBSERVA D.A.L.A. AQUÍ</b>{{ m.observes }}</p>
            }
            <div class="modalActions">
              <button class="btn secondary" (click)="ui.closeModal()">Cerrar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AppComponent implements OnDestroy {
  readonly session = inject(PulseSessionService);
  readonly ui = inject(UiService);

  /** Parallax: el puntero inclina la escena. Decoración pura, desactivable. */
  private parallaxFrame = 0;
  private readonly stillness = matchMedia('(prefers-reduced-motion: reduce)');

  readonly screen = signal<Screen>('entry');
  readonly progress = computed(() => (SCREENS.indexOf(this.screen()) / (SCREENS.length - 1)) * 100);
  readonly statusText = computed(() =>
    this.screen() === 'entry'
      ? 'NÚCLEO EN ESPERA'
      : this.screen() === 'result'
        ? 'MODELO PROVISIONAL'
        : `NÚCLEO ACTIVO · ${this.session.emittedCount()} SEÑALES`,
  );

  go(next: Screen) {
    this.screen.set(next);
    this.session.tone(480 + SCREENS.indexOf(next) * 35);
    window.scrollTo({ top: 0 });
  }

  toggleSound() {
    this.session.soundOn.update((s) => !s);
    this.ui.toast(this.session.soundOn() ? 'Sonido activado' : 'Sonido silenciado');
    this.session.tone();
  }

  /**
   * El pulso se inclina más que la tarjeta de misión: lo ambiental puede
   * moverse, lo que se lee tiene que quedarse quieto.
   */
  @HostListener('window:pointermove', ['$event'])
  tilt(event: PointerEvent) {
    if (this.stillness.matches) return;
    cancelAnimationFrame(this.parallaxFrame);
    this.parallaxFrame = requestAnimationFrame(() => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      this.setTilt((-y * 7).toFixed(2), (x * 8).toFixed(2), (-y * 1.6).toFixed(2), (x * 2.2).toFixed(2));
    });
  }

  @HostListener('window:pointerleave')
  levelOut() {
    cancelAnimationFrame(this.parallaxFrame);
    this.setTilt('0', '0', '0', '0');
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.parallaxFrame);
  }

  private setTilt(rx: string, ry: string, gx: string, gy: string) {
    const root = document.documentElement.style;
    root.setProperty('--rx', `${rx}deg`);
    root.setProperty('--ry', `${ry}deg`);
    root.setProperty('--gx', `${gx}deg`);
    root.setProperty('--gy', `${gy}deg`);
  }
}
