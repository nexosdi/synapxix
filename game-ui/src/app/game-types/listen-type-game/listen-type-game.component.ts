import { Component, computed, input } from '@angular/core';
import {
  ListenTypeInteractiveContent,
  toListenTypeGameModel,
} from './listen-type-game.model';

@Component({
  selector: 'app-listen-type-game',
  standalone: true,
  template: `
    @if (viewModel(); as view) {
      <section
        class="mx-auto flex max-w-xl flex-col gap-8 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/80 p-8 shadow-xl shadow-sky-900/10 backdrop-blur"
      >
        <header class="space-y-1">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
            Listen & Type
          </p>
          <h2 class="text-2xl font-bold text-slate-900">
            Transcribe the sentence
          </h2>
          <p class="text-sm text-slate-600">
            Time limit: {{ view.timeLimitSec }} seconds
          </p>
        </header>

        <div class="rounded-2xl border border-sky-100 bg-white/95 px-6 py-4 shadow-inner shadow-sky-900/5">
          <audio
            controls
            [src]="view.audioUrl"
            class="w-full"
          ></audio>
        </div>

        @if (view.hint) {
          <p class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Hint: {{ view.hint }}
          </p>
        }

        <footer class="text-right text-sm text-slate-500">
          Locale: {{ view.locale }}
        </footer>
      </section>
    }
  `,
})
export class ListenTypeGameComponent {
  readonly content = input.required<ListenTypeInteractiveContent>();
  readonly viewModel = computed(() => toListenTypeGameModel(this.content()));
}
