# Auditoría de Tipos de Juego (Game Types)

Este documento detalla el resultado de la auditoría técnica sobre la correspondencia entre los tipos de juego definidos en el frontend y los endpoints de evaluación implementados en el backend.

Fecha de Auditoría: 14 de agosto de 2026

## Resumen

Se identificaron **13** tipos de juego en la librería `libs/game-engine/core/src/lib/game-types/`, pero solo **1** de ellos tiene un endpoint de evaluación correspondiente en el `ExercisesController` del backend.

## Mapeo Detallado

A continuación se presenta el estado de cada tipo de juego:

| Tipo de Juego (Frontend)      | Endpoint Implementado (Backend) | Estado      |
| ----------------------------- | ------------------------------- | ----------- |
| `read-aloud-game`             | `POST /exercises/read-aloud`    | ✅ **Tiene endpoint** |
| `avatar-game`                 | -                               | ❌ No tiene endpoint |
| `balance-game`                | -                               | ❌ No tiene endpoint |
| `categorization-game`         | -                               | ❌ No tiene endpoint |
| `fill-in-the-blanks-game`     | -                               | ❌ No tiene endpoint |
| `intruder-game`               | -                               | ❌ No tiene endpoint |
| `listen-type-game`            | -                               | ❌ No tiene endpoint |
| `neural-link-game`            | -                               | ❌ No tiene endpoint |
| `read-select-game`            | -                               | ❌ No tiene endpoint |
| `sound-match`                 | -                               | ❌ No tiene endpoint |
| `speak-about-photo-game`      | -                               | ❌ No tiene endpoint |
| `spotlight-game`              | -                               | ❌ No tiene endpoint |
| `timeline-order-game`         | -                               | ❌ No tiene endpoint |

## Próximos Pasos

1.  **Creación de Stubs:** Se crearán endpoints `stub` (simulados) en el backend para los 12 tipos de juego faltantes para evitar fallos en el motor de juego.
2.  **Desarrollo de Endpoints:** Se implementará la lógica básica real para al menos 3 de los nuevos endpoints.
3.  **Integración:** Se registrarán los nuevos tipos de juego en el `game-registry`.
4.  **Fallback:** Se implementará un mecanismo de fallback en el motor de evaluación para manejar tipos de juego desconocidos de forma segura.
