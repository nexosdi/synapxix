import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-balance',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="balance"
      role="status"
      aria-live="polite"
      [attr.aria-label]="'Saldo disponible: ' + (isLoading ? 'cargando' : (credits | number) + ' monedas')"
    >
      <div class="balance__icon-wrapper" aria-hidden="true">
        <svg class="balance__icon" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 6v12M8.5 9.5c0-1.5 1.5-2 3.5-2s3.5.7 3.5 2c0 2-3 2.5-4 3s-3 1.5-3 3c0 1.5 1.5 2 3.5 2s3.5-.7 3.5-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>

      <div class="balance__info">
        <span class="balance__label">Tus Monedas</span>
        <div class="balance__amount-row">
          <span
            *ngIf="!isLoading"
            class="balance__amount"
          >
            {{ credits | number }}
          </span>
          <div
            *ngIf="isLoading"
            class="balance__skeleton"
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .balance {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: var(--sx-surface, #ffffff);
      padding: 10px 18px;
      border-radius: var(--sx-radius-lg, 22px);
      box-shadow: var(--sx-shadow-sm, 0 2px 6px rgba(10, 79, 191, 0.08));
      border: 1.5px solid var(--sx-border, #c9e0ff);
      transition: all var(--sx-transition, 180ms ease);
    }

    .balance:hover {
      box-shadow: var(--sx-shadow-md, 0 6px 18px rgba(10, 79, 191, 0.12));
      border-color: var(--sx-border-strong, #93c6ff);
    }

    .balance__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--sx-radius-pill, 999px);
      background: var(--sx-sky, #eaf3ff);
      color: var(--sx-blue-deep, #0a4fbf);
      border: 1px solid var(--sx-border, #c9e0ff);
      flex-shrink: 0;
    }

    .balance__icon {
      color: var(--sx-blue-deep, #0a4fbf);
    }

    .balance__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 80px;
    }

    .balance__label {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--sx-text-muted, #4c6c9a);
      font-weight: var(--sx-weight-bold, 700);
      line-height: 1.2;
    }

    .balance__amount-row {
      display: flex;
      align-items: baseline;
      min-height: 1.6rem;
    }

    .balance__amount {
      font-size: 1.35rem;
      font-weight: var(--sx-weight-black, 800);
      color: var(--sx-blue-deep, #0a4fbf);
      line-height: 1.2;
      font-variant-numeric: tabular-nums;
    }

    .balance__skeleton {
      width: 70px;
      height: 20px;
      border-radius: var(--sx-radius-pill, 999px);
      background: linear-gradient(
        90deg,
        var(--sx-blue-50, #f5f9ff) 25%,
        var(--sx-blue-200, #c9e0ff) 50%,
        var(--sx-blue-50, #f5f9ff) 75%
      );
      background-size: 200% 100%;
      animation: balance-shimmer 1.4s infinite;
    }

    @keyframes balance-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class StoreBalanceComponent {
  @Input({ required: true }) credits!: number;
  @Input() isLoading = false;
}
