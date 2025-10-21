import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dsl-splash',
  template: `
    <div class="splash-container">
      <button class="play-button" (click)="onPlayClick()">▶</button>
    </div>
  `,
  styles: [
    `
      .splash-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-image: url('/splash/background.jpg');
        background-size: cover;
        background-position: center;
      }

      .play-button {
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .play-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
      }

      .play-button:active {
        transform: scale(0.95);
      }
    `,
  ],
})
export class SplashComponent {
  private router = inject(Router);

  onPlayClick(): void {
    this.router.navigate(['/map']);
  }
}
