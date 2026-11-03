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

/** El guion completo de la traza dorada (marco 0.4: aprender D.A.L.A. y la primera semana). */
function goldenTrace() {
  const { ev, task, events } = makeTrace();
  // Acto III: el núcleo (abre 1 de 2) y tres tarjetas.
  ev('session_started', 'nucleo');
  ev('exploration_offered', 'nucleo', ['nucleo:evidencia', 'exploracion']);
  ev('exploration_offered', 'nucleo', ['nucleo:estado', 'exploracion']);
  ev('exploration_opened', 'nucleo', ['nucleo:evidencia', 'exploracion']);
  let o = task('fuentes', 'f1');
  ev('response_submitted', 'fuentes', o, { correct: true, attempt: 1 });
  ev('task_completed', 'fuentes', o);
  o = task('fuentes', 'f2');
  ev('response_submitted', 'fuentes', o, { correct: false, attempt: 1 });
  ev('hint_requested', 'fuentes', o, { level: 1 });
  ev('support_delivered', 'fuentes', o, { support: 'aclaracion' });
  ev('response_submitted', 'fuentes', o, { correct: true, attempt: 2 });
  ev('task_completed', 'fuentes', o);
  o = task('fuentes', 'f3');
  ev('response_submitted', 'fuentes', o, { correct: false, attempt: 1 });
  ev('task_skipped', 'fuentes', o);

  // Superpoderes: diseñar y escribir (crear), investigar (analizar); quiere aprender a programar.
  [
    ['disenar', 'crear', 'Crear', 'Diseñar'],
    ['escribir', 'crear', 'Crear', 'Escribir'],
    ['investigar', 'analizar', 'Analizar', 'Investigar'],
  ].forEach(([id, value, label, skill], k) => {
    const s: [string, string] = [`superpoderes:${k + 1}`, 'habilidad'];
    ev('options_presented', 'superpoderes', s, { options: ['…'] });
    ev('declaration_made', 'superpoderes', s, { field: 'superpoder', value, label, skill, id }, 'reported');
  });
  ev('declaration_made', 'superpoderes', ['superpoderes:aprender', 'declaracion'], { field: 'aprender', value: 'programar', label: 'Programar' }, 'reported');

  // Motivaciones: impacto ×3, aprender ×2, equipo ×1.
  [
    ['impacto', 'Ver el impacto'],
    ['aprender', 'Aprender cosas nuevas'],
    ['impacto', 'Ver el impacto'],
    ['equipo', 'Ser parte de un buen equipo'],
    ['aprender', 'Aprender cosas nuevas'],
    ['impacto', 'Ver el impacto'],
  ].forEach(([value, label], k) => {
    const m: [string, string] = [`motivaciones:par-${k + 1}`, 'motivacion'];
    ev('options_presented', 'motivaciones', m, { options: ['a', 'b'] });
    ev('declaration_made', 'motivaciones', m, { field: 'motivacion', value, label }, 'reported');
  });

  // Elige el informe (analizar, coherente con un superpoder) y jugarlo sin red.
  ev('choice_offered', 'desafio', ['desafio:tarea', 'eleccion_tarea'], { options: ['priorizar', 'informe', 'mensaje'] });
  ev('choice_made', 'desafio', ['desafio:tarea', 'eleccion_tarea'], { choice: 'informe', families: ['analizar'] });
  ev('choice_offered', 'desafio', ['desafio:modo', 'eleccion_desafio'], { options: ['con_pista', 'sin_pista'] });
  ev('choice_made', 'desafio', ['desafio:modo', 'eleccion_desafio'], { choice: 'sin_pista' });

  // El informe: consigna antes de actuar; r1 revisa y acierta; r2 falla y sigue hasta resolver.
  ev('instruction_presented', 'desafio_informe', ['desafio_informe:consigna', 'consigna']);
  ev('instructions_opened', 'desafio_informe', ['desafio_informe:consigna', 'consigna']);
  o = task('desafio_informe', 'r1', false);
  ev('action_performed', 'desafio_informe', o, { action: 'select', item: 1 });
  ev('answer_revised', 'desafio_informe', o, { action: 'select', item: 3 });
  ev('response_submitted', 'desafio_informe', o, { correct: true, attempt: 1 });
  ev('task_completed', 'desafio_informe', o);
  ev('exploration_offered', 'desafio_informe', ['desafio_informe:r1:porque', 'exploracion']);
  ev('exploration_opened', 'desafio_informe', ['desafio_informe:r1:porque', 'exploracion']);
  o = task('desafio_informe', 'r2', false);
  ev('response_submitted', 'desafio_informe', o, { correct: false, attempt: 1 });
  ev('response_submitted', 'desafio_informe', o, { correct: true, attempt: 2 });
  ev('task_completed', 'desafio_informe', o);

  // Con el equipo: hablarlo de frente ×2, ofrecer ayuda, ajustar el plan; a Lucía y a la IA; revisa el resumen.
  [
    ['directo', 'Hablarlo de frente'],
    ['ayuda', 'Ofrecer ayuda'],
    ['directo', 'Hablarlo de frente'],
    ['plan', 'Ajustar el plan'],
  ].forEach(([choice, label], k) => {
    const s: [string, string] = [`equipo:situacion-${k + 1}`, 'situacion_equipo'];
    ev('choice_offered', 'equipo', s, { options: ['directo', 'ayuda', 'plan', 'sumar'] });
    ev('choice_made', 'equipo', s, { choice, label });
  });
  for (const [k, choice] of [[1, 'persona'], [2, 'ia']] as const) {
    const a: [string, string] = [`equipo:apoyo-${k}`, 'eleccion_apoyo'];
    ev('choice_offered', 'equipo', a, { options: ['solo', 'persona', 'ia', 'despues'] });
    ev('choice_made', 'equipo', a, { choice });
  }
  const resumen: [string, string] = ['equipo:resumen', 'recomendacion_ia'];
  ev('recommendation_presented', 'equipo', resumen);
  ev('reasons_opened', 'equipo', resumen);
  ev('recommendation_reviewed', 'equipo', resumen, { verdict: 'edited', verdictLabel: 'corregirlo' });

  // Cómo trabajás: perfil declarado, no entra a ninguna ficha.
  ev('declaration_made', 'trabajo', ['trabajo:equipo', 'declaracion'], { field: 'trabajo', value: 'pareja' }, 'reported');

  // La IA propone por dónde empezar: aprueba sin abrir las razones.
  ev('recommendation_presented', 'decision', ['decision:d1', 'recomendacion_ia'], { selected: 'linea_experiencias' });
  ev('recommendation_reviewed', 'decision', ['decision:d1', 'recomendacion_ia'], { verdict: 'approved', verdictLabel: 'aprobada' });
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
    expect(nd(snap, 'desempeno_independiente:clasificar_fuentes')).toEqual([1, 3]);
    expect(nd(snap, 'desempeno_independiente:analizar_informe')).toEqual([1, 2]);
    expect(nd(snap, 'habilidades_declaradas')).toEqual([2, 3]);
    expect(nd(snap, 'busqueda_de_ayuda')).toEqual([1, 2]);
    expect(nd(snap, 'persistencia_tras_error')).toEqual([2, 3]);
    expect(nd(snap, 'consulta_de_consigna')).toEqual([1, 1]);
    expect(nd(snap, 'autocorreccion_previa')).toEqual([1, 3]);
    expect(nd(snap, 'exploracion_voluntaria')).toEqual([2, 3]);
    expect(nd(snap, 'motivaciones_declaradas')).toEqual([3, 6]);
    expect(nd(snap, 'coherencia_habilidad')).toEqual([1, 1]);
    expect(nd(snap, 'busqueda_de_desafio')).toEqual([1, 1]);
    expect(nd(snap, 'estilo_colaboracion')).toEqual([2, 4]);
    expect(nd(snap, 'apoyo_en_personas')).toEqual([1, 2]);
    expect(nd(snap, 'colaboracion_critica_ia')).toEqual([1, 2]);
  });

  it('lee superpoderes y motivaciones como declaración, sin certificar nada', () => {
    const c = byKey(snap);
    expect(c.get('habilidades_declaradas')?.claim).toBe(
      'Eligió como superpoderes «Diseñar», «Escribir», «Investigar»: la familia que más se repite es «Crear» (2 de 3). Quiere aprender: «Programar».',
    );
    expect(c.get('habilidades_declaradas')?.origins).toEqual(['reported']);
    expect(c.get('motivaciones_declaradas')?.claim).toBe(
      'En 6 elecciones entre motivaciones, eligió «Ver el impacto» 3 veces. Le siguió «Aprender cosas nuevas».',
    );
    expect(c.get('motivaciones_declaradas')?.observation.detail['ranking']).toBe(
      'Ver el impacto:3,Aprender cosas nuevas:2,Ser parte de un buen equipo:1',
    );
  });

  it('describe el estilo de equipo con lo que eligió en cada situación', () => {
    const c = byKey(snap);
    expect(c.get('estilo_colaboracion')?.claim).toBe(
      'En 4 situaciones de equipo, eligió «Hablarlo de frente» 2 veces. Le siguió «Ofrecer ayuda».',
    );
    expect(c.get('estilo_colaboracion')?.origins).toEqual(['observed']);
    expect(c.get('coherencia_habilidad')?.origins).toEqual(['reported', 'observed']);
  });

  it('ignora eventos de otra versión del marco', () => {
    const foreign = events.map((e) => ({ ...e, eventId: `x-${e.eventId}`, sessionId: 'otra', context: { ...e.context, frameworkVersion: 'pulso-web@0.1' } }));
    expect(projectSubject(SUBJECT, [...events, ...foreign], PULSO_WEB_FRAMEWORK).claims).toEqual(snap.claims);
  });

  it('redacta afirmaciones con denominador, sin etiquetas y sin probabilidad', () => {
    const c = byKey(snap);
    expect(c.get('busqueda_de_ayuda')?.claim).toBe(
      'Pidió ayuda después de intentar en 1 de 2 tareas en las que tuvo dificultad y la ayuda estaba disponible.',
    );
    expect(c.get('desempeno_independiente:clasificar_fuentes')?.claim).toBe(
      'Resolvió sin ayuda y al primer intento 1 de 3 tareas de distinguir lo observado, lo declarado y lo inferido. Resolvió 1 más después de recibir una pista. Omitió 1.',
    );
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
    expect(c.get('motivaciones_declaradas')?.evidenceStatus).toBe('hipotesis_provisional');
  });

  it('con la primera semana, los siete ámbitos tienen evidencia', () => {
    expect(snap.coverage.filter((a) => a.observed).length).toBe(7);
  });

  it('es determinista ante desorden y duplicados (reprocesamiento reproducible)', () => {
    const shuffled = [...events].reverse();
    shuffled.splice(10, 0, events[12], events[20]);
    const again = projectSubject(SUBJECT, shuffled, PULSO_WEB_FRAMEWORK);
    expect(again).toEqual(snap);
  });

  it('trata la misma tarea en otra sesión como otra oportunidad', () => {
    const s2 = makeTrace('ses-2', '2026-10-27T15:00:00Z');
    s2.ev('session_started', 'nucleo');
    s2.ev('instruction_presented', 'desafio_informe', ['desafio_informe:consigna', 'consigna']);
    const o = s2.task('fuentes', 'f1');
    s2.ev('response_submitted', 'fuentes', o, { correct: true, attempt: 1 });
    s2.ev('task_completed', 'fuentes', o);
    const r = s2.task('desafio_informe', 'r1', false);
    s2.ev('response_submitted', 'desafio_informe', r, { correct: true, attempt: 1 });
    s2.ev('instructions_opened', 'desafio_informe', ['desafio_informe:consigna', 'consigna']);
    const both = projectSubject(SUBJECT, [...events, ...s2.events], PULSO_WEB_FRAMEWORK);
    expect(nd(both, 'desempeno_independiente:clasificar_fuentes')).toEqual([2, 4]);
    // La consigna de la sesión 2 se abrió después de su propia primera respuesta.
    expect(nd(both, 'consulta_de_consigna')).toEqual([1, 2]);
  });

  it('ordena por sesión y secuencia aunque las sesiones lleguen al revés', () => {
    const s2 = makeTrace('ses-2', '2026-10-27T15:00:00Z');
    s2.ev('session_started', 'nucleo');
    const ordered = orderEvents([...s2.events, ...events]);
    expect(ordered.at(0)?.sessionId).toBe('ses-1');
    expect(ordered.at(-1)?.sessionId).toBe('ses-2');
  });

  it('sugiere empezar por la línea de sus superpoderes y cita la afirmación', () => {
    const decision = decideNext(snap, PULSO_WEB_FRAMEWORK);
    expect(decision.selected).toBe('linea_experiencias');
    expect(decision.reasons[0].referenceId).toBe('habilidades_declaradas');
    expect(decision.reasons.map((r) => r.referenceId)).toContain('desempeno_independiente:analizar_informe');
    expect(decision.alternatives.map((a) => a.id)).toContain('rotacion');
  });

  it('sin superpoderes declarados sugiere rotar el primer mes', () => {
    const empty = projectSubject(SUBJECT, [], PULSO_WEB_FRAMEWORK);
    expect(decideNext(empty, PULSO_WEB_FRAMEWORK).selected).toBe('rotacion');
    expect(empty.claims.every((c) => c.evidenceStatus === 'sin_oportunidad_suficiente')).toBe(true);
  });
});

