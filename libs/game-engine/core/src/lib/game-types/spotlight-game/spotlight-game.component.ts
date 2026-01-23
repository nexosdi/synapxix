import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../services/history.service';
import { SpotlightInteractiveContent, toSpotlightGameModel, HiddenTarget } from './spotlight-game.model';

@Component({
  selector: 'lib-spotlight-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel(); as view) {
    <section class="relative mx-auto flex max-w-5xl flex-col gap-8 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-2xl overflow-hidden">
      
      @if (showWin()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="flex flex-col items-center gap-6 rounded-[3rem] bg-emerald-500 border-b-[10px] border-emerald-700 px-16 py-10 shadow-2xl animate-in zoom-in bounce-in">
            <span class="text-8xl">🎈</span>
            <h3 class="text-4xl font-black text-white italic uppercase">¡Encontrados!</h3>
          </div>
        </div>
      }

      <header class="text-center space-y-4">
        <h2 class="text-3xl font-black text-slate-800 italic leading-none uppercase">{{ view.prompt }}</h2>
        <div class="mx-auto h-4 w-64 rounded-full bg-slate-100 shadow-inner overflow-hidden">
          <div class="h-full bg-emerald-400 transition-all duration-700 rounded-full" [style.width.%]="progress()"></div>
        </div>
      </header>

      <div class="flex flex-1 gap-8">
        <aside class="w-64 flex flex-col gap-3">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Buscamos:</p>
          @for (target of targets(); track target.id) {
            <div class="flex items-center gap-3 p-4 rounded-2xl border-b-4 transition-all duration-300"
                 [class]="target.found ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'">
              <span class="text-xl">{{ target.found ? '✅' : '🔍' }}</span>
              <span class="text-sm font-black uppercase tracking-tight" [class]="target.found ? 'text-emerald-600' : 'text-slate-500'">
                {{ target.name }}
              </span>
            </div>
          }
        </aside>

        <main class="relative flex-1 rounded-[2.5rem] border-b-[10px] border-slate-100 bg-slate-50 overflow-hidden group">
          <img [src]="view.backgroundImage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          
          <div class="absolute inset-0 pointer-events-none bg-sky-500/5"></div>

          @for (target of targets(); track target.id) {
            <button 
              (click)="onTargetFound(target); $event.stopPropagation()"
              [disabled]="target.found"
              class="absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all border-4 border-dashed border-white/0 hover:border-white/40"
              [style.left.%]="target.x"
              [style.top.%]="target.y"
            >
              @if (target.found) {
                <div class="h-full w-full rounded-full border-[6px] border-emerald-400 bg-white/20 shadow-2xl animate-in zoom-in flex items-center justify-center">
                   <span class="text-4xl animate-bounce">✨</span>
                </div>
              }
            </button>
          }
        </main>
      </div>

      <footer class="text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">
        Misión de observación activa
      </footer>
    </section>
    }
  `
})
export class SpotlightGameComponent implements OnInit {
  private readonly historyService = inject(HistoryService);
  readonly content = input.required<SpotlightInteractiveContent>();
  readonly viewModel = computed(() => toSpotlightGameModel(this.content()));

  targets = signal<HiddenTarget[]>([]);
  showWin = signal(false);

  foundCount = computed(() => this.targets().filter(t => t.found).length);
  progress = computed(() => this.targets().length > 0 ? (this.foundCount() / this.targets().length) * 100 : 0);

  ngOnInit() {
    this.targets.set(this.viewModel().targets.map(t => ({ ...t, found: false })));
  }

  onTargetFound(target: HiddenTarget) {
    this.targets.update(list => list.map(t => t.id === target.id ? { ...t, found: true } : t));
    
    if (this.targets().every(t => t.found)) {
      this.showWin.set(true);
      setTimeout(() => this.historyService.advanceToNext(), 2500);
    }
  }
}