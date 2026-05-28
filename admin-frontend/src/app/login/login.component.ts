import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container" [style.background]="gradientBackground">
      <!-- Floating shapes background -->
      <div class="floating-shapes">
        <div class="shape shape-1">🎮</div>
        <div class="shape shape-2">🎨</div>
        <div class="shape shape-3">🧩</div>
        <div class="shape shape-4">⭐</div>
        <div class="shape shape-5">🎯</div>
        <div class="shape shape-6">🎪</div>
      </div>

      <div class="login-box">
        <!-- Logo and Brand Section -->
        <div class="brand-section">
          <div class="logo-container">
            <img src="assets/logo.png" alt="Synapsis Logo" class="logo"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">

            <div class="logo-placeholder">
              <span class="logo-text">S</span>
            </div>
          </div>
          <h1 class="brand-name">Synapsis</h1>
          <p class="tagline">¡Donde aprender es divertido!</p>
        </div>

        <div class="welcome-section">
          <h2 class="welcome-title">¡Bienvenido! 👋</h2>
          <p class="welcome-message">
            Prepárate para jugar y aprender cosas increíbles
          </p>
        </div>

        <button (click)="login()" class="login-btn">
          <span class="btn-icon">🚀</span>
          <span class="btn-text">¡Comenzar Aventura!</span>
          <span class="btn-sparkle">✨</span>
        </button>

        <div class="info-footer">
          <p class="hint">
            <span class="lock-icon">🔒</span>
            Inicio de sesión seguro
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  gradientBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';

  constructor(
    private router: Router
  ) {
    this.checkLoginStatus();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    const hue1 = Math.floor(220 + x * 60);
    const hue2 = Math.floor(260 + y * 40);
    const hue3 = Math.floor(300 + (x + y) * 30);

    this.gradientBackground = `linear-gradient(135deg,
      hsl(${hue1}, 70%, 65%) 0%,
      hsl(${hue2}, 60%, 60%) 50%,
      hsl(${hue3}, 75%, 70%) 100%)`;
  }

  async checkLoginStatus() {
    return;
  }

  login() {
    this.router.navigate(['/dashboard']);
  }
}
