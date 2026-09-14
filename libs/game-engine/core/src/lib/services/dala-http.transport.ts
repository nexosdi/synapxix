import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { EmitterTransport } from '@nexosdi.synapxix/dala/instrumentation';

@Injectable({
  providedIn: 'root'
})
export class DalaHttpTransport implements EmitterTransport {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/dala/events';

  async send(events: DalaBehaviorEvent[]): Promise<string[]> {
    if (!events.length) return [];
    
    try {
      // Intentamos hacer el POST al backend.
      // Se asume que el backend devuelve { acceptedIds: string[] }
      const response = await lastValueFrom(
        this.http.post<{ acceptedIds: string[] }>(this.endpoint, { events })
      );
      
      return response.acceptedIds || events.map(e => e.eventId);
    } catch (error) {
      // Lanzamos error para que el emitter lo atrape y deje los eventos en la cola (offline resilience)
      throw error;
    }
  }
}
