/**
 * D.A.L.A.™ — Contrato de eventos v2 (Modelo Fundacional 0.1).
 *
 * La v2 implementa la cadena del §7: escena → oportunidad → acción →
 * observable → indicador → hipótesis. Cada evento declara en qué escena
 * ocurrió, a qué oportunidad pertenece y de qué fuente viene. Sin esa
 * referencia, una conducta ausente no puede interpretarse: no sabríamos
 * si el estudiante tuvo ocasión real de realizarla.
 *
 * Invariantes heredados de v1: inmutable, `eventId` idempotente,
 * `sequence` incremental por sesión, reloj del cliente y del servidor
 * separados, cuarentena sin consentimiento vigente.
 */

export const DALA_EVENT_SCHEMA_V2 = 'dala.behavior-event.v2' as const;

/**
 * Vocabulario v2. Agrupa exposición (qué pudo hacer), actuación (qué hizo)
 * y declaración (qué dijo). Ampliar exige nueva versión del vocabulario.
 */
export const DALA_EVENT_TYPES_V2 = [
  // sesión y escena
  'session_started',
  'session_completed',
  'session_paused',
  'session_resumed',
  'scene_started',
  'scene_completed',
  // exposición — qué estaba disponible y en qué orden (Anexo 23)
  'instruction_presented',
  'task_presented',
  'options_presented',
  'support_available',
  'exploration_offered',
  'choice_offered',
  'recommendation_presented',
  // actuación
  'instructions_opened',
  'action_performed',
  'answer_revised',
  'response_submitted',
  'hint_requested',
  'support_delivered',
  'strategy_changed',
  'task_skipped',
  'task_completed',
  'exploration_opened',
  'choice_made',
  'reasons_opened',
  'recommendation_reviewed',
  // declaración
  'declaration_made',
  'claim_reviewed',
] as const;

export type DalaEventTypeV2 = (typeof DALA_EVENT_TYPES_V2)[number];

/**
 * Procedencia de la información (§7, "Fuente humana"). Lo observado, lo
 * declarado y lo que agrega el sistema viajan etiquetados y jamás se mezclan.
 */
export type DalaOrigin = 'observed' | 'reported' | 'system';

/** Escena y versión: sin versión no hay reproducibilidad ni comparación. */
export interface DalaSceneRef {
  id: string;
  version: string;
}

/**
 * Oportunidad: una acción que realmente estuvo disponible y fue presentada.
 * Agrupa los eventos que permiten juzgar una conducta. `kind` remite al
 * catálogo de oportunidades de la SceneSpec.
 */
export interface DalaOpportunityRef {
  id: string;
  kind: string;
  taskId?: string;
}

export interface DalaEventV2 {
  schemaVersion: typeof DALA_EVENT_SCHEMA_V2;
  /** UUID del emisor. Clave de idempotencia. */
  eventId: string;
  /** Seudónimo. Nunca un id de usuario ni un nombre. */
  subjectId: string;
  sessionId: string;
  /** Momento según el cliente, UTC RFC3339. */
  occurredAt: string;
  /** Orden incremental dentro de la sesión. */
  sequence: number;

  eventType: DalaEventTypeV2;
  origin: DalaOrigin;
  source: { applicationId: string; instrumentId: string; instrumentVersion: string };
  scene: DalaSceneRef;
  /** Obligatoria en todo evento de tarea (ver `requiresOpportunity`). */
  opportunity?: DalaOpportunityRef;

  context: {
    frameworkVersion: string;
    locale?: string;
    deviceClass?: 'tablet' | 'desktop' | 'mobile' | 'unknown';
    institutionId?: string;
  };

  payload: Record<string, unknown>;
  consent: { scopeId: string; researchAllowed: boolean };
}

/** Eventos que solo existen dentro de una oportunidad. */
const SESSION_LEVEL: ReadonlySet<DalaEventTypeV2> = new Set([
  'session_started',
  'session_completed',
  'session_paused',
  'session_resumed',
  'scene_started',
  'scene_completed',
  'instruction_presented',
]);

export function requiresOpportunity(type: DalaEventTypeV2): boolean {
  return !SESSION_LEVEL.has(type);
}

/**
 * Validación estructural de ingesta (§7 "Calidad antes de interpretación").
 * Devuelve el motivo de rechazo o null. Lo semántico (que la escena exista en
 * el marco) lo verifica el colector contra el marco versionado.
 */
export function validateEventV2(event: Partial<DalaEventV2> | null | undefined): string | null {
  if (!event || typeof event !== 'object') return 'invalid_envelope';
  if (event.schemaVersion !== DALA_EVENT_SCHEMA_V2) return 'unsupported_schema_version';
  if (!event.eventId || typeof event.eventId !== 'string') return 'missing_event_id';
  if (!event.subjectId) return 'missing_subject_id';
  if (!event.sessionId) return 'missing_session_id';
  if (!Number.isInteger(event.sequence) || (event.sequence ?? -1) < 0) return 'invalid_sequence';
  if (!event.eventType || !DALA_EVENT_TYPES_V2.includes(event.eventType)) return 'unknown_event_type';
  if (event.origin !== 'observed' && event.origin !== 'reported' && event.origin !== 'system') {
    return 'invalid_origin';
  }
  if (!event.scene?.id || !event.scene?.version) return 'missing_scene_version';
  if (requiresOpportunity(event.eventType) && (!event.opportunity?.id || !event.opportunity?.kind)) {
    return 'missing_opportunity';
  }
  if (!event.context?.frameworkVersion) return 'missing_framework_version';
  if (Number.isNaN(Date.parse(event.occurredAt ?? ''))) return 'invalid_occurred_at';
  return null;
}
