/**
 * Primer Pulso · Dentro del Sistema — contenido doctrinal.
 *
 * Fuente normativa: Documento Maestro Synapxix (agosto 2026). La experiencia
 * sigue el diseño meta que el propio maestro define (§5.3, "Dentro del
 * Sistema"): no se responde SOBRE el sistema — se lo opera. Interpretar
 * señales, separar observado de inferido, sostener hipótesis con
 * alternativas y decidir intervenciones con límites.
 *
 * Los tres retos siguen siendo los tres instrumentos de primera validación
 * D.A.L.A. (categorization, timeline-order, intruder): misma taxonomía de
 * eventos, misma evidencia, mismo motor.
 */

// ── Relato (maestro §1, §17.1) ────────────────────────────────────────────

export const STORY = {
  quienes:
    'Synapxix es un sistema de I+D+i y despliegue responsable de IA educativa. Nació explorando perfiles gamificados para niños y evolucionó hacia algo más riguroso: experiencias que producen evidencia, estados provisionales, decisiones auditables y docentes con la última palabra.',
  mission:
    'Investigar, desarrollar e implementar sistemas de IA educativa que conviertan interacciones reales en evidencia útil para mejorar comprensión, aprendizaje y autonomía — dando a docentes, familias e instituciones control efectivo sobre las decisiones, los datos y la evolución de cada experiencia.',
  vision:
    'Ser la infraestructura latinoamericana de referencia para implementar y evaluar IA educativa centrada en derechos, y convertir a D.A.L.A. en una capa interoperable de comunicación humano–IA validada en contextos reales.',
  dala: 'D.A.L.A. no intenta descubrir una esencia fija del estudiante. Mantiene una representación contextual y corregible de lo que ocurrió, qué puede significar, qué apoyo se ofrece y qué efecto tuvo.',
};

/** Las cuatro naturalezas (maestro §1.1) — el mapa que todo el equipo debe tener. */
export const NATURES = [
  { id: 'idi', label: 'Iniciativa de I+D+i', copy: 'Formula preguntas, métodos, protocolos y evidencia.', tone: 0 },
  { id: 'plataforma', label: 'Plataforma tecnológica', copy: 'Gestiona usuarios, eventos, estados, contenido, revisión y auditoría.', tone: 1 },
  { id: 'productos', label: 'Familia de productos', copy: 'Entrega valor directo a roles concretos.', tone: 2 },
  { id: 'territorio', label: 'Modelo territorial', copy: 'Organiza adopción institucional y aprendizaje público.', tone: 3 },
];

// ── Entrada declarada ─────────────────────────────────────────────────────

export const ENTRY_MODES = [
  { id: 'explore' as const, icon: '↗', label: 'Explorar', copy: 'Entrar, tocar y descubrir el sistema por dentro.' },
  { id: 'map' as const, icon: '◎', label: 'Ver el mapa', copy: 'Entender piezas y relaciones antes de decidir.' },
  { id: 'story' as const, icon: '◌', label: 'Escuchar el contexto', copy: 'Conocer el porqué antes de actuar.' },
];

// ── Reto 1 — Categorization: "El mapa del sistema" ────────────────────────
// Dos niveles: (a) manifestaciones reales → naturaleza; (b) doctrina:
// qué sostiene la misión consolidada y qué exceso fue eliminado (§1.2).

export type Bucket = string;

export interface CategorizationTask {
  taskId: string;
  skillId: string;
  title: string;
  intro: string;
  buckets: Array<{ id: Bucket; label: string; hintText: string }>;
  statements: Array<{ id: string; text: string; bucket: Bucket; why?: string }>;
}

