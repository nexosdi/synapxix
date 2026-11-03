import type { DalaFramework } from './types';

/**
 * Validación de integridad del marco. Corre en CI: un marco inconsistente
 * no puede llegar al motor (§19 "Registro del marco").
 */
export function validateFramework(fw: DalaFramework): string[] {
  const errors: string[] = [];
  const unique = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`${label} duplicado: ${id}`);
      seen.add(id);
    }
  };

  unique('ámbito', fw.ambitos.map((a) => a.id));
  unique('constructo', fw.constructs.map((c) => c.id));
  unique('escena', fw.scenes.map((s) => s.id));
  unique('decisión', fw.decisions.map((d) => d.id));

  const ambitos = new Set(fw.ambitos.map((a) => a.id));
  const decisions = new Set(fw.decisions.map((d) => d.id));
  const scenes = new Set(fw.scenes.map((s) => s.id));
  const opportunityKinds = new Set(fw.scenes.flatMap((s) => s.opportunities.map((o) => o.kind)));

  for (const c of fw.constructs) {
    const at = `constructo ${c.id}`;
    if (!ambitos.has(c.ambito)) errors.push(`${at}: ámbito inexistente ${c.ambito}`);
    if (!c.version) errors.push(`${at}: sin versión`);
    if (c.alternatives.length === 0) errors.push(`${at}: sin explicaciones alternativas`);
    if (!c.nextCheck) errors.push(`${at}: sin próximo contraste`);
    if (!c.limits) errors.push(`${at}: sin límites de inferencia`);
    if (!c.claimTemplate.includes('{n}') || !c.claimTemplate.includes('{d}')) {
      errors.push(`${at}: la afirmación debe declarar numerador y denominador`);
    }
    if (!opportunityKinds.has(c.opportunityKind)) {
      errors.push(`${at}: ninguna escena ofrece oportunidades "${c.opportunityKind}"`);
    }
    if (c.sufficiency.calibrated !== false) errors.push(`${at}: umbrales declarados como calibrados`);
    for (const d of c.decisionsInformed) {
      if (!decisions.has(d)) errors.push(`${at}: decisión inexistente ${d}`);
    }
  }

  for (const s of fw.scenes) {
    const at = `escena ${s.id}`;
    if (!s.version) errors.push(`${at}: sin versión`);
    if (s.skill && !(s.skill in fw.skills)) errors.push(`${at}: habilidad inexistente ${s.skill}`);
    if (!s.contrast) errors.push(`${at}: sin tarea de contraste`);
  }

  for (const d of fw.decisions) {
    if (!scenes.has(d.content.scene)) errors.push(`decisión ${d.id}: escena inexistente ${d.content.scene}`);
    if (!d.verification) errors.push(`decisión ${d.id}: sin criterio de verificación`);
  }
  if (!decisions.has(fw.baselineDecision)) errors.push(`decisión base inexistente ${fw.baselineDecision}`);

  return errors;
}

/** Atajos de consulta usados por el motor y las vistas. */
export function sceneById(fw: DalaFramework, id: string) {
  return fw.scenes.find((s) => s.id === id);
}

export function constructById(fw: DalaFramework, id: string) {
  return fw.constructs.find((c) => c.id === id);
}
