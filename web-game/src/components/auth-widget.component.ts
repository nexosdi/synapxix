import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-widget',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div
      class="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-full bg-slate-900/80 px-4 py-2 text-white shadow-lg shadow-black/20 backdrop-blur"
    >
      @if(user$ | async; as user){
      <div class="text-right leading-tight">
        <p class="text-sm font-semibold">
          {{ user.name || user.nickname || 'Player' }}
        </p>
        @if (user.email) {
        <p class="text-xs text-white/70">{{ user.email }}</p>
        }
      </div>
      } @if ((isAuthenticated$ | async) === true) {
      <button
        type="button"
        class="rounded-full bg-emerald-300/90 px-4 py-1 text-sm font-semibold text-slate-900 transition hover:bg-emerald-200"
        (click)="logout()"
      >
        Log out
      </button>
      } @else {
      <button
        type="button"
        class="rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-slate-900 transition hover:bg-white"
        (click)="login()"
      >
        Log in
      </button>
      }
    </div>
  `,
})
export class AuthWidgetComponent {
  private readonly auth = inject(AuthService);

  protected readonly isAuthenticated$ = this.auth.isAuthenticated$;
  protected readonly user$ = this.auth.user$;

  login(): void {
    this.auth.loginWithRedirect().subscribe();
  }

  logout(): void {
    this.auth
      .logout({
        logoutParams: {
          returnTo: this.getReturnUri(),
        },
      })
      .subscribe();
  }

  private getReturnUri(): string | undefined {
    if (typeof window === 'undefined' || !window.location) {
      return undefined;
    }

    return window.location.origin;
  }
}
