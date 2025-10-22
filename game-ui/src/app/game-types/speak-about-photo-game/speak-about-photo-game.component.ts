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
        gap: 1.5rem;
        padding: 2.25rem;
        background: linear-gradient(150deg, rgba(119, 210, 255, 0.22), rgba(255, 182, 122, 0.2));
        border-radius: 1.7rem;
        box-shadow: 0 24px 52px rgba(50, 80, 118, 0.2);
        max-width: 600px;
        margin: 0 auto;
        color: #16304a;
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(18px);
      }
      header h2 {
        margin: 0;
        font-size: clamp(1.45rem, 2.2vw, 1.95rem);
        font-weight: 700;
      }
      .photo {
        width: 100%;
        border-radius: 1.2rem;
        object-fit: cover;
        box-shadow: 0 18px 40px rgba(22, 48, 74, 0.22);
        border: 3px solid rgba(255, 255, 255, 0.7);
      }
      p {
        margin: 0;
        font-size: 1rem;
        color: rgba(22, 48, 74, 0.72);
      }
      ul {
        margin: 0;
        padding-left: 1.4rem;
        display: grid;
        gap: 0.6rem;
      }
      li {
        background: rgba(255, 255, 255, 0.78);
        border-radius: 0.9rem;
        padding: 0.65rem 0.9rem;
        font-weight: 600;
        color: #16304a;
        box-shadow: 0 12px 24px rgba(22, 48, 74, 0.16);
      }
      footer {
        font-size: 0.9rem;
        color: rgba(22, 48, 74, 0.68);
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class SpeakAboutPhotoGameComponent {
  readonly content = input.required<SpeakAboutPhotoInteractiveContent>();
}
