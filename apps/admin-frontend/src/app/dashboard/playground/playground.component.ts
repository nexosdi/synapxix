import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningApiService } from '../../core/services/learning-api.service';

export interface Category {
  id: string;
  name: string;
  icon: string;
  bgColorClass: string;
}

export interface Difficulty {
  id: string;
  name: string;
  stars: number;
  baseClass: string;
  shadowClass: string;
  ageText: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent {
  @Input() categories: Category[] = [];
  @Input() difficulties: Difficulty[] = [];

  selectedCategory: string | null = null;
  selectedDifficulty: string | null = null;
  isSubmitting = false;

  constructor(private learningApi: LearningApiService) {}

  selectCategory(id: string) {
    if (this.isSubmitting) return;
    this.selectedCategory = this.selectedCategory === id ? null : id;
  }

  selectDifficulty(id: string) {
    if (this.isSubmitting) return;
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
    if (this.isReady && !this.isSubmitting) {
      this.isSubmitting = true;
      
      this.learningApi.registerGameSelection(this.selectedCategory!, this.selectedDifficulty!)
        .subscribe({
          next: () => {
            console.log('¡Conexión con la API exitosa!');
            this.isSubmitting = false;
            alert('¡Selección registrada con éxito en Synapsis!');
          },
          error: (err) => {
            console.error('Error al registrar:', err);
            this.isSubmitting = false;
            alert('No se pudo registrar la selección. Verifica la consola.');
          }
        });
    }
  }
}