export const CATEGORIZATION_TASKS: CategorizationTask[] = [
  {
    taskId: 'cat-naturalezas-1',
    skillId: 'identidad-sistema',
    title: 'Cuatro naturalezas, un sistema',
    intro: 'Synapxix reúne cuatro naturalezas que no deben confundirse. ¿Dónde vive cada pieza real?',
    buckets: [
      { id: 'idi', label: 'I+D+i', hintText: 'preguntas, métodos, evidencia' },
      { id: 'plataforma', label: 'Plataforma', hintText: 'eventos, estados, auditoría' },
      { id: 'territorio', label: 'Territorio', hintText: 'adopción institucional' },
    ],
    statements: [
      { id: 'n1', text: 'El protocolo de pilotos con línea base y criterios de detención.', bucket: 'idi' },
      { id: 'n2', text: 'El event store inmutable donde una corrección es un evento nuevo.', bucket: 'plataforma' },
      { id: 'n3', text: 'El ciclo Escuchar → Medir → Formar → Implementar → Evaluar → Decidir.', bucket: 'territorio' },
    ],
  },
  {
    taskId: 'cat-naturalezas-2',
    skillId: 'identidad-sistema',
    title: 'Cuatro naturalezas, un sistema',
    intro: 'Segunda tanda. Mismo criterio: función, no apariencia.',
    buckets: [
      { id: 'idi', label: 'I+D+i', hintText: 'preguntas, métodos, evidencia' },
      { id: 'productos', label: 'Productos', hintText: 'valor directo a roles concretos' },
      { id: 'plataforma', label: 'Plataforma', hintText: 'eventos, estados, auditoría' },
    ],
    statements: [
      { id: 'n4', text: 'Synapxix Teacher: entorno privado y contextualizado para docentes.', bucket: 'productos' },
      { id: 'n5', text: 'La red académica y las publicaciones con revisión de claims.', bucket: 'idi' },
      { id: 'n6', text: 'El panel de revisión donde cada recomendación espera un veredicto humano.', bucket: 'plataforma' },
    ],
  },
  {
    taskId: 'cat-doctrina-1',
    skillId: 'doctrina-mision',
    title: 'Lo que sostenemos y lo que soltamos',
    intro: 'La misión consolidada conserva la ambición histórica pero eliminó tres excesos. Distinguí qué sostiene la misión, qué es un exceso eliminado y qué es un principio no negociable.',
    buckets: [
      { id: 'mision', label: 'Misión viva', hintText: 'lo que hacemos y prometemos hoy' },
      { id: 'exceso', label: 'Exceso eliminado', hintText: 'lo que dejamos de prometer' },
      { id: 'principio', label: 'No negociable', hintText: 'regla que ningún piloto rompe' },
    ],
    statements: [
      { id: 'd1', text: 'Convertir interacciones reales en evidencia útil para comprensión y autonomía.', bucket: 'mision' },
      { id: 'd2', text: 'Comprender integralmente al niño desde un onboarding de 15 minutos.', bucket: 'exceso', why: 'Sobreinferencia: el maestro la marca como el límite central de la v1.' },
      { id: 'd3', text: 'La verdad no se personaliza; se adapta la explicación, no los hechos.', bucket: 'principio' },
    ],
  },
  {
    taskId: 'cat-doctrina-2',
    skillId: 'doctrina-mision',
    title: 'Lo que sostenemos y lo que soltamos',
    intro: 'Última tanda. Acá se cae o se sostiene el criterio.',
    buckets: [
      { id: 'mision', label: 'Misión viva', hintText: 'lo que hacemos y prometemos hoy' },
      { id: 'exceso', label: 'Exceso eliminado', hintText: 'lo que dejamos de prometer' },
      { id: 'principio', label: 'No negociable', hintText: 'regla que ningún piloto rompe' },
    ],
    statements: [
      { id: 'd4', text: 'Un perfil equivale a la verdad sobre quién es el estudiante.', bucket: 'exceso', why: 'Estado, no etiqueta: ninguna variable describe una identidad permanente.' },
      { id: 'd5', text: 'Ayuda mínima eficaz: el soporte se retira para aumentar autonomía.', bucket: 'principio' },
      { id: 'd6', text: 'Dar a docentes control efectivo sobre decisiones, datos y evolución.', bucket: 'mision' },
    ],
  },
];

// ── Reto 2 — Timeline-order: "El encadenamiento" ──────────────────────────
// La originalidad defendible de D.A.L.A. (maestro §14.1) es el encadenamiento
// formal. Después, los niveles de conformidad y el método territorial.

export interface TimelineTask {
  taskId: string;
  skillId: string;
  title: string;
  intro: string;
  steps: string[];
  closing: string;
}

