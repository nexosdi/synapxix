/**
 * D.A.L.A.™ — Puente de instrumentación v2.
 *
 * El puente es la única pieza que conoce D.A.L.A. dentro de una experiencia.
 * Las escenas (juegos, misiones) son puras: emiten observaciones con su
 * oportunidad; el puente agrega sujeto, sesión, escena, secuencia, marco y
 * consentimiento, y entrega eventos v2 con cola local y reenvío idempotente.
 *
 * No depende de ningún framework de interfaz: lo mismo sirve para la
 * experiencia web, el motor de juegos o un motor externo.
 */
import {
  DALA_EVENT_SCHEMA_V2,
  validateEventV2,
  type DalaEventTypeV2,
  type DalaEventV2,
  type DalaOpportunityRef,
  type DalaOrigin,
  type DalaSceneRef,
} from '@nexosdi.synapxix/dala/contracts';

export interface BridgeTransport {
  /** Envía un lote; resuelve con los eventIds que ya no hace falta reenviar. */
  send(events: DalaEventV2[]): Promise<string[]>;
}

export interface BridgeOptions {
  applicationId: string;
  subjectId: string;
  sessionId: string;
  frameworkVersion: string;
  consent: { scopeId: string; researchAllowed: boolean };
  transport: BridgeTransport;
  deviceClass?: DalaEventV2['context']['deviceClass'];
  locale?: string;
  idFactory?: () => string;
  now?: () => Date;
}

/** Lo que una escena pura le entrega al puente. */
export interface Observation {
  type: DalaEventTypeV2;
  opportunity?: DalaOpportunityRef;
  payload?: Record<string, unknown>;
  origin?: DalaOrigin;
}

/** Tope de eventos por envío (el servidor rechaza lotes mayores a 200). */
export const MAX_BATCH = 100;

export class DalaBridge {
  private sequence = 0;
  private inflight: Promise<{ sent: number; pending: number }> | null = null;
  private queue: DalaEventV2[] = [];
  private scene: DalaSceneRef | null = null;
  private readonly idFactory: () => string;
  private readonly now: () => Date;
  /** Observaciones que no cumplieron el contrato: se descartan y se informan. */
  readonly rejected: Array<{ observation: Observation; reason: string }> = [];
  emitted = 0;

  constructor(private readonly options: BridgeOptions) {
    this.idFactory = options.idFactory ?? (() => crypto.randomUUID());
    this.now = options.now ?? (() => new Date());
  }

  get sessionId() {
    return this.options.sessionId;
  }

  get pendingCount() {
    return this.queue.length;
  }

  /** Abre la sesión dentro de la primera escena. */
  startSession(scene: DalaSceneRef) {
    this.scene = scene;
    this.emit({ type: 'session_started', origin: 'system' });
  }

  endSession(completed = true) {
    this.emit({ type: completed ? 'session_completed' : 'session_paused', origin: 'system' });
  }

  enterScene(scene: DalaSceneRef) {
    this.scene = scene;
    this.emit({ type: 'scene_started', origin: 'system' });
  }

  leaveScene() {
    this.emit({ type: 'scene_completed', origin: 'system' });
  }

  /** Interrupciones (pestaña oculta, pausa): contexto, nunca rasgo. */
  pause() {
    this.emit({ type: 'session_paused', origin: 'system' });
  }

  resume() {
    this.emit({ type: 'session_resumed', origin: 'system' });
  }

  /** Traduce una observación de escena a evento v2 y la encola. */
  observe(observation: Observation): DalaEventV2 | null {
    return this.emit(observation);
  }

  private emit(observation: Observation): DalaEventV2 | null {
    if (!this.scene) {
      this.rejected.push({ observation, reason: 'no_scene' });
      return null;
    }
    const event: DalaEventV2 = {
      schemaVersion: DALA_EVENT_SCHEMA_V2,
      eventId: this.idFactory(),
      subjectId: this.options.subjectId,
      sessionId: this.options.sessionId,
      occurredAt: this.now().toISOString(),
      sequence: this.sequence + 1,
      eventType: observation.type,
      origin: observation.origin ?? 'observed',
      source: {
        applicationId: this.options.applicationId,
        instrumentId: this.scene.id,
        instrumentVersion: this.scene.version,
      },
      scene: this.scene,
      ...(observation.opportunity ? { opportunity: observation.opportunity } : {}),
      context: {
        frameworkVersion: this.options.frameworkVersion,
        deviceClass: this.options.deviceClass ?? 'unknown',
        ...(this.options.locale ? { locale: this.options.locale } : {}),
      },
      payload: observation.payload ?? {},
      consent: this.options.consent,
    };
    const invalid = validateEventV2(event);
    if (invalid) {
      this.rejected.push({ observation, reason: invalid });
      return null;
    }
    this.sequence += 1;
    this.queue.push(event);
    this.emitted += 1;
    return event;
  }

  /** Drena la cola. Lo no confirmado queda para el próximo intento. */
  /**
   * Envía la cola en lotes de a lo sumo MAX_BATCH. Los envíos se serializan:
   * un flush que llega mientras otro está en vuelo espera y continúa, así
   * "flush antes de decidir" garantiza que todo lo emitido ya entró.
   */
  async flush(): Promise<{ sent: number; pending: number }> {
    while (this.inflight) await this.inflight;
    this.inflight = this.drain();
    try {
      return await this.inflight;
    } finally {
      this.inflight = null;
    }
  }

  private async drain(): Promise<{ sent: number; pending: number }> {
    let sent = 0;
    while (this.queue.length > 0) {
      const batch = this.queue.slice(0, MAX_BATCH);
      let confirmed: Set<string>;
      try {
        confirmed = new Set(await this.options.transport.send(batch));
      } catch {
        break;
      }
      if (confirmed.size === 0) break;
      this.queue = this.queue.filter((e) => !confirmed.has(e.eventId));
      sent += confirmed.size;
    }
    return { sent, pending: this.queue.length };
  }
}
