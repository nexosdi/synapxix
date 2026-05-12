import { ChartConfiguration, ChartData } from 'chart.js';
import { CognitiveElement } from '../models/CognitiveElement.model';

export function buildChartData(element: CognitiveElement): ChartData<'line'> {
  return {
    // Si las fechas vienen muy largas, podrías formatearlas aquí con Intl o date-fns
    labels: element.history.map((h) => h.date), 
    datasets: [
      {
        data: element.history.map((h) => h.value),
        label: 'Progreso (%)',
        borderColor: element.color,
        // Agregamos un fallback por si element.color falla
        backgroundColor: element.color.startsWith('#') 
          ? `${element.color}1A` 
          : 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: element.color, // Mejora visual: el borde del punto del mismo color
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };
}

export const defaultChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  scales: {
    y: { 
      min: 0, 
      max: 100, 
      grid: { color: '#f1f5f9' },
      ticks: {
        callback: (value) => `${value}%` 
      }
    },
    x: { 
      grid: { display: false } 
    },
  },
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      bodySpacing: 4,
    }
  },
};