import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CONSTRUCT_META, STAR_META, STATUS_LABELS, UNKNOWNS } from '../content';
import { PulseApiService, type PulseReport } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

interface ModelRow {
  id: string;
  label: string;
  node: string;
  seen: string;
  directive: string;
  value: number;
  lower: number;
  upper: number;
  status: string;
  statusLabel: string;
  insufficient: boolean;
  evidenceCount: number;
  evidence: Array<{ rule: string; weight: number }>;
  alternatives: string[];
  nextValidation: string | null;
}

/**
 * Resultado — HumanState provisional, leído del motor real: intervalos de
 * incertidumbre, estado de validez, evidencia por regla, alternativas y
 * próxima validación. Con la revisión humana ("¿te representa?"), la
 * exportación seudónima y la Estrella generativa por dimensión dominante.
 */
@Component({
  selector: 'synapxix-result',
  standalone: true,
  template: `
    <div class="result">
      <div class="resultHero">
        <div>
          <p class="eyebrow">
            <b>HUMANSTATE · PROVISIONAL</b> · {{ report()?.subjectId?.slice(0, 8) ?? '…' }}
          </p>
          <h1>Esto no dice quién eres.<br /><em>Dice qué vimos hoy.</em></h1>
          <p class="lead">
            {{ firstName() }}, el modelo encontró señales sobre cómo resolviste estas tareas. No
            encontró una personalidad ni un rol definitivo: encontró conductas que necesitan ser
            replicadas en proyectos reales.
          </p>
          <div class="downloadRow">
            <button class="btn primary" (click)="download()">DESCARGAR DATOS SEUDÓNIMOS</button>
            <button class="btn secondary" (click)="restart()">NUEVA SESIÓN</button>
          </div>
        </div>
        <div class="constellation">
          <div class="personCore">{{ firstName().toUpperCase() }}<br />PULSO</div>
          @for (row of rows(); track row.id; let i = $index) {
            <div class="starNode sn{{ i + 1 }}">
              <span>
                <b>{{ row.insufficient ? '—' : pct(row.value) }}</b>
                {{ row.node }}
              </span>
            </div>
          }
        </div>
      </div>

      <div class="starLab">
        <div class="starLabCopy">
          <p class="eyebrow"><b>CONSTELACIÓN OPCIONAL</b> · SÍMBOLO PERSONAL</p>
          <h2>¿Quieres crear tu Estrella Synapxix?</h2>
          <p>
            La estrella no es una etiqueta ni un premio. Es una traducción visual y provisional
            de las señales de esta sesión: cambia su energía, órbitas y acentos según tu modelo
            dinámico.
          </p>
          <button class="btn primary" (click)="generateStar()">
            {{ starSvg() ? 'REGENERAR MI ESTRELLA ↻' : 'GENERAR MI ESTRELLA →' }}
          </button>
          <p class="starMeta">{{ starMeta() }}</p>
          <p class="starNote lead">Opcional · puedes continuar sin generarla. Su diseño no modifica tu HumanState.</p>
        </div>
        <div class="starStage" aria-live="polite">
          @if (starSvg(); as svg) {
            <div [innerHTML]="svg"></div>
            <div class="starLabel">{{ starLabel() }}</div>
          } @else {
            <div class="starPlaceholder">
              <div class="starGlyph">★</div>
              <span>Tu símbolo aparecerá aquí<br />cuando decidas activarlo.</span>
            </div>
          }
        </div>
      </div>

      <h2 class="sectionTitle">Lectura conductual inicial</h2>
      <div class="modelGrid">
        @for (row of rows(); track row.id) {
          <article class="modelCard">
            <div class="modelTop">
              <h3>{{ row.label }}</h3>
              <span class="validity" [class.insufficient]="row.insufficient">{{ row.statusLabel }}</span>
            </div>
            <div
              class="interval"
              [style.--lo]="row.lower * 100 + '%'"
              [style.--hi]="row.upper * 100 + '%'"
              [style.--est]="row.value * 100 + '%'"
            >
              <i></i>
            </div>
            <p class="statement">
              <b>Te vimos:</b> {{ row.seen }}.
              La estimación {{ row.insufficient ? 'no autoriza todavía una conclusión' : 'puede orientar una próxima prueba' }}.
            </p>
            <div class="evidenceList">
              @if (row.evidence.length === 0) {
                <div class="evidenceItem">Sin eventos discriminantes suficientes.</div>
              }
              @for (item of row.evidence; track $index) {
                <div class="evidenceItem">{{ item.rule }} · peso {{ item.weight > 0 ? '+' : '' }}{{ item.weight }}</div>
              }
            </div>
            @if (row.alternatives.length > 0) {
              <p class="statement" style="margin-top: 12px"><b>Alternativa abierta:</b> {{ row.alternatives[0] }}</p>
            }
            <div class="directive">
              <b>Directriz:</b> {{ row.directive }}<br />
              <b>Próxima validación:</b> {{ row.nextValidation ?? 'replicar en trabajo real.' }}
            </div>
          </article>
        }
      </div>

      <h2 class="sectionTitle">Lo que todavía no sabemos</h2>
      <div class="unknown">
        @for (item of unknowns; track item.tag) {
          <article>
            <small>{{ item.tag }}</small>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        }
      </div>

      <div class="reviewBox">
        <div>
          <h3>¿Esta lectura te representa?</h3>
          <p>Tu respuesta es revisión humana, no evidencia conductual.</p>
        </div>
        <div class="reviewActions">
          <button class="btn secondary" [class.chosen]="review() === 'yes'" (click)="setReview('yes')">Sí</button>
          <button class="btn secondary" [class.chosen]="review() === 'partial'" (click)="setReview('partial')">En parte</button>
          <button class="btn secondary" [class.chosen]="review() === 'no'" (click)="setReview('no')">No</button>
        </div>
      </div>
    </div>
  `,
})
export class ResultComponent implements OnInit {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly report = signal<PulseReport | null>(null);
  readonly evidence = signal<Array<{ constructId: string; rule: string; weight: number }>>([]);
  readonly review = signal<'yes' | 'partial' | 'no' | ''>('');
  readonly starSvg = signal<SafeHtml | null>(null);
  readonly starLabel = signal('');
  readonly starMeta = signal('');
  readonly unknowns = UNKNOWNS;

