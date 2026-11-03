/**
 * Primer Pulso · contenido del piloto web (marco pulso-web@0.3).
 *
 * Cada pantalla ofrece oportunidades genuinas de decidir: pedir o no la
 * pista, omitir o insistir, abrir o no lo opcional, elegir el formato,
 * revisar o no las razones de una recomendación. Esas decisiones, con lo
 * que estaba disponible al tomarlas, son la materia prima del retrato.
 * Equivocarse no resta, la ayuda es digna y nada se interpreta en vivo.
 */

// ── Acto I · Synapxix ─────────────────────────────────────────────────────
// Qué es Synapxix, por qué existe y de dónde viene, en cuatro escenas y un
// cierre (revisión del bloque I, 28-oct). Una idea por escena, una
// interacción simple, lienzo y tono del Manual de Marca. Nada se registra.

/**
 * Escena 1 · el nombre (Manual de Marca: «fue diseñado para ser aprendido»).
 * Cinco puntos, uno por paso de cómo aprende un cerebro; al conectarlos
 * aparece la estrella y se entiende de dónde viene Synapxix.
 */
export const NAME_BEATS = ['Algo inesperado', 'Atención', 'Patrón', 'Significado', 'Conexión'];

export const NOMBRE = {
  ask: '¿Qué significa? Conecta los cinco puntos.',
  learned: 'Así aprende un cerebro. Así se llama Synapxix.',
  // Manual de Marca v2, «El origen del nombre SYNAPXIX» (p. 2), tal cual.
  story: [
    'Cuando el cerebro encuentra algo inesperado, aumenta la atención, activa nuevos patrones, busca significado y crea nuevas conexiones. Ese proceso es la base de todo aprendizaje.',
    'Por eso Synapxix fue diseñado para ser aprendido: es la primera experiencia de aprendizaje que la marca genera.',
  ],
  reveal: 'Synapxix conecta aprendizaje, evidencia y tecnología para construir educación personalizada.',
  note: 'Más que un nombre. Una experiencia de aprendizaje.',
};

/** Escena 2 · ¿Qué es Synapxix? Cuatro piezas que se abren con un toque. */
export const QUE_ES = [
  { id: 'investigacion', icon: 'lupa', label: 'Investigación', text: 'Estudiamos cómo observar, modelar y comprender mejor el aprendizaje.' },
  {
    id: 'tecnologia',
    icon: 'chip',
    label: 'Tecnología',
    text: 'Desarrollamos herramientas digitales, inteligencia artificial y experiencias interactivas para poner ese conocimiento en práctica.',
  },
  {
    id: 'adaptativo',
    icon: 'ruta',
    label: 'Aprendizaje adaptativo',
    text: 'Buscamos que la experiencia educativa se ajuste según la evidencia real de cada estudiante.',
  },
  {
    id: 'impacto',
    icon: 'corazon',
    label: 'Impacto educativo',
    text: 'Queremos ayudar a estudiantes, docentes y familias a tomar mejores decisiones para aprender y enseñar.',
  },
];

export const QUE_ES_SINTESIS =
  'Synapxix es una iniciativa de I+D+i educativa que combina investigación, tecnología e inteligencia artificial para construir aprendizaje adaptativo basado en evidencia.';

/** Lo que Synapxix no es: el proyecto no se confunde con el campo. */
export const NO_SOMOS = ['No somos solo un videojuego educativo.', 'No somos solo IA en educación.'];

/**
 * Escena 3 · ¿Por qué lo hacemos? Una misma escena que cambia: hoy, el mismo
 * camino para todos; lo que buscamos, un camino por estudiante, sostenido
 * por evidencia.
 */
export const POR_QUE = {
  intro: 'La IA ya llegó a la educación. Lo que falta es evidencia real, criterio pedagógico y comprender a cada estudiante.',
  hoy: { label: 'Hoy', caption: 'El mismo camino para todos.', items: ['Igual para todos', 'Poca personalización', 'Difícil saber cómo aprende cada niño'] },
  futuro: {
    label: 'Lo que buscamos',
    caption: 'Un camino por estudiante, sostenido por evidencia.',
    items: ['Modelos dinámicos del aprendizaje', 'Más comprensión del estudiante', 'Mejor apoyo para docentes y familias', 'Personalización con responsabilidad'],
  },
  reveal: 'No queremos usar IA solo para generar contenido. Queremos usarla para comprender mejor el aprendizaje y construir experiencias más pertinentes.',
};

