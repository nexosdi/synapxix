# Auditoría de Autenticación (Auth Guards)

**Fecha de auditoría**: Sprint 1
**Objetivo**: Garantizar que todos los controladores y endpoints de la API estén protegidos contra acceso anónimo no intencionado.

## Estado de Controladores

| Controller | Guard Aplicado | Nivel | Estado |
|---|---|---|---|
| `app.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido |
| `auth.controller.ts` | `@UseGuards(JwtAuthGuard)` | Método (`getPreferences`) | ✅ Protegido |
| `economy.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido |
| `analytics.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido |
| `profile.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido |
| `learning.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido |
| `dala.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido |
| `game-session.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido |
| `exercises.controller.ts` | `@UseGuards(JwtAuthGuard)` | Método (Todos) | ✅ Protegido |
| `evaluative.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido (Fix aplicado) |
| `research.controller.ts` | `@UseGuards(JwtAuthGuard)` | Clase | ✅ Protegido (Fix aplicado) |

## Hallazgos y Correcciones

Durante la auditoría inicial se detectaron dos vulnerabilidades de seguridad graves que fueron corregidas inmediatamente:

1. **Endpoint `POST /api/evaluative/evaluate-ai/stream` expuesto**:
   - *Problema*: El endpoint SSE para streaming de evaluaciones de IA no tenía guard de autenticación, permitiendo consumo anónimo de recursos y cuota de IA.
   - *Solución*: Se movió el `@UseGuards(JwtAuthGuard)` al nivel de la clase `EvaluativeController`, protegiendo automáticamente todos los métodos. Se inyectó explícitamente el `userId` en el método para uso interno.

2. **Controlador `ResearchController` completamente expuesto**:
   - *Problema*: Ningún método (`/process` y `/process/stream`) requería autenticación. Cualquier usuario podía mandar comandos a la IA.
   - *Solución*: Se agregó `@UseGuards(JwtAuthGuard)` a nivel de clase.

3. **Bypass de JWT inseguro en Producción**:
   - *Problema*: El guard `JwtAuthGuard` permitía un bypass completo (`MockJwtGuard`) si la variable de entorno `DISABLE_AUTH=true` estaba configurada, **sin importar el entorno**. Esto significaba que un error de configuración en producción podía abrir todo el sistema.
   - *Solución*: Se agregó una validación de `NODE_ENV`. El bypass ahora solo funciona si `NODE_ENV !== 'production'`.