describe('proyección · actualización y revisión', () => {
  it('encadena con la afirmación anterior y explica el cambio', () => {
    const { events, ev, task } = goldenTrace();
    const first = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK);
    const previous = first.claims.map((c) => ({ ...c, claimId: `${c.key}@snap-1` }));

    const o = task('fuentes', 'f4', false);
    ev('response_submitted', 'fuentes', o, { correct: true, attempt: 1 });
    ev('task_completed', 'fuentes', o);
    const second = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK, { previous });

    const claim = second.claims.find((c) => c.key === 'desempeno_independiente:clasificar_fuentes');
    expect(claim?.previousClaimRef).toBe('desempeno_independiente:clasificar_fuentes@snap-1');
    expect(claim?.change).toBe('Antes 1 de 3; ahora 2 de 4.');
    const unchanged = second.claims.find((c) => c.key === 'exploracion_voluntaria');
    expect(unchanged?.change).toBeNull();

    // Una tercera instantánea sin evidencia nueva conserva el último cambio.
    const third = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK, {
      previous: second.claims.map((c) => ({ ...c, claimId: `${c.key}@snap-2` })),
    });
    const kept = third.claims.find((c) => c.key === 'desempeno_independiente:clasificar_fuentes');
    expect(kept?.change).toBe('Antes 1 de 3; ahora 2 de 4.');
    expect(kept?.previousClaimRef).toBe('desempeno_independiente:clasificar_fuentes@snap-2');
  });

  it('explica en palabras un cambio desde cero oportunidades', () => {
    const { events } = goldenTrace();
    const beforeTeam = events.filter((e) => e.scene.id !== 'equipo' && e.scene.id !== 'decision');
    const first = projectSubject(SUBJECT, beforeTeam, PULSO_WEB_FRAMEWORK);
    const previous = first.claims.map((c) => ({ ...c, claimId: `${c.key}@snap-1` }));
    const second = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK, { previous });

    expect(second.claims.find((c) => c.key === 'apoyo_en_personas')?.change).toBe(
      'Antes no había oportunidades; ahora 1 de 2. La evidencia pasó de «sin oportunidad suficiente» a «hipótesis provisional».',
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

describe('aprender D.A.L.A. (escenas 06–09, marco 0.3)', () => {
  /** El tramo que va del consentimiento a la primera instantánea. */
  function learningTrace() {
    const { ev, task, events } = makeTrace('ses-learn');
    ev('session_started', 'nucleo');
    const nodes = ['evidencia', 'estado', 'decision', 'intervencion', 'resultado', 'actualizacion'];
    nodes.forEach((n) => ev('exploration_offered', 'nucleo', [`nucleo:${n}`, 'exploracion']));
    nodes.slice(0, 4).forEach((n) => ev('exploration_opened', 'nucleo', [`nucleo:${n}`, 'exploracion']));

    // Caso de Ana: cambia de lectura antes de comprobar y acierta.
    let o = task('caso', 'ana');
    ev('action_performed', 'caso', o, { action: 'select', item: 'a' });
    ev('answer_revised', 'caso', o, { action: 'select', item: 'b' });
    ev('response_submitted', 'caso', o, { correct: true, attempt: 1, choice: 'b' });
    ev('task_completed', 'caso', o);

    // Tres tarjetas: dos al primer intento; la tercera tras error y aclaración.
    for (const id of ['f1', 'f2']) {
      o = task('fuentes', id);
      ev('response_submitted', 'fuentes', o, { correct: true, attempt: 1 });
      ev('task_completed', 'fuentes', o);
    }
    o = task('fuentes', 'f3');
    ev('response_submitted', 'fuentes', o, { correct: false, attempt: 1 });
    ev('hint_requested', 'fuentes', o, { level: 1 });
    ev('response_submitted', 'fuentes', o, { correct: true, attempt: 2 });
    ev('task_completed', 'fuentes', o);
    return events;
  }

  it('alimenta las fichas existentes sin fichas nuevas', () => {
    const snap = projectSubject(SUBJECT, learningTrace(), PULSO_WEB_FRAMEWORK);
    expect(nd(snap, 'exploracion_voluntaria')).toEqual([4, 6]);
    expect(nd(snap, 'desempeno_independiente:clasificar_fuentes')).toEqual([2, 3]);
    expect(nd(snap, 'desempeno_independiente:detectar_sobreinferencia')).toEqual([1, 1]);
    expect(nd(snap, 'autocorreccion_previa')).toEqual([1, 1]);
    expect(nd(snap, 'busqueda_de_ayuda')).toEqual([1, 1]);
    expect(byKey(snap).get('exploracion_voluntaria')?.claim).toBe(
      'Abrió el contenido opcional en 4 de 6 ocasiones en que se le ofreció.',
    );
  });

  it('la primera instantánea deja a la vista lo que todavía no se observó', () => {
    const snap = projectSubject(SUBJECT, learningTrace(), PULSO_WEB_FRAMEWORK);
    const unobserved = snap.coverage.filter((c) => !c.observed).map((c) => c.ambito);
    expect(unobserved).toEqual(['interaccion', 'digital_ia']);
    expect(byKey(snap).get('colaboracion_critica_ia')?.evidenceStatus).toBe('sin_oportunidad_suficiente');
  });
});

describe('con el equipo (apoyo en personas)', () => {
  it('cuenta a quién recurre cuando puede elegir', () => {
    const { ev, events } = makeTrace('ses-team');
    ev('session_started', 'equipo');
    const choices = ['persona', 'ia', 'persona'];
    choices.forEach((choice, k) => {
      const o: [string, string] = [`equipo:apoyo-${k + 1}`, 'eleccion_apoyo'];
      ev('choice_offered', 'equipo', o, { options: ['solo', 'persona', 'ia', 'despues'] });
      ev('choice_made', 'equipo', o, { choice });
    });
    const snap = projectSubject(SUBJECT, events, PULSO_WEB_FRAMEWORK);
    const c = byKey(snap).get('apoyo_en_personas');
    expect(nd(snap, 'apoyo_en_personas')).toEqual([2, 3]);
    expect(c?.claim).toBe(
      'Eligió apoyarse en una persona del equipo en 2 de 3 situaciones en que podía elegir. Recurrió al asistente de IA en 1.',
    );
    expect(snap.coverage.find((x) => x.ambito === 'interaccion')?.observed).toBe(true);
  });
});
