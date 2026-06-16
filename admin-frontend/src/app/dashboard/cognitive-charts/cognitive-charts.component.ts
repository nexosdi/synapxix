import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Metric {
  label: string;
  value: number;
  gradient: string;
  svgPath: string;
  color: string;
}

@Component({
  selector: 'app-cognitive-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="charts" role="list" aria-label="Cognitive metrics">
      @for (metric of displayedMetrics(); track metric.label) {
        <div class="chart-row" role="listitem">
          <div class="chart-row__header">
            <svg class="chart-row__icon" viewBox="0 0 24 24" fill="currentColor"
                 width="16" height="16" [style.color]="metric.color" aria-hidden="true">
              <path [attr.d]="metric.svgPath"/>
            </svg>
            <span class="chart-row__label">{{ metric.label }}</span>
            <span class="chart-row__value" [style.color]="metric.color">{{ metric.value }}%</span>
          </div>
          <div class="chart-row__track"
               role="progressbar"
               [attr.aria-label]="metric.label + ': ' + metric.value + ' percent'"
               [attr.aria-valuenow]="metric.value"
               aria-valuemin="0"
               aria-valuemax="100">
            <div class="chart-row__fill"
                 [style.width.%]="metric.value"
                 [style.background]="metric.gradient">
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .charts {
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
    }

    .chart-row__header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.6rem;
    }

    .chart-row__icon {
      flex-shrink: 0;
    }

    .chart-row__label {
      font-size: 0.88rem;
      font-weight: 600;
      color: rgba(255,255,255,0.8);
      flex: 1;
    }

    .chart-row__value {
      font-size: 0.88rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      min-width: 42px;
      text-align: right;
    }

    .chart-row__track {
      height: 10px;
      background: rgba(255,255,255,0.07);
      border-radius: 999px;
      overflow: hidden;
    }

    .chart-row__fill {
      height: 100%;
      border-radius: 999px;
      transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  `],
})
export class CognitiveChartsComponent implements OnChanges {
  @Input() memory  = 0;
  @Input() reading = 0;
  @Input() speech  = 0;

  readonly displayedMetrics = signal<Metric[]>([]);

  ngOnChanges(): void {
    this.displayedMetrics.set([
      {
        label:    'Memory',
        value:    this.memory,
        gradient: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
        // Clock/history icon representing recall
        svgPath:  'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
        color:    '#a78bfa',
      },
      {
        label:    'Reading',
        value:    this.reading,
        gradient: 'linear-gradient(90deg, #db2777, #f472b6)',
        // Book icon
        svgPath:  'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
        color:    '#f472b6',
      },
      {
        label:    'Speech',
        value:    this.speech,
        gradient: 'linear-gradient(90deg, #f59e0b, #fcd34d)',
        // Mic icon
        svgPath:  'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',
        color:    '#fcd34d',
      },
    ]);
  }
}
