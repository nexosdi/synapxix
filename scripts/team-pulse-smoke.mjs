/**
 * Verificación E2E del Primer Pulso contra un server vivo.
 *
 * Recorre el ciclo completo tal como lo hace la app team:
 * invitación → join → 3 sesiones de instrumento (categorization,
 * timeline-order, intruder) → declarado → decisión shadow → review →
 * outcome → reporte → traza. Falla con exit code 1 si algún eslabón no
 * responde como el contrato promete.
 *
 * Uso:
 *   TEAM_ADMIN_CODE=<code> node scripts/team-pulse-smoke.mjs [baseUrl]
 */
import { randomUUID } from 'crypto';

const BASE = process.argv[2] ?? `http://localhost:${process.env.SYNAPXIX_API_PORT || process.env.PORT || 3001}`;
const API = `${BASE}/api/team/v1`;
const ADMIN_CODE = process.env.TEAM_ADMIN_CODE;

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

// ── 1. Invitación ──────────────────────────────────────────────────────────
const invites = await json(
  await fetch(`${API}/admin/invites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Team-Admin-Code': ADMIN_CODE },
    body: JSON.stringify({ people: [{ name: 'Pulso Smoke', roleLabel: 'verificación' }] }),
  }),
  'crear invitación',
);
const inviteCode = invites[0].inviteCode;
assert(/^SX-/.test(inviteCode), `código de invitación generado (${inviteCode})`);

// ── 2. Join ────────────────────────────────────────────────────────────────
const joined = await json(
  await fetch(`${API}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inviteCode, name: 'Pulso Smoke' }),
  }),
  'join con invitación',
);
assert(joined.token && joined.subjectId, 'token y subjectId emitidos');
const auth = { Authorization: `Bearer ${joined.token}`, 'Content-Type': 'application/json' };
const consent = joined.consent;

// ── 3. Sesiones de instrumento ────────────────────────────────────────────
function makeSession(instrumentId) {
  const sessionId = randomUUID();
  let sequence = 0;
  const events = [];
  const emit = (eventType, taskId, payload = {}) => {
    events.push({
      schemaVersion: 'dala.behavior-event.v1',
      eventId: randomUUID(),
      subjectId: joined.subjectId,
      sessionId,
      occurredAt: new Date().toISOString(),
      sequence: ++sequence,
      eventType,
      source: { applicationId: 'team-pulse-smoke', instrumentId, instrumentVersion: '1.0.0', gameType: instrumentId },
      context: { taskId, mode: 'learning', rewardCondition: 'none', locale: 'es' },
      payload,
      consent,
    });
  };
  return { events, emit };
}

// categorization: 4 tareas, con un error+reintento y una pista
const cat = makeSession('categorization');
for (let t = 1; t <= 4; t++) {
  const taskId = `cat-${t}`;
  cat.emit('task_presented', taskId);
  if (t === 2) {
    cat.emit('answer_submitted', taskId, { correct: false, attempt: 1 });
    cat.emit('attempt_repeated', taskId, { attempt: 2 });
    cat.emit('answer_submitted', taskId, { correct: true, attempt: 2 });
  } else if (t === 3) {
    cat.emit('answer_submitted', taskId, { correct: false, attempt: 1 });
    cat.emit('hint_requested', taskId, { level: 1 });
    cat.emit('answer_submitted', taskId, { correct: true, attempt: 2 });
  } else {
    cat.emit('answer_submitted', taskId, { correct: true, attempt: 1 });
  }
  cat.emit('answer_submitted', taskId, { correct: true, attempt: 1 });
  cat.emit('answer_submitted', taskId, { correct: true, attempt: 1 });
  cat.emit('task_completed', taskId);
}

// timeline: 2 tareas con cambio de estrategia y reintento tras fallo
const timeline = makeSession('timeline-order');
for (let t = 1; t <= 2; t++) {
  const taskId = `tl-${t}`;
  timeline.emit('task_presented', taskId);
  timeline.emit('answer_submitted', taskId, { correct: false, attempt: 1 });
  timeline.emit('strategy_changed', taskId, { from: 'desde-el-inicio', to: 'desde-el-final' });
  timeline.emit('attempt_repeated', taskId, { attempt: 2 });
  for (let s = 0; s < 5; s++) timeline.emit('answer_submitted', taskId, { correct: true, attempt: 2 });
  timeline.emit('task_completed', taskId);
}

