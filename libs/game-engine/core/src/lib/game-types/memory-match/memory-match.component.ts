import { Component, computed, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import { MemoryMatchInteractiveContent, toMemoryMatchModel, MemoryMatchCard } from './memory-match.model';

interface CardState extends MemoryMatchCard {
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'lib-memory-match-game',
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
        <h2 class="text-3xl font-black text-slate-800 italic uppercase">{{ view.prompt }}</h2>
        <div class="flex items-center justify-center gap-8 text-lg font-bold text-slate-500">
          <div>Attempts: <span class="text-sky-600">{{ attempts() }}</span></div>
          <div>Matches: <span class="text-emerald-500">{{ matchedPairs().length }} / {{ totalPairs() }}</span></div>
        </div>
      </header>

      <div class="bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 p-8 min-h-[400px]">
        <div 
          class="grid gap-4 mx-auto" 
          [style.grid-template-columns]="'repeat(' + view.columns + ', minmax(0, 1fr))'"
          [style.max-width.px]="view.columns * 120 + (view.columns - 1) * 16"
        >
          @for (card of cards(); track card.id) {
            <button 
              class="relative w-full aspect-square preserve-3d transition-transform duration-500"
              [class.rotate-y-180]="card.isFlipped || card.isMatched"
              (click)="flipCard(card)"
              [disabled]="disabled() || card.isFlipped || card.isMatched || isProcessing()"
            >
              <!-- Front (hidden side) -->
              <div class="absolute inset-0 backface-hidden bg-white border-b-8 border-slate-200 rounded-2xl shadow-md flex items-center justify-center cursor-pointer hover:bg-slate-50">
                <span class="text-4xl text-slate-300">?</span>
              </div>
              
              <!-- Back (revealed side) -->
              <div 
                class="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-md flex items-center justify-center border-b-8"
                [ngClass]="card.isMatched ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-sky-200'"
              >
                @if (card.imageUrl) {
                  <img [src]="card.imageUrl" [alt]="card.label" class="w-2/3 h-2/3 object-contain" />
                } @else {
                  <span class="text-5xl font-black text-slate-700">{{ card.label }}</span>
                }
              </div>
            </button>
          }
        </div>
      </div>

    </section>
    }
  `,
  styles: [`
    .preserve-3d {
      transform-style: preserve-3d;
      perspective: 1000px;
    }
    .backface-hidden {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
  `]
})
export class MemoryMatchGameComponent implements BaseGameComponent {
  readonly answerSubmitted = output<AnyGameResult>();
  readonly firstInteraction = output<void>();
  readonly content = input.required<MemoryMatchInteractiveContent>();
  readonly disabled = input<boolean>(false);
  
  readonly viewModel = computed(() => toMemoryMatchModel(this.content()));

  cards = signal<CardState[]>([]);
  flippedCards = signal<CardState[]>([]);
  matchedPairs = signal<string[]>([]);
  attempts = signal(0);
  isProcessing = signal(false);
  totalPairs = signal(0);
  startTime = signal(0);
  hasInteracted = signal(false);
  
  feedbackState = signal<'idle' | 'success' | 'error'>('idle');

  readonly feedbackConfig = computed(() => ({
    success: { title: '¡EXCELENTE!', icon: '🌟', class: 'bg-emerald-500 border-emerald-700' },
    error: { title: '¡INTENTA DE NUEVO!', icon: '🧐', class: 'bg-brand-500 border-brand-700' }
  }[this.feedbackState() as 'success' | 'error'] || { title: '', icon: '', class: '' }));

  constructor() {
    effect(() => {
      const view = this.viewModel();
      if (view) {
        this.cards.set(view.cards.map(c => ({ ...c, isFlipped: false, isMatched: false })));
        const uniquePairs = new Set(view.cards.map(c => c.pairId));
        this.totalPairs.set(uniquePairs.size);
        this.startTime.set(Date.now());
        this.attempts.set(0);
        this.matchedPairs.set([]);
        this.flippedCards.set([]);
        this.hasInteracted.set(false);
      }
    }, { allowSignalWrites: true });
  }

  flipCard(card: CardState) {
    if (this.disabled() || this.isProcessing() || card.isFlipped || card.isMatched) return;

    if (!this.hasInteracted()) {
      this.hasInteracted.set(true);
      this.firstInteraction.emit();
    }

    // Flip the card visually
    this.cards.update(currentCards => 
      currentCards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c)
    );

    const currentlyFlipped = [...this.flippedCards(), card];
    this.flippedCards.set(currentlyFlipped);

    if (currentlyFlipped.length === 2) {
      this.isProcessing.set(true);
      this.attempts.update(a => a + 1);
      
      const [card1, card2] = currentlyFlipped;
      
      if (card1.pairId === card2.pairId) {
        // Match!
        setTimeout(() => {
          this.matchedPairs.update(pairs => [...pairs, card1.pairId]);
          this.cards.update(currentCards => 
            currentCards.map(c => 
              c.pairId === card1.pairId ? { ...c, isMatched: true, isFlipped: false } : c
            )
          );
          this.flippedCards.set([]);
          this.isProcessing.set(false);
          this.checkCompletion();
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => {
          this.cards.update(currentCards => 
            currentCards.map(c => 
              (c.id === card1.id || c.id === card2.id) ? { ...c, isFlipped: false } : c
            )
          );
          this.flippedCards.set([]);
          this.isProcessing.set(false);
        }, 1000);
      }
    }
  }

  private checkCompletion() {
    if (this.matchedPairs().length === this.totalPairs()) {
      this.feedbackState.set('success');
      
      const attemptsCount = this.attempts();
      const pairsCount = this.totalPairs();
      // Perfect score if attempts == pairs. Deduct 5 points per extra attempt.
      const score = Math.max(0, 100 - (attemptsCount - pairsCount) * 5);
      
      setTimeout(() => {
        this.answerSubmitted.emit({
          gameType: 'memory-match',
          answer: {
            matchedPairIds: this.matchedPairs(),
            totalAttempts: attemptsCount,
            totalPairs: pairsCount
          },
          isCorrect: true, // Finding all pairs is eventually correct
          score,
          timeSpentMs: Date.now() - this.startTime()
        });
      }, 1500);
    }
  }
}
