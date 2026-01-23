import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../services/history.service';
import { OddOneOutInteractiveContent, toOddOneOutModel, OptionItem } from './intruder-game.model';

@Component({
  selector: 'lib-odd-one-out',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel(); as view) {
    <section class="relative mx-auto flex max-w-5xl flex-col gap-10 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-12 shadow-2xl overflow-hidden">
      
      @if (feedbackState() !== 'idle') {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div [class]="feedbackConfig().class" class="flex flex-col items-center gap-6 rounded-[4rem] px-16 py-12 shadow-2xl border-b-[12px] animate-in zoom-in bounce-in duration-500">
            <span class="text-8xl">{{ feedbackConfig().icon }}</span>
            <h3 class="text-4xl font-black text-white italic uppercase tracking-tighter text-center">
              {{ feedbackConfig().title }}
            </h3>
          </div>
        </div>
      }

      <header class="text-center space-y-4">
        <h2 class="text-4xl font-black text-slate-800 italic uppercase leading-tight">
          {{ view.prompt }}
        </h2>
        <p class="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">Toca al que no pertenece al grupo</p>
      </header>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        @for (item of view.options; track item.id) {
          <button 
            (click)="selectOption(item)"
            [disabled]="feedbackState() === 'success'"
            class="group relative flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border-b-[10px] bg-slate-50 p-8 transition-all hover:scale-105 active:translate-y-2 active:border-b-0 disabled:opacity-50"
            [class.border-slate-200]="!wrongId() || wrongId() !== item.id"
            [class.border-rose-400]="wrongId() === item.id"
            [class.animate-shake]="wrongId() === item.id"
          >
            @if (item.imageUrl) {
              <img [src]="item.imageUrl" class="h-28 w-28 object-cover rounded-2xl shadow-sm group-hover:rotate-3 transition-transform" />
            }
            <span class="text-xl font-black text-slate-700 uppercase tracking-tighter text-center leading-none">
              {{ item.text }}
            </span>
          </button>
        }
      </div>
    </section>
    }
  `,
  styles: [`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }
    .animate-shake { animation: shake 0.3s ease-in-out; }
  `]
})
export class IntruderGameComponent {
  private readonly historyService = inject(HistoryService);
  readonly content = input.required<OddOneOutInteractiveContent>();
  readonly viewModel = computed(() => toOddOneOutModel(this.content()));

  feedbackState = signal<'idle' | 'success' | 'error'>('idle');
  wrongId = signal<string | null>(null);

  readonly feedbackConfig = computed(() => ({
    success: { title: '¡LO ENCONTRASTE!', icon: '🎯', class: 'bg-emerald-500 border-emerald-700' },
    error: { title: '¡INTENTA OTRA VEZ!', icon: '🧐', class: 'bg-rose-500 border-rose-700' }
  }[this.feedbackState() as 'success' | 'error'] || { title: '', icon: '', class: '' }));

  selectOption(item: OptionItem) {
    if (item.isCorrect) {
      this.feedbackState.set('success');
      setTimeout(() => this.historyService.advanceToNext(), 2500);
    } else {
      this.wrongId.set(item.id);
      this.feedbackState.set('error');
      setTimeout(() => {
        this.feedbackState.set('idle');
        this.wrongId.set(null);
      }, 1200);
    }
  }
}