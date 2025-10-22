import { Component, input } from '@angular/core';
import { SpeakAboutPhotoInteractiveContent } from '../../models/history.model';

@Component({
  selector: 'app-speak-about-photo-game',
  standalone: true,
  template: `
    @if (content(); as content) {
      <section class="speak-photo">
        <header>
          <h2>{{ content.gameData.prompt }}</h2>
        </header>

        @if (content.gameData.imageUrl) {
          <img
            [src]="content.gameData.imageUrl"
            alt="Describe this scene"
            class="photo"
          />
        }

        <p>
          Mention at least {{ content.gameData.scoring.keywordsRequired }}
          of the key ideas:
        </p>

        <ul>
          @for (
            keyword of content.gameData.targetKeywords;
            track keyword
          ) {
            <li>
              {{ keyword }}
            </li>
          }
        </ul>

        <footer>
          Recording window:
          {{ content.gameData.recording.minDurationSec }}-{{ content.gameData.recording.maxDurationSec }}s
        </footer>
      </section>
    }
  `,
  styles: [
    `
      .speak-photo {
        display: grid;
        gap: 1rem;
      }
      .photo {
        width: 100%;
        border-radius: 0.75rem;
        object-fit: cover;
      }
      ul {
        margin: 0;
        padding-left: 1.25rem;
      }
    `,
  ],
})
export class SpeakAboutPhotoGameComponent {
  readonly content = input.required<SpeakAboutPhotoInteractiveContent>();
}
