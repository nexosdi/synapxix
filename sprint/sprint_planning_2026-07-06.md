# Planificación de Sprint (Sprint Planning)
Proyecto Educativo Gamificado — Synapxix
Proyecto: Synapxix
Fecha del Sprint: 2026-07-06 (Semana 2)
Metodología: Ágil / Scrum
Stack Tecnológico: Nx, Angular, NestJS, Prisma, PostgreSQL

---

## Mensaje del Tech Lead / Project Manager:
Si todo salió bien en la primera semana, ahora la plataforma debería estar estable. En este sprint nos vamos a enfocar en el frontend docente y preparar el proyecto para un simulacro de despliegue Beta. 

## Asignaciones y Objetivos del Equipo (Juniors)

### TÍTULO DE LA TAREA
Panel Docente: Integración Real Time y Simulacro Beta

### OBJETIVO PRINCIPAL
Conectar el Teacher Dashboard (recientemente mergeado) con el motor evaluativo en tiempo real y asegurar que todo pase el pipeline de CI/CD limpiamente.

### CONTEXTO TÉCNICO
El dashboard ya existe, pero necesitamos que consuma los datos que los alumnos generan mientras juegan. Deberás:
1. Usar el `EvaluativeService` en NestJS para exponer los datos agregados.
2. Hacer que el frontend administrativo consuma estos endpoints de manera reactiva.
3. Asegurarte de que el build local (usando `npx nx run-many -t build`) no tire ningún error o warning de dependencias.

### CRITERIOS DE ACEPTACIÓN (DEFINITION OF DONE)
- [ ] Endpoints de métricas agregadas funcionando y expuestos.
- [ ] Dashboard de docentes consumiendo datos reales (nada mockeado).
- [ ] Manejo de errores visuales (spinners o esqueletos) si los datos tardan en cargar.
- [ ] Pipeline `nx affected -t build` pasando en verde en local, simulando el pipeline de GitHub.
- [ ] Código subido en un PR independiente.
