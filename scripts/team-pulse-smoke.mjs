/**
 * Verificación E2E del piloto D.A.L.A. (marco pulso-web@0.1) contra un
 * server vivo. Recorre el ciclo completo tal como lo hace la app team:
 *
 *   inscripción → eventos v2 de las tres misiones → retrato →
 *   decisión del catálogo → veredicto humano (elegir otra) → contraste →
 *   outcome → retrato encadenado → revisión de una afirmación → traza →
 *   recálculo reproducible → exportación → vista de investigación.
 *
 * Los n/d esperados están calculados a mano sobre el guion: si el motor
 * deriva otra cosa, la prueba falla. Exit code 1 ante cualquier eslabón roto.
 *
 * Uso:
 *   TEAM_ADMIN_CODE=<code> node scripts/team-pulse-smoke.mjs [baseUrl]
 */
import { randomUUID } from 'crypto';

const BASE = process.argv[2] ?? `http://localhost:${process.env.SYNAPXIX_API_PORT || process.env.PORT || 3001}`;
const API = `${BASE}/api/team/v1`;
const ADMIN_CODE = process.env.TEAM_ADMIN_CODE;
const FRAMEWORK = 'pulso-web@0.2';
/** Versión de cada escena en el marco 0.2 (las demás siguen en 0.1). */
const SCENE_VERSION = { gustos: '0.2', mapa: '0.2', observatorio: '0.2', ciclo: '0.2', camara: '0.2' };

if (!ADMIN_CODE) {
  console.error('Falta TEAM_ADMIN_CODE en el entorno.');
  process.exit(1);
}

const assert = (cond, label) => {
  if (!cond) {
    console.error(`✗ ${label}`);
    process.exit(1);
  }
  console.log(`✓ ${label}`);
};

const json = async (res, label) => {
  if (!res.ok) {
    console.error(`✗ ${label}: HTTP ${res.status} — ${await res.text()}`);
    process.exit(1);
  }
  return res.json();
};

// ── 1. Inscripción ─────────────────────────────────────────────────────────
const joined = await json(
  await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Pulso Smoke', email: `smoke+${randomUUID().slice(0, 8)}@synapxix.test`, age: 30, area: 'Tecnología y datos' }),
  }),
  'inscripción',
);
assert(joined.token && joined.subjectId, `sujeto seudónimo creado (${joined.subjectId.slice(0, 8)})`);
const { token, subjectId, consent } = joined;
const auth = { Authorization: `Bearer ${token}` };

const post = (path, body, label) =>
  fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...auth }, body: JSON.stringify(body) }).then((r) =>
    json(r, label),
  );
const get = (path, label, headers = auth) => fetch(`${API}${path}`, { headers }).then((r) => json(r, label));

// ── 2. Constructor de eventos v2 (lo que hace DalaBridge en la app) ────────
const sessionId = randomUUID();
let seq = 0;
let scene = 'gustos';
const make = (type, opp, payload = {}, origin = 'observed', overrides = {}) => {
  seq += 1;
  return {
    schemaVersion: 'dala.behavior-event.v2',
    eventId: randomUUID(),
    subjectId,
    sessionId,
    occurredAt: new Date(Date.now() + seq * 1000).toISOString(),
    sequence: seq,
    eventType: type,
    origin,
    source: { applicationId: 'smoke', instrumentId: scene, instrumentVersion: SCENE_VERSION[scene] ?? '0.1' },
    scene: { id: scene, version: SCENE_VERSION[scene] ?? '0.1' },
    ...(opp ? { opportunity: { id: opp[0], kind: opp[1] } } : {}),
    context: { frameworkVersion: FRAMEWORK, deviceClass: 'desktop' },
    payload,
    consent,
    ...overrides,
  };
};
const enter = (id, events) => {
  events.push(make('scene_completed', null, {}, 'system'));
  scene = id;
  events.push(make('scene_started', null, {}, 'system'));
};
const task = (events, id, withSupport = true) => {
  const o = [`${scene}:${id}`, 'tarea'];
  events.push(make('task_presented', o), make('options_presented', o, { options: ['a', 'b', 'c'] }));
  if (withSupport) events.push(make('support_available', o, { support: 'pista' }));
  return o;
};
const send = async (events, label) => post('/events/batch', { events }, label);

// ── 3. Las tres misiones ───────────────────────────────────────────────────
const m = [make('session_started', null, {}, 'system')];
m.push(make('options_presented', ['gustos:puerta', 'declaracion'], { options: ['visual', 'story', 'logic'] }));
m.push(make('declaration_made', ['gustos:puerta', 'declaracion'], { field: 'puerta', value: 'visual', label: 'Verlo en un mapa' }, 'reported'));
// Seis pares de gustos: analizar ×3, crear ×2, acompañar ×1.
['analizar', 'crear', 'analizar', 'analizar', 'crear', 'acompanar'].forEach((value, k) => {
  const labels = { analizar: 'Analizar', crear: 'Crear', acompanar: 'Acompañar' };
  const pair = [`gustos:par-${k + 1}`, 'preferencia'];
  m.push(make('options_presented', pair, { options: ['a', 'b'] }));
  m.push(make('declaration_made', pair, { field: 'interes', value, label: labels[value] }, 'reported'));
});
enter('mapa', m);
m.push(make('choice_offered', ['mapa:ruta-1', 'eleccion_ruta'], { options: ['observatorio', 'ciclo', 'camara'] }));
m.push(make('choice_made', ['mapa:ruta-1', 'eleccion_ruta'], { choice: 'observatorio' }));

enter('observatorio', m);
m.push(make('choice_offered', ['observatorio:modo', 'eleccion_desafio'], { options: ['con_pista', 'sin_pista'] }));
m.push(make('choice_made', ['observatorio:modo', 'eleccion_desafio'], { choice: 'con_pista' }));
m.push(make('instruction_presented', ['observatorio:consigna', 'consigna']));
let o = task(m, 's1');
m.push(make('response_submitted', o, { correct: true, attempt: 1 }), make('task_completed', o));
m.push(make('exploration_offered', ['observatorio:s1:porque', 'exploracion']), make('exploration_opened', ['observatorio:s1:porque', 'exploracion']));
o = task(m, 's2');
m.push(make('response_submitted', o, { correct: false, attempt: 1 }), make('hint_requested', o, { level: 1 }), make('support_delivered', o, { support: 'pista' }));
m.push(make('response_submitted', o, { correct: true, attempt: 2 }), make('task_completed', o));
o = task(m, 's3');
m.push(make('response_submitted', o, { correct: false, attempt: 1 }), make('task_skipped', o));

enter('ciclo', m);
m.push(make('choice_offered', ['ciclo:modo', 'eleccion_desafio'], { options: ['con_pista', 'sin_pista'] }));
m.push(make('choice_made', ['ciclo:modo', 'eleccion_desafio'], { choice: 'sin_pista' }));
m.push(make('choice_offered', ['ciclo:formato', 'eleccion_formato'], { options: ['mapa', 'historia', 'reglas'] }), make('choice_made', ['ciclo:formato', 'eleccion_formato'], { choice: 'mapa' }));
m.push(make('instruction_presented', ['ciclo:consigna', 'consigna']));
o = task(m, 'secuencia', false);
m.push(make('action_performed', o, { action: 'place', item: 'Evidencia' }), make('response_submitted', o, { correct: false, attempt: 1 }));
m.push(make('strategy_changed', o, { from: 'adelante', to: 'atras' }), make('response_submitted', o, { correct: true, attempt: 2 }), make('task_completed', o));

const batch1 = await send(m, 'ingesta de las misiones');
if (!batch1.every((r) => r.status === 'accepted')) console.error(batch1.filter((r) => r.status !== 'accepted').slice(0, 3));
assert(batch1.length === m.length && batch1.every((r) => r.status === 'accepted'), `${m.length} eventos v2 aceptados`);
const again = await send(m, 'reenvío idempotente');
assert(again.every((r) => r.status === 'duplicate'), 'reenvío del mismo lote: todo duplicado, nada se cuenta dos veces');

const bad = await send(
  [make('response_submitted', null, { correct: true }), make('task_presented', ['ciclo:x', 'tarea'], {}, 'observed', { context: { frameworkVersion: 'otro@9' } })],
  'eventos inválidos',
);
assert(bad[0].status === 'rejected' && bad[0].reason === 'missing_opportunity', 'evento de acción sin oportunidad: rechazado');
assert(bad[1].status === 'quarantined' && bad[1].reason === 'unknown_framework_version', 'marco desconocido: en cuarentena');

// ── 4. Retrato inicial ─────────────────────────────────────────────────────
const nd = (report, key) => {
  const c = report.snapshot.claims.find((x) => x.key === key);
  return c ? `${c.observation.numerator}/${c.observation.denominator}` : 'falta';
};
const r1 = await get('/me/report', 'retrato inicial');
assert(r1.snapshot.frameworkVersion === FRAMEWORK, `instantánea con marco ${FRAMEWORK} y motor ${r1.snapshot.engineVersion}`);
assert(nd(r1, 'desempeno_independiente:clasificar_fuentes') === '1/3', 'clasificar fuentes: 1 de 3 sin ayuda');
assert(nd(r1, 'busqueda_de_ayuda') === '1/2', 'ayuda tras intentar: 1 de 2 tareas con dificultad y pista (el ciclo fue sin red)');
assert(nd(r1, 'intereses_declarados') === '3/6', 'gustos declarados: «Analizar» 3 de 6 pares');
assert(nd(r1, 'busqueda_de_desafio') === '1/2', 'eligió jugar sin red en 1 de 2 misiones');
assert(
  r1.snapshot.claims.find((c) => c.key === 'intereses_declarados')?.origins.join() === 'reported',
  'los gustos viajan como declaración',
);
assert(nd(r1, 'cambio_de_estrategia') === '1/1', 'cambio de enfoque tras fallo: 1 de 1');
assert(nd(r1, 'coherencia_declarado_observado') === '1/1', 'coherencia declarado/observado: 1 de 1');
assert(r1.snapshot.claims.every((c) => c.calibratedProbability === null), 'ninguna afirmación trae probabilidad');
assert(r1.snapshot.coverage.find((a) => a.ambito === 'interaccion')?.observed === false, 'interacción declarada sin oportunidad');

