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
      [style.--accent]="element.color || '#3b82f6'" 
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
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease; /* Simplificado para incluir el focus */
      outline: none;
    }
    .card:hover, .card:focus { 
      box-shadow: 0 8px 16px rgba(0,0,0,0.1); 
      transform: translateY(-2px); /* Un toque extra de UX */
    }
    .card:focus { border-color: #cbd5e1; }
    .card--selected { border-color: var(--accent); background: #f8fafc; }
    .card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .card__name { font-weight: 600; color: #334155; }
    .card__score { font-weight: 800; font-size: 1.2rem; }
    .card__bar-track {
      background: #f1f5f9;
      border-radius: 99px;
      height: 12px;
      overflow: hidden;
    }
    .card__bar-fill { height: 100%; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
    .card__hint { font-size: 0.75rem; color: #94a3b8; margin-top: 10px; margin-bottom: 0; }
  `],
})
export class CognitiveCardComponent {
  @Input({ required: true }) element!: CognitiveElement;
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<CognitiveElement>();
}