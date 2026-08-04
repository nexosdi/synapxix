/**
 * Primer Pulso — contenido de la experiencia.
 *
 * Todo el material viene de fuentes reales: la misión y visión publicadas de
 * Synapxix (landing), las reglas arquitectónicas de D.A.L.A. (docs/DALA.md) y
 * el manual de marca. Los tres retos SON los tres instrumentos de primera
 * validación de D.A.L.A.: categorization, timeline-order e intruder.
 */

// ── Historia, misión y visión (fuente: landing gamificamente / about) ─────

export const STORY = {
  origin:
    'Nacimos del programa PET — Práctica Educativa Territorial de la Facultad de Ciencia y Tecnología de la UADER, en Concepción del Uruguay. Un equipo de educadores, psicopedagogos, estudiantes e ingenieros en IA.',
  mission:
    'Revolucionar la educación infantil mediante experiencias interactivas personalizadas, combinando la potencia de la inteligencia artificial con la magia del juego para desarrollar las habilidades únicas de cada niño.',
  vision:
    'Ser la plataforma líder mundial en educación personalizada, donde cada niño desarrolle su máximo potencial a través de experiencias adaptativas que respeten su individualidad.',
  dala: 'D.A.L.A. es nuestro estándar: una IA educativa responsable no memoriza al usuario ni etiqueta. Sostiene un estado compartido, interviene con una política verificable y demuestra que la comunicación produjo aprendizaje y autonomía.',
};

// ── Escena de entrada declarada (del Primer Pulso original) ───────────────

export const ENTRY_MODES = [
  {
    id: 'explore' as const,
    icon: '↗',
    label: 'Explorar',
    copy: 'Entrar, tocar y descubrir el sistema.',
  },
  {
    id: 'map' as const,
    icon: '◎',
    label: 'Ver el mapa',
    copy: 'Entender primero piezas y relaciones.',
  },
  {
    id: 'story' as const,
    icon: '◌',
    label: 'Escuchar el contexto',
    copy: 'Conocer el porqué antes de actuar.',
  },
];

// ── Reto 1 — Categorization: "La constelación de ideas" ───────────────────

export type Bucket = 'mision' | 'vision' | 'principio';

export const BUCKETS: Array<{ id: Bucket; label: string; hintText: string }> = [
  { id: 'mision', label: 'Misión', hintText: 'lo que hacemos hoy y para quién' },
  { id: 'vision', label: 'Visión', hintText: 'el mundo al que queremos llegar' },
  { id: 'principio', label: 'Principio D.A.L.A.', hintText: 'una regla que el motor jamás rompe' },
];

export interface CategorizationTask {
  taskId: string;
  skillId: string;
  statements: Array<{ id: string; text: string; bucket: Bucket }>;
}

export const CATEGORIZATION_TASKS: CategorizationTask[] = [
  {
    taskId: 'cat-1',
    skillId: 'identidad-synapxix',
    statements: [
      {
        id: 'c1a',
        text: 'Revolucionar la educación infantil con experiencias interactivas personalizadas.',
        bucket: 'mision',
      },
      {
        id: 'c1b',
        text: 'Ser la plataforma líder mundial en educación personalizada.',
        bucket: 'vision',
      },
      {
        id: 'c1c',
        text: 'La IA propone; el humano decide.',
        bucket: 'principio',
      },
    ],
  },
  {
    taskId: 'cat-2',
    skillId: 'identidad-synapxix',
    statements: [
      {
        id: 'c2a',
        text: 'Combinar la potencia de la IA con la magia del juego.',
        bucket: 'mision',
      },
      {
        id: 'c2b',
        text: 'Que cada niño desarrolle su máximo potencial, a su manera.',
        bucket: 'vision',
      },
      {
        id: 'c2c',
        text: 'Los eventos son inmutables: una corrección es un evento nuevo.',
        bucket: 'principio',
      },
    ],
  },
  {
    taskId: 'cat-3',
    skillId: 'identidad-synapxix',
    statements: [
      {
        id: 'c3a',
        text: 'Desarrollar las habilidades únicas de cada niño, hoy, en cada sesión.',
        bucket: 'mision',
      },
      {
        id: 'c3b',
        text: 'Experiencias adaptativas que respeten la individualidad en todo el mundo.',
        bucket: 'vision',
      },
      {
        id: 'c3c',
        text: 'Estados, no etiquetas: los arquetipos jamás participan del motor de decisión.',
        bucket: 'principio',
      },
    ],
  },
  {
    taskId: 'cat-4',
    skillId: 'identidad-synapxix',
    statements: [
      {
        id: 'c4a',
        text: 'Acompañar a docentes y familias con lecturas explicables del proceso.',
        bucket: 'mision',
      },
      {
        id: 'c4b',
        text: 'Un futuro donde aprender sea un sistema vivo que nunca congela a nadie.',
        bucket: 'vision',
      },
      {
        id: 'c4c',
        text: 'Ninguna estimación sin evidencia referenciada, incertidumbre y vigencia.',
        bucket: 'principio',
      },
    ],
  },
];

