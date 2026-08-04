import { Component, computed, inject, signal } from '@angular/core';
import { PulseSessionService } from './services/pulse-session.service';
import type { PulseReport } from './services/pulse-api.service';
import { WelcomeComponent } from './scenes/welcome.component';
import { MissionComponent } from './scenes/mission.component';
import { GameCategorizationComponent } from './scenes/game-categorization.component';
import { GameTimelineComponent } from './scenes/game-timeline.component';
import { GameIntruderComponent } from './scenes/game-intruder.component';
import { CaseComponent } from './scenes/case.component';
import { DeclaredComponent } from './scenes/declared.component';
import { ReportComponent } from './scenes/report.component';
import { StarComponent } from './scenes/star.component';
import { OrbitalComponent } from './orbital.component';

const SCENE_NAMES = [
  'Entrada',
  'El sistema',
  'El mapa',
  'La cadena',
  'El detector',
  'El caso',
  'El acuerdo',
  'Tu pulso',
  'Tu estrella',
];

/**
 * Primer Pulso · Dentro del Sistema — cáscara de la experiencia.
 * Nueve escenas; cada reto es un instrumento D.A.L.A. real en su propia
 * sesión. El contador de señales muestra los eventos emitidos en vivo.
 */
@Component({
  selector: 'synapxix-root',
  standalone: true,
  imports: [
    WelcomeComponent,
    MissionComponent,
    GameCategorizationComponent,
    GameTimelineComponent,
    GameIntruderComponent,
    CaseComponent,
    DeclaredComponent,
    ReportComponent,
    StarComponent,
    OrbitalComponent,
  ],
  template: `
    <main class="experience-shell">
      <span class="ambient ambient-one"></span>
      <span class="ambient ambient-two"></span>

      <header class="topbar">
        <div class="brand">
          <img src="logo.png" alt="Synapxix" />
          <div>
            <b>Primer Pulso</b>
            <small>DENTRO DEL SISTEMA</small>
          </div>
        </div>
        <div class="progress-wrap">
          <div class="progress-meta">
            <span>ESCENA {{ scene() + 1 }} · <b>{{ sceneName() }}</b></span>
            <span>{{ progress() }}%</span>
          </div>
          <div class="progress-track"><i [style.width.%]="progress()"></i></div>
        </div>
        <div class="signal-count">
          <span class="live-dot"></span>
          <span><b>{{ session.emittedCount() }}</b> señales · D.A.L.A. en vivo</span>
        </div>
      </header>

      <section class="stage">
        @switch (scene()) {
          @case (0) {
            <synapxix-welcome (joined)="go(1)" />
          }
          @case (1) {
            <synapxix-mission (done)="entryChosen($event)" />
          }
          @case (2) {
            <synapxix-game-categorization (done)="go(3)" />
          }
          @case (3) {
            <synapxix-game-timeline (done)="go(4)" />
          }
          @case (4) {
            <synapxix-game-intruder (done)="go(5)" />
          }
          @case (5) {
            <synapxix-case (done)="go(6)" />
          }
          @case (6) {
            <synapxix-declared [entryMode]="entryMode()" (done)="go(7)" />
          }
          @case (7) {
            <synapxix-report (done)="reportReady($event)" />
          }
          @case (8) {
            <synapxix-star [report]="report()!" />
          }
        }
      </section>

      @if (session.pendingEvents() > 0) {
        <div class="sync-pill">⇅ {{ session.pendingEvents() }} señales por sincronizar</div>
      }
    </main>
  `,
})
export class AppComponent {
  readonly session = inject(PulseSessionService);

  readonly scene = signal(0);
  readonly entryMode = signal<'explore' | 'map' | 'story'>('explore');
  readonly report = signal<PulseReport | null>(null);
  readonly progress = computed(() => Math.round((this.scene() / (SCENE_NAMES.length - 1)) * 100));
  readonly sceneName = computed(() => SCENE_NAMES[this.scene()]);

  go(next: number) {
    this.scene.set(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  entryChosen(mode: 'explore' | 'map' | 'story') {
    this.entryMode.set(mode);
    this.go(2);
  }

  reportReady(report: PulseReport) {
    this.report.set(report);
    this.go(8);
  }
}
