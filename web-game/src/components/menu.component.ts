import { Component } from '@angular/core';

@Component({
  selector: 'dsl-menu',
  template: `
    <nav
      class="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white/95 px-6 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur"
    >
      @for (icon of icons; track icon.src) {
      <button
        type="button"
        class="flex h-14 w-14 items-center justify-center rounded-2xl border border-transparent bg-slate-100 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50 focus:outline-none focus-visible:ring focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <img class="h-9 w-9" [src]="icon.src" [alt]="icon.alt" />
      </button>
      }
    </nav>
  `,
})
export class MenuComponent {
  readonly icons = [
    { src: 'assets/home.png', alt: 'Home' },
    { src: 'assets/chest.png', alt: 'Chest' },
    { src: 'assets/shield.png', alt: 'Shield' },
    { src: 'assets/bell.png', alt: 'Alerts' },
  ];
}
