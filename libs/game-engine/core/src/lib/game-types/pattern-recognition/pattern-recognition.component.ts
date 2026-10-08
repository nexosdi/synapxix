import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import {
  PatternRecognitionInteractiveContent,
  PatternRecognitionOption,
  toPatternRecognitionModel,
} from './pattern-recognition.model';

@Component({
  selector: 'lib-pattern-recognition-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel(); as view) {
    <section class="relative mx-auto flex max-w-5xl flex-col gap-10 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-12 shadow-2xl overflow-hidden">

      @if (feedbackState() !== 'idle') {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div [class]="feedbackConfig().class" class="flex flex-col items-center gap-6 rounded-[4rem] px-16 py-12 shadow-2xl border-b-[12px] animate-in zoom-in">
            <span class="text-8xl">{{ feedbackConfig().icon }}</span>
            <h3 class="text-4xl font-black text-white italic uppercase tracking-tighter">{{ feedbackConfig().title }}</h3>
          </div>
        </div>
      }

      <header class="text-center space-y-2">
        <h2 class="text-3xl font-bold text-slate-500 uppercase tracking-widest">{{ view.prompt }}</h2>
      </header>

      <!-- Pattern sequence -->
      <div class="flex flex-wrap justify-center items-center gap-4">
        @for (item of view.sequence; track $index) {
          <div
            class="flex h-24 w-24 items-center justify-center rounded-[2rem] text-5xl shadow-md border-b-[6px]"
            [ngClass]="item === '?' 
              ? 'bg-amber-100 border-amber-300 animate-pulse text-amber-400 font-black text-4xl' 
              : 'bg-slate-50 border-slate-200'"
          >
            {{ item === '?' ? '?' : item }}
          </div>
          @if (!$last) {
            <span class="text-3xl text-slate-300 font-light">→</span>
          }
        }
      </div>

      <!-- Options -->
      <div class="flex flex-wrap justify-center gap-6">
        @for (option of view.options; track option.id) {
          <button
            class="flex h-24 w-24 items-center justify-center rounded-[2rem] text-5xl shadow-lg border-b-[6px] transition-all hover:scale-110 active:translate-y-1 active:border-b-0"
            [ngClass]="selectedOptionId() === option.id
              ? 'bg-violet-500 border-violet-700 scale-110'
              : 'bg-white border-slate-200 hover:border-violet-300'"
            (click)="selectOption(option)"
            [disabled]="disabled() || isProcessing()"
          >
            {{ option.content }}
          </button>
        }
      </div>

      <!-- Submit -->
      <div class="flex justify-center">
        <button
          (click)="submitAnswer()"
          [disabled]="disabled() || isProcessing() || !selectedOptionId()"
          class="px-12 py-5 rounded-full bg-violet-500 border-b-[8px] border-violet-700 text-white text-2xl font-black shadow-xl transition-all hover:scale-105 active:translate-y-2 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:translate-y-0 disabled:active:border-b-[8px]"
        >
          CONFIRMAR
        </button>
      </div>

    </section>
    }
  `,
})
export class PatternRecognitionGameComponent implements BaseGameComponent {
  readonly answerSubmitted = output<AnyGameResult>();
  readonly firstInteraction = output<void>();
  readonly content = input.required<PatternRecognitionInteractiveContent>();
  readonly disabled = input<boolean>(false);

  readonly viewModel = computed(() => toPatternRecognitionModel(this.content()));

  selectedOptionId = signal<string | null>(null);
  isProcessing = signal(false);
  startTime = signal(0);
  hasInteracted = signal(false);

  feedbackState = signal<'idle' | 'success' | 'error'>('idle');

  readonly feedbackConfig = computed(() => ({
    success: { title: '¡PATRÓN DESCIFRADO!', icon: '🧩', class: 'bg-emerald-500 border-emerald-700' },
    error: { title: '¡PATRÓN INCORRECTO!', icon: '🔄', class: 'bg-rose-500 border-rose-700' },
  }[this.feedbackState() as 'success' | 'error'] || { title: '', icon: '', class: '' }));

  constructor() {
    effect(() => {
      const view = this.viewModel();
      if (view) {
        this.startTime.set(Date.now());
        this.selectedOptionId.set(null);
        this.hasInteracted.set(false);
        this.feedbackState.set('idle');
        this.isProcessing.set(false);
      }
    }, { allowSignalWrites: true });
  }

  selectOption(option: PatternRecognitionOption) {
    if (this.disabled() || this.isProcessing()) return;

    if (!this.hasInteracted()) {
      this.hasInteracted.set(true);
      this.firstInteraction.emit();
    }

    this.selectedOptionId.set(option.id);
  }

  submitAnswer() {
    const selected = this.selectedOptionId();
    if (this.disabled() || this.isProcessing() || !selected) return;

    this.isProcessing.set(true);

    const view = this.viewModel();
    const option = view.options.find(o => o.id === selected);
    const isCorrect = option?.isCorrect ?? false;
    const score = isCorrect ? 100 : 0;

    this.feedbackState.set(isCorrect ? 'success' : 'error');

    setTimeout(() => {
      this.answerSubmitted.emit({
        gameType: 'pattern-recognition',
        answer: { selectedOptionId: selected },
        isCorrect,
        score,
        timeSpentMs: Date.now() - this.startTime(),
      });
    }, 1500);
  }
}
