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
 * Escena decisión · shadow mode. La IA sugiere por dónde empezar en el
 * equipo: una línea del laboratorio, elegida con reglas explícitas sobre la
 * instantánea real de esta persona. Las razones están a un toque (abrirlas
 * es observable) y el veredicto humano decide: la máquina propone, la
 * persona gobierna.
 */
@Component({
  selector: 'synapxix-shadow',
  standalone: true,
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">VIERNES / CIERRE DE LA SEMANA</span>
        <span class="chainNote">lo que contaste + lo que hiciste → sugerencia → tu veredicto</span>
      </aside>

      <div class="game">
        <p class="eyebrow"><b>LA IA PROPONE</b> · {{ decision()?.policyVersion ?? '…' }}</p>
        <h2 style="margin: 0; letter-spacing: -0.04em">¿Por dónde empezás en el equipo?</h2>
        <p class="lead" style="margin: 14px 0 0">
          Con lo que contaste y lo que hiciste esta semana, la IA sugiere una línea del laboratorio para tu primer mes. Vos decidís.
        </p>

        @if (error()) {
          <div class="feedback bad" style="margin-top: 22px"><b>No pudimos calcularla.</b>{{ error() }}</div>
        } @else if (decision(); as d) {
          <div class="shadowBox">
            <article class="record dark">
              <span class="recordLabel">SUGERENCIA PARA TU PRIMER MES</span>
              <h3>{{ d.label }}</h3>
              <p>{{ d.objective }}</p>
              @if (reasonsOpen()) {
                <div class="codeList">
                  @for (r of d.reasons; track $index) {
                    <div class="code">{{ r.explanation }}</div>
                  }
                  <div class="code">se comprobará así: {{ d.verification }}</div>
                  <div class="code">esperado antes de actuar: {{ d.expectedOutcome.description }}</div>
                  <div class="code">sin porcentajes: es una sugerencia, no una evaluación</div>
                </div>
              } @else {
                <button class="btn ghost" (click)="openReasons()">Ver por qué</button>
              }
            </article>

            <article class="record">
              <span class="recordLabel">TU VEREDICTO</span>
              <h3>¿Te sirve para empezar?</h3>
              <p>Tu respuesta no borra la sugerencia: queda registrada al lado, y es la que vale.</p>
              <div class="verdicts">
                <button class="verdict approve" [class.selected]="verdict() === 'approved'" (click)="setVerdict('approved')">Me sirve</button>
                <button class="verdict" [class.selected]="verdict() === 'edited'" (click)="setVerdict('edited')">Prefiero otra</button>
                <button class="verdict reject" [class.selected]="verdict() === 'rejected'" (click)="setVerdict('rejected')">No por ahora</button>
              </div>
              @if (verdict() === 'edited') {
                <div class="altList">
                  @for (alt of d.alternatives; track alt.id) {
                    <button class="altOption" [class.selected]="chosen() === alt.id" (click)="chosen.set(alt.id)">
                      <strong>{{ alt.label }}</strong>
                      <small>{{ alt.whyNot }}</small>
                    </button>
                  }
                </div>
              }
              @if (verdict() === 'rejected') {
                <p class="footNote">Si no te convence, el primer mes rotás por todas las líneas y lo charlamos al terminar.</p>
              }
              <button class="btn primary wide" style="margin-top: 14px" [disabled]="!ready() || closing()" (click)="confirm()">
                {{ closing() ? 'REGISTRANDO…' : 'CONFIRMAR →' }}
              </button>
            </article>
          </div>
        } @else {
          <div class="feedback" style="margin-top: 22px">
            <b>Pensando…</b>La IA está repasando lo que contaste y lo que hiciste esta semana.
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
      this.error.set('Revisá la conexión y volvé a cargar: tus eventos siguen guardados.');
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
      this.ui.toast('No pudimos registrar tu respuesta. Probá de nuevo.');
    } finally {
      this.closing.set(false);
    }
  }

  private opp(d: ShadowDecision) {
    return { id: `decision:${d.decisionId}`, kind: 'recomendacion_ia' };
  }
}