  readonly rows = computed<ModelRow[]>(() => {
    const report = this.report();
    if (!report) return [];
    const byConstruct = new Map<string, Array<{ rule: string; weight: number }>>();
    for (const item of this.evidence()) {
      const list = byConstruct.get(item.constructId) ?? [];
      if (list.length < 3) list.push({ rule: item.rule, weight: item.weight });
      byConstruct.set(item.constructId, list);
    }
    return Object.entries(CONSTRUCT_META).map(([id, meta]) => {
      const state = report.constructs[id];
      const insufficient = !state || state.status === 'insufficient_evidence';
      return {
        id,
        ...meta,
        value: state?.value ?? 0.5,
        lower: state?.uncertainty?.lower ?? 0.2,
        upper: state?.uncertainty?.upper ?? 0.8,
        status: state?.status ?? 'insufficient_evidence',
        statusLabel: STATUS_LABELS[state?.status ?? 'insufficient_evidence'] ?? state?.status ?? '',
        insufficient,
        evidenceCount: state?.evidenceCount ?? 0,
        evidence: byConstruct.get(id) ?? [],
        alternatives: state?.alternatives ?? [],
        nextValidation: state?.nextValidation ?? null,
      };
    });
  });

  async ngOnInit() {
    await this.session.flushAll();
    const report = await this.api.report();
    this.report.set(report);
    const lastDecision = report.decisions[0];
    if (lastDecision) {
      const trace = await this.api.trace(lastDecision.decisionId);
      this.evidence.set(trace.evidence);
    }
  }

  firstName() {
    return this.session.memberName().split(' ')[0] || 'pulso';
  }

  pct(x: number) {
    return `${Math.round(x * 100)}%`;
  }

  setReview(value: 'yes' | 'partial' | 'no') {
    this.review.set(value);
    void this.api.saveDeclared({ stateReview: value });
    this.ui.toast('Tu revisión quedó registrada sin alterar la evidencia.');
  }

  restart() {
    location.href = location.pathname;
  }

