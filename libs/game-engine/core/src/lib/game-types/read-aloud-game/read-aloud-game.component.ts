import { Component, computed, input, inject, signal, OnDestroy } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import {
  ReadAloudInteractiveContent,
  toReadAloudGameModel,
} from './read-aloud-game.model';

@Component({
  selector: 'lib-read-aloud-game',
  standalone: true,
  template: `
    @if (viewModel(); as view) {
    <section
      class="relative mx-auto flex max-w-xl flex-col gap-8 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-[0_25px_60px_rgba(27,149,251,0.15)] animate-in fade-in zoom-in duration-500"
    >
      @if (isFinished()) {
        <div class="absolute inset-0 z-20 flex items-center justify-center rounded-[3rem] bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="flex flex-col items-center gap-4 rounded-[2.5rem] bg-yellow-300 px-12 py-8 shadow-xl border-b-8 border-yellow-500 scale-110 animate-in bounce-in">
            <h3 class="text-4xl font-black text-[#1b95fb]">SUPER VOICE! 🎙️</h3>
          </div>
        </div>
      }

      <header class="space-y-4 text-center">
        <div class="inline-block px-6 py-2 rounded-full bg-[#1b95fb]/10 text-[#1b95fb] text-xs font-black uppercase tracking-[0.2em]">
          Mission: Speak Up!
        </div>
        <h2 class="text-balance text-4xl font-black text-slate-800 leading-tight">Read Aloud</h2>
      </header>

      <div class="relative group">
        <div class="absolute -top-3 -left-3 bg-yellow-300 text-[#1b95fb] font-black px-4 py-1 rounded-full shadow-lg z-10 text-sm">
          READ THIS:
        </div>
        <p class="rounded-[2.5rem] border-4 border-dashed border-[#1b95fb]/30 bg-slate-50 px-10 py-12 text-3xl font-black text-slate-700 shadow-inner leading-relaxed text-center italic">
          "{{ view.text }}"
        </p>
      </div>

      <div class="flex flex-col items-center gap-6">
        
        <div class="relative">
          @if (isRecording()) {
            <div class="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-20"></div>
          }
          
          <button
            (click)="toggleRecording(view.recording.maxDurationSec)"
            class="group relative flex h-32 w-32 items-center justify-center rounded-full border-b-[8px] transition-all active:translate-y-2 active:border-b-0 shadow-2xl"
            [class.bg-red-500]="isRecording()"
            [class.border-red-800]="isRecording()"
            [class.bg-[#1b95fb]]="!isRecording()"
            [class.border-[#0d47a1]]="!isRecording()"
          >
            @if (isRecording()) {
              <div class="h-10 w-10 animate-pulse rounded-lg bg-white"></div>
            } @else {
              <span class="text-5xl text-white">🎤</span>
            }
          </button>
        </div>

        <div class="text-center">
          <p class="text-xl font-black tracking-widest" 
             [class.text-red-500]="isRecording()" 
             [class.text-[#1b95fb]]="!isRecording()">
            {{ isRecording() ? formatTime(timer()) : 'Tap to start' }}
          </p>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {{ isRecording() ? 'Recording now...' : 'Ready when you are' }}
          </p>
        </div>
      </div>

      <footer class="grid grid-cols-2 gap-4 pt-4 border-t-2 border-slate-50">
        <div class="text-center bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
           <p class="text-[10px] font-black text-slate-400 uppercase">Min Req.</p>
           <p class="text-lg font-black text-[#1b95fb]">{{ view.recording.minDurationSec }}s</p>
        </div>
        <div class="text-center bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
           <p class="text-[10px] font-black text-slate-400 uppercase">Max Time</p>
           <p class="text-lg font-black text-slate-600">{{ view.recording.maxDurationSec }}s</p>
        </div>
      </footer>
    </section>
    }
  `,
})
export class ReadAloudGameComponent implements OnDestroy {
  private readonly historyService = inject(HistoryService);
  
  readonly content = input.required<ReadAloudInteractiveContent>();
  readonly viewModel = computed(() => toReadAloudGameModel(this.content()));

  // Signals para el estado
  isRecording = signal(false);
  isFinished = signal(false);
  timer = signal(0);
  
  private intervalId?: any;

  toggleRecording(maxSec: number) {
    if (this.isFinished()) return;

    if (!this.isRecording()) {
      this.startRecording(maxSec);
    } else {
      this.stopAndFinish();
    }
  }

  private startRecording(maxSec: number) {
    this.isRecording.set(true);
    this.timer.set(0);

    this.intervalId = setInterval(() => {
      this.timer.update(t => t + 1);
      
      // Auto-stop si llegamos al máximo del mock
      if (this.timer() >= maxSec) {
        this.stopAndFinish();
      }
    }, 1000);
  }

  private stopAndFinish() {
    if (this.intervalId) clearInterval(this.intervalId);
    
    this.isRecording.set(false);
    this.isFinished.set(true);
    
    // Simula procesamiento y avanza al mapa de Synapxix
    setTimeout(() => {
      this.historyService.advanceToNext();
    }, 2500);
  }

  formatTime(sec: number): string {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}