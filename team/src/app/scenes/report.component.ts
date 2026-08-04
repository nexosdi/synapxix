import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ACTION_LABELS, CONSTRUCT_LABELS, STATUS_LABELS } from '../content';
import { PulseApiService, type PulseReport } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';

interface ShadowDecision {
  decisionId: string;
  objective: string;
  selectedAction: string;
  candidateActions: string[];
  reasons: Array<{ type: string; referenceId: string; explanation: string }>;
  confidence: number;
  policyVersion: string;
  expectedOutcome: { metric: string; probability: number } | null;
}

/**
 * Escena 6 — Mi Primer Pulso: el ciclo D.A.L.A. completo, en vivo, sobre vos.
 *
 * 1. Estado real (estimaciones con incertidumbre y estados de validez).
 * 2. Decisión shadow de la política determinista, con razones.
 * 3. VOS revisás la recomendación (shadow mode encarnado: humano decide).
 * 4. Micro-verificación → outcome observado vs. esperado.
 * 5. Traza: decisión → snapshot → evidencia → eventos.
 */
@Component({
  selector: 'synapxix-report',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="scene-panel">
      <span class="eyebrow">MODELO INICIAL · CORREGIBLE · CONTEXTUAL</span>
      <h2>Te vimos construir,<br /><em>{{ firstName() }}.</em></h2>
      <p class="scene-lead">
        No es “quién sos”: es lo que D.A.L.A. pudo leer de cómo actuaste acá, con su
        incertidumbre declarada. Exactamente lo mismo que verá una docente sobre sus estudiantes.
      </p>

      @if (loading()) {
        <div class="feedback-banner info">Consultando tu estado en D.A.L.A.…</div>
      }

      @if (report(); as r) {
        <div class="construct-list">
          @for (entry of constructEntries(); track entry.id) {
            <div class="construct-row">
              <div class="construct-head">
                <b>{{ entry.label }}</b>
                <small>{{ entry.hint }}</small>
                <span class="status-chip" [class]="entry.state.status">{{ statusLabel(entry.state.status) }}</span>
              </div>
              <div class="value-track">
                <i
                  class="uncertainty"
                  [style.left.%]="entry.state.uncertainty.lower * 100"
                  [style.width.%]="(entry.state.uncertainty.upper - entry.state.uncertainty.lower) * 100"
                ></i>
                <i class="value" [style.left.%]="entry.state.value * 100"></i>
              </div>
              <div class="construct-meta">
                valor {{ percent(entry.state.value) }} · confianza {{ percent(entry.state.confidence) }} ·
                {{ entry.state.evidenceCount }} observaciones · {{ entry.state.modelVersion }}
              </div>
            </div>
          }
        </div>

        <div class="trace-grid">
          <div class="trace-node"><strong>{{ r.activity.totalEvents }}</strong><span>eventos emitidos</span></div>
          <div class="trace-node"><strong>{{ r.activity.sessions }}</strong><span>sesiones D.A.L.A.</span></div>
          <div class="trace-node"><strong>{{ evidenceCount() }}</strong><span>observaciones de evidencia</span></div>
          <div class="trace-node"><strong>{{ r.activity.byType['hint_requested'] || 0 }}</strong><span>pistas pedidas</span></div>
        </div>
      }

      @if (decision(); as d) {
        <div class="decision-card">
          <span class="eyebrow">RECOMENDACIÓN EN SHADOW MODE · {{ d.policyVersion }}</span>
          <div class="decision-action">{{ actionLabel(d.selectedAction) }}</div>
          <p class="scene-lead" style="margin-bottom: 14px">
            Objetivo: <b>{{ d.objective }}</b> · confianza {{ percent(d.confidence) }}
            @if (d.expectedOutcome) {
              · resultado esperado: {{ d.expectedOutcome.metric }} ({{ percent(d.expectedOutcome.probability) }})
            }
          </p>
          @for (reason of d.reasons; track reason.type) {
            <div class="reason"><code>{{ reason.referenceId }}</code>{{ reason.explanation }}</div>
          }

          @if (!reviewed()) {
            <div class="result-note">
              <b>Nada se aplica solo.</b> La política recomendó; ahora decide un humano — y ese humano sos vos.
            </div>
            <div class="scene-actions" style="margin-top: 18px">
              <input
                style="flex: 1; min-width: 200px; font-family: var(--sx-font); border: 2px solid var(--sx-border); border-radius: var(--sx-radius-md); padding: 12px 16px"
                [(ngModel)]="reviewReason"
                placeholder="¿Por qué? (opcional pero valioso)"
              />
              <button class="btn btn-soft" (click)="review('rejected')">Rechazar</button>
              <button class="btn btn-primary" (click)="review('approved')">Aprobar</button>
            </div>
          } @else {
            <div class="feedback-banner" [class.good]="verdict() === 'approved'" [class.info]="verdict() !== 'approved'">
              Tu veredicto quedó registrado: {{ verdict() === 'approved' ? 'aprobada' : 'rechazada' }}. Quedó en la traza, junto a la decisión.
            </div>
          }
        </div>
      }

      @if (reviewed() && !outcomeDone()) {
        <div class="decision-card">
          <span class="eyebrow">CIERRE DEL CICLO · OUTCOME</span>
          <p class="scene-lead">Una verificación mínima, sin pistas: ¿qué hace D.A.L.A. cuando no hay evidencia utilizable?</p>
          <div class="intruder-grid">
            @for (option of verifyOptions; track option.id) {
              <button class="intruder-card" (click)="answerVerification(option.id)">{{ option.text }}</button>
            }
          </div>
          @if (verifyError()) {
            <div class="feedback-banner bad">Casi: pensalo desde la regla R0 de la política.</div>
          }
        </div>
      }

      @if (outcomeDone()) {
        <div class="feedback-banner good">
          Outcome registrado: lo observado quedó al lado de lo esperado. El ciclo evidencia → estado → decisión →
          intervención → outcome se cerró — con vos adentro.
        </div>
        <div class="scene-actions">
          <span class="scene-lead" style="font-size: 0.85rem">
            Traza {{ decision()?.decisionId?.slice(0, 8) }}… disponible: decisión → snapshot → evidencia → eventos.
          </span>
          <button class="btn btn-primary" (click)="done.emit(report()!)">Mi Estrella Synapxix →</button>
        </div>
      }
    </section>
  `,
})
export class ReportComponent implements OnInit {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<PulseReport>();

  readonly loading = signal(true);
  readonly report = signal<PulseReport | null>(null);
  readonly decision = signal<ShadowDecision | null>(null);
  readonly reviewed = signal(false);
  readonly verdict = signal<'approved' | 'rejected' | ''>('');
  readonly outcomeDone = signal(false);
  readonly verifyError = signal(false);
  readonly evidenceCount = signal(0);
  reviewReason = '';

  readonly verifyOptions = [
    { id: 'intervene', text: 'Intervenir igual, con la mejor hipótesis disponible.' },
    { id: 'verify', text: 'Verificar: observar y juntar evidencia antes de intervenir.' },
    { id: 'llm', text: 'Pedirle al LLM que estime el estado con lo que haya.' },
  ];

  firstName() {
    return this.session.memberName().split(' ')[0] || 'pulso';
  }

  async ngOnInit() {
    // Drenar todo lo pendiente antes de leer el estado: el reporte debe
    // reflejar la evidencia completa de la experiencia.
    await this.session.flushAll();
    try {
      const report = await this.api.report();
      this.report.set(report);
      const decision = await this.api.requestDecision();
      this.decision.set({
        decisionId: decision.decision_id,
        objective: decision.objective,
        selectedAction: decision.selected_action,
        candidateActions: decision.candidate_actions,
        reasons: decision.reasons,
        confidence: decision.confidence,
        policyVersion: decision.policy_version,
        expectedOutcome: decision.expected_outcome,
      });
      const trace = await this.api.trace(decision.decision_id);
      this.evidenceCount.set(trace.evidence.length);
    } finally {
      this.loading.set(false);
    }
  }

  constructEntries() {
    const report = this.report();
    if (!report) return [];
    return Object.entries(CONSTRUCT_LABELS)
      .filter(([id]) => report.constructs[id])
      .map(([id, meta]) => ({ id, ...meta, state: report.constructs[id] }));
  }

  statusLabel(status: string) {
    return STATUS_LABELS[status] ?? status;
  }

  actionLabel(action: string) {
    return ACTION_LABELS[action] ?? action;
  }

  percent(x: number) {
    return `${Math.round(x * 100)}%`;
  }

  async review(verdict: 'approved' | 'rejected') {
    const decision = this.decision();
    if (!decision) return;
    await this.api.review(decision.decisionId, verdict, this.reviewReason || undefined);
    this.verdict.set(verdict);
    this.reviewed.set(true);
  }

  async answerVerification(optionId: string) {
    const decision = this.decision();
    if (!decision) return;
    const correct = optionId === 'verify';
    if (!correct) {
      this.verifyError.set(true);
      return;
    }
    await this.api.recordOutcome(decision.decisionId, 'pulse-verification-v1', {
      completed: true,
      accuracy: this.verifyError() ? 0.5 : 1,
      attempts: this.verifyError() ? 2 : 1,
      transferSuccess: true,
    });
    this.outcomeDone.set(true);
  }
}
