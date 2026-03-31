import { Component } from '@angular/core';
import { DashboardComponent } from './../components/dashboard/dashboard.component'; // Verifica que la ruta sea correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent], // <--- IMPORTANTE: Agrégalo aquí
  template: `
    <app-dashboard></app-dashboard>
  `
})
export class AppComponent {}