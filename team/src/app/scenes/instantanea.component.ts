import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import type { DalaClaim } from '@nexosdi.synapxix/dala/contracts';
import { EVENT_LABELS, EVIDENCE_STATUS } from '../content';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService, type PulseReport } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

const TASK = { id: 'instantanea:exagerada', kind: 'tarea' };
const DISAGREE = { id: 'instantanea:desacuerdo', kind: 'declaracion' };

/** Afirmaciones que se prefieren para el juego de la frase exagerada. */
const PREFERRED = ['exploracion_voluntaria', 'desempeno_independiente:clasificar_fuentes', 'autocorreccion_previa'];

interface Statement {
  id: string;
  text: string;
  exaggerated: boolean;
}

type Phase = 'loading' | 'answering' | 'failed' | 'shown';

/** Cada afirmación, dicha como un hecho breve para la conclusión de arriba. */
const FACT: Record<string, (n: number, d: number) => string> = {
  exploracion_voluntaria: (n, d) =>
    n === 0
      ? `fuiste directo a las tareas sin abrir lo opcional (0 de ${d})`
      : n === d
        ? `abriste todo lo opcional que se te ofreció (${d} de ${d})`
        : `abriste ${n} de ${d} contenidos opcionales`,
  persistencia_tras_error: (n, d) => `cuando te equivocaste, seguiste hasta resolver en ${n} de ${d}`,
  busqueda_de_ayuda: (n, d) => `pediste ayuda después de intentar en ${n} de ${d} tareas difíciles`,
  autocorreccion_previa: (n, d) => `revisaste tu respuesta antes de enviarla en ${n} de ${d} envíos`,
};

/**
 * Escena 09 · Tu primera instantánea (A). Se congela al terminar de aprender
 * D.A.L.A. y es la referencia contra la que el retrato final muestra qué
 * cambió con las misiones. Primero un juego: entre dos frases del motor y
 * una que etiqueta, encontrar la que dice demasiado. Después, lo observado,
 * lo que todavía no se sabe y la opción de decir "esto no dice quién soy".
 */
