import { Component, Input } from '@angular/core';

/**
 * Íconos de línea del Manual de Marca: trazo simple, puntas redondeadas,
 * un solo color (currentColor). Decorativos: el texto de al lado nombra.
 */
@Component({
  selector: 'synapxix-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      @switch (name) {
        @case ('lupa') {
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15 15l5 5M8 10.5a2.5 2.5 0 0 1 2.5-2.5" />
        }
        @case ('chip') {
          <rect x="6" y="6" width="12" height="12" rx="3" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M10 12h4" />
        }
        @case ('ruta') {
          <circle cx="6" cy="18" r="2.2" />
          <circle cx="18" cy="6" r="2.2" />
          <path d="M8 17.5c5 0 2-5.5 6-6.5 2-.5 3-2 3-3.2" />
        }
        @case ('corazon') {
          <path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z" />
        }
        @case ('casa') {
          <path d="M4 11l8-6.5 8 6.5M6 9.5V19h12V9.5" />
          <path d="M10 19v-5h4v5" />
        }
        @case ('birrete') {
          <path d="M2.5 9.5L12 5l9.5 4.5L12 14z" />
          <path d="M6.5 11.5v4c0 1.4 2.5 2.7 5.5 2.7s5.5-1.3 5.5-2.7v-4M21.5 9.5v5" />
        }
        @case ('brote') {
          <path d="M12 20v-8" />
          <path d="M12 12c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5zM12 14.5C12 11.5 9.5 9.5 6 9.5c0 3 2.5 5 6 5z" />
        }
        @case ('usuario') {
          <circle cx="12" cy="8.5" r="3.6" />
          <path d="M5 20c.8-3.8 3.6-5.8 7-5.8s6.2 2 7 5.8" />
        }
        @case ('juego') {
          <rect x="3" y="7" width="18" height="11" rx="4.5" />
          <path d="M8 10.5v4M6 12.5h4" />
          <circle cx="15.5" cy="11.5" r="1" />
          <circle cx="17.5" cy="13.8" r="1" />
        }
        @case ('grafico') {
          <path d="M4 19.5h16" />
          <path d="M7 16v-4M11.5 16V8M16 16v-6" />
          <path d="M6 9.5l5-4 4.5 2.5 3.5-3" />
        }
        @case ('docente') {
          <rect x="3" y="4" width="13" height="10" rx="2" />
          <circle cx="18.5" cy="12.5" r="2.2" />
          <path d="M15 20.5c.4-2.6 1.8-3.8 3.5-3.8s3.1 1.2 3.5 3.8M6.5 8h6M6.5 10.8h4" />
        }
        @case ('chispa') {
          <path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z" />
          <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
        }
        @case ('red') {
          <circle cx="12" cy="5.5" r="2.2" />
          <circle cx="5.5" cy="17" r="2.2" />
          <circle cx="18.5" cy="17" r="2.2" />
          <path d="M11 7.5L6.5 15M13 7.5l4.5 7.5M7.7 17h8.6" />
        }
      }
    </svg>
  `,
})
export class BrandIconComponent {
  @Input({ required: true }) name!: string;
}