  async download() {
    const report = this.report();
    if (!report) return;
    const bundle = {
      schema: 'synapxix.pulse.export.v0.2',
      subject_id: report.subjectId,
      declared: report.declared,
      human_state: report.constructs,
      activity: report.activity,
      decisions: report.decisions,
      evidence: this.evidence(),
      optional_constellation: this.starLabel() || null,
      limits: [
        'not_a_personality_test',
        'single_session',
        'not_validated_for_decisions',
        'star_is_visual_translation_not_a_label',
      ],
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Synapxix_Pulso_${report.subjectId.slice(0, 8)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    this.ui.toast('Exportación seudónima preparada.');
  }

  /**
   * Estrella generativa: la dimensión dominante del modelo real define
   * nombre, acento y rotación; la secundaria, las órbitas. Vista narrativa —
   * jamás entra al motor.
   */
  generateStar() {
    const report = this.report();
    if (!report) return;
    const ranked = this.rows()
      .filter((row) => !row.insufficient)
      .sort((a, b) => b.value - a.value);
    const pool = ranked.length >= 2 ? ranked : this.rows();
    const primary = pool[0];
    const secondary = pool[1] ?? pool[0];
    const meta = STAR_META[primary.id];
    const metaSecondary = STAR_META[secondary.id];
    const rotation = -Math.PI / 2 + (secondary.value - primary.value) * 0.55;
    const orbitA = Math.round(92 + primary.value * 32);
    const orbitB = Math.round(56 + secondary.value * 24);

    const svg = `<svg class="synapxix-star" viewBox="0 0 360 360" role="img" aria-label="${meta.name}">
      <defs>
        <radialGradient id="starGlow"><stop offset="0" stop-color="${meta.accent}" stop-opacity=".55"/><stop offset="1" stop-color="${meta.accent}" stop-opacity="0"/></radialGradient>
      </defs>
      <circle cx="180" cy="180" r="145" fill="url(#starGlow)" opacity=".34"/>
      <ellipse class="orbitLine" cx="180" cy="180" rx="${orbitA}" ry="${orbitB}" stroke="${metaSecondary.accent}" stroke-width="2" opacity=".82" transform="rotate(${Math.round((primary.value - secondary.value) * 28)} 180 180)"/>
      <ellipse class="orbitLine alt" cx="180" cy="180" rx="${orbitB + 27}" ry="${orbitA - 17}" stroke="#a6e6ff" stroke-width="1.6" opacity=".72" transform="rotate(${Math.round((secondary.value + primary.value) * 70)} 180 180)"/>
      <polygon points="${this.starPoints(180, 180, 118, 52, rotation)}" fill="${meta.accent}" opacity=".2"/>
      <polygon points="${this.starPoints(180, 180, 96, 42, rotation)}" fill="#ffffff" stroke="${meta.accent}" stroke-width="7" stroke-linejoin="round"/>
      <circle class="spark" cx="309" cy="86" r="6" fill="#ffd93d"/>
      <circle class="spark" cx="54" cy="282" r="4" fill="#9be564"/>
      <circle cx="276" cy="285" r="4" fill="#ff7a89"/>
      <text x="180" y="184" text-anchor="middle" dominant-baseline="middle" fill="#0A2A54" font-size="15" font-family="ui-monospace,monospace" font-weight="800">${this.pct(primary.value)}</text>
    </svg>`;

    this.starSvg.set(this.sanitizer.bypassSecurityTrustHtml(svg));
    this.starLabel.set(`${meta.name} · ${meta.tag} · ${this.pct(primary.value)}`);
    this.starMeta.set(
      `${meta.name} · dimensión principal: ${meta.tag.toLowerCase()} · secundaria: ${metaSecondary.tag.toLowerCase()}`,
    );
    void this.api.complete(meta.name);
    this.session.tone(880);
  }

  private starPoints(cx: number, cy: number, outer: number, inner: number, rotation: number) {
    const points: string[] = [];
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = rotation + (i * Math.PI) / 5;
      points.push(`${(cx + Math.cos(angle) * radius).toFixed(1)},${(cy + Math.sin(angle) * radius).toFixed(1)}`);
    }
    return points.join(' ');
  }
}
