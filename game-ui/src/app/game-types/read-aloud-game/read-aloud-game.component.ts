import { Component, computed, input } from '@angular/core';
import {
  ReadAloudInteractiveContent,
  toReadAloudGameModel,
} from './read-aloud-game.model';

@Component({
  selector: 'app-read-aloud-game',
  standalone: true,
  template: `
    @if (viewModel(); as view) {
      <section
        class="mx-auto flex max-w-xl flex-col gap-6 rounded-3xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50/80 via-white to-sky-50/70 p-8 shadow-xl shadow-fuchsia-900/10 backdrop-blur"
      >
        <header class="space-y-2">
          <p class="text-sm font-semibold uppercase tracking-[0.28em] text-fuchsia-500">
            Read Aloud
          </p>
          <h2 class="text-2xl font-bold text-fuchsia-900">
            Speak with confidence
          </h2>
          <p class="rounded-2xl border border-fuchsia-100 bg-white/80 px-5 py-4 text-base font-medium text-fuchsia-900 shadow-inner shadow-fuchsia-900/5">
            {{ view.text }}
          </p>
        </header>

        <ul class="grid gap-3 rounded-2xl border border-fuchsia-100 bg-white/90 px-5 py-4 text-sm text-fuchsia-900 shadow-inner shadow-fuchsia-900/5">
          <li class="flex items-center justify-between">
            Recording window:
            <strong class="text-base text-fuchsia-600">
              {{ view.recording.minDurationSec }}-{{ view.recording.maxDurationSec }}s
            </strong>
          </li>
          <li class="flex items-center justify-between">
            Pronunciation target:
            <strong class="text-base text-fuchsia-600">
              {{ view.scoring.minPronScore }}%
            </strong>
          </li>
          <li class="flex items-center justify-between">
            Completeness target:
            <strong class="text-base text-fuchsia-600">
              {{ view.scoring.minCompleteness }}%
            </strong>
          </li>
        </ul>

        @if (view.media) {
          <footer class="rounded-2xl border border-fuchsia-100 bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-700">
            Media asset: {{ view.media }}
          </footer>
        }
      </section>
    }
  `,
})
export class ReadAloudGameComponent {
  readonly content = input.required<ReadAloudInteractiveContent>();
  readonly viewModel = computed(() => toReadAloudGameModel(this.content()));
}
