import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreItemViewModel } from '../models/store-item.model';

@Component({
  selector: 'app-store-item-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="item-card"
      [class.item-card--owned]="item.status === 'owned'"
      [class.item-card--insufficient]="item.status === 'insufficient_funds'"
    >
      <!-- Preview Wrapper -->
      <div class="item-card__preview-wrapper">
        <span class="item-card__type-badge">
          {{ item.type | titlecase }}
        </span>

        <!-- Fallback visual si preview_url no existe o falla la carga -->
        <ng-container *ngIf="showFallback(); else realImage">
          <!-- Fallback para Avatares -->
          <div
            *ngIf="item.type === 'avatar'"
            class="item-card__avatar-fallback"
            aria-hidden="true"
          >
            <svg viewBox="0 0 80 80" width="68" height="68" fill="none">
              <circle cx="40" cy="40" r="38" fill="var(--sx-sky, #eaf3ff)" stroke="var(--sx-border, #c9e0ff)" stroke-width="2"/>
              <circle cx="40" cy="30" r="13" fill="var(--sx-blue-200, #c9e0ff)" stroke="var(--sx-blue, #1e90ff)" stroke-width="2.5"/>
              <path d="M19 62c0-11.6 9.4-21 21-21s21 9.4 21 21" fill="var(--sx-blue-100, #eaf3ff)" stroke="var(--sx-blue-deep, #0a4fbf)" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- Fallback para Banners u otros -->
          <div
            *ngIf="item.type !== 'avatar'"
            class="item-card__banner-fallback"
            aria-hidden="true"
          >
            <svg viewBox="0 0 280 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" fill="none">
              <defs>
                <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0a4fbf"/>
                  <stop offset="55%" stop-color="#1e90ff"/>
                  <stop offset="100%" stop-color="#52a8ff"/>
                </linearGradient>
              </defs>
              <rect width="280" height="120" fill="url(#bannerGradient)"/>
              <circle cx="240" cy="25" r="45" fill="#ffffff" fill-opacity="0.12"/>
              <circle cx="40" cy="95" r="40" fill="#ffffff" fill-opacity="0.08"/>
              <path d="M0 85 Q 70 55, 140 85 T 280 85 L 280 120 L 0 120 Z" fill="#ffffff" fill-opacity="0.15"/>
            </svg>
          </div>
        </ng-container>

        <!-- Imagen real cuando preview_url es válida -->
        <ng-template #realImage>
          <img
            class="item-card__preview"
            [class.item-card__preview--banner]="item.type === 'banner'"
            [src]="item.preview_url"
            [alt]="item.name"
            (error)="onImageError()"
            loading="lazy"
          />
        </ng-template>

        <!-- Badge de estado En Inventario -->
        <div *ngIf="item.status === 'owned'" class="item-card__owned-badge">
          <svg class="item-card__check-icon" viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>En inventario</span>
        </div>
      </div>

      <!-- Body -->
      <div class="item-card__body">
        <h3 class="item-card__name">{{ item.name }}</h3>
        <p class="item-card__description">
          {{ item.description || defaultDescription() }}
        </p>
      </div>

      <!-- Footer -->
      <div class="item-card__footer">
        <div class="item-card__price-wrapper">
          <span class="item-card__price-label">Precio</span>
          <div
            class="item-card__price"
            [class.item-card__price--insufficient]="item.status === 'insufficient_funds'"
            [class.item-card__price--owned]="item.status === 'owned'"
          >
            <!-- Icono SVG sobrio de moneda (sin emojis) -->
            <svg
              class="item-card__coin-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 7v10M9.5 10h5" stroke-linecap="round"/>
            </svg>
            <span class="item-card__price-number">{{ item.price | number }}</span>
            <span class="item-card__price-unit">monedas</span>
          </div>
        </div>

        <button
          type="button"
          class="item-card__btn"
          [class.item-card__btn--available]="item.status === 'available'"
          [class.item-card__btn--owned]="item.status === 'owned'"
          [class.item-card__btn--disabled]="item.status === 'insufficient_funds' || isLoading"
          [disabled]="item.status === 'owned' || item.status === 'insufficient_funds' || isLoading"
          (click)="onPurchase()"
          [attr.aria-label]="
            item.status === 'owned'
              ? item.name + ' ya está en tu inventario'
              : item.status === 'insufficient_funds'
                ? 'Saldo insuficiente para comprar ' + item.name
                : 'Comprar ' + item.name + ' por ' + item.price + ' monedas'
          "
        >
          <span *ngIf="!isLoading">
            {{
              item.status === 'owned'
                ? 'Obtenido'
                : item.status === 'insufficient_funds'
                  ? 'Sin monedas'
                  : 'Comprar'
            }}
          </span>
          <span
            *ngIf="isLoading"
            class="item-card__spinner"
            aria-hidden="true"
          ></span>
        </button>
      </div>

      <!-- Error feedback -->
      <div *ngIf="errorMessage" class="item-card__error" role="alert">
        <svg class="item-card__error-icon" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
    </article>
  `,
  styles: [`
    .item-card {
      background: var(--sx-surface, #ffffff);
      border-radius: var(--sx-radius-lg, 22px);
      box-shadow: var(--sx-shadow-sm, 0 2px 6px rgba(10, 79, 191, 0.08));
      border: 1.5px solid var(--sx-border, #c9e0ff);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform var(--sx-transition, 180ms ease),
                  box-shadow var(--sx-transition, 180ms ease),
                  border-color var(--sx-transition, 180ms ease);
      position: relative;
    }

    .item-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--sx-shadow-md, 0 6px 18px rgba(10, 79, 191, 0.12));
      border-color: var(--sx-border-strong, #93c6ff);
    }

    .item-card--owned {
      border-color: var(--sx-border, #c9e0ff);
    }

    /* Preview area */
    .item-card__preview-wrapper {
      position: relative;
      background: linear-gradient(
        180deg,
        var(--sx-blue-50, #f5f9ff) 0%,
        var(--sx-sky, #eaf3ff) 100%
      );
      height: 156px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0.75rem;
      border-bottom: 1px solid var(--sx-border, #c9e0ff);
    }

    .item-card__preview {
      max-height: 120px;
      max-width: 90%;
      object-fit: contain;
      border-radius: var(--sx-radius-md, 14px);
      transition: transform var(--sx-transition, 180ms ease);
    }

    .item-card__preview--banner {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--sx-radius-sm, 8px);
    }

    .item-card:hover .item-card__preview {
      transform: scale(1.04);
    }

    /* Fallback visuals */
    .item-card__avatar-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      transition: transform var(--sx-transition, 180ms ease);
    }

    .item-card:hover .item-card__avatar-fallback {
      transform: scale(1.06);
    }

    .item-card__banner-fallback {
      width: 100%;
      height: 100%;
      border-radius: var(--sx-radius-sm, 8px);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--sx-transition, 180ms ease);
    }

    .item-card:hover .item-card__banner-fallback {
      transform: scale(1.03);
    }

    /* Type badge */
    .item-card__type-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: var(--sx-surface, #ffffff);
      color: var(--sx-blue-deep, #0a4fbf);
      border: 1px solid var(--sx-border, #c9e0ff);
      box-shadow: var(--sx-shadow-sm, 0 2px 6px rgba(10, 79, 191, 0.08));
      font-size: 0.68rem;
      font-weight: var(--sx-weight-bold, 700);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 10px;
      border-radius: var(--sx-radius-pill, 999px);
      z-index: 1;
    }

    /* Owned status badge on preview */
    .item-card__owned-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--sx-success-soft, #e3f7ef);
      color: var(--sx-success, #1e9e6a);
      border: 1px solid var(--sx-success, #1e9e6a);
      font-size: 0.7rem;
      font-weight: var(--sx-weight-bold, 700);
      padding: 3px 9px;
      border-radius: var(--sx-radius-pill, 999px);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      z-index: 1;
    }

    .item-card__check-icon {
      flex-shrink: 0;
    }

    /* Card body */
    .item-card__body {
      padding: 1rem 1.25rem 0.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .item-card__name {
      margin: 0 0 6px;
      font-size: 1.05rem;
      font-weight: var(--sx-weight-bold, 700);
      color: var(--sx-blue-deep, #0a4fbf);
      line-height: 1.3;
    }

    .item-card__description {
      margin: 0;
      font-size: 0.84rem;
      color: var(--sx-text-muted, #4c6c9a);
      line-height: 1.45;
    }

    /* Footer */
    .item-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.25rem 1.15rem;
      gap: 12px;
      border-top: 1px solid var(--sx-border, #c9e0ff);
      background: var(--sx-surface, #ffffff);
    }

    .item-card__price-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .item-card__price-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--sx-text-muted, #4c6c9a);
      font-weight: var(--sx-weight-bold, 700);
    }

    .item-card__price {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 1.12rem;
      font-weight: var(--sx-weight-black, 800);
      color: var(--sx-blue-deep, #0a4fbf);
    }

    .item-card__price--insufficient {
      color: var(--sx-danger, #d64545);
    }

    .item-card__price--owned {
      color: var(--sx-text-muted, #4c6c9a);
    }

    .item-card__coin-icon {
      flex-shrink: 0;
      color: var(--sx-blue, #1e90ff);
    }

    .item-card__price--insufficient .item-card__coin-icon {
      color: var(--sx-danger, #d64545);
    }

    .item-card__price-number {
      font-variant-numeric: tabular-nums;
    }

    .item-card__price-unit {
      font-size: 0.72rem;
      font-weight: var(--sx-weight-bold, 700);
      color: var(--sx-text-muted, #4c6c9a);
      text-transform: lowercase;
    }

    /* Buttons */
    .item-card__btn {
      font-family: inherit;
      border: 1.5px solid transparent;
      padding: 8px 18px;
      border-radius: var(--sx-radius-pill, 999px);
      font-size: 0.85rem;
      font-weight: var(--sx-weight-bold, 700);
      cursor: pointer;
      min-width: 96px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all var(--sx-transition, 180ms ease);
    }

    /* Botón Comprar: primario de marca */
    .item-card__btn--available {
      background: var(--sx-blue, #1e90ff);
      color: var(--sx-text-on-blue, #ffffff);
      box-shadow: var(--sx-shadow-sm, 0 2px 6px rgba(10, 79, 191, 0.08));
    }

    .item-card__btn--available:hover {
      background: var(--sx-blue-deep, #0a4fbf);
      box-shadow: var(--sx-shadow-md, 0 6px 18px rgba(10, 79, 191, 0.12));
      transform: translateY(-1px);
    }

    /* Botón Ya obtenido */
    .item-card__btn--owned {
      background: var(--sx-success-soft, #e3f7ef);
      color: var(--sx-success, #1e9e6a);
      border-color: var(--sx-success, #1e9e6a);
      cursor: default;
      opacity: 0.95;
    }

    /* Botón Sin fondos */
    .item-card__btn--disabled {
      background: var(--sx-blue-50, #f5f9ff);
      color: var(--sx-text-muted, #4c6c9a);
      border-color: var(--sx-border, #c9e0ff);
      cursor: not-allowed;
      opacity: 0.85;
    }

    /* Spinner */
    .item-card__spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-top-color: var(--sx-white, #ffffff);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Mensaje de error */
    .item-card__error {
      margin: 0;
      padding: 8px 12px;
      background: var(--sx-danger-soft, #fdeaea);
      border-top: 1px solid var(--sx-danger, #d64545);
      font-size: 0.76rem;
      color: var(--sx-danger, #d64545);
      font-weight: var(--sx-weight-medium, 600);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .item-card__error-icon {
      flex-shrink: 0;
    }
  `],
})
export class StoreItemCardComponent {
  @Input({ required: true }) item!: StoreItemViewModel;
  @Input() isLoading = false;
  @Input() errorMessage: string | null = null;

  @Output() purchase = new EventEmitter<string>();

  readonly imageError = signal(false);

  showFallback(): boolean {
    return !this.item.preview_url || this.imageError();
  }

  onImageError(): void {
    this.imageError.set(true);
  }

  defaultDescription(): string {
    return this.item.type === 'banner'
      ? 'Banner exclusivo para personalizar tu perfil y destacarte.'
      : 'Avatar coleccionable para tu perfil de estudiante.';
  }

  onPurchase(): void {
    if (this.item.status === 'available') {
      this.purchase.emit(this.item.store_item_id);
    }
  }
}