// ── Reto 2 — Timeline-order: "El ciclo vivo" ──────────────────────────────

export interface TimelineTask {
  taskId: string;
  skillId: string;
  title: string;
  intro: string;
  steps: string[]; // en el orden correcto
}

export const TIMELINE_TASKS: TimelineTask[] = [
  {
    taskId: 'tl-1',
    skillId: 'ciclo-dala',
    title: 'El ciclo D.A.L.A.',
    intro: 'Ordená el ciclo que hace responsable a nuestra IA. Todo trazable, todo reconstruible.',
    steps: ['Evidencia', 'Estado', 'Decisión', 'Intervención', 'Outcome', 'Actualización'],
  },
  {
    taskId: 'tl-2',
    skillId: 'historia-synapxix',
    title: 'Nuestra historia',
    intro: 'Ordená el camino que nos trajo hasta este pulso.',
    steps: [
      'Programa PET en la UADER',
      'Equipo multidisciplinario',
      'Plataforma de juegos adaptativos',
      'D.A.L.A. Core v0.1',
      'Primer Pulso del equipo',
    ],
  },
];

// ── Reto 3 — Intruder: "La señal intrusa" ─────────────────────────────────

export interface IntruderTask {
  taskId: string;
  skillId: string;
  prompt: string;
  cards: Array<{ id: string; text: string; intruder: boolean }>;
  why: string; // explicación al acertar
}

