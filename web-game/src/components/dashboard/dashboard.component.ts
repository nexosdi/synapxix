import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

// Definimos la estructura de cada elemento cognitivo (Atención, Memoria, etc.)
interface CognitiveElement {
  id: string;
  name: string;
  current_score: number;
  color: string;
  history: { date: string; value: number }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective],
  template: `
    <div style="padding: 2rem; background: #f8f9fa; min-height: 100vh; font-family: 'Segoe UI', sans-serif;">
      
      <div *ngIf="errorMessage" style="background: #fee2e2; color: #dc2626; padding: 1rem; border-radius: 12px; border: 1px solid #fecaca; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <span><strong>⚠️ Error:</strong> {{ errorMessage }}</span>
        <button (click)="fetchData()" style="background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">Reintentar</button>
      </div>

      <h1 style="color: #1e293b; margin-bottom: 2rem; font-weight: 700;">Análisis de Progreso Cognitivo</h1>

      <div *ngIf="isLoading && !errorMessage" style="text-align: center; padding: 3rem;">
        <div class="loader"></div>
        <p style="margin-top: 1rem; color: #64748b;">Sincronizando con Synapxix...</p>
      </div>

      <div *ngIf="!isLoading && !errorMessage">
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
          <div *ngFor="let item of cognitiveElements" 
               (click)="selectElement(item)"
               [style.border-color]="selectedId === item.id ? item.color : '#e2e8f0'"
               style="background: white; padding: 1.5rem; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); cursor: pointer; border: 2px solid transparent; transition: all 0.3s ease;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-weight: 600; color: #334155;">{{ item.name }}</span>
              <span [style.color]="item.color" style="font-weight: 800; font-size: 1.2rem;">{{ item.current_score }}%</span>
            </div>

            <div style="background: #f1f5f9; border-radius: 99px; height: 12px; overflow: hidden;">
              <div [style.width.%]="item.current_score" 
                   [style.background-color]="item.color"
                   style="height: 100%; transition: width 1s ease;"></div>
            </div>
            <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 10px;">Ver histórico de {{ item.name }}</p>
          </div>
        </div>

        <div style="background: white; border-radius: 20px; padding: 2rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h3 style="margin: 0; color: #1e293b;">Histórico: {{ selectedName }}</h3>
            <span style="background: #f1f5f9; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; color: #64748b; font-weight: 600;">Sincronizado con Prisma</span>
          </div>
          
          <div style="height: 400px; position: relative;">
            <canvas baseChart
              [data]="lineChartData"
              [options]="lineChartOptions"
              [type]="'line'">
            </canvas>
          </div>
        </div>
      </div>
    </div>

    <style>
      .loader { display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3f51b5; border-radius: 50%; animation: spin 1s linear infinite; }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public cognitiveElements: CognitiveElement[] = [];
  public selectedId: string = '';
  public selectedName: string = '';
  public isLoading: boolean = true;
  public errorMessage: string = '';

  public lineChartData: ChartData<'line'> = {
    datasets: [{
      data: [],
      label: 'Progreso (%)',
      borderColor: '#3f51b5',
      backgroundColor: 'rgba(63, 81, 181, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3
    }],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    },
    plugins: { legend: { display: false } }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<CognitiveElement[]>('http://localhost:3000/auth/preferences').subscribe({
      next: (res) => {
        this.cognitiveElements = res;
        if (res.length > 0) {
          // Seleccionamos el primer elemento por defecto para la gráfica
          this.selectElement(res[0]);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'No se pudo conectar con el backend de Synapxix.';
      }
    });
  }

  // MÉTODO PARA FILTRAR LA GRÁFICA
  selectElement(element: CognitiveElement): void {
    this.selectedId = element.id;
    this.selectedName = element.name;

    // Actualizamos los datos de la gráfica con el historial del elemento clicado
    this.lineChartData.labels = element.history.map(h => h.date);
    this.lineChartData.datasets[0].data = element.history.map(h => h.value);
    this.lineChartData.datasets[0].borderColor = element.color;
    this.lineChartData.datasets[0].backgroundColor = `${element.color}1A`; // 10% opacidad

    // Refrescamos la gráfica
    this.chart?.update();
  }
}