/** Escena 4 · Nuestra trayectoria: cuatro hitos con dos líneas cada uno. */
export const TRAYECTORIA = [
  {
    id: 'territorio',
    icon: 'casa',
    title: 'Territorio y alfabetización digital',
    text: 'El proyecto nace de experiencias reales de trabajo educativo y tecnológico, para acercar el aprendizaje y la innovación a niños y comunidades.',
  },
  {
    id: 'pet',
    icon: 'birrete',
    title: 'PET · GamificaMente: Territorios de Saberes',
    text: 'En la UADER, dentro de la Práctica Educativa Territorial, empezamos a articular educación, gamificación, inteligencia artificial y territorio.',
  },
  {
    id: 'evolucion',
    icon: 'brote',
    title: 'Evolución hacia Synapxix',
    text: 'De «crear experiencias educativas» a una pregunta más profunda: ¿cómo comprender y modelar el aprendizaje de manera dinámica y responsable?',
  },
  {
    id: 'laboratorio',
    icon: 'red',
    title: 'Construcción del laboratorio',
    text: 'Hoy buscamos consolidar una iniciativa interinstitucional de I+D en aprendizaje adaptativo: educación, psicopedagogía, narrativa, ciencia de datos e ingeniería.',
  },
];

export const TRAYECTORIA_CIERRE =
  'Synapxix no surge de una idea aislada: surge de una trayectoria educativa, tecnológica y territorial que hoy evoluciona hacia un laboratorio latinoamericano de aprendizaje adaptativo.';

/** Cierre del bloque I. */
export const EN_UNA_FRASE = {
  text: 'Comprendemos cómo aprende cada persona para personalizar su aprendizaje, con evidencia e IA responsable.',
  dala: 'Nuestra arquitectura para lograrlo se llama D.A.L.A.',
  next: 'Ahora que conocés Synapxix, te damos la bienvenida al equipo.',
};

export const AREAS = [
  'Diseño y narrativa',
  'Pedagogía e investigación',
  'Tecnología y datos',
  'Producto y estrategia',
  'Comunidad y operaciones',
];

export const CV_HEADS_UP = 'Tené a mano tu CV: al final te vamos a pedir que lo subas (es opcional).';

// ── Acto II · Bienvenida ──────────────────────────────────────────────────
// Una sola autorización, obligatoria para continuar: sin registro no hay
// experiencia (revisión de la bienvenida, 28-oct).

export const CONSENT_TEXT =
  'Al continuar autorizo que Synapxix registre mis decisiones en esta experiencia para D.A.L.A. y la investigación del piloto. Mi identidad se guarda aparte de mis datos y puedo pedir su retiro cuando quiera.';

/**
 * El ciclo de Synapxix y el lugar de D.A.L.A. en él. Coordenadas del centro
 * de cada etapa en el lienzo del gráfico (100 × 68).
 */
export const CICLO_SYNAPXIX: Array<{ id: string; icon: string; label: string; text: string; x: number; y: number }> = [
  { id: 'cuenta', icon: 'usuario', label: 'Cuenta personal', text: 'Cada estudiante entra con su propio perfil.', x: 14, y: 11 },
  { id: 'experiencia', icon: 'juego', label: 'Juego o experiencia', text: 'Juega, explora y decide: cada decisión es una señal.', x: 50, y: 10 },
  { id: 'dala', icon: 'chispa', label: 'D.A.L.A.', text: 'Procesa las señales con IA: evidencia, hipótesis y una propuesta.', x: 50, y: 34 },
  { id: 'modelo', icon: 'grafico', label: 'Modelo dinámico', text: 'Lo que sabemos hoy de cómo aprende, con su evidencia.', x: 87, y: 34 },
  { id: 'docente', icon: 'docente', label: 'Herramienta docente', text: 'La docente ve el modelo y decide qué se aplica.', x: 50, y: 59 },
  { id: 'contenido', icon: 'chispa', label: 'Contenido personalizado', text: 'La próxima experiencia se ajusta, y el ciclo vuelve a empezar.', x: 13, y: 34 },
];

export const CONSENT_DETAILS = {
  title: 'Tus datos, en claro',
  text: 'Esto es lo que autorizas al continuar.',
  list: [
    'Qué: decisiones, respuestas, pistas y tiempos dentro del juego. Nunca borradores, cámara ni audio.',
    'Para qué: probar D.A.L.A. y mostrarte tu modelo. Nunca para evaluar desempeño, contratar ni comparar personas.',
    'Quién: vos y el equipo de investigación del piloto. Tu identidad se guarda aparte de tus eventos.',
    'Cuánto tiempo: mientras dure el piloto interno.',
    'Retiro: podés cambiar estos permisos o pedir el borrado cuando quieras.',
  ],
};

// ── Acto III · Aprender D.A.L.A. ──────────────────────────────────────────
// El mismo vocabulario que la misión El ciclo: lo que se aprende aquí se
// reconstruye después. Cada componente trae un ejemplo del caso de Ana.

/** Diapositiva breve antes del núcleo: qué es D.A.L.A., en una frase. */
export const DALA_INTRO = {
  title: 'D.A.L.A. es la arquitectura que diseñamos para que la magia suceda.',
  claim: 'Convierte decisiones en comprensión.',
  steps: [
    { icon: 'lupa', label: 'Observa', text: 'Cada decisión, con lo que estaba disponible.' },
    { icon: 'ruta', label: 'Comprende', text: 'Hipótesis revisables, nunca etiquetas.' },
    { icon: 'chispa', label: 'Propone y comprueba', text: 'Una persona decide; el resultado lo actualiza.' },
  ],
};

