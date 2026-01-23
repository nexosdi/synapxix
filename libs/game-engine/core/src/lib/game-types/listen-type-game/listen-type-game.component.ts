import { Component, computed, input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../services/history.service';
import {
  ListenTypeInteractiveContent,
  toListenTypeGameModel,
} from './listen-type-game.model';

@Component({
  selector: 'lib-listen-type-game',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (viewModel(); as view) {
    <section
      class="relative mx-auto flex max-w-xl flex-col gap-8 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-[0_25px_60px_rgba(27,149,251,0.15)] animate-in fade-in zoom-in duration-500"
    >
      @if (isCorrect()) {
        <div class="absolute inset-0 z-20 flex items-center justify-center rounded-[3rem] bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="flex flex-col items-center gap-4 rounded-[2.5rem] bg-yellow-300 px-12 py-8 shadow-xl border-b-8 border-yellow-500 scale-110 animate-in bounce-in">
            <h3 class="text-4xl font-black text-[#1b95fb]">PERFECT! 🎧</h3>
          </div>
        </div>
      }

      <header class="space-y-4 text-center">
        <div class="inline-block px-6 py-2 rounded-full bg-[#1b95fb]/10 text-[#1b95fb] text-xs font-black uppercase tracking-[0.2em]">
          Listening Mission
        </div>
        
        <h2 class="text-balance text-4xl font-black text-slate-800 leading-tight">
          Listen and Type
        </h2>
      </header>

      <div class="flex justify-center p-6 bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200">
        <button 
          (click)="audioPlayer.play()"
          class="flex items-center gap-3 px-8 py-4 bg-white border-b-4 border-slate-200 rounded-full text-[#1b95fb] font-black hover:bg-slate-100 active:translate-y-1 active:border-b-0 transition-all"
        >
          <span class="text-2xl">🔊</span>
          PLAY AUDIO
          <audio #audioPlayer [src]="view.audioUrl"></audio>
        </button>
      </div>

      <div class="space-y-4">
        <input
          type="text"
          [(ngModel)]="userInput"
          placeholder="Type what you hear..."
          class="w-full px-8 py-6 bg-slate-100 border-b-4 border-slate-200 text-[#1b95fb] font-black text-2xl rounded-full focus:bg-white focus:border-[#1b95fb] outline-none transition-all text-center placeholder:text-slate-300"
          (keyup.enter)="checkAnswer(view.answer)"
        />

        @if (showError()) {
          <p class="text-center text-red-500 font-black animate-bounce">
            Try again! ❌
          </p>
        }

        <button
          (click)="checkAnswer(view.answer)"
          class="w-full py-6 bg-[#1b95fb] text-white font-black text-2xl rounded-full border-b-8 border-[#0d47a1] hover:bg-[#1b95fb]/90 active:translate-y-2 active:border-b-0 transition-all shadow-xl shadow-[#1b95fb]/30"
        >
          CHECK ANSWER
        </button>
      </div>

      @if (view.hint) {
      <p class="text-center font-bold text-slate-400">
        Hint: <span class="italic font-medium text-slate-400/80">{{ view.hint }}</span>
      </p>
      }
    </section>
    }
  `,
})
export class ListenTypeGameComponent {
  private readonly historyService = inject(HistoryService);
  
  readonly content = input.required<ListenTypeInteractiveContent>();
  readonly viewModel = computed(() => toListenTypeGameModel(this.content()));

  userInput = '';
  isCorrect = signal(false);
  showError = signal(false);

  checkAnswer(correctAnswer: string) {
    const cleanInput = this.userInput.trim().toLowerCase();
    const cleanAnswer = correctAnswer.trim().toLowerCase();

    if (cleanInput === cleanAnswer) {
      this.isCorrect.set(true);
      this.showError.set(false);
      
      setTimeout(() => {
        this.historyService.advanceToNext();
      }, 2500);
    } else {
      this.showError.set(true);
      // Ocultar el mensaje de error después de 2 segundos
      setTimeout(() => this.showError.set(false), 2000);
    }
  }
}