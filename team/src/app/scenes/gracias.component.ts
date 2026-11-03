import { Component, computed, inject, signal } from '@angular/core';
import { GRACIAS } from '../content';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

/**
 * Cierre, debajo de la estrella: agradece y pide día y horario para una
 * charla de inicio de 16 minutos. Es logística, no evidencia: se guarda en
 * el perfil declarado y no viaja a D.A.L.A.
 */
@Component({
  selector: 'synapxix-gracias',
  standalone: true,
  template: `
    <section class="graciasPanel">
      <div>
        <p class="eyebrow"><b>CIERRE</b> · TU PRIMER PULSO</p>
        <h2>{{ title() }}</h2>
        <p class="beatNote">{{ gracias.lead }}</p>
      </div>
      @if (saved()) {
        <div class="feedback">
          <b>{{ doneText() }}</b>
          <div class="feedbackActions">
            <button class="btn ghost" (click)="saved.set(false)">Cambiar el horario</button>
          </div>
        </div>
      } @else {
        <div class="graciasPick">
          <p class="graciasAsk">{{ gracias.ask }}</p>
          <div class="prepRow">
            <small>DÍA</small>
            <div class="chipRow">
              @for (d of gracias.days; track d) {
                <button class="chip" [class.selected]="day() === d" [attr.aria-pressed]="day() === d" (click)="day.set(d)">{{ d }}</button>
              }
            </div>
          </div>
          <div class="prepRow">
            <small>HORARIO</small>
            <div class="chipRow">
              @for (h of gracias.slots; track h) {
                <button class="chip" [class.selected]="slot() === h" [attr.aria-pressed]="slot() === h" (click)="slot.set(h)">{{ h }}</button>
              }
            </div>
          </div>
          <button class="btn primary" [disabled]="!day() || !slot() || saving()" (click)="save()">
            {{ saving() ? 'GUARDANDO…' : 'CONFIRMAR LA CHARLA →' }}
          </button>
        </div>
      }
    </section>
  `,
})
export class GraciasComponent {
  private readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  readonly gracias = GRACIAS;
  readonly day = signal<string | null>(null);
  readonly slot = signal<string | null>(null);
  readonly saving = signal(false);
  readonly saved = signal(false);

  readonly title = computed(() => GRACIAS.title.replace('{name}', this.session.memberName().split(' ')[0]));
  readonly doneText = computed(() =>
    GRACIAS.done.replace('{day}', (this.day() ?? '').toLowerCase()).replace('{slot}', this.slot() ?? ''),
  );

  async save() {
    const dia = this.day();
    const horario = this.slot();
    if (!dia || !horario) return;
    this.saving.set(true);
    try {
      await this.api.saveDeclared({ perfil: { reunion: { dia, horario } } });
      this.saved.set(true);
      this.ui.tone(760);
    } catch {
      this.ui.toast('No pudimos guardarlo. Probá de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }
}