export const NUCLEO: Array<{ id: string; label: string; text: string; example: string }> = [
  { id: 'evidencia', label: 'Evidencia', text: 'Lo que ocurrió, con lo que estaba disponible.', example: 'Ana respondió, se equivocó y pidió la pista que tenía a mano.' },
  { id: 'estado', label: 'Estado', text: 'Lo que creemos hoy, y con cuánta evidencia.', example: 'Pidió ayuda tras intentar en 1 de 2 tareas difíciles: hipótesis provisional.' },
  { id: 'decision', label: 'Decisión', text: 'Qué conviene probar después, con sus razones.', example: 'Practicar con apoyo. Razón: 1 de 2.' },
  { id: 'intervencion', label: 'Intervención', text: 'Lo que se aplica, después de que una persona lo aprueba.', example: 'La docente aprueba: la próxima tarea trae la pista.' },
  { id: 'resultado', label: 'Resultado', text: 'Lo que pasó en una tarea nueva.', example: 'Ana resolvió la siguiente sin usar la pista.' },
  { id: 'actualizacion', label: 'Actualización', text: 'El estado se recalcula. Nada queda fijo.', example: 'Ahora son 2 de 3: la hipótesis cambia.' },
];

export const DALA_RULES = ['Nada sin evidencia', 'Nunca una etiqueta', 'Siempre revisable'];

/** Escena 07 · un caso, tres lecturas; solo una se sostiene. */
export const CASO_ANA = {
  situation: 'Durante una misión, Ana respondió una vez, se equivocó y pidió una pista disponible. Después corrigió su respuesta.',
  ask: '¿Qué se sostiene con estos datos?',
  options: [
    { id: 'a', text: 'Ana necesita ayuda en todas las actividades.', ok: false },
    { id: 'b', text: 'Ana usó una pista después de un primer intento, en esta misión.', ok: true },
    { id: 'c', text: 'Ana aprende mejor si siempre recibe pistas.', ok: false },
  ],
  hint: 'Buscá la frase que solo cuenta lo que pasó en esta misión.',
  why: 'Las otras dos saltan de una misión a «siempre». Para afirmarlas harían falta más tareas, con y sin pista.',
};

/** Escena 08 · tres tarjetas nuevas: no se repiten en el Observatorio. */
export const FUENTES_CARDS: Array<{ id: string; text: string; kind: 'observed' | 'reported' | 'inferred' }> = [
  { id: 'f1', text: 'Podría preferir experiencias narrativas.', kind: 'inferred' },
  { id: 'f2', text: 'Abrió la explicación adicional.', kind: 'observed' },
  { id: 'f3', text: 'Dijo que le interesan los videojuegos.', kind: 'reported' },
];

export const FUENTES_BUCKETS = [
  { id: 'observed', label: 'Dato observado' },
  { id: 'reported', label: 'Declaración' },
  { id: 'inferred', label: 'Inferencia' },
];

export const FUENTES_HINT = '¿Lo registró el sistema, lo dijo la persona o lo estamos suponiendo?';

// ── Acto IV · Tu primera semana en Synapxix ───────────────────────────────
// Un onboarding para conocer a la persona: qué le sale natural, qué la
// mueve, cómo encara un desafío real, cómo actúa en equipo y cómo trabaja.
// Lo declarado viaja como declaración y lo que hace, como observación; la
// estrella cambia con cada respuesta y se describe con una frase, nunca con
// una etiqueta.

export const INTEREST_FAMILIES: Record<string, string> = {
  crear: 'Crear',
  analizar: 'Analizar',
  acompanar: 'Acompañar',
  construir: 'Construir',
};

/** Acento de la estrella por familia (paleta extendida, solo en la estrella). */
export const FAMILY_ACCENT: Record<string, string> = {
  crear: '#FFD93D',
  analizar: '#A6E6FF',
  acompanar: '#FF7A89',
  construir: '#9BE564',
};

export type DayId = 'superpoderes' | 'motivaciones' | 'desafio' | 'equipo' | 'trabajo';

