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
const FRAMEWORK = 'pulso-web@0.4';
/** Versión de cada escena en el marco 0.2 (las demás siguen en 0.1). */
const SCENE_VERSION = { nucleo: '0.3', caso: '0.3', fuentes: '0.3', instantanea: '0.3', superpoderes: '0.4', motivaciones: '0.4', desafio: '0.4', desafio_priorizar: '0.4', desafio_codigo: '0.4', desafio_informe: '0.4', desafio_mensaje: '0.4', equipo: '0.4', trabajo: '0.4', decision: '0.4' };

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

// ── 1. Inscripción con consentimiento por finalidad ────────────────────────
const registerAs = (name, consent) =>
  fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email: `smoke+${randomUUID().slice(0, 8)}@synapxix.test`, age: 52, area: 'Tecnología y datos', consent }),
  });

// Sin aceptar no se entra: no existe un recorrido sin registro.
const refused = await registerAs('Pulso Sin Aceptar', { accepted: false });
assert(refused.status === 400 && (await refused.text()).includes('consent_required'), 'sin aceptar la autorización no hay inscripción (400)');

const joined = await json(await registerAs('Pulso Smoke', { accepted: true }), 'inscripción');
assert(joined.token && joined.subjectId, `sujeto seudónimo creado (${joined.subjectId.slice(0, 8)})`);
assert(joined.consent.scopeId === 'team-primer-pulso-v3' && joined.consent.researchAllowed, 'consentimiento v3 aceptado');
const { token, subjectId, consent } = joined;
const auth = { Authorization: `Bearer ${token}` };

/** El servidor limita a 20 peticiones cada 10 s: ante un 429 se espera y se reintenta. */
const politeFetch = async (url, init) => {
  for (let tries = 0; ; tries += 1) {
    const res = await fetch(url, init);
    if (res.status !== 429 || tries === 6) return res;
    await new Promise((r) => setTimeout(r, 2000));
  }
};
const post = (path, body, label) =>
  politeFetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...auth }, body: JSON.stringify(body) }).then((r) =>
    json(r, label),
  );
const get = (path, label, headers = auth) => politeFetch(`${API}${path}`, { headers }).then((r) => json(r, label));

// ── 2. Constructor de eventos v2 (lo que hace DalaBridge en la app) ────────
const sessionId = randomUUID();
let seq = 0;
let scene = 'nucleo';
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

// ── 3. Aprender D.A.L.A. (06–09) ───────────────────────────────────────────
const a = [make('session_started', null, {}, 'system')];
const nodes = ['evidencia', 'estado', 'decision', 'intervencion', 'resultado', 'actualizacion'];
nodes.forEach((n) => a.push(make('exploration_offered', [`nucleo:${n}`, 'exploracion'])));
nodes.slice(0, 3).forEach((n) => a.push(make('exploration_opened', [`nucleo:${n}`, 'exploracion'], { text: n })));
enter('caso', a);
let o = task(a, 'ana');
a.push(make('action_performed', o, { action: 'select', item: 'a' }), make('answer_revised', o, { action: 'select', item: 'b' }));
a.push(make('response_submitted', o, { correct: true, attempt: 1, choice: 'b' }), make('task_completed', o));
enter('fuentes', a);
o = task(a, 'f1');
a.push(make('response_submitted', o, { correct: true, attempt: 1 }), make('task_completed', o));
o = task(a, 'f2');
a.push(make('response_submitted', o, { correct: false, attempt: 1 }), make('task_skipped', o));
o = task(a, 'f3');
a.push(make('response_submitted', o, { correct: false, attempt: 1 }), make('response_submitted', o, { correct: true, attempt: 2 }), make('task_completed', o));
enter('instantanea', a);
const batchA = await send(a, 'ingesta del tramo D.A.L.A.');
assert(batchA.every((r) => r.status === 'accepted'), `${a.length} eventos del tramo 06–09 aceptados`);

const nd = (report, key) => {
  const c = report.snapshot.claims.find((x) => x.key === key);
  return c ? `${c.observation.numerator}/${c.observation.denominator}` : 'falta';
};
const rA = await get('/me/report', 'instantánea A');
assert(nd(rA, 'exploracion_voluntaria') === '3/6', 'instantánea A: abrió 3 de 6 componentes del núcleo');
assert(nd(rA, 'desempeno_independiente:clasificar_fuentes') === '1/3', 'instantánea A: 1 de 3 tarjetas sin ayuda');
assert(nd(rA, 'desempeno_independiente:detectar_sobreinferencia') === '1/1', 'instantánea A: el caso de Ana, al primer intento');
assert(nd(rA, 'autocorreccion_previa') === '1/1', 'instantánea A: revisó su lectura antes de comprobar');
assert(rA.snapshot.coverage.find((c) => c.ambito === 'digital_ia')?.observed === false, 'instantánea A: IA todavía sin oportunidad');
const snapshotA = rA.snapshot.snapshotId;

