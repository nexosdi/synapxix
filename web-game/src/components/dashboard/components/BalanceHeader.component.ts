import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceData } from '../models/DashboardData.model';

/**
 * Tarjeta de cabecera que muestra el saldo de créditos y XP del usuario.
 * Soporta tres estados: carga (skeleton), error, y datos reales.
 */
@Component({
  selector: 'app-balance-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Estado skeleton mientras carga -->
    <div *ngIf="isLoading" class="balance-header balance-header--skeleton" aria-busy="true" aria-label="Cargando saldo…">
      <div class="balance-header__item">
        <div class="skeleton skeleton--icon"></div>
        <div class="skeleton skeleton--label"></div>
        <div class="skeleton skeleton--value"></div>
      </div>
      <div class="balance-header__divider" aria-hidden="true"></div>
      <div class="balance-header__item">
        <div class="skeleton skeleton--icon"></div>
        <div class="skeleton skeleton--label"></div>
        <div class="skeleton skeleton--value"></div>
      </div>
    </div>

    <!-- Estado de error -->
    <div *ngIf="!isLoading && hasError" class="balance-header balance-header--error" role="alert">
      <svg class="balance-header__error-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
      <span>No se pudo cargar tu saldo. <button (click)="retryClicked.emit()" class="balance-header__retry-btn">Reintentar</button></span>
    </div>

    <!-- Datos reales -->
    <div *ngIf="!isLoading && !hasError && balance" class="balance-header" role="region" aria-label="Saldo del usuario">
      <div class="balance-header__item">
        <svg class="balance-header__icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
        <span class="balance-header__label">Monedas</span>
        <span class="balance-header__value" id="balance-credits">{{ balance.credits | number }}</span>
      </div>
      <div class="balance-header__divider" aria-hidden="true"></div>
      <div class="balance-header__item">
        <svg class="balance-header__icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <span class="balance-header__label">Experiencia</span>
        <span class="balance-header__value" id="balance-xp">{{ balance.experience_points | number }} XP</span>
      </div>
    </div>
  `,
  styles: [`
    .balance-header {
      display: flex;
      align-items: center;
      gap: var(--sx-space-xl);
      background: var(--sx-surface);
      border: 1px solid var(--sx-border);
      border-radius: var(--sx-radius-lg);
      padding: 1.5rem;
      box-shadow: var(--sx-shadow-sm);
      margin-bottom: 0;
      height: 100%;
      box-sizing: border-box;
    }

    .balance-header--error {
      background: var(--sx-danger-soft);
      border-color: var(--sx-danger);
      color: var(--sx-danger);
      gap: var(--sx-space-sm);
      font-weight: var(--sx-weight-medium);
    }

    .balance-header__error-icon { flex-shrink: 0; }

    .balance-header__retry-btn {
      background: none;
      border: none;
      color: var(--sx-danger);
      text-decoration: underline;
      cursor: pointer;
      font-weight: var(--sx-weight-bold);
      padding: 0;
      font-size: inherit;
    }

    .balance-header__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
    }

    .balance-header__divider {
      width: 1px;
      height: 48px;
      background: var(--sx-border);
      flex-shrink: 0;
    }

    .balance-header__icon { color: var(--sx-blue); }

    .balance-header__label {
      font-size: 0.75rem;
      font-weight: var(--sx-weight-medium);
      color: var(--sx-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .balance-header__value {
      font-size: 1.5rem;
      font-weight: var(--sx-weight-black);
      color: var(--sx-blue-deep);
    }

    /* Skeletons */
    .balance-header--skeleton { pointer-events: none; }

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

    .skeleton--icon   { width: 32px; height: 32px; border-radius: 50%; }
    .skeleton--label  { width: 64px; height: 12px; }
    .skeleton--value  { width: 80px; height: 22px; }

    @keyframes skeleton-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 400px) {
      .balance-header { gap: var(--sx-space-md); padding: var(--sx-space-md); }
    }
  `],
})
export class BalanceHeaderComponent {
  @Input({ required: true }) isLoading!: boolean;
  @Input() hasError = false;
  @Input() balance: BalanceData | null = null;
  @Output() retryClicked = new EventEmitter<void>();
}
