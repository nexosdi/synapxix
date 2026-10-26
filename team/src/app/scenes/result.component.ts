import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { downloadJson } from '../download';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService, type PulseReport, type ReplayCheck } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { RetratoComponent, type ClaimVerdict } from './retrato.component';

/**
 * Escena retrato. Recalcula la instantánea desde el registro de eventos,
 * comprueba que el recálculo es reproducible y recoge la revisión de la
 * persona sobre cada afirmación (origen declarado: cambia el estado de
 * revisión, nunca el de evidencia).
 */
@Component({
  selector: 'synapxix-result',
  standalone: true,
  imports: [RetratoComponent],
  template: `
    @if (report(); as r) {
      <synapxix-retrato
        [report]="r"
        [replay]="replay()"
        [heading]="'Esto es lo que vimos, ' + session.memberName().split(' ')[0] + '.'"
        [reviewable]="true"
        [reviewed]="reviewed()"
        [traceLoader]="traceLoader"
        (review)="review($event.claimKey, $event.verdict)"
      />
      <div class="retratoActions">
        <button class="btn primary" [disabled]="refreshing()" (click)="refresh()">
          {{ refreshing() ? 'RECALCULANDO…' : 'RECALCULAR CON MIS REVISIONES ↻' }}
        </button>
        <button class="btn secondary" (click)="download()">DESCARGAR MIS DATOS SEUDÓNIMOS</button>
        <button class="btn ghost" (click)="restart()">NUEVA SESIÓN</button>
      </div>
      <p class="footNote retratoNote">
        Este retrato es una hipótesis de trabajo para esta experiencia. No sirve para seleccionar,
        clasificar ni comparar personas. Puedes pedir el retiro de tus datos cuando quieras.
      </p>
    } @else {
      <div class="feedback" style="margin-top: 40px">
        <b>{{ error() ? 'No pudimos cargar tu retrato.' : 'Proyectando tus eventos…' }}</b>
        {{ error() || 'El motor recorre el registro completo en orden canónico; el mismo registro siempre da el mismo retrato.' }}
      </div>
    }
  `,
})
export class ResultComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();

  readonly report = signal<PulseReport | null>(null);
  readonly replay = signal<ReplayCheck | null>(null);
  readonly reviewed = signal<Record<string, ClaimVerdict>>({});
  readonly refreshing = signal(false);
  readonly error = signal('');

  readonly traceLoader = (claimKey: string) => this.api.traceClaim(claimKey);

  async ngOnInit() {
    await this.load();
    void this.api.complete().catch(() => undefined);
  }

  review(claimKey: string, verdict: ClaimVerdict) {
    this.observe.emit({
      type: 'claim_reviewed',
      opportunity: { id: `retrato:${claimKey}`, kind: 'revision_afirmacion' },
      origin: 'reported',
      payload: { claimKey, verdict },
    });
    this.reviewed.update((prev) => ({ ...prev, [claimKey]: verdict }));
    this.ui.tone(650);
  }

  async refresh() {
    this.refreshing.set(true);
    try {
      await this.load();
      this.ui.toast('Nueva instantánea encadenada a la anterior.');
    } finally {
      this.refreshing.set(false);
    }
  }

  async download() {
    downloadJson(await this.api.exportOwn(), `dala-export-${this.session.subjectId()?.slice(0, 8)}.json`);
  }

  restart() {
    location.reload();
  }

  private async load() {
    try {
      await this.session.flush();
      this.report.set(await this.api.report());
      this.replay.set(null);
      this.replay.set(await this.api.replay());
    } catch {
      this.error.set('Revisa la conexión y vuelve a intentar: tus eventos siguen guardados.');
    }
  }
}
