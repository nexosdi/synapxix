import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import {
  SpeakAboutPhotoInteractiveContent,
  toSpeakAboutPhotoGameModel,
} from './speak-about-photo-game.model';

@Component({
  selector: 'lib-speak-about-photo-game',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (viewModel(); as view) {
    <section
      class="relative mx-auto flex max-w-3xl flex-col gap-8 rounded-[3rem] border-b-[12px] border-slate-200 bg-white p-10 shadow-[0_25px_60px_rgba(27,149,251,0.15)] animate-in fade-in zoom-in duration-500"
    >
      @if (isFinished()) {
        <div class="absolute inset-0 z-20 flex items-center justify-center rounded-[3rem] bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="flex flex-col items-center gap-4 rounded-[2.5rem] bg-yellow-300 px-12 py-8 shadow-xl border-b-8 border-yellow-500 scale-110 animate-in bounce-in">
            <h3 class="text-4xl font-black text-[#1b95fb]">FANTASTIC! 📸</h3>
            <p class="text-[#1b95fb] font-bold italic uppercase">Mission Accomplished</p>
          </div>
        </div>
      }

      <header class="space-y-4 text-center">
        <div class="inline-block px-6 py-2 rounded-full bg-[#1b95fb]/10 text-[#1b95fb] text-xs font-black uppercase tracking-[0.2em]">
          Oral & Written Challenge
        </div>
        
        <h2 class="text-balance text-4xl font-black text-slate-800 leading-tight">
          {{ view.prompt }}
        </h2>
      </header>

      @if (view.imageUrl) {
      <figure class="overflow-hidden rounded-[2.5rem] border-8 border-slate-50 shadow-2xl relative group">
        <img [src]="view.imageUrl" alt="Analyze this" class="h-full w-full object-cover max-h-[300px]" />
        <div class="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-full text-xs font-black text-[#1b95fb] shadow-lg">
          LOOK CLOSELY 👀
        </div>
      </figure>
      }

      <div class="space-y-6">
        <div class="relative">
          <textarea
            [(ngModel)]="userInput"
            (ngModelChange)="onTextChange(view.targetKeywords)"
            placeholder="What's happening in the photo?"
            class="w-full px-8 py-6 bg-slate-50 border-b-4 border-slate-200 text-slate-700 font-bold text-xl rounded-[2rem] focus:bg-white focus:border-[#1b95fb] outline-none transition-all min-h-[120px] resize-none placeholder:text-slate-300"
          ></textarea>
        </div>

        <div class="space-y-3">
          <p class="text-center text-sm font-black text-slate-400 uppercase tracking-widest">
            Keywords Discovered: {{ foundKeywords().size }} / {{ view.scoring.keywordsRequired }}
          </p>
          
          <div class="flex flex-wrap justify-center gap-3">
            @for (keyword of view.targetKeywords; track keyword) {
              @if (foundKeywords().has(keyword.toLowerCase())) {
                <span class="px-6 py-2 rounded-full bg-emerald-500 text-white font-black text-sm shadow-lg animate-in zoom-in duration-300 border-b-4 border-emerald-700">
                  ⭐ {{ keyword }}
                </span>
              } @else {
                <span class="px-6 py-2 rounded-full bg-slate-100 text-slate-300 font-black text-sm border-b-4 border-slate-200">
                  ???
                </span>
              }
            }
          </div>
        </div>

        <button
          (click)="checkVictory(view.scoring.keywordsRequired)"
          [disabled]="foundKeywords().size < view.scoring.keywordsRequired"
          class="w-full py-6 text-white font-black text-2xl rounded-full border-b-8 transition-all shadow-xl disabled:bg-slate-200 disabled:border-slate-300 disabled:text-slate-400 disabled:shadow-none"
          [class.bg-[#1b95fb]]="foundKeywords().size >= view.scoring.keywordsRequired"
          [class.border-[#0d47a1]]="foundKeywords().size >= view.scoring.keywordsRequired"
          [class.hover:bg-[#1b95fb]/90]="foundKeywords().size >= view.scoring.keywordsRequired"
          [class.active:translate-y-2]="foundKeywords().size >= view.scoring.keywordsRequired"
          [class.active:border-b-0]="foundKeywords().size >= view.scoring.keywordsRequired"
        >
          FINISH MISSION
        </button>
      </div>

      <footer class="text-center pt-4 border-t-2 border-slate-50">
        <p class="text-slate-300 font-bold text-[10px] uppercase tracking-[0.3em]">
          Synapxix Educational Engine
        </p>
      </footer>
    </section>
    }
  `
})
export class SpeakAboutPhotoGameComponent implements BaseGameComponent {
  readonly answerSubmitted = output<AnyGameResult>();
  
  readonly content = input.required<SpeakAboutPhotoInteractiveContent>();
  readonly disabled = input<boolean>(false);
  readonly viewModel = computed(() => toSpeakAboutPhotoGameModel(this.content()));

  userInput = '';
  foundKeywords = signal<Set<string>>(new Set());
  isFinished = signal(false);

  onTextChange(targets: string[]) {
    const text = this.userInput.toLowerCase();
    const newlyFound = new Set<string>();

    targets.forEach(word => {
      if (text.includes(word.toLowerCase())) {
        newlyFound.add(word.toLowerCase());
      }
    });

    this.foundKeywords.set(newlyFound);
  }

  checkVictory(required: number) {
    if (this.disabled()) return;
    if (this.foundKeywords().size >= required) {
      this.isFinished.set(true);
      this.answerSubmitted.emit({
        gameType: 'speak-about-photo',
        answer: { audioUrl: '', recognizedText: this.userInput },
        isCorrect: true,
        score: this.foundKeywords().size * 30,
        timeSpentMs: 0
      });
    }
  }
}