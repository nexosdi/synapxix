import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AREAS } from '../content';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

/**
 * Pantalla 0 — Inscripción abierta (protocolo 01).
 * Nombre + correo + edad (21–36) + área + consentimiento explícito.
 * Idempotente por email: quien vuelve recupera su sujeto y su modelo
 * dinámico sigue acumulando. También acepta ?invite= como camino legacy.
 */
@Component({
  selector: 'synapxix-entry',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="entry">
      <div class="entryCopy">
        <p class="eyebrow"><b>PRIMER PULSO</b></p>
        <h1>No venimos a encajar.<br /><em>Venimos a construir.</em></h1>
        <p class="lead">Desde aquí, cada decisión tuya construye tu modelo.</p>
        <div class="microGrid">
          <div><strong>08</strong><span>minutos</span></div>
          <div><strong>03</strong><span>misiones</span></div>
          <div><strong>01</strong><span>modelo tuyo</span></div>
        </div>
      </div>

      <form class="panel" (submit)="join($event)">
        <div class="panelHead">
          <span class="num">01</span>
          <div><small>IDENTIFICACIÓN</small><h2>Abre tu canal</h2></div>
        </div>
        <label class="field">
          Nombre de usuario
          <input [(ngModel)]="name" name="name" required maxlength="40" placeholder="¿Cómo quieres que te llamemos?" [disabled]="joining()" />
        </label>
        <label class="field">
          Correo
          <input [(ngModel)]="email" name="email" type="email" required placeholder="tu@correo.com" [disabled]="joining()" />
        </label>
        <div class="row">
          <label class="field">
            Edad
            <input [(ngModel)]="age" name="age" type="number" min="21" max="36" required placeholder="21–36" [disabled]="joining()" />
          </label>
          <label class="field">
            Área
            <select [(ngModel)]="area" name="area" required [disabled]="joining()">
              <option value="" disabled>Selecciona</option>
              @for (a of areas; track a) {
                <option [value]="a">{{ a }}</option>
              }
            </select>
          </label>
        </div>
        <label class="consent">
          <input type="checkbox" [(ngModel)]="consent" name="consent" required [disabled]="joining()" />
          <span>
            Acepto registrar decisiones, tiempos, reintentos y ayudas para probar D.A.L.A.
            Puedo solicitar el retiro de mis datos.
          </span>
        </label>
        @if (error()) {
          <div class="formError">{{ error() }}</div>
        }
        <button class="btn primary wide" [disabled]="joining()">
          {{ joining() ? 'ABRIENDO CANAL…' : 'ACTIVAR MI PULSO' }} <span class="arrow">→</span>
        </button>
        <p class="privacy">Identidad y eventos conductuales se guardan por separado.</p>
      </form>
    </div>
  `,
})
export class EntryComponent {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly areas = AREAS;
  name = '';
  email = '';
  age: number | null = null;
  area = '';
  consent = false;
  readonly joining = signal(false);
  readonly error = signal('');

  private readonly inviteCode = new URLSearchParams(location.search).get('invite');

  async join(event: Event) {
    event.preventDefault();
    const age = Number(this.age);
    if (age < 21 || age > 36) {
      this.error.set('El piloto está limitado a personas de 21 a 36 años.');
      return;
    }
    if (!this.consent) return;

    this.joining.set(true);
    this.error.set('');
    try {
      const result = this.inviteCode
        ? await this.api.join(this.inviteCode, this.name.trim(), this.area)
        : await this.api.register({
            name: this.name.trim(),
            email: this.email.trim(),
            age,
            area: this.area,
          });
      this.session.init(result.token, result.subjectId, result.member.name ?? this.name.trim(), result.consent);
      this.session.area.set(this.area);
      // El área y la banda etaria quedan como DECLARADAS (jamás evidencia).
      void this.api.saveDeclared({ area: this.area, ageBand: '21-36' });
      if ('returning' in result && result.returning) {
        this.ui.toast('Canal reabierto: tu modelo sigue acumulando desde la última sesión.');
      }
      this.ui.tone(650);
      this.done.emit();
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      this.error.set(
        message.includes('age_out_of_pilot_range')
          ? 'El piloto está limitado a personas de 21 a 36 años.'
          : message.includes('invalid_email')
            ? 'Ese correo no parece válido.'
            : message.includes('unknown_invite')
              ? 'Ese código de invitación no está en la lista.'
              : 'No pudimos conectar. Prueba de nuevo en unos segundos.',
      );
    } finally {
      this.joining.set(false);
    }
  }
}
