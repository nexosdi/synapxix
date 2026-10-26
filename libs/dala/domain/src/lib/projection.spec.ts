/**
 * Traza dorada del piloto web. Recorre todas las escenas con un guion fijo
 * y valores esperados calculados a mano. Si el motor cambia lo que deriva
 * de esta traza, la prueba falla: cualquier cambio de método debe ser
 * deliberado y versionado.
 */
import { DALA_EVENT_SCHEMA_V2, type DalaEventTypeV2, type DalaEventV2 } from '@nexosdi.synapxix/dala/contracts';
import { PULSO_WEB_FRAMEWORK } from '@nexosdi.synapxix/dala/framework';
import { canonicalJson, decideNext, orderEvents, projectSubject } from './projection';

const SUBJECT = 'subj-gold';

function makeTrace(sessionId = 'ses-1', startAt = '2026-10-26T15:00:00Z', seqStart = 0) {
  let seq = seqStart;
  let t = Date.parse(startAt);
  const events: DalaEventV2[] = [];
  const ev = (
    type: DalaEventTypeV2,
    scene: string,
    opp?: [string, string],
    payload: Record<string, unknown> = {},
    origin: DalaEventV2['origin'] = 'observed',
  ) => {
    seq += 1;
    t += 1000;
    events.push({
      schemaVersion: DALA_EVENT_SCHEMA_V2,
      eventId: `${sessionId}-e${seq}`,
      subjectId: SUBJECT,
      sessionId,
      occurredAt: new Date(t).toISOString(),
      sequence: seq,
      eventType: type,
      origin,
      source: { applicationId: 'test', instrumentId: scene, instrumentVersion: '0.1' },
      scene: { id: scene, version: '0.1' },
      ...(opp ? { opportunity: { id: opp[0], kind: opp[1] } } : {}),
      context: { frameworkVersion: PULSO_WEB_FRAMEWORK.version, deviceClass: 'desktop' },
      payload,
      consent: { scopeId: 'c1', researchAllowed: true },
    });
  };
  const task = (scene: string, id: string, withSupport = true) => {
    const o: [string, string] = [`${scene}:${id}`, 'tarea'];
    ev('task_presented', scene, o);
    ev('options_presented', scene, o, { options: ['a', 'b', 'c'] });
    if (withSupport) ev('support_available', scene, o, { support: 'pista' });
    return o;
  };
  return { ev, task, events };
}

