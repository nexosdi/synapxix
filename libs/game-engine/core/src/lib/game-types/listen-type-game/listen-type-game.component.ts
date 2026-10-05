import { Component, computed, input, output, signal, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import {
  ListenTypeInteractiveContent,
  toListenTypeGameModel,
  evaluateListenTypeAnswer,
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
          <div class="flex flex-col items-center gap-4 rounded-[2.5rem] bg-brand-300 px-12 py-8 shadow-xl border-b-8 border-brand-600 scale-110 animate-in bounce-in">
            <h3 class="text-4xl font-black text-[#1e90ff]">PERFECT! 🎧</h3>
          </div>
        </div>
      }

      <header class="space-y-4 text-center">
        <div class="inline-block px-6 py-2 rounded-full bg-[#1e90ff]/10 text-[#1e90ff] text-xs font-black uppercase tracking-[0.2em]">
          Listening Mission
        </div>
        
        <h2 class="text-balance text-4xl font-black text-slate-800 leading-tight">
          Listen and Type
        </h2>
      </header>

      <div class="flex justify-center p-6 bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200">
        <button 
          (click)="playAudio()"
          [disabled]="disabled() || isCorrect()"
          class="flex items-center gap-3 px-8 py-4 bg-white border-b-4 border-slate-200 rounded-full text-[#1e90ff] font-black hover:bg-slate-100 active:translate-y-1 active:border-b-0 transition-all disabled:opacity-50"
        >
          <span class="text-2xl">🔊</span>
          PLAY AUDIO
          <audio #audioPlayer [src]="view.audioUrl"></audio>
        </button>
      </div>

      <div class="space-y-4">
        <input
          type="text"
          [value]="userInput"
          (input)="userInput = $any($event.target).value"
          [disabled]="disabled() || isCorrect()"
          placeholder="Type what you hear..."
          class="w-full px-8 py-6 bg-slate-100 border-b-4 border-slate-200 text-[#1e90ff] font-black text-2xl rounded-full focus:bg-white focus:border-[#1e90ff] outline-none transition-all text-center placeholder:text-slate-300 disabled:opacity-50"
          (keyup.enter)="checkAnswer(view.answer)"
        />

        @if (showError()) {
          <p class="text-center text-red-500 font-black animate-bounce">
            Try again! ❌
          </p>
        }

        <button
          (click)="checkAnswer(view.answer)"
          [disabled]="disabled() || isCorrect()"
          class="w-full py-6 bg-[#1e90ff] text-white font-black text-2xl rounded-full border-b-8 border-[#0a4fbf] hover:bg-[#1e90ff]/90 active:translate-y-2 active:border-b-0 transition-all shadow-xl shadow-[#1e90ff]/30 disabled:opacity-50"
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
export class ListenTypeGameComponent implements BaseGameComponent, OnInit, OnDestroy {
  readonly answerSubmitted = output<AnyGameResult>();
  
  readonly content = input.required<ListenTypeInteractiveContent>();
  readonly disabled = input<boolean>(false);
  readonly viewModel = computed(() => toListenTypeGameModel(this.content()));

  @ViewChild('audioPlayer') audioPlayerRef?: ElementRef<HTMLAudioElement>;

  userInput = '';
  isCorrect = signal(false);
  showError = signal(false);

  private startTime = Date.now();
  private errorTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.startTime = Date.now();
  }

  ngOnDestroy() {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }

  playAudio(): void {
    if (this.disabled()) return;
    try {
      this.audioPlayerRef?.nativeElement.play();
    } catch {
      // Audio element play fallback for testing/headless env
    }
  }

  checkAnswer(correctAnswer: string) {
    if (this.disabled() || this.isCorrect()) return;

    const tolerance = this.viewModel().tolerance;
    const isMatch = evaluateListenTypeAnswer(this.userInput, correctAnswer, tolerance);

    if (isMatch) {
      this.isCorrect.set(true);
      this.showError.set(false);
      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout);
        this.errorTimeout = null;
      }
      
      const timeSpentMs = Math.max(0, Date.now() - this.startTime);

      this.answerSubmitted.emit({
        gameType: 'listen-type',
        answer: { typedText: this.userInput },
        isCorrect: true,
        score: 100,
        timeSpentMs
      });
    } else {
      this.showError.set(true);
      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout);
      }
      this.errorTimeout = setTimeout(() => {
        this.showError.set(false);
        this.errorTimeout = null;
      }, 2000);
    }
  }
}