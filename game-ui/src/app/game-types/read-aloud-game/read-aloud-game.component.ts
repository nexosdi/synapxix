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
        gap: 1.4rem;
        padding: 2rem;
        background: linear-gradient(145deg, rgba(255, 193, 227, 0.22), rgba(142, 196, 255, 0.2));
        border-radius: 1.7rem;
        box-shadow: 0 22px 50px rgba(96, 54, 104, 0.18);
        max-width: 560px;
        margin: 0 auto;
        color: #301436;
        border: 1px solid rgba(255, 255, 255, 0.28);
        backdrop-filter: blur(18px);
      }
      header {
        display: grid;
        gap: 0.5rem;
      }
      header h2 {
        margin: 0;
        font-size: clamp(1.4rem, 2.1vw, 1.85rem);
        font-weight: 700;
      }
      header p {
        margin: 0;
        color: rgba(48, 20, 54, 0.85);
        font-size: 1rem;
        line-height: 1.45;
      }
      ul {
        margin: 0;
        padding-left: 1.3rem;
        color: rgba(48, 20, 54, 0.72);
        display: grid;
        gap: 0.45rem;
      }
      footer {
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: rgba(48, 20, 54, 0.7);
        background: rgba(255, 255, 255, 0.65);
        padding: 0.75rem 1rem;
        border-radius: 0.8rem;
        display: inline-flex;
        gap: 0.4rem;
        align-items: baseline;
      }
    `,
  ],
})
export class ReadAloudGameComponent {
  readonly content = input.required<ReadAloudInteractiveContent>();
}