/** El guion completo de la traza dorada. */
function goldenTrace() {
  const { ev, task, events } = makeTrace();
  ev('session_started', 'portal');
  ev('options_presented', 'portal', ['portal:puerta', 'declaracion'], { options: ['visual', 'story', 'logic'] });
  ev('declaration_made', 'portal', ['portal:puerta', 'declaracion'], { field: 'puerta', value: 'visual', label: 'Ver el sistema' }, 'reported');

  // Misión 1: consigna antes de actuar; c1 bien; c2 error→pista→bien; c3 error→omitir.
  ev('scene_started', 'observatorio');
  ev('instruction_presented', 'observatorio', ['observatorio:consigna', 'consigna']);
  ev('instructions_opened', 'observatorio', ['observatorio:consigna', 'consigna']);
  let o = task('observatorio', 'c1');
  ev('response_submitted', 'observatorio', o, { correct: true, attempt: 1 });
  ev('task_completed', 'observatorio', o);
  ev('exploration_offered', 'observatorio', ['observatorio:c1:porque', 'exploracion']);
  ev('exploration_opened', 'observatorio', ['observatorio:c1:porque', 'exploracion']);
  o = task('observatorio', 'c2');
  ev('response_submitted', 'observatorio', o, { correct: false, attempt: 1 });
  ev('hint_requested', 'observatorio', o, { level: 1 });
  ev('support_delivered', 'observatorio', o, { support: 'pista' });
  ev('response_submitted', 'observatorio', o, { correct: true, attempt: 2 });
  ev('task_completed', 'observatorio', o);
  ev('exploration_offered', 'observatorio', ['observatorio:c2:porque', 'exploracion']);
  o = task('observatorio', 'c3');
  ev('response_submitted', 'observatorio', o, { correct: false, attempt: 1 });
  ev('task_skipped', 'observatorio', o);
  ev('scene_completed', 'observatorio');

  // Misión 2: elige "mapa" (coherente); sin consigna; deshace; falla; cambia de enfoque; acierta.
  ev('choice_offered', 'ciclo', ['ciclo:formato', 'eleccion_formato'], { options: ['mapa', 'historia', 'reglas'] });
  ev('choice_made', 'ciclo', ['ciclo:formato', 'eleccion_formato'], { choice: 'mapa' });
  ev('instruction_presented', 'ciclo', ['ciclo:consigna', 'consigna']);
  o = task('ciclo', 'secuencia');
  ev('action_performed', 'ciclo', o, { action: 'place', item: 'Evidencia' });
  ev('answer_revised', 'ciclo', o, { action: 'undo' });
  ev('action_performed', 'ciclo', o, { action: 'place', item: 'Estado' });
  ev('response_submitted', 'ciclo', o, { correct: false, attempt: 1 });
  ev('strategy_changed', 'ciclo', o, { from: 'adelante', to: 'atras' });
  ev('action_performed', 'ciclo', o, { action: 'place', item: 'Actualización' });
  ev('response_submitted', 'ciclo', o, { correct: true, attempt: 2 });
  ev('task_completed', 'ciclo', o);

  // Misión 3: elige "historia" (no coherente); cambia la selección; acierta; abre la consigna después.
  ev('choice_offered', 'camara', ['camara:formato', 'eleccion_formato'], { options: ['reglas', 'historia', 'mapa'] });
  ev('choice_made', 'camara', ['camara:formato', 'eleccion_formato'], { choice: 'historia' });
  ev('instruction_presented', 'camara', ['camara:consigna', 'consigna']);
  o = task('camara', 'eco-1');
  ev('action_performed', 'camara', o, { action: 'select', item: 1 });
  ev('answer_revised', 'camara', o, { action: 'select', item: 2 });
  ev('response_submitted', 'camara', o, { correct: true, attempt: 1 });
  ev('instructions_opened', 'camara', ['camara:consigna', 'consigna']);
  ev('task_completed', 'camara', o);

  // Decisión: abre razones y aprueba.
  ev('recommendation_presented', 'decision', ['decision:d1', 'recomendacion_ia'], { selected: 'practicar_con_apoyo' });
  ev('reasons_opened', 'decision', ['decision:d1', 'recomendacion_ia']);
  ev('recommendation_reviewed', 'decision', ['decision:d1', 'recomendacion_ia'], { verdict: 'approved', verdictLabel: 'aprobada' });

  // Contraste sin pista disponible: bien al primer intento.
  o = task('contraste', 'k1', false);
  ev('response_submitted', 'contraste', o, { correct: true, attempt: 1 });
  ev('task_completed', 'contraste', o);
  return { events, ev, task };
}

const byKey = (snap: ReturnType<typeof projectSubject>) => new Map(snap.claims.map((c) => [c.key, c]));
const nd = (snap: ReturnType<typeof projectSubject>, key: string) => {
  const c = byKey(snap).get(key);
  return c ? [c.observation.numerator, c.observation.denominator] : null;
};