// ── 5. Decisión del catálogo + veredicto humano ────────────────────────────
const decision = await post('/me/decision', {}, 'decisión');
assert(decision.selected === 'practicar_con_apoyo', `decisión: ${decision.label} (1 de 3 → practicar con apoyo)`);
assert(decision.reasons[0].referenceId === 'desempeno_independiente:clasificar_fuentes', 'la razón cita la afirmación que la motiva');

const d = [];
enter('decision', d);
const dOpp = [`decision:${decision.decisionId}`, 'recomendacion_ia'];
d.push(make('recommendation_presented', dOpp, { selected: decision.selected }), make('reasons_opened', dOpp));
d.push(make('recommendation_reviewed', dOpp, { verdict: 'edited', verdictLabel: 'cambiada por otra opción', chosen: 'verificar_sin_apoyo' }));
await send(d, 'eventos de la decisión');
const review = await post(`/me/decisions/${decision.decisionId}/review`, { verdict: 'edited', chosen: 'verificar_sin_apoyo' }, 'veredicto');
assert(review.assigned.id === 'verificar_sin_apoyo' && review.assigned.content.hintAvailable === false, 'el veredicto humano decide el contenido asignado (sin pista)');

// ── 6. Contraste + outcome ─────────────────────────────────────────────────
const k = [];
enter('contraste', k);
o = task(k, 'k1', false);
k.push(make('response_submitted', o, { correct: true, attempt: 1 }), make('task_completed', o));
await send(k, 'eventos del contraste');
await post('/me/outcomes', { decisionId: decision.decisionId, interventionId: review.assigned.id, metrics: { independiente: true, resuelta: true } }, 'outcome');
console.log('✓ outcome registrado sobre la decisión');

const r2 = await get('/me/report', 'retrato encadenado');
const skill = r2.snapshot.claims.find((c) => c.key === 'desempeno_independiente:clasificar_fuentes');
assert(nd(r2, 'desempeno_independiente:clasificar_fuentes') === '2/4', 'tras el contraste: 2 de 4');
assert(skill.previousClaimRef && skill.change?.startsWith('Antes 1 de 3; ahora 2 de 4'), `instantánea encadenada: "${skill.change}"`);
assert(r2.snapshot.snapshotId !== r1.snapshot.snapshotId, 'nueva instantánea, la anterior se conserva');

// ── 7. Revisión de la persona (solo cambia el estado de revisión) ──────────
const rv = [];
enter('retrato', rv);
rv.push(make('claim_reviewed', ['retrato:busqueda_de_ayuda', 'revision_afirmacion'], { claimKey: 'busqueda_de_ayuda', verdict: 'si' }, 'reported'));
await send(rv, 'revisión de afirmación');
const r3 = await get('/me/report', 'retrato revisado');
const help3 = r3.snapshot.claims.find((c) => c.key === 'busqueda_de_ayuda');
const help2 = r2.snapshot.claims.find((c) => c.key === 'busqueda_de_ayuda');
assert(help3.reviewStatus === 'confirmada' && help3.evidenceStatus === help2.evidenceStatus, 'revisión "sí" → confirmada; la evidencia no cambia');

// ── 8. Traza, recálculo y exportación ──────────────────────────────────────
const trace = await get(`/me/claims/${encodeURIComponent('desempeno_independiente:clasificar_fuentes')}/trace`, 'traza');
assert(trace.events.length === skill.evidenceRefs.length && trace.events.length > 0, `traza: ${trace.events.length} eventos detrás de la afirmación`);
const replay = await get('/me/replay', 'recálculo');
assert(replay.reproducible === true, `recálculo desde ${replay.events} eventos: idéntico`);
const exported = await get('/me/export', 'exportación');
assert(exported.schema === 'dala.research-export.v1', 'exportación seudónima para investigación');
assert(!JSON.stringify(exported).includes('Pulso Smoke'), 'la exportación no contiene el nombre');

// ── 9. Vista de investigación ──────────────────────────────────────────────
const admin = { 'X-Team-Admin-Code': ADMIN_CODE };
const members = await get('/admin/members', 'lista de participantes', admin);
const me = members.find((x) => x.memberId === joined.member.memberId);
assert(me, 'la persona aparece en la vista de investigación');
const adminReport = await get(`/admin/members/${me.memberId}/report`, 'retrato desde investigación', admin);
assert(adminReport.snapshot.claims.length === r3.snapshot.claims.length, 'investigación ve el mismo retrato');

console.log('\nPiloto D.A.L.A. verificado de punta a punta.');
