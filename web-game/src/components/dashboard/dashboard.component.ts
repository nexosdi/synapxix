import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CognitiveElement } from './models/CognitiveElement.model';
import { CognitiveService } from './services/Cognitive.service';
import { CognitiveCardComponent } from './components/CognitiveCard.component';
import { CognitiveChartComponent } from './components/CognitiveCharts.components';

@Component({
  selector: 'app-dashboard',
  standalone: true,                          // ← requerido para poder importarlo en app.component
  imports: [
    CommonModule,
    HttpClientModule,
    CognitiveCardComponent,
    CognitiveChartComponent,
  ],
  template: `
    <div class="dashboard">

      <div *ngIf="errorMessage" class="dashboard__error">
        <span><strong>⚠️ Error:</strong> {{ errorMessage }}</span>
        <button (click)="fetchData()">Reintentar</button>
      </div>

      <h1 class="dashboard__title">Análisis de Progreso Cognitivo</h1>

      <div *ngIf="isLoading && !errorMessage" class="dashboard__loading">
        <div class="loader"></div>
        <p>Sincronizando con Synapxix...</p>
      </div>

      <ng-container *ngIf="!isLoading && !errorMessage">
        <div class="dashboard__grid">
          <app-cognitive-card
            *ngFor="let item of elements"
            [element]="item"
            [isSelected]="selectedElement?.id === item.id"
            (selected)="onElementSelected($event)"
          ></app-cognitive-card>
        </div>

        <app-cognitive-chart [element]="selectedElement"></app-cognitive-chart>
      </ng-container>

    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
    }
    .dashboard__title { color: #1e293b; margin-bottom: 2rem; font-weight: 700; }
    .dashboard__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .dashboard__loading { text-align: center; padding: 3rem; }
    .dashboard__loading p { margin-top: 1rem; color: #64748b; }
    .dashboard__error {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fee2e2;
      color: #dc2626;
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid #fecaca;
      margin-bottom: 1.5rem;
    }
    .dashboard__error button {
      background: #dc2626;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    .loader {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3f51b5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `],
})
export class DashboardComponent implements OnInit {
  public elements: CognitiveElement[] = [];
  public selectedElement: CognitiveElement | null = null;
  public isLoading = true;
  public errorMessage = '';

  constructor(private cognitiveService: CognitiveService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.cognitiveService.getElements().subscribe({
      next: (data) => {
        this.elements = data;
        this.selectedElement = data[0] ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'No se pudo conectar con el backend de Synapxix.';
      },
    });
  }

  onElementSelected(element: CognitiveElement): void {
    this.selectedElement = element;
  }
}