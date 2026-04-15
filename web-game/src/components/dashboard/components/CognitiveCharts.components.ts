import { Component, Input, OnChanges, ViewChild } from '@angular/core';
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
    <div class="chart-wrapper">
      <div class="chart-wrapper__header">
        <h3 class="chart-wrapper__title">Histórico: {{ element?.name }}</h3>
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
  `,
  styles: [`
    .chart-wrapper {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
    }
    .chart-wrapper__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .chart-wrapper__title { margin: 0; color: #1e293b; }
    .chart-wrapper__badge {
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
    }
    .chart-wrapper__canvas-container { height: 400px; position: relative; }
  `],
})
export class CognitiveChartComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() element: CognitiveElement | null = null;

  public chartData: ChartData<'line'> = { datasets: [], labels: [] };
  public chartOptions: ChartConfiguration['options'] = defaultChartOptions;

  ngOnChanges(): void {
    if (this.element) {
      this.chartData = buildChartData(this.element);
      this.chart?.update();
    }
  }
}