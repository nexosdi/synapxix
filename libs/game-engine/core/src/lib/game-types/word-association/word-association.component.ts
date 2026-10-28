import { Component, computed, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import { WordAssociationInteractiveContent, toWordAssociationModel } from './word-association.model';

@Component({
  selector: 'lib-word-association-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel(); as view) {
    <section class="relative mx-auto flex max-w-5xl flex-col gap-10 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-12 shadow-2xl overflow-hidden">
      
      @if (feedbackState() !== 'idle') {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div [class]="feedbackConfig().class" class="flex flex-col items-center gap-6 rounded-[4rem] px-16 py-12 shadow-2xl border-b-[12px] animate-in zoom-in bounce-in">
            <span class="text-8xl">{{ feedbackConfig().icon }}</span>
            <h3 class="text-4xl font-black text-white italic uppercase tracking-tighter">{{ feedbackConfig().title }}</h3>
          </div>
        </div>
      }

      <header class="text-center space-y-4">
        <h2 class="text-3xl font-bold text-slate-500 uppercase tracking-widest">{{ view.prompt }}</h2>
        <div class="text-6xl font-black text-slate-800 tracking-tighter uppercase">{{ view.baseWord }}</div>
      </header>

      <div class="bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 p-10 min-h-[300px] flex flex-wrap justify-center content-center gap-6">
        @for (option of view.options; track option.id) {
          <button 
            class="px-8 py-4 rounded-full border-b-[6px] text-2xl font-bold transition-all hover:scale-105 active:translate-y-2 active:border-b-0 shadow-lg"
            [ngClass]="isSelected(option.id) 
              ? 'bg-sky-500 border-sky-700 text-white hover:bg-sky-600' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
            (click)="toggleSelection(option.id)"
            [disabled]="disabled() || isProcessing()"
          >
            {{ option.word }}
          </button>
        }
      </div>

      <div class="flex justify-center">
        <button 
          (click)="submitSelection()"
          [disabled]="disabled() || isProcessing() || selectedOptionIds().length === 0"
          class="px-12 py-5 rounded-full bg-brand-500 border-b-[8px] border-brand-700 text-white text-2xl font-black shadow-xl transition-all hover:scale-105 active:translate-y-2 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:translate-y-0 disabled:active:border-b-[8px]"
        >
          CONFIRMAR
        </button>
      </div>

    </section>
    }
  `
})
export class WordAssociationGameComponent implements BaseGameComponent {
  readonly answerSubmitted = output<AnyGameResult>();
  readonly firstInteraction = output<void>();
  readonly content = input.required<WordAssociationInteractiveContent>();
  readonly disabled = input<boolean>(false);
  
  readonly viewModel = computed(() => toWordAssociationModel(this.content()));

  selectedOptionIds = signal<string[]>([]);
  isProcessing = signal(false);
  startTime = signal(0);
  hasInteracted = signal(false);
  
  feedbackState = signal<'idle' | 'success' | 'error'>('idle');

  readonly feedbackConfig = computed(() => ({
    success: { title: '¡ASOCIACIÓN PERFECTA!', icon: '🔗', class: 'bg-emerald-500 border-emerald-700' },
    error: { title: 'HAY PALABRAS QUE NO ENCAJAN', icon: '🤔', class: 'bg-brand-500 border-brand-700' }
  }[this.feedbackState() as 'success' | 'error'] || { title: '', icon: '', class: '' }));

  constructor() {
    effect(() => {
      const view = this.viewModel();
      if (view) {
        this.startTime.set(Date.now());
        this.selectedOptionIds.set([]);
        this.hasInteracted.set(false);
      }
    }, { allowSignalWrites: true });
  }

  isSelected(id: string): boolean {
    return this.selectedOptionIds().includes(id);
  }

  toggleSelection(id: string) {
    if (this.disabled() || this.isProcessing()) return;

    if (!this.hasInteracted()) {
      this.hasInteracted.set(true);
      this.firstInteraction.emit();
    }

    this.selectedOptionIds.update(ids => 
      ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
    );
  }

  submitSelection() {
    if (this.disabled() || this.isProcessing() || this.selectedOptionIds().length === 0) return;

    this.isProcessing.set(true);
    const view = this.viewModel();
    const selected = this.selectedOptionIds();
    
    // Evaluate answer
    const correctIds = view.options.filter(o => o.isRelated).map(o => o.id);
    const selectedCorrectly = selected.filter(id => correctIds.includes(id));
    const selectedIncorrectly = selected.filter(id => !correctIds.includes(id));
    
    // Penalize incorrect selections heavily, reward correct ones.
    const scoreBase = (selectedCorrectly.length / correctIds.length) * 100;
    const penalty = (selectedIncorrectly.length / view.options.length) * 100;
    let score = Math.max(0, Math.round(scoreBase - penalty));
    
    // It's completely correct if they got all related words and no unrelated words
    const isPerfect = selectedCorrectly.length === correctIds.length && selectedIncorrectly.length === 0;
    if (isPerfect) {
      score = 100;
    }

    if (score >= 70) {
      this.feedbackState.set('success');
    } else {
      this.feedbackState.set('error');
    }

    setTimeout(() => {
      this.answerSubmitted.emit({
        gameType: 'word-association',
        answer: {
          selectedOptionIds: selected
        },
        isCorrect: score >= 70, // We consider it "correct" if score is passing (>=70)
        score,
        timeSpentMs: Date.now() - this.startTime()
      });
    }, 1500);
  }
}
