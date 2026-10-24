import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionSummary } from '../models/SessionReport.model';

/**
 * Tarjeta que muestra el resumen de sesiones de juego del alumno.
 * Estados: skeleton de carga, error amigable, y datos reales.
 */
@Component({
  selector: 'app-session-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Skeleton -->
    <div *ngIf="isLoading"
         class="session-card session-card--skeleton"
         aria-busy="true"
         aria-label="Cargando sesiones…">
      <div class="session-card__grid">
        <div class="session-stat" *ngFor="let i of [0,1,2]">
          <div class="skeleton skeleton--stat-value"></div>
          <div class="skeleton skeleton--stat-label"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div *ngIf="!isLoading && hasError"
         class="session-card session-card--error"
         role="alert">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
      <span>No se pudo cargar el historial de sesiones.
        <button (click)="retryClicked.emit()" class="session-card__retry-btn">Reintentar</button>
      </span>
    </div>

    <!-- Datos reales -->
    <div *ngIf="!isLoading && !hasError && summary"
         class="session-card"
         role="region"
         aria-label="Resumen de sesiones de juego">
      <h3 class="session-card__title">
        <svg class="session-card__title-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>
        Sesiones de Juego
      </h3>
      <div class="session-card__grid">
        <div class="session-stat">
          <span class="session-stat__value" id="sessions-total">{{ summary.totalSessions }}</span>
          <span class="session-stat__label">Total jugadas</span>
        </div>
        <div class="session-stat">
          <span class="session-stat__value" id="sessions-completed">{{ summary.completedSessions }}</span>
          <span class="session-stat__label">Completadas</span>
        </div>
        <div class="session-stat">
          <span class="session-stat__value" id="sessions-accuracy">{{ accuracyPct }}%</span>
          <span class="session-stat__label">Precisión global</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .session-card {
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

    .session-card--error {
      display: flex;
      align-items: center;
      gap: var(--sx-space-sm);
      background: var(--sx-danger-soft);
      border-color: var(--sx-danger);
      color: var(--sx-danger);
      font-weight: var(--sx-weight-medium);
    }

    .session-card__retry-btn {
      background: none;
      border: none;
      color: var(--sx-danger);
      text-decoration: underline;
      cursor: pointer;
      font-weight: var(--sx-weight-bold);
      padding: 0;
      font-size: inherit;
    }

    .session-card__title {
      display: flex;
      align-items: center;
      gap: var(--sx-space-xs);
      margin: 0 0 var(--sx-space-md);
      font-size: 1rem;
      font-weight: var(--sx-weight-bold);
      color: var(--sx-blue-deep);
    }

    .session-card__title-icon { color: var(--sx-blue); flex-shrink: 0; }

    .session-card__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(80px, 100%), 1fr));
      gap: var(--sx-space-md);
    }

    @media (max-width: 360px) {
      .session-card__grid { grid-template-columns: 1fr; }
      .session-stat { flex-direction: row; justify-content: space-between; }
    }

    .session-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .session-stat__value {
      font-size: 2rem;
      font-weight: var(--sx-weight-black);
      color: var(--sx-blue);
    }

    .session-stat__label {
      font-size: 0.75rem;
      font-weight: var(--sx-weight-medium);
      color: var(--sx-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: center;
    }

    /* Skeletons */
    .session-card--skeleton { pointer-events: none; }

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

    .skeleton--stat-value { width: 48px; height: 32px; border-radius: var(--sx-radius-sm); }
    .skeleton--stat-label { width: 72px; height: 12px; }

    @keyframes skeleton-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class SessionSummaryComponent {
  @Input({ required: true }) isLoading!: boolean;
  @Input() hasError = false;
  @Input() summary: SessionSummary | null = null;
  @Output() retryClicked = new EventEmitter<void>();

  get accuracyPct(): number {
    return Math.round((this.summary?.accuracy ?? 0) * 100);
  }
}
