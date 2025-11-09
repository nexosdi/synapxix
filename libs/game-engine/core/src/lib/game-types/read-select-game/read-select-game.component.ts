import { Component, computed, input } from '@angular/core';
import {
  ReadSelectInteractiveContent,
  toReadSelectGameModel,
} from './read-select-game.model';

@Component({
  selector: 'app-read-select-game',
  standalone: true,
  template: `
    @if (viewModel(); as view) {
    <section
      class="mx-auto flex max-w-2xl flex-col gap-8 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/70 p-8 shadow-xl shadow-emerald-900/10 backdrop-blur"
    >
      <header class="space-y-2">
        <p
          class="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-500"
        >
          Read & Select
        </p>
        <h2 class="text-balance text-3xl font-bold text-slate-900">
          {{ view.prompt }}
        </h2>
        <div class="text-sm text-slate-600">
          <p class="font-medium">
            Min correct to pass:
            <span class="font-semibold text-emerald-600">
              {{ view.minCorrectToPass }}
            </span>
          </p>
          @if (view.timeLimitSec) {
          <p>Timer: {{ view.timeLimitSec }} seconds</p>
          }
        </div>
      </header>

      <ul class="grid gap-3 md:grid-cols-2">
        @for (option of options(); track option.text) {
        <li
          class="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 text-lg font-medium text-slate-900 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50"
        >
          {{ option.text }}
        </li>
        }
      </ul>

      <footer class="text-right text-sm text-slate-500">
        Locale: {{ view.locale }}
      </footer>
    </section>
    }
  `,
})
export class ReadSelectGameComponent {
  readonly content = input.required<ReadSelectInteractiveContent>();
  readonly viewModel = computed(() => toReadSelectGameModel(this.content()));

  readonly options = computed(() => this.viewModel().options);
}
