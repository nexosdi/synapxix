import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { PULSO_WEB_FRAMEWORK } from '@nexosdi.synapxix/dala/framework';
import { PulseSessionService } from './services/pulse-session.service';
import { UiService } from './services/ui.service';
import { IntroComponent } from './scenes/intro.component';
import { EntryComponent } from './scenes/entry.component';
import { NucleoComponent } from './scenes/nucleo.component';
import { CasoComponent } from './scenes/caso.component';
import { FuentesComponent } from './scenes/fuentes.component';
import { InstantaneaComponent } from './scenes/instantanea.component';
import { SemanaComponent } from './scenes/semana.component';
import { SuperpoderesComponent } from './scenes/superpoderes.component';
import { MotivacionesComponent } from './scenes/motivaciones.component';
import { DesafioComponent, type DesafioChoice } from './scenes/desafio.component';
import { RetoComponent } from './scenes/reto.component';
import { EquipoComponent } from './scenes/equipo.component';
import { TrabajoComponent } from './scenes/trabajo.component';
import { CvComponent } from './scenes/cv.component';
import { ShadowComponent } from './scenes/shadow.component';
import { ResultComponent } from './scenes/result.component';
import { InvestigacionComponent } from './scenes/investigacion.component';
import { DESAFIOS, type DayId } from './content';
import { SCENE_OF_SCREEN } from './scene-observation';

const SCREENS = [
  'intro',
  'entry',
  'nucleo',
  'caso',
  'fuentes',
  'instantanea',
  'semana',
  'superpoderes',
  'motivaciones',
  'desafio',
  'reto',
  'equipo',
  'trabajo',
  'shadow',
  'cv',
  'result',
] as const;
type Screen = (typeof SCREENS)[number];

/**
 * Synapxix → bienvenida → aprender D.A.L.A. → tu primera semana → tu
 * modelo. El registro empieza en el acto III, tras el consentimiento.
 */
const ACTS = [
  { roman: 'I', label: 'Synapxix', screens: ['intro'] },
  { roman: 'II', label: 'Bienvenida', screens: ['entry'] },
  { roman: 'III', label: 'D.A.L.A.', screens: ['nucleo', 'caso', 'fuentes', 'instantanea'] },
  { roman: 'IV', label: 'Tu primera semana', screens: ['semana', 'superpoderes', 'motivaciones', 'desafio', 'reto', 'equipo', 'trabajo', 'shadow'] },
  { roman: 'V', label: 'Tu modelo', screens: ['cv', 'result'] },
];

/**
 * Primer Pulso · piloto D.A.L.A. (marco pulso-web@0.4) — cáscara.
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
    NucleoComponent,
    CasoComponent,
    FuentesComponent,
    InstantaneaComponent,
    SemanaComponent,
    SuperpoderesComponent,
    MotivacionesComponent,
    DesafioComponent,
    RetoComponent,
    EquipoComponent,
    TrabajoComponent,
    CvComponent,
    ShadowComponent,
    ResultComponent,
    InvestigacionComponent,
  ],
  template: `
    <div class="app">
      <div class="orb a"></div>
      <div class="orb b"></div>

      <header class="topbar">
        <div class="brand"><img src="logo-wordmark.png" alt="Synapxix" /></div>
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
          <section class="screen"><synapxix-entry (done)="go('nucleo')" /></section>
        }
        @case ('nucleo') {
          <section class="screen"><synapxix-nucleo (observe)="session.observe($event)" (done)="go('caso')" /></section>
        }
        @case ('caso') {
          <section class="screen"><synapxix-caso (observe)="session.observe($event)" (done)="go('fuentes')" /></section>
        }
        @case ('fuentes') {
          <section class="screen"><synapxix-fuentes (observe)="session.observe($event)" (done)="go('instantanea')" /></section>
        }
        @case ('instantanea') {
          <section class="screen"><synapxix-instantanea (observe)="session.observe($event)" (done)="go('semana')" /></section>
        }
        @case ('semana') {
          <section class="screen"><synapxix-semana [done]="completed()" (chosen)="go($event)" (finish)="go('shadow')" /></section>
        }
        @case ('superpoderes') {
          <section class="screen"><synapxix-superpoderes (observe)="session.observe($event)" (done)="complete('superpoderes')" /></section>
        }
        @case ('motivaciones') {
          <section class="screen"><synapxix-motivaciones (observe)="session.observe($event)" (done)="complete('motivaciones')" /></section>
        }
        @case ('desafio') {
          <section class="screen"><synapxix-desafio (observe)="session.observe($event)" (begin)="startReto($event)" /></section>
        }
        @case ('reto') {
          @if (reto(); as r) {
            <section class="screen"><synapxix-reto [desafio]="r.id" [mode]="r.mode" (observe)="session.observe($event)" (done)="complete('desafio')" /></section>
          }
        }
        @case ('equipo') {
          <section class="screen"><synapxix-equipo (observe)="session.observe($event)" (done)="complete('equipo')" /></section>
        }
        @case ('trabajo') {
          <section class="screen"><synapxix-trabajo (observe)="session.observe($event)" (done)="complete('trabajo')" /></section>
        }
        @case ('shadow') {
          <section class="screen"><synapxix-shadow (observe)="session.observe($event)" (done)="go('cv')" /></section>
        }
        @case ('cv') {
          <section class="screen"><synapxix-cv (done)="go('result')" /></section>
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
              <p class="observes"><b>QUÉ OBSERVA D.A.L.A. ACÁ</b>{{ m.observes }}</p>
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
  readonly reto = signal<DesafioChoice | null>(null);
  readonly completed = signal<DayId[]>([]);
  readonly acts = ACTS;
  readonly actIndex = computed(() => ACTS.findIndex((a) => a.screens.includes(this.screen())));
  /** El puente arranca la sesión en el núcleo, justo después del consentimiento. */
  private currentScene = 'nucleo';


  complete(day: DayId) {
    this.completed.update((c) => (c.includes(day) ? c : [...c, day]));
    this.go('semana');
  }

  /** El desafío elegido define la escena: cada uno es una habilidad distinta. */
  startReto(choice: DesafioChoice) {
    this.reto.set(choice);
    this.go('reto', DESAFIOS.find((d) => d.id === choice.id)?.scene);
  }

  go(next: Screen, sceneOverride?: string) {
    const scene = sceneOverride ?? SCENE_OF_SCREEN[next];
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
