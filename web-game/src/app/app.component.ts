import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthWidgetComponent } from '../components/auth-widget.component';

@Component({
  selector: 'app-root',
  template: `
    <app-auth-widget></app-auth-widget>
    <router-outlet></router-outlet>
  `,
  imports: [RouterOutlet, AuthWidgetComponent],
  standalone: true,
})
export class AppComponent {}