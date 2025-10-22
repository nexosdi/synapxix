import { Component, input } from '@angular/core';
import { ListenTypeInteractiveContent } from '../../models/history.model';

@Component({
  selector: 'app-listen-type-game',
  standalone: true,
  template: `
    @if (content(); as content) {
      <section class="listen-type">
        <header>
          <h2>Listen & Type</h2>
          <p>Time limit: {{ content.gameData.timeLimitSec }} seconds</p>
        </header>

        <audio
          class="audio-player"
          controls
          [src]="content.gameData.audioUrl"
        ></audio>

        @if (content.gameData.hint) {
          <p>Hint: {{ content.gameData.hint }}</p>
        }

        <footer>
          <span>Locale: {{ content.gameData.locale }}</span>
        </footer>
      </section>
    }
  `,
  styles: [
    `
      .listen-type {
        display: grid;
        gap: 1.5rem;
        padding: 2rem 2.25rem;
        background: linear-gradient(160deg, rgba(87, 201, 255, 0.22), rgba(119, 236, 160, 0.18));
        border-radius: 1.65rem;
        box-shadow: 0 22px 52px rgba(24, 62, 82, 0.2);
        max-width: 560px;
        margin: 0 auto;
        color: #103043;
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(18px);
      }
      .audio-player {
        width: 100%;
        border-radius: 0.9rem;
        background: rgba(255, 255, 255, 0.78);
        padding: 0.5rem;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55),
          0 10px 24px rgba(16, 64, 90, 0.18);
      }
      header h2 {
        margin: 0;
        font-size: clamp(1.4rem, 2.1vw, 1.85rem);
        font-weight: 700;
      }
      header p,
      p {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(16, 48, 67, 0.7);
      }
      footer {
        font-size: 0.85rem;
        color: rgba(16, 48, 67, 0.72);
        text-align: right;
      }
    `,
  ],
})
export class ListenTypeGameComponent {
  readonly content = input.required<ListenTypeInteractiveContent>();
}
