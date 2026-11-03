# D.A.L.A. para diseño de experiencias

**Guía de base para el diseñador/a de experiencia.** Describe lo que está
construido y operativo hoy en el repo — no la aspiración de la spec — para que
las directrices de experiencia se diseñen **sobre** el modelo real. Todo lo que
figura acá está implementado, probado y corriendo (referencia de código al pie
de cada sección).

> **La idea en una frase:** la experiencia no evalúa a nadie — crea situaciones
> jugables donde la conducta deja señales; D.A.L.A. convierte esas señales en
> evidencia, la evidencia en estados provisionales con incertidumbre, y los
> estados en recomendaciones que **siempre** revisa un humano.

---

## 1. El ciclo que ya funciona

```
evento → evidencia → estado → decisión (shadow) → veredicto humano → outcome → actualización
```

Cada flecha es trazable: desde cualquier recomendación se puede reconstruir qué
eventos la originaron, qué regla los interpretó, con qué versión y qué pasó
después. Niveles de conformidad alcanzados: **Capture** (eventos válidos,
seudónimos, consentimiento), **State** (estados con evidencia e incertidumbre)
y **Recommend en shadow mode** (recomienda, jamás aplica).

## 2. Qué puede "decir" una experiencia al motor

Una experiencia no envía interpretaciones ("se frustró", "le gusta") — envía
**hechos** con un vocabulario cerrado de 21 tipos de evento. Los que el juego
usa hoy:

| Grupo | Eventos | El gesto del jugador |
|---|---|---|
| Sesión | `session_started` / `completed` / `abandoned` | entrar, terminar, irse |
| Presentación | `task_presented`, `instruction_opened` | ver una tarea, reabrir la consigna |
| Respuesta | `answer_submitted`, `answer_revised`, `action_performed` | decidir, corregirse, manipular |
| Estrategia | `attempt_repeated`, `strategy_changed`, `task_completed`, `task_abandoned` | reintentar, cambiar de enfoque, cerrar, abandonar |
| Apoyo | `hint_requested`, `support_offered/accepted/rejected` | pedir/recibir ayuda |
| Comunicación | `clarification_requested`, `explanation_requested` | preguntar |
| Humano | `teacher_annotation`, `recommendation_approved/rejected` | el veredicto de una persona |

Cada evento viaja con **contexto** que el diseño controla y que cambia cómo se
interpreta la señal:

- `taskId` y `skillIds` — qué tarea y qué habilidad pone en juego (obligatorio de diseño: sin tarea no hay diversidad de evidencia).
- `difficulty` (0..1) y `mode` (screening / learning / practice).
- `rewardCondition` (`none` / `xp` / `credits`) — **si hay recompensa activa, persistencia y compromiso NO se actualizan** (la recompensa distorsiona la señal).
- Payload por evento: `correct`, `attempt`, `latencyMs`, `level` de pista, `from/to` de estrategia.

Ampliar este vocabulario es cambiar el estándar (nueva versión) — se puede,
pero es una decisión de comité, no de una pantalla.

*Código: `libs/dala/contracts/src/lib/event.ts`*

## 3. Los instrumentos disponibles

Un **instrumento** es una mecánica jugable con adaptador propio que traduce
gestos a eventos canónicos. Hoy existen tres, ya conectados de punta a punta:

| Instrumento | Mecánica | Gestos que captura |
|---|---|---|
| `categorization` | clasificar cartas en cajas | acierto/error, reintento, pista, latencia |
| `timeline-order` | ordenar una secuencia | acierto por paso, **cambio de estrategia** (armar desde el final), reordenar |
| `intruder` | detectar la carta que no pertenece | acierto/error, descarte asistido (pista), latencia |

El diseñador puede **re-tematizar y re-contenidizar estos tres sin tocar el
motor**: cartas nuevas, narrativas nuevas, dificultades nuevas — mismo
instrumento. Una mecánica nueva (p. ej. construir, negociar, dibujar) requiere
un adaptador nuevo y versión nueva: es viable, pero es un proyecto, no un ajuste.

Interacciones que el SDK ya entiende: `task_shown`, `instructions_opened`,
`item_action`, `answer`, `retry`, `hint`, `strategy_shift`, `abandon`, `complete`.

*Código: `libs/dala/instrumentation/src/lib/adapters.ts`*

## 4. Las reglas de evidencia (esto es lo que más afecta al diseño)

El motor es de reglas explícitas y versionadas — sin IA interpretando. Cinco
reglas convierten eventos en evidencia, y sus **exclusiones son directrices de
diseño duras**:

| Regla | Aporta evidencia de | Exclusiones que el diseño debe respetar |
|---|---|---|
| Respuesta correcta | Dominio (`curricular_mastery`) | **Acierto después de pista NO cuenta como dominio.** Si querés medir dominio, la tarea debe poder resolverse sin ayuda. |
| Reintento tras fallo | Persistencia | Solo cuenta si hubo un fallo previo real. **Más de 5 reintentos idénticos pesa NEGATIVO** (rigidez). Con recompensa activa, no cuenta. |
| Pista tras intentar | Búsqueda de ayuda (positiva) | **Pedir ayuda sin haber intentado NO aporta.** El diseño debe permitir intentar antes de ofrecer ayuda. |
| Cambio de estrategia | Flexibilidad | Un cambio inducido por pista inmediata NO cuenta. El cambio debe ser iniciativa del jugador. |
| Completar/abandonar | Compromiso | Abandono por problema técnico no cuenta en contra. Con recompensa activa, no cuenta. |

Traducción para diseño: **pedir ayuda debe ser un gesto digno y visible**
(nunca penalizado en la interfaz), **reintentar debe ser barato**, y **cambiar
de enfoque debe ser un botón de primera clase** — porque son exactamente las
conductas que el motor sabe leer.

*Código: `libs/dala/domain/src/lib/evidence-rules.ts`*

## 5. Los cinco constructos y su "presupuesto de evidencia"

El motor estima cinco variables (no nueve, no rasgos de personalidad — cinco,
congeladas hasta calibrar). Cada una exige un **mínimo de evidencia** para
siquiera pronunciarse — y ese mínimo es un requisito de diseño de la
experiencia:

| Constructo | Qué lee | Mínimo para salir de "evidencia insuficiente" | Vida media |
|---|---|---|---|
| Dominio en contexto | aciertos sin ayuda | 5 observaciones · 3 tareas distintas · 1 sesión | 45 días |
| Persistencia productiva | seguir tras el error, con ajuste | 5 obs · 2 tareas · 1 sesión | 30 días |
| Búsqueda de ayuda | apoyo pedido a tiempo | 4 obs · 2 tareas · 1 sesión | 30 días |
| Flexibilidad estratégica | cambiar cuando no rinde | 4 obs · 2 tareas · 1 sesión | 30 días |
| Compromiso con la tarea | terminar y volver | 5 obs · 3 tareas · **2 sesiones** | 21 días |

Implicaciones directas:

- Una experiencia de una sola tarea **no puede** producir lectura de dominio (necesita 3 tareas distintas).
- El compromiso exige **2 sesiones**: ninguna experiencia de una sola sentada lo estima con propiedad — el diseño puede crear "sesiones" internas (cada nivel del Primer Pulso es una sesión de instrumento distinta).
- Si el jugador no falla nunca, no hay señal de persistencia — y eso está **bien**: el sistema dice "evidencia insuficiente" en vez de inventar. El diseño puede incluir desafío suficiente para que el error sea posible, pero no debe forzarlo.

*Código: `libs/dala/domain/src/lib/construct-registry.ts`*

## 6. Qué devuelve el motor (y cómo mostrarlo sin traicionarlo)

Cada estimación sale con: **valor** (0..1), **confianza** (crece con cantidad y
diversidad de evidencia — una interacción aislada jamás da confianza alta),
**estabilidad** (consistencia temporal), **intervalo de incertidumbre**, y un
**estado de validez**: `insufficient_evidence` → `provisional` → `supported` →
`stable_in_context`, o `contradicted` / `expired` / `human_review_required`.

Reglas de presentación que el diseño de resultados debe conservar:

1. El intervalo de incertidumbre **se muestra**, no se esconde (en el Pulso: banda clara detrás del punto).
2. El estado de validez acompaña siempre al número.
3. Toda lectura viaja con **explicaciones alternativas no descartadas** y su **próxima validación** ("se confirma o se cae si…").
4. "Evidencia insuficiente" es un resultado legítimo y se muestra con dignidad, nunca como fracaso.
5. **Jamás se muestran conclusiones provisionales durante el juego** — el resultado llega al final (maestro §5.4).

*Código: `libs/dala/domain/src/lib/estimator.ts` · reporte: `server/src/app/modules/team/team.service.ts`*

## 7. La decisión: 13 verbos y un humano

Con el estado estimado, una **política determinista** (reglas priorizadas
R0–R4, sin IA) elige una acción de una lista cerrada de 13:
`ASK, CLARIFY, EXPLAIN, EXAMPLE, HINT, CHALLENGE, COMPARE, VERIFY, SUMMARIZE,
REFLECT, WITHDRAW_SUPPORT, DEFER, ESCALATE` — bajo el principio de **mínima
ayuda eficaz** (la ayuda se gradúa y se retira; nunca resuelve).

- Sin evidencia utilizable → `VERIFY` (jamás intervenir sin base). R0, la regla por defecto.
- Compromiso bajo → `ASK` (re-enganchar antes que instruir).
- Esfuerzo sin progreso y sin pedir ayuda → `HINT` nivel 1.
- Dominio alto → `WITHDRAW_SUPPORT` (verificar transferencia).
- Mucha ayuda + poco dominio → `REFLECT` (posible dependencia).

Toda decisión sale con razones estructuradas, versión de política, resultado
esperado declarado **antes** de intervenir, y `requiresHumanApproval = true`
grabado a fuego: **shadow mode**. Después se registra el **outcome** (qué pasó
vs. qué se esperaba) — el material con que se calibra.

Para el diseñador: estos 13 verbos son la **paleta de intervenciones** de
cualquier experiencia futura. Si una pantalla quiere "ayudar", debe poder
nombrarse con uno de estos verbos.

*Código: `libs/dala/domain/src/lib/policy.ts`*

## 8. Reglas de privacidad que ninguna experiencia puede romper

- **Seudónimo siempre**: el motor jamás ve nombre ni user_id; el mapeo vive aparte, en zona de alta confianza.
- **Sin consentimiento vigente, el evento se cuarentena** — no se procesa.
- **Declarado ≠ inferido**: lo que la persona dice de sí misma (ritmo, feedback, puerta de entrada) se guarda separado de la conducta, con control de compartir en manos de la persona. Nunca se mezclan.
- Los **arquetipos** (Estrella) son vista narrativa opcional al final — jamás entran al motor de decisión.
- Prohibiciones vigentes del piloto: diagnóstico psicológico, inferencia de emociones, comparación pública, ranking, predicción de desempeño, monetización de perfiles.

## 9. La implementación de referencia: Primer Pulso v3 (`team/`)

La experiencia del equipo es el mapa vivo de todo lo anterior — útil como
patrón "escena → instrumento → eventos → constructos":

| Escena | Instrumento / fuente | Qué emite | Nutre |
|---|---|---|---|
| Entrada (nombre + **área** + código) | — | consentimiento; el área adapta el lenguaje | — |
| Las tres puertas (1 toque) | declarado | preferencia de entrada | vista de equipo |
| Nivel 1 "¿Dónde vive?" (6 cartas, 1 del área) | `categorization` (sesión propia) | answers, retries, hints | dominio, persistencia, ayuda |
| Nivel 2 "El ciclo" (6 fichas) | `timeline-order` (sesión propia) | answers, `strategy_changed`, hints | flexibilidad, dominio |
| Nivel 3 "La impostora" (2 rondas) | `intruder` (sesión propia) | answers, latencia | dominio, compromiso |
| Caso exprés (3 toques) | `categorization` | answers sobre rigor observacional | dominio + métrica de rigor |
| El acuerdo (2 toques + compartir) | declarado | ritmo y feedback preferidos | vista de equipo |
| Tu pulso | motor | decisión shadow → veredicto de la persona → outcome | cierre del ciclo |
| Tu estrella (opt-in) | narrativa | arquetipo elegido | nada (jamás al motor) |

Decisiones de dinámica ya validadas con el equipo (v3, tras feedback real):
cartas de una línea, un toque por decisión, avance ~0,6 s, racha visible, los
"porqués" como insight ambiental no bloqueante, ~40 señales en ~5 minutos.
**Anti-patrón nombrado a evitar: el "test disfrazado"** — si una pantalla se
siente como examen, está mal aunque emita eventos perfectos.

## 10. Palancas del diseñador (de más barata a más cara)

1. **Contenido**: cartas, secuencias, rondas, casos, textos por área — editar `team/src/app/content.ts`. Sin tocar motor ni servidor.
2. **Ritmo y narrativa**: escenas, transiciones, feedback, personajes — libre, mientras cada gesto significativo siga mapeando a una interacción del SDK (§3).
3. **Contexto de tareas**: dificultad, skillIds, modo, recompensa — cambia cómo el motor pondera, sin código nuevo del motor.
4. **Nuevas escenas con los 3 instrumentos**: wiring nuevo, motor intacto.
5. **Nueva mecánica (instrumento nuevo)**: adaptador + versión + registro — proyecto pequeño, decisión de equipo.
6. **Nuevo evento o constructo**: cambio de estándar versionado — decisión de comité, no de sprint.

### El entregable que esperamos del diseño

Por exigencia del maestro (§5.4), el diseño de una experiencia se especifica
**antes** que su interfaz, con esta cadena por cada escena:

```
escena → acción del jugador → evento canónico → regla de evidencia → constructo → qué NO debe leerse
```

La última columna es tan importante como las demás: cada escena declara qué
conducta va a dejar ver **y qué sobreinferencia se compromete a no habilitar**.

### Checklist anti test-disfrazado

- [ ] ¿Cada decisión del jugador es un gesto de juego, no una pregunta de formulario?
- [ ] ¿Se puede intentar antes de recibir ayuda? ¿La ayuda es digna y visible?
- [ ] ¿Reintentar es barato? ¿Cambiar de enfoque es un botón de primera clase?
- [ ] ¿Hay al menos 3 tareas distintas si se pretende leer dominio? ¿2+ sesiones si se pretende leer compromiso?
- [ ] ¿Ninguna conclusión aparece durante el juego?
- [ ] ¿El resultado muestra incertidumbre, alternativas y "lo que no sabemos"?
- [ ] ¿Lo declarado quedó separado de lo inferido, con control de compartir?
- [ ] ¿La sesión completa dura ≤ 5–7 minutos con ~1 toque por decisión?

---

*Documentos hermanos: [DALA.md](DALA.md) (resumen técnico del motor) y
[TEAM-ONBOARDING.md](TEAM-ONBOARDING.md) (runbook de operación y producción).
Fuente normativa: Documento Maestro Synapxix, agosto 2026.*
