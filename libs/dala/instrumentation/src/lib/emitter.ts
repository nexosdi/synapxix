/**
 * D.A.L.A.™ — SDK de instrumentación.
 *
 * Único camino por el que web-game y game-engine emiten eventos. Gestiona
 * secuencia por sesión, cola local con reintento (tolerancia offline: las
 * escuelas pierden conectividad) y reenvío sin duplicación gracias al
 * eventId idempotente del contrato.
 */
import type {
  DalaBehaviorEvent,
  DalaEventConsent,
  DalaEventContext,
  DalaEventType,
} from '@nexosdi.synapxix/dala/contracts';
import { DALA_EVENT_SCHEMA_VERSION } from '@nexosdi.synapxix/dala/contracts';

export interface EmitterTransport {
  /** Envía un lote; resuelve con los eventIds aceptados/duplicados (drenables). */
  send(events: DalaBehaviorEvent[]): Promise<string[]>;
}

export interface EmitterOptions {
  applicationId: string;
  subjectId: string;
  sessionId: string;
  consent: DalaEventConsent;
  transport: EmitterTransport;
  /** Genera UUIDs; inyectable para pruebas deterministas. */
  idFactory?: () => string;
  now?: () => Date;
}

export class DalaEmitter {
  private sequence = 0;
  private queue: DalaBehaviorEvent[] = [];
  private readonly idFactory: () => string;
  private readonly now: () => Date;

  constructor(private readonly options: EmitterOptions) {
    this.idFactory = options.idFactory ?? (() => crypto.randomUUID());
    this.now = options.now ?? (() => new Date());
  }

  /** Construye el envelope canónico y lo encola. Nunca lanza hacia el juego. */
  emit(
    eventType: DalaEventType,
    source: { instrumentId: string; instrumentVersion: string; gameType?: string },
    context: DalaEventContext,
    payload: Record<string, unknown> = {},
  ): DalaBehaviorEvent {
    const event: DalaBehaviorEvent = {
      schemaVersion: DALA_EVENT_SCHEMA_VERSION,
      eventId: this.idFactory(),
      subjectId: this.options.subjectId,
      sessionId: this.options.sessionId,
      occurredAt: this.now().toISOString(),
      sequence: ++this.sequence,
      eventType,
      source: { applicationId: this.options.applicationId, ...source },
      context,
      payload,
      consent: this.options.consent,
    };
    this.queue.push(event);
    return event;
  }

  /**
   * Drena la cola contra el transporte. Los no confirmados permanecen para el
   * próximo flush: el reenvío es seguro porque la ingesta es idempotente.
   */
  async flush(): Promise<{ sent: number; pending: number }> {
    if (this.queue.length === 0) return { sent: 0, pending: 0 };
    try {
      const confirmed = await this.options.transport.send([...this.queue]);
      const confirmedSet = new Set(confirmed);
      this.queue = this.queue.filter((e) => !confirmedSet.has(e.eventId));
      return { sent: confirmedSet.size, pending: this.queue.length };
    } catch {
      // Sin red: los eventos quedan encolados. Nada se pierde ni se duplica.
      return { sent: 0, pending: this.queue.length };
    }
  }

  get pendingCount(): number {
    return this.queue.length;
  }
}