const ia = [];
o = task(ia, 'exagerada', false);
ia.push(make('action_performed', o, { action: 'select', item: 'etiqueta' }), make('response_submitted', o, { correct: true, attempt: 1, choice: 'etiqueta' }), make('task_completed', o));
ia.push(make('declaration_made', ['instantanea:desacuerdo', 'declaracion'], { field: 'instantanea', value: 'no_me_representa', snapshotId: snapshotA }, 'reported'));
enter('superpoderes', ia);
await send(ia, 'eventos de la instantánea A');

// ── 4. Tu primera semana ───────────────────────────────────────────────────
const m = [];
// Lunes · superpoderes: diseñar y escribir (crear), investigar (analizar); quiere aprender a programar.
[
  ['disenar', 'crear', 'Crear', 'Diseñar'],
  ['escribir', 'crear', 'Crear', 'Escribir'],
  ['investigar', 'analizar', 'Analizar', 'Investigar'],
].forEach(([id, value, label, skill], k) => {
  const s = [`superpoderes:${k + 1}`, 'habilidad'];
  m.push(make('options_presented', s, { options: ['disenar', 'investigar', 'ensenar', 'programar'] }));
  m.push(make('declaration_made', s, { field: 'superpoder', value, label, skill, id }, 'reported'));
});
m.push(make('options_presented', ['superpoderes:aprender', 'declaracion'], { options: ['programar'] }));
m.push(make('declaration_made', ['superpoderes:aprender', 'declaracion'], { field: 'aprender', value: 'programar', label: 'Programar' }, 'reported'));

// Martes · motivaciones: impacto ×3, aprender ×2, equipo ×1.
enter('motivaciones', m);
[
  ['impacto', 'Ver el impacto'],
  ['equipo', 'Ser parte de un buen equipo'],
  ['aprender', 'Aprender cosas nuevas'],
  ['impacto', 'Ver el impacto'],
  ['aprender', 'Aprender cosas nuevas'],
  ['impacto', 'Ver el impacto'],
].forEach(([value, label], k) => {
  const p = [`motivaciones:par-${k + 1}`, 'motivacion'];
  m.push(make('options_presented', p, { options: ['a', 'b'] }), make('declaration_made', p, { field: 'motivacion', value, label }, 'reported'));
});

// Miércoles · elige «el informe con un error», sin pista.
enter('desafio', m);
m.push(make('choice_offered', ['desafio:tarea', 'eleccion_tarea'], { options: ['priorizar', 'codigo', 'informe', 'mensaje'] }));
m.push(make('choice_offered', ['desafio:modo', 'eleccion_desafio'], { options: ['con_pista', 'sin_pista'] }));
m.push(make('choice_made', ['desafio:tarea', 'eleccion_tarea'], { choice: 'informe', families: ['analizar'] }));
m.push(make('choice_made', ['desafio:modo', 'eleccion_desafio'], { choice: 'sin_pista' }));
enter('desafio_informe', m);
m.push(make('instruction_presented', ['desafio_informe:consigna', 'consigna']), make('instructions_opened', ['desafio_informe:consigna', 'consigna']));
o = task(m, 'r1', false);
m.push(make('action_performed', o, { action: 'select', item: 1 }), make('answer_revised', o, { action: 'select', item: 3, previous: 1 }));
m.push(make('response_submitted', o, { correct: true, attempt: 1, choice: 3 }), make('task_completed', o));
m.push(make('exploration_offered', ['desafio_informe:r1:porque', 'exploracion']), make('exploration_opened', ['desafio_informe:r1:porque', 'exploracion']));
o = task(m, 'r2', false);
m.push(make('action_performed', o, { action: 'select', item: 1 }), make('response_submitted', o, { correct: false, attempt: 1, choice: 1 }));
m.push(make('answer_revised', o, { action: 'select', item: 3, previous: 1 }), make('response_submitted', o, { correct: true, attempt: 2, choice: 3 }), make('task_completed', o));
m.push(make('exploration_offered', ['desafio_informe:r2:porque', 'exploracion']));

