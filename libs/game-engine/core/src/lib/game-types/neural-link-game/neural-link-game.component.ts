import { Component, computed, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import { MemoryInteractiveContent, toMemoryGameModel, MemoryCard } from './neural-link-game.model';

@Component({
  selector: 'lib-memory-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel(); as view) {
    <section class="relative mx-auto flex max-w-5xl flex-col gap-8 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-2xl overflow-hidden">
      
      @if (feedbackState() !== 'idle') {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div [class]="feedbackConfig().class" class="flex flex-col items-center gap-6 rounded-[4rem] px-16 py-12 shadow-2xl border-b-[12px] animate-in zoom-in bounce-in duration-500">
            <span class="text-8xl">{{ feedbackConfig().icon }}</span>
            <h3 class="text-4xl font-black text-white italic uppercase tracking-tighter">{{ feedbackConfig().title }}</h3>
          </div>
        </div>
      }

      <header class="text-center space-y-4">
        <h2 class="text-3xl font-black text-slate-800 italic uppercase leading-tight">{{ view.prompt }}</h2>
        <div class="mx-auto h-4 w-64 rounded-full bg-slate-100 shadow-inner overflow-hidden">
          <div class="h-full bg-emerald-400 transition-all duration-700 rounded-full" [style.width.%]="progress()"></div>
        </div>
      </header>

      <div class="grid grid-cols-4 gap-6">
        @for (card of cards(); track $index) {
          <div 
            (click)="flipCard(card)"
            (keydown.enter)="flipCard(card)"
            tabindex="0"
            role="button"
            class="relative h-44 cursor-pointer transition-all duration-500 [preserve-3d]"
            [class.[transform:rotateY(180deg)]]="card.isFlipped || card.isMatched"
          >
            <div class="absolute inset-0 flex items-center justify-center rounded-[2.5rem] border-b-8 border-sky-200 bg-sky-100 text-6xl [backface-visibility:hidden]">
              🧠
            </div>

            <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[2.5rem] border-b-8 bg-white [backface-visibility:hidden] [transform:rotateY(180deg)]"
                 [class.border-emerald-200]="card.isMatched"
                 [class.border-slate-200]="!card.isMatched">
              
              @if (card.imageUrl) {
                <img [src]="card.imageUrl" [alt]="card.text || ''" class="h-24 w-24 object-cover rounded-2xl shadow-sm mb-1" />
              }
              @if (card.text) {
                <span class="text-xl font-black text-slate-700 uppercase tracking-tighter text-center px-4 leading-none">
                  {{ card.text }}
                </span>
              }
            </div>
          </div>
        }
      </div>
    </section>
    }
  `
})
export class NeuralLinkGameComponent implements OnInit, BaseGameComponent {
  readonly answerSubmitted = output<AnyGameResult>();
  readonly content = input.required<MemoryInteractiveContent>();
  readonly disabled = input<boolean>(false);
  readonly viewModel = computed(() => toMemoryGameModel(this.content()));

  cards = signal<MemoryCard[]>([]);
  flippedCards = signal<MemoryCard[]>([]);
  feedbackState = signal<'idle' | 'success' | 'error'>('idle');
  
  progress = computed(() => {
    const matched = this.cards().filter(c => c.isMatched).length;
    return this.cards().length > 0 ? (matched / this.cards().length) * 100 : 0;
  });

  readonly feedbackConfig = computed(() => ({
    success: { title: '¡SÚPER PAR!', icon: '✨', class: 'bg-emerald-500 border-emerald-700' },
    error: { title: '¡CASI!', icon: '🧐', class: 'bg-rose-500 border-rose-700' }
  }[this.feedbackState() as 'success' | 'error'] || { title: '', icon: '', class: '' }));

  ngOnInit() {
    const rawCards = this.viewModel().cards;
    const gameCards: MemoryCard[] = rawCards.map(c => ({
      ...c,
      isFlipped: false,
      isMatched: false
    })).sort(() => Math.random() - 0.5);
    
    this.cards.set(gameCards);
  }

  flipCard(card: MemoryCard) {
    if (this.disabled() || card.isMatched || card.isFlipped || this.flippedCards().length === 2 || this.feedbackState() !== 'idle') return;

    this.cards.update(list => list.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));
    this.flippedCards.update(prev => [...prev, card]);

    if (this.flippedCards().length === 2) {
      this.checkMatch();
    }
  }

  private checkMatch() {
    const [c1, c2] = this.flippedCards();
    
    if (c1.matchId === c2.matchId) {
      // ÉXITO
      setTimeout(() => {
        this.cards.update(list => list.map(c => 
          (c.id === c1.id || c.id === c2.id) ? { ...c, isMatched: true, isFlipped: false } : c
        ));
        this.flippedCards.set([]);
        
        if (this.cards().every(c => c.isMatched)) {
          this.feedbackState.set('success');
          this.answerSubmitted.emit({
            gameType: 'neural-link',
            answer: { connections: [] },
            isCorrect: true,
            score: 100,
            timeSpentMs: 0
          });
        }
      }, 500);
    } else {
      // FALLO
      setTimeout(() => {
        this.cards.update(list => list.map(c => 
          (c.id === c1.id || c.id === c2.id) ? { ...c, isFlipped: false } : c
        ));
        this.flippedCards.set([]);
      }, 1000);
    }
  }
}