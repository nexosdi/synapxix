/**
 * D.A.L.A.™ — Proyección del retrato (Modelo Fundacional 0.1, §8–§10).
 *
 * El registro de eventos es la única verdad. Evidencia, afirmaciones e
 * instantáneas se recalculan desde él con una función pura: mismo registro,
 * mismo marco y misma versión del motor dan exactamente el mismo resultado,
 * sin importar el orden en que llegaron los eventos. Eso es lo que hace
 * reproducible cada afirmación (§17, fase 2) y lo que permite recalcular
 * cuando se retira evidencia (§20).
 *
 * Todos los métodos son descriptivos: numerador sobre oportunidades
 * válidas. Ninguno produce probabilidades.
 */
import type {
  DalaAmbitoCoverage,
  DalaClaim,
  DalaEventV2,
  DalaEvidenceStatus,
  DalaReviewStatus,
  DalaSnapshotV2,
} from '@nexosdi.synapxix/dala/contracts';
import type { ConstructSheet, DalaFramework, MethodRef } from '@nexosdi.synapxix/dala/framework';

export const PROJECTION_ENGINE_VERSION = 'pulso-engine@0.4.0';

// ── 1. Orden canónico ──────────────────────────────────────────────────────

interface Ordered {
  e: DalaEventV2;
  /** Posición en el orden canónico: la única noción de "antes" válida. */
  i: number;
}

/**
 * Serialización canónica (claves ordenadas, sin undefined). Para comparar
 * instantáneas sin depender del orden de claves del almacenamiento: JSONB,
 * por ejemplo, devuelve los objetos con las claves reordenadas.
 */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => [k, v[k]]))
      : v,
  );
}

/**
 * Deduplica por eventId y ordena: sesiones por su primer instante, eventos
 * por secuencia dentro de la sesión. El orden de llegada no interviene.
 */
export function orderEvents(events: DalaEventV2[]): DalaEventV2[] {
  const unique = new Map<string, DalaEventV2>();
  for (const e of events) if (!unique.has(e.eventId)) unique.set(e.eventId, e);
  const all = [...unique.values()];

  const sessionStart = new Map<string, number>();
  for (const e of all) {
    const t = Date.parse(e.occurredAt);
    const prev = sessionStart.get(e.sessionId);
    if (prev === undefined || t < prev) sessionStart.set(e.sessionId, t);
  }
  return all.sort((a, b) => {
    if (a.sessionId !== b.sessionId) {
      const diff = (sessionStart.get(a.sessionId) ?? 0) - (sessionStart.get(b.sessionId) ?? 0);
      return diff !== 0 ? diff : a.sessionId.localeCompare(b.sessionId);
    }
    return a.sequence - b.sequence;
  });
}

// ── 2. Oportunidades ───────────────────────────────────────────────────────

interface Opp {
  id: string;
  kind: string;
  scene: string;
  session: string;
  events: Ordered[];
}

/**
 * Una oportunidad es una instancia dentro de una sesión: la misma tarjeta
 * en otra sesión es otra oportunidad (otro intento, otro contexto).
 */
function buildOpportunities(ordered: Ordered[]): Opp[] {
  const map = new Map<string, Opp>();
  for (const o of ordered) {
    const ref = o.e.opportunity;
    if (!ref) continue;
    const key = `${o.e.sessionId}|${ref.id}`;
    let opp = map.get(key);
    if (!opp) {
      opp = { id: ref.id, kind: ref.kind, scene: o.e.scene.id, session: o.e.sessionId, events: [] };
      map.set(key, opp);
    }
    opp.events.push(o);
  }
  return [...map.values()];
}

const ofType = (opp: Opp, type: string) => opp.events.filter((o) => o.e.eventType === type);
const first = (opp: Opp, type: string) => opp.events.find((o) => o.e.eventType === type);
const correct = (o: Ordered) => o.e.payload['correct'] === true;
const between = (opp: Opp, type: string, from: number, to: number) =>
  opp.events.filter((o) => o.e.eventType === type && o.i > from && o.i < to);

// ── 3. Métodos versionados ─────────────────────────────────────────────────

interface Group {
  skill?: string;
  scenes: Set<string>;
  numerator: number;
  denominator: number;
  excluded: number;
  detail: Record<string, number | string>;
  refs: string[];
}

interface MethodContext {
  opps: Opp[];
  ordered: Ordered[];
  fw: DalaFramework;
}

const newGroup = (skill?: string): Group => ({
  skill,
  scenes: new Set(),
  numerator: 0,
  denominator: 0,
  excluded: 0,
  detail: {},
  refs: [],
});

const bump = (g: Group, key: string) => {
  const current = g.detail[key];
  g.detail[key] = (typeof current === 'number' ? current : 0) + 1;
};

const sceneAffords = (fw: DalaFramework, sceneId: string, affordance: 'strategyOption' | 'revisable' | 'skipAfterError') =>
  fw.scenes.find((s) => s.id === sceneId)?.affordances[affordance] === true;

const tasks = (ctx: MethodContext) => ctx.opps.filter((o) => o.kind === 'tarea');

/**
 * Ranking de elecciones entre opciones comparables: cuántas veces ganó la
 * más elegida (numerador) sobre las elecciones hechas (denominador), con la
 * segunda y el ranking completo como detalle. Empates: la elegida primero.
 */
function rank(ctx: MethodContext, kind: string, eventType: string): Group {
  const g = newGroup();
  const counts = new Map<string, { label: string; n: number; first: number }>();
  for (const opp of ctx.opps.filter((o) => o.kind === kind)) {
    const made = ofType(opp, eventType).at(-1);
    if (!made) continue;
    g.denominator += 1;
    g.scenes.add(opp.scene);
    g.refs.push(made.e.eventId);
    const value = String(made.e.payload['value'] ?? made.e.payload['choice']);
    const entry = counts.get(value) ?? { label: String(made.e.payload['label'] ?? value), n: 0, first: made.i };
    entry.n += 1;
    counts.set(value, entry);
  }
  const ranked = [...counts.values()].sort((a, b) => b.n - a.n || a.first - b.first);
  if (ranked[0]) {
    g.numerator = ranked[0].n;
    g.detail['top'] = ranked[0].label;
  }
  if (ranked[1]) {
    g.detail['second'] = ranked[1].label;
    g.detail['segunda'] = ranked[1].n;
  }
  if (ranked.length > 0) g.detail['ranking'] = ranked.map((r) => `${r.label}:${r.n}`).join(',');
  return g;
}

