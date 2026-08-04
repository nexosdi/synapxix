/**
 * Primer Pulso · Dentro del Sistema — contenido v3 (jugable).
 *
 * Regla de oro (aprendida a los golpes): esto NO es un test. Cartas de una
 * línea, un toque por decisión, avance inmediato, y los porqués como
 * insight ambiental — nunca como bloqueo. El lenguaje se adapta al ÁREA
 * que la persona elige al entrar.
 *
 * Los retos siguen siendo los instrumentos D.A.L.A. reales (categorization,
 * timeline-order, intruder): misma taxonomía, misma evidencia, mismo motor.
 * Fuente doctrinal: Documento Maestro Synapxix (agosto 2026).
 */

// ── Áreas del equipo (desplegable de entrada) ─────────────────────────────

export interface TeamArea {
  id: string;
  label: string;
  /** Saludo corto en el idioma del área. */
  hello: string;
  /** Carta propia del área para el Nivel 1 (se suma a las neutrales). */
  extraCard?: { text: string; bucket: string; why: string };
}

export const AREAS: TeamArea[] = [
  {
    id: 'pedagogia',
    label: 'Pedagogía y aprendizaje',
    hello: 'Acá el aula manda: el sistema existe para que enseñar sea más visible, no más vigilado.',
    extraCard: {
      text: 'La docente puede aprobar, editar o rechazar cualquier sugerencia',
      bucket: 'plataforma',
      why: 'Docente en el circuito: es un principio no negociable, y vive en la plataforma.',
    },
  },
  {
    id: 'tecnologia',
    label: 'Tecnología e ingeniería',
    hello: 'Acá nada es magia: eventos inmutables, estados con incertidumbre y decisiones auditables.',
    extraCard: {
      text: 'Reingestar un evento no lo duplica jamás',
      bucket: 'plataforma',
      why: 'Idempotencia: la telemetría offline llega tarde y el sistema no puede mentirse a sí mismo.',
    },
  },
  {
    id: 'diseno',
    label: 'Diseño y narrativa',
    hello: 'Acá lo lúdico crea situaciones — nunca cuestionarios disfrazados de juego.',
    extraCard: {
      text: 'Personajes y misiones que dejan ver conductas sin examinar',
      bucket: 'ciencia',
      why: 'La capa narrativa es instrumento de observación: diseño al servicio de la evidencia.',
    },
  },
  {
    id: 'investigacion',
    label: 'Investigación y datos',
    hello: 'Acá toda conclusión viaja con su evidencia, su incertidumbre y sus alternativas.',
    extraCard: {
      text: 'Un piloto se detiene si aparece daño, sesgo o dependencia',
      bucket: 'ciencia',
      why: 'Criterios de detención: la investigación responsable sabe cuándo parar.',
    },
  },
  {
    id: 'territorio',
    label: 'Territorio e instituciones',
    hello: 'Acá se escucha antes de instalar: la adopción responsable empieza en la escuela real.',
    extraCard: {
      text: 'Formar a los equipos antes de encender nada',
      bucket: 'territorio',
      why: 'Escuchar → Medir → Formar → Implementar: el orden del método territorial no se salta.',
    },
  },
  {
    id: 'gestion',
    label: 'Gestión y operaciones',
    hello: 'Acá las promesas se vuelven criterios de salida: nada se declara logrado sin verificarlo.',
    extraCard: {
      text: 'Ningún dato infantil se monetiza ni alimenta publicidad',
      bucket: 'ciencia',
      why: 'Prohibición absoluta del piloto — y de la empresa. No es política de datos: es identidad.',
    },
  },
];

// ── Relato mínimo (interstitials de una línea) ────────────────────────────

export const STORY = {
  mission:
    'Convertimos interacciones reales en evidencia útil — con docentes y familias al mando.',
  vision: 'Ser la referencia latinoamericana en IA educativa centrada en derechos.',
  dala: 'D.A.L.A. no etiqueta personas: mantiene estados corregibles, con evidencia y límites.',
};

// ── Entrada declarada (las tres puertas) ──────────────────────────────────

export const ENTRY_MODES = [
  { id: 'explore' as const, icon: '↗', label: 'Explorar', copy: 'Tocar y descubrir.' },
  { id: 'map' as const, icon: '◎', label: 'Ver el mapa', copy: 'Primero las piezas.' },
  { id: 'story' as const, icon: '◌', label: 'El porqué', copy: 'Contexto antes que acción.' },
];

