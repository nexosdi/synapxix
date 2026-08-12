import { Component, EventEmitter, Output } from '@angular/core';
import { VISION } from '../content';

/** Pantalla 1 — La visión: el pulso respirando y el manifiesto en tres líneas. */
@Component({
  selector: 'synapxix-vision',
  standalone: true,
  template: `
    <div class="world">
      <div class="pulseWrap">
        <div class="pulse"><div class="pulseCore">✦</div></div>
        <span class="node n1">E</span>
        <span class="node n2">S</span>
        <span class="node n3">D</span>
        <span class="node n4">O</span>
      </div>
      <div>
        <p class="eyebrow"><b>CANAL ABIERTO</b> · SYNAPXIX</p>
        <h2>{{ vision.headline }}</h2>
        <p class="lead">{{ vision.lead }}</p>
        <p class="quote">{{ vision.quote }}</p>
        <button class="btn primary" style="margin-top: 22px" (click)="done.emit()">
          ENTRAR AL NÚCLEO →
        </button>
      </div>
    </div>
  `,
})
export class VisionComponent {
  readonly vision = VISION;
  @Output() done = new EventEmitter<void>();
}
