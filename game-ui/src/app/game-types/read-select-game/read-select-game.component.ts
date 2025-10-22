import { Component, computed, input } from '@angular/core';
import { ReadSelectInteractiveContent } from '../../models/history.model';

@Component({
  selector: 'app-read-select-game',
  standalone: true,
  template: `
    @if (content(); as content) {
      <section class="read-select">
        <header>
          <h2>{{ content.gameData.prompt }}</h2>
          <p>
            Min correct to pass:
            <strong>{{ content.gameData.minCorrectToPass }}</strong>
          </p>
          @if (content.gameData.timeLimitSec) {
            <p>Timer: {{ content.gameData.timeLimitSec }} seconds</p>
          }
        </header>

        <ul class="options">
          @for (option of options(); track option.text) {
            <li class="option">
              {{ option.text }}
            </li>
          }
        </ul>

        <footer>
          <span>Locale: {{ content.gameData.locale }}</span>
        </footer>
      </section>
    }
  `,
  styles: [
    `
      .read-select {
        display: grid;
        gap: 1rem;
      }
      .options {
        display: grid;
        gap: 0.75rem;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .option {
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 0.5rem;
      }
    `,
  ],
})
export class ReadSelectGameComponent {
  readonly content = input.required<ReadSelectInteractiveContent>();

  readonly options = computed(() => this.content().gameData.options);
}
