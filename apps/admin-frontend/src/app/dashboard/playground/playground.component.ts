import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  id: string;
  name: string;
  icon: string;
  bgColorClass: string;
}

interface Difficulty {
  id: string;
  name: string;
  stars: number;
  baseClass: string;
  shadowClass: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent {
  categories: Category[] = [
    { id: 'animales', name: 'Animales', icon: '🐶', bgColorClass: 'bg-secondary-container' },
    { id: 'colores', name: 'Colores', icon: '🎨', bgColorClass: 'bg-tertiary-container' },
    { id: 'numeros', name: 'Números', icon: '🔢', bgColorClass: 'bg-primary-container' },
    { id: 'letras', name: 'Letras', icon: '🔠', bgColorClass: 'bg-error-container' }
  ];

  selectedCategory: string | null = null;

  difficulties: Difficulty[] = [
    { id: 'facil', name: 'Fácil', stars: 1, baseClass: 'bg-tertiary', shadowClass: 'shadow-tertiary' },
    { id: 'medio', name: 'Medio', stars: 2, baseClass: 'bg-secondary', shadowClass: 'shadow-secondary' },
    { id: 'dificil', name: 'Difícil', stars: 3, baseClass: 'bg-error', shadowClass: 'shadow-error' }
  ];

  selectedDifficulty: string | null = null;

  selectCategory(id: string) {
    this.selectedCategory = this.selectedCategory === id ? null : id;
  }

  selectDifficulty(id: string) {
    this.selectedDifficulty = this.selectedDifficulty === id ? null : id;
  }

  get isReady(): boolean {
    return !!this.selectedCategory && !!this.selectedDifficulty;
  }

  get selectedCategoryName(): string {
    return this.categories.find(c => c.id === this.selectedCategory)?.name || '';
  }

  get selectedDifficultyName(): string {
    return this.difficulties.find(d => d.id === this.selectedDifficulty)?.name || '';
  }

  get categoryIcon(): string | null {
    if (!this.selectedCategory) return null;
    return this.categories.find(c => c.id === this.selectedCategory)?.icon || null;
  }

  get difficultyIconState() {
    switch(this.selectedDifficulty) {
      case 'facil': return { color: 'var(--sys-tertiary)' };
      case 'medio': return { color: 'var(--sys-secondary)' };
      case 'dificil': return { color: 'var(--sys-error)' };
      default: return { rotation: '0deg', color: 'var(--sys-secondary)' };
    }
  }

  startGame() {
    if (this.isReady) {
      console.log(`Starting game: ${this.selectedCategoryName} - ${this.selectedDifficultyName}`);
    }
  }
}
