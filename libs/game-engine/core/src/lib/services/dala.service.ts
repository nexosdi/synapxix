import { Injectable, inject, OnDestroy } from '@angular/core';
import { DalaEmitter, GameInstrumentAdapter } from '@nexosdi.synapxix/dala/instrumentation';
import { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { DalaHttpTransport } from './dala-http.transport';

@Injectable({
  providedIn: 'root'
})
export class DalaInstrumentationService implements OnDestroy {
  private readonly transport = inject(DalaHttpTransport);
  private emitter: DalaEmitter;
  private readonly storageKey = 'dala_offline_queue';
  private flushInterval: any;

  constructor() {
    this.emitter = new DalaEmitter({
      applicationId: 'synapxix-web-game',
      subjectId: 'unknown', // Ideally this comes from AuthService
      sessionId: 'session-id', // Ideally from GameSessionService
      consent: {
        scopeId: 'v1',
        researchAllowed: true
      },
      transport: this.transport
    });

    this.restoreQueue();

    // Flush periodico
    this.flushInterval = setInterval(() => {
      this.flush();
    }, 10000); // Cada 10s
    
    // Guardar al cerrar
    window.addEventListener('beforeunload', this.saveQueue.bind(this));
  }

  createAdapter(instrumentId: 'categorization' | 'timeline-order' | 'intruder', version = '1.0.0'): GameInstrumentAdapter {
    return new GameInstrumentAdapter(instrumentId, version, this.emitter);
  }

  async flush(): Promise<void> {
    const { pending } = await this.emitter.flush();
    if (pending > 0) {
      this.saveQueue();
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  private saveQueue() {
    // Hack: acceder a la queue privada para persistirla si no se limpio todo
    // Ya que DalaEmitter no expone la cola directamente, debemos inferirla o interceptarla, 
    // pero como somos los dueños, podemos usar una asercion de tipo 'any'.
    const queue = (this.emitter as any).queue as DalaBehaviorEvent[];
    if (queue && queue.length > 0) {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  private restoreQueue() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const events = JSON.parse(stored) as DalaBehaviorEvent[];
        if (Array.isArray(events) && events.length > 0) {
          (this.emitter as any).queue = events;
        }
      } catch (e) {
        console.error('Error restoring DALA queue', e);
      }
    }
  }

  ngOnDestroy() {
    if (this.flushInterval) clearInterval(this.flushInterval);
    window.removeEventListener('beforeunload', this.saveQueue.bind(this));
    this.saveQueue();
  }
}
