import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AREAS, CONSENT_DETAILS, CONSENT_TEXT, CV_HEADS_UP } from '../content';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { CicloSynapxixComponent } from './ciclo-synapxix.component';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Escena 05 · Bienvenido al equipo. A la izquierda, el ciclo de Synapxix y
 * el lugar de D.A.L.A. en él: lo que se autoriza, a la vista. A la derecha,
 * identificación y una sola autorización. Sin nombre, correo, edad y la
 * aceptación no se puede continuar: no existe un recorrido sin registro.
 * Idempotente por email; acepta ?invite= (legacy).
 */
@Component({
  selector: 'synapxix-entry',
  standalone: true,
  imports: [FormsModule, CicloSynapxixComponent],
  template: `
    <form class="entry" (submit)="join($event)">
      <div class="entryCopy">
        <p class="eyebrow"><b>ESCENA 05</b> · BIENVENIDA</p>
        <h1>Bienvenido al equipo <em>Synapxix.</em></h1>
        <p class="lead">Así funciona nuestro ciclo. Ahora vas a vivirlo desde dentro.</p>
        <synapxix-ciclo />
      </div>

      <div class="panel">
        <div class="panelHead">
          <span class="num">05</span>
          <div><small>IDENTIFICACIÓN</small><h2>Quién sos</h2></div>
        </div>
        <p class="cvHeadsUp"><b>CV</b>{{ cvHeadsUp }}</p>
        <label class="field">
          Nombre
          <input [(ngModel)]="name" name="name" required maxlength="40" placeholder="¿Cómo querés que te llamemos?" [disabled]="joining()" />
        </label>
        <label class="field">
          Correo
          <input [(ngModel)]="email" name="email" type="email" required placeholder="tu@correo.com" [disabled]="joining()" />
        </label>
        <div class="row">
          <label class="field">
            Edad
            <input [(ngModel)]="age" name="age" type="number" min="1" step="1" required placeholder="Años" [disabled]="joining()" />
          </label>
          <label class="field">
            ¿Qué estudiás?
            <select [(ngModel)]="area" name="area" [disabled]="joining()">
              <option value="" disabled>Elegí</option>
              @for (a of areas; track a) {
                <option [value]="a">{{ a }}</option>
              }
            </select>
          </label>
        </div>

        <label class="consentCheck" [class.on]="accepted">
          <input type="checkbox" [(ngModel)]="accepted" name="accepted" [disabled]="joining()" />
          <span>{{ consentText }}</span>
        </label>
        <button type="button" class="linkBtn" (click)="details()">¿Quién ve mis datos y por cuánto tiempo?</button>

        @if (error()) {
          <div class="formError">{{ error() }}</div>
        }
        <button class="btn primary wide" [disabled]="joining() || !ready()">
          {{ joining() ? 'ENTRANDO…' : 'ACTIVAR MI PULSO' }} <span class="arrow">→</span>
        </button>
        @if (!ready() && !joining()) {
          <p class="privacy">{{ missing() }}</p>
        }
      </div>
    </form>
  `,
})
export class EntryComponent {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly areas = AREAS;
  readonly consentText = CONSENT_TEXT;
  readonly cvHeadsUp = CV_HEADS_UP;
  name = '';
  email = '';
  age: number | null = null;
  area = '';
  accepted = false;
  readonly joining = signal(false);
  readonly error = signal('');

  private readonly inviteCode = new URLSearchParams(location.search).get('invite');

  /** Lo que falta para poder continuar, en orden. */
  missing() {
    if (this.name.trim().length < 2) return 'Escribí tu nombre para continuar.';
    if (!EMAIL.test(this.email.trim())) return 'Escribí un correo válido para continuar.';
    if (!this.validAge()) return 'Escribí tu edad para continuar.';
    if (!this.accepted) return 'Marcá la autorización para continuar.';
    return '';
  }

  ready() {
    return this.missing() === '';
  }

  details() {
    this.ui.openModal(CONSENT_DETAILS);
  }

  async join(event: Event) {
    event.preventDefault();
    if (!this.ready()) return;
    const age = Number(this.age);
    const consent = { accepted: true };

    this.joining.set(true);
    this.error.set('');
    try {
      const result = this.inviteCode
        ? await this.api.join(this.inviteCode, this.name.trim(), this.area, consent)
        : await this.api.register({ name: this.name.trim(), email: this.email.trim(), age, area: this.area, consent });
      this.session.init(result.token, result.subjectId, result.member.name ?? this.name.trim(), result.consent);
      this.session.area.set(this.area);
      // El área queda como dato DECLARADO (jamás evidencia).
      if (this.area) void this.api.saveDeclared({ area: this.area });
      if ('returning' in result && result.returning) {
        this.ui.toast('Volviste: tu modelo sigue acumulando desde la última sesión.');
      }
      this.ui.tone(650);
      this.done.emit();
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      this.error.set(
        message.includes('invalid_age')
          ? 'Revisá la edad: tiene que ser un número entero.'
          : message.includes('invalid_email')
            ? 'Ese correo no parece válido.'
            : message.includes('unknown_invite')
              ? 'Ese código de invitación no está en la lista.'
              : 'No pudimos conectar. Probá de nuevo en unos segundos.',
      );
    } finally {
      this.joining.set(false);
    }
  }

  private validAge() {
    const age = Number(this.age);
    return this.age !== null && Number.isInteger(age) && age >= 1;
  }
}
