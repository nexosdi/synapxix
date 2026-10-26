/**
 * Primer Pulso · contenido del piloto web (marco pulso-web@0.1).
 *
 * Cada pantalla ofrece oportunidades genuinas de decidir: pedir o no la
 * pista, omitir o insistir, abrir o no lo opcional, elegir el formato,
 * revisar o no las razones de una recomendación. Esas decisiones, con lo
 * que estaba disponible al tomarlas, son la materia prima del retrato.
 * Equivocarse no resta, la ayuda es digna y nada se interpreta en vivo.
 */

// ── Entrada ───────────────────────────────────────────────────────────────

export const AREAS = [
  'Diseño y narrativa',
  'Pedagogía e investigación',
  'Tecnología y datos',
  'Producto y estrategia',
  'Comunidad y operaciones',
];

export const VISION = {
  headline: 'La IA no debería decidir quién eres.',
  lead: 'Debería aprender cómo acompañarte, declarar qué sabe, reconocer qué no sabe y demostrar si su ayuda funcionó.',
  quote:
    'Cada lectura que veas al final se podrá recorrer hasta las decisiones que la sostienen. Nada se afirma sin evidencia.',
};

export const PORTALS = [
  { id: 'visual' as const, icon: '◈', label: 'Ver el sistema', copy: 'Mapas, relaciones y patrones visibles.' },
  { id: 'story' as const, icon: '✦', label: 'Vivir una historia', copy: 'Propósito, tensión y consecuencia.' },
  { id: 'logic' as const, icon: '⌘', label: 'Entender la arquitectura', copy: 'Objetos, reglas y trazabilidad.' },
];

export const CYCLE_PANEL = [
  '01 · EVENTO — qué ocurrió y qué estaba disponible',
  '02 · EVIDENCIA — qué puede sostener, con su denominador',
  '03 · AFIRMACIÓN — hipótesis + alternativas',
  '04 · DECISIÓN — apoyo limitado y revisable',
  '05 · RESULTADO — qué pasó después',
];

// ── Misión 1 — Observatorio ───────────────────────────────────────────────

export interface SignalCard {
  id: string;
  text: string;
  kind: 'observed' | 'reported' | 'inferred';
  /** Explicación opcional: se ofrece tras acertar y abrirla es una elección. */
  why: string;
}

