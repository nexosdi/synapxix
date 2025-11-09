import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryService } from '../app/services/history.service';
import { GameType } from '../app/models/history.model';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    @if (activeHistory(); as history) {
    <div
      class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-12"
    >
      <div class="mx-auto flex max-w-4xl flex-col gap-6">
        <header class="space-y-2">
          <p
            class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500"
          >
            Story Path
          </p>
          <h2 class="text-4xl font-bold text-emerald-900">
            {{ history.name }}
          </h2>
          <p class="text-lg text-emerald-700/80">
            {{ history.description }}
          </p>
        </header>

        <div class="grid gap-4">
          @for (content of journey(); track content.id) {
          <button
            type="button"
            class="flex items-center justify-between rounded-3xl border border-transparent bg-white/95 px-6 py-4 text-left shadow-lg shadow-emerald-900/5 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50 focus:outline-none focus-visible:ring focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-50"
            [disabled]="!content.isStartable"
            [class.opacity-60]="!content.isStartable"
            [class.cursor-not-allowed]="!content.isStartable"
            (click)="startGame()"
          >
            <div class="flex items-center gap-4">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-xl font-semibold text-white shadow-md shadow-emerald-900/20"
              >
                {{ content.order }}
              </span>
              <span class="text-lg font-semibold text-emerald-900">
                {{ content.label }}
              </span>
            </div>
            <span
              class="text-sm font-medium uppercase tracking-[0.24em] text-emerald-400"
            >
              Play
            </span>
          </button>
          }
        </div>
      </div>
    </div>
    }
  `,
})
export class MapComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly historyService = inject(HistoryService);
  private readonly labelMap: Record<GameType, string> = {
    avatar: 'Avatar',
    'read-select': 'Read & Select',
    'listen-type': 'Listen & Type',
    'fill-in-the-blanks': 'Fill in the Blanks',
    'read-aloud': 'Read Aloud',
    'speak-about-photo': 'Speak About the Photo',
  };

  readonly activeHistory = this.historyService.activeHistory;

  readonly journey = computed(() => {
    const history = this.activeHistory();
    if (!history) {
      return [];
    }
    return history.path.map((id, index) => ({
      id,
      order: index + 1,
      label:
        this.toDisplayLabel(
          history.contentMap.find((content) => content.id === id)?.gameType
        ) ?? `Step ${index + 1}`,
      isStartable: index === 0,
    }));
  });

  startGame() {
    const initial = this.historyService.beginJourney();
    if (!initial) {
      console.error('Unable to start journey. History not loaded.');
      return;
    }
    this.router.navigate(['../game'], { relativeTo: this.route });
  }

  private toDisplayLabel(gameType?: GameType): string | null {
    if (!gameType) {
      return null;
    }
    return this.labelMap[gameType] ?? gameType;
  }
}
