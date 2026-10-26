import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { PULSO_WEB_FRAMEWORK } from '@nexosdi.synapxix/dala/framework';
import { PulseSessionService } from './services/pulse-session.service';
import { UiService } from './services/ui.service';
import { IntroComponent } from './scenes/intro.component';
import { EntryComponent } from './scenes/entry.component';
import { DalaIntroComponent } from './scenes/dala-intro.component';
import { GustosComponent } from './scenes/gustos.component';
import { MapaComponent } from './scenes/mapa.component';
import { MissionCategorizeComponent } from './scenes/mission-categorize.component';
import { MissionTimelineComponent } from './scenes/mission-timeline.component';
import { MissionIntruderComponent } from './scenes/mission-intruder.component';
import { ShadowComponent, type AssignedStep } from './scenes/shadow.component';
import { ContrastComponent } from './scenes/contrast.component';
import { ResultComponent } from './scenes/result.component';
import { InvestigacionComponent } from './scenes/investigacion.component';
import type { MissionScreen } from './content';
import { SCENE_OF_SCREEN } from './scene-observation';

const SCREENS = [
  'intro',
  'entry',
  'dala',
  'gustos',
  'mapa',
  'categorize',
  'timeline',
  'intruder',
  'shadow',
  'contrast',
  'result',
] as const;
type Screen = (typeof SCREENS)[number];

/** Los cuatro actos: Synapxix → D.A.L.A. → el juego → tu modelo. */
const ACTS = [
  { roman: 'I', label: 'Synapxix', screens: ['intro', 'entry'] },
  { roman: 'II', label: 'D.A.L.A.', screens: ['dala'] },
  { roman: 'III', label: 'El juego', screens: ['gustos', 'mapa', 'categorize', 'timeline', 'intruder', 'shadow', 'contrast'] },
  { roman: 'IV', label: 'Tu modelo', screens: ['result'] },
];

/**
 * Primer Pulso · piloto D.A.L.A. (marco pulso-web@0.1) — cáscara.
 * Las escenas son puras: emiten observaciones. Solo esta cáscara conoce el
 * puente: lo conecta a cada escena y marca la entrada y salida de escena.
 * Con ?investigacion abre la vista del equipo investigador.
 */
@Component({
  selector: 'synapxix-root',
  standalone: true,
  imports: [
    IntroComponent,
    EntryComponent,
    DalaIntroComponent,
    GustosComponent,
    MapaComponent,
    MissionCategorizeComponent,
    MissionTimelineComponent,
    MissionIntruderComponent,
    ShadowComponent,
    ContrastComponent,
    ResultComponent,
    InvestigacionComponent,
  ],
  template: `
    <div class="app">
      <div class="orb a"></div>
      <div class="orb b"></div>

      <header class="topbar">
        <div class="brand"><img src="logo-light.png" alt="" /><span>Synapxix</span></div>
        <div class="topright">
          <button class="sound" (click)="toggleSound()" aria-label="Activar o silenciar sonido">
            {{ ui.soundOn() ? '♪' : '×' }}
          </button>
          @if (session.emittedCount() > 0) {
            <div class="status">
              <i class="dot live"></i>
              <span>{{ session.emittedCount() }} SEÑALES</span>
            </div>
          }
        </div>
      </header>
      @if (!research) {
        <nav class="acts" aria-label="Actos de la experiencia">
          @for (a of acts; track a.roman; let i = $index) {
            <span [class.on]="i <= actIndex()" [class.now]="i === actIndex()" [attr.aria-current]="i === actIndex() ? 'step' : null">
              <b>{{ a.roman }}</b>{{ a.label }}
            </span>
          }
        </nav>
      }

      @if (research) {
        <section class="screen"><synapxix-investigacion /></section>
      } @else {
      @switch (screen()) {
        @case ('intro') {
          <section class="screen"><synapxix-intro (done)="go('entry')" /></section>
        }
        @case ('entry') {
          <section class="screen"><synapxix-entry (done)="go('dala')" /></section>
        }
        @case ('dala') {
          <section class="screen"><synapxix-dala-intro (done)="go('gustos')" /></section>
        }
        @case ('gustos') {
          <section class="screen"><synapxix-gustos (observe)="session.observe($event)" (done)="go('mapa')" /></section>
        }
        @case ('mapa') {
          <section class="screen">
            <synapxix-mapa [completed]="completed()" (observe)="session.observe($event)" (chosen)="go($event)" (finish)="go('shadow')" />
          </section>
        }
        @case ('categorize') {
          <section class="screen"><synapxix-mission-categorize (observe)="session.observe($event)" (done)="complete('categorize')" /></section>
        }
        @case ('timeline') {
          <section class="screen"><synapxix-mission-timeline (observe)="session.observe($event)" (done)="complete('timeline')" /></section>
        }
        @case ('intruder') {
          <section class="screen"><synapxix-mission-intruder (observe)="session.observe($event)" (done)="complete('intruder')" /></section>
        }
        @case ('shadow') {
          <section class="screen"><synapxix-shadow (observe)="session.observe($event)" (done)="assigned.set($event); go('contrast')" /></section>
        }
        @case ('contrast') {
          @if (assigned(); as step) {
            <section class="screen"><synapxix-contrast [step]="step" (observe)="session.observe($event)" (done)="go('result')" /></section>
          }
        }
        @case ('result') {
          <section class="screen"><synapxix-result (observe)="session.observe($event)" /></section>
        }
      }
      }

      <footer class="footer">
        <span>SYNAPXIX · PRIMER PULSO</span>
        <span>D.A.L.A. {{ frameworkVersion }}</span>
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

  readonly research = new URLSearchParams(location.search).has('investigacion');
  readonly frameworkVersion = PULSO_WEB_FRAMEWORK.version;
  readonly screen = signal<Screen>('intro');
  readonly assigned = signal<AssignedStep | null>(null);
  readonly completed = signal<MissionScreen[]>([]);
  readonly acts = ACTS;
  readonly actIndex = computed(() => ACTS.findIndex((a) => a.screens.includes(this.screen())));
  /** El puente arranca la sesión en la escena de gustos. */
  private currentScene = 'gustos';

  complete(mission: MissionScreen) {
    this.completed.update((c) => (c.includes(mission) ? c : [...c, mission]));
    this.go('mapa');
  }

  go(next: Screen) {
    const scene = SCENE_OF_SCREEN[next];
    if (scene && scene !== this.currentScene) {
      this.session.leaveScene();
      this.session.enterScene(scene);
      this.currentScene = scene;
    }
    this.screen.set(next);
    this.ui.tone(480 + SCREENS.indexOf(next) * 35);
    window.scrollTo({ top: 0 });
  }

  toggleSound() {
    this.ui.soundOn.update((s) => !s);
    this.ui.toast(this.ui.soundOn() ? 'Sonido activado' : 'Sonido silenciado');
    this.ui.tone();
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
