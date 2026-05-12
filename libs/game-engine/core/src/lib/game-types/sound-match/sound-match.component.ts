import { Component, computed, input, output, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import { SoundMatchInteractiveContent, toSoundMatchModel, SoundOption } from './sound-match.model';

@Component({
  selector: 'lib-sound-match',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel(); as view) {
    <section class="relative mx-auto flex max-w-5xl flex-col gap-10 rounded-[4rem] border-b-[16px] border-slate-200 bg-white p-12 shadow-2xl overflow-hidden">
      
      @if (feedbackState() !== 'idle') {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div [class]="feedbackConfig().class" class="flex flex-col items-center gap-6 rounded-[4rem] px-16 py-12 shadow-2xl border-b-[12px] animate-in zoom-in bounce-in">
            <span class="text-9xl">{{ feedbackConfig().icon }}</span>
            <h3 class="text-5xl font-black text-white italic uppercase tracking-tighter text-center">
              {{ feedbackConfig().title }}
            </h3>
          </div>
        </div>
      }

      <header class="relative z-10 text-center space-y-4">
        <h2 class="text-4xl font-black text-slate-800 italic uppercase leading-tight">
          {{ view.prompt }}
        </h2>
        <p class="text-slate-400 font-bold uppercase tracking-[0.3em] text-sm italic">Escucha y elige el correcto</p>
      </header>

      <div class="relative z-20 flex justify-center items-center py-14 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 shadow-inner">
        <button 
          (click)="playSound(view.audioUrl)"
          [disabled]="feedbackState() === 'success'"
          class="group relative flex h-60 w-60 items-center justify-center rounded-full transition-all duration-300 pointer-events-auto shadow-lg"
          [ngClass]="{
            'bg-sky-500 border-b-[16px] border-sky-700 hover:scale-105 active:translate-y-2 active:border-b-0': view.audioUrl,
            'bg-slate-300 border-b-[16px] border-slate-400 cursor-not-allowed opacity-50': !view.audioUrl
          }"
        >
          <div class="flex flex-col items-center gap-2 pointer-events-none">
            <span class="text-9xl text-white drop-shadow-2xl transition-transform group-hover:scale-110">
              {{ isPlaying() ? '🔊' : '▶️' }}
            </span>
            <span class="text-xs font-black text-white/90 uppercase tracking-[0.4em]">
              {{ isPlaying() ? 'Sonando' : 'Reproducir' }}
            </span>
          </div>

          @if (isPlaying()) {
            <div class="absolute -inset-8 rounded-full border-8 border-sky-400 animate-ping opacity-25 pointer-events-none"></div>
            <div class="absolute -inset-16 rounded-full border-4 border-sky-300 animate-ping opacity-10 pointer-events-none"></div>
          }
        </button>
      </div>

      <div class="relative z-20 grid grid-cols-3 gap-10">
        @for (option of view.options; track option.id) {
          <button 
            (click)="checkAnswer(option)"
            [disabled]="feedbackState() !== 'idle'"
            class="group flex flex-col items-center gap-6 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-xl transition-all hover:scale-105 hover:bg-sky-50 active:translate-y-2 active:border-b-0 disabled:opacity-50 pointer-events-auto"
          >
            <div class="flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-inner overflow-hidden group-hover:bg-white transition-colors duration-300 pointer-events-none">
              @if (option.imageUrl) {
                <img [src]="option.imageUrl" [alt]="option.text" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              } @else {
                <span class="text-7xl group-hover:scale-125 transition-transform duration-500">🖼️</span>
              }
            </div>

            <span class="text-2xl font-black text-slate-700 uppercase tracking-tighter leading-none pointer-events-none">
              {{ option.text }}
            </span>
          </button>
        }
      </div>
    </section>
    }
  `
})
export class SoundMatchGameComponent implements OnDestroy, BaseGameComponent {
  readonly answerSubmitted = output<AnyGameResult>();
  readonly content = input.required<SoundMatchInteractiveContent>();
  readonly disabled = input<boolean>(false);
  
  readonly viewModel = computed(() => {
    try {
      return toSoundMatchModel(this.content());
    } catch (e) {
      return null;
    }
  });

  isPlaying = signal(false);
  feedbackState = signal<'idle' | 'success' | 'error'>('idle');
  private audioInstance: HTMLAudioElement | null = null;

  readonly feedbackConfig = computed(() => ({
    success: { title: '¡EXCELENTE OÍDO!', icon: '🎧', class: 'bg-emerald-500 border-emerald-700' },
    error: { title: '¡VUELVE A ESCUCHAR!', icon: '🧐', class: 'bg-rose-500 border-rose-700' }
  }[this.feedbackState() as 'success' | 'error'] || { title: '', icon: '', class: '' }));

  playSound(url: string) {
    if (!url || this.isPlaying() || this.feedbackState() === 'success') return;

    this.stopAudio();

    this.audioInstance = new Audio();
    this.audioInstance.src = url;
    this.audioInstance.load();

    this.audioInstance.onplay = () => this.isPlaying.set(true);
    this.audioInstance.onended = () => this.isPlaying.set(false);
    this.audioInstance.onerror = () => {
      this.isPlaying.set(false);
      console.error('Error de Audio:', this.audioInstance?.error);
    };

    this.audioInstance.play().catch(err => {
      this.isPlaying.set(false);
      console.warn("Reproducción bloqueada:", err);
    });
  }

  checkAnswer(option: SoundOption) {
    if (this.disabled() || this.feedbackState() !== 'idle') return;

    if (option.isCorrect) {
      this.stopAudio();
      this.feedbackState.set('success');
      this.answerSubmitted.emit({
        gameType: 'sound-match',
        answer: { matchedPairs: [{ soundId: 'audio', optionId: option.id }] },
        isCorrect: true,
        score: 100,
        timeSpentMs: 0
      });
    } else {
      this.feedbackState.set('error');
      setTimeout(() => this.feedbackState.set('idle'), 1500);
    }
  }

  private stopAudio() {
    if (this.audioInstance) {
      this.audioInstance.pause();
      this.audioInstance.src = '';
      this.audioInstance.load();
      this.audioInstance = null;
    }
    this.isPlaying.set(false);
  }

  ngOnDestroy() {
    this.stopAudio();
  }
}