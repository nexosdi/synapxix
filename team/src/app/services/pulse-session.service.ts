import { Injectable, signal } from '@angular/core';
import type { DalaEventV2 } from '@nexosdi.synapxix/dala/contracts';
import { PULSO_WEB_FRAMEWORK } from '@nexosdi.synapxix/dala/framework';
import { DalaBridge, type Observation } from '@nexosdi.synapxix/dala/instrumentation';

const API = '/api/team/v1';
const APPLICATION_ID = 'synapxix-pulso-web';

/**
 * Sesión del Primer Pulso: identidad, consentimiento y el puente D.A.L.A.
 *
 * Es la única pieza de la experiencia que conoce el puente. Las escenas le
 * entregan observaciones puras; aquí se agregan sujeto, sesión, escena,
 * marco y consentimiento, y se envían como eventos v2 con cola local.
 * Una sesión por recorrido: las escenas viven dentro de ella.
 */
@Injectable({ providedIn: 'root' })
export class PulseSessionService {
  readonly token = signal<string | null>(null);
  readonly subjectId = signal<string | null>(null);
  readonly memberName = signal<string>('');
  readonly area = signal<string>('');
  readonly pendingEvents = signal(0);
  /** Señales emitidas en toda la experiencia (contador vivo del topbar). */
  readonly emittedCount = signal(0);
  /** Observaciones rechazadas localmente por no cumplir el contrato. */
  readonly rejectedCount = signal(0);

  private bridge: DalaBridge | null = null;
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  init(token: string, subjectId: string, name: string, consent: { scopeId: string; researchAllowed: boolean }) {
    this.token.set(token);
    this.subjectId.set(subjectId);
    this.memberName.set(name);
    this.bridge = new DalaBridge({
      applicationId: APPLICATION_ID,
      subjectId,
      sessionId: crypto.randomUUID(),
      frameworkVersion: PULSO_WEB_FRAMEWORK.version,
      consent,
      transport: { send: (events) => this.send(events) },
      deviceClass: /mobile|android|iphone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      locale: navigator.language,
    });
    this.bridge.startSession(this.sceneRef('portal'));
    this.sync();
    if (!this.flushTimer) this.flushTimer = setInterval(() => void this.flush(), 4000);
    // Interrupciones: contexto para interpretar, nunca rasgo.
    document.addEventListener('visibilitychange', () => {
      if (!this.bridge) return;
      if (document.hidden) this.bridge.pause();
      else this.bridge.resume();
      this.sync();
    });
  }

  get authHeader(): Record<string, string> {
    const token = this.token();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  enterScene(sceneId: string) {
    this.bridge?.enterScene(this.sceneRef(sceneId));
    this.sync();
  }

  leaveScene() {
    this.bridge?.leaveScene();
    this.sync();
  }

  /** Recibe una observación de escena y la convierte en evento v2. */
  observe(observation: Observation) {
    if (!this.bridge) return;
    if (!this.bridge.observe(observation)) {
      console.warn('[D.A.L.A.] observación rechazada', this.bridge.rejected[this.bridge.rejected.length - 1]);
    }
    this.sync();
  }

  async end() {
    this.bridge?.endSession(true);
    await this.flush();
  }

  async flush() {
    if (!this.bridge) return;
    await this.bridge.flush();
    this.sync();
  }

  private sceneRef(sceneId: string) {
    const scene = PULSO_WEB_FRAMEWORK.scenes.find((s) => s.id === sceneId);
    return { id: sceneId, version: scene?.version ?? '0.1' };
  }

  private sync() {
    if (!this.bridge) return;
    this.emittedCount.set(this.bridge.emitted);
    this.pendingEvents.set(this.bridge.pendingCount);
    this.rejectedCount.set(this.bridge.rejected.length);
  }

  /** Transporte: lote → API, que verifica la autoría del sujeto evento por evento. */
  private async send(events: DalaEventV2[]): Promise<string[]> {
    const response = await fetch(`${API}/events/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeader },
      body: JSON.stringify({ events }),
    });
    if (!response.ok) throw new Error(`ingest_failed_${response.status}`);
    const results = (await response.json()) as Array<{ eventId: string; status: string; reason?: string }>;
    for (const r of results) {
      if (r.status === 'rejected' || r.status === 'quarantined') {
        console.warn(`[D.A.L.A.] ${r.status}: ${r.reason} (${r.eventId})`);
      }
    }
    // Aceptados, duplicados y rechazados se drenan: reintentar un evento
    // inválido para siempre solo bloquearía la cola.
    return results.map((r) => r.eventId);
  }
}