export const TIMELINE_TASKS: TimelineTask[] = [
  {
    taskId: 'tl-encadenamiento',
    skillId: 'encadenamiento-dala',
    title: 'La cadena que nos hace únicos',
    intro:
      'Ningún componente aislado de D.A.L.A. es único — learning analytics, tutores, RAG ya existen. La originalidad defendible es el encadenamiento formal. Ordenalo.',
    steps: ['Evidencia', 'HumanState', 'Estado compartido', 'Política', 'InteractionSpec', 'Intervención', 'Outcome', 'Actualización'],
    closing:
      'Esa cadena, completa y auditable, es lo que ningún competidor encadena formalmente. Se demuestra con implementación, no con marketing.',
  },
  {
    taskId: 'tl-conformidad',
    skillId: 'conformidad-dala',
    title: 'Los seis niveles de conformidad',
    intro:
      'D.A.L.A. no se adopta de golpe: se sube por niveles acumulativos. Hoy estamos consolidando Capture y State. Ordená la escalera.',
    steps: ['Capture', 'State', 'Recommend', 'Bounded Adaptation', 'Generative Interaction', 'Interoperable Standard'],
    closing:
      'Shadow mode vive entre State y Recommend: recomendar sin aplicar. Adaptación acotada y generación validada vienen después — jamás antes.',
  },
  {
    taskId: 'tl-territorio',
    skillId: 'metodo-territorial',
    title: 'El método territorial',
    intro:
      'El Laboratorio Territorial convierte el producto en capacidad pública. Su ciclo tiene un orden — y empieza por donde casi nadie empieza.',
    steps: ['Escuchar', 'Medir', 'Formar', 'Implementar', 'Evaluar', 'Decidir'],
    closing: 'Escuchar antes que implementar: la adopción responsable no arranca instalando software.',
  },
];

// ── Reto 3 — Intruder: "El detector de test disfrazado" ───────────────────
// Directamente del rediseño §5.2: cada ronda enfrenta sobreinferencias
// reales (las que el maestro eliminó) contra lecturas válidas.

export interface IntruderTask {
  taskId: string;
  skillId: string;
  prompt: string;
  cards: Array<{ id: string; text: string; intruder: boolean }>;
  why: string;
}

export const INTRUDER_TASKS: IntruderTask[] = [
  {
    taskId: 'in-sobreinferencia-1',
    skillId: 'test-disfrazado',
    prompt: 'Tres lecturas son legítimas bajo D.A.L.A. Una es un test disfrazado. Encontrala.',
    cards: [
      { id: 'i1a', text: 'Varias tareas equivalentes producen hipótesis contextuales con confianza.', intruder: false },
      { id: 'i1b', text: 'Más tiempo en la tarea indica más interés del estudiante.', intruder: true },
      { id: 'i1c', text: 'El tiempo puede indicar interés, dificultad, distracción o un problema de interfaz.', intruder: false },
      { id: 'i1d', text: 'Una conducta aislada admite varias explicaciones hasta que la evidencia acumule.', intruder: false },
    ],
    why: 'El maestro lo marca textualmente: el tiempo es ambiguo. Leerlo como interés directo es la sobreinferencia que la v1 cometía.',
  },
  {
    taskId: 'in-sobreinferencia-2',
    skillId: 'test-disfrazado',
    prompt: 'Otra vez. La intrusa suena noble — por eso es peligrosa.',
    cards: [
      { id: 'i2a', text: 'La elección de ayudar a un personaje demuestra empatía del niño.', intruder: true },
      { id: 'i2b', text: 'Una elección es un evento: requiere contexto, repetición y triangulación.', intruder: false },
      { id: 'i2c', text: 'Pedir ayuda tras intentar es señal de metacognición, no de debilidad.', intruder: false },
      { id: 'i2d', text: 'El resultado inicial habla de estrategias observadas y preguntas pendientes.', intruder: false },
    ],
    why: 'Un solo gesto no demuestra un rasgo. La v1 del producto lo asumía; la v3 exige repetición y triangulación antes de cualquier lectura.',
  },
  {
    taskId: 'in-sobreinferencia-3',
    skillId: 'test-disfrazado',
    prompt: '¿Cuál de estas frases convertiría el juego en examen encubierto?',
    cards: [
      { id: 'i3a', text: 'La preferencia visual del estudiante define cómo hay que enseñarle.', intruder: true },
      { id: 'i3b', text: 'Se mide qué apoyo mejora el outcome en tareas comparables.', intruder: false },
      { id: 'i3c', text: 'No se muestran arquetipos ni conclusiones provisionales durante la prueba.', intruder: false },
      { id: 'i3d', text: 'La salida para familias incluye límites y qué no se sabe.', intruder: false },
    ],
    why: 'Los "estilos de aprendizaje" como receta son el mito que la v3 reemplaza: no preguntamos qué preferís — medimos qué apoyo funciona.',
  },
  {
    taskId: 'in-sobreinferencia-4',
    skillId: 'test-disfrazado',
    prompt: 'Última ronda: el poder del LLM. Una frase le da uno que no tiene.',
    cards: [
      { id: 'i4a', text: 'El LLM es un componente no determinista: recibe una vista mínima y specs.', intruder: false },
      { id: 'i4b', text: 'Su salida atraviesa compuertas de esquema, seguridad, sesgo y política docente.', intruder: false },
      { id: 'i4c', text: 'Con suficiente contexto, el LLM puede estimar el estado psicométrico.', intruder: true },
      { id: 'i4d', text: 'Ante un fallo se bloquea, se reescribe conservadoramente o se escala.', intruder: false },
    ],
    why: 'El LLM no calcula estados, permisos ni decisiones de alto impacto. Ni con "suficiente contexto": es una regla de arquitectura, no de capacidad.',
  },
];

