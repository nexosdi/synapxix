import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-preview.component.html',
  styleUrls: ['./login-preview.component.css']
})
export class LoginPreviewComponent {
  showPassword = false;
  message = { type: '', summary: '' };

  constructor(private router: Router) {}

  togglePassword() {
    const input = document.getElementById('password') as HTMLInputElement;
    if (input) {
      this.showPassword = !this.showPassword;
      input.type = this.showPassword ? 'text' : 'password';
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // Simular mensaje de error para preview
    this.message = {
      type: 'error',
      summary: 'Usuario o contraseña incorrectos'
    };
  }

  goToRegister() {
    this.router.navigate(['/register-preview']);
  }
}
