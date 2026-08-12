import { Component, computed, inject, signal } from '@angular/core';
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
        <div class="brand"><img src="logo.png" alt="" /><span>Synapxix</span></div>
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
        <span>v0.2 · PILOTO ADULTOS 21–36</span>
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
            <div class="modalActions">
              <button class="btn secondary" (click)="ui.closeModal()">Cerrar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AppComponent {
  readonly session = inject(PulseSessionService);
  readonly ui = inject(UiService);

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
}