export const MISSION1_CARDS: SignalCard[] = [
  {
    id: 's1',
    text: 'Abrió la consigna 12 segundos después de ver la tarea.',
    kind: 'observed',
    why: 'Es un hecho instrumentable: ocurrió y quedó registrado. D.A.L.A. lo guarda sin mezclarlo con lo que alguien dijo o interpretó.',
  },
  {
    id: 's2',
    text: 'Dijo que prefiere recibir feedback directo y breve.',
    kind: 'reported',
    why: 'Lo declarado vale, pero viaja etiquetado como declaración: describe lo que la persona dijo, no lo que hizo.',
  },
  {
    id: 's3',
    text: 'Probablemente necesita más estructura para iniciar.',
    kind: 'inferred',
    why: 'Es una explicación posible. Para sostenerla hacen falta más oportunidades y descartar alternativas, como una consigna ambigua.',
  },
  {
    id: 's4',
    text: 'Cambió de estrategia después del segundo intento.',
    kind: 'observed',
    why: 'La secuencia de acciones lo muestra: es evidencia de primera mano, aunque todavía no dice por qué cambió.',
  },
  {
    id: 's5',
    text: 'Se considera una persona muy creativa.',
    kind: 'reported',
    why: 'Una autopercepción se respeta y se registra aparte. No se verifica sola: necesita contraste con lo observado.',
  },
  {
    id: 's6',
    text: 'Podría estar explorando, pero también pudo no comprender la instrucción.',
    kind: 'inferred',
    why: 'Así se escribe una inferencia honesta: con la alternativa adentro y sin presentarla como hecho.',
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
  list: ['Observado: un hecho instrumentable.', 'Declarado: lo dijo una persona.', 'Inferido: una explicación posible.'],
};

export const MISSION1_INSTRUCTIONS = {
  title: 'Consigna',
  text: 'Clasifica cada tarjeta según su procedencia. Una categoría no es "mejor" que otra; el riesgo aparece cuando se mezclan.',
  list: [
    'Toca una de las tres categorías.',
    'Si te equivocas, puedes reintentar u omitir la tarjeta.',
    'La pista queda registrada como apoyo, no como déficit.',
  ],
  observes:
    'Qué opciones tenías, tus respuestas, reintentos, omisiones y uso de la pista. No asigna etiquetas de personalidad ni infiere emociones.',
};

/** Tarjeta de contraste: tarea nueva de la misma habilidad, tras la decisión. */
export const CONTRAST_CARD: SignalCard = {
  id: 'k1',
  text: 'Tardó 40 segundos en enviar su primera respuesta.',
  kind: 'observed',
  why: 'Es un dato del registro. Interpretarlo como duda, distracción o reflexión ya sería una inferencia.',
};

// ── Elección de formato (misiones 2 y 3) ──────────────────────────────────
// Alternativas comparables, en orden alternado entre misiones, que se
// contrastan con la puerta declarada al inicio.

export type FormatId = 'mapa' | 'historia' | 'reglas';

export const FORMAT_LABELS: Record<FormatId, { icon: string; label: string; copy: string }> = {
  mapa: { icon: '◈', label: 'Ver el mapa', copy: 'Piezas y relaciones, de un vistazo.' },
  historia: { icon: '✦', label: 'Escuchar la historia', copy: 'Una situación con consecuencias.' },
  reglas: { icon: '⌘', label: 'Leer las reglas', copy: 'Los principios, en dos líneas.' },
};

export const FORMAT_ORDER: Record<'ciclo' | 'camara', FormatId[]> = {
  ciclo: ['mapa', 'historia', 'reglas'],
  camara: ['reglas', 'historia', 'mapa'],
};

export const FORMAT_INTROS: Record<'ciclo' | 'camara', Record<FormatId, string>> = {
  ciclo: {
    mapa: 'Seis piezas en cadena: empieza en lo que se observa y termina en lo que el sistema aprende.',
    historia:
      'Una docente ve una conducta. El sistema arma una hipótesis, propone algo y espera. Solo aprende cuando mide qué pasó.',
    reglas: 'Regla 1: nada se decide sin evidencia. Regla 2: nada se actualiza sin medir el efecto.',
  },
  camara: {
    mapa: 'Cuatro frases sobre la misma persona: tres describen lo que hizo, una la convierte en un tipo.',
    historia: 'Un sistema observó a alguien durante dos minutos y escribió cuatro frases. Una dice demasiado.',
    reglas: 'Regla: una lectura válida dice qué pasó, dónde y con qué alcance. Nunca quién es alguien.',
  },
};

// ── Misión 2 — Ciclo ──────────────────────────────────────────────────────

export const CYCLE_STEPS = ['Evidencia', 'Estado', 'Decisión', 'Intervención', 'Outcome', 'Actualización'];

export const MISSION2_HINT =
  'La adaptación no es el final: el sistema necesita observar el efecto antes de actualizar el estado.';

export const MISSION2_WHY =
  'La arquitectura no actualiza un estado porque una IA habló: lo actualiza cuando un resultado autorizado demuestra qué ocurrió.';

export const MISSION2_INSTRUCTIONS = {
  title: 'Consigna del ciclo',
  text: 'Ordena las seis piezas desde lo que ocurre hasta lo que el sistema aprende.',
  list: [
    'La intervención no es el final.',
    'Puedes deshacer sin costo.',
    'Cambiar de enfoque es una acción válida y observable.',
  ],
  observes: 'Orden de acciones, correcciones, cambio de enfoque, pista y omisión.',
};

// ── Misión 3 — Cámara de eco ──────────────────────────────────────────────

export const MISSION3_INSTRUCTIONS = {
  title: 'Consigna de la cámara',
  text: 'Tres frases respetan la evidencia. Una convierte una conducta puntual en identidad permanente: esa es la impostora.',
  list: [
    'Selecciona una y verifica; equivocarte no resta.',
    'Puedes pedir que se descarte una afirmación responsable.',
    'Si te equivocas, puedes reintentar u omitir la ronda.',
  ],
  observes: 'Selección, cambios de selección, uso de apoyo y omisión. Nada más.',
};

export const MISSION3_ROUNDS: Array<{
  id: string;
  claims: Array<{ text: string; bad: boolean }>;
  why: string;
}> = [
  {
    id: 'eco-1',
    claims: [
      { text: 'En 3 de 5 decisiones revisó todas las opciones antes de responder.', bad: false },
      { text: 'Pidió una pista después de intentar resolver la tarea.', bad: false },
      { text: 'Es una persona impulsiva que no analiza bien.', bad: true },
      { text: 'La latencia fue menor en esta actividad que en la anterior.', bad: false },
    ],
    why: '«Impulsiva» convierte algunas decisiones rápidas en un rasgo. Las otras tres dicen qué pasó, cuántas veces y dónde.',
  },
  {
    id: 'eco-2',
    claims: [
      { text: 'La ayuda coincidió con una mejora inmediata, aún sin prueba de transferencia.', bad: false },
      { text: 'Cambió de enfoque voluntariamente después del feedback.', bad: false },
      { text: 'Tiene un estilo visual de aprendizaje permanente.', bad: true },
      { text: 'Eligió una entrada visual en esta sesión y declaró que le resultaba cómoda.', bad: false },
    ],
    why: 'Los estilos de aprendizaje fijos no tienen respaldo: una preferencia de hoy no dice cómo aprende alguien siempre.',
  },
];

// ── Retrato ───────────────────────────────────────────────────────────────

export const EVIDENCE_STATUS: Record<string, string> = {
  sin_oportunidad_suficiente: 'Sin oportunidad suficiente',
  hipotesis_provisional: 'Hipótesis provisional',
  respaldada_en_contexto: 'Respaldada en el contexto',
};

export const REVIEW_STATUS: Record<string, string> = {
  pendiente: 'Sin revisar',
  confirmada: 'Te representa',
  cuestionada: 'La cuestionaste',
};

/** Vocabulario del registro, en palabras de la persona. */
export const EVENT_LABELS: Record<string, string> = {
  session_started: 'Inicio de la sesión',
  scene_started: 'Entró a la escena',
  instruction_presented: 'Consigna disponible',
  instructions_opened: 'Abrió la consigna',
  task_presented: 'Tarea presentada',
  options_presented: 'Opciones presentadas',
  support_available: 'Pista disponible',
  response_submitted: 'Envió una respuesta',
  hint_requested: 'Pidió la pista',
  support_delivered: 'Recibió la pista',
  action_performed: 'Acción',
  answer_revised: 'Corrigió su respuesta',
  strategy_changed: 'Cambió de enfoque',
  task_skipped: 'Omitió la tarea',
  task_completed: 'Resolvió la tarea',
  exploration_offered: 'Se le ofreció el porqué',
  exploration_opened: 'Abrió el porqué',
  choice_offered: 'Opciones de formato',
  choice_made: 'Eligió formato',
  declaration_made: 'Declaró una preferencia',
  recommendation_presented: 'Recomendación presentada',
  reasons_opened: 'Abrió las razones',
  recommendation_reviewed: 'Dio su veredicto',
  claim_reviewed: 'Revisó una afirmación',
};
