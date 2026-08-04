import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ENTRY_MODES, NATURES, STORY } from '../content';

/**
 * Escena 1 — El sistema: las cuatro naturalezas de Synapxix, la misión y
 * visión consolidadas (documento maestro §1), y la primera declaración de
 * la persona: cómo prefiere entrar a lo nuevo. Declarado, no inferido.
 */
@Component({
  selector: 'synapxix-mission',
  standalone: true,
  template: `
    <div class="scene-panel">
      <div class="scene-heading">
        <span class="eyebrow">DE DÓNDE VENIMOS · A DÓNDE VAMOS</span>
        <h2>Un sistema con cuatro naturalezas<br /><em>y un estándar que las une.</em></h2>
        <p>{{ story.quienes }} Abrí las cuatro para seguir — confundirlas es el error más caro del pitch.</p>
      </div>

      <div class="nature-grid">
        @for (nature of natures; track nature.id; let i = $index) {
          <button
            class="nature-card tone-{{ i }}"
            [class.opened]="opened().includes(nature.id)"
            (click)="open(nature.id)"
          >
            <span>{{ '0' + (i + 1) }}</span>
            <h3>{{ nature.label }}</h3>
            <p>{{ nature.copy }}</p>
            <b>{{ opened().includes(nature.id) ? 'ABIERTA' : 'TOCÁ PARA ABRIR' }}</b>
          </button>
        }
      </div>

      <div class="mission-vision">
        <div>
          <span>MISIÓN</span>
          <p>{{ story.mission }}</p>
        </div>
        <div>
          <span>VISIÓN</span>
          <p>{{ story.vision }}</p>
        </div>
      </div>

      <div class="dala-strip">
        <b>D.A.L.A.</b> Evidencia <i>→</i> HumanState <i>→</i> Estado compartido <i>→</i> Política
        <i>→</i> Spec <i>→</i> Intervención <i>→</i> Outcome <i>→</i> Actualización
      </div>

      <div class="scene-heading" style="margin-top: 44px">
        <h2>¿Cómo preferís entrar<br />a algo nuevo?</h2>
        <p>No hay respuesta correcta: es tu primera declaración, y podés cambiarla cuando quieras.</p>
      </div>
      <div class="entry-grid">
        @for (mode of entryModes; track mode.id) {
          <button class="entry-card" [class.selected]="entry() === mode.id" (click)="entry.set(mode.id)">
            <i class="entry-icon">{{ mode.icon }}</i>
            <h3>{{ mode.label }}</h3>
            <p>{{ mode.copy }}</p>
          </button>
        }
      </div>

      <div class="scene-actions">
        <span>lo declarado pesa más que lo inferido — y lo declaraste vos</span>
        <button class="primary" [disabled]="opened().length < 4 || !entry()" (click)="continue_()">
          Entrar a los retos <span>→</span>
        </button>
      </div>
    </div>
  `,
})
export class MissionComponent {
  readonly story = STORY;
  readonly natures = NATURES;
  readonly entryModes = ENTRY_MODES;
  readonly opened = signal<string[]>([]);
  readonly entry = signal<'explore' | 'map' | 'story' | ''>('');

  @Output() done = new EventEmitter<'explore' | 'map' | 'story'>();

  open(id: string) {
    if (!this.opened().includes(id)) this.opened.update((prev) => [...prev, id]);
  }

  continue_() {
    const entry = this.entry();
    if (entry) this.done.emit(entry);
  }
}
