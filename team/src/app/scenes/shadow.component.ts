import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { ACTION_LABELS } from '../content';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

interface ShadowDecision {
  decisionId: string;
  action: string;
  objective: string;
  reasons: Array<{ referenceId: string; explanation: string }>;
  confidence: number;
  policyVersion: string;
  expectedOutcome: { metric: string; probability: number } | null;
}

/**
 * Cierre / Shadow mode. La recomendación NO es teatro: sale de la política
 * determinista real (core-policy-0.1.0) sobre el estado estimado con la
 * evidencia de esta sesión. El veredicto humano queda en el DecisionRecord
 * y el outcome cierra el ciclo.
 */
@Component({
  selector: 'synapxix-shadow',
  standalone: true,
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">CIERRE / SHADOW MODE</span>
        <span class="chainNote">estado → candidato → decisión → veredicto → outcome</span>
      </aside>

      <div class="game">
        <p class="eyebrow"><b>DECISION RECORD</b> · POLÍTICA {{ decision()?.policyVersion ?? '…' }}</p>
        <h2 style="margin: 0; letter-spacing: -0.04em">Tu primera recomendación.</h2>
        <p class="lead" style="margin: 14px 0 0">
          La máquina propone; vos decidís. Calculada por el motor real con las señales de esta
          sesión — y con las explicaciones alternativas todavía abiertas.
        </p>

        @if (decision(); as d) {
          <div class="shadowBox">
            <article class="record dark">
              <span class="recordLabel">RECOMENDACIÓN D.A.L.A.</span>
              <h3>{{ actionLabel(d.action) }}</h3>
              <p>{{ d.reasons[0].explanation }}</p>
              <div class="codeList">
                <div class="code">
                  evidencia de sesión: {{ session.retryCount() }} reintentos ·
                  {{ session.hintCount() }} ayudas · cambio de enfoque
                  {{ session.shiftCount() > 0 ? 'sí' : 'no' }}
                </div>
                <div class="code">objetivo: {{ d.objective }} · confianza {{ pct(d.confidence) }}</div>
                <div class="code">restricción: no revelar respuesta ni atribuir rasgos</div>
                @if (d.expectedOutcome) {
                  <div class="code">
                    esperado ANTES de intervenir: {{ d.expectedOutcome.metric }}
                    ({{ pct(d.expectedOutcome.probability) }})
                  </div>
                }
              </div>
            </article>

            <article class="record">
              <span class="recordLabel">VEREDICTO HUMANO</span>
              <h3>¿Aplicarías esta decisión?</h3>
              <p>Tu revisión no borra la recomendación original. Añade una capa de gobernanza.</p>
              <div class="verdicts">
                <button class="verdict approve" [class.selected]="verdict() === 'approved'" (click)="setVerdict('approved')">Aprobar</button>
                <button class="verdict reject" [class.selected]="verdict() === 'rejected'" (click)="setVerdict('rejected')">Rechazar</button>
                <button class="verdict" [class.selected]="verdict() === 'ASK'" (click)="setVerdict('ASK')">Cambiar a ASK</button>
                <button class="verdict" [class.selected]="verdict() === 'CLARIFY'" (click)="setVerdict('CLARIFY')">Cambiar a CLARIFY</button>
              </div>
              <button class="btn primary wide" style="margin-top: 14px" [disabled]="!verdict() || closing()" (click)="closeLoop()">
                {{ closing() ? 'REGISTRANDO…' : 'CERRAR EL CICLO →' }}
              </button>
            </article>
          </div>
        } @else {
          <div class="feedback" style="margin-top: 22px">
            <b>Consultando la política…</b>El motor está congelando un snapshot de tu estado y
            eligiendo la acción con sus razones.
          </div>
        }
      </div>
    </div>
  `,
})
export class ShadowComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly decision = signal<ShadowDecision | null>(null);
  readonly verdict = signal<'approved' | 'rejected' | 'ASK' | 'CLARIFY' | ''>('');
  readonly closing = signal(false);

  async ngOnInit() {
    // Todo lo pendiente entra antes de decidir: la política ve la sesión completa.
    await this.session.flushAll();
    const d = await this.api.requestDecision();
    this.decision.set({
      decisionId: d.decision_id,
      action: d.selected_action,
      objective: d.objective,
      reasons: d.reasons,
      confidence: d.confidence,
      policyVersion: d.policy_version,
      expectedOutcome: d.expected_outcome,
    });
  }

  actionLabel(action: string) {
    return ACTION_LABELS[action] ?? action;
  }

  pct(x: number) {
    return `${Math.round(x * 100)}%`;
  }

  setVerdict(v: 'approved' | 'rejected' | 'ASK' | 'CLARIFY') {
    this.verdict.set(v);
    this.session.tone(650);
  }

  async closeLoop() {
    const decision = this.decision();
    const verdict = this.verdict();
    if (!decision || !verdict) return;
    this.closing.set(true);
    try {
      // "Cambiar a X" es el veredicto 'edited' del contrato, con la acción elegida.
      const mapped = verdict === 'approved' ? 'approved' : verdict === 'rejected' ? 'rejected' : 'edited';
      await this.api.review(decision.decisionId, mapped, mapped === 'edited' ? `prefer:${verdict}` : undefined);
      await this.api.recordOutcome(decision.decisionId, 'onboarding-web-v1', {
        completed: true,
        humanVerdict: verdict,
      });
      this.ui.toast('Decisión, veredicto y outcome quedaron en la traza.');
      this.done.emit();
    } finally {
      this.closing.set(false);
    }
  }
}
