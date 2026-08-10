/**
 * D.A.L.A.™ Core v0.1 — Registro normativo de constructos.
 *
 * Cada ficha define qué evidencia vale, qué NO debe interpretarse y cuándo se
 * invalida la estimación. Cambiar una ficha es cambiar el estándar: exige
 * nueva versión y registro en el changelog.
 */
import type { DalaConstructDefinition } from '@nexosdi.synapxix/dala/contracts';

export const DALA_MODEL_VERSION = 'dala-core-0.1.0';

export const CONSTRUCT_REGISTRY: Record<string, DalaConstructDefinition> = {
  curricular_mastery: {
    constructId: 'curricular_mastery',
    name: 'Dominio curricular',
    operationalDefinition:
      'Probabilidad de resolver correctamente ítems de una habilidad bajo condiciones definidas, sin ayuda.',
    evidenceEventTypes: ['answer_submitted', 'task_completed'],
    excludedEventTypes: ['hint_requested', 'session_abandoned'],
    minimumEvidence: { observations: 5, distinctTasks: 3, distinctSessions: 1 },
    halfLifeDays: 45,
    invalidationConditions: [
      'respuesta correcta con pista de nivel máximo no cuenta como dominio',
      'cambio de versión del instrumento invalida comparabilidad directa',
    ],
  },
  persistence: {
    constructId: 'persistence',
    name: 'Persistencia productiva',
    operationalDefinition:
      'Continuidad tras el error acompañada de ajuste o progreso. Repetir sin cambio no es persistencia productiva.',
    evidenceEventTypes: ['attempt_repeated', 'strategy_changed', 'task_completed', 'task_abandoned'],
    excludedEventTypes: ['answer_submitted'],
    minimumEvidence: { observations: 5, distinctTasks: 2, distinctSessions: 1 },
    halfLifeDays: 30,
    invalidationConditions: [
      'con recompensa activa (xp/créditos) la señal se registra pero no actualiza el constructo',
      'más de 5 reintentos idénticos sin ajuste es señal de rigidez, no de persistencia',
    ],
  },
  help_seeking: {
    constructId: 'help_seeking',
    name: 'Búsqueda de ayuda',
    operationalDefinition:
      'Solicitud de apoyo pertinente en momento y tipo. Pedir ayuda tras intentar es señal positiva de metacognición, no debilidad.',
    evidenceEventTypes: ['hint_requested', 'clarification_requested', 'support_accepted', 'support_rejected'],
    excludedEventTypes: ['task_abandoned'],
    minimumEvidence: { observations: 4, distinctTasks: 2, distinctSessions: 1 },
    halfLifeDays: 30,
    invalidationConditions: [
      'pedir ayuda antes de cualquier intento no aporta a este constructo (ver dependencia)',
    ],
  },
  strategy_flexibility: {
    constructId: 'strategy_flexibility',
    name: 'Flexibilidad estratégica',
    operationalDefinition:
      'Cambio deliberado de estrategia cuando la actual no funciona, observado en la secuencia de acciones.',
    evidenceEventTypes: ['strategy_changed', 'attempt_repeated'],
    excludedEventTypes: ['hint_requested'],
    minimumEvidence: { observations: 4, distinctTasks: 2, distinctSessions: 1 },
    halfLifeDays: 30,
    invalidationConditions: [
      'un cambio de estrategia inducido por pista explícita no evidencia flexibilidad propia',
    ],
  },
  task_engagement: {
    constructId: 'task_engagement',
    name: 'Compromiso con la tarea',
    operationalDefinition:
      'Finalización de lo iniciado y retorno voluntario, en contexto. No mide tiempo de pantalla ni lo optimiza.',
    evidenceEventTypes: ['task_completed', 'task_abandoned', 'session_completed', 'session_abandoned'],
    excludedEventTypes: ['answer_submitted'],
    minimumEvidence: { observations: 5, distinctTasks: 3, distinctSessions: 2 },
    halfLifeDays: 21,
    invalidationConditions: [
      'abandono con señal de problema técnico (contexto) no cuenta en contra',
      'con recompensa activa la señal se registra pero no actualiza el constructo',
    ],
  },
};
