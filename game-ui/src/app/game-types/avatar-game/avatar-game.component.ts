import { Component, computed, input } from '@angular/core';
import { AvatarInteractiveContent } from '../../models/history.model';

@Component({
  selector: 'app-avatar-game',
  standalone: true,
  template: `
    @if (content(); as content) {
    <section class="avatar-game">
      <header>
        <h2>{{ content.gameData.legend }}</h2>
      </header>

      <ul class="options">
        @for ( option of content.gameData.options; track option.id ) {
        <li class="option" [attr.data-correct]="option.isCorrect">
          <h3>{{ option.label }}</h3>
          @if (option.description) {
          <p>{{ option.description }}</p>
          }
        </li>
        }
      </ul>

      @if (possibleAnswers().length) {
      <footer>
        <strong>Possible Answers:</strong>
        <span>{{ possibleAnswers().join(', ') }}</span>
      </footer>
      }
    </section>
    }
  `,
  styles: [
    `
      .avatar-game {
        display: grid;
        gap: 1.75rem;
        padding: 2rem;
        border-radius: 1.5rem;
        background: linear-gradient(140deg, rgba(60, 192, 255, 0.18), rgba(122, 255, 148, 0.12));
        box-shadow: 0 18px 45px rgba(20, 55, 90, 0.2);
        color: #132035;
        max-width: 560px;
        margin: 0 auto;
        border: 1px solid rgba(255, 255, 255, 0.14);
        backdrop-filter: blur(18px);
      }
      header h2 {
        margin: 0;
        font-size: clamp(1.5rem, 2.4vw, 2rem);
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .options {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0;
        display: grid;
        gap: 1rem;
      }
      .option {
        border-radius: 1rem;
        border: 2px solid transparent;
        padding: 1.15rem 1.5rem;
        background: #ffffff;
        color: inherit;
        box-shadow: 0 12px 28px rgba(13, 42, 76, 0.12);
        display: grid;
        gap: 0.35rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease,
          border-color 0.2s ease;
        cursor: pointer;
      }
      .option:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 30px rgba(16, 45, 78, 0.18);
        border-color: rgba(72, 199, 142, 0.85);
      }
      .option:active {
        transform: translateY(0);
        box-shadow: 0 10px 18px rgba(13, 42, 76, 0.16);
      }
      .option h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
      }
      .option p {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(19, 32, 53, 0.72);
      }
      footer {
        font-size: 0.875rem;
        color: rgba(19, 32, 53, 0.8);
        background: rgba(255, 255, 255, 0.64);
        padding: 0.85rem 1rem;
        border-radius: 0.9rem;
        border: 1px solid rgba(255, 255, 255, 0.45);
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: baseline;
      }
      footer strong {
        font-size: 0.95rem;
        color: #158a53;
      }
    `,
  ],
})
export class AvatarGameComponent {
  readonly content = input.required<AvatarInteractiveContent>();

  readonly possibleAnswers = computed(
    () => this.content().gameData.possibleAnswers
  );
}