const METHODS: Record<MethodRef, (ctx: MethodContext) => Group[]> = {
  /** Primer envío correcto sin pista previa, por habilidad. */
  'tasa_independiente@0.1': (ctx) => {
    const bySkill = new Map<string, Group>();
    for (const opp of tasks(ctx)) {
      const skill = ctx.fw.scenes.find((s) => s.id === opp.scene)?.skill;
      if (!skill) continue;
      const g = bySkill.get(skill) ?? newGroup(skill);
      bySkill.set(skill, g);
      const responses = ofType(opp, 'response_submitted');
      if (responses.length === 0) {
        g.excluded += 1;
        continue;
      }
      const firstResponse = responses[0];
      const hints = ofType(opp, 'hint_requested');
      const hintBefore = hints.some((h) => h.i < firstResponse.i);
      g.denominator += 1;
      g.scenes.add(opp.scene);
      const presented = first(opp, 'task_presented');
      if (presented) g.refs.push(presented.e.eventId);
      g.refs.push(firstResponse.e.eventId);
      if (correct(firstResponse) && !hintBefore) {
        g.numerator += 1;
        continue;
      }
      const solved = responses.find(correct);
      if (solved && hints.some((h) => h.i < solved.i)) bump(g, 'asistidas');
      else if (solved) bump(g, 'tras_reintento');
      if (first(opp, 'task_skipped')) bump(g, 'omitidas');
      hints.forEach((h) => g.refs.push(h.e.eventId));
    }
    return [...bySkill.values()];
  },

  /** Anexo 22: solicitudes tras intento sobre tareas con dificultad y ayuda disponible. */
  'ayuda_tras_intento@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of tasks(ctx)) {
      const available = first(opp, 'support_available');
      if (!available) continue;
      const responses = ofType(opp, 'response_submitted');
      const hints = ofType(opp, 'hint_requested');
      const firstResponse = responses[0];
      if (hints.some((h) => !firstResponse || h.i < firstResponse.i)) bump(g, 'temprana');
      const firstWrong = responses.find((r) => !correct(r));
      if (!firstWrong) continue;
      g.denominator += 1;
      g.scenes.add(opp.scene);
      g.refs.push(available.e.eventId, firstWrong.e.eventId);
      const after = hints.find((h) => h.i > firstResponse.i);
      if (after) {
        g.numerator += 1;
        g.refs.push(after.e.eventId);
      }
    }
    return [g];
  },

  /** Tareas con error y omisión visible que terminan resueltas sin omitir. */
  'persistencia@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of tasks(ctx)) {
      if (!sceneAffords(ctx.fw, opp.scene, 'skipAfterError')) continue;
      const firstWrong = ofType(opp, 'response_submitted').find((r) => !correct(r));
      if (!firstWrong) continue;
      g.denominator += 1;
      g.scenes.add(opp.scene);
      g.refs.push(firstWrong.e.eventId);
      const skipped = first(opp, 'task_skipped');
      const completed = first(opp, 'task_completed');
      if (skipped) {
        bump(g, 'omitidas');
        g.refs.push(skipped.e.eventId);
      } else if (completed) {
        g.numerator += 1;
        g.refs.push(completed.e.eventId);
      } else {
        g.denominator -= 1;
        g.excluded += 1;
      }
    }
    return [g];
  },

  /** Consigna abierta antes del primer envío de la misión. */
  'consigna_previa@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of ctx.opps.filter((o) => o.kind === 'consigna')) {
      const presented = first(opp, 'instruction_presented');
      if (!presented) continue;
      g.denominator += 1;
      g.scenes.add(opp.scene);
      g.refs.push(presented.e.eventId);
      const firstResponse = ctx.ordered.find(
        (o) => o.e.sessionId === opp.session && o.e.scene.id === opp.scene && o.e.eventType === 'response_submitted',
      );
      const opened = first(opp, 'instructions_opened');
      if (!opened) continue;
      g.refs.push(opened.e.eventId);
      if (!firstResponse || opened.i < firstResponse.i) g.numerator += 1;
      else bump(g, 'despues');
    }
    return [g];
  },

  /** Cambio explícito de enfoque entre un envío fallido y el siguiente. */
  'cambio_tras_fallo@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of tasks(ctx)) {
      if (!sceneAffords(ctx.fw, opp.scene, 'strategyOption')) continue;
      const responses = ofType(opp, 'response_submitted');
      const changes = ofType(opp, 'strategy_changed');
      const firstWrong = responses.find((r) => !correct(r));
      changes
        .filter((c) => !firstWrong || c.i < firstWrong.i)
        .forEach(() => bump(g, 'espontaneos'));
      responses.forEach((r, k) => {
        if (correct(r)) return;
        const next = responses.at(k + 1);
        if (!next) {
          g.excluded += 1;
          return;
        }
        g.denominator += 1;
        g.scenes.add(opp.scene);
        g.refs.push(r.e.eventId, next.e.eventId);
        const change = between(opp, 'strategy_changed', r.i, next.i).at(0);
        if (change) {
          g.numerator += 1;
          g.refs.push(change.e.eventId);
        }
      });
    }
    return [g];
  },

  /** Corrección propia entre el envío anterior (o el inicio) y el envío. */
  'revision_previa@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of tasks(ctx)) {
      if (!sceneAffords(ctx.fw, opp.scene, 'revisable')) continue;
      const start = first(opp, 'task_presented')?.i ?? -1;
      const responses = ofType(opp, 'response_submitted');
      responses.forEach((r, k) => {
        const from = k === 0 ? start : responses[k - 1].i;
        g.denominator += 1;
        g.scenes.add(opp.scene);
        g.refs.push(r.e.eventId);
        const revision = between(opp, 'answer_revised', from, r.i).at(0);
        if (revision) {
          g.numerator += 1;
          g.refs.push(revision.e.eventId);
        }
      });
    }
    return [g];
  },

  /** Apertura de lo opcional cuando se ofrece. */
  'exploracion@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of ctx.opps.filter((o) => o.kind === 'exploracion')) {
      const offered = first(opp, 'exploration_offered');
      if (!offered) continue;
      g.denominator += 1;
      g.scenes.add(opp.scene);
      g.refs.push(offered.e.eventId);
      const opened = first(opp, 'exploration_opened');
      if (opened) {
        g.numerator += 1;
        g.refs.push(opened.e.eventId);
      }
    }
    return [g];
  },

  /** Superpoderes: tres habilidades elegidas, por familia, y la que quiere aprender. */
  'habilidades@0.1': (ctx) => {
    const g = rank(ctx, 'habilidad', 'declaration_made');
    const picks = ctx.opps
      .filter((o) => o.kind === 'habilidad')
      .map((o) => ofType(o, 'declaration_made').at(-1))
      .filter((o): o is Ordered => !!o);
    if (picks.length) g.detail['lista'] = picks.map((o) => `«${String(o.e.payload['skill'] ?? o.e.payload['label'])}»`).join(', ');
    const learn = ctx.ordered.filter((o) => o.e.eventType === 'declaration_made' && o.e.payload['field'] === 'aprender').at(-1);
    if (learn) {
      g.detail['aprender'] = `«${String(learn.e.payload['label'] ?? learn.e.payload['value'])}»`;
      g.detail['quiere_aprender'] = 1;
      g.refs.push(learn.e.eventId);
    }
    return [g];
  },

  /** Motivaciones en pares: la más elegida y la siguiente. */
  'motivaciones@0.1': (ctx) => [rank(ctx, 'motivacion', 'declaration_made')],

  /** Situaciones de equipo: la forma de actuar más elegida (observada). */
  'estilo_equipo@0.1': (ctx) => [rank(ctx, 'situacion_equipo', 'choice_made')],

  /** ¿El desafío elegido es de una familia que declaró como fuerte? */
  'coherencia_habilidad@0.1': (ctx) => {
    const g = newGroup();
    const declared = ctx.ordered.filter(
      (o) => o.e.eventType === 'declaration_made' && o.e.opportunity?.kind === 'habilidad',
    );
    const families = new Set(declared.map((o) => String(o.e.payload['value'])));
    const choices = ctx.opps.filter((o) => o.kind === 'eleccion_tarea');
    if (!declared.length) {
      g.excluded = choices.length;
      return [g];
    }
    declared.forEach((o) => g.refs.push(o.e.eventId));
    for (const opp of choices) {
      const made = first(opp, 'choice_made');
      if (!made) continue;
      g.denominator += 1;
      g.scenes.add(opp.scene);
      g.refs.push(made.e.eventId);
      const fams = made.e.payload['families'];
      if (Array.isArray(fams) && fams.some((f) => families.has(String(f)))) g.numerator += 1;
    }
    return [g];
  },

  /** Elección de jugar sin pista cuando se ofrece el modo. */
  'desafio@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of ctx.opps.filter((o) => o.kind === 'eleccion_desafio')) {
      const made = first(opp, 'choice_made');
      if (!made) continue;
      g.denominator += 1;
      g.scenes.add(opp.scene);
      g.refs.push(made.e.eventId);
      if (made.e.payload['choice'] === 'sin_pista') g.numerator += 1;
    }
    return [g];
  },

  /** A quién recurre: persona del equipo, asistente de IA o por su cuenta. */
  'colaboracion@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of ctx.opps.filter((o) => o.kind === 'eleccion_apoyo')) {
      const made = first(opp, 'choice_made');
      if (!made) continue;
      g.denominator += 1;
      g.scenes.add(opp.scene);
      g.refs.push(made.e.eventId);
      const choice = made.e.payload['choice'];
      if (choice === 'persona') g.numerator += 1;
      else if (choice === 'ia') bump(g, 'ia');
      else if (choice === 'solo') bump(g, 'solo');
    }
    return [g];
  },

  /** Apertura de las razones antes del veredicto sobre una recomendación. */
  'revision_ia@0.1': (ctx) => {
    const g = newGroup();
    for (const opp of ctx.opps.filter((o) => o.kind === 'recomendacion_ia')) {
      const reviewed = ofType(opp, 'recommendation_reviewed').at(-1);
      if (!reviewed) continue;
      g.denominator += 1;
      g.scenes.add(opp.scene);
      g.refs.push(reviewed.e.eventId);
      g.detail['verdict'] = String(reviewed.e.payload['verdictLabel'] ?? reviewed.e.payload['verdict']);
      const opened = ofType(opp, 'reasons_opened').find((r) => r.i < reviewed.i);
      if (opened) {
        g.numerator += 1;
        g.refs.push(opened.e.eventId);
      }
    }
    return [g];
  },
};

