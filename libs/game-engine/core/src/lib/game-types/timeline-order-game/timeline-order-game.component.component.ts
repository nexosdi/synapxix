import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../services/history.service';
import { 
  TimelineOrderInteractiveContent, 
  toTimelineOrderGameModel 
} from './timeline-order-game.module';

@Component({
  selector: 'lib-timeline-order-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel(); as view) {
    <section class="relative mx-auto flex max-w-3xl flex-col gap-10 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-2xl overflow-hidden">
      
      @if (feedbackState() !== 'idle') {
        <div class="absolute inset-0 z-50 flex items-center justify-center p-10 bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div [class]="feedbackConfig().containerClass" 
               class="flex flex-col items-center gap-4 rounded-[3rem] px-12 py-10 shadow-2xl border-b-[10px] animate-in zoom-in bounce-in duration-500">
            <span class="text-7xl">{{ feedbackConfig().icon }}</span>
            <h3 class="text-3xl font-black text-white text-center">{{ feedbackConfig().title }}</h3>
            <p class="font-bold text-white/90 italic">{{ feedbackConfig().message }}</p>
          </div>
        </div>
      }

      <header class="text-center space-y-4">
        <div class="inline-block px-6 py-2 rounded-full bg-amber-100 text-amber-600 text-xs font-black uppercase tracking-[0.2em]">
          Misión Histórica
        </div>
        <h2 class="text-3xl font-black text-slate-800 italic leading-tight">
          {{ view.prompt }}
        </h2>
      </header>

      <div class="flex flex-wrap justify-center gap-3 p-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
        @for (event of shuffledEvents(); track event.id) {
          <button (click)="selectEvent(event)" [disabled]="isEventSelected(event)"
            class="px-6 py-3 rounded-2xl border-b-4 font-bold transition-all shadow-md active:translate-y-1 active:border-b-0 disabled:opacity-20"
            [class.bg-white]="!isEventSelected(event)" [class.border-amber-400]="!isEventSelected(event)">
            {{ event.text }}
          </button>
        }
      </div>

      <div class="relative py-10 px-4">
        <div class="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 bg-amber-100 rounded-full"></div>
        <div class="flex flex-col gap-8 relative z-10">
          @for (selected of userOrder(); track selected.id) {
            <div class="flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-300"
                 [class.flex-row]=" $index % 2 === 0" [class.flex-row-reverse]=" $index % 2 !== 0">
              <div class="flex-1 p-5 rounded-2xl border-2 border-amber-200 bg-amber-50 shadow-sm font-black text-amber-900">
                {{ selected.text }}
              </div>
              <div class="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-amber-500 shadow-xl scale-110">
                <span class="text-xl font-black text-white italic">{{ $index + 1 }}</span>
              </div>
              <div class="flex-1"></div>
            </div>
          }
        </div>
      </div>

      <div class="flex gap-4 border-t-2 border-slate-50 pt-8">
        <button (click)="reset()" class="flex-1 py-5 bg-slate-100 text-slate-400 font-black rounded-full border-b-4 border-slate-200">
          BORRAR
        </button>
        <button (click)="checkAnswer()" [disabled]="userOrder().length !== view.events.length"
          class="flex-[2] py-5 bg-emerald-500 text-white font-black rounded-full border-b-4 border-emerald-700 shadow-lg transition-all active:translate-y-1 active:border-b-0 disabled:bg-slate-200">
          ¡COMPROBAR!
        </button>
      </div>
    </section>
    }
  `
})
export class TimelineOrderGameComponent {
  private readonly historyService = inject(HistoryService);
  
  readonly content = input.required<TimelineOrderInteractiveContent>();
  readonly viewModel = computed(() => toTimelineOrderGameModel(this.content()));

  userOrder = signal<any[]>([]);
  feedbackState = signal<'idle' | 'success' | 'error'>('idle');

  readonly shuffledEvents = computed(() => {
    return [...this.viewModel().events].sort(() => Math.random() - 0.5);
  });

  // Configuración dinámica del Pop-up
  readonly feedbackConfig = computed(() => {
    if (this.feedbackState() === 'success') {
      return {
        title: '¡INCREÍBLE!',
        message: 'Has ordenado la historia perfectamente.',
        icon: '🏆',
        containerClass: 'bg-emerald-500 border-emerald-700'
      };
    }
    return {
      title: '¡UY, CASI!',
      message: 'Parece que el tiempo se mezcló un poco.',
      icon: '⏳',
      containerClass: 'bg-rose-500 border-rose-700'
    };
  });

  selectEvent(event: any) {
    if (!this.isEventSelected(event)) {
      this.userOrder.update(list => [...list, event]);
    }
  }

  isEventSelected(event: any) {
    return this.userOrder().some(e => e.id === event.id);
  }

  reset() {
    this.userOrder.set([]);
    this.feedbackState.set('idle');
  }

  checkAnswer() {
    const isCorrect = this.userOrder().every((event, index) => event.order === index + 1);
    
    if (isCorrect) {
      this.feedbackState.set('success');
      setTimeout(() => {
        this.historyService.advanceToNext();
      }, 2500); // Espera 2.5 seg para que vean el éxito antes de seguir
    } else {
      this.feedbackState.set('error');
      setTimeout(() => {
        this.feedbackState.set('idle'); // Quita el pop-up
        this.reset(); // Limpia la línea para intentar de nuevo
      }, 2000);
    }
  }
}