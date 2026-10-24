import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsentService, ConsentDto } from '../../../services/consent.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-consent-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div class="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full text-white shadow-2xl">
        <h2 class="text-2xl font-bold mb-4 text-purple-400">Consentimiento de Datos</h2>
        <p class="mb-6 text-gray-300">
          Para mejorar la experiencia y ayudar a la investigación, recolectamos datos de juego anónimos (DALA).
          ¿Aceptás compartir tus datos de telemetría? Podés revocar esto en cualquier momento.
        </p>
        <div class="flex gap-4 justify-end">
          <button (click)="submitConsent('REVOKED')" class="px-4 py-2 rounded font-medium bg-gray-700 hover:bg-gray-600 transition-colors">
            Rechazar
          </button>
          <button (click)="submitConsent('GRANTED')" class="px-4 py-2 rounded font-medium bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/30">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConsentModalComponent implements OnInit {
  private consentService = inject(ConsentService);
  private keycloak = inject(KeycloakService);
  
  showModal = false;
  readonly CURRENT_VERSION = 'v1.0';
  readonly DALA_SCOPE = 'research';

  async ngOnInit() {
    const isLoggedIn = this.keycloak.isLoggedIn();
    if (!isLoggedIn) return;

    this.consentService.getCurrentConsent(this.DALA_SCOPE).subscribe({
      next: (consent) => {
        if (!consent || consent.version !== this.CURRENT_VERSION) {
          this.showModal = true;
        }
      },
      error: () => {
        // En caso de error, podríamos asumir rechazo o volver a preguntar
        this.showModal = true;
      }
    });
  }

  submitConsent(status: 'GRANTED' | 'REVOKED') {
    const dto: ConsentDto = {
      version: this.CURRENT_VERSION,
      scope: this.DALA_SCOPE,
      status
    };

    this.consentService.updateConsent(dto).subscribe(() => {
      this.showModal = false;
    });
  }
}
