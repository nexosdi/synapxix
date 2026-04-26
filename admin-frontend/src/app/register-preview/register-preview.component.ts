import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-preview.component.html',
  styleUrls: ['./register-preview.component.css']
})
export class RegisterPreviewComponent {
  showPassword = false;
  showPasswordConfirm = false;
  message = { type: '', summary: '' };

  constructor(private router: Router) {}

  togglePassword(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // Simular mensaje de éxito para preview
    this.message = {
      type: 'success',
      summary: '¡Cuenta creada exitosamente!'
    };
  }

  goToLogin() {
    this.router.navigate(['/login-preview']);
  }
}
