import { Component } from '@angular/core';

@Component({
  selector: 'dsl-menu',
  template: `
    <div class="bottom-menu">
      <button class="menu-btn">
        <img src="assets/home.png" alt="Home" />
      </button>
      <button class="menu-btn">
        <img src="assets/chest.png" alt="Chest" />
      </button>
      <button class="menu-btn">
        <img src="assets/shield.png" alt="Shield" />
      </button>
      <button class="menu-btn">
        <img src="assets/bell.png" alt="Alerts" />
      </button>
    </div>
  `,
  styles: [
    `
      .bottom-menu {
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 8px 0;
        background: #fff;
        border-top: 2px solid #000;
      }
      .menu-btn {
        background: linear-gradient(#fff, #ddd);
        border: 1px solid #999;
        border-radius: 8px;
        box-shadow: 0 4px #999;
        cursor: pointer;
        transition: transform 0.1s, box-shadow 0.1s;
      }
      .menu-btn:active {
        transform: translateY(4px);
        box-shadow: 0 0 #999;
      }
      .menu-btn img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    `,
  ],
})
export class MenuComponent {}
