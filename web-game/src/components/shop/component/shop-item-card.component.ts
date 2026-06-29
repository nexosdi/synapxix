import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreItemViewModel } from '../models/store-item.model';

@Component({
  selector: 'app-store-item-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="item-card" [class.item-card--owned]="item.status === 'owned'">

      <div class="item-card__preview-wrapper">
        <img
          class="item-card__preview"
          [src]="item.preview_url"
          [alt]="item.name"
          loading="lazy"
        />
        <span class="item-card__type-badge">{{ item.type | titlecase }}</span>

        <div *ngIf="item.status === 'owned'" class="item-card__owned-overlay">
          <span class="item-card__owned-icon">✓</span>
          <span>En tu inventario</span>
        </div>
      </div>

      <div class="item-card__body">
        <h3 class="item-card__name">{{ item.name }}</h3>
        <p class="item-card__description">{{ item.description }}</p>
      </div>

      <div class="item-card__footer">
        <span
          class="item-card__price"
          [class.item-card__price--unaffordable]="item.status === 'insufficient_funds'"
        >
          🪙 {{ item.price }}
        </span>

        <button
          class="item-card__btn"
          [class.item-card__btn--owned]="item.status === 'owned'"
          [class.item-card__btn--disabled]="item.status === 'insufficient_funds' || isLoading"
          [disabled]="item.status === 'owned' || item.status === 'insufficient_funds' || isLoading"
          (click)="onPurchase()"
          [attr.aria-label]="'Comprar ' + item.name"
        >
          <span *ngIf="!isLoading">
            {{ item.status === 'owned' ? 'Obtenido' : 'Comprar' }}
          </span>
          <span *ngIf="isLoading" class="item-card__spinner" aria-hidden="true"></span>
        </button>
      </div>

      <p *ngIf="errorMessage" class="item-card__error" role="alert">
        {{ errorMessage }}
      </p>
    </article>
  `,
  styles: [`
    .item-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border: 2px solid transparent;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .item-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .item-card--owned {
      border-color: #22c55e;
      background: #f0fdf4;
    }

    /* Preview */
    .item-card__preview-wrapper {
      position: relative;
      background: #f1f5f9;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .item-card__preview {
      max-height: 110px;
      max-width: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
    .item-card__type-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #1e293b;
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 8px;
      border-radius: 99px;
    }
    .item-card__owned-overlay {
      position: absolute;
      inset: 0;
      background: rgba(34, 197, 94, 0.15);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #16a34a;
    }
    .item-card__owned-icon {
      font-size: 1.5rem;
      background: #22c55e;
      color: white;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Body */
    .item-card__body {
      padding: 1rem 1rem 0.5rem;
      flex: 1;
    }
    .item-card__name {
      margin: 0 0 4px;
      font-size: 0.95rem;
      font-weight: 700;
      color: #1e293b;
    }
    .item-card__description {
      margin: 0;
      font-size: 0.78rem;
      color: #64748b;
      line-height: 1.4;
    }

    /* Footer */
    .item-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem 1rem;
      gap: 8px;
    }
    .item-card__price {
      font-size: 0.9rem;
      font-weight: 700;
      color: #1e293b;
    }
    .item-card__price--unaffordable {
      color: #dc2626;
    }
    .item-card__btn {
      background: #3f51b5;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      min-width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .item-card__btn:hover:not(:disabled) { background: #303f9f; }
    .item-card__btn--owned {
      background: #22c55e;
      cursor: default;
    }
    .item-card__btn--disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }

    /* Spinner */
    .item-card__spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Error */
    .item-card__error {
      margin: 0;
      padding: 6px 1rem 10px;
      font-size: 0.72rem;
      color: #dc2626;
      font-weight: 500;
    }
  `],
})
export class StoreItemCardComponent {
  @Input({ required: true }) item!: StoreItemViewModel;
  @Input() isLoading = false;
  @Input() errorMessage: string | null = null;

  @Output() purchase = new EventEmitter<string>();

  onPurchase(): void {
    if (this.item.status === 'available') {
      this.purchase.emit(this.item.store_item_id);
    }
  }
}