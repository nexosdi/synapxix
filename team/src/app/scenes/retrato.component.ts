import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import type { DalaClaim } from '@nexosdi.synapxix/dala/contracts';
import { EVENT_LABELS, EVIDENCE_STATUS, REVIEW_STATUS } from '../content';
import type { PulseReport, ReplayCheck, TraceResult } from '../services/pulse-api.service';

export type ClaimVerdict = 'si' | 'en_parte' | 'no';

const ORIGIN_LABEL: Record<string, string> = { observed: 'observado', reported: 'declarado' };
const SHORT: Record<string, string> = {
  conocimientos: 'Conocimientos',
  pensamiento: 'Pensamiento',
  autorregulacion: 'Autorregulación',
  interaccion: 'Interacción',
  intereses: 'Intereses',
  digital_ia: 'IA',
  contexto: 'Contexto',
};
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
        <p class="eyebrow"><b>TU MODELO DINÁMICO</b> · {{ report.snapshot.frameworkVersion }}</p>
        <h1>{{ heading }}</h1>
        <p class="lead">Lo que hiciste hoy, con su evidencia. Cambia cada vez que juegas.</p>
      </header>

      <div class="modelLayout">
        <div class="modelStar">
          <svg viewBox="-78 -20 556 440" role="group" aria-label="Tu modelo por ámbitos">
            @for (ring of [70, 112, 154]; track ring) {
              <circle class="ring" cx="200" cy="200" [attr.r]="ring" />
            }
            @for (r of rays(); track r.id) {
              <g
                class="ray"
                [class.selected]="selected() === r.id"
                [class.empty]="!r.nodes.length"
                tabindex="0"
                role="button"
                [attr.aria-label]="r.name + ': ' + r.nodes.length + (r.nodes.length === 1 ? ' afirmación' : ' afirmaciones')"
                [attr.aria-pressed]="selected() === r.id"
                (click)="select(r.id)"
                (keydown.enter)="select(r.id)"
                (keydown.space)="select(r.id); $event.preventDefault()"
              >
                <line class="hit" x1="200" y1="200" [attr.x2]="r.lx" [attr.y2]="r.ly" />
                <line class="spoke" [attr.x1]="r.x0" [attr.y1]="r.y0" [attr.x2]="r.x1" [attr.y2]="r.y1" />
                @for (n of r.nodes; track $index) {
                  <circle class="node s-{{ n.status }}" [attr.cx]="n.x" [attr.cy]="n.y" r="9" />
                }
                <text [attr.x]="r.lx" [attr.y]="r.ly" [attr.text-anchor]="r.anchor" dominant-baseline="middle">{{ r.short }}</text>
              </g>
            }
            <circle class="coreDisc" cx="200" cy="200" r="34" />
            <text class="coreInitial" x="200" y="201" text-anchor="middle" dominant-baseline="middle">{{ initial() }}</text>
          </svg>
          <div class="legend">
            <span><i class="key s-sin_oportunidad_suficiente"></i>falta evidencia</span>
            <span><i class="key s-hipotesis_provisional"></i>hipótesis</span>
            <span><i class="key s-respaldada_en_contexto"></i>respaldada</span>
          </div>
        </div>

        <aside class="gustosPanel">
          @if (interests(); as list) {
            <small>LO QUE DIJISTE QUE TE TIENTA</small>
            <ul class="interestList">
              @for (it of list; track it.label) {
                <li>
                  <span>{{ it.label }}</span>
                  <b class="ratio">
                    @for (d of [1, 2, 3]; track d) {
                      <i [class.on]="d <= it.n"></i>
                    }
                  </b>
                </li>
              }
            </ul>
          }
          @for (c of highlights(); track c.key) {
            <p class="highlight"><span class="origin">{{ origins(c) }}</span>{{ c.claim }}</p>
          }
          @if (cycle(); as c) {
            <div class="cycleMini">
              <small>LA IA PROPUSO</small>
              <b>{{ c.recommended }}</b>
              <span>{{ c.verdict }} · se aplicó {{ c.assigned }} · {{ c.result }}</span>
            </div>
          }
          <div class="replayBadge" [class.ok]="replay?.reproducible === true" [class.bad]="replay?.reproducible === false">
            @if (replay?.reproducible === true) {
              ✓ Recalculado desde {{ replay?.events }} eventos: idéntico
            } @else if (replay?.reproducible === false) {
              ✗ El recálculo no coincide
            } @else {
              … comprobando el recálculo
            }
          </div>
        </aside>
      </div>

      @for (ambito of shown(); track ambito.id) {
        <section class="ambito">
          <header class="ambitoHead">
            <small>ÁMBITO {{ pad(ambitoIndex(ambito.id) + 1) }}</small>
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
  @Input() name = '';
  @Input() reviewable = false;
  @Input() reviewed: Record<string, ClaimVerdict> = {};
  @Input({ required: true }) traceLoader!: (claimKey: string) => Promise<TraceResult>;
  @Output() review = new EventEmitter<{ claimKey: string; verdict: ClaimVerdict }>();

  readonly trace = signal<TraceResult | null>(null);
  /** Ámbito abierto en el detalle; por defecto, el primero con evidencia. */
  private readonly picked = signal<string | null>(null);
  readonly traceLoading = signal(false);
  readonly verdicts: Array<{ id: ClaimVerdict; label: string }> = [
    { id: 'si', label: 'Sí' },
    { id: 'en_parte', label: 'En parte' },
    { id: 'no', label: 'No' },
  ];

  selected() {
    const claims = this.claimsBy();
    return this.picked() ?? this.report.framework.ambitos.find((a) => claims.has(a.id))?.id ?? 'conocimientos';
  }

  select(id: string) {
    this.picked.set(id);
  }

  shown() {
    return this.report.framework.ambitos.filter((a) => a.id === this.selected());
  }

  ambitoIndex(id: string) {
    return this.report.framework.ambitos.findIndex((a) => a.id === id);
  }

  initial() {
    return (this.name || this.report.member.name || '·').trim().charAt(0).toUpperCase();
  }

  /** Geometría de la estrella: un rayo por ámbito, un nodo por afirmación. */
  rays() {
    const claims = this.claimsBy();
    const ambitos = this.report.framework.ambitos;
    return ambitos.map((a, i) => {
      const angle = ((-90 + (i * 360) / ambitos.length) * Math.PI) / 180;
      const at = (r: number) => ({ x: 200 + r * Math.cos(angle), y: 200 + r * Math.sin(angle) });
      const list = claims.get(a.id) ?? [];
      const nodes = list.map((c, j) => ({ ...at(70 + j * 28), status: c.evidenceStatus }));
      const [p0, p1, pl] = [at(40), at(Math.max(70, 70 + (list.length - 1) * 28)), at(186)];
      const cos = Math.cos(angle);
      return {
        id: a.id,
        name: a.name,
        short: SHORT[a.id] ?? a.name,
        nodes,
        x0: p0.x,
        y0: p0.y,
        x1: list.length ? p1.x : at(154).x,
        y1: list.length ? p1.y : at(154).y,
        lx: pl.x,
        ly: pl.y,
        anchor: Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end',
      };
    });
  }

  /** Familias de intereses declaradas, de la más elegida a la menos. */
  interests() {
    const c = this.report.snapshot.claims.find((x) => x.key === 'intereses_declarados');
    const ranking = String(c?.observation.detail['ranking'] ?? '');
    if (!ranking) return null;
    return ranking.split(',').map((r) => {
      const [label, n] = r.split(':');
      return { label, n: Number(n) };
    });
  }

  /** Lo que más dice de sus preferencias en acción. */
  highlights() {
    const keys = ['coherencia_declarado_observado', 'busqueda_de_desafio', 'exploracion_voluntaria'];
    return this.report.snapshot.claims.filter((c) => keys.includes(c.key) && c.observation.denominator > 0);
  }

  claimsBy() {
    const map = new Map<string, DalaClaim[]>();
    for (const c of this.report.snapshot.claims) {
      map.set(c.ambito, [...(map.get(c.ambito) ?? []), c]);
    }
    return map;
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