export const INTRUDER_TASKS: IntruderTask[] = [
  {
    taskId: 'in-1',
    skillId: 'principios-dala',
    prompt: 'Tres de estas frases son Synapxix. Una nos traiciona. ¿Cuál?',
    cards: [
      { id: 'i1a', text: 'Toda inferencia declara su incertidumbre y sus alternativas.', intruder: false },
      { id: 'i1b', text: 'D.A.L.A. etiqueta a cada niño con su arquetipo para decidir qué enseñarle.', intruder: true },
      { id: 'i1c', text: 'Los motores solo ven seudónimos, nunca nombres reales.', intruder: false },
      { id: 'i1d', text: 'El proceso también es resultado: pausas y revisiones dicen más que una respuesta.', intruder: false },
    ],
    why: 'Estados, no etiquetas. Los arquetipos son una vista narrativa opcional; jamás entran al motor de decisión.',
  },
  {
    taskId: 'in-2',
    skillId: 'principios-dala',
    prompt: 'Otra vez: una de estas frases rompe una regla que nos define.',
    cards: [
      { id: 'i2a', text: 'En el piloto, toda recomendación requiere aprobación humana.', intruder: false },
      { id: 'i2b', text: 'La ayuda se gradúa y se retira; nunca resuelve por la persona.', intruder: false },
      { id: 'i2c', text: 'Si el modelo tiene confianza alta, aplica la intervención automáticamente.', intruder: true },
      { id: 'i2d', text: 'Una corrección nunca borra el evento original: se agrega uno nuevo.', intruder: false },
    ],
    why: 'Shadow mode: el sistema recomienda; un humano aprueba, rechaza o corrige. Nada se auto-aplica, tenga la confianza que tenga.',
  },
  {
    taskId: 'in-3',
    skillId: 'principios-dala',
    prompt: '¿Cuál de estas señales NO debería actualizar el modelo?',
    cards: [
      { id: 'i3a', text: 'Reintentar con ajuste después de un error.', intruder: false },
      { id: 'i3b', text: 'Pedir una pista después de haber intentado.', intruder: false },
      { id: 'i3c', text: 'La persistencia medida mientras hay XP y créditos activos.', intruder: true },
      { id: 'i3d', text: 'Completar lo que se empezó y volver por elección.', intruder: false },
    ],
    why: 'Con recompensa activa, persistencia y engagement no se actualizan: la recompensa distorsiona la señal.',
  },
  {
    taskId: 'in-4',
    skillId: 'principios-dala',
    prompt: 'Última ronda. Una frase le da al LLM un poder que no tiene.',
    cards: [
      { id: 'i4a', text: 'El LLM redacta dentro de una decisión ya tomada, y su salida se valida.', intruder: false },
      { id: 'i4b', text: 'El LLM calcula el estado del estudiante cuando falta evidencia.', intruder: true },
      { id: 'i4c', text: 'La política de decisión es determinista, priorizada y versionada.', intruder: false },
      { id: 'i4d', text: 'Sin evidencia utilizable, la única acción válida es verificar.', intruder: false },
    ],
    why: 'El LLM no calcula estados, permisos ni decisiones. Si interviene, solo redacta dentro de una decisión ya tomada.',
  },
];

// ── Declaraciones (acuerdo de colaboración) ───────────────────────────────

export const WORK_RHYTHMS = [
  { id: 'prototype' as const, label: 'Prefiero probar algo pronto' },
  { id: 'align' as const, label: 'Prefiero alinear antes' },
  { id: 'hybrid' as const, label: 'Un mapa corto y luego acción' },
];

export const FEEDBACK_MODES = [
  { id: 'direct' as const, label: 'Directo y específico' },
  { id: 'questions' as const, label: 'Llega como preguntas' },
  { id: 'context' as const, label: 'Incluye contexto e impacto' },
];

// ── Textos de la política (para explicar la decisión shadow) ──────────────

export const ACTION_LABELS: Record<string, string> = {
  ASK: 'Preguntar y re-enganchar',
  CLARIFY: 'Aclarar la consigna',
  EXPLAIN: 'Explicar',
  EXAMPLE: 'Dar un ejemplo',
  HINT: 'Ofrecer una pista mínima',
  CHALLENGE: 'Proponer un desafío mayor',
  COMPARE: 'Comparar estrategias',
  VERIFY: 'Verificar comprensión',
  SUMMARIZE: 'Resumir lo visto',
  REFLECT: 'Invitar a reflexionar',
  WITHDRAW_SUPPORT: 'Retirar apoyo y verificar transferencia',
  DEFER: 'Esperar el momento',
  ESCALATE: 'Escalar a un humano',
};

export const CONSTRUCT_LABELS: Record<string, { label: string; hint: string }> = {
  curricular_mastery: { label: 'Precisión', hint: 'aciertos sin pista, en contexto' },
  persistence: { label: 'Persistencia productiva', hint: 'continuar tras el error, con ajuste' },
  help_seeking: { label: 'Búsqueda de ayuda', hint: 'pedir apoyo pertinente tras intentar' },
  strategy_flexibility: { label: 'Flexibilidad estratégica', hint: 'cambiar de enfoque cuando no funciona' },
  task_engagement: { label: 'Compromiso', hint: 'terminar lo iniciado y volver' },
};

export const STATUS_LABELS: Record<string, string> = {
  insufficient_evidence: 'evidencia insuficiente',
  provisional: 'provisional',
  supported: 'sustentada',
  stable_in_context: 'estable en contexto',
  contradicted: 'contradictoria',
  expired: 'vencida',
  human_review_required: 'requiere revisión humana',
};
