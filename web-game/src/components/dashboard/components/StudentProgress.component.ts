import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentProgressData } from '../models/DashboardData.model';

/**
 * Muestra el progreso curricular general del alumno como una barra de progreso.
 * Estados: skeleton de carga, error amigable, y datos reales.
 */
@Component({
  selector: 'app-student-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Skeleton -->
    <div *ngIf="isLoading" class="progress-card progress-card--skeleton" aria-busy="true" aria-label="Cargando progreso…">
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--bar"></div>
      <div class="skeleton skeleton--pct"></div>
    </div>

    <!-- Error -->
    <div *ngIf="!isLoading && hasError" class="progress-card progress-card--error" role="alert">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
      <span>No se pudo obtener tu progreso.
        <button (click)="retryClicked.emit()" class="progress-card__retry-btn">Reintentar</button>
      </span>
    </div>

    <!-- Datos reales -->
    <div *ngIf="!isLoading && !hasError && data" class="progress-card" role="region" aria-label="Progreso del alumno">
      <div class="progress-card__header">
        <h3 class="progress-card__title">
          <svg class="progress-card__title-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
          Progreso del Curso
        </h3>
        <span class="progress-card__pct" id="student-progress-pct">{{ progressPct }}%</span>
      </div>
      <div class="progress-card__track" role="progressbar"
           [attr.aria-valuenow]="progressPct"
           aria-valuemin="0"
           aria-valuemax="100"
           aria-label="Progreso del curso">
        <div class="progress-card__fill" [style.width.%]="progressPct"></div>
      </div>
      <p class="progress-card__hint">
        {{ progressPct < 25 ? 'Recién empezando' :
           progressPct < 50 ? 'Buen comienzo, seguí así' :
           progressPct < 75 ? 'Vas por la mitad del camino' :
           progressPct < 100 ? 'Casi llegás, no pares' :
           'Curso completado' }}
      </p>
    </div>
  `,
  styles: [`
    .progress-card {
      background: var(--sx-surface);
      border: 1px solid var(--sx-border);
      border-radius: var(--sx-radius-lg);
      padding: 1.5rem;
      box-shadow: var(--sx-shadow-sm);
      margin-bottom: 0;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .progress-card--error {
      display: flex;
      align-items: center;
      gap: var(--sx-space-sm);
      background: var(--sx-danger-soft);
      border-color: var(--sx-danger);
      color: var(--sx-danger);
      font-weight: var(--sx-weight-medium);
    }

    .progress-card__retry-btn {
      background: none;
      border: none;
      color: var(--sx-danger);
      text-decoration: underline;
      cursor: pointer;
      font-weight: var(--sx-weight-bold);
      padding: 0;
      font-size: inherit;
    }

    .progress-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--sx-space-md);
    }

    .progress-card__title {
      display: flex;
      align-items: center;
      gap: var(--sx-space-xs);
      margin: 0;
      font-size: 1rem;
      font-weight: var(--sx-weight-bold);
      color: var(--sx-blue-deep);
    }

    .progress-card__title-icon { color: var(--sx-blue); flex-shrink: 0; }

    .progress-card__pct {
      font-size: 1.5rem;
      font-weight: var(--sx-weight-black);
      color: var(--sx-blue);
    }

    .progress-card__track {
      background: var(--sx-blue-50);
      border-radius: var(--sx-radius-pill);
      height: 16px;
      overflow: hidden;
      margin-bottom: var(--sx-space-sm);
    }

    .progress-card__fill {
      height: 100%;
      background: linear-gradient(90deg, var(--sx-blue) 0%, var(--sx-blue-deep) 100%);
      border-radius: var(--sx-radius-pill);
      transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .progress-card__hint {
      margin: 0;
      font-size: 0.8rem;
      color: var(--sx-text-muted);
      font-weight: var(--sx-weight-medium);
    }

    /* Skeletons */
    .progress-card--skeleton { pointer-events: none; }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--sx-blue-50) 25%,
        var(--sx-blue-200) 50%,
        var(--sx-blue-50) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.4s infinite;
      border-radius: var(--sx-radius-pill);
    }

    .skeleton--title { width: 180px; height: 18px; margin-bottom: var(--sx-space-md); }
    .skeleton--bar   { width: 100%;  height: 16px; margin-bottom: var(--sx-space-sm); }
    .skeleton--pct   { width: 60px;  height: 14px; }

    @keyframes skeleton-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class StudentProgressComponent {
  @Input({ required: true }) isLoading!: boolean;
  @Input() hasError = false;
  @Input() data: StudentProgressData | null = null;
  @Output() retryClicked = new EventEmitter<void>();

  get progressPct(): number {
    return Math.round((this.data?.progress ?? 0) * 100);
  }
}