// ── 4. Afirmaciones ────────────────────────────────────────────────────────

/** Métodos que leen declaraciones: su afirmación viaja con ese origen. */
const ORIGINS: Partial<Record<string, DalaClaim['origins']>> = {
  'habilidades@0.1': ['reported'],
  'motivaciones@0.1': ['reported'],
  'coherencia_habilidad@0.1': ['reported', 'observed'],
};

const STATUS_TEXT: Record<DalaEvidenceStatus, string> = {
  sin_oportunidad_suficiente: 'sin oportunidad suficiente',
  hipotesis_provisional: 'hipótesis provisional',
  respaldada_en_contexto: 'respaldada en el contexto',
};

function evidenceStatus(sheet: ConstructSheet, g: Group): DalaEvidenceStatus {
  const { provisional, supported } = sheet.sufficiency;
  if (g.denominator < provisional.minOpportunities) return 'sin_oportunidad_suficiente';
  const rate = g.numerator / g.denominator;
  const consistent = rate >= supported.consistency || rate <= 1 - supported.consistency;
  if (g.denominator >= supported.minOpportunities && g.scenes.size >= supported.minScenes && consistent) {
    return 'respaldada_en_contexto';
  }
  return 'hipotesis_provisional';
}

function fill(template: string, g: Group, fw: DalaFramework): string {
  return template.replace(/\{([\w.]+)\}/g, (_, token: string) => {
    if (token === 'n') return String(g.numerator);
    if (token === 'd') return String(g.denominator);
    if (token === 'skill') return g.skill ? (fw.skills[g.skill] ?? g.skill) : '';
    if (token === 'declared' || token === 'verdict') return String(g.detail[token] ?? '—');
    if (token.startsWith('detail.')) return String(g.detail[token.slice(7)] ?? 0);
    return token;
  });
}

