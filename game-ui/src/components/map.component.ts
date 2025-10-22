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
        background: linear-gradient(135deg, rgba(27, 211, 136, 0.18), rgba(81, 180, 255, 0.18));
        padding: 3rem 2.5rem;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
        color: #123824;
        backdrop-filter: blur(18px);
      }
      .title {
        margin: 0;
        color: #0b3d2a;
        font-size: clamp(1.8rem, 2.6vw, 2.4rem);
        font-weight: 800;
      }
      .description {
        margin: 0;
        color: rgba(18, 56, 36, 0.75);
        font-size: 1rem;
        max-width: 38rem;
      }
      .map-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        padding: 1rem 1.4rem;
        border-radius: 1.25rem;
        background: #ffffff;
        box-shadow: 0 18px 42px rgba(16, 70, 48, 0.16);
        border: 2px solid transparent;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease,
          border-color 0.2s ease;
      }
      .map-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 24px 48px rgba(16, 70, 48, 0.2);
        border-color: rgba(17, 200, 112, 0.8);
      }
      .map-item span {
        font-size: 1.05rem;
        font-weight: 700;
      }
      .icon {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
        background: linear-gradient(140deg, rgba(17, 200, 112, 0.92), rgba(125, 255, 185, 0.9));
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 700;
        margin-right: 1rem;
        box-shadow: 0 10px 20px rgba(17, 200, 112, 0.35);
      }
      .unlocked .icon {
        background: linear-gradient(140deg, rgba(17, 200, 112, 0.92), rgba(125, 255, 185, 0.9));
      }
      .locked .icon {
        background: linear-gradient(140deg, rgba(179, 179, 179, 0.85), rgba(215, 215, 215, 0.85));
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