// ── El Caso — observado vs. inferido (instrumento categorization) ─────────
// La prueba de rigor del maestro §5.2: separar lo que ocurrió de lo que
// creemos que significa. Traza sintética de "M.", 9 años.

export const CASE_SUBJECT = {
  name: 'M.',
  age: '9 años',
  context: 'Tercera sesión con el juego de categorización. Tablet de la escuela, hora de clase.',
  trace: [
    'Abrió la tarea y reabrió las instrucciones dos veces antes de tocar nada.',
    'Colocó tres tarjetas seguidas, rápido, las tres correctas.',
    'En la cuarta falló, repitió la misma jugada dos veces más, y falló igual.',
    'Pidió una pista. Después de la pista, acertó.',
    'Completó la tarea y empezó la siguiente sin que nadie se lo pidiera.',
  ],
};

export interface CaseTask {
  taskId: string;
  skillId: string;
  kind: 'clasificar' | 'hipotesis' | 'accion';
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
    prompt: 'Primero, el rigor: ¿qué es observación, qué es inferencia y qué todavía no se sabe?',
    buckets: [
      { id: 'observado', label: 'Observado', hintText: 'ocurrió; está en la traza' },
      { id: 'inferido', label: 'Inferencia', hintText: 'lectura posible, no un hecho' },
      { id: 'desconocido', label: 'No se sabe aún', hintText: 'falta evidencia para afirmarlo' },
    ],
    statements: [
      { id: 'c1', text: 'M. reabrió las instrucciones dos veces antes de empezar.', bucket: 'observado' },
      { id: 'c2', text: 'M. necesita estructura para animarse a actuar.', bucket: 'inferido', why: 'Es una hipótesis plausible — quizá solo confirmaba una regla ambigua.' },
      { id: 'c3', text: 'A M. le gusta este tipo de juego.', bucket: 'desconocido', why: 'Volvió sola a la siguiente tarea… una vez. Gusto requiere retorno repetido y elección libre.' },
    ],
  },
  {
    taskId: 'caso-hipotesis',
    skillId: 'rigor-observacional',
    kind: 'hipotesis',
    prompt: 'Repitió la misma jugada dos veces tras el error, y falló igual. ¿Qué hipótesis sostiene MEJOR esta evidencia?',
    options: [
      { id: 'h1', text: 'Persistencia alta: M. no se rinde.', correct: false, why: 'Repetir sin cambio no es persistencia productiva: la ficha del constructo lo excluye.' },
      { id: 'h2', text: 'Posible rigidez estratégica en esta tarea — con la pista como punto de quiebre útil.', correct: true, why: 'Repetición idéntica + éxito tras apoyo mínimo: la lectura que la evidencia sostiene, acotada al contexto.' },
      { id: 'h3', text: 'Frustración emocional: M. estaba enojada.', correct: false, why: 'No hay señal emocional en la traza. Inferir emociones sin evidencia está prohibido en el piloto.' },
    ],
  },
  {
    taskId: 'caso-accion',
    skillId: 'politica-comunicacional',
    kind: 'accion',
    prompt: 'Sos la política de decisión. Con ese estado — ¿cuál es la intervención de mínima ayuda eficaz para la próxima tarea?',
    options: [
      { id: 'a1', text: 'EXPLAIN: darle la estrategia correcta antes de que empiece.', correct: false, why: 'Resolver por adelantado es máxima ayuda, no mínima: mata el esfuerzo productivo.' },
      { id: 'a2', text: 'COMPARE: invitarla a comparar su jugada repetida con la que funcionó tras la pista.', correct: true, why: 'Convierte su propio episodio en material de reflexión. Ayuda mínima, autonomía máxima.' },
      { id: 'a3', text: 'WITHDRAW_SUPPORT: quitar las pistas para que aprenda a arreglarse sola.', correct: false, why: 'Retirar apoyo se gana con dominio alto y estable — no castigando un tropiezo.' },
    ],
  },
];

