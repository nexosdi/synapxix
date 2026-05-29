import { Component, computed, input, output, signal } from '@angular/core';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import {
  FillInTheBlanksInteractiveContent,
  toFillInTheBlanksGameModel,
} from './fill-in-the-blanks-game.model';

@Component({
  selector: 'lib-fill-in-the-blanks-game',
  standalone: true,
  template: `
    @if (viewModel(); as view) {
    <section
      class="relative mx-auto flex max-w-3xl flex-col gap-8 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-[0_25px_60px_rgba(27,149,251,0.15)]"
    >
      @if (isFinished()) {
        <div class="absolute inset-0 z-20 flex items-center justify-center rounded-[3rem] bg-white/80 backdrop-blur-sm animate-in fade-in duration-500">
          <div class="flex flex-col items-center gap-4 rounded-[2.5rem] bg-yellow-300 px-12 py-8 shadow-xl border-b-8 border-yellow-500 scale-110 animate-in zoom-in">
            <h3 class="text-4xl font-black text-[#1b95fb]">WELL DONE! 🚀</h3>
          </div>
        </div>
      }

      <header class="space-y-4 text-center">
        <div class="inline-block px-6 py-2 rounded-full bg-[#1b95fb]/10 text-[#1b95fb] text-xs font-black uppercase tracking-[0.2em]">
          Mission: Word Finder
        </div>
        
        <h2 class="text-balance text-4xl font-black text-slate-800 leading-tight">
          Complete the sentence
        </h2>

        <p class="rounded-[2rem] border-4 border-dashed border-[#1b95fb]/30 bg-slate-50 px-8 py-6 text-2xl font-bold text-slate-800 shadow-inner">
          {{ view.sentence }}
        </p>
      </header>

      <div class="space-y-6">
        @for (blank of view.blanks; track blank.index) {
        <div
          class="rounded-[2rem] border-b-4 border-l-2 border-r-2 border-slate-100 bg-white px-6 py-6 shadow-lg transition-all"
          [class.opacity-50]="isCorrect(blank.index)"
        >
          <p class="mb-4 text-sm font-black text-[#1b95fb] uppercase tracking-widest">
            Blank #{{ blank.index + 1 }}
          </p>
          
          <div class="flex flex-wrap gap-3">
            @for (choice of blank.choices; track choice.label) {
            <button
              (click)="onChoiceClick(blank.index, choice)"
              [disabled]="isCorrect(blank.index)"
              class="relative inline-flex items-center rounded-2xl border-b-4 border-l-2 border-r-2 border-slate-200 bg-white px-6 py-3 text-lg font-black text-slate-700 transition-all active:translate-y-1 active:border-b-0"
              [class.!bg-[#1b95fb]]="getSelectedChoice(blank.index) === choice.label && choice.isCorrect"
              [class.!text-white]="getSelectedChoice(blank.index) === choice.label && choice.isCorrect"
              [class.!border-[#1b95fb]]="getSelectedChoice(blank.index) === choice.label && choice.isCorrect"
              [class.animate-bounce]="getSelectedChoice(blank.index) === choice.label && choice.isCorrect"
              [class.!bg-red-100]="getSelectedChoice(blank.index) === choice.label && !choice.isCorrect"
              [class.!text-red-500]="getSelectedChoice(blank.index) === choice.label && !choice.isCorrect"
              [class.!border-red-300]="getSelectedChoice(blank.index) === choice.label && !choice.isCorrect"
            >
              {{ choice.label }}
              
              @if (getSelectedChoice(blank.index) === choice.label && choice.isCorrect) {
                <span class="ml-2">⭐</span>
              }
              @if (getSelectedChoice(blank.index) === choice.label && !choice.isCorrect) {
                <span class="ml-2 text-sm">❌</span>
              }
            </button>
            }
          </div>
        </div>
        }
      </div>

      <footer class="text-center pt-4 border-t-2 border-slate-50">
        <p class="text-slate-300 font-bold text-[10px] uppercase tracking-[0.3em]">
          Synapxix Educational Engine
        </p>
      </footer>
    </section>
    }
  `
})
export class FillInTheBlanksGameComponent implements BaseGameComponent {
  
  readonly content = input.required<FillInTheBlanksInteractiveContent>();
  readonly disabled = input<boolean>(false);
  readonly viewModel = computed(() => toFillInTheBlanksGameModel(this.content()));
  
  readonly answerSubmitted = output<AnyGameResult>();
  
  readonly selections = signal<Map<number, string>>(new Map());
  readonly isFinished = signal(false);

  onChoiceClick(blankIndex: number, choice: any) {
    if (this.disabled() || this.isCorrect(blankIndex)) return;

    this.selections.update(prev => {
      const newMap = new Map(prev);
      newMap.set(blankIndex, choice.label);
      return newMap;
    });

    this.checkVictory();
  }

  getSelectedChoice(index: number): string | undefined {
    return this.selections().get(index);
  }

  isCorrect(index: number): boolean {
    const selected = this.getSelectedChoice(index);
    if (!selected) return false;
    
    const blank = this.viewModel().blanks.find(b => b.index === index);
    const choice = blank?.choices.find(c => c.label === selected);
    return !!choice?.isCorrect;
  }

  private checkVictory() {
    const allBlanks = this.viewModel().blanks;
    const correctCount = allBlanks.filter(b => this.isCorrect(b.index)).length;

    if (correctCount === allBlanks.length) {
      this.isFinished.set(true);
      
      const answerRecord: Record<string, string> = {};
      for (const [key, value] of this.selections().entries()) {
        answerRecord[key.toString()] = value;
      }

      this.answerSubmitted.emit({
        gameType: 'fill-in-the-blanks',
        answer: { blanks: answerRecord },
        isCorrect: true, // Full victory reached
        score: correctCount * 10,
        timeSpentMs: 0
      });
    }
  }
}