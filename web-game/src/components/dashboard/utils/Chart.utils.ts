import { ChartConfiguration, ChartData } from 'chart.js';
import { CognitiveElement } from '../models/CognitiveElement.model';

export function buildChartData(element: CognitiveElement): ChartData<'line'> {
  return {
    labels: element.history.map((h) => h.date),
    datasets: [
      {
        data: element.history.map((h) => h.value),
        label: 'Progreso (%)',
        borderColor: element.color,
        backgroundColor: `${element.color}1A`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 3,
      },
    ],
  };
}

export const defaultChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { min: 0, max: 100, grid: { color: '#f1f5f9' } },
    x: { grid: { display: false } },
  },
  plugins: { legend: { display: false } },
};