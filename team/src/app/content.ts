/**
 * Primer Pulso · Dentro del Sistema — contenido v4.
 *
 * Implementa las directrices del diseño de experiencia (prototipo
 * "onboarding web"): tres misiones sobre los instrumentos D.A.L.A. reales,
 * shadow mode con veredicto humano, resultado con intervalos y límites, y
 * la Estrella generativa por dimensión dominante. Sin test disfrazado:
 * equivocarse no resta, la ayuda es digna y verificable, y ninguna lectura
 * aparece durante el juego.
 */

// ── Áreas (desplegable de inscripción, según el diseño) ───────────────────

export const AREAS = [
  'Diseño y narrativa',
  'Pedagogía e investigación',
  'Tecnología y datos',
  'Producto y estrategia',
  'Comunidad y operaciones',
];

// ── Entrada / visión / portal ─────────────────────────────────────────────

export const VISION = {
  headline: 'La IA no debería decidir quién eres.',
  lead: 'Debería aprender cómo acompañarte, declarar qué sabe, reconocer qué no sabe y demostrar si su ayuda funcionó.',
  quote:
    'Nuestra visión es construir la infraestructura que permita personalizar aprendizaje y comunicación sin sacrificar verdad, privacidad, autonomía ni juicio humano.',
};

export const PORTALS = [
  { id: 'visual' as const, icon: '◈', label: 'Ver el sistema', copy: 'Mapas, relaciones y patrones visibles.' },
  { id: 'story' as const, icon: '✦', label: 'Vivir una historia', copy: 'Propósito, tensión y consecuencia.' },
  { id: 'logic' as const, icon: '⌘', label: 'Entender la arquitectura', copy: 'Objetos, reglas y trazabilidad.' },
];

export const CYCLE_PANEL = [
  '01 · EVENTO — qué ocurrió',
  '02 · EVIDENCIA — qué puede sostener',
  '03 · ESTADO — hipótesis + incertidumbre',
  '04 · DECISIÓN — apoyo limitado y auditable',
  '05 · OUTCOME — qué pasó después',
];

// ── Misión 1 — Observatorio (instrumento `categorization`) ────────────────
// Separar señal de historia: observado / declarado / inferido.
// Dos tandas con taskId propio: diversidad de tareas para la evidencia.

export interface SignalCard {
  id: string;
  text: string;
  kind: 'observed' | 'reported' | 'inferred';
  onCorrect: string;
}

export const MISSION1_TASKS: Array<{ taskId: string; skillId: string; cards: SignalCard[] }> = [
  {
    taskId: 'observatorio-1',
    skillId: 'evidence_literacy',
    cards: [
      {
        id: 's1',
        text: 'Abrió la consigna 12 segundos después de ver la tarea.',
        kind: 'observed',
        onCorrect: 'Un hecho instrumentable: D.A.L.A. lo guarda sin mezclarlo con otras fuentes.',
      },
      {
        id: 's2',
        text: 'Dijo que prefiere recibir feedback directo y breve.',
        kind: 'reported',
        onCorrect: 'Lo declarado vale — pero viaja etiquetado como declaración, nunca como conducta.',
      },
      {
        id: 's3',
        text: 'Probablemente necesita más estructura para iniciar.',
        kind: 'inferred',
        onCorrect: 'Una inferencia debe conservar alternativas y no presentarse como hecho.',
      },
    ],
  },
  {
    taskId: 'observatorio-2',
    skillId: 'evidence_literacy',
    cards: [
      {
        id: 's4',
        text: 'Cambió de estrategia después del segundo intento.',
        kind: 'observed',
        onCorrect: 'Ocurrió y quedó en la traza: evidencia de primera mano.',
      },
      {
        id: 's5',
        text: 'Se considera una persona muy creativa.',
        kind: 'reported',
        onCorrect: 'Autopercepción declarada: se respeta, se registra aparte, no se verifica sola.',
      },
      {
        id: 's6',
        text: 'Podría estar explorando, pero también pudo no comprender la instrucción.',
        kind: 'inferred',
        onCorrect: 'Así se escribe una inferencia honesta: con la alternativa adentro.',
      },
    ],
  },
];