export const SEMANA = {
  title: 'Tu primera semana en Synapxix',
  lead: 'Cinco momentos para conocerte: qué te sale natural, qué te mueve, cómo encarás un desafío, cómo te llevás con el equipo y cómo trabajás. Tu estrella cambia con cada respuesta.',
  days: [
    { id: 'superpoderes' as DayId, day: 'Lunes', icon: 'chispa', name: 'Tus superpoderes', goal: 'Elegí tres cosas que te salen natural y una que querés aprender.' },
    { id: 'motivaciones' as DayId, day: 'Martes', icon: 'corazon', name: 'Lo que te mueve', goal: 'Seis elecciones rápidas entre cosas que importan en un trabajo.' },
    { id: 'desafio' as DayId, day: 'Miércoles', icon: 'ruta', name: 'Un desafío a tu medida', goal: 'Elegí un problema real del equipo y resolvelo a tu manera.' },
    { id: 'equipo' as DayId, day: 'Jueves', icon: 'red', name: 'Con el equipo', goal: 'Situaciones de todos los días, con Lucía y la IA a mano.' },
    { id: 'trabajo' as DayId, day: 'Viernes', icon: 'usuario', name: 'Cómo trabajás', goal: 'Horarios, canales, devoluciones y ritmo: tus acuerdos de trabajo.' },
  ],
};

/**
 * Doce habilidades, tres por familia, en orden intercalado y fijo. Pensadas
 * para el grupo (sistemas, matemática y carrera docente): crear productos,
 * pensar con lógica y críticamente, investigar, trabajar en equipo, IA y
 * programación.
 */
export const SKILLS: Array<{ id: string; family: string; label: string; text: string }> = [
  { id: 'disenar', family: 'crear', label: 'Diseñar', text: 'Pensar cómo se usa y se ve un producto' },
  { id: 'investigar', family: 'analizar', label: 'Investigar', text: 'Buscar, leer y comparar fuentes' },
  { id: 'ensenar', family: 'acompanar', label: 'Enseñar', text: 'Explicar hasta que se entienda' },
  { id: 'programar', family: 'construir', label: 'Programar', text: 'Escribir código que funcione' },
  { id: 'idear', family: 'crear', label: 'Idear productos', text: 'Convertir un problema en una solución' },
  { id: 'datos', family: 'analizar', label: 'Analizar datos', text: 'Encontrar el patrón en los números' },
  { id: 'equipo', family: 'acompanar', label: 'Trabajar en equipo', text: 'Hacer que un grupo avance junto' },
  { id: 'logica', family: 'construir', label: 'Resolver con lógica', text: 'Partir un problema en pasos claros' },
  { id: 'prototipar', family: 'crear', label: 'Prototipar', text: 'Armar rápido una versión para probar' },
  { id: 'critico', family: 'analizar', label: 'Pensar críticamente', text: 'Detectar lo que no cierra en un argumento' },
  { id: 'comunicar', family: 'acompanar', label: 'Comunicar', text: 'Contar una idea técnica en simple' },
  { id: 'ia', family: 'construir', label: 'Usar IA', text: 'Sacarle provecho a herramientas de IA' },
];

/**
 * Cuatro motivaciones; cada una aparece tres veces, siempre con otra frase,
 * para que la elección sea entre situaciones y no entre la misma tarjeta.
 * La etiqueta no se muestra: es lo que registra el motor.
 */
export const MOTIVATORS: Record<string, { label: string; texts: [string, string, string]; color: string }> = {
  aprender: {
    label: 'Aprender cosas nuevas',
    texts: ['Aprender algo que hoy no sé hacer', 'Tener tiempo para estudiar una herramienta nueva', 'Que cada proyecto me deje una habilidad más'],
    color: '#FFD93D',
  },
  impacto: {
    label: 'Ver el impacto',
    texts: ['Ver que lo que hago le sirve a alguien', 'Saber que lo que construí lo usa gente de verdad', 'Poder mostrar qué cambió gracias a mi trabajo'],
    color: '#FF7A89',
  },
  autonomia: {
    label: 'Tener autonomía',
    texts: ['Decidir cómo y cuándo hago mi trabajo', 'Que confíen en mí sin revisar cada paso', 'Elegir yo el camino para resolver un problema'],
    color: '#A6E6FF',
  },
  equipo: {
    label: 'Ser parte de un buen equipo',
    texts: ['Trabajar con gente con la que me entiendo', 'Tener con quién pensar cuando me trabo', 'Que los logros sean de todo el grupo'],
    color: '#9BE564',
  },
};

/** Los seis pares posibles; cada motivación aparece tres veces y cambia de lado. */
export const MOTIVATION_PAIRS: Array<[string, string]> = [
  ['aprender', 'impacto'],
  ['autonomia', 'equipo'],
  ['equipo', 'aprender'],
  ['impacto', 'autonomia'],
  ['autonomia', 'aprender'],
  ['equipo', 'impacto'],
];

export const MOTIVATION_ASKS = [
  'En tu primer proyecto, ¿qué pesa más?',
  'Si tuvieras que elegir una, ¿cuál?',
  'Un viernes a la tarde, ¿qué te dejaría más contento?',
  '¿Qué te haría quedarte en un trabajo?',
  'Si mañana cambiara una sola cosa, ¿cuál preferís?',
  'Última: ¿qué pesa más para vos?',
];

export type DesafioId = 'priorizar' | 'codigo' | 'informe' | 'mensaje';

export const DESAFIOS: Array<{ id: DesafioId; scene: string; families: string[]; icon: string; name: string; goal: string; family: string }> = [
  { id: 'priorizar', scene: 'desafio_priorizar', families: ['crear'], icon: 'ruta', name: 'Planificar una funcionalidad', goal: 'Ordená los seis pasos para lanzar una función nueva de la app.', family: 'Crear · producto' },
  { id: 'codigo', scene: 'desafio_codigo', families: ['construir'], icon: 'chip', name: 'Encontrá el bug', goal: 'Una función no hace lo que dice, y otra la escribió una IA. Encontrá el error.', family: 'Construir · programación e IA' },
  { id: 'informe', scene: 'desafio_informe', families: ['analizar'], icon: 'grafico', name: 'El informe con un error', goal: 'Encontrá la conclusión que no se sostiene con los datos.', family: 'Analizar · pensamiento crítico' },
  { id: 'mensaje', scene: 'desafio_mensaje', families: ['acompanar'], icon: 'docente', name: 'Explicarlo en simple', goal: 'Una docente que usa la app pregunta algo técnico. Elegí la respuesta más clara.', family: 'Acompañar · comunicación' },
];

export const MODES = [
  { id: 'con_pista' as const, icon: '✦', label: 'Con pista', copy: 'Tenés una ayuda a mano.' },
  { id: 'sin_pista' as const, icon: '◆', label: 'Sin pista', copy: 'Lo resolvés solo con lo que hay.' },
];

/** Priorizar: el orden esperado y la mezcla fija con que aparece. */
export const PRIORIZAR = {
  ask: 'Ordená los pasos, de lo primero a lo último.',
  steps: [
    'Entender qué problema resuelve',
    'Revisar los datos de uso',
    'Acordar el alcance con el equipo',
    'Armar un prototipo',
    'Probarlo con usuarios',
    'Ajustar y lanzar',
  ],
  pool: [
    'Armar un prototipo',
    'Entender qué problema resuelve',
    'Ajustar y lanzar',
    'Revisar los datos de uso',
    'Probarlo con usuarios',
    'Acordar el alcance con el equipo',
  ],
  hint: 'Antes de construir hay que entender el problema y mirar los datos. Y nada se lanza sin probarlo con quien lo va a usar.',
  why: 'Entender el problema y los datos evita construir lo que nadie necesita; probar con usuarios antes de lanzar evita arreglar después.',
  instructions: {
    title: 'Consigna',
    text: 'Tocá los pasos en el orden en que los harías. Podés deshacer o empezar desde el final.',
    list: ['Deshacer no tiene costo.', 'Cambiar de enfoque es válido.', 'Si te equivocás, podés reintentar u omitir.'],
    observes: 'El orden en que tocás, si deshacés, si cambiás de enfoque, si pedís la pista y si omitís. Nada más.',
  },
};

export interface Ronda {
  id: string;
  context: string;
  options: Array<{ text: string; ok: boolean }>;
  why: string;
}

/** Informe y mensaje: rondas de elegir una opción entre cuatro. */
export const RONDAS: Record<'codigo' | 'informe' | 'mensaje', {
  ask: string;
  verify: string;
  wrong: string;
  right: string;
  hint: string;
  rounds: Ronda[];
  instructions: { title: string; text: string; list: string[]; observes: string };
}> = {
  codigo: {
    ask: 'Encontrá la línea con el error.',
    verify: 'ES ESTA',
    wrong: 'Esa línea está bien. Seguí el código con un ejemplo concreto.',
    right: 'Bug encontrado.',
    hint: 'Descartar una',
    rounds: [
      {
        id: 'r1',
        context: 'Esta función debería devolver el promedio de una lista de notas.',
        options: [
          { text: 'function promedio(notas) {', ok: false },
          { text: '  let suma = 0;', ok: false },
          { text: '  for (const n of notas) suma += n;', ok: false },
          { text: '  return suma / (notas.length - 1);', ok: true },
        ],
        why: 'El promedio se divide por la cantidad de notas, notas.length. Con [6, 8] daría 14 en vez de 7.',
      },
      {
        id: 'r2',
        context: 'Le pediste a una IA una función que devuelva el número más grande de una lista. Te dice que la probó con [3, 9, 4].',
        options: [
          { text: '  let max = 0;', ok: true },
          { text: '  for (const x of lista) {', ok: false },
          { text: '    if (x > max) max = x;', ok: false },
          { text: '  return max;', ok: false },
        ],
        why: 'Con una lista de negativos, como [-5, -2], devuelve 0, que ni siquiera está en la lista: conviene empezar con el primer elemento. Que la IA diga que la probó no reemplaza probar los casos borde.',
      },
    ],
    instructions: {
      title: 'Consigna',
      text: 'Cada función tiene una línea con un error. Tocala y confirmá.',
      list: ['Probá el código con un ejemplo concreto.', 'Podés cambiar de opción antes de confirmar.', 'Si te equivocás, podés reintentar u omitir.'],
      observes: 'Qué elegís, si cambiás antes de confirmar, si pedís la pista y si omitís. Nada más.',
    },
  },
  informe: {
    ask: 'Encontrá la conclusión que dice más de lo que muestran los datos.',
    verify: 'ES ESTA',
    wrong: 'Esa línea se sostiene con los datos. Mirá de nuevo las cuentas y las conclusiones.',
    right: 'Encontraste el error antes de mandarlo.',
    hint: 'Descartar una',
    rounds: [
      {
        id: 'r1',
        context: 'Informe de la beta · app para practicar matemática',
        options: [
          { text: '28 personas probaron la beta durante la semana.', ok: false },
          { text: '12 de 28 usaron la pista en el ejercicio de fracciones.', ok: false },
          { text: 'Es decir, a la mitad de los usuarios le cuestan las fracciones.', ok: true },
          { text: 'El ejercicio de fracciones fue el más usado de la semana.', ok: false },
        ],
        why: '12 de 28 es menos de la mitad, y usar una pista no es lo mismo que tener una dificultad.',
      },
      {
        id: 'r2',
        context: 'Informe del mes · dos grupos de usuarios',
        options: [
          { text: 'El grupo que activó las notificaciones practicó más días.', ok: false },
          { text: 'El otro grupo practicó, en promedio, dos días por semana.', ok: false },
          { text: 'Por lo tanto, las notificaciones hacen que la gente aprenda más.', ok: true },
          { text: 'Falta comparar grupos parecidos que solo difieran en las notificaciones.', ok: false },
        ],
        why: 'Que dos cosas pasen juntas no prueba que una cause la otra; y practicar más días no es lo mismo que aprender más.',
      },
    ],
    instructions: {
      title: 'Consigna',
      text: 'En cada informe hay una conclusión que dice más de lo que muestran los datos. Tocala y confirmá.',
      list: ['Podés cambiar de opción antes de confirmar.', 'Si te equivocás, podés reintentar u omitir.'],
      observes: 'Qué elegís, si cambiás antes de confirmar, si pedís la pista y si omitís. Nada más.',
    },
  },
  mensaje: {
    ask: 'Elegí la respuesta más clara para la docente.',
    verify: 'MANDAR ESTE',
    wrong: 'Ese mensaje no la ayuda del todo: puede tener jerga, una etiqueta o quedarse corto.',
    right: 'Mensaje claro, sin jerga y sin etiquetas.',
    hint: 'Descartar uno',
    rounds: [
      {
        id: 'r1',
        context: 'Una docente que usa la app escribe: «¿Qué quiere decir que el sistema “se adapta” a cada chico?»',
        options: [
          { text: 'Usa un modelo de machine learning que optimiza el engagement en tiempo real.', ok: false },
          { text: 'Que el sistema sabe cómo aprende cada chico.', ok: false },
          { text: 'Que mira qué hace cada chico, por ejemplo si pidió una pista, y con eso elige la próxima actividad. Vos podés ver por qué la eligió y cambiarla.', ok: true },
          { text: 'Es medio complicado de explicar, pero funciona.', ok: false },
        ],
        why: 'Explica qué hace con un ejemplo concreto y le deja el control a la docente. Sin jerga, sin prometer de más y sin quedarse corto.',
      },
      {
        id: 'r2',
        context: 'La misma docente pregunta: «¿Qué quiere decir que Mateo pidió la pista tres veces?»',
        options: [
          { text: 'Que Mateo tiene un problema de comprensión.', ok: false },
          { text: 'Que en 3 de 4 lecturas abrió la ayuda antes de responder. Puede que la consigna le cueste: ¿lo vemos juntos en la próxima clase?', ok: true },
          { text: 'Es un indicador de baja autorregulación metacognitiva.', ok: false },
          { text: 'No te preocupes, es normal.', ok: false },
        ],
        why: 'Describe el hecho con su alcance, deja abierta la explicación y propone un paso concreto.',
      },
    ],
    instructions: {
      title: 'Consigna',
      text: 'Elegí la respuesta que más ayuda a la docente: clara, sin jerga y sin etiquetas.',
      list: ['Podés cambiar de opción antes de mandar.', 'Si te equivocás, podés reintentar u omitir.'],
      observes: 'Qué elegís, si cambiás antes de mandar, si pedís la pista y si omitís. Nada más.',
    },
  },
};

/** Con el equipo: las cuatro formas de actuar, iguales en cada situación. */
export const ESTILOS: Record<string, { label: string; color: string }> = {
  directo: { label: 'Hablarlo de frente', color: '#FFB347' },
  ayuda: { label: 'Ofrecer ayuda', color: '#FF8FB1' },
  plan: { label: 'Ajustar el plan', color: '#8EC5FF' },
  sumar: { label: 'Sumar a alguien más', color: '#9BE564' },
};

