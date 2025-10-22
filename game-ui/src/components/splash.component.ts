import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dsl-splash',
  template: `
    <div
      class="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style="background-image: url('/splash/background.jpg')"
    >
      <button
        type="button"
        class="h-20 w-20 rounded-full bg-white/80 text-3xl font-bold text-neutral-800 shadow-lg transition-transform duration-200 ease-out hover:scale-110 hover:shadow-xl active:scale-95 focus:outline-none focus-visible:ring focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        (click)="onPlayClick()"
      >
        ▶
      </button>
    </div>
  `,
})
export class SplashComponent {
  private router = inject(Router);

  onPlayClick(): void {
    this.router.navigate(['/map']);
  }
}
