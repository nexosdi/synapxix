import { Component, input } from '@angular/core';
import { ReadAloudInteractiveContent } from '../../models/history.model';

@Component({
  selector: 'app-read-aloud-game',
  standalone: true,
  template: `
    @if (content(); as content) {
      <section class="read-aloud">
        <header>
          <h2>Read Aloud</h2>
          <p>{{ content.gameData.text }}</p>
        </header>

        <ul>
          <li>
            Recording window:
            {{ content.gameData.recording.minDurationSec }}-{{ content.gameData.recording.maxDurationSec }}s
          </li>
          <li>
            Pronunciation target: {{ content.gameData.scoring.minPronScore }}%
          </li>
          <li>
            Completeness target: {{ content.gameData.scoring.minCompleteness }}%
          </li>
        </ul>

        @if (content.gameData.media) {
          <footer>
            Media asset: {{ content.gameData.media }}
          </footer>
        }
      </section>
    }
  `,
  styles: [
    `
      .read-aloud {
        display: grid;
        gap: 1rem;
      }
      ul {
        margin: 0;
        padding-left: 1.25rem;
      }
    `,
  ],
})
export class ReadAloudGameComponent {
  readonly content = input.required<ReadAloudInteractiveContent>();
}
