import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { retry } from 'rxjs';
import { ConsentService, ConsentDto } from '../../../services/consent.service';
import { KeycloakService } from 'keycloak-angular';

/**
 * Modal responsible for acquiring and enforcing student consent for D.A.L.A. telemetry.
 *
 * Workflow & State Rules:
 * - 'prompt': Initial request asking the user to grant or revoke consent.
 * - 'rejected_warning': Blocking screen shown when consent is REVOKED. Without consent,
 *   game sessions cannot be recorded or evaluated by educators, blocking access to play.
 * - Fail-Open Policy on Acceptance: If the student attempts to ACCEPT ('GRANTED') and network
 *   retries fail, we unblock the UI so the user isn't stuck due to transient server issues.
 * - Fail-Closed Policy on Revocation: If consent is 'REVOKED', the modal remains blocking
 *   and allows redirecting back to the main school portal or re-attempting acceptance.
 */
@Component({
  selector: 'app-consent-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showModal" class="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div class="bg-gray-900 border border-gray-700/80 rounded-2xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative animate-fade-in">
        
        <!-- ESTADO 1: Solicitud inicial de consentimiento -->
        <ng-container *ngIf="modalState === 'prompt'">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl font-bold">
              📊
            </div>
            <h2 class="text-xl font-bold text-white tracking-tight">Evaluación y Métricas de Aprendizaje</h2>
          </div>
          
          <p class="mb-6 text-gray-300 text-sm leading-relaxed">
            Para registrar tu desempeño escolar, medir tu evolución y que tus docentes puedan acompañar tu progreso académico, recolectamos datos del juego a través del sistema <span class="font-semibold text-purple-300">D.A.L.A.™</span>.
          </p>

          <div class="flex gap-3 justify-end items-center pt-2">
            <button
              type="button"
              [disabled]="isSubmitting"
              (click)="submitConsent('REVOKED')"
              class="px-4 py-2.5 rounded-xl font-medium text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rechazar
            </button>
            <button
              type="button"
              [disabled]="isSubmitting"
              (click)="submitConsent('GRANTED')"
              class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span *ngIf="!isSubmitting">Aceptar y Jugar</span>
              <span *ngIf="isSubmitting">Guardando...</span>
            </button>
          </div>
        </ng-container>

        <!-- ESTADO 2: Aviso de bloqueo por rechazo -->
        <ng-container *ngIf="modalState === 'rejected_warning'">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl font-bold">
              ⚠️
            </div>
            <h2 class="text-xl font-bold text-amber-400 tracking-tight">Consentimiento Requerido</h2>
          </div>

          <p class="mb-6 text-gray-300 text-sm leading-relaxed">
            Este consentimiento es indispensable para que tus docentes puedan evaluar tu progreso escolar. Sin el registro de actividades, no es posible habilitar la partida.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-end items-stretch sm:items-center pt-2">
            <button
              type="button"
              (click)="goToMainMenu()"
              class="px-4 py-2.5 rounded-xl font-medium text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all text-center"
            >
              Ir al Menú Principal
            </button>
            <button
              type="button"
              [disabled]="isSubmitting"
              (click)="submitConsent('GRANTED')"
              class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-purple-600 hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-600/30 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isSubmitting">Aceptar y Continuar</span>
              <span *ngIf="isSubmitting">Guardando...</span>
            </button>
          </div>
        </ng-container>

      </div>
    </div>
  `
})
export class ConsentModalComponent implements OnInit {
  private consentService = inject(ConsentService);
  private keycloak = inject(KeycloakService);
  
  showModal = false;
  isSubmitting = false;
  modalState: 'prompt' | 'rejected_warning' = 'prompt';

  readonly CURRENT_VERSION = 'v1.0';
  readonly DALA_SCOPE = 'research';

  async ngOnInit() {
    const isLoggedIn = this.keycloak.isLoggedIn();
    if (!isLoggedIn) return;

    this.consentService.getCurrentConsent(this.DALA_SCOPE).subscribe({
      next: (consent) => {
        if (!consent || consent.version !== this.CURRENT_VERSION) {
          this.modalState = 'prompt';
          this.showModal = true;
        } else if (consent.status === 'REVOKED') {
          // If the student previously revoked consent, keep them blocked from playing
          this.modalState = 'rejected_warning';
          this.showModal = true;
        }
      },
      error: () => {
        // If checking consent fails, prompt again
        this.modalState = 'prompt';
        this.showModal = true;
      }
    });
  }

  submitConsent(status: 'GRANTED' | 'REVOKED') {
    this.isSubmitting = true;
    const dto: ConsentDto = {
      version: this.CURRENT_VERSION,
      scope: this.DALA_SCOPE,
      status
    };

    this.consentService
      .updateConsent(dto)
      .pipe(retry({ count: 2, delay: 1500 }))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          if (status === 'GRANTED') {
            this.showModal = false;
          } else {
            // Rejection moves modal to blocking state
            this.modalState = 'rejected_warning';
            this.showModal = true;
          }
        },
        error: (err) => {
          console.warn('[ConsentModal] Error persistiendo consentimiento:', err);
          this.isSubmitting = false;
          if (status === 'GRANTED') {
            // Fail-open policy if the user explicitly intended to accept
            this.showModal = false;
          } else {
            // Fail-closed if revoked
            this.modalState = 'rejected_warning';
            this.showModal = true;
          }
        },
      });
  }

  goToMainMenu() {
    this.showModal = false;
    // Derive the portal URL dynamically at runtime so this works both locally (port 4200)
    // and in production on the VPS without environment config duplication.
    const { protocol, hostname, port } = window.location;
    const portalUrl = port
      ? `${protocol}//${hostname}:4200`
      : `${protocol}//${hostname}`;
    window.location.href = portalUrl;
  }
}
