import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ENTRY_MODES } from '../content';

/**
 * Escena 1 — Las tres puertas. Una sola decisión declarada: cómo preferís
 * entrar a lo nuevo. Un toque y adentro.
 */
@Component({
  selector: 'synapxix-mission',
  standalone: true,
  template: `
    <div class="scene-panel">
      <div class="scene-heading" style="text-align: center; margin: 0 auto">
        <span class="eyebrow">TU PRIMERA SEÑAL — LA DECLARÁS VOS</span>
        <h2>¿Por qué puerta<br /><em>entrás a lo nuevo?</em></h2>
        <p style="margin: 0 auto">No hay respuesta correcta. Elegí y arrancamos.</p>
      </div>

      <div class="entry-grid">
        @for (mode of entryModes; track mode.id) {
          <button class="entry-card" [class.selected]="entry() === mode.id" (click)="choose(mode.id)">
            <i class="entry-icon">{{ mode.icon }}</i>
            <h3>{{ mode.label }}</h3>
            <p>{{ mode.copy }}</p>
          </button>
        }
      </div>
    </div>
  `,
})
export class MissionComponent {
  readonly entryModes = ENTRY_MODES;
  readonly entry = signal<'explore' | 'map' | 'story' | ''>('');

  @Output() done = new EventEmitter<'explore' | 'map' | 'story'>();

  choose(mode: 'explore' | 'map' | 'story') {
    this.entry.set(mode);
    setTimeout(() => this.done.emit(mode), 350);
  }
}
