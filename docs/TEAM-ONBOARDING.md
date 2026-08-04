# Primer Pulso — onboarding del equipo sobre D.A.L.A.

Runbook de producción y criterios de salida. Estado al 2026-08-03.

**Qué es:** la experiencia de onboarding del equipo Synapxix (`team/`), 100% online,
conectada en vivo a D.A.L.A. Es nuestra **primera prueba real** del motor: los tres
retos son los tres instrumentos de primera validación (`categorization`,
`timeline-order`, `intruder`), y cada persona atraviesa el ciclo completo
*evidencia → estado → decisión → intervención → outcome* sobre sí misma, con traza.

## Arquitectura del despliegue

```
Vercel (estático, gru1)                Railway (o Fly.io)
┌────────────────────────┐   rewrite   ┌──────────────────────────┐
│ app team (Angular)     │  /api/* →   │ server NestJS (Docker)   │
│ pulso.synapxix.com     │────────────▶│  módulo team → DalaFacade │
└────────────────────────┘             │  migraciones al arrancar  │
                                       └────────────┬─────────────┘
                                                    │
                                       ┌────────────▼─────────────┐
                                       │ PostgreSQL administrado  │
                                       │ schemas: dala, auth, core │
                                       └──────────────────────────┘
```

El rewrite de Vercel hace que la app y la API compartan origen: sin CORS que
mantener. `CORS_ORIGINS` queda como refuerzo opcional si algún día se sirve
la API directo.

## Variables de entorno del server

| Variable | Obligatoria | Qué es |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres administrado (Railway la inyecta al vincular el plugin) |
| `TEAM_JWT_SECRET` | ✅ en prod | Firma de los tokens de invitación. **El server no arranca en producción sin ella.** Generar con `openssl rand -hex 32` |
| `TEAM_ADMIN_CODE` | ✅ | Código operativo para crear invitaciones y ver la vista de equipo |
| `PORT` | — | Railway la define sola; local usa 3001 |
| `GEMINI_API_KEY` | opcional | Habilita la estrella ilustrada con IA. Sin key, la SVG paramétrica es la estrella |
| `CORS_ORIGINS` | opcional | Orígenes extra separados por coma (solo si no se usa el rewrite) |
| `DISABLE_AUTH` | ⛔ | **Jamás `true` en producción** (bypass de dev del resto de la API) |

Keycloak **no** es necesario para el Primer Pulso: la identidad es el link de
invitación (token propio del módulo team). Los demás módulos de la API siguen
exigiendo su JWT de Keycloak como siempre.

## Pasos de salida a producción

1. **Base + server (Railway)**
   - Nuevo proyecto → *Deploy from GitHub repo* (usa el `Dockerfile` de la raíz,
     `railway.json` ya define healthcheck `/api`).
   - Agregar plugin **PostgreSQL** y vincular `DATABASE_URL` al servicio.
   - Cargar `TEAM_JWT_SECRET` y `TEAM_ADMIN_CODE`.
   - Deploy: las migraciones Prisma corren solas al arrancar (`migrate deploy`).
2. **App (Vercel)**
   - Importar el repo; `vercel.json` de la raíz ya trae build (`npx nx build team`),
     salida (`dist/team/browser`), región `gru1` y el rewrite SPA.
   - **Reemplazar** en `vercel.json` la URL placeholder del rewrite `/api/*` por el
     dominio real del server en Railway. Commit + redeploy.
   - (Opcional) dominio propio, p. ej. `pulso.synapxix.com`.
3. **Invitaciones**
   ```bash
   TEAM_ADMIN_CODE=<code> API_URL=https://<server> PULSE_URL=https://<app> \
     node scripts/team-invites.mjs "Ana:psicopedagogía" "Leo:ingeniería"
   ```
   Imprime un link `https://<app>/?invite=SX-XXXX-XX` por persona, listo para
   compartir por WhatsApp/mail.
4. **Verificación E2E contra producción** (mismo criterio que local):
   ```bash
   TEAM_ADMIN_CODE=<code> node scripts/team-pulse-smoke.mjs https://<server>
   ```
   Recorre invitación → join → 3 sesiones de instrumento → declarado → decisión
   shadow → review → outcome → reporte → traza, y verifica idempotencia y el 403
   al suplantar sujetos.

## Criterios de salida

| # | Criterio | Cómo se verifica |
|---|---|---|
| 1 | Server sano y migrado | healthcheck `/api` 200; log de `migrate deploy` limpio |
| 2 | Ciclo D.A.L.A. completo en prod | `team-pulse-smoke.mjs` en verde contra la URL real |
| 3 | Autorización de sujeto | el smoke verifica 403 al emitir por otro `subjectId` |
| 4 | Idempotencia de ingesta | el smoke reenvía un lote y espera `duplicate` |
| 5 | Shadow mode intacto | toda decisión sale con `requiresHumanApproval=true` (forzado en repositorio) |
| 6 | Secretos de producción | `TEAM_JWT_SECRET` fuerte (el server no arranca sin ella), `TEAM_ADMIN_CODE` no trivial |
| 7 | Experiencia completa a mano | una persona real recorre las 9 escenas y descarga su estrella |

## Privacidad y reglas vigentes (heredadas de D.A.L.A.)

- Los motores ven **seudónimos**; el mapeo `member ↔ subject` vive en `auth`.
- Consentimiento explícito en la escena de entrada (`team-primer-pulso-v1`);
  sin scope de consentimiento, el evento se cuarentena.
- Lo **declarado** (ritmo, feedback, compartir) vive en `core.team_member` y
  nunca se mezcla con la evidencia conductual.
- El **arquetipo** de la estrella es vista narrativa opcional: jamás entra al
  motor de decisión (spec: estados, no etiquetas).
- Sin economía en el pulso (`rewardCondition: 'none'`): señal limpia.
- No se genera diagnóstico, ranking ni predicción de desempeño; la vista de
  equipo respeta `shareConditions`.

## Operación

- **Ver el equipo:** `GET /api/team/v1/admin/members` con header
  `X-Team-Admin-Code` (respeta lo no compartido).
- **Rotar acceso:** cambiar `TEAM_JWT_SECRET` invalida todos los tokens en
  curso (los links de invitación siguen sirviendo: el join emite token nuevo).
- **Incidente de datos:** los eventos son append-only; una corrección es un
  evento nuevo. Para retirar a una persona del piloto: borrar su fila en
  `core.team_member` + su mapeo en `auth.dala_subject_map` deja sus eventos
  huérfanos de identidad (seudónimo sin dueño).

## Pendientes conocidos

- Flujo formal de revocación/borrado de consentimiento (heredado del roadmap D.A.L.A.).
- Dashboard visual de equipo (hoy: endpoint admin JSON).
- Expiración/rotación de invitaciones (hoy no caducan; rotar `TEAM_ADMIN_CODE` tras el piloto).
- El rate-limit global de la API aplica también aquí; el módulo team tiene sus
  propios límites para la telemetría.
