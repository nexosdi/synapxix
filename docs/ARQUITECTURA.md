# Arquitectura Synapxix

Estado real del sistema, verificado contra el código. Complementa
[`DALA.md`](DALA.md) (el estándar) y [`BRAND.md`](../BRAND.md) (identidad visual).

---

## 1. Visión de conjunto

Synapxix es una plataforma educativa que busca entender **cómo aprende cada
niño**, no solo cuánto acierta. Su corazón es **D.A.L.A.**, un motor que observa
conducta, infiere estado con incertidumbre declarada, recomienda intervenciones
y verifica su efecto — todo trazable y bajo supervisión humana.

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   web-game   │   │     team     │   │admin-frontend│
│  (alumnos)   │   │(equipo/pulso)│   │(docentes/dir)│
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       │  eventos conductuales · consultas   │
       └──────────────────┼──────────────────┘
                          ▼
              ┌───────────────────────┐
              │   server (NestJS)     │
              │  ┌─────────────────┐  │
              │  │ módulo dala     │──┼──► el motor
              │  └─────────────────┘  │
              │  auth · learning ·    │
              │  economy · analytics  │
              └───────────┬───────────┘
                          ▼
       PostgreSQL (7 schemas) · Redis · Keycloak · Gemini
```

**Regla arquitectónica rectora:** *Synapxix usa D.A.L.A.; los módulos de
Synapxix no implementan lógica D.A.L.A.* Todo pasa por la fachada.

---

## 2. Monorepo (Nx 22) — 12 proyectos

### Aplicaciones

| App | Puerto | Stack | Rol |
|---|---|---|---|
| `server` | 3001* | NestJS 11 | API única; aloja el bounded context D.A.L.A. |
| `web-game` | 4300 | Angular 20 + Tailwind | Experiencia del alumno; 13 minijuegos |
| `admin-frontend` | 4200 | Angular 20 | Docentes y dirección; analíticas |
| `team` | 4400 | Angular 20 | **Primer Pulso**: onboarding del equipo, primera prueba real del motor |

\* El 3001 es específico de esta máquina (`PORT` en `.env`); por defecto 3000.

### Librerías

| Librería | Contenido | Restricción |
|---|---|---|
| `dala-contracts` | El estándar: envelope de eventos, constructos, evidencia, estado, decisiones, instrumentos | Única superficie pública |
| `dala-domain` | Lógica pura: reglas de evidencia, estimador, política, registro de constructos | Sin NestJS/Prisma/Redis/Gemini |
| `dala-instrumentation` | SDK de emisión con cola offline + `GameInstrumentAdapter` | Único camino para emitir |
| `game-engine/core` | 13 tipos de minijuego, runner, registry | Reutilizable por cualquier app |
| `prisma` | Schema único, migraciones, `PrismaService` | Fuente de verdad del modelo de datos |
| `brand` | Tokens de identidad visual + assets de logo | Fuente única de marca |
| `learning/shared` · `baseRepository` · `envValidator` | Tipos compartidos, repositorio genérico, validación de entorno | — |

---

## 3. Backend — 12 módulos, 47 endpoints

```
server/src/app/
├── auth/              JWT vía Keycloak (JWKS) + MockJwtGuard de desarrollo
├── modules/dala/      ★ el motor: controller · facade · repository
├── modules/team/      Primer Pulso (invitaciones, misiones, arquetipo)
├── modules/research/  Integración Gemini con retry + caché Redis
├── learning/          Temas, contenidos, métodos, embeddings (11 endpoints)
├── analytics/         Agregados para dashboards (6 endpoints)
├── economy/           Créditos, XP, tienda, transacciones
├── evaluative/        Evaluación cognitiva + streaming SSE
├── game-session/      Ciclo de sesión + reportes por usuario
├── exercises/         Ejercicios, evaluación de audio
├── profile/           Preferencias
└── decorators/        Utilidades de auth
```

### Límites entre módulos (directriz normativa)

| Módulo | Qué hace | Qué NO debe hacer |
|---|---|---|
| `game-session` | Controla sesión, intentos, estado operativo | Calcular perfiles |
| `evaluative` | Adaptador y presentación de resultados | Mantener inferencia paralela a D.A.L.A. |
| `learning` | Catálogo curricular | D.A.L.A. lo referencia por ID, no por tabla |
| `research`/Gemini | Generación, narrativa, resúmenes | Modificar estados o decidir intervenciones |
| `analytics` | Consume vistas y agregados | Escribir en el schema `dala` |
| `economy` | XP y créditos | Alimentar el motor inferencial (distorsiona señal) |

---

## 4. D.A.L.A. — el corazón

### El ciclo cerrado

```
evidencia → estado → decisión → intervención → outcome → actualización
```

### Flujo de datos

```
instrumento (juego / misión)
   ↓  DalaEmitter — cola offline, secuencia, idempotencia
