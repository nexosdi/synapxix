import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BalanceService } from '../app/services/balance.service'; 

@Component({
  selector: 'app-auth-widget',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="fixed right-4 top-4 z-50 flex flex-col items-end gap-2">
      
      <div class="flex items-center gap-3 rounded-full bg-slate-900/80 px-4 py-2 text-white shadow-lg backdrop-blur border border-white/5">
        
        <div class="flex items-center gap-2 pr-2 border-r border-white/10">
          <span class="text-amber-400 font-bold">✧</span>
          <span class="font-black">{{ balance() }}</span>
        </div>

        @if(user$ | async; as user){
          <div class="text-right leading-tight">
            <p class="text-sm font-semibold">{{ user.name || user.nickname || 'Player' }}</p>
            @if (user.email) { <p class="text-xs text-white/70">{{ user.email }}</p> }
          </div>
        }

        @if ((isAuthenticated$ | async) === true) {
          <button (click)="logout()" class="rounded-full bg-emerald-300/90 px-4 py-1 text-sm font-semibold text-slate-900 transition hover:bg-emerald-200">Log out</button>
        } @else {
          <button (click)="login()" class="rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-slate-900 transition hover:bg-white">Log in</button>
        }
      </div>

      @if (lastReward(); as r) {
        <div class="animate-bounce bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-300">
          <span class="text-lg"> ¡Ey! </span>
          <span class="text-sm font-bold">{{ r.msg }} (+{{ r.amount }})</span>
        </div>
      }

    </div>
  `,
})
export class AuthWidgetComponent {
  private readonly auth = inject(AuthService);
  private readonly balanceService = inject(BalanceService);

  protected readonly isAuthenticated$ = this.auth.isAuthenticated$;
  protected readonly user$ = this.auth.user$;
  protected readonly balance = this.balanceService.cognitas;
  protected readonly lastReward = this.balanceService.lastReward;

constructor() {
  setTimeout(() => {
    this.balanceService.updateBalance(100, 'Welcome bonus');
  }, 2000);
}


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