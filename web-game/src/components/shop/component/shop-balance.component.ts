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
    <div class="balance" role="status" aria-live="polite" aria-label="Saldo actual">
      <span class="balance__icon" aria-hidden="true">🪙</span>
      <div class="balance__info">
        <span class="balance__label">Monedas</span>
        <span class="balance__amount" [class.balance__amount--loading]="isLoading">
          {{ isLoading ? '—' : (credits | number) }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .balance {
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
      padding: 10px 18px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 1px solid #c9e0ff;
    }
    .balance__icon { font-size: 1.5rem; }
    .balance__info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .balance__label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8fb8e0;
      font-weight: 600;
    }
    .balance__amount {
      font-size: 1.2rem;
      font-weight: 800;
      color: #0a4fbf;
      transition: color 0.3s;
    }
    .balance__amount--loading { color: #c9e0ff; }
  `],
})
export class StoreBalanceComponent {
  @Input({ required: true }) credits!: number;
  @Input() isLoading = false;
}