// ── Nivel 1 — Categorization: "¿Dónde vive?" ──────────────────────────────

export interface CategorizationTask {
  taskId: string;
  skillId: string;
  buckets: Array<{ id: string; label: string; hintText: string }>;
  statements: Array<{ id: string; text: string; bucket: string; why?: string }>;
}

const LEVEL1_BUCKETS = [
  { id: 'ciencia', label: 'Ciencia', hintText: 'preguntas y evidencia' },
  { id: 'plataforma', label: 'Plataforma', hintText: 'el sistema que lo sostiene' },
  { id: 'territorio', label: 'Territorio', hintText: 'escuelas e instituciones' },
];

/** Nivel 1 con la carta extra del área inyectada en la segunda tanda. */
export function level1Tasks(areaId: string): CategorizationTask[] {
  const area = AREAS.find((a) => a.id === areaId);
  const extra = area?.extraCard;
  return [
    {
      taskId: 'n1-tanda-1',
      skillId: 'identidad-sistema',
      buckets: LEVEL1_BUCKETS,
      statements: [
        { id: 'c1', text: 'Un piloto con línea base, no con promesas', bucket: 'ciencia' },
        { id: 'c2', text: 'Nada se borra: corregir es agregar un evento nuevo', bucket: 'plataforma' },
        { id: 'c3', text: 'Escuchar a la escuela antes de instalar nada', bucket: 'territorio' },
      ],
    },
    {
      taskId: 'n1-tanda-2',
      skillId: 'identidad-sistema',
      buckets: LEVEL1_BUCKETS,
      statements: [
        { id: 'c4', text: 'Publicar también lo que no funcionó', bucket: 'ciencia' },
        ...(extra ? [{ id: 'c5-area', text: extra.text, bucket: extra.bucket, why: extra.why }] : [
          { id: 'c5', text: 'Un humano aprueba antes de que algo cambie', bucket: 'plataforma' },
        ]),
        { id: 'c6', text: 'Medir qué necesita cada comunidad, no asumirlo', bucket: 'territorio' },
      ],
    },
  ];
}

// ── Nivel 2 — Timeline-order: "El ciclo" ──────────────────────────────────

export interface TimelineTask {
  taskId: string;
  skillId: string;
  intro: string;
  steps: string[];
  closing: string;
}

export const TIMELINE_TASKS: TimelineTask[] = [
  {
    taskId: 'n2-ciclo',
    skillId: 'ciclo-dala',
    intro: 'Así late D.A.L.A. Armá el ciclo.',
    steps: ['Evidencia', 'Estado', 'Decisión', 'Intervención', 'Outcome', 'Actualización'],
    closing: 'Ese latido, completo y trazable, es lo que nadie más encadena.',
  },
];

// ── Nivel 3 — Intruder: "La impostora" ────────────────────────────────────

export interface IntruderTask {
  taskId: string;
  skillId: string;
  cards: Array<{ id: string; text: string; intruder: boolean }>;
  why: string;
}

export const INTRUDER_TASKS: IntruderTask[] = [
  {
    taskId: 'n3-ronda-1',
    skillId: 'test-disfrazado',
    cards: [
      { id: 'i1', text: 'Una conducta admite varias explicaciones', intruder: false },
      { id: 'i2', text: 'Más tiempo en la tarea = más interés', intruder: true },
      { id: 'i3', text: 'La evidencia se acumula antes de leer', intruder: false },
      { id: 'i4', text: 'El tiempo puede decir muchas cosas', intruder: false },
    ],
    why: 'El tiempo es ambiguo: interés, dificultad, distracción o una interfaz confusa. Leerlo directo es sobreinferir.',
  },
  {
    taskId: 'n3-ronda-2',
    skillId: 'test-disfrazado',
    cards: [
      { id: 'i5', text: 'Siempre decide un humano', intruder: false },
      { id: 'i6', text: 'La ayuda se retira cuando ya no hace falta', intruder: false },
      { id: 'i7', text: 'Con confianza alta, el sistema aplica solo', intruder: true },
      { id: 'i8', text: 'Estados que cambian, no etiquetas que quedan', intruder: false },
    ],
    why: 'Shadow mode: recomienda, jamás aplica. Ni con 99% de confianza — es regla de arquitectura, no de precisión.',
  },
];

// ── El caso exprés — la traza de M. ───────────────────────────────────────

