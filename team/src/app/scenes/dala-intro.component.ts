import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { DALA_RULES, DALA_STEPS } from '../content';
import { UiService } from '../services/ui.service';

/**
 * Acto II · D.A.L.A. Un caso mínimo recorre la cadena real del motor
 * (evento → evidencia → lectura → decisión → resultado), un toque por
 * eslabón. Sin diagramas que leer: la señal viaja y la persona la empuja.
 */
@Component({
  selector: 'synapxix-dala-intro',
  standalone: true,
  template: `
    <div class="act2">
      <p class="eyebrow"><b>D.A.L.A.</b> · DYNAMIC ADAPTIVE LEARNING ARCHITECTURE</p>
      <h2>Convierte decisiones en comprensión.</h2>

      <ol class="chain" [style.--step]="step()">
        @for (s of steps; track s.id; let i = $index) {
          <li [class.on]="i <= step()" [class.now]="i === step()">
            <button (click)="go(i)" [disabled]="i > step() + 1" [attr.aria-current]="i === step() ? 'step' : null">
              <i></i><span>{{ s.label }}</span>
            </button>
          </li>
        }
      </ol>

      @if (current(); as s) {
        <div class="chainCard" [attr.data-step]="s.id">
          <p class="chainText">{{ s.text }}</p>
          @if (s.dots) {
            <div class="ratio">
              @for (d of s.dots; track $index) {
                <i [class.on]="d"></i>
              }
            </div>
          }
          @if (s.alt) {
            <p class="chainAlt">{{ s.alt }}</p>
          }
        </div>
      }

      @if (step() < steps.length - 1) {
        <button class="btn primary" (click)="go(step() + 1)">SIGUIENTE PULSO →</button>
      } @else {
        <div class="rules">
          @for (r of rules; track r) {
            <span>{{ r }}</span>
          }
        </div>
        <button class="btn primary" (click)="done.emit()">AHORA JUEGAS TÚ →</button>
      }
    </div>
  `,
})
export class DalaIntroComponent {
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly steps = DALA_STEPS;
  readonly rules = DALA_RULES;
  readonly step = signal(0);

  current() {
    return this.steps[this.step()];
  }

  go(i: number) {
    if (i < 0 || i >= this.steps.length || i > this.step() + 1) return;
    this.step.set(i);
    this.ui.tone(480 + i * 60);
  }
}
