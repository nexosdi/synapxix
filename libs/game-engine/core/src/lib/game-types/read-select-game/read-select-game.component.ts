import { Component, computed, input, signal, inject } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import {
  ReadSelectInteractiveContent,
  toReadSelectGameModel,
} from './read-select-game.model';

@Component({
  selector: 'lib-read-select-game',
  standalone: true,
  template: `
    @if (viewModel(); as view) {
    <section
      class="relative mx-auto flex max-w-2xl flex-col gap-8 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-[0_25px_60px_rgba(27,149,251,0.15)]"
    >
      @if (isFinished()) {
        <div class="absolute inset-0 z-20 flex items-center justify-center rounded-[3rem] bg-white/80 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div class="flex flex-col items-center gap-4 rounded-[2.5rem] bg-yellow-300 px-12 py-8 shadow-xl border-b-8 border-yellow-500 scale-110">
            <h3 class="text-4xl font-black text-[#1b95fb]">¡GENIAL! 🚀</h3>
            <p class="text-[#1b95fb] font-bold italic uppercase tracking-widest text-sm">Next Mission</p>
          </div>
        </div>
      }

      <header class="space-y-4 text-center">
        <div class="inline-block px-6 py-2 rounded-full bg-[#1b95fb]/10 text-[#1b95fb] text-xs font-black uppercase tracking-[0.2em]">
          Neural Challenge
        </div>
        
        <h2 class="text-balance text-4xl font-black text-slate-800 leading-tight">
          {{ view.prompt }}
        </h2>

        <div class="max-w-xs mx-auto flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border-2 border-slate-100">
          <div class="h-4 flex-1 bg-white rounded-full overflow-hidden border border-slate-200">
            <div 
              class="h-full bg-yellow-300 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(253,224,71,0.8)]"
              [style.width.%]="(foundWords().size / view.minCorrectToPass) * 100"
            ></div>
          </div>
          <span class="text-lg font-black text-[#1b95fb]">
            {{ foundWords().size }}/{{ view.minCorrectToPass }}
          </span>
        </div>
      </header>

      <ul class="grid gap-5 md:grid-cols-2">
        @for (option of options(); track option.text) {
        <li
          (click)="onOptionClick(option)" 
          class="flex cursor-pointer items-center justify-between rounded-[2rem] border-b-4 border-l-2 border-r-2 border-slate-100 bg-white px-8 py-5 text-2xl font-bold text-slate-700 shadow-lg shadow-slate-100 transition-all duration-200 hover:-translate-y-1 active:translate-y-1 active:border-b-0"
          [class.!border-[#1b95fb]]="foundWords().has(option.text)"
          [class.!bg-[#1b95fb]]="foundWords().has(option.text)"
          [class.!text-white]="foundWords().has(option.text)"
          [class.shadow-[#1b95fb]/20]="foundWords().has(option.text)"
          [class.!border-red-300]="wrongWords().has(option.text)"
          [class.!bg-red-50]="wrongWords().has(option.text)"
          [class.!text-red-500]="wrongWords().has(option.text)"
        >
          {{ option.text }}
          
          @if (foundWords().has(option.text)) { <span class="text-2xl animate-bounce">⭐</span> }
          @if (wrongWords().has(option.text)) { <span class="text-2xl">❌</span> }
        </li>
        }
      </ul>

      <footer class="text-center pt-4 border-t-2 border-slate-50">
        <p class="text-slate-300 font-bold text-[10px] uppercase tracking-[0.3em]">
          Synapxix Educational Engine
        </p>
      </footer>
    </section>
    }
  `,
})
export class ReadSelectGameComponent {
  private readonly historyService = inject(HistoryService);
  
  readonly content = input.required<ReadSelectInteractiveContent>();
  readonly viewModel = computed(() => toReadSelectGameModel(this.content()));
  readonly options = computed(() => this.viewModel().options);

  readonly isFinished = signal(false);
  readonly foundWords = signal<Set<string>>(new Set());
  readonly wrongWords = signal<Set<string>>(new Set());

  onOptionClick(option: any) {
    // Evita clics si ya terminó o si la palabra ya fue seleccionada
    if (this.isFinished() || this.foundWords().has(option.text) || this.wrongWords().has(option.text)) return;

    if (option.isReal) {
      this.foundWords.update(prev => new Set(prev).add(option.text));
      if (this.foundWords().size >= this.viewModel().minCorrectToPass) {
        this.finishGame();
      }
    } else {
      this.wrongWords.update(prev => new Set(prev).add(option.text));
    }
  }

  private finishGame() {
    this.isFinished.set(true);
    setTimeout(() => {
      this.historyService.advanceToNext();
    }, 2500);
  }
}