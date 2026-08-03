import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HISTORY_MOCK } from '@nexosdi.synapxix/game-engine/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true, // Asegúrate de que sea standalone si no usas NgModules
  imports: [CommonModule],
  // Fondo de marca (antes apuntaba a /splash/background.jpg, que no existe y
  // dejaba la pantalla vacía). Ver BRAND.md.
  template: `
    <div
      class="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden"
      style="background: linear-gradient(160deg, var(--sx-blue-900) 0%, var(--sx-blue-deep) 55%, var(--sx-blue) 100%)"
    >
      <!-- Formas suaves, como las del manual -->
      <div class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10"></div>
      <div class="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5"></div>

      <!-- Isotipo en su versión clara aprobada: sobre azul, la versión
           principal no se leería. Sin filtros ni efectos (regla del manual). -->
      <div class="relative z-10 flex flex-col items-center gap-3">
        <img src="/logo-light.png" alt="" aria-hidden="true" class="sx-logo w-32 max-w-[40vw]" />
        <span class="text-4xl font-black tracking-tight text-white">Synapxix</span>
      </div>

      <button
        type="button"
        aria-label="Empezar a jugar"
        class="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl text-brand-700 shadow-sx-lg transition-transform duration-200 ease-out hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        (click)="onPlayClick()"
      >
        ▶
      </button>

      <p class="relative z-10 text-lg font-bold text-white/90">
        ¡Empecemos la aventura!
      </p>
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