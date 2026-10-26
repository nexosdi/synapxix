import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import type { DalaClaim } from '@nexosdi.synapxix/dala/contracts';
import { EVENT_LABELS, EVIDENCE_STATUS, REVIEW_STATUS } from '../content';
import type { PulseReport, ReplayCheck, TraceResult } from '../services/pulse-api.service';

export type ClaimVerdict = 'si' | 'en_parte' | 'no';

const ORIGIN_LABEL: Record<string, string> = { observed: 'observado', reported: 'declarado' };
const CONTEXT_LABEL: Record<string, string> = {
  marco: 'Marco',
  sesiones: 'Sesiones',
  eventos: 'Eventos',
  minutos: 'Minutos',
  pausas: 'Pausas',
  dispositivo: 'Dispositivo',
};

/**
 * Retrato trazable (presentacional). Por ámbito: qué observamos, qué lo
 * sostiene (n de d, estado, origen y los eventos exactos), qué falta
 * comprobar y qué cambió respecto de la instantánea anterior. Sin
 * porcentajes, sin etiquetas, sin probabilidad: el modelo no está calibrado.
 */
@Component({
  selector: 'synapxix-retrato',
  standalone: true,
  template: `
    <div class="retrato">
      <header class="retratoHero">
        <p class="eyebrow">
          <b>RETRATO TRAZABLE</b> · {{ report.snapshot.frameworkVersion }} · {{ report.snapshot.engineVersion }}
        </p>
        <h1>Esto no dice quién eres.<br /><em>Dice qué hiciste hoy, y con cuánta evidencia.</em></h1>
        <p class="lead">
          {{ heading }} Cada afirmación se apoya en decisiones concretas tomadas en la experiencia, con
          su denominador: cuántas veces hubo oportunidad. Ninguna es un rasgo; todas se pueden recorrer
          hasta los eventos.
        </p>
        <div class="facts">
          @for (f of facts(); track f.label) {
            <div><strong>{{ f.value }}</strong><span>{{ f.label }}</span></div>
          }
        </div>
        <div class="replayBadge" [class.ok]="replay?.reproducible === true" [class.bad]="replay?.reproducible === false">
          @if (replay?.reproducible === true) {
            ✓ Reproducible: recalculado desde los {{ replay?.events }} eventos, mismo resultado.
          } @else if (replay?.reproducible === false) {
            ✗ El recálculo no coincide con la instantánea guardada. Revisar el motor.
          } @else {
            … Comprobando que el retrato se puede recalcular desde los eventos.
          }
        </div>
      </header>

      @if (cycle(); as c) {
        <section class="cycleStrip">
          <div><small>RECOMENDACIÓN</small><b>{{ c.recommended }}</b></div>
          <i>→</i>
          <div><small>VEREDICTO</small><b>{{ c.verdict }}</b></div>
          <i>→</i>
          <div><small>SE APLICÓ</small><b>{{ c.assigned }}</b></div>
          <i>→</i>
          <div><small>CONTRASTE</small><b>{{ c.result }}</b></div>
        </section>
      }

      @for (ambito of report.framework.ambitos; track ambito.id; let i = $index) {
        <section class="ambito">
          <header class="ambitoHead">
            <small>ÁMBITO {{ pad(i + 1) }}</small>
            <h2>{{ ambito.name }}</h2>
            <p>{{ ambito.question }}</p>
          </header>

          @if (claimsBy().get(ambito.id); as claims) {
            <div class="claimGrid">
              @for (c of claims; track c.key) {
                <article class="claimCard" [class.empty]="c.observation.denominator === 0">
                  <div class="claimTop">
                    <h3>{{ constructName(c) }}</h3>
                    <span class="evidence s-{{ c.evidenceStatus }}">{{ evidenceLabel(c) }}</span>
                  </div>
                  <p class="claimText">{{ c.claim }}</p>

                  @if (c.observation.denominator > 0) {
                    <div class="ratio" [attr.aria-label]="c.observation.numerator + ' de ' + c.observation.denominator">
                      @if (c.observation.denominator <= 12) {
                        @for (dot of dots(c); track $index) {
                          <i [class.on]="dot"></i>
                        }
                      }
                      <span>{{ c.observation.numerator }} de {{ c.observation.denominator }}</span>
                    </div>
                  }

                  <dl class="claimFacts">
                    @if (c.observation.denominator > 0) {
                      <div>
                        <dt>Qué lo sostiene</dt>
                        <dd>
                          {{ c.evidenceRefs.length }} eventos · origen {{ origins(c) }}
                          <button class="linkBtn" (click)="openTrace(c)">Ver evidencia →</button>
                        </dd>
                      </div>
                    }
                    <div><dt>Qué falta comprobar</dt><dd>{{ c.nextCheck }}</dd></div>
                    @if (c.change) {
                      <div><dt>Último cambio</dt><dd>{{ c.change }}</dd></div>
                    }
                  </dl>

                  <details class="more">
                    <summary>Otras explicaciones y límites</summary>
                    <ul>
                      @for (alt of c.alternatives; track alt) {
                        <li>{{ alt }}</li>
                      }
                    </ul>
                    <p><b>Límite:</b> {{ constructLimits(c) }}</p>
                    <p class="method">{{ c.methodRef }} · {{ c.constructRef }}</p>
                  </details>

                  @if (c.observation.denominator > 0) {
                    <div class="reviewRow">
                      @if (reviewable) {
                        <span>¿Te representa?</span>
                        <div class="reviewBtns">
                          @for (v of verdicts; track v.id) {
                            <button [class.selected]="reviewed[c.key] === v.id" (click)="review.emit({ claimKey: c.key, verdict: v.id })">
                              {{ v.label }}
                            </button>
                          }
                        </div>
                      } @else {
                        <span>Revisión de la persona: <b>{{ reviewLabel(c) }}</b></span>
                      }
                    </div>
                  }
                </article>
              }
            </div>
          } @else if (covered(ambito.id)) {
            <p class="coverageNote">{{ coverageNote(ambito.id) }}</p>
          } @else {
            <div class="uncovered">
              <b>Sin oportunidad en esta experiencia.</b>
              {{ coverageNote(ambito.id) }} Para observarlo haría falta: {{ ambito.withoutOpportunity }}
            </div>
          }

          @if (ambito.id === 'contexto') {
            <div class="contextStrip">
              @for (f of contextFacts(); track f.label) {
                <span><small>{{ f.label }}</small>{{ f.value }}</span>
              }
            </div>
          }
        </section>
      }
    </div>

    @if (trace(); as t) {
      <div class="modal" (click)="trace.set(null)">
        <div class="modalCard traceCard" (click)="$event.stopPropagation()">
          <p class="eyebrow"><b>EVIDENCIA</b> · {{ t.claim.key }}</p>
          <h3>{{ t.claim.claim }}</h3>
          <p class="traceMeta">
            {{ t.events.length }} eventos · instantánea {{ t.snapshotId.slice(0, 8) }} · {{ t.claim.methodRef }}
          </p>
          <ol class="traceList">
            @for (e of t.events; track e.eventId) {
              <li>
                <span class="tSec">+{{ e.seconds }} s</span>
                <span class="tScene">{{ e.scene }}</span>
                <span class="tType">{{ eventLabel(e.type) }}@if (e.origin === 'reported') {<em> · declarado</em>}</span>
                <span class="tDetail">{{ e.opportunity?.id ?? '' }} {{ payloadText(e.payload) }}</span>
              </li>
            }
          </ol>
          <div class="modalActions"><button class="btn secondary" (click)="trace.set(null)">Cerrar</button></div>
        </div>
      </div>
    }
    @if (traceLoading()) {
      <div class="toast show">Buscando los eventos…</div>
    }
  `,
})
export class RetratoComponent {
  @Input({ required: true }) report!: PulseReport;
  @Input() replay: ReplayCheck | null = null;
  @Input() heading = '';
  @Input() reviewable = false;
  @Input() reviewed: Record<string, ClaimVerdict> = {};
  @Input({ required: true }) traceLoader!: (claimKey: string) => Promise<TraceResult>;
  @Output() review = new EventEmitter<{ claimKey: string; verdict: ClaimVerdict }>();

  readonly trace = signal<TraceResult | null>(null);
  readonly traceLoading = signal(false);
  readonly verdicts: Array<{ id: ClaimVerdict; label: string }> = [
    { id: 'si', label: 'Sí' },
    { id: 'en_parte', label: 'En parte' },
    { id: 'no', label: 'No' },
  ];

  claimsBy() {
    const map = new Map<string, DalaClaim[]>();
    for (const c of this.report.snapshot.claims) {
      map.set(c.ambito, [...(map.get(c.ambito) ?? []), c]);
    }
    return map;
  }

  facts() {
    const snap = this.report.snapshot;
    const ctx = snap.context;
    return [
      { value: String(ctx['eventos'] ?? snap.eventRange.count), label: 'eventos' },
      { value: String(snap.claims.filter((c) => c.observation.denominator > 0).length), label: 'afirmaciones con evidencia' },
      { value: `${snap.coverage.filter((a) => a.observed).length} / ${snap.coverage.length}`, label: 'ámbitos con oportunidad' },
      { value: String(ctx['minutos'] ?? '—'), label: 'minutos' },
    ];
  }

  contextFacts() {
    return Object.entries(this.report.snapshot.context).map(([k, v]) => ({ label: CONTEXT_LABEL[k] ?? k, value: String(v) }));
  }

  /** El ciclo de hoy: recomendación → veredicto → contenido asignado → contraste. */
  cycle() {
    const d = this.report.decisions?.[0];
    if (!d) return null;
    const label = (id: string | undefined) => this.report.framework.decisions.find((x) => x.id === id)?.label ?? id ?? '—';
    const assignedId = /asignado:([\w-]+)/.exec(d.humanVerdictReason ?? '')?.[1];
    const verdicts: Record<string, string> = { approved: 'aprobada', edited: 'cambiada', rejected: 'rechazada' };
    const o = d.outcome;
    const result = !o
      ? 'pendiente'
      : o.omitida
        ? 'omitida'
        : o.independiente
          ? 'resuelta sin ayuda'
          : o.pista_usada
            ? 'resuelta con la pista'
            : 'resuelta tras reintentar';
    return {
      recommended: label(d.selectedAction),
      verdict: verdicts[d.humanVerdict ?? ''] ?? 'sin veredicto',
      assigned: assignedId ? label(assignedId) : '—',
      result,
    };
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  dots(c: DalaClaim) {
    const { numerator, denominator } = c.observation;
    return Array.from({ length: denominator }, (_, i) => i < numerator);
  }

  constructName(c: DalaClaim) {
    const id = c.constructRef.split('@')[0];
    const name = this.report.framework.constructs.find((k) => k.id === id)?.name ?? id;
    const skill = c.scope.skill ? this.report.framework.skills[c.scope.skill] : null;
    return skill ? `${name} · ${skill}` : name;
  }

  constructLimits(c: DalaClaim) {
    const id = c.constructRef.split('@')[0];
    return this.report.framework.constructs.find((k) => k.id === id)?.limits ?? '';
  }

  evidenceLabel(c: DalaClaim) {
    return EVIDENCE_STATUS[c.evidenceStatus] ?? c.evidenceStatus;
  }

  reviewLabel(c: DalaClaim) {
    return REVIEW_STATUS[c.reviewStatus] ?? c.reviewStatus;
  }

  origins(c: DalaClaim) {
    return c.origins.map((o) => ORIGIN_LABEL[o] ?? o).join(' + ');
  }

  covered(ambito: string) {
    return this.report.snapshot.coverage.find((a) => a.ambito === ambito)?.observed ?? false;
  }

  coverageNote(ambito: string) {
    return this.report.snapshot.coverage.find((a) => a.ambito === ambito)?.note ?? '';
  }

  eventLabel(type: string) {
    return EVENT_LABELS[type] ?? type;
  }

  payloadText(payload: Record<string, unknown>) {
    return Object.entries(payload)
      .filter(([, v]) => !Array.isArray(v))
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join(' · ');
  }

  async openTrace(c: DalaClaim) {
    this.traceLoading.set(true);
    try {
      this.trace.set(await this.traceLoader(c.key));
    } finally {
      this.traceLoading.set(false);
    }
  }
}
