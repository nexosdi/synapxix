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
        gap: 1.75rem;
        padding: 2rem 2.25rem;
        background: linear-gradient(150deg, rgba(13, 193, 140, 0.18), rgba(255, 248, 153, 0.18));
        border-radius: 1.6rem;
        box-shadow: 0 20px 45px rgba(15, 70, 52, 0.18);
        max-width: 600px;
        margin: 0 auto;
        color: #132a1d;
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(20px);
      }
      header {
        display: grid;
        gap: 0.65rem;
      }
      header h2 {
        margin: 0;
        font-size: clamp(1.45rem, 2.2vw, 1.9rem);
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      header p {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(19, 42, 29, 0.72);
      }
      .options {
        display: grid;
        gap: 0.9rem;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .option {
        padding: 1rem 1.4rem;
        background: #ffffff;
        border-radius: 1.1rem;
        border: 2px solid transparent;
        box-shadow: 0 12px 28px rgba(12, 60, 38, 0.12);
        font-size: 1.05rem;
        font-weight: 600;
        transition: transform 0.16s ease, box-shadow 0.16s ease,
          border-color 0.16s ease;
        cursor: pointer;
      }
      .option:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 34px rgba(12, 60, 38, 0.18);
        border-color: rgba(0, 200, 83, 0.85);
      }
      footer {
        font-size: 0.9rem;
        color: rgba(19, 42, 29, 0.68);
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class ReadSelectGameComponent {
  readonly content = input.required<ReadSelectInteractiveContent>();

  readonly options = computed(() => this.content().gameData.options);
}
