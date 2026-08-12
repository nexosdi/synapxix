import { Injectable, signal } from '@angular/core';
import type { DalaBehaviorEvent, DalaEventConsent, DalaEventContext } from '@nexosdi.synapxix/dala/contracts';
import { DalaEmitter, GameInstrumentAdapter, type GameInteraction } from '@nexosdi.synapxix/dala/instrumentation';

const API = '/api/team/v1';
const APPLICATION_ID = 'synapxix-team-pulse';
const INSTRUMENT_VERSION = '1.0.0';

export type InstrumentId = 'categorization' | 'timeline-order' | 'intruder';

/**
 * Sesión del Primer Pulso: identidad por invitación + emisión D.A.L.A.
 *
 * Usa el SDK real de instrumentación (DalaEmitter + GameInstrumentAdapter):
 * cola local con reintento, secuencia por sesión y reenvío idempotente.
 * Cada reto corre en su PROPIA sesión D.A.L.A. — eso da diversidad de
 * sesiones a la evidencia, como pide el registro de constructos.
 */
@Injectable({ providedIn: 'root' })
export class PulseSessionService {
  readonly token = signal<string | null>(null);
  readonly subjectId = signal<string | null>(null);
  readonly memberName = signal<string>('');
  /** Área elegida al entrar: adapta el lenguaje de toda la experiencia. */
  readonly area = signal<string>('');
  readonly pendingEvents = signal(0);
  /** Señales emitidas en toda la experiencia (contador vivo del topbar). */
  readonly emittedCount = signal(0);
  /** Contadores de la sesión para narrar la recomendación shadow. */
  readonly hintCount = signal(0);
  readonly retryCount = signal(0);
  readonly shiftCount = signal(0);
  /** Sonido ambiental (WebAudio). La persona puede silenciarlo. */
  readonly soundOn = signal(true);
  private audioCtx: AudioContext | null = null;

  /** Tono corto de interfaz. Falla en silencio si el navegador lo bloquea. */
  tone(freq = 520, duration = 0.06) {
    if (!this.soundOn()) return;
    try {
      this.audioCtx = this.audioCtx ?? new AudioContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.025, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // sin audio disponible: la experiencia sigue igual
    }
  }

  private consent: DalaEventConsent = { scopeId: 'team-primer-pulso-v1', researchAllowed: true };
  private emitters: DalaEmitter[] = [];
  private currentEmitter: DalaEmitter | null = null;
  private currentAdapter: GameInstrumentAdapter | null = null;
  private currentSource = { instrumentId: 'welcome', instrumentVersion: INSTRUMENT_VERSION };
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  init(token: string, subjectId: string, name: string, consent: DalaEventConsent) {
    this.token.set(token);
    this.subjectId.set(subjectId);
    this.memberName.set(name);
    this.consent = consent;
    if (!this.flushTimer) {
      this.flushTimer = setInterval(() => void this.flushAll(), 4000);
    }
  }

  get authHeader(): Record<string, string> {
    const token = this.token();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Abre una sesión D.A.L.A. nueva para un instrumento y emite session_started.
   * Devuelve el adaptador con el que el reto mapea sus interacciones.
   */
  startInstrument(instrumentId: InstrumentId): GameInstrumentAdapter {
    const emitter = new DalaEmitter({
      applicationId: APPLICATION_ID,
      subjectId: this.subjectId() ?? 'unknown',
      sessionId: crypto.randomUUID(),
      consent: this.consent,
      transport: { send: (events) => this.send(events) },
    });
    this.emitters.push(emitter);
    this.currentEmitter = emitter;
    this.currentSource = { instrumentId, instrumentVersion: INSTRUMENT_VERSION };
    this.currentAdapter = new GameInstrumentAdapter(instrumentId, INSTRUMENT_VERSION, emitter);
    emitter.emit('session_started', { ...this.currentSource, gameType: instrumentId }, this.baseContext());
    this.emittedCount.update((n) => n + 1);
    return this.currentAdapter;
  }

  /** Mapea una interacción del reto activo (con el contexto base del pulso). */
  interact(interaction: GameInteraction, extra: Partial<DalaEventContext> = {}) {
    if (!this.currentAdapter) return;
    this.currentAdapter.mapInteraction(interaction, { ...this.baseContext(), ...extra });
    if (interaction.kind === 'hint') this.hintCount.update((n) => n + 1);
    if (interaction.kind === 'retry') this.retryCount.update((n) => n + 1);
    if (interaction.kind === 'strategy_shift') this.shiftCount.update((n) => n + 1);
    this.emittedCount.update((n) => n + 1);
    this.pendingEvents.set(this.totalPending());
  }

  /**
   * Cierra la sesión del instrumento y drena la cola.
   * Si el componente pasa su adaptador y ya no es el activo (p. ej. un
   * timeout tardío tras cambiar de escena), NO toca la sesión siguiente:
   * cerrar la sesión equivocada silenciaría todo un reto.
   */
  async endInstrument(completed = true, adapter?: GameInstrumentAdapter) {
    if (adapter && adapter !== this.currentAdapter) {
      await this.flushAll();
      return;
    }
    if (this.currentEmitter) {
      this.currentEmitter.emit(
        completed ? 'session_completed' : 'session_abandoned',
        this.currentSource,
        this.baseContext(),
      );
      this.emittedCount.update((n) => n + 1);
    }
    this.currentAdapter = null;
    this.currentEmitter = null;
    await this.flushAll();
  }

  async flushAll() {
    for (const emitter of this.emitters) {
      await emitter.flush();
    }
    this.pendingEvents.set(this.totalPending());
  }

  private totalPending() {
    return this.emitters.reduce((acc, e) => acc + e.pendingCount, 0);
  }

  private baseContext(): DalaEventContext {
    return {
      mode: 'learning',
      rewardCondition: 'none', // sin economía: la señal del pulso llega limpia
      locale: 'es',
      deviceClass: /mobile|android|iphone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      setting: 'unknown',
    };
  }

  /** Transporte del SDK: lote → API team (que fuerza la autoría del sujeto). */
  private async send(events: DalaBehaviorEvent[]): Promise<string[]> {
    const response = await fetch(`${API}/events/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeader },
      body: JSON.stringify({ events }),
    });
    if (!response.ok) throw new Error(`ingest_failed_${response.status}`);
    const results = (await response.json()) as Array<{ eventId: string; status: string }>;
    // accepted y duplicate se drenan; rejected/quarantined también (reintentar
    // un evento inválido para siempre solo bloquearía la cola).
    return results.map((r) => r.eventId);
  }
}
