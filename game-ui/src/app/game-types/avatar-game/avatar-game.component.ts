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
          @for (
            option of content.gameData.options;
            track option.id
          ) {
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
        gap: 1.5rem;
      }
      .options {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1rem;
      }
      .option {
        border-radius: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.25);
        padding: 1rem;
        background: rgba(255, 255, 255, 0.08);
      }
      footer {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.9);
      }
    `,
  ],
})
export class AvatarGameComponent {
  readonly content = input.required<AvatarInteractiveContent>();

  readonly possibleAnswers = computed(() => this.content().gameData.possibleAnswers);
}
