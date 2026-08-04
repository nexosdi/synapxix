import { Component, Input } from '@angular/core';

/** Marca orbital Synapxix: tres órbitas y un núcleo. */
@Component({
  selector: 'synapxix-orbital',
  standalone: true,
  template: `
    <div class="orbital-mark" [class.compact]="compact" aria-hidden="true">
      <span class="orbit orbit-a"></span>
      <span class="orbit orbit-b"></span>
      <span class="orbit orbit-c"></span>
      <i></i>
    </div>
  `,
})
export class OrbitalComponent {
  @Input() compact = false;
}