function reviewStatusFor(key: string, ordered: Ordered[]): DalaReviewStatus {
  const last = ordered
    .filter((o) => o.e.eventType === 'claim_reviewed' && o.e.payload['claimKey'] === key)
    .at(-1);
  if (!last) return 'pendiente';
  return last.e.payload['verdict'] === 'si' ? 'confirmada' : 'cuestionada';
}

export interface ProjectionOptions {
  /** Afirmaciones de la instantánea anterior, para encadenar y explicar cambios. */
  previous?: Pick<DalaClaim, 'key' | 'claimId' | 'observation' | 'evidenceStatus' | 'change'>[];
  now?: Date;
}

/**
 * Proyecta el retrato de un sujeto desde su registro completo.
 * Función pura: no lee reloj salvo `options.now`, ni red, ni base de datos.
 */
export function projectSubject(
  subjectId: string,
  events: DalaEventV2[],
  fw: DalaFramework,
  options: ProjectionOptions = {},
): DalaSnapshotV2 {
  // Un retrato es relativo a un marco: eventos de otra versión no se mezclan.
  const canonical = orderEvents(
    events.filter((e) => e.subjectId === subjectId && e.context?.frameworkVersion === fw.version),
  );
  const ordered: Ordered[] = canonical.map((e, i) => ({ e, i }));
  const ctx: MethodContext = { opps: buildOpportunities(ordered), ordered, fw };
  const previousByKey = new Map((options.previous ?? []).map((c) => [c.key, c]));

  const claims: DalaClaim[] = [];
  for (const sheet of fw.constructs) {
    for (const g of METHODS[sheet.method](ctx)) {
      const key = g.skill ? `${sheet.id}:${g.skill}` : sheet.id;
      const status = evidenceStatus(sheet, g);
      const base =
        g.denominator === 0
          ? 'No hubo oportunidades válidas para observarlo en esta experiencia.'
          : fill(sheet.claimTemplate, g, fw);
      const extras = (sheet.claimExtras ?? [])
        .filter((x) => g.denominator > 0 && Number(g.detail[x.when] ?? 0) > 0)
        .map((x) => fill(x.text, g, fw));
      const previous = previousByKey.get(key);
      const changed =
        previous &&
        (previous.observation.numerator !== g.numerator || previous.observation.denominator !== g.denominator);

      claims.push({
        key,
        subjectId,
        constructRef: `${sheet.id}@${sheet.version}`,
        ambito: sheet.ambito,
        frameworkVersion: fw.version,
        scope: { scenes: [...g.scenes].sort(), ...(g.skill ? { skill: g.skill } : {}) },
        observation: {
          numerator: g.numerator,
          denominator: g.denominator,
          excluded: g.excluded,
          detail: g.detail,
        },
        // Una etiqueta que ya termina en punto (p. ej. "D.A.L.A.") no lleva otro.
        claim: [base, ...extras].join(' ').replace(/\.\.(?=\s|$)/g, '.'),
        evidenceStatus: status,
        reviewStatus: reviewStatusFor(key, ordered),
        calibratedProbability: null,
        origins: ORIGINS[sheet.method] ?? ['observed'],
        evidenceRefs: [...new Set(g.refs)],
        methodRef: sheet.method,
        alternatives: sheet.alternatives,
        nextCheck: sheet.nextCheck,
        previousClaimRef: previous?.claimId ?? null,
        change: changed
          ? (previous.observation.denominator === 0
              ? `Antes no había oportunidades; ahora ${g.numerator} de ${g.denominator}.`
              : `Antes ${previous.observation.numerator} de ${previous.observation.denominator}; ahora ${g.numerator} de ${g.denominator}.`) +
            (previous.evidenceStatus !== status
              ? ` La evidencia pasó de «${STATUS_TEXT[previous.evidenceStatus]}» a «${STATUS_TEXT[status]}».`
              : '')
          : // Sin cambio de evidencia (p. ej. solo una revisión): se conserva el último cambio.
            (previous?.change ?? null),
      });
    }
  }

  return {
    subjectId,
    frameworkVersion: fw.version,
    engineVersion: PROJECTION_ENGINE_VERSION,
    eventRange: {
      from: canonical.at(0)?.eventId ?? null,
      to: canonical.at(-1)?.eventId ?? null,
      count: canonical.length,
    },
    claims,
    coverage: coverageOf(claims, fw),
    context: contextOf(canonical, fw),
    createdAt: (options.now ?? new Date(canonical.at(-1)?.occurredAt ?? 0)).toISOString(),
  };
}

