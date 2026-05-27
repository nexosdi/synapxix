import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CognitiveElement } from '../models/CognitiveElement.model';
import { buildChartData, defaultChartOptions } from '../utils/Chart.utils';

Chart.register(...registerables);

@Component({
  selector: 'app-cognitive-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <!-- Agregamos un contenedor condicional para evitar canvas vacíos -->
    <div class="chart-wrapper" *ngIf="element; else noData">
      <div class="chart-wrapper__header">
        <h3 class="chart-wrapper__title">Histórico: {{ element.name }}</h3>
        <span class="chart-wrapper__badge">Sincronizado con Prisma</span>
      </div>
      <div class="chart-wrapper__canvas-container">
        <canvas
          baseChart
          [data]="chartData"
          [options]="chartOptions"
          [type]="'line'"
        ></canvas>
      </div>
    </div>

    <ng-template #noData>
      <div class="chart-wrapper chart-wrapper--empty">
        <p>Selecciona un elemento para ver su evolución.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .chart-wrapper {
      background: white; border-radius: 20px; padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;
    }
    .chart-wrapper--empty { 
      display: flex; align-items: center; justify-content: center; 
      height: 400px; color: #64748b; font-style: italic;
    }
    .chart-wrapper__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .chart-wrapper__title { margin: 0; color: #1e293b; font-size: 1.25rem; }
    .chart-wrapper__badge { background: #f1f5f9; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; color: #64748b; font-weight: 600; }
    .chart-wrapper__canvas-container { height: 400px; position: relative; }
  `],
})
export class CognitiveChartComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input({ required: true }) element: CognitiveElement | null = null;

  public chartData: ChartData<'line'> = { datasets: [], labels: [] };
  public chartOptions: ChartConfiguration['options'] = defaultChartOptions;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['element'] && this.element) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.element) return;

    this.chartData = { ...buildChartData(this.element) };

    if (this.chart) {
      this.chart.update();
    }
  }
}