import { Component, input } from '@angular/core';
import { FillInTheBlanksInteractiveContent } from '../../models/history.model';

@Component({
  selector: 'app-fill-in-the-blanks-game',
  standalone: true,
  template: `
    @if (content(); as content) {
      <section
        class="mx-auto flex max-w-3xl flex-col gap-8 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/80 via-white to-sky-50/70 p-8 shadow-xl shadow-amber-900/10 backdrop-blur"
      >
        <header class="space-y-2">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Fill in the blanks
          </p>
          <h2 class="text-balance text-3xl font-bold text-slate-900">
            Complete the sentence
          </h2>
          <p class="rounded-2xl border border-amber-100 bg-white/70 px-5 py-4 text-lg font-semibold text-slate-800 shadow-inner shadow-amber-900/5">
            {{ content.gameData.sentence }}
          </p>
        </header>

        <ol class="space-y-4">
          @for (
            blank of content.gameData.blanks;
            track blank.index
          ) {
            <li class="rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-sm shadow-slate-900/5">
              <p class="mb-3 text-sm font-medium text-slate-500">
                Blank #{{ blank.index + 1 }} — select the correct answer:
              </p>
              <div class="flex flex-wrap gap-2">
                @for (choice of blank.choices; track choice.label) {
                  <span
                    class="inline-flex items-center rounded-2xl border border-transparent bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    {{ choice.label }}
                  </span>
                }
              </div>
            </li>
          }
        </ol>
      </section>
    }
  `,
})
export class FillInTheBlanksGameComponent {
  readonly content = input.required<FillInTheBlanksInteractiveContent>();
}