POST /dala/v1/events
   ↓  validación → append-only → ACK rápido
Event Store (dala.behavior_event)
   ↓  reglas de evidencia versionadas y deterministas
EvidenceObservation
   ↓  estimador Beta-Binomial con decaimiento por recencia
ConstructEstimate  →  HumanStateSnapshot (congelado, reproducible)
   ↓  política determinista priorizada
DecisionRecord (shadow: requiresHumanApproval = true)
   ↓  revisión humana → intervención
Outcome (esperado vs. observado)
   ↓
Traza completa reconstruible
```

### Constructos v0.1 (congelados)

`curricular_mastery` · `persistence` · `help_seeking` · `strategy_flexibility` ·
`task_engagement`

Cada uno con ficha operacional: qué eventos aportan evidencia, cuáles **no**
deben interpretarse, mínimos para salir de `insufficient_evidence`, vida media
y condiciones de invalidación.

### Reglas de evidencia notables

- Acierto **después de pista** no evidencia dominio.
- Con recompensa activa (XP/créditos), persistencia y engagement **no** se actualizan.
- Ayuda pedida **sin intento previo** no aporta al constructo.
- Más de 5 reintentos idénticos pesa **negativo** (rigidez, no persistencia).
- Una sesión aislada **nunca** produce confianza alta.

### Política de decisión (`core-policy-0.1.0`)

| Prioridad | Condición | Acción |
|---|---|---|
| R1 | engagement < 0.35 | `ASK` — re-enganche antes que instrucción |
| R2 | dominio bajo + persistencia alta + no pide ayuda | `HINT` nivel 1 |
| R3 | dominio > 0.75 | `WITHDRAW_SUPPORT` — verificar transferencia |
| R4 | ayuda alta + dominio bajo | `REFLECT` — posible dependencia |
| R0 | sin evidencia utilizable | `VERIFY` — jamás intervenir sin base |

### API (`/api/dala/v1`)

```
POST events              ingesta idempotente (throttle propio: ráfagas de telemetría)
POST events/batch
POST subjects/resolve    seudónimo del usuario autenticado
GET  subjects/:id/state
GET  subjects/:id/timeline
POST decisions           recomendación shadow
GET  decisions/:id
POST decisions/:id/review    approved | rejected | edited + razón
POST outcomes            efecto observado vs. esperado
GET  traces/:decisionId  cadena completa auditable
```

---

## 5. Datos — PostgreSQL, 7 schemas lógicos

| Schema | Modelos | Propósito |
|---|---|---|
| `dala` | 7 | **Event store append-only**, evidencia, estimaciones, snapshots, decisiones, outcomes, instrumentos |
| `auth` | 6 | Usuarios, sesiones, vínculos, perfiles + **`dala_subject_map`** (seudónimos) |
| `core` | 10 | Instituciones, sesiones de juego, economía, tienda, prompts, **`team_member`** |
| `knowledge` | 2 | Contenidos y progreso |
| `psychometrics` | 3 | Dimensiones, arquetipos, métricas — **reservado para instrumentos validados**, no es el núcleo |
| `audit` | 1 | Log de auditoría |
| `communication` | 1 | Notificaciones |

**Seudonimización:** `auth.dala_subject_map` mantiene `user_id ↔ subject_id` en
el dominio de alta confianza. El schema `dala` **nunca ve un user_id real**.

**Invariante del event store:** los eventos son inmutables. Una corrección es un
evento nuevo, jamás un `UPDATE`.

---

## 6. Primer Pulso — la primera prueba real

La app `team` (puerto 4400) es el onboarding del equipo Synapxix y **la primera
validación del motor con personas reales**. Recorre el ciclo completo:

```
entry → portal → 3 misiones → shadow → result → vision
```

Las tres misiones usan los tres instrumentos ya adaptados:
`categorization`, `intruder`, `timeline-order`.

Cada persona atraviesa: eventos reales → evidencia → estado → decisión shadow
→ **su propia revisión** → outcome → traza. Es D.A.L.A. probándose sobre el
equipo antes de tocar un aula.

Lo **declarado** por la persona (preferencias, arquetipo) vive en
`core.team_member`, **nunca mezclado** con la evidencia conductual del schema
`dala`. Es una distinción normativa de la spec, no un detalle de diseño.

---

## 7. Infraestructura

| Servicio | Puerto | Rol |
|---|---|---|
| PostgreSQL app | 5434 | Base principal |
| Redis | 6379 | Caché de IA, futura cola BullMQ |
| Keycloak | 8081 | Auth (perfil opcional, realm importable) |
| PostgreSQL Keycloak | 5432 | Base de Keycloak |
| Neo4j | 7474 / 7687 | Configurado, **no operativo** |

Los frontends usan URLs **relativas** (`/api`) vía proxy del dev-server; el
puerto del backend se configura con `SYNAPXIX_API_PORT`. Eso evita URLs de
localhost hardcodeadas en builds de producción.

**CI:** GitHub Actions corre `lint + test + build` en cada push y PR. Sin etapa
de despliegue.

**Cobertura:** 196 tests en 8 proyectos.

---

## 8. Identidad visual

Sistema de tokens en `libs/brand/src/tokens.css`, cargado por las tres apps.
Ningún color, tipografía o radio se escribe a mano.

Paleta: Azul Synapxix `#1E90FF` · Azul Profundo `#0A4FBF` · Azul Cielo `#EAF3FF`
· Blanco. Tipografía Nunito (sans redondeada).