function coverageOf(claims: DalaClaim[], fw: DalaFramework): DalaAmbitoCoverage[] {
  return fw.ambitos.map((a) => {
    if (a.id === 'contexto') {
      return { ambito: a.id, observed: true, note: 'Registro de la sesión; se usa para interpretar, no como rasgo.' };
    }
    const scenes = new Set(
      claims.filter((c) => c.ambito === a.id && c.observation.denominator > 0).flatMap((c) => c.scope.scenes),
    );
    if (scenes.size === 0) return { ambito: a.id, observed: false, note: a.withoutOpportunity };
    const titles = [...scenes].map((s) => fw.scenes.find((x) => x.id === s)?.title ?? s);
    return { ambito: a.id, observed: true, note: `Observado en: ${titles.join(', ')}.` };
  });
}

function contextOf(events: DalaEventV2[], fw: DalaFramework): Record<string, string | number> {
  const sessions = new Set(events.map((e) => e.sessionId));
  const t0 = Date.parse(events.at(0)?.occurredAt ?? '');
  const t1 = Date.parse(events.at(-1)?.occurredAt ?? '');
  return {
    marco: fw.version,
    sesiones: sessions.size,
    eventos: events.length,
    minutos: Number.isNaN(t0) ? 0 : Math.round(((t1 - t0) / 60000) * 10) / 10,
    pausas: events.filter((e) => e.eventType === 'session_paused').length,
    dispositivo: events.at(0)?.context.deviceClass ?? 'unknown',
  };
}

