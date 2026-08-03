/**
 * D.A.L.A.™ — Contrato canónico de eventos conductuales.
 *
 * Este archivo ES el estándar de captura. Todo lo que entra a D.A.L.A. pasa
 * por este envelope, sin excepciones. Los módulos de Synapxix usan D.A.L.A.;
 * no implementan lógica D.A.L.A. propia.
 *
 * Invariantes (spec v3 §3.2, §4.4):
 *  - Los eventos son inmutables: una corrección es un evento nuevo.
 *  - `eventId` es la clave de idempotencia: reingestar no duplica.
 *  - `sequence` es incremental dentro de la sesión y permite detectar pérdida.
 *  - `occurredAt` (cliente) y `recordedAt` (servidor) se registran por separado:
 *    la telemetría offline llega tarde y los relojes de tablets no son confiables.
 *  - Sin consentimiento vigente el evento se cuarentena, no se procesa.
 */

export const DALA_EVENT_SCHEMA_VERSION = 'dala.behavior-event.v1' as const;

/**
 * Taxonomía v1 (directrices + spec v3 §4.2).
 * Ampliar exige nueva versión menor del vocabulario, nunca resignificar.
 */
export const DALA_EVENT_TYPES = [
  // sesión
  'session_started',
  'session_completed',
  'session_abandoned',
  // presentación
  'task_presented',
  'instruction_opened',
  // respuesta
  'action_performed',
  'answer_submitted',
  'answer_revised',
  // estrategia
  'strategy_changed',
  'attempt_repeated',
  'task_abandoned',
  'task_completed',
  // apoyo
  'hint_requested',
  'support_offered',
  'support_accepted',
  'support_rejected',
  // comunicación
  'clarification_requested',
  'explanation_requested',
  // humano
  'teacher_annotation',
  'recommendation_approved',
  'recommendation_rejected',
] as const;

export type DalaEventType = (typeof DALA_EVENT_TYPES)[number];

/** Procedencia: qué instrumento produjo el evento y en qué versión. */
export interface DalaEventSource {
  /** Aplicación emisora, p. ej. 'synapxix-web-game'. */
  applicationId: string;
  /** Instrumento (minijuego u otra experiencia instrumentada). */
  instrumentId: string;
  /** Versión del instrumento. Sin versión no hay reproducibilidad. */
  instrumentVersion: string;
  gameType?: string;
}

/** Contexto de la interacción. Contexto incompleto reduce confianza (§5.4). */
export interface DalaEventContext {
  taskId?: string;
  /** Habilidades curriculares referenciadas por ID (catálogo de `learning`). */
  skillIds?: string[];
  /** Dificultad calibrada 0..1, si el instrumento la conoce. */
  difficulty?: number;
  mode?: 'screening' | 'learning' | 'practice';
  /**
   * Condición de recompensa activa. La economía se registra como contexto
   * pero se excluye del motor inferencial v0: XP y créditos distorsionan
   * las lecturas de persistencia y motivación.
   */
  rewardCondition?: 'none' | 'xp' | 'credits';
  locale?: string;
  deviceClass?: 'tablet' | 'desktop' | 'mobile' | 'unknown';
  setting?: 'school' | 'home' | 'unknown';
}

/** Consentimiento bajo el cual se capturó el evento (§11). */
export interface DalaEventConsent {
  /** Versión de la política de consentimiento vigente al capturar. */
  scopeId: string;
  /** Si el dato puede usarse en investigación además de operación. */
  researchAllowed: boolean;
}

/**
 * Envelope universal. Los 13 minijuegos y cualquier instrumento futuro emiten
 * exactamente esta forma; la variación por instrumento vive en `payload` y se
 * valida contra el esquema registrado para (instrumentId, instrumentVersion).
 */
export interface DalaBehaviorEvent {
  schemaVersion: typeof DALA_EVENT_SCHEMA_VERSION;

  /** UUID generado por el emisor. Clave de idempotencia. */
  eventId: string;
  /** Seudónimo del sujeto. NUNCA un user_id real ni un nombre (§15 directrices). */
  subjectId: string;
  sessionId: string;
  /** Momento del hecho según el cliente, UTC RFC3339. */
  occurredAt: string;
  /** Orden incremental dentro de la sesión (detección de pérdida/duplicado). */
  sequence: number;

  eventType: DalaEventType;
  source: DalaEventSource;
  context: DalaEventContext;

  /** Datos específicos del instrumento. Validados por instrumento, no libres. */
  payload: Record<string, unknown>;

  consent: DalaEventConsent;
}

/** Resultado de ingesta. La recepción ACKea rápido; el procesamiento es asíncrono. */
export interface DalaIngestResult {
  eventId: string;
  status: 'accepted' | 'duplicate' | 'quarantined' | 'rejected';
  /** Presente solo en rechazo/cuarentena. Estructurado, nunca con PII. */
  reason?: string;
}
