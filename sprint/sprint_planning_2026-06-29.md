# Planificación de Sprint (Sprint Planning)
Proyecto Educativo Gamificado — Synapxix
Proyecto: Synapxix
Fecha del Sprint: 2026-06-29 (Semana 1)
Metodología: Ágil / Scrum
Stack Tecnológico: Nx, Angular, NestJS, Prisma, PostgreSQL

---

## Mensaje del Tech Lead / Project Manager:
Iniciamos la estabilización del proyecto. La seguridad básica ya fue implementada (Helmet y Throttler). Ahora nuestro foco principal es asegurar que los flujos críticos funcionen de punta a punta sin romperse con nuevos cambios. 

## Asignaciones y Objetivos del Equipo (Juniors)

### TÍTULO DE LA TAREA
Testing E2E: Flujo Feliz del Alumno (QA)

### OBJETIVO PRINCIPAL
Configurar el framework de pruebas End-to-End (Playwright) en nuestro monorepo Nx y automatizar el flujo principal que hace un alumno.

### CONTEXTO TÉCNICO
Necesitamos garantizar que la plataforma no se rompa antes de la beta. Tu tarea es usar Nx para generar la configuración de Playwright y escribir un test que haga lo siguiente:
1. Iniciar sesión.
2. Jugar una partida.
3. Recibir el feedback de la IA.
4. Reclamar la recompensa.

### CRITERIOS DE ACEPTACIÓN (DEFINITION OF DONE)
- [ ] Proyecto E2E de Playwright generado exitosamente vía generador de Nx.
- [ ] Test automatizado escrito validando el flujo `Login -> Jugar -> Feedback -> Tienda`.
- [ ] El test corre y pasa correctamente en el entorno local.
- [ ] Código subido en un PR.
