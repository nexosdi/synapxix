import { Component, EventEmitter, Output, computed, inject, input } from '@angular/core';
import { SEMANA, type DayId } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { BrandIconComponent } from './brand-icon.component';
import { EstrellaComponent } from './estrella.component';

/**
 * Tu primera semana en Synapxix: cinco momentos en orden, con lo hecho a la
 * vista y la estrella que se va armando al lado. No registra nada; los
 * momentos sí.
 */
@Component({
  selector: 'synapxix-semana',
  standalone: true,
  imports: [BrandIconComponent, EstrellaComponent],
  template: `
    <div class="beat split starBuild semana">
      <div class="splitCopy">
        <p class="eyebrow"><b>TU PRIMERA SEMANA</b> · {{ done().length }} DE {{ days.length }}</p>
        <h2 class="beatTitle">{{ done().length ? 'Así va tu semana.' : semana.title }}</h2>
        @if (!done().length) {
          <p class="beatNote">{{ semana.lead }}</p>
        }
        <ol class="days">
          @for (d of days; track d.id) {
            <li [class.done]="isDone(d.id)" [class.next]="next()?.id === d.id">
              <span class="taskIcon">
                @if (isDone(d.id)) {
                  ✓
                } @else {
                  <synapxix-icon [name]="d.icon" />
                }
              </span>
              <div>
                <small>{{ d.day.toUpperCase() }}</small>
                <b>{{ d.name }}</b>
                @if (next()?.id === d.id) {
                  <span>{{ d.goal }}</span>
                }
              </div>
            </li>
          }
        </ol>
        @if (next(); as n) {
          <button class="btn primary" (click)="start(n.id)">{{ done().length ? 'SEGUIR' : 'EMPEZAR' }}: {{ n.day.toUpperCase() }} →</button>
        } @else {
          <button class="btn primary" (click)="finish.emit()">VER POR DÓNDE TE PROPONE EMPEZAR LA IA →</button>
        }
      </div>
      <synapxix-estrella [state]="session.estrella()" />
    </div>
  `,
})
export class SemanaComponent {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  readonly done = input<DayId[]>([]);
  @Output() chosen = new EventEmitter<DayId>();
  @Output() finish = new EventEmitter<void>();

  readonly semana = SEMANA;
  readonly days = SEMANA.days;
  readonly next = computed(() => SEMANA.days.find((d) => !this.done().includes(d.id)) ?? null);

  isDone(id: DayId) {
    return this.done().includes(id);
  }

  start(id: DayId) {
    this.ui.tone(680);
    this.chosen.emit(id);
  }
}
