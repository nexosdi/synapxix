import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsentModalComponent } from './shared/components/consent-modal/consent-modal.component';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <app-consent-modal></app-consent-modal>
  `,
  imports: [RouterOutlet, ConsentModalComponent],
  standalone: true,
})
export class AppComponent {}