@Component({
  selector: 'synapxix-instantanea',
  standalone: true,
  template: `
    <div class="micro snapshotA">
      <p class="eyebrow"><b>INSTANTÁNEA A</b> · LO QUE D.A.L.A. VIO HASTA AQUÍ</p>

      @if (phase() === 'loading') {
        <div class="feedback"><b>Congelando tu primera instantánea…</b>El motor recorre lo que hiciste desde que empezó el registro.</div>
      } @else if (phase() === 'answering' || phase() === 'failed') {
        <h2 class="quizAsk">Una de estas frases no salió del motor. ¿Cuál dice más de lo que sabemos?</h2>
        <div class="readings" role="radiogroup">
          @for (s of statements(); track s.id) {
            <button class="reading" role="radio" [attr.aria-checked]="selected() === s.id" [class.on]="selected() === s.id" (click)="select(s.id)">
              {{ s.text }}
            </button>
          }
        </div>
        @if (phase() === 'failed') {
          <div class="feedback bad">
            <b>Esa sí la escribió el motor.</b>Tiene números y un lugar. Busca la que no.
            <div class="feedbackActions"><button class="btn ghost" (click)="skip()">Omitir →</button></div>
          </div>
        } @else {
          <div class="microActions">
            <button class="btn primary" [disabled]="!selected()" (click)="check()">COMPROBAR</button>
          </div>
        }
      } @else {
        <h2 class="quizAsk">Este retrato no define quién sos.</h2>
        @if (conclusion(); as line) {
          <p class="snapConclusion"><small>EN POCAS PALABRAS</small>{{ line }}</p>
        }

        <ul class="snapList cols">
          @for (c of observed(); track c.key) {
            <li>
              <span class="evidence s-{{ c.evidenceStatus }}">{{ status(c) }}</span>
              <p>{{ c.claim }}</p>
              <button class="linkBtn" (click)="trace(c)">Ver de dónde sale →</button>
            </li>
          }
        </ul>

        @if (unknown().length) {
          <div class="uncovered">
            <b>Todavía no sabemos nada de:</b>{{ unknown().join(' · ') }}.
          </div>
        }

        <div class="microActions">
          <button class="btn ghost" [class.on]="disagreed()" [disabled]="disagreed()" (click)="disagree()">
            {{ disagreed() ? 'Anotado. Al final revisás cada frase' : 'Esto no dice quién soy' }}
          </button>
          <button class="btn primary" (click)="done.emit()">A MI PRIMERA SEMANA →</button>
        </div>
      }
    </div>
  `,
})
export class InstantaneaComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();
  @Output() done = new EventEmitter<void>();

  readonly report = signal<PulseReport | null>(null);
  readonly phase = signal<Phase>('loading');
  readonly selected = signal<string | null>(null);
  readonly disagreed = signal(false);
  private attempt = 0;

  readonly observed = computed(() => (this.report()?.snapshot.claims ?? []).filter((c) => c.observation.denominator > 0));

  readonly unknown = computed(() => {
    const r = this.report();
    if (!r) return [];
    const uncovered = new Set<string>(r.snapshot.coverage.filter((c) => !c.observed).map((c) => c.ambito));
    return r.framework.ambitos.filter((a) => uncovered.has(a.id)).map((a) => a.name);
  });

  /**
   * Conclusión mínima: el desempeño (todas las habilidades sumadas) y los dos
   * hechos con más evidencia, en segunda persona. Reglas fijas sobre la
   * instantánea, sin IA libre: mismo registro, misma frase.
   */
  readonly conclusion = computed(() => {
    const claims = this.observed();
    const tasks = claims.filter((c) => c.key.startsWith('desempeno_independiente:'));
    const n = tasks.reduce((a, c) => a + c.observation.numerator, 0);
    const d = tasks.reduce((a, c) => a + c.observation.denominator, 0);
    const facts: string[] = [];
    if (d > 0) facts.push(`resolviste ${n} de ${d} tareas sin ayuda y al primer intento`);
    const extra = claims
      .filter((c) => FACT[c.key])
      .sort((a, b) => b.observation.denominator - a.observation.denominator)
      .slice(0, 2)
      .map((c) => FACT[c.key](c.observation.numerator, c.observation.denominator));
    facts.push(...extra);
    if (!facts.length) return null;
    const last = facts.pop()!;
    return `Hasta aquí, ${facts.length ? facts.join(', ') + ' y ' : ''}${last}.`;
  });

  /** Dos frases reales del motor y una que convierte un dato en etiqueta. */
  readonly statements = computed<Statement[]>(() => {
    const claims = this.observed();
    const real = [
      ...PREFERRED.map((k) => claims.find((c) => c.key === k)).filter((c): c is DalaClaim => !!c),
      ...claims.filter((c) => !PREFERRED.includes(c.key)),
    ].slice(0, 2);
    const exploration = claims.find((c) => c.key === 'exploracion_voluntaria')?.observation;
    const curious = exploration ? exploration.numerator * 2 >= exploration.denominator : true;
    const label: Statement = {
      id: 'etiqueta',
      text: curious ? 'Es una persona curiosa por naturaleza.' : 'No le interesa profundizar en lo que aprende.',
      exaggerated: true,
    };
    const list = real.map((c) => ({ id: c.key, text: c.claim, exaggerated: false }));
    list.splice(1, 0, label);
    return list;
  });

  async ngOnInit() {
    try {
      await this.session.flush();
      const report = await this.api.report();
      this.report.set(report);
      this.session.snapshotA.set(report.snapshot.snapshotId);
      this.observe.emit({ type: 'task_presented', opportunity: TASK });
      this.observe.emit({
        type: 'options_presented',
        opportunity: TASK,
        payload: { options: this.statements().map((s) => s.id), snapshotId: report.snapshot.snapshotId },
      });
      this.phase.set('answering');
    } catch {
      this.ui.toast('No pudimos congelar la instantánea; seguimos y la verás al final.');
      this.done.emit();
    }
  }

  select(id: string) {
    if (this.selected() === id) return;
    const first = this.selected() === null && this.phase() === 'answering';
    this.observe.emit({ type: first ? 'action_performed' : 'answer_revised', opportunity: TASK, payload: { action: 'select', item: id } });
    this.selected.set(id);
    if (this.phase() === 'failed') this.phase.set('answering');
  }

  check() {
    const choice = this.selected();
    if (!choice) return;
    const correct = this.statements().find((s) => s.id === choice)?.exaggerated === true;
    this.attempt += 1;
    this.observe.emit({ type: 'response_submitted', opportunity: TASK, payload: { correct, attempt: this.attempt, choice } });
    if (!correct) {
      this.phase.set('failed');
      this.ui.tone(230);
      return;
    }
    this.observe.emit({ type: 'task_completed', opportunity: TASK });
    this.ui.toast('Exacto: una etiqueta no tiene números ni lugar.');
    this.ui.tone(720);
    this.phase.set('shown');
  }

  skip() {
    this.observe.emit({ type: 'task_skipped', opportunity: TASK });
    this.phase.set('shown');
  }

  disagree() {
    this.disagreed.set(true);
    this.observe.emit({
      type: 'declaration_made',
      opportunity: DISAGREE,
      origin: 'reported',
      payload: { field: 'instantanea', value: 'no_me_representa', snapshotId: this.session.snapshotA() },
    });
  }

  status(c: DalaClaim) {
    return EVIDENCE_STATUS[c.evidenceStatus] ?? c.evidenceStatus;
  }

  async trace(c: DalaClaim) {
    try {
      const t = await this.api.traceClaim(c.key);
      this.ui.openModal({
        title: c.claim,
        text: `${t.events.length} eventos de tu registro sostienen esta frase.`,
        list: t.events.map((e) => `+${e.seconds} s · ${e.scene} · ${EVENT_LABELS[e.type] ?? e.type}`),
      });
    } catch {
      this.ui.toast('No pudimos traer los eventos ahora.');
    }
  }
}