/** Cuatro situaciones de todos los días; el orden de las opciones rota. */
export const SITUACIONES: Array<{ id: string; ask: string; options: Array<{ value: string; text: string }> }> = [
  {
    id: 'situacion-1',
    ask: 'Faltan dos días para la entrega y una compañera todavía no mandó su parte.',
    options: [
      { value: 'directo', text: 'Le escribo y le pregunto cómo viene' },
      { value: 'ayuda', text: 'Le ofrezco hacer una parte con ella' },
      { value: 'plan', text: 'Propongo mover la fecha o achicar lo que entregamos' },
      { value: 'sumar', text: 'Le aviso a quien coordina para ver cómo seguimos' },
    ],
  },
  {
    id: 'situacion-2',
    ask: 'En una reunión, alguien propone una idea que te parece que no va a funcionar.',
    options: [
      { value: 'ayuda', text: 'Pregunto qué haría falta para que funcione' },
      { value: 'plan', text: 'Propongo probarla en chiquito antes de decidir' },
      { value: 'sumar', text: 'Sugiero escuchar a alguien que sepa del tema' },
      { value: 'directo', text: 'Lo digo en el momento, con mis razones' },
    ],
  },
  {
    id: 'situacion-3',
    ask: 'Un compañero nuevo está perdido con las herramientas del equipo.',
    options: [
      { value: 'plan', text: 'Armo una guía corta para los que vengan' },
      { value: 'sumar', text: 'Le presento a quien mejor las conoce' },
      { value: 'directo', text: 'Le pregunto qué le está costando' },
      { value: 'ayuda', text: 'Me siento un rato con él a mostrarle' },
    ],
  },
  {
    id: 'situacion-4',
    ask: 'Dos personas del equipo no se ponen de acuerdo y el trabajo está frenado.',
    options: [
      { value: 'sumar', text: 'Pido que alguien de afuera nos ayude a destrabar' },
      { value: 'directo', text: 'Les propongo hablarlo los tres, sin vueltas' },
      { value: 'ayuda', text: 'Escucho a cada una por separado' },
      { value: 'plan', text: 'Propongo un criterio para decidir y seguir' },
    ],
  },
];

/**
 * Con el equipo: dos momentos para elegir a quién recurrir y un resumen de
 * la IA que atribuye mal una tarea. Ninguna opción es la correcta.
 */
export const EQUIPO = {
  intro: 'Jueves. Lucía, que lleva dos años en el equipo, y el asistente de IA están disponibles. Vos decidís cómo avanzar.',
  apoyos: [
    {
      id: 'apoyo-1',
      ask: 'Te toca arreglar un error en una parte del código que no escribiste, y no terminás de entender cómo funciona.',
      options: [
        { value: 'solo', text: 'Lo investigo por mi cuenta', outcome: 'Leés el código con calma y encontrás dónde se arma el dato.' },
        { value: 'persona', text: 'Le pregunto a Lucía', outcome: 'Lucía: «Esa parte la escribí yo. Te la muestro en cinco minutos».' },
        { value: 'ia', text: 'Le pido a la IA que me lo explique', outcome: 'La IA te explica la función paso a paso. Una parte no coincide con lo que ves en el código.' },
        { value: 'despues', text: 'Lo dejo para más tarde', outcome: 'Lo anotás. Mañana lo encarás con la cabeza fresca.' },
      ],
    },
    {
      id: 'apoyo-2',
      ask: 'Tu arreglo está listo. Antes de subirlo…',
      options: [
        { value: 'persona', text: 'Le pido a Lucía que lo revise', outcome: 'Lucía lo revisa: «Prolijo. Sumale una prueba y subilo».' },
        { value: 'ia', text: 'Le pido a la IA que lo revise', outcome: 'La IA encuentra un caso borde que no habías probado. Lo agregás y lo subís.' },
        { value: 'solo', text: 'Lo subo así, ya lo probé', outcome: 'Subido. Funciona.' },
        { value: 'despues', text: 'Lo dejo para mañana', outcome: 'Queda para mañana a primera hora.' },
      ],
    },
  ],
  resumen: {
    ask: 'El asistente de IA armó el resumen de la reunión del equipo:',
    text: '«Se acordó lanzar la versión nueva el lunes. Lucía se encarga de escribir la documentación.»',
    reasons: [
      'Lo armó a partir de la transcripción de la reunión.',
      'En la transcripción, Lucía dijo: «Puedo revisar la documentación, si alguien la escribe».',
    ],
    verdicts: [
      { id: 'approved' as const, label: 'Mandarlo así', feedback: 'Ojo: Lucía se ofreció a revisar, no a escribir. Así le queda una tarea que no tomó.' },
      { id: 'edited' as const, label: 'Corregirlo', feedback: 'Bien: lo corregís para que diga lo que Lucía ofreció y quién escribe la documentación.' },
      { id: 'rejected' as const, label: 'Descartarlo', feedback: 'Lo descartás y lo escribís de cero: también vale.' },
    ],
  },
};

