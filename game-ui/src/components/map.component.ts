import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  template: `
    <div class="map-container">
      <div class="map-item unlocked" (click)="startGame('level-1')">
        <div class="icon">1</div>
        <span>Level 1</span>
      </div>

      <div class="map-item unlocked" (click)="startGame('level-2')">
        <img src="assets/chest.png" alt="Chest" class="icon" />
        <span>Level 2</span>
      </div>

      <div class="map-item locked" (click)="startGame('level-3')">
        <div class="icon">2</div>
        <span>Unit 2</span>
      </div>
    </div>
  `,
  styles: [
    `
      .map-container {
        background: #333;
        padding: 20px;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .map-item {
        display: flex;
        align-items: center;
        margin: 20px 0;
      }
      .icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-right: 10px;
      }
      .unlocked .icon {
        background: #0c0;
      }
      .locked .icon {
        background: #777;
      }
    `,
  ],
})
export class MapComponent {
  private router = inject(Router);
  startGame(gameCode: string) {
    this.router.navigate(['/game', gameCode]);
  }
}