**Regla de contraste no obvia:** `#1E90FF` da 3.03:1 sobre blanco — no alcanza
WCAG AA para texto pequeño. Sirve para rellenos, iconos y texto grande; el texto
legible usa `#0A4FBF` (7.28:1).

---

## 9. Madurez por área

| Área | Estado |
|---|---|
| Backend API | Sólido — 12 módulos, 47 endpoints, 170 tests |
| D.A.L.A. Fases 1–5 | Completo en backend, con simulador de 5 trayectorias |
| Instrumentación | SDK + 3 adaptadores, **en vivo en Primer Pulso** |
| App `team` | Funcional punta a punta |
| `admin-frontend` | Dashboards operativos |
| `web-game` | 13 minijuegos existen; **sin emitir eventos D.A.L.A. todavía** |
| Panel docente de revisión | Pendiente |
| Cola asíncrona (BullMQ) | Pendiente — hoy procesa post-ACK en proceso |
| Consentimiento versionado | Pendiente — falta flujo de revocación/borrado |

---

## 10. Deuda y límites declarados

**Advertencia central:** los umbrales de D.A.L.A. (confianza, mínimos de
evidencia, vidas medias) son **hipótesis de diseño**. No son válidos hasta
calibrarlos con datos de piloto real (spec §15.4). El motor está bien
construido; que sus números midan lo que dicen medir aún no está probado.

Otros pendientes:

- El **wiring de los 13 juegos** de `web-game` al SDK — hoy solo Primer Pulso emite.
- **Notificaciones**: UI completa, sin controlador en el backend.
- **Dashboard del web-game**: pide `/auth/preferences` pero espera un array de
  `CognitiveElement`; ningún endpoint devuelve esa forma.
- **Aprovisionamiento de usuarios**: con `DISABLE_AUTH=false`, un usuario de
  Keycloak inexistente en `auth.app_user` falla por clave foránea.
- **Neo4j**: declarado en `docker-compose`, sin integración.
- **Sin pipeline de despliegue**: CI valida, no publica.

---

## 11. Prohibiciones vigentes

Sin excepciones en piloto (spec §11.4, §19.1): diagnóstico psicológico,
inferencia biométrica de emociones, decisiones escolares automatizadas de alto
impacto, comparación pública entre niños, envío de historia completa del
estudiante a un LLM, y monetización de perfiles.
