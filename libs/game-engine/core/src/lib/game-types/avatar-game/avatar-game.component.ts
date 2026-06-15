import { Component, computed, input, output, signal } from '@angular/core';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import {
  AvatarInteractiveContent,
  toAvatarGameModel,
} from './avatar-game.model';

@Component({
  selector: 'lib-avatar-game',
  standalone: true,
  template: `
    @if (viewModel(); as view) {
    <section
      class="relative mx-auto flex max-w-xl flex-col gap-8 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-[0_25px_60px_rgba(27,149,251,0.15)] animate-in fade-in zoom-in duration-500"
    >
      @if (selectedId()) {
        <div class="absolute inset-0 z-20 flex items-center justify-center rounded-[3rem] bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="flex flex-col items-center gap-4 rounded-[2.5rem] bg-yellow-300 px-12 py-8 shadow-xl border-b-8 border-yellow-500 scale-110 animate-in bounce-in">
            <h3 class="text-3xl font-black text-[#1b95fb]">GREAT CHOICE! 🛡️</h3>
          </div>
        </div>
      }

      <header class="space-y-4 text-center">
        <div class="inline-block px-6 py-2 rounded-full bg-[#1b95fb]/10 text-[#1b95fb] text-xs font-black uppercase tracking-[0.2em]">
          Hero Selection
        </div>
        
        <h2 class="text-balance text-4xl font-black text-slate-800 leading-tight">
          {{ view.legend }}
        </h2>
        
        <p class="text-lg font-bold text-slate-400 italic">
          Choose your companion for the journey.
        </p>
      </header>

      <ul class="grid gap-5">
        @for (option of view.options; track option.id) {
        <li
          (click)="onSelectAvatar(option.id)"
          (keydown.enter)="onSelectAvatar(option.id)"
          tabindex="0"
          role="button"
          class="group relative flex cursor-pointer flex-col gap-2 rounded-[2rem] border-b-4 border-l-2 border-r-2 border-slate-100 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 active:translate-y-1 active:border-b-0"
          [class.!border-[#1b95fb]]="selectedId() === option.id"
          [class.!bg-[#1b95fb]]="selectedId() === option.id"
        >
          <h3 class="text-2xl font-black text-slate-800 transition-colors"
              [class.!text-white]="selectedId() === option.id">
            {{ option.label }}
          </h3>
          
          @if (option.description) {
          <p class="text-base font-bold text-slate-500 transition-colors"
             [class.!text-white/80]="selectedId() === option.id">
            {{ option.description }}
          </p>
          }

          @if (selectedId() === option.id) {
            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-3xl animate-bounce">✨</span>
          }
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
export class AvatarGameComponent implements BaseGameComponent {
  readonly content = input.required<AvatarInteractiveContent>();
  readonly disabled = input<boolean>(false);
  readonly viewModel = computed(() => toAvatarGameModel(this.content()));
  
  readonly answerSubmitted = output<AnyGameResult>();
  
  // Guardamos solo el ID seleccionado para el feedback visual
  readonly selectedId = signal<string | null>(null);

  onSelectAvatar(id: string) {
    if (this.disabled() || this.selectedId()) return;

    this.selectedId.set(id);

    this.answerSubmitted.emit({
      gameType: 'avatar',
      answer: { selectedAvatarId: id },
      isCorrect: true,
      score: 100,
      timeSpentMs: 0
    });
  }
}