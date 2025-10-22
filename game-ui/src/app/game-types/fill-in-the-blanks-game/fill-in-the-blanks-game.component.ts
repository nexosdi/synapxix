import { Component, input } from '@angular/core';
import { FillInTheBlanksInteractiveContent } from '../../models/history.model';

@Component({
  selector: 'app-fill-in-the-blanks-game',
  standalone: true,
  template: `
    @if (content(); as content) {
      <section class="fill-blanks">
        <header>
          <h2>Complete the sentence</h2>
          <p>{{ content.gameData.sentence }}</p>
        </header>

        <ol>
          @for (
            blank of content.gameData.blanks;
            track blank.index
          ) {
            <li>
              Blank #{{ blank.index + 1 }} — options:
              <span class="choices">
                @for (choice of blank.choices; track choice.label) {
                  <span>{{ choice.label }}</span>
                }
              </span>
            </li>
          }
        </ol>
      </section>
    }
  `,
  styles: [
    `
      .fill-blanks {
        display: grid;
        gap: 1.4rem;
        padding: 2rem;
        background: linear-gradient(150deg, rgba(255, 231, 133, 0.2), rgba(120, 215, 255, 0.18));
        border-radius: 1.6rem;
        box-shadow: 0 22px 48px rgba(128, 97, 15, 0.12);
        max-width: 620px;
        margin: 0 auto;
        color: #3a2c05;
        border: 1px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(16px);
      }
      header {
        display: grid;
        gap: 0.5rem;
      }
      header h2 {
        margin: 0;
        font-size: clamp(1.35rem, 2.1vw, 1.8rem);
        font-weight: 700;
      }
      header p {
        margin: 0;
        font-size: 1rem;
        color: rgba(58, 44, 5, 0.7);
      }
      .choices {
        display: inline-flex;
        gap: 0.45rem;
        margin-left: 0.75rem;
        flex-wrap: wrap;
      }
      ol {
        padding-left: 1.5rem;
        margin: 0;
        display: grid;
        gap: 0.75rem;
      }
      li {
        background: rgba(255, 255, 255, 0.82);
        border-radius: 1rem;
        padding: 0.9rem 1.1rem;
        box-shadow: 0 12px 28px rgba(112, 87, 8, 0.14);
        font-weight: 600;
      }
    `,
  ],
})
export class FillInTheBlanksGameComponent {
  readonly content = input.required<FillInTheBlanksInteractiveContent>();
}