export const MISSION1_BUCKETS = [
  { id: 'observed', icon: '●', label: 'OBSERVADO', hint: 'ocurrió en la interacción' },
  { id: 'reported', icon: '◐', label: 'DECLARADO', hint: 'la persona lo dijo' },
  { id: 'inferred', icon: '◇', label: 'INFERIDO', hint: 'hipótesis, no hecho' },
];

export const MISSION1_HINT = {
  title: 'Pista de evidencia',
  text: 'No te dice la respuesta; reduce el espacio de búsqueda.',
  list: [
    'Observado: un hecho instrumentable.',
    'Declarado: lo dijo una persona.',
    'Inferido: una explicación posible.',
  ],
};

export const MISSION1_INSTRUCTIONS = {
  title: 'Consigna',
  text: 'Clasifica cada tarjeta según su procedencia. Una categoría no es "mejor" que otra; el riesgo aparece cuando se mezclan.',
  list: ['Toca una de las tres categorías.', 'Puedes reintentar sin penalización.', 'La pista queda registrada como apoyo, no como déficit.'],
  observes:
    'Latencia, acierto, revisión, reintento, ayuda y tarea. No inferirá personalidad ni emociones.',
};

// ── Misión 2 — Ciclo (instrumento `timeline-order`) ───────────────────────

export const CYCLE_STEPS = ['Evidencia', 'Estado', 'Decisión', 'Intervención', 'Outcome', 'Actualización'];

export const MISSION2_HINT =
  'La adaptación no es el final: el sistema necesita observar el efecto antes de actualizar el estado.';

export const MISSION2_INSTRUCTIONS = {
  title: 'Consigna del ciclo',
  text: 'Ordena las seis piezas desde lo que ocurre hasta lo que el sistema aprende.',
  list: ['La intervención no es el final.', 'Puedes deshacer sin costo.', 'Cambiar de enfoque es una acción válida y observable.'],
  observes:
    'Orden de acciones, revisiones, alternativa explorada y cambio deliberado de estrategia.',
};

export const MISSION3_INSTRUCTIONS = {
  title: 'Consigna de la cámara',
  text: 'Tres frases respetan la evidencia. Una convierte una conducta puntual en identidad permanente: esa es la impostora.',
  list: [
    'Selecciona una y verifica; equivocarte no resta.',
    'Puedes pedir que se descarte una afirmación responsable.',
    'La intrusa siempre suena razonable — por eso el detector importa.',
  ],
  observes: 'Selección, latencia, revisión y uso de apoyo. Nada más.',
};

// ── Misión 3 — Cámara de eco (instrumento `intruder`) ─────────────────────

export const MISSION3_ROUNDS: Array<{
  taskId: string;
  skillId: string;
  claims: Array<{ text: string; bad: boolean }>;
}> = [
  {
    taskId: 'eco-1',
    skillId: 'responsible_inference',
    claims: [
      { text: 'En 3 de 5 decisiones revisó todas las opciones antes de responder.', bad: false },
      { text: 'Pidió una pista después de intentar resolver la tarea.', bad: false },
      { text: 'Es una persona impulsiva que no analiza bien.', bad: true },
      { text: 'La latencia fue menor en esta actividad que en la anterior.', bad: false },
    ],
  },
  {
    taskId: 'eco-2',
    skillId: 'responsible_inference',
    claims: [
      { text: 'La ayuda coincidió con una mejora inmediata, aún sin prueba de transferencia.', bad: false },
      { text: 'Cambió de enfoque voluntariamente después del feedback.', bad: false },
      { text: 'Tiene un estilo visual de aprendizaje permanente.', bad: true },
      { text: 'Eligió una entrada visual en esta sesión y declaró que le resultaba cómoda.', bad: false },
    ],
  },
];

// ── Resultado — copy por constructo (directrices del diseño) ──────────────

export const CONSTRUCT_META: Record<
  string,
  { label: string; node: string; seen: string; directive: string }
