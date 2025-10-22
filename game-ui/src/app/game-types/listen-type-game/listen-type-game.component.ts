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
        gap: 1rem;
      }
      .audio-player {
        width: 100%;
      }
    `,
  ],
})
export class ListenTypeGameComponent {
  readonly content = input.required<ListenTypeInteractiveContent>();
}