// ── Declaraciones ─────────────────────────────────────────────────────────

export const WORK_RHYTHMS = [
  { id: 'prototype' as const, label: 'Probar algo pronto', copy: 'Prototipo primero, ajuste después.' },
  { id: 'align' as const, label: 'Alinear antes', copy: 'Acordar el mapa antes de ejecutar.' },
  { id: 'hybrid' as const, label: 'Mapa corto y acción', copy: 'Un boceto compartido, y a construir.' },
];

export const FEEDBACK_MODES = [
  { id: 'direct' as const, label: 'Directo y específico', copy: 'Decime qué y dónde, sin vueltas.' },
  { id: 'questions' as const, label: 'Como preguntas', copy: 'Preferiría llegar yo a la conclusión.' },
  { id: 'context' as const, label: 'Con contexto e impacto', copy: 'Explicame el porqué y a quién afecta.' },
];

// ── Etiquetas de política y constructos ───────────────────────────────────

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

/**
 * Lectura por módulos del HumanState (maestro §4.3). Los cinco constructos
 * v0.1 se leen dentro del módulo que les corresponde: la estructura es la
 * del estándar, no una inventada para el reporte.
 */
export const CONSTRUCT_LABELS: Record<
  string,
  { label: string; hs: string; hsLabel: string; hint: string }
> = {
  curricular_mastery: {
    label: 'Precisión en contexto',
    hs: 'HS1',
    hsLabel: 'Conocimiento',
    hint: 'aciertos sin pista, en estas tareas — no "inteligencia"',
  },
  persistence: {
    label: 'Persistencia productiva',
    hs: 'HS4',
    hsLabel: 'Autorregulación',
    hint: 'continuar tras el error con ajuste; repetir igual no cuenta',
  },
  help_seeking: {
    label: 'Búsqueda de ayuda',
    hs: 'HS4',
    hsLabel: 'Autorregulación',
    hint: 'apoyo pedido a tiempo, después de intentar',
  },
  strategy_flexibility: {
    label: 'Flexibilidad estratégica',
    hs: 'HS3',
    hsLabel: 'Resolución',
    hint: 'cambiar de enfoque cuando el actual no rinde',
  },
  task_engagement: {
    label: 'Compromiso con la tarea',
    hs: 'HS6',
    hsLabel: 'Motivación situacional',
    hint: 'terminar lo iniciado y volver — acá, no en general',
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

/** Lo que esta experiencia NO puede saber (maestro §5.2: decir los límites). */
export const UNKNOWNS = [
  'Cómo colaborás durante semanas, con presión y consecuencias reales.',
  'Si estas señales se repiten en otros contextos y con otras herramientas.',
  'Tu desempeño: esta experiencia no lo mide ni lo predice.',
  'Qué apoyo te sirve más: eso se verifica trabajando, no declarándolo.',
];
