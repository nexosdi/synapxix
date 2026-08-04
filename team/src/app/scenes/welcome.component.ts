import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AREAS } from '../content';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';

/**
 * Escena 0 — Entrada. Tres campos, un botón. El área (desplegable) adapta
 * el lenguaje del resto de la experiencia. El consentimiento es una línea
 * clara con el detalle a un toque.
 */
@Component({
  selector: 'synapxix-welcome',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="scene-panel hero">
      <div class="hero-copy">
        <span class="eyebrow">SYNAPXIX · EQUIPO</span>
        <h1>Cinco minutos<br /><em>dentro del sistema.</em></h1>
        <p>
          {{ areaHello() }}
        </p>

        <div class="identity-row">
          <label class="field-card">
            <span>Tu nombre</span>
            <input [(ngModel)]="name" placeholder="¿Cómo te llamamos?" [disabled]="joining()" />
          </label>
          <label class="field-card">
            <span>Tu área</span>
            <select [(ngModel)]="areaId" [disabled]="joining()">
              <option value="" disabled>Elegí una…</option>
              @for (area of areas; track area.id) {
                <option [value]="area.id">{{ area.label }}</option>
              }
            </select>
          </label>
          <label class="field-card full">
            <span>Código de invitación</span>
            <input [(ngModel)]="inviteCode" placeholder="SX-XXXX-XX" autocomplete="off" [disabled]="joining()" />
          </label>
        </div>

        <div class="consent-note">
          <b>Jugás, y D.A.L.A. te lee</b> — bajo seudónimo, con tu consentimiento, y al final ves
          todo lo que leyó.
          <button class="link-btn" (click)="showDetail.set(!showDetail())">
            {{ showDetail() ? 'ocultar detalle' : '¿qué se registra?' }}
          </button>
          @if (showDetail()) {
            <p style="margin: 8px 0 0">
              Tus toques dentro del juego (aciertos, reintentos, pistas, cambios de enfoque) como
              eventos seudónimos. Lo que declares se guarda aparte y elegís si se comparte. Nada
              se usa para evaluarte, y podés pedir el retiro de tus datos cuando quieras.
            </p>
          }
        </div>

        @if (error()) {
          <div class="feedback-banner bad">{{ error() }}</div>
        }

        <div class="scene-actions">
          <span>consentimiento team-primer-pulso-v1</span>
          <button class="primary" [disabled]="!canJoin() || joining()" (click)="join()">
            {{ joining() ? 'Conectando…' : 'Jugar' }} <span>→</span>
          </button>
        </div>
      </div>

      <div class="hero-world" aria-hidden="true">
        <div class="big-orbit">
          <div class="core-label"><b>D.A.L.A.</b>EN VIVO</div>
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

  readonly areas = AREAS;
  inviteCode = new URLSearchParams(location.search).get('invite') ?? '';
  name = '';
  areaId = '';
  readonly joining = signal(false);
  readonly error = signal('');
  readonly showDetail = signal(false);

  areaHello() {
    const area = this.areas.find((a) => a.id === this.areaId);
    return (
      area?.hello ??
      'Un juego corto donde el sistema que construimos te lee a vos — con las mismas reglas que usará con niños y niñas.'
    );
  }

  canJoin() {
    return this.inviteCode.trim().length >= 6 && this.name.trim().length >= 2 && this.areaId !== '';
  }

  async join() {
    this.joining.set(true);
    this.error.set('');
    try {
      const areaLabel = this.areas.find((a) => a.id === this.areaId)?.label;
      const result = await this.api.join(this.inviteCode.trim(), this.name.trim(), areaLabel);
      this.session.init(result.token, result.subjectId, result.member.name ?? this.name.trim(), result.consent);
      this.session.area.set(this.areaId);
      this.joined.emit();
    } catch (err) {
      this.error.set(
        err instanceof Error && err.message.includes('unknown_invite')
          ? 'Ese código no está en la lista. Pedile uno nuevo a quien te invitó.'
          : 'No pudimos conectar. Probá de nuevo en unos segundos.',
      );
    } finally {
      this.joining.set(false);
    }
  }
}
