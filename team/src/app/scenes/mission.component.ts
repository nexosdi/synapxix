import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ENTRY_MODES, STORY } from '../content';

/**
 * Escena 1 — Quiénes somos, y tu primera declaración: cómo preferís entrar
 * a lo nuevo. Es DECLARADO (la persona lo dice), no inferido.
 */
@Component({
  selector: 'synapxix-mission',
  standalone: true,
  template: `
    <section class="scene-panel">
      <span class="eyebrow">DE DÓNDE VENIMOS</span>
      <h2>Una misión, una visión<br /><em>y un estándar que las protege.</em></h2>

      <div class="option-grid">
        <article class="option-card" [class.active]="opened().includes('origen')" (click)="open('origen')">
          <i>◍</i>
          <b>Origen</b>
          <p>{{ opened().includes('origen') ? story.origin : 'Tocá para abrir' }}</p>
        </article>
        <article class="option-card" [class.active]="opened().includes('mision')" (click)="open('mision')">
          <i>➤</i>
          <b>Misión</b>
          <p>{{ opened().includes('mision') ? story.mission : 'Tocá para abrir' }}</p>
        </article>
        <article class="option-card" [class.active]="opened().includes('vision')" (click)="open('vision')">
          <i>✦</i>
          <b>Visión</b>
          <p>{{ opened().includes('vision') ? story.vision : 'Tocá para abrir' }}</p>
        </article>
        <article class="option-card" [class.active]="opened().includes('dala')" (click)="open('dala')">
          <i>◎</i>
          <b>D.A.L.A.</b>
          <p>{{ opened().includes('dala') ? story.dala : 'Tocá para abrir' }}</p>
        </article>
      </div>

      <h2 style="margin-top: 32px">¿Cómo preferís entrar a algo nuevo?</h2>
      <p class="scene-lead">No hay respuesta correcta: es tu primera declaración, y podés cambiarla cuando quieras.</p>
      <div class="option-grid">
        @for (mode of entryModes; track mode.id) {
          <button class="option-card" [class.active]="entry() === mode.id" (click)="entry.set(mode.id)">
            <i>{{ mode.icon }}</i>
            <b>{{ mode.label }}</b>
            <p>{{ mode.copy }}</p>
          </button>
        }
      </div>

      <div class="scene-actions">
        <span></span>
        <button class="btn btn-primary" [disabled]="opened().length < 4 || !entry()" (click)="continue_()">
          A los retos <span>→</span>
        </button>
      </div>
    </section>
  `,
})
export class MissionComponent {
  readonly story = STORY;
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
