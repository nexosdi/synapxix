import { Component, computed, input } from '@angular/core';
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
      class="mx-auto flex max-w-xl flex-col gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-sky-100/80 via-emerald-50/70 to-white/70 p-8 shadow-2xl shadow-sky-900/10 backdrop-blur"
    >
      <header class="space-y-2 text-center">
        <p
          class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500"
        >
          Choose Your Guide
        </p>
        <h2 class="text-balance text-3xl font-bold text-slate-900">
          {{ view.legend }}
        </h2>
        <p class="text-sm text-slate-600">
          Each companion unlocks unique boosts for the journey.
        </p>
      </header>

      <ul class="grid gap-4">
        @for (option of view.options; track option.id) {
        <li
          class="group relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 border-transparent bg-white/90 p-5 shadow-md shadow-slate-900/10 transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl"
          [class.border-emerald-400]="option.isCorrect"
          [class.bg-emerald-50]="option.isCorrect"
        >
          <h3 class="text-lg font-semibold text-slate-900">
            {{ option.label }}
          </h3>
          @if (option.description) {
          <p class="text-sm text-slate-600">
            {{ option.description }}
          </p>
          }
        </li>
        }
      </ul>

      @if (possibleAnswers().length) {
      <footer
        class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        <span class="font-semibold uppercase tracking-wide text-emerald-500">
          Correct:
        </span>
        <span>{{ possibleAnswers().join(', ') }}</span>
      </footer>
      }
    </section>
    }
  `,
})
export class AvatarGameComponent {
  readonly content = input.required<AvatarInteractiveContent>();
  readonly viewModel = computed(() => toAvatarGameModel(this.content()));

  readonly possibleAnswers = computed(() => this.viewModel().possibleAnswers);
}
