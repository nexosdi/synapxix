import { Component, computed, inject, signal } from '@angular/core';
import { PulseSessionService } from './services/pulse-session.service';
import type { PulseReport } from './services/pulse-api.service';
import { WelcomeComponent } from './scenes/welcome.component';
import { MissionComponent } from './scenes/mission.component';
import { GameCategorizationComponent } from './scenes/game-categorization.component';
import { GameTimelineComponent } from './scenes/game-timeline.component';
import { GameIntruderComponent } from './scenes/game-intruder.component';
import { DeclaredComponent } from './scenes/declared.component';
import { ReportComponent } from './scenes/report.component';
import { StarComponent } from './scenes/star.component';

/**
 * Primer Pulso — cáscara de la experiencia.
 * Ocho escenas lineales; cada reto es un instrumento D.A.L.A. real que corre
 * en su propia sesión. El pill de sincronización muestra la cola offline.
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
    DeclaredComponent,
    ReportComponent,
    StarComponent,
  ],
  template: `
    <main class="pulse-shell">
      <header class="pulse-header">
        <img src="logo.png" alt="Synapxix" />
        <div class="pulse-title">
          Primer Pulso
          <small>onboarding del equipo · conectado a D.A.L.A.</small>
        </div>
        <div class="pulse-progress">
          <div class="progress-track"><i [style.width.%]="progress()"></i></div>
          {{ progress() }}%
        </div>
      </header>

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
          <synapxix-declared [entryMode]="entryMode()" (done)="go(6)" />
        }
        @case (6) {
          <synapxix-report (done)="reportReady($event)" />
        }
        @case (7) {
          <synapxix-star [report]="report()!" />
        }
      }

      @if (session.pendingEvents() > 0) {
        <div class="sync-pill">⇅ {{ session.pendingEvents() }} eventos por sincronizar</div>
      }
    </main>
  `,
})
export class AppComponent {
  readonly session = inject(PulseSessionService);

  readonly scene = signal(0);
  readonly entryMode = signal<'explore' | 'map' | 'story'>('explore');
  readonly report = signal<PulseReport | null>(null);
  readonly progress = computed(() => Math.round((this.scene() / 7) * 100));

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
    this.go(7);
  }
}