describe('proyección · traza dorada', () => {
  const { events } = goldenTrace();
  const snap = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK);

  it('deriva exactamente los numeradores y denominadores esperados', () => {
    expect(nd(snap, 'desempeno_independiente:clasificar_fuentes')).toEqual([2, 4]);
    expect(nd(snap, 'desempeno_independiente:ciclo_dala')).toEqual([0, 1]);
    expect(nd(snap, 'desempeno_independiente:detectar_sobreinferencia')).toEqual([1, 1]);
    expect(nd(snap, 'busqueda_de_ayuda')).toEqual([1, 3]);
    expect(nd(snap, 'persistencia_tras_error')).toEqual([2, 3]);
    expect(nd(snap, 'consulta_de_consigna')).toEqual([1, 3]);
    expect(nd(snap, 'cambio_de_estrategia')).toEqual([1, 1]);
    expect(nd(snap, 'autocorreccion_previa')).toEqual([2, 3]);
    expect(nd(snap, 'exploracion_voluntaria')).toEqual([1, 2]);
    expect(nd(snap, 'coherencia_declarado_observado')).toEqual([1, 2]);
    expect(nd(snap, 'colaboracion_critica_ia')).toEqual([1, 1]);
  });

  it('redacta afirmaciones con denominador, sin etiquetas y sin probabilidad', () => {
    const c = byKey(snap);
    expect(c.get('busqueda_de_ayuda')?.claim).toBe(
      'Pidió ayuda después de intentar en 1 de 3 tareas en las que tuvo dificultad y la ayuda estaba disponible.',
    );
    expect(c.get('desempeno_independiente:clasificar_fuentes')?.claim).toBe(
      'Resolvió sin ayuda y al primer intento 2 de 4 tareas de distinguir lo observado, lo declarado y lo inferido. Resolvió 1 más después de recibir una pista. Omitió 1.',
    );
    expect(c.get('coherencia_declarado_observado')?.claim).toContain('«Ver el sistema»');
    expect(c.get('coherencia_declarado_observado')?.origins).toEqual(['reported', 'observed']);
    expect(c.get('colaboracion_critica_ia')?.claim).toContain('«aprobada»');
    for (const claim of snap.claims) {
      expect(claim.calibratedProbability).toBeNull();
      expect(claim.claim).not.toMatch(/%/);
      if (claim.observation.denominator > 0) expect(claim.evidenceRefs.length).toBeGreaterThan(0);
    }
  });

  it('asigna estados de evidencia según la ficha', () => {
    const c = byKey(snap);
    expect(c.get('desempeno_independiente:clasificar_fuentes')?.evidenceStatus).toBe('hipotesis_provisional');
    expect(c.get('cambio_de_estrategia')?.evidenceStatus).toBe('hipotesis_provisional');
  });

  it('declara como no observado el ámbito sin oportunidades', () => {
    const interaccion = snap.coverage.find((a) => a.ambito === 'interaccion');
    expect(interaccion?.observed).toBe(false);
    expect(snap.coverage.filter((a) => a.observed).length).toBe(6);
  });

  it('es determinista ante desorden y duplicados (reprocesamiento reproducible)', () => {
    const shuffled = [...events].reverse();
    shuffled.splice(10, 0, events[12], events[20]);
    const again = projectSubject(SUBJECT, shuffled, PULSO_WEB_FRAMEWORK);
    expect(again).toEqual(snap);
  });

  it('trata la misma tarea en otra sesión como otra oportunidad', () => {
    const s2 = makeTrace('ses-2', '2026-10-27T15:00:00Z');
    s2.ev('session_started', 'portal');
    s2.ev('instruction_presented', 'observatorio', ['observatorio:consigna', 'consigna']);
    const o = s2.task('observatorio', 'c1');
    s2.ev('response_submitted', 'observatorio', o, { correct: true, attempt: 1 });
    s2.ev('task_completed', 'observatorio', o);
    s2.ev('instructions_opened', 'observatorio', ['observatorio:consigna', 'consigna']);
    const both = projectSubject(SUBJECT, [...events, ...s2.events], PULSO_WEB_FRAMEWORK);
    expect(nd(both, 'desempeno_independiente:clasificar_fuentes')).toEqual([3, 5]);
    // La consigna de la sesión 2 se abrió después de su propia primera respuesta.
    expect(nd(both, 'consulta_de_consigna')).toEqual([1, 4]);
  });

  it('ordena por sesión y secuencia aunque las sesiones lleguen al revés', () => {
    const s2 = makeTrace('ses-2', '2026-10-27T15:00:00Z');
    s2.ev('session_started', 'portal');
    const ordered = orderEvents([...s2.events, ...events]);
    expect(ordered.at(0)?.sessionId).toBe('ses-1');
    expect(ordered.at(-1)?.sessionId).toBe('ses-2');
  });

  it('propone practicar con apoyo con 2 de 4 y cita la afirmación que lo motiva', () => {
    const decision = decideNext(snap, PULSO_WEB_FRAMEWORK);
    expect(decision.selected).toBe('practicar_con_apoyo');
    expect(decision.reasons[0].referenceId).toBe('desempeno_independiente:clasificar_fuentes');
    expect(decision.alternatives.map((a) => a.id).sort()).toEqual(['recoger_evidencia', 'verificar_sin_apoyo']);
    expect(decision.content).toEqual({ scene: 'contraste', hintAvailable: true });
  });

  it('pide más evidencia cuando no la hay', () => {
    const empty = projectSubject(SUBJECT, [], PULSO_WEB_FRAMEWORK);
    expect(decideNext(empty, PULSO_WEB_FRAMEWORK).selected).toBe('recoger_evidencia');
    expect(empty.claims.every((c) => c.evidenceStatus === 'sin_oportunidad_suficiente')).toBe(true);
  });
});