export const CASE_SUBJECT = {
  name: 'M.',
  age: '9 años',
  context: 'Tercera sesión. Tablet de la escuela.',
  trace: [
    'Reabrió las instrucciones dos veces antes de empezar.',
    'Falló, repitió la misma jugada dos veces, falló igual.',
    'Pidió una pista, acertó, y siguió sola con la próxima tarea.',
  ],
};

export interface CaseTask {
  taskId: string;
  skillId: string;
  kind: 'clasificar' | 'accion';
  prompt: string;
  buckets?: Array<{ id: string; label: string; hintText: string }>;
  statements?: Array<{ id: string; text: string; bucket: string; why?: string }>;
  options?: Array<{ id: string; text: string; correct: boolean; why: string }>;
}

export const CASE_TASKS: CaseTask[] = [
  {
    taskId: 'caso-clasificar',
    skillId: 'rigor-observacional',
    kind: 'clasificar',
    prompt: '¿Hecho o lectura?',
    buckets: [
      { id: 'observado', label: 'Hecho', hintText: 'está en la traza' },
      { id: 'inferido', label: 'Lectura', hintText: 'lo pusiste vos' },
    ],
    statements: [
      { id: 'q1', text: 'M. pidió una pista después de intentar', bucket: 'observado' },
      {
        id: 'q2',
        text: 'M. necesita estructura para animarse',
        bucket: 'inferido',
        why: 'Plausible — pero quizá solo confirmaba una regla ambigua. Por eso es lectura, no hecho.',
      },
    ],
  },
  {
    taskId: 'caso-accion',
    skillId: 'politica-comunicacional',
    kind: 'accion',
    prompt: 'Sos el sistema. ¿Cuál es la ayuda MÍNIMA que sirve?',
    options: [
      {
        id: 'a1',
        text: 'Darle la estrategia correcta antes de empezar',
        correct: false,
        why: 'Resolver por adelantado mata el esfuerzo productivo.',
      },
      {
        id: 'a2',
        text: 'Invitarla a comparar su jugada repetida con la que funcionó',
        correct: true,
        why: 'Su propio episodio como material de reflexión: mínima ayuda, máxima autonomía.',
      },
      {
        id: 'a3',
        text: 'Quitarle las pistas para que se arregle sola',
        correct: false,
        why: 'Retirar apoyo se gana con dominio estable, no castigando un tropiezo.',
      },
    ],
  },
];

// ── El acuerdo (declarado) ────────────────────────────────────────────────

export const WORK_RHYTHMS = [
  { id: 'prototype' as const, label: 'Probar pronto', copy: 'prototipo primero' },
  { id: 'align' as const, label: 'Alinear antes', copy: 'acordar el mapa' },
  { id: 'hybrid' as const, label: 'Mapa corto y acción', copy: 'un boceto y a construir' },
];

export const FEEDBACK_MODES = [
  { id: 'direct' as const, label: 'Directo', copy: 'qué y dónde, sin vueltas' },
  { id: 'questions' as const, label: 'En preguntas', copy: 'llego yo a la conclusión' },
  { id: 'context' as const, label: 'Con contexto', copy: 'el porqué y a quién afecta' },
];

// ── Etiquetas ─────────────────────────────────────────────────────────────

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

export const CONSTRUCT_LABELS: Record<
  string,
  { label: string; hs: string; hsLabel: string; hint: string }
> = {
  curricular_mastery: {
    label: 'Precisión en contexto',
    hs: 'HS1',
    hsLabel: 'Conocimiento',
    hint: 'aciertos sin pista, acá — no "inteligencia"',
  },
  persistence: {
    label: 'Persistencia productiva',
    hs: 'HS4',
    hsLabel: 'Autorregulación',
    hint: 'seguir tras el error, con ajuste',
  },
  help_seeking: {
    label: 'Búsqueda de ayuda',
    hs: 'HS4',
    hsLabel: 'Autorregulación',
    hint: 'apoyo pedido a tiempo, tras intentar',
  },
  strategy_flexibility: {
    label: 'Flexibilidad estratégica',
    hs: 'HS3',
    hsLabel: 'Resolución',
    hint: 'cambiar de enfoque cuando no rinde',
  },
  task_engagement: {
    label: 'Compromiso con la tarea',
    hs: 'HS6',
    hsLabel: 'Motivación situacional',
    hint: 'terminar lo iniciado — acá, no en general',
  },
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

export const UNKNOWNS = [
  'Cómo trabajás durante semanas, con presión real.',
  'Si estas señales se repiten en otros contextos.',
  'Tu desempeño: esto no lo mide ni lo predice.',
];
