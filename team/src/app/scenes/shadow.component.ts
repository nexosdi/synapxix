import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService, type ReviewResult, type ShadowDecision } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

type Verdict = 'approved' | 'edited' | 'rejected';

const VERDICT_LABEL: Record<Verdict, string> = {
  approved: 'aprobada',
  edited: 'cambiada por otra opción',
  rejected: 'rechazada',
};

export interface AssignedStep {
  decisionId: string;
  assigned: ReviewResult['assigned'];
  verdict: Verdict;
}

/**
 * Escena decisión · shadow mode. La recomendación sale del catálogo del
 * marco aplicado a la instantánea real de esta persona. Las razones están a
 * un toque (abrirlas es observable) y el veredicto humano decide qué
 * contenido se asigna: la máquina propone, la persona gobierna.
 */
@Component({
  selector: 'synapxix-shadow',
  standalone: true,
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">CIERRE / SHADOW MODE</span>
        <span class="chainNote">instantánea → decisión → veredicto → contenido → resultado</span>
      </aside>

      <div class="game">
        <p class="eyebrow"><b>DECISIÓN</b> · {{ decision()?.policyVersion ?? '…' }}</p>
        <h2 style="margin: 0; letter-spacing: -0.04em">La primera recomendación sobre ti.</h2>
        <p class="lead" style="margin: 14px 0 0">
          El sistema eligió un siguiente paso con lo que vio hasta ahora. Tú decides si se aplica.
        </p>

        @if (error()) {
          <div class="feedback bad" style="margin-top: 22px"><b>No pudimos calcularla.</b>{{ error() }}</div>
        } @else if (decision(); as d) {
          <div class="shadowBox">
            <article class="record dark">
              <span class="recordLabel">RECOMENDACIÓN D.A.L.A.</span>
              <h3>{{ d.label }}</h3>
              <p>{{ d.objective }}</p>
              @if (reasonsOpen()) {
                <div class="codeList">
                  @for (r of d.reasons; track $index) {
                    <div class="code">{{ r.explanation }}</div>
                  }
                  <div class="code">se comprobará así: {{ d.verification }}</div>
                  <div class="code">esperado antes de actuar: {{ d.expectedOutcome.description }}</div>
                  <div class="code">sin probabilidad: el modelo no está calibrado</div>
                </div>
              } @else {
                <button class="btn ghost" (click)="openReasons()">Ver las razones</button>
              }
            </article>

            <article class="record">
              <span class="recordLabel">TU VEREDICTO</span>
              <h3>¿Aplicamos este paso?</h3>
              <p>Tu revisión no borra la recomendación: queda registrada al lado, y decide qué viene después.</p>
              <div class="verdicts">
                <button class="verdict approve" [class.selected]="verdict() === 'approved'" (click)="setVerdict('approved')">Aprobar</button>
                <button class="verdict" [class.selected]="verdict() === 'edited'" (click)="setVerdict('edited')">Elegir otra</button>
                <button class="verdict reject" [class.selected]="verdict() === 'rejected'" (click)="setVerdict('rejected')">Rechazar</button>
              </div>
              @if (verdict() === 'edited') {
                <div class="altList">
                  @for (alt of d.alternatives; track alt.id) {
                    <button class="altOption" [class.selected]="chosen() === alt.id" (click)="chosen.set(alt.id)">
                      <strong>{{ alt.label }}</strong>
                      <small>Por qué no fue la primera: {{ alt.whyNot }}</small>
                    </button>
                  }
                </div>
              }
              @if (verdict() === 'rejected') {
                <p class="footNote">Si la rechazas, seguimos con el paso neutro: recoger más evidencia.</p>
              }
              <button class="btn primary wide" style="margin-top: 14px" [disabled]="!ready() || closing()" (click)="confirm()">
                {{ closing() ? 'REGISTRANDO…' : 'CONFIRMAR VEREDICTO →' }}
              </button>
            </article>
          </div>
        } @else {
          <div class="feedback" style="margin-top: 22px">
            <b>Calculando…</b>El motor está proyectando tus eventos y consultando el catálogo de decisiones.
          </div>
        }
      </div>
    </div>
  `,
})
export class ShadowComponent implements OnInit {
  private readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<AssignedStep>();

  readonly decision = signal<ShadowDecision | null>(null);
  readonly verdict = signal<Verdict | null>(null);
  readonly chosen = signal<string | null>(null);
  readonly reasonsOpen = signal(false);
  readonly closing = signal(false);
  readonly error = signal('');

  async ngOnInit() {
    try {
      // La decisión ve la sesión completa: todo lo pendiente entra antes.
      await this.session.flush();
      const d = await this.api.decide();
      this.decision.set(d);
      this.observe.emit({ type: 'recommendation_presented', opportunity: this.opp(d), payload: { selected: d.selected } });
    } catch {
      this.error.set('Revisa la conexión y vuelve a cargar: tus eventos siguen guardados.');
    }
  }

  ready() {
    const v = this.verdict();
    return v !== null && (v !== 'edited' || this.chosen() !== null);
  }

  openReasons() {
    const d = this.decision();
    if (!d || this.reasonsOpen()) return;
    this.reasonsOpen.set(true);
    this.observe.emit({ type: 'reasons_opened', opportunity: this.opp(d) });
  }

  setVerdict(v: Verdict) {
    this.verdict.set(v);
    if (v !== 'edited') this.chosen.set(null);
    this.ui.tone(650);
  }

  async confirm() {
    const d = this.decision();
    const verdict = this.verdict();
    if (!d || !verdict || !this.ready()) return;
    this.closing.set(true);
    const chosen = this.chosen() ?? undefined;
    this.observe.emit({
      type: 'recommendation_reviewed',
      opportunity: this.opp(d),
      payload: { verdict, verdictLabel: VERDICT_LABEL[verdict], ...(chosen ? { chosen } : {}) },
    });
    try {
      const result = await this.api.review(d.decisionId, verdict, chosen);
      this.done.emit({ decisionId: d.decisionId, assigned: result.assigned, verdict });
    } catch {
      this.ui.toast('No pudimos registrar el veredicto. Intenta de nuevo.');
    } finally {
      this.closing.set(false);
    }
  }

  private opp(d: ShadowDecision) {
    return { id: `decision:${d.decisionId}`, kind: 'recomendacion_ia' };
  }
}
