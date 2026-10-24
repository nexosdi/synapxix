import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CognitiveElement } from '../models/CognitiveElement.model';

@Component({
  selector: 'app-cognitive-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="card"
      role="button"
      tabindex="0"
      [class.card--selected]="isSelected"
      [style.--accent]="element.color || '#1e90ff'" 
      (click)="selected.emit(element)"
      (keydown.enter)="selected.emit(element)"
    >
      <div class="card__header">
        <span class="card__name">{{ element.name }}</span>
        <span class="card__score" [style.color]="element.color">
          {{ element.current_score }}%
        </span>
      </div>

      <div class="card__bar-track">
        <div
          class="card__bar-fill"
          [style.width.%]="element.current_score"
          [style.background-color]="element.color"
        ></div>
      </div>

      <p class="card__hint">Ver histórico de {{ element.name }}</p>
    </div>
  `,
  styles: [`
    .card {
      background: var(--sx-surface);
      padding: 1.5rem;
      border-radius: var(--sx-radius-lg);
      box-shadow: var(--sx-shadow-sm);
      cursor: pointer;
      border: 1.5px solid var(--sx-border);
      transition: all var(--sx-transition);
      outline: none;
    }
    .card:hover, .card:focus {
      box-shadow: var(--sx-shadow-md);
      transform: translateY(-2px);
      border-color: var(--sx-border-strong);
    }
    .card--selected { border-color: var(--accent); background: var(--sx-blue-50); }
    .card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .card__name { font-weight: var(--sx-weight-medium); color: var(--sx-blue-deep); }
    .card__score { font-weight: var(--sx-weight-black); font-size: 1.2rem; }
    .card__bar-track {
      background: var(--sx-blue-50);
      border-radius: var(--sx-radius-pill);
      height: 12px;
      overflow: hidden;
    }
    .card__bar-fill { height: 100%; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
    .card__hint { font-size: 0.75rem; color: var(--sx-text-muted); margin-top: 10px; margin-bottom: 0; }
  `],
})
export class CognitiveCardComponent {
  @Input({ required: true }) element!: CognitiveElement;
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<CognitiveElement>();
}