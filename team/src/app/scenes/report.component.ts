import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ACTION_LABELS, CONSTRUCT_LABELS, STATUS_LABELS, UNKNOWNS } from '../content';
import { PulseApiService, type PulseReport } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { OrbitalComponent } from '../orbital.component';

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

interface TraceEvidence {
  observationId: string;
  constructId: string;
  rule: string;
  weight: number;
}

/**
 * Escena 7 — Tu Primer Pulso: el ciclo D.A.L.A. completo, en vivo, sobre vos.
 * Tres vistas (maestro: transparencia por rol): lo útil para vos, lo útil
 * para el equipo y cómo llegamos — con alternativas, límites y próxima
 * validación en cada lectura. Después: decisión shadow → tu veredicto →
 * outcome → traza.
 */
@Component({
  selector: 'synapxix-report',
  standalone: true,
  imports: [FormsModule, OrbitalComponent],
  template: `
    <div class="scene-panel">
      <div class="result-hero">
        <div>
          <span class="eyebrow">TU PULSO · CORREGIBLE · CONTEXTUAL</span>
          <h2>Esto leyó el sistema,<br /><em>{{ firstName() }}.</em></h2>
          <p>
            No es "quién sos" — es cómo jugaste acá, con la incertidumbre a la vista. Lo mismo
            que verá una docente sobre sus estudiantes.
          </p>
        </div>
        <div class="pulse-score">
          <synapxix-orbital [compact]="true" />
          <strong>{{ report()?.activity?.totalEvents ?? '—' }}</strong>
          <span>señales convertidas en evidencia</span>
          <small>confianza todavía inicial — así debe ser</small>
        </div>
      </div>

      @if (loading()) {
        <div class="feedback-banner info">Consultando tu estado en D.A.L.A.…</div>
      }

      @if (report(); as r) {
        <div class="result-tabs">
          <button [class.active]="view() === 'person'" (click)="view.set('person')">Lo útil para vos</button>
          <button [class.active]="view() === 'team'" (click)="view.set('team')">Lo útil para el equipo</button>
          <button [class.active]="view() === 'trace'" (click)="view.set('trace')">Cómo llegamos</button>
        </div>

        @if (view() === 'person') {
          <div class="result-content">
            <div class="person-grid">
              <div class="construct-list">
                @for (entry of constructEntries(); track entry.id) {
                  <div class="construct-row">
                    <div class="construct-head">
                      <span class="hs-tag">{{ entry.hs }} · {{ entry.hsLabel }}</span>
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
                    @if (entry.state.alternatives.length > 0) {
                      <details class="alt-details">
                        <summary>¿Qué más podría explicar esto?</summary>
                        <div class="alt-row">
                          {{ entry.state.alternatives.join(' ') }}
                          @if (entry.state.nextValidation) {
                            <br /><b>Se confirma o se cae:</b> {{ entry.state.nextValidation }}
                          }
                        </div>
                      </details>
                    }
                  </div>
                }
              </div>

              <div class="insight-stack">
                @if (r.rigor; as rigor) {
                  <article class="insight-card">
                    <span>RIGOR OBSERVACIONAL · EL CASO</span>
                    <h3>{{ percent(rigor.accuracy) }} de lecturas sin sobreinferir.</h3>
                    <p>{{ rigor.reading }}</p>
                  </article>
                }
                <article class="insight-card warm">
                  <span>LO QUE ESTA LECTURA NO ES</span>
                  <h3>Ni diagnóstico, ni ranking, ni predicción.</h3>
                  <p>
                    Cada barra es una hipótesis contextual con fecha de vencimiento. Si mañana
                    actuás distinto, el estado cambia — esa es la idea.
                  </p>
                </article>
                <article class="insight-card deep">
                  <span>TU PRIMERA MISIÓN</span>
                  <h3>Elegí una señal de tu pulso y ponela a prueba en trabajo real esta semana.</h3>
                  <p>
                    Declarás qué esperás que pase, lo hacés, y comparás. Acabás de recorrer el
                    ciclo que D.A.L.A. hace por cada estudiante.
                  </p>
                </article>
              </div>
            </div>
          </div>
        }

        @if (view() === 'team') {
          <div class="result-content">
            <div class="team-grid">
              <article>
                <span>ENTRADA DECLARADA</span>
                <h3>{{ entryLabel() }}</h3>
                <small>Cómo preferís conocer un sistema nuevo. Declarado por vos.</small>
              </article>
              <article>
                <span>RITMO DECLARADO</span>
                <h3>{{ shared() ? rhythmLabel() : 'Preferiste no compartirlo.' }}</h3>
                <small>Hipótesis para conversar, no asignación automática.</small>
              </article>
              <article>
                <span>FEEDBACK DECLARADO</span>
                <h3>{{ shared() ? feedbackLabel() : 'Preferiste no compartirlo.' }}</h3>
                <small>Debe verificarse en trabajo real, no asumirse.</small>
              </article>
              <article>
                <span>SUGERENCIA DE INTEGRACIÓN</span>
                <h3>{{ integrationHint() }}</h3>
                <small>Derivada de tu entrada declarada — corregible desde el día uno.</small>
              </article>
            </div>
            <div class="team-limit">
              <b>No usar para:</b>
              <span>selección</span><span>ranking</span><span>evaluación de desempeño</span><span>diagnóstico</span>
            </div>
          </div>
        }

        @if (view() === 'trace') {
          <div class="result-content">
            <div class="trace-chain">
              <div><span>01 · EVENTOS</span><strong>{{ r.activity.totalEvents }}</strong><p>interacciones inmutables en {{ r.activity.sessions }} sesiones</p></div>
              <i>→</i>
              <div><span>02 · EVIDENCIA</span><strong>{{ evidence().length }}</strong><p>observaciones derivadas por reglas versionadas</p></div>
              <i>→</i>
              <div><span>03 · ESTADO</span><strong>{{ constructEntries().length }}</strong><p>constructos con incertidumbre y vigencia</p></div>
              <i>→</i>
              <div><span>04 · DECISIÓN</span><strong>1</strong><p>recomendación shadow esperando tu veredicto</p></div>
            </div>
            <div class="trace-list">
              @for (row of evidenceSample(); track row.observationId) {
                <div>
                  <b>{{ constructName(row.constructId) }}</b>
                  <code>{{ row.rule }}</code>
                  <span class="weight" [class.neg]="row.weight < 0">{{ row.weight > 0 ? '+' : '' }}{{ row.weight }}</span>
                </div>
              }
            </div>
            <div class="unknowns">
              <b>Lo que todavía no sabemos — y no vamos a inventar</b>
              @for (unknown of unknowns; track unknown) {
                <p>· {{ unknown }}</p>
              }
            </div>
          </div>
        }
      }

      @if (decision(); as d) {
        <div class="decision-card">
          <span class="eyebrow">RECOMENDACIÓN EN SHADOW MODE · {{ d.policyVersion }}</span>
          <div class="decision-action">{{ actionLabel(d.selectedAction) }}</div>
          <p class="decision-meta">
            Objetivo: <b>{{ d.objective }}</b> · confianza {{ percent(d.confidence) }}
            @if (d.expectedOutcome) {
              · esperado: {{ d.expectedOutcome.metric }} ({{ percent(d.expectedOutcome.probability) }})
            }
          </p>
          @for (reason of d.reasons; track reason.type) {
            <div class="reason"><code>{{ reason.referenceId }}</code>{{ reason.explanation }}</div>
          }

          @if (!reviewed()) {
            <div class="shadow-note">
              <b>Nada se aplica solo.</b> La política recomendó; ahora decide un humano — y ese
              humano sos vos. Tu veredicto queda en la traza, junto a la decisión.
            </div>
            <div class="review-row">
              <input [(ngModel)]="reviewReason" placeholder="¿Por qué? (opcional, pero vale oro para calibrar)" />
              <button class="ghost" (click)="review('rejected')">Rechazar</button>
              <button class="primary" (click)="review('approved')">Aprobar</button>
            </div>
          } @else {
            <div class="shadow-note">
              <b>Veredicto registrado:</b> {{ verdict() === 'approved' ? 'aprobada' : 'rechazada' }}.
              Igual que hará una docente con cada recomendación sobre sus estudiantes.
            </div>
          }
        </div>
      }

      @if (reviewed() && !outcomeDone()) {
        <div class="case-board">
          <span class="eyebrow">CIERRE DEL CICLO · OUTCOME</span>
          <p class="scene-lead" style="margin-top: 12px; font-weight: 700; color: var(--px-ink)">
            Verificación mínima, sin pistas: ¿qué hace D.A.L.A. cuando no hay evidencia utilizable?
          </p>
          <div class="case-options">
            @for (option of verifyOptions; track option.id; let i = $index) {
              <button class="case-option" (click)="answerVerification(option.id)">
                <i>{{ ['A', 'B', 'C'][i] }}</i>{{ option.text }}
              </button>
            }
          </div>
          @if (verifyError()) {
            <div class="feedback-banner bad">Casi: pensalo desde la regla R0 — sin base, ninguna intervención se justifica.</div>
          }
        </div>
      }

      @if (outcomeDone()) {
        <div class="feedback-banner good">
          Outcome registrado: lo observado quedó al lado de lo esperado. El ciclo evidencia →
          estado → decisión → intervención → outcome se cerró — con vos adentro.
        </div>
        <div class="scene-actions">
          <span>traza {{ decision()?.decisionId?.slice(0, 8) }}… disponible para vos y para calibrar D.A.L.A.</span>
          <button class="primary" (click)="done.emit(report()!)">Mi Estrella Synapxix <span>→</span></button>
        </div>
      }
    </div>
  `,
})
export class ReportComponent implements OnInit {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);

  @Output() done = new EventEmitter<PulseReport>();

  readonly loading = signal(true);
  readonly report = signal<PulseReport | null>(null);
  readonly decision = signal<ShadowDecision | null>(null);
  readonly view = signal<'person' | 'team' | 'trace'>('person');
  readonly reviewed = signal(false);
  readonly verdict = signal<'approved' | 'rejected' | ''>('');
  readonly outcomeDone = signal(false);
  readonly verifyError = signal(false);
  readonly evidence = signal<TraceEvidence[]>([]);
  reviewReason = '';

  readonly unknowns = UNKNOWNS;
  readonly verifyOptions = [
    { id: 'intervene', text: 'Intervenir igual, con la mejor hipótesis disponible.' },
    { id: 'verify', text: 'Verificar: observar y juntar evidencia antes de intervenir.' },
    { id: 'llm', text: 'Pedirle al LLM que estime el estado con lo que haya.' },
  ];

  firstName() {
    return this.session.memberName().split(' ')[0] || 'pulso';
  }

  async ngOnInit() {
    // Drenar todo lo pendiente antes de leer: el reporte debe reflejar la
    // evidencia completa de la experiencia.
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
      this.evidence.set(trace.evidence);
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

  evidenceSample() {
    return this.evidence().slice(-10).reverse();
  }

  constructName(id: string) {
    return CONSTRUCT_LABELS[id]?.label ?? id;
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

  shared() {
    return this.report()?.declared?.shareConditions !== false;
  }

  entryLabel() {
    const entry = this.report()?.declared?.entryMode;
    return entry === 'map'
      ? 'Ver el mapa antes de decidir.'
      : entry === 'story'
        ? 'Escuchar el contexto antes de actuar.'
        : 'Explorar y aprender actuando.';
  }

  rhythmLabel() {
    const rhythm = this.report()?.declared?.workRhythm;
    return rhythm === 'align'
      ? 'Alinear antes de ejecutar.'
      : rhythm === 'hybrid'
        ? 'Mapa corto y acción.'
        : 'Probar algo pronto.';
  }

  feedbackLabel() {
    const mode = this.report()?.declared?.feedbackMode;
    return mode === 'questions'
      ? 'Mediante preguntas.'
      : mode === 'context'
        ? 'Con contexto e impacto.'
        : 'Directo y específico.';
  }

  integrationHint() {
    const entry = this.report()?.declared?.entryMode;
    return entry === 'map'
      ? 'Darle estructura y relaciones antes de pedirle decisiones.'
      : entry === 'story'
        ? 'Darle intención y porqué antes de abrir la acción.'
        : 'Reducir instrucciones y abrirle el sistema para aprender actuando.';
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
    if (optionId !== 'verify') {
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
