# D.A.L.A.™ — Dynamic Adaptive Learning Architecture

**Resumen operativo de la Especificación Maestra v3 y estado de la implementación de referencia.**
La spec completa (21 secciones + anexos) es el documento normativo; esto es la guía de trabajo del equipo.

> **Tesis:** una IA educativa responsable no memoriza al usuario ni genera contenido "personalizado" a ciegas. Sostiene un estado compartido, interviene con una política verificable y demuestra que la comunicación produjo aprendizaje y autonomía.

## El ciclo

```
evidencia → estado → decisión → intervención → outcome → actualización
             (todo trazable, todo versionado, todo reconstruible)
```

## Reglas arquitectónicas

1. **Synapxix usa D.A.L.A.; sus módulos no implementan lógica D.A.L.A.** Todo pasa por la fachada del módulo `dala`.
2. **Los eventos son inmutables** (append-only). Corrección = evento nuevo.
3. **Ningún estado sin evidencia referenciada.** Toda inferencia declara incertidumbre, contexto, vigencia y alternativas.
4. **El LLM no calcula estados, permisos ni decisiones.** Si interviene, solo redacta dentro de una decisión ya tomada, y su salida se valida.
5. **Shadow mode en el MVP:** el sistema recomienda; un humano aprueba, rechaza o corrige. Nada se auto-aplica.
6. **Seudónimos siempre:** los motores ven `subject_id`; el mapeo `user_id ↔ subject_id` vive en `auth` con acceso restringido.
7. **Estados, no etiquetas.** Los arquetipos son vista narrativa opcional; jamás participan del motor de decisión.

## Dónde vive cada cosa

| Pieza | Ruta | Regla |
|---|---|---|
| Contratos (el estándar) | `libs/dala/contracts` | Única superficie pública; cambios = nueva versión |
| Dominio puro | `libs/dala/domain` | Sin NestJS/Prisma/Redis/Gemini |
| SDK de emisión | `libs/dala/instrumentation` | Único camino para emitir eventos; cola offline |
| Transporte + persistencia | `server/src/app/modules/dala` | Solo su repositorio toca el schema `dala` |
| Datos | schema Postgres `dala` (8 tablas) | `psychometrics` queda para instrumentos validados |

## Constructos v0.1 (congelados para el piloto)

`curricular_mastery` · `persistence` · `help_seeking` · `strategy_flexibility` · `task_engagement`

Cada uno tiene ficha operacional en `libs/dala/domain/src/lib/construct-registry.ts`: qué eventos aportan evidencia, cuáles NO deben interpretarse, mínimos para salir de `insufficient_evidence`, vida media y condiciones de invalidación. **No ampliar la ontología antes de calibrar estos cinco.**

Reglas de evidencia notables ya codificadas:
- Acierto **después de pista** no evidencia dominio.
- Con recompensa activa (XP/créditos), persistencia y engagement **no** se actualizan.
- Ayuda pedida **sin intento previo** no aporta al constructo.
- \>5 reintentos idénticos pesa negativo (rigidez, no persistencia).
- Una sesión aislada nunca produce confianza alta.

## API interna (v1)

```
POST /dala/v1/events            ingesta idempotente (throttle propio)
POST /dala/v1/events/batch
POST /dala/v1/subjects/resolve  seudónimo del usuario autenticado
GET  /dala/v1/subjects/:id/state
GET  /dala/v1/subjects/:id/timeline
POST /dala/v1/decisions         recomendación shadow (requiresHumanApproval)
GET  /dala/v1/decisions/:id
POST /dala/v1/decisions/:id/review   approved | rejected | edited + razón
POST /dala/v1/outcomes          efecto observado vs. esperado
GET  /dala/v1/traces/:decisionId     decisión→snapshot→evidencia→eventos→outcomes
```

## Política de decisión v0.1

Determinista, priorizada, versionada (`core-policy-0.1.0`). Principio: **mínima ayuda necesaria y esfuerzo productivo**.

| Prioridad | Condición | Acción |
|---|---|---|
| R1 | engagement < 0.35 | `ASK` (re-enganche antes que instrucción) |
| R2 | dominio bajo + persistencia alta + no pide ayuda | `HINT` nivel 1 |
| R3 | dominio > 0.75 | `WITHDRAW_SUPPORT` (verificar transferencia) |
| R4 | ayuda alta + dominio bajo | `REFLECT` (posible dependencia) |
| R0 | sin evidencia utilizable | `VERIFY` (jamás intervenir sin base) |

## Estado de implementación

| Fase (directrices) | Estado |
|---|---|
| 1. Fundaciones — contratos, schema, event store, idempotencia | ✅ |
| 2. Instrumentación — SDK offline + adaptadores (categorization, timeline-order, intruder) | ✅ contratos · ⏳ wiring en componentes Angular |
| 3. Estado — evidencia, estimaciones, snapshots, trazabilidad | ✅ |
| 4. Decisiones — política, DecisionRecord, shadow mode, revisión | ✅ backend · ⏳ panel docente UI |
| 5. Outcomes — registro, comparación esperado/observado, simulador | ✅ (simulador: 5 trayectorias en `simulator.spec.ts`) |

**Pendientes conocidos:** wiring de adaptadores en los juegos reales, panel docente de revisión, procesamiento en cola (BullMQ) cuando haya volumen, consentimiento versionado con flujo de revocación/borrado, y calibración con datos de piloto (los umbrales actuales son hipótesis de diseño — spec §15.4).

## Prohibiciones vigentes (spec §11.4, §19.1)

Sin excepciones en piloto: diagnóstico psicológico, inferencia biométrica de emociones, decisiones escolares automatizadas de alto impacto, comparación pública entre niños, envío de historia completa del estudiante a un LLM, y monetización de perfiles.