describe('proyección · actualización y revisión', () => {
  it('encadena con la afirmación anterior y explica el cambio', () => {
    const { events, ev, task } = goldenTrace();
    const first = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK);
    const previous = first.claims.map((c) => ({ ...c, claimId: `${c.key}@snap-1` }));

    const o = task('contraste', 'k2', false);
    ev('response_submitted', 'contraste', o, { correct: true, attempt: 1 });
    ev('task_completed', 'contraste', o);
    const second = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK, { previous });

    const claim = second.claims.find((c) => c.key === 'desempeno_independiente:clasificar_fuentes');
    expect(claim?.previousClaimRef).toBe('desempeno_independiente:clasificar_fuentes@snap-1');
    expect(claim?.change).toBe('Antes 2 de 4; ahora 3 de 5.');
    const unchanged = second.claims.find((c) => c.key === 'exploracion_voluntaria');
    expect(unchanged?.change).toBeNull();

    // Una tercera instantánea sin evidencia nueva conserva el último cambio.
    const third = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK, {
      previous: second.claims.map((c) => ({ ...c, claimId: `${c.key}@snap-2` })),
    });
    const kept = third.claims.find((c) => c.key === 'desempeno_independiente:clasificar_fuentes');
    expect(kept?.change).toBe('Antes 2 de 4; ahora 3 de 5.');
    expect(kept?.previousClaimRef).toBe('desempeno_independiente:clasificar_fuentes@snap-2');
  });

  it('explica en palabras un cambio desde cero oportunidades', () => {
    const { events } = goldenTrace();
    const beforeDecision = events.filter((e) => e.scene.id !== 'decision' && e.scene.id !== 'contraste');
    const first = projectSubject(SUBJECT, beforeDecision, PULSO_WEB_FRAMEWORK);
    const previous = first.claims.map((c) => ({ ...c, claimId: `${c.key}@snap-1` }));
    const second = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK, { previous });

    expect(second.claims.find((c) => c.key === 'colaboracion_critica_ia')?.change).toBe(
      'Antes no había oportunidades; ahora 1 de 1. La evidencia pasó de «sin oportunidad suficiente» a «hipótesis provisional».',
    );
    for (const c of second.claims) expect(c.claim).not.toMatch(/\.\./);
  });

  it('la revisión de la persona cambia el estado de revisión, no la evidencia', () => {
    const { events, ev } = goldenTrace();
    ev('claim_reviewed', 'retrato', ['retrato:busqueda_de_ayuda', 'revision_afirmacion'], { claimKey: 'busqueda_de_ayuda', verdict: 'no' }, 'reported');
    ev('claim_reviewed', 'retrato', ['retrato:exploracion_voluntaria', 'revision_afirmacion'], { claimKey: 'exploracion_voluntaria', verdict: 'si' }, 'reported');
    const snap = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK);
    const c = new Map(snap.claims.map((x) => [x.key, x]));
    expect(c.get('busqueda_de_ayuda')?.reviewStatus).toBe('cuestionada');
    expect(c.get('busqueda_de_ayuda')?.observation.numerator).toBe(1);
    expect(c.get('exploracion_voluntaria')?.reviewStatus).toBe('confirmada');
    expect(c.get('persistencia_tras_error')?.reviewStatus).toBe('pendiente');
  });

  it('compara instantáneas sin depender del orden de claves del almacenamiento', () => {
    const snap = projectSubject(SUBJECT, goldenTrace().events, PULSO_WEB_FRAMEWORK);
    const reordered = JSON.parse(
      JSON.stringify(snap.claims, (_k, v) =>
        v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).reverse()) : v,
      ),
    );
    expect(JSON.stringify(reordered)).not.toBe(JSON.stringify(snap.claims));
    expect(canonicalJson(reordered)).toBe(canonicalJson(snap.claims));
  });
});
