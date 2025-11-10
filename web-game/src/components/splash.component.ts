import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { HISTORY_MOCK } from '@nexosdi.synapxix/core';
import { firstValueFrom } from 'rxjs';

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
  private auth = inject(AuthService);

  async onPlayClick(): Promise<void> {
    const target = `/history/${HISTORY_MOCK.id}/map`;
    const isAuthenticated = await firstValueFrom(
      this.auth.isAuthenticated$
    );

    if (!isAuthenticated) {
      await firstValueFrom(
        this.auth.loginWithRedirect({
          appState: { target },
        })
      );
      return;
    }

    this.router.navigateByUrl(target);
  }
}
