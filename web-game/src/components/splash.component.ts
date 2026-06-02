import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HISTORY_MOCK } from '@nexosdi.synapxix/game-engine/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true, // Asegúrate de que sea standalone si no usas NgModules
  imports: [CommonModule],
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

  async onPlayClick(): Promise<void> {
    const target = `/history/${HISTORY_MOCK.id}/map`;
    
    // Bypassing authentication check for offline local testing
    this.router.navigateByUrl(target);
  }
}