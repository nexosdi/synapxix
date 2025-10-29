import { Component, input } from '@angular/core';
import { SpeakAboutPhotoInteractiveContent } from '../../models/history.model';

@Component({
  selector: 'app-speak-about-photo-game',
  standalone: true,
  template: `
    @if (content(); as content) {
      <section
        class="mx-auto flex max-w-3xl flex-col gap-8 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/80 via-white to-amber-50/80 p-8 shadow-2xl shadow-sky-900/10 backdrop-blur"
      >
        <header class="space-y-2">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
            Speak About the Photo
          </p>
          <h2 class="text-balance text-3xl font-bold text-slate-900">
            {{ content.gameData.prompt }}
          </h2>
        </header>

        @if (content.gameData.imageUrl) {
          <figure class="overflow-hidden rounded-[1.5rem] border border-white/70 shadow-xl shadow-sky-900/20">
            <img
              [src]="content.gameData.imageUrl"
              alt="Describe this scene"
              class="h-full w-full object-cover"
            />
          </figure>
        }

        <div class="space-y-3">
          <p class="text-base font-medium text-slate-600">
            Mention at least
            <span class="font-semibold text-emerald-600">
              {{ content.gameData.scoring.keywordsRequired }}
            </span>
            key idea(s):
          </p>

          <ul class="grid gap-2 md:grid-cols-2">
            @for (keyword of content.gameData.targetKeywords; track keyword) {
              <li
                class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-5 py-3 font-semibold text-slate-800 shadow-sm shadow-slate-900/5"
              >
                {{ keyword }}
                <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Key
                </span>
              </li>
            }
          </ul>
        </div>

        <footer class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-sm text-slate-600 shadow-inner shadow-slate-900/5">
          <span>Recording window:</span>
          <strong class="text-base text-sky-600">
            {{ content.gameData.recording.minDurationSec }}-{{ content.gameData.recording.maxDurationSec }}s
          </strong>
        </footer>
      </section>
    }
  `,
})
export class SpeakAboutPhotoGameComponent {
  readonly content = input.required<SpeakAboutPhotoInteractiveContent>();
}