// Jueves · con el equipo: de frente ×2, ofrecer ayuda, ajustar el plan; a Lucía y a la IA; corrige el resumen.
enter('equipo', m);
[
  ['directo', 'Hablarlo de frente'],
  ['directo', 'Hablarlo de frente'],
  ['ayuda', 'Ofrecer ayuda'],
  ['plan', 'Ajustar el plan'],
].forEach(([choice, label], k) => {
  const s = [`equipo:situacion-${k + 1}`, 'situacion_equipo'];
  m.push(make('choice_offered', s, { options: ['directo', 'ayuda', 'plan', 'sumar'] }), make('choice_made', s, { choice, label }));
});
for (const [k, choice] of [[1, 'persona'], [2, 'ia']]) {
  const ap = [`equipo:apoyo-${k}`, 'eleccion_apoyo'];
  m.push(make('choice_offered', ap, { options: ['solo', 'persona', 'ia', 'despues'] }), make('choice_made', ap, { choice }));
}
const resumen = ['equipo:resumen', 'recomendacion_ia'];
m.push(make('recommendation_presented', resumen, { draft: 'resumen' }), make('reasons_opened', resumen));
m.push(make('recommendation_reviewed', resumen, { verdict: 'edited', verdictLabel: 'corregirlo' }));

// Viernes · cómo trabajás: seis declaraciones de perfil.
enter('trabajo', m);
const trabajo = { forma: 'pareja', horario: 'manana', canal: 'chat', feedback: 'directo', ritmo: 'rapido', reaccion: 'reintento' };
for (const [field, value] of Object.entries(trabajo)) {
  const q = [`trabajo:${field}`, 'declaracion'];
  m.push(make('options_presented', q, { options: ['a', 'b', 'c'] }), make('declaration_made', q, { field, value, label: value }, 'reported'));
}

const batch1 = await send(m, 'ingesta de la semana');
if (!batch1.every((r) => r.status === 'accepted')) console.error(batch1.filter((r) => r.status !== 'accepted').slice(0, 3));
assert(batch1.length === m.length && batch1.every((r) => r.status === 'accepted'), `${m.length} eventos v2 aceptados`);
const again = await send(m, 'reenvío idempotente');
assert(again.every((r) => r.status === 'duplicate'), 'reenvío del mismo lote: todo duplicado, nada se cuenta dos veces');

const bad = await send(
  [make('response_submitted', null, { correct: true }), make('task_presented', ['desafio_informe:x', 'tarea'], {}, 'observed', { context: { frameworkVersion: 'otro@9' } })],
  'eventos inválidos',
);
assert(bad[0].status === 'rejected' && bad[0].reason === 'missing_opportunity', 'evento de acción sin oportunidad: rechazado');
assert(bad[1].status === 'quarantined' && bad[1].reason === 'unknown_framework_version', 'marco desconocido: en cuarentena');

const perfil = { superpoderes: ['Diseñar', 'Escribir', 'Investigar'], aprender: 'Programar', motivacion: 'Ver el impacto', trabajo: { forma: 'En pareja, compartiendo los tiempos', horario: 'A la mañana temprano' }, reunion: { dia: 'Martes', horario: '9 a 11 h' } };
await post('/declared', { perfil }, 'perfil de trabajo declarado');

// ── 5. Retrato antes de decidir ────────────────────────────────────────────
const r1 = await get('/me/report', 'retrato de la semana');
assert(r1.snapshot.frameworkVersion === FRAMEWORK, `instantánea con marco ${FRAMEWORK} y motor ${r1.snapshot.engineVersion}`);
assert(nd(r1, 'habilidades_declaradas') === '2/3', 'superpoderes: «Crear» en 2 de 3');
assert(r1.snapshot.claims.find((c) => c.key === 'habilidades_declaradas')?.origins.join() === 'reported', 'los superpoderes viajan como declaración');
assert(nd(r1, 'motivaciones_declaradas') === '3/6', 'motivaciones: «Ver el impacto» 3 de 6');
assert(nd(r1, 'coherencia_habilidad') === '1/1', 'eligió un desafío de una familia que declaró como fuerte');
assert(nd(r1, 'busqueda_de_desafio') === '1/1', 'eligió jugar sin pista');
assert(nd(r1, 'desempeno_independiente:analizar_informe') === '1/2', 'el informe: 1 de 2 al primer intento');
assert(nd(r1, 'consulta_de_consigna') === '1/1', 'consultó la consigna antes de empezar');
assert(nd(r1, 'estilo_colaboracion') === '2/4', 'con el equipo: «Hablarlo de frente» en 2 de 4');
assert(nd(r1, 'apoyo_en_personas') === '1/2', 'se apoyó en una persona en 1 de 2 momentos');
assert(r1.snapshot.coverage.find((a) => a.ambito === 'interaccion')?.observed === true, 'el ámbito de trabajo en equipo tiene evidencia');
assert(r1.declared.perfil?.trabajo?.forma === perfil.trabajo.forma && r1.declared.perfil?.superpoderes?.length === 3, 'el perfil de trabajo queda guardado aparte');
assert(r1.declared.perfil?.reunion?.dia === 'Martes' && r1.declared.perfil?.reunion?.horario === '9 a 11 h', 'el día y horario de la charla de 16 minutos quedan guardados');
assert(r1.snapshot.claims.every((c) => c.calibratedProbability === null), 'ninguna afirmación trae probabilidad');

