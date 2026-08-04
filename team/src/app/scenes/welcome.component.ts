import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Escena 0 — Entrada por invitación + consentimiento explícito.
 * Sin consentimiento no hay eventos: la API los cuarentena. Aquí se explica
 * QUÉ se registra y para qué, antes de tocar nada.
 */
@Component({
  selector: 'synapxix-welcome',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="scene-panel">
      <span class="eyebrow">SYNAPXIX · EQUIPO</span>
      <h1>Primer <em>Pulso</em></h1>
      <p class="scene-lead">
        Bienvenida, bienvenido al equipo. Esta experiencia es nuestra primera prueba real de
        D.A.L.A.: mientras jugás con nuestra misión, visión y principios, el motor que usaremos
        con niños y niñas te observa a vos — con las mismas reglas, la misma trazabilidad y el
        mismo respeto.
      </p>

      <label class="field">
        <span>TU CÓDIGO DE INVITACIÓN</span>
        <input
          [(ngModel)]="inviteCode"
          placeholder="SX-XXXX-XX"
          autocomplete="off"
          [disabled]="joining()"
        />
      </label>
      <label class="field">
        <span>TU NOMBRE</span>
        <input [(ngModel)]="name" placeholder="¿Cómo te llamamos?" [disabled]="joining()" />
      </label>
      <label class="field">
        <span>TU ROL EN EL EQUIPO (OPCIONAL)</span>
        <input [(ngModel)]="roleLabel" placeholder="p. ej. psicopedagogía, ingeniería, diseño…" [disabled]="joining()" />
      </label>

      <div class="result-note">
        <b>Lo que vamos a registrar, con tu consentimiento:</b> tus interacciones dentro de los
        retos (respuestas, reintentos, pistas, cambios de estrategia) bajo un
        <b>seudónimo</b> — los motores nunca ven tu nombre. Toda inferencia declara su
        incertidumbre, nada se decide sin un humano, y al final vas a ver la traza completa de lo
        que el sistema leyó de vos. Lo que declares explícitamente se guarda aparte y elegís si se
        comparte.
      </div>

      @if (error()) {
        <div class="feedback-banner bad">{{ error() }}</div>
      }

      <div class="scene-actions">
        <span class="scene-lead" style="font-size: 0.85rem">Consentimiento: team-primer-pulso-v1</span>
        <button class="btn btn-primary" [disabled]="!canJoin() || joining()" (click)="join()">
          {{ joining() ? 'Conectando…' : 'Acepto y empiezo →' }}
        </button>
      </div>
    </section>
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
