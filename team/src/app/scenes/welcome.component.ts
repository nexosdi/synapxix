import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Escena 0 — Entrada por invitación + consentimiento explícito.
 * Hero con el mundo orbital: la persona ve el sistema que va a habitar.
 * Sin consentimiento no hay eventos: la API los cuarentena.
 */
@Component({
  selector: 'synapxix-welcome',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="scene-panel hero">
      <div class="hero-copy">
        <span class="eyebrow">SYNAPXIX · EQUIPO · PRUEBA REAL Nº 1</span>
        <h1>Vas a entrar<br /><em>dentro del sistema.</em></h1>
        <p>
          Esta no es una inducción con diapositivas. Mientras jugás con lo que Synapxix es — su
          misión, su doctrina, sus límites — el motor D.A.L.A. que usaremos con niños y niñas te
          observa a vos, con las mismas reglas: seudónimo, evidencia, incertidumbre declarada y
          ninguna decisión sin un humano.
        </p>

        <div class="identity-row">
          <label class="field-card">
            <span>Tu código de invitación</span>
            <input [(ngModel)]="inviteCode" placeholder="SX-XXXX-XX" autocomplete="off" [disabled]="joining()" />
          </label>
          <label class="field-card">
            <span>Tu nombre</span>
            <input [(ngModel)]="name" placeholder="¿Cómo te llamamos?" [disabled]="joining()" />
          </label>
          <label class="field-card full">
            <span>Tu rol en el equipo (opcional)</span>
            <input [(ngModel)]="roleLabel" placeholder="psicopedagogía, ingeniería, diseño, territorio…" [disabled]="joining()" />
          </label>
        </div>

        <div class="consent-note">
          <b>Lo que registramos, con tu consentimiento:</b> tus interacciones dentro de los retos
          — respuestas, reintentos, pistas, cambios de estrategia — bajo un <b>seudónimo</b>. Lo
          que declares se guarda aparte y elegís si se comparte. Al final ves la traza completa:
          qué leyó el sistema, con cuánta certeza, y qué no puede saber.
        </div>

        @if (error()) {
          <div class="feedback-banner bad">{{ error() }}</div>
        }

        <div class="scene-actions">
          <span>consentimiento team-primer-pulso-v1 · retirable</span>
          <button class="primary" [disabled]="!canJoin() || joining()" (click)="join()">
            {{ joining() ? 'Conectando…' : 'Acepto y entro' }} <span>→</span>
          </button>
        </div>
      </div>

      <div class="hero-world" aria-hidden="true">
        <div class="big-orbit">
          <div class="core-label"><b>D.A.L.A.</b>ESTADO COMPARTIDO</div>
        </div>
        <div class="float-card card-a"><i>EV</i> Evidencia, no opinión</div>
        <div class="float-card card-b"><i>HS</i> Estados, no etiquetas</div>
        <div class="float-card card-c"><i>HU</i> El humano decide</div>
      </div>
    </div>
  `,
})
export class WelcomeComponent {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);

  @Output() joined = new EventEmitter<void>();

  inviteCode = new URLSearchParams(location.search).get('invite') ?? '';
  name = '';
  roleLabel = '';
  readonly joining = signal(false);
  readonly error = signal('');

  canJoin() {
    return this.inviteCode.trim().length >= 6 && this.name.trim().length >= 2;
  }

  async join() {
    this.joining.set(true);
    this.error.set('');
    try {
      const result = await this.api.join(this.inviteCode.trim(), this.name.trim(), this.roleLabel.trim() || undefined);
      this.session.init(result.token, result.subjectId, result.member.name ?? this.name.trim(), result.consent);
      this.joined.emit();
    } catch (err) {
      this.error.set(
        err instanceof Error && err.message.includes('unknown_invite')
          ? 'Ese código no está en la lista. Revisalo o pedile uno nuevo a quien te invitó.'
          : 'No pudimos conectar. Probá de nuevo en unos segundos.',
      );
    } finally {
      this.joining.set(false);
    }
  }
}