> = {
  curricular_mastery: {
    label: 'Dominio en contexto',
    node: 'dominio',
    seen: 'cómo separaste hechos, declaraciones e inferencias y reconstruiste el ciclo',
    directive: 'En proyectos, pide que toda afirmación sobre usuarios cite el evento que la sostiene.',
  },
  persistence: {
    label: 'Persistencia productiva',
    node: 'persistencia',
    seen: 'qué hiciste después de una respuesta que no funcionó',
    directive: 'Cuando algo falle, registra qué cambiaste entre intentos; repetir sin variación no cuenta como persistencia productiva.',
  },
  help_seeking: {
    label: 'Búsqueda de ayuda',
    node: 'ayuda',
    seen: 'si pediste apoyo después de intentar y cómo lo usaste',
    directive: 'Haz explícito qué intentaste antes de pedir apoyo y solicita la mínima ayuda que permita avanzar.',
  },
  strategy_flexibility: {
    label: 'Flexibilidad estratégica',
    node: 'flexibilidad',
    seen: 'revisiones, deshacer y cambios voluntarios de enfoque',
    directive: 'Nombra el criterio que te hace cambiar de enfoque; eso permite distinguir flexibilidad de ensayo aleatorio.',
  },
  task_engagement: {
    label: 'Compromiso con la tarea',
    node: 'compromiso',
    seen: 'cierre de tareas en varias sesiones internas',
    directive: 'La próxima validación debe ocurrir en una entrega real y en una segunda fecha.',
  },
};

export const STATUS_LABELS: Record<string, string> = {
  insufficient_evidence: 'EVIDENCIA INSUFICIENTE',
  provisional: 'PROVISIONAL',
  supported: 'SUSTENTADA',
  stable_in_context: 'ESTABLE EN CONTEXTO',
  contradicted: 'CONTRADICTORIA',
  expired: 'VENCIDA',
  human_review_required: 'REQUIERE REVISIÓN',
};

export const ACTION_LABELS: Record<string, string> = {
  ASK: 'ASK · preguntar y re-enganchar',
  CLARIFY: 'CLARIFY · aclarar la consigna',
  EXPLAIN: 'EXPLAIN · explicar',
  EXAMPLE: 'EXAMPLE · dar un ejemplo',
  HINT: 'HINT · pista mínima',
  CHALLENGE: 'CHALLENGE · desafío mayor',
  COMPARE: 'COMPARE · comparar estrategias',
  VERIFY: 'VERIFY · verificar comprensión',
  SUMMARIZE: 'SUMMARIZE · resumir',
  REFLECT: 'REFLECT · invitar a reflexionar',
  WITHDRAW_SUPPORT: 'WITHDRAW SUPPORT · retirar apoyo',
  DEFER: 'DEFER · esperar el momento',
  ESCALATE: 'ESCALATE · escalar a un humano',
};

export const UNKNOWNS = [
  {
    tag: 'COLABORACIÓN REAL',
    title: 'Falta un equipo.',
    text: 'Una sesión individual no permite inferir cómo escuchas, articulas o resuelves tensiones con otros.',
  },
  {
    tag: 'ESTABILIDAD',
    title: 'Falta tiempo.',
    text: 'Una conducta bajo novedad puede cambiar. Ninguna lectura alcanza confianza alta en este onboarding.',
  },
  {
    tag: 'TRANSFERENCIA',
    title: 'Falta otro contexto.',
    text: 'El modelo necesita observar si las estrategias funcionan en proyectos reales de Synapxix.',
  },
];

// ── Estrella generativa (dimensión dominante → identidad visual) ──────────

export const STAR_META: Record<
  string,
  { name: string; tag: string; accent: string }
> = {
  curricular_mastery: { name: 'Estrella del Rigor', tag: 'RIGOR', accent: '#1E90FF' },
  persistence: { name: 'Estrella Persistente', tag: 'PERSISTENCIA', accent: '#ffd93d' },
  help_seeking: { name: 'Estrella Vincular', tag: 'APOYO', accent: '#9be564' },
  strategy_flexibility: { name: 'Estrella Mutante', tag: 'CAMBIO', accent: '#9a5dff' },
  task_engagement: { name: 'Estrella Presente', tag: 'PRESENCIA', accent: '#ff7a89' },
};
