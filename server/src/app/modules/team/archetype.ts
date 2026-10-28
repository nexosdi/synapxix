/**
 * Estrella Synapxix — afinidad de arquetipos.
 *
 * VISTA NARRATIVA, no motor. Regla D.A.L.A. vigente: "los arquetipos son
 * vista narrativa opcional; jamás participan del motor de decisión". Esta
 * función mezcla lo DECLARADO por la persona con lecturas contextuales de
 * los constructos, y produce afinidades 0..1 para elegir la estrella. Nada
 * de lo que sale de aquí vuelve a entrar a la política ni a las estimaciones.
 */

export const TEAM_ARCHETYPES = [
  'explorador_creativo',
  'analitico_metodico',
  'artista_expresivo',
  'colaborador_empatico',
  'emprendedor_audaz',
  'independiente_reflexivo',
] as const;

export type TeamArchetype = (typeof TEAM_ARCHETYPES)[number];

export interface DeclaredProfile {
  entryMode?: 'explore' | 'map' | 'story';
  /** Puerta declarada del onboarding web (flujo del diseñador). */
  portal?: 'visual' | 'story' | 'logic';
  /** Área declarada en la inscripción abierta. */
  area?: string;
  /** Banda etaria declarada (el año exacto no se conserva). */
  ageBand?: string;
  workRhythm?: 'prototype' | 'align' | 'hybrid';
  feedbackMode?: 'direct' | 'questions' | 'context';
  /** "¿Esta lectura te representa?" — revisión humana del propio estado. */
  stateReview?: 'yes' | 'partial' | 'no';
  shareConditions?: boolean;
  /**
   * Perfil de la primera semana (onboarding de equipo): superpoderes, lo que
   * quiere aprender, la motivación que más eligió, cómo trabaja y cuándo
   * prefiere la charla de inicio de 16 minutos. Declarado.
   */
  perfil?: {
    superpoderes?: string[];
    aprender?: string;
    motivacion?: string;
    trabajo?: Record<string, string>;
    reunion?: { dia: string; horario: string };
  };
}

export interface ConstructReading {
  value: number;
  confidence: number;
  status: string;
}

type Constructs = Partial<Record<string, ConstructReading>>;

const usable = (c?: ConstructReading): c is ConstructReading =>
  Boolean(c && c.status !== 'insufficient_evidence' && c.status !== 'expired');

/**
 * Afinidades deterministas y explicables. Cada arquetipo suma señales
 * declaradas (peso alto: la persona lo dijo) y conductuales (peso menor:
 * lectura contextual de esta experiencia). Se normaliza al rango 0..1.
 */
export function computeArchetypeAffinity(
  declared: DeclaredProfile,
  constructs: Constructs,
): Array<{ archetype: TeamArchetype; affinity: number; signals: string[] }> {
  const flexibility = constructs['strategy_flexibility'];
  const persistence = constructs['persistence'];
  const helpSeeking = constructs['help_seeking'];
  const engagement = constructs['task_engagement'];
  const mastery = constructs['curricular_mastery'];

  const scores: Record<TeamArchetype, { score: number; signals: string[] }> = {
    explorador_creativo: { score: 0, signals: [] },
    analitico_metodico: { score: 0, signals: [] },
    artista_expresivo: { score: 0, signals: [] },
    colaborador_empatico: { score: 0, signals: [] },
    emprendedor_audaz: { score: 0, signals: [] },
    independiente_reflexivo: { score: 0, signals: [] },
  };

  const add = (a: TeamArchetype, points: number, signal: string) => {
    scores[a].score += points;
    scores[a].signals.push(signal);
  };

  // ── Declarado (la persona lo eligió; pesa más) ──────────────────────────
  if (declared.entryMode === 'explore') add('explorador_creativo', 3, 'entraste explorando');
  if (declared.entryMode === 'map') add('analitico_metodico', 3, 'pediste el mapa primero');
  if (declared.entryMode === 'story') add('artista_expresivo', 2, 'elegiste el contexto y la historia');
  if (declared.entryMode === 'story') add('colaborador_empatico', 1, 'buscaste el porqué compartido');

  if (declared.workRhythm === 'prototype') add('emprendedor_audaz', 3, 'preferís probar pronto');
  if (declared.workRhythm === 'align') add('analitico_metodico', 2, 'alineás antes de ejecutar');
  if (declared.workRhythm === 'align') add('independiente_reflexivo', 1, 'te tomás el tiempo de pensar');
  if (declared.workRhythm === 'hybrid') add('explorador_creativo', 1, 'mapa corto y acción');

  if (declared.feedbackMode === 'direct') add('emprendedor_audaz', 1, 'feedback directo');
  if (declared.feedbackMode === 'questions') add('colaborador_empatico', 2, 'feedback en preguntas');
  if (declared.feedbackMode === 'context') add('artista_expresivo', 2, 'feedback con contexto');
  if (declared.shareConditions) add('colaborador_empatico', 1, 'compartís tus condiciones');

  // ── Conductual (lectura contextual de ESTA experiencia; pesa menos) ─────
  if (usable(flexibility) && flexibility.value > 0.6)
    add('explorador_creativo', 2, 'cambiaste de estrategia cuando hizo falta');
  if (usable(persistence) && persistence.value > 0.6) {
    add('emprendedor_audaz', 2, 'insististe con ajuste');
    add('independiente_reflexivo', 1, 'sostuviste el intento');
  }
  if (usable(helpSeeking) && helpSeeking.value > 0.6)
    add('colaborador_empatico', 2, 'pediste ayuda a tiempo');
  if (usable(helpSeeking) && helpSeeking.value < 0.3)
    add('independiente_reflexivo', 2, 'resolviste por tu cuenta');
  if (usable(mastery) && mastery.value > 0.7)
    add('analitico_metodico', 2, 'precisión alta sin pistas');
  if (usable(engagement) && engagement.value > 0.7)
    add('artista_expresivo', 1, 'completaste lo que empezaste');

  const max = Math.max(1, ...Object.values(scores).map((s) => s.score));
  return (Object.entries(scores) as Array<[TeamArchetype, { score: number; signals: string[] }]>)
    .map(([archetype, { score, signals }]) => ({
      archetype,
      affinity: Math.round((score / max) * 100) / 100,
      signals,
    }))
    .sort((a, b) => b.affinity - a.affinity);
}

/** Metadatos de presentación por arquetipo (paleta del documento Estrella). */
export const ARCHETYPE_META: Record<
  TeamArchetype,
  { label: string; accentA: string; accentB: string; mood: string }
> = {
  explorador_creativo: {
    label: 'Explorador Creativo',
    accentA: '#FFD93D',
    accentB: '#9A5DFF',
    mood: 'curiosidad expansiva',
  },
  analitico_metodico: {
    label: 'Analítico Metódico',
    accentA: '#9BE564',
    accentB: '#A6E6FF',
    mood: 'calma concentrada',
  },
  artista_expresivo: {
    label: 'Artista Expresivo',
    accentA: '#FF7A89',
    accentB: '#9A5DFF',
    mood: 'gesto fluido',
  },
  colaborador_empatico: {
    label: 'Colaborador Empático',
    accentA: '#9BE564',
    accentB: '#FF7A89',
    mood: 'brazos abiertos',
  },
  emprendedor_audaz: {
    label: 'Emprendedor Audaz',
    accentA: '#FFD93D',
    accentB: '#FF9A3D',
    mood: 'brillo decidido',
  },
  independiente_reflexivo: {
    label: 'Independiente Reflexivo',
    accentA: '#A6E6FF',
    accentB: '#D7E3F4',
    mood: 'serenidad pensativa',
  },
};
