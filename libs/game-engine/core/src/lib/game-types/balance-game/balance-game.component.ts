import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../services/history.service';
import { BalanceInteractiveContent, toBalanceModel } from './balance-game.model';

@Component({
  selector: 'lib-balance-game',
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
        <div class="mx-auto h-3 w-48 rounded-full bg-slate-100 overflow-hidden shadow-inner">
           <div class="h-full bg-sky-400 transition-all duration-700" [style.width.%]="progress()"></div>
        </div>
      </header>

      <div class="flex items-center justify-around py-10 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 min-h-[300px]">
        
        <div class="flex flex-col items-center gap-4 transition-transform duration-500" [style.transform]="getTilt('left')">
          <div class="flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-white shadow-xl border-b-8 border-sky-200">
             <span class="text-5xl font-black text-sky-600">{{ view.leftSide.value }}</span>
          </div>
          <span class="text-sm font-black text-slate-400 uppercase tracking-widest">{{ view.leftSide.label }}</span>
        </div>

        <div class="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 shadow-inner border-4 border-white">
          <span class="text-5xl font-black text-slate-400">{{ selectedOperator() || '?' }}</span>
        </div>

        <div class="flex flex-col items-center gap-4 transition-transform duration-500" [style.transform]="getTilt('right')">
          <div class="flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-white shadow-xl border-b-8 border-sky-200">
             <span class="text-5xl font-black text-sky-600">{{ view.rightSide.value }}</span>
          </div>
          <span class="text-sm font-black text-slate-400 uppercase tracking-widest">{{ view.rightSide.label }}</span>
        </div>
      </div>

      <div class="flex justify-center gap-8">
        @for (op of ['<', '=', '>']; track op) {
          <button 
            (click)="checkAnswer(op)"
            [disabled]="feedbackState() === 'success'"
            class="h-24 w-24 rounded-3xl bg-white border-b-[10px] border-slate-200 text-4xl font-black text-slate-700 shadow-xl transition-all hover:scale-110 active:translate-y-2 active:border-b-0 hover:bg-sky-50 hover:border-sky-200"
          >
            {{ op }}
          </button>
        }
      </div>

    </section>
    }
  `
})
export class BalanceMasterComponent {
  private readonly historyService = inject(HistoryService);
  readonly content = input.required<BalanceInteractiveContent>();
  readonly viewModel = computed(() => toBalanceModel(this.content()));

  selectedOperator = signal<string | null>(null);
  feedbackState = signal<'idle' | 'success' | 'error'>('idle');
  progress = signal(0);

  readonly feedbackConfig = computed(() => ({
    success: { title: '¡EQUILIBRADO!', icon: '⚖️', class: 'bg-emerald-500 border-emerald-700' },
    error: { title: '¡INTENTA DE NUEVO!', icon: '🧐', class: 'bg-rose-500 border-rose-700' }
  }[this.feedbackState() as 'success' | 'error'] || { title: '', icon: '', class: '' }));

  checkAnswer(op: string) {
    this.selectedOperator.set(op);
    
    if (op === this.viewModel().correctOperator) {
      this.feedbackState.set('success');
      this.progress.set(100);
      setTimeout(() => this.historyService.advanceToNext(), 2500);
    } else {
      this.feedbackState.set('error');
      setTimeout(() => {
        this.feedbackState.set('idle');
        this.selectedOperator.set(null);
      }, 1200);
    }
  }

  // Lógica visual para inclinar la balanza
  getTilt(side: 'left' | 'right'): string {
    const view = this.viewModel();
    if (!view) return '';
    const diff = view.leftSide.value - view.rightSide.value;
    const tilt = side === 'left' ? diff * -2 : diff * 2;
    return `translateY(${tilt}px)`;
  }
}