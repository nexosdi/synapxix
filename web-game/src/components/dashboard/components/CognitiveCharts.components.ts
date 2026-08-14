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
    <div class="chart-wrapper" *ngIf="element && element.history.length > 0; else noData">
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
        <p>{{ element
          ? 'Todavía no hay histórico disponible para ' + element.name + '.'
          : 'Selecciona un elemento para ver su evolución.' }}</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .chart-wrapper {
      background: var(--sx-surface);
      border-radius: var(--sx-radius-xl);
      padding: 2rem;
      box-shadow: var(--sx-shadow-sm);
      border: 1px solid var(--sx-border);
    }
    .chart-wrapper--empty {
      display: flex; align-items: center; justify-content: center;
      height: 400px; color: var(--sx-text-muted); font-style: italic;
    }
    .chart-wrapper__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .chart-wrapper__title { margin: 0; color: var(--sx-blue-deep); font-size: 1.25rem; }
    .chart-wrapper__badge { background: var(--sx-blue-50); padding: 6px 12px; border-radius: var(--sx-radius-sm); font-size: 0.8rem; color: var(--sx-text-muted); font-weight: var(--sx-weight-medium); }
    .chart-wrapper__canvas-container { height: 400px; position: relative; }

    @media (max-width: 640px) {
      .chart-wrapper { padding: 1.25rem; }
      .chart-wrapper__canvas-container,
      .chart-wrapper--empty { height: 280px; }
      .chart-wrapper__header { flex-wrap: wrap; gap: var(--sx-space-sm); margin-bottom: var(--sx-space-md); }
    }
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