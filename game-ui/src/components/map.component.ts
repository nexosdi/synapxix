import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService } from '../app/services/history.service';
import { GameType } from '../app/models/history.model';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    @if (activeHistory(); as history) {
      <div class="map-container">
        <h2 class="title">{{ history.name }}</h2>
        <p class="description">{{ history.description }}</p>

        @for (content of journey(); track content.id) {
          <div
            class="map-item unlocked"
            (click)="startGame(content.id)"
          >
            <div class="icon">{{ content.order }}</div>
            <span>{{ content.label }}</span>
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .map-container {
        background: #333;
        padding: 20px;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .title {
        margin: 0;
        color: #fff;
      }
      .description {
        margin: 0;
        color: rgba(255, 255, 255, 0.75);
      }
      .map-item {
        display: flex;
        align-items: center;
        margin: 20px 0;
      }
      .icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-right: 10px;
      }
      .unlocked .icon {
        background: #0c0;
      }
      .locked .icon {
        background: #777;
      }
    `,
  ],
})
export class MapComponent {
  private readonly router = inject(Router);
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
    return history.path
      .map((id, index) => ({
        id,
        order: index + 1,
        label:
          this.toDisplayLabel(
            history.contentMap.find((content) => content.id === id)?.gameType
          ) ?? `Step ${index + 1}`,
      }));
  });

  startGame(gameCode: string) {
    this.router.navigate(['/game', gameCode]);
  }

  private toDisplayLabel(gameType?: GameType): string | null {
    if (!gameType) {
      return null;
    }
    return this.labelMap[gameType] ?? gameType;
  }
}