// ── 6. La IA propone por dónde empezar + veredicto humano ──────────────────
const decision = await post('/me/decision', {}, 'decisión');
assert(decision.selected === 'linea_experiencias', `sugerencia: ${decision.label} (superpoderes de «Crear»)`);
assert(decision.reasons[0].referenceId === 'habilidades_declaradas', 'la razón cita los superpoderes');
assert(decision.alternatives.some((a) => a.id === 'rotacion'), 'rotar el primer mes queda como alternativa');

const d = [];
enter('decision', d);
const dOpp = [`decision:${decision.decisionId}`, 'recomendacion_ia'];
d.push(make('recommendation_presented', dOpp, { selected: decision.selected }), make('reasons_opened', dOpp));
d.push(make('recommendation_reviewed', dOpp, { verdict: 'edited', verdictLabel: 'cambiada por otra opción', chosen: 'linea_datos' }));
await send(d, 'eventos de la decisión');
const review = await post(`/me/decisions/${decision.decisionId}/review`, { verdict: 'edited', chosen: 'linea_datos' }, 'veredicto');
assert(review.assigned.id === 'linea_datos', 'el veredicto humano decide: empieza por «Datos y modelo D.A.L.A.»');

const r2 = await get(`/me/report?since=${snapshotA}`, 'retrato encadenado');
const baseSkill = r2.baseline?.claims.find((c) => c.key === 'desempeno_independiente:clasificar_fuentes');
assert(r2.baseline?.snapshotId === snapshotA && baseSkill?.numerator === 1 && baseSkill?.denominator === 3, 'el retrato trae la instantánea A para comparar: antes 1 de 3');
assert(r2.snapshot.snapshotId !== r1.snapshot.snapshotId, 'nueva instantánea, la anterior se conserva');
assert(nd(r2, 'colaboracion_critica_ia') === '2/2', 'abrió las razones de la IA en 2 de 2 propuestas');
const skill = r2.snapshot.claims.find((c) => c.key === 'desempeno_independiente:analizar_informe');

// ── 7. Revisión de la persona (solo cambia el estado de revisión) ──────────
const rv = [];
enter('retrato', rv);
rv.push(make('claim_reviewed', ['retrato:estilo_colaboracion', 'revision_afirmacion'], { claimKey: 'estilo_colaboracion', verdict: 'si' }, 'reported'));
await send(rv, 'revisión de afirmación');
const r3 = await get('/me/report', 'retrato revisado');
const team3 = r3.snapshot.claims.find((c) => c.key === 'estilo_colaboracion');
const team2 = r2.snapshot.claims.find((c) => c.key === 'estilo_colaboracion');
assert(team3.reviewStatus === 'confirmada' && team3.evidenceStatus === team2.evidenceStatus, 'revisión "sí" → confirmada; la evidencia no cambia');

// ── 8. Traza, recálculo y exportación ──────────────────────────────────────
const trace = await get(`/me/claims/${encodeURIComponent('desempeno_independiente:analizar_informe')}/trace`, 'traza');
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

// ── 10. CV y enlaces (separados de D.A.L.A.) ───────────────────────────────
const tinyPdf = Buffer.from('%PDF-1.4 1 0 obj<<>>endobj trailer<<>> %%EOF').toString('base64');
const noConsent = await fetch(`${API}/me/cv`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...auth },
  body: JSON.stringify({ consent: false, links: ['https://example.org'] }),
});
assert(noConsent.status === 400, 'sin autorizar, el CV no se guarda (400)');
const cvSaved = await post('/me/cv', { consent: true, cv: { filename: 'cv-prueba.pdf', mime: 'application/pdf', base64: tinyPdf }, links: ['https://example.org/portafolio'] }, 'CV');
assert(cvSaved.cv === true && cvSaved.links === 1, 'CV y un enlace guardados');
const docs = await get(`/admin/members/${me.memberId}/documents`, 'documentos desde investigación', admin);
const cvDoc = docs.find((d) => d.kind === 'cv');
const file = await fetch(`${API}/admin/members/${me.memberId}/documents/${cvDoc.documentId}`, { headers: admin });
assert(file.ok && (await file.arrayBuffer()).byteLength === Buffer.from(tinyPdf, 'base64').length, 'investigación descarga el CV intacto');
const exported2 = await get('/me/export', 'exportación tras el CV');
assert(!JSON.stringify(exported2).includes('cv-prueba'), 'el CV no aparece en la exportación de D.A.L.A.');

console.log('\nPiloto D.A.L.A. verificado de punta a punta.');
