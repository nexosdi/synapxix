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
      .choices {
        display: inline-flex;
        gap: 0.5rem;
        margin-left: 0.5rem;
      }
      ol {
        padding-left: 1.25rem;
      }
    `,
  ],
})
export class FillInTheBlanksGameComponent {
  readonly content = input.required<FillInTheBlanksInteractiveContent>();
}