/** Cómo trabajás: seis declaraciones, perfil de trabajo y no evidencia. */
export const TRABAJO: Array<{ id: string; ask: string; options: Array<{ value: string; text: string }> }> = [
  {
    id: 'forma',
    ask: '¿Cómo trabajás mejor?',
    options: [
      { value: 'solo', text: 'Concentrado, por mi cuenta' },
      { value: 'pareja', text: 'En pareja, compartiendo los tiempos' },
      { value: 'equipo', text: 'En equipo, con muchas voces' },
      { value: 'alterno', text: 'Alternando según el momento' },
    ],
  },
  {
    id: 'horario',
    ask: '¿En qué momento del día rendís más?',
    options: [
      { value: 'manana', text: 'A la mañana temprano' },
      { value: 'tarde', text: 'A la tarde' },
      { value: 'noche', text: 'A la noche' },
      { value: 'flexible', text: 'Depende del día' },
    ],
  },
  {
    id: 'canal',
    ask: 'Si es algo urgente, ¿cómo preferís que te avisen?',
    options: [
      { value: 'chat', text: 'Un mensaje por chat' },
      { value: 'llamada', text: 'Una llamada corta' },
      { value: 'persona', text: 'Que me lo digan en persona' },
      { value: 'mail', text: 'Un mail con todo el detalle' },
    ],
  },
  {
    id: 'feedback',
    ask: '¿Cómo te gusta recibir una devolución?',
    options: [
      { value: 'directo', text: 'Directa y breve' },
      { value: 'ejemplos', text: 'Con ejemplos concretos' },
      { value: 'escrito', text: 'Por escrito, para pensarla' },
      { value: 'charla', text: 'En una charla, con tiempo' },
    ],
  },
  {
    id: 'ritmo',
    ask: 'Ante una entrega, preferís…',
    options: [
      { value: 'rapido', text: 'Mostrar algo rápido y ajustar' },
      { value: 'pulido', text: 'Mostrarlo cuando está bien terminado' },
      { value: 'depende', text: 'Depende de qué se entrega' },
    ],
  },
  {
    id: 'reaccion',
    ask: 'Cuando algo no sale como querías…',
    options: [
      { value: 'reintento', text: 'Lo intento de nuevo, por otro camino' },
      { value: 'ayuda', text: 'Busco a alguien para pensarlo juntos' },
      { value: 'pausa', text: 'Me tomo un respiro y vuelvo' },
      { value: 'investigo', text: 'Investigo por mi cuenta hasta entenderlo' },
    ],
  },
];

/** Cómo se nombra cada respuesta en la frase de la estrella. */
export const STAR_WORDS = {
  motivacion: {
    aprender: 'aprender cosas nuevas',
    impacto: 'ver el impacto de lo que hacés',
    autonomia: 'decidir cómo hacés tu trabajo',
    equipo: 'ser parte de un buen equipo',
  } as Record<string, string>,
  estilo: {
    directo: 'hablarlo de frente',
    ayuda: 'ofrecer ayuda',
    plan: 'ajustar el plan',
    sumar: 'sumar a alguien más',
  } as Record<string, string>,
  forma: { solo: 'concentrado por tu cuenta', pareja: 'en pareja', equipo: 'en equipo', alterno: 'alternando según el momento' } as Record<string, string>,
};

// ── Acto V · Tu lugar en el equipo (CV) y cierre ──────────────────────────

export const CV_TEXT = {
  title: 'Ya sabemos cómo trabajás. Ahora contanos qué hiciste.',
  lead: 'Subí tu CV o compartí enlaces (LinkedIn, portafolio, GitHub). Es opcional y podés hacerlo después.',
  consent:
    'Autorizo que el equipo de Synapxix vea mi CV y mis enlaces para conocer mi perfil profesional. No se analizan con IA ni se usan para evaluarme o seleccionarme.',
};

/** Cierre: una charla breve con el equipo para empezar. */
export const GRACIAS = {
  title: '¡Gracias por participar, {name}!',
  lead: 'Llegaste al final de tu primer pulso. Lo que contaste e hiciste nos ayuda a armar tu primer mes con vos.',
  ask: 'Para arrancar, hagamos una charla breve de 16 minutos. ¿Qué día y en qué horario te queda mejor?',
  days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  slots: ['9 a 11 h', '11 a 13 h', '14 a 16 h', '16 a 18 h', '18 a 20 h'],
  done: 'Listo. Te escribimos para confirmar la charla del {day}, de {slot}.',
};

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
  exploration_offered: 'Se le ofreció contenido opcional',
  exploration_opened: 'Abrió contenido opcional',
  choice_offered: 'Opciones de formato',
  choice_made: 'Eligió formato',
  declaration_made: 'Declaró una preferencia',
  recommendation_presented: 'Recomendación presentada',
  reasons_opened: 'Abrió las razones',
  recommendation_reviewed: 'Dio su veredicto',
  claim_reviewed: 'Revisó una afirmación',
};