// intruder: 4 rondas, una con pista tras intento
const intruder = makeSession('intruder');
for (let t = 1; t <= 4; t++) {
  const taskId = `in-${t}`;
  intruder.emit('task_presented', taskId);
  if (t === 2) {
    intruder.emit('answer_submitted', taskId, { correct: false, attempt: 1 });
    intruder.emit('hint_requested', taskId, { level: 1 });
    intruder.emit('attempt_repeated', taskId, { attempt: 2 });
  }
  intruder.emit('answer_submitted', taskId, { correct: true, attempt: t === 2 ? 2 : 1 });
  intruder.emit('task_completed', taskId);
}

for (const [name, session] of [
  ['categorization', cat],
  ['timeline-order', timeline],
  ['intruder', intruder],
]) {
  const wrapped = [
    { ...session.events[0], eventType: 'session_started', eventId: randomUUID(), sequence: 0, payload: {} },
    ...session.events,
    { ...session.events[0], eventType: 'session_completed', eventId: randomUUID(), sequence: session.events.length + 1, payload: {} },
  ];
  const results = await json(
    await fetch(`${API}/events/batch`, { method: 'POST', headers: auth, body: JSON.stringify({ events: wrapped }) }),
    `ingesta ${name} (${wrapped.length} eventos)`,
  );
  assert(results.every((r) => r.status === 'accepted' || r.status === 'duplicate'), `todos los eventos de ${name} aceptados`);
}

// idempotencia: reenviar el primer lote no duplica
const again = await json(
  await fetch(`${API}/events/batch`, { method: 'POST', headers: auth, body: JSON.stringify({ events: cat.events.slice(0, 3) }) }),
  'reenvío del lote (idempotencia)',
);
assert(again.every((r) => r.status === 'duplicate'), 'reingesta marcada como duplicate');

// autorización: emitir por OTRO sujeto debe rechazarse
const stolen = { ...cat.events[0], eventId: randomUUID(), subjectId: randomUUID() };
const stolenRes = await fetch(`${API}/events/batch`, { method: 'POST', headers: auth, body: JSON.stringify({ events: [stolen] }) });
assert(stolenRes.status === 403, 'suplantar subjectId devuelve 403');

// ── 4. Declarado ──────────────────────────────────────────────────────────
await json(
  await fetch(`${API}/declared`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ entryMode: 'explore', workRhythm: 'prototype', feedbackMode: 'direct', shareConditions: true }),
  }),
  'guardar declarado',
);

// ── 5. Decisión shadow → review → outcome ─────────────────────────────────
const decision = await json(await fetch(`${API}/me/decision`, { method: 'POST', headers: auth, body: '{}' }), 'decisión shadow');
assert(decision.requires_human_approval === true, 'requiresHumanApproval = true (shadow mode)');
assert(Array.isArray(decision.reasons) && decision.reasons.length > 0, 'la decisión trae razones estructuradas');

await json(
  await fetch(`${API}/me/decisions/${decision.decision_id}/review`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ verdict: 'approved', reason: 'smoke E2E' }),
  }),
  'review humana registrada',
);

const outcome = await json(
  await fetch(`${API}/me/outcomes`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ decisionId: decision.decision_id, interventionId: 'pulse-verification-v1', metrics: { completed: true, accuracy: 1 } }),
  }),
  'outcome registrado',
);
assert(outcome.outcomeId, 'outcome con id');

// ── 6. Reporte y traza ────────────────────────────────────────────────────
const report = await json(await fetch(`${API}/me/report`, { headers: auth }), 'reporte');
const constructIds = Object.keys(report.constructs);
assert(constructIds.length >= 4, `constructos estimados: ${constructIds.join(', ')}`);
assert(report.archetypes[0].affinity === 1, `arquetipo sugerido: ${report.archetypes[0].meta.label}`);
assert(report.decisions[0].humanVerdict === 'approved', 'veredicto visible en el reporte');

const trace = await json(await fetch(`${API}/me/trace/${decision.decision_id}`, { headers: auth }), 'traza completa');
assert(trace.stateSnapshot && trace.evidence.length > 0 && trace.outcomes.length > 0, `traza: snapshot + ${trace.evidence.length} evidencias + ${trace.outcomes.length} outcomes`);

console.log('\n★ Primer Pulso verificado de punta a punta.');
console.log(`  sujeto: ${joined.subjectId}`);
console.log(`  decisión: ${decision.selected_action} (${decision.objective})`);
console.log(`  constructos: ${constructIds.map((c) => `${c}=${report.constructs[c].value}`).join(' · ')}`);