// ── 5. Decisión ────────────────────────────────────────────────────────────

export interface DecisionProposal {
  selected: string;
  objective: string;
  alternatives: Array<{ id: string; label: string; whyNot: string }>;
  reasons: Array<{ type: string; referenceId: string; explanation: string }>;
  expectedOutcome: { metric: string; description: string };
  verification: string;
  content: { scene: string; hintAvailable: boolean };
}

/** Familia de superpoderes → línea del laboratorio por la que empezar. */
const LINE_OF_FAMILY: Record<string, string> = {
  Crear: 'linea_experiencias',
  Analizar: 'linea_datos',
  Acompañar: 'linea_escuelas',
  Construir: 'linea_producto',
};

/**
 * Sugiere por dónde empezar en el equipo (§12): la línea de la familia que
 * más se repite en sus superpoderes, con lo observado y lo declarado como
 * razones. Sin tres superpoderes, rotar el primer mes. Reglas explícitas y
 * revisables; la sugerencia queda en shadow mode hasta el veredicto.
 */
export function decideNext(snapshot: DalaSnapshotV2, fw: DalaFramework): DecisionProposal {
  const byKey = new Map(snapshot.claims.map((c) => [c.key, c]));
  const skills = byKey.get('habilidades_declaradas');
  const reasons: DecisionProposal['reasons'] = [];

  let selected = fw.baselineDecision;
  if (!skills || skills.observation.denominator < 3) {
    reasons.push({
      type: 'evidencia_insuficiente',
      referenceId: skills?.key ?? 'habilidades_declaradas',
      explanation: `Hay ${skills?.observation.denominator ?? 0} superpoderes declarados; con menos de 3 conviene conocer todas las líneas.`,
    });
  } else {
    const top = String(skills.observation.detail['top'] ?? '');
    selected = LINE_OF_FAMILY[top] ?? fw.baselineDecision;
    reasons.push({ type: 'superpoderes', referenceId: skills.key, explanation: skills.claim });
  }
  const supporting = [
    ...snapshot.claims.filter(
      (c) => c.key.startsWith('desempeno_independiente:') && c.scope.scenes.some((sc) => sc.startsWith('desafio_')),
    ),
    byKey.get('motivaciones_declaradas'),
    byKey.get('estilo_colaboracion'),
  ];
  for (const c of supporting) {
    if (c && c.observation.denominator > 0) reasons.push({ type: 'contexto', referenceId: c.key, explanation: c.claim });
  }

  const option = fw.decisions.find((d) => d.id === selected) ?? fw.decisions[0];
  return {
    selected: option.id,
    objective: option.purpose,
    alternatives: fw.decisions
      .filter((d) => d.id !== option.id)
      .map((d) => ({
        id: d.id,
        label: d.label,
        whyNot:
          option.id === fw.baselineDecision
            ? 'Todavía falta saber qué te sale natural para sugerir una línea.'
            : d.id === fw.baselineDecision
              ? 'Ya hay superpoderes declarados para sugerir una línea.'
              : 'Tus superpoderes apuntan más a otra línea.',
      })),
    reasons,
    expectedOutcome: option.expectedOutcome,
    verification: option.verification,
    content: option.content,
  };
}
