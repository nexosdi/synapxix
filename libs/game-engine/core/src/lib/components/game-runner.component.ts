import {
  Component,
  EffectRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { resolveGameLoader } from '../game-registry';
import { HistoryService } from '../services/history.service';
import { InteractiveContent } from '../models/history.model';

@Component({
  selector: 'lib-game-runner',
  standalone: true,
  template: `<ng-container #dynamicComponentContainer></ng-container>`,
})
export class GameRunnerComponent implements OnInit, OnDestroy {
  /** * Aumentado a 60 segundos para que te de tiempo a probar e interactuar 
   * con el juego de "Read & Select" sin que se pase solo.
   */
  private static readonly AUTO_ADVANCE_DELAY_MS = 60000; 

  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  container!: ViewContainerRef;

  private readonly historyService = inject(HistoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private advanceTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * EL CAMBIO CLAVE: Definimos el efecto aquí arriba (field initializer).
   * Esto garantiza que Angular tenga el "Injection Context" correcto.
   */
  private readonly renderEffect = effect(() => {
    const content = this.historyService.currentContent();
    
    if (!content) {
      this.clearAdvanceTimer();
      if (this.historyService.isJourneyComplete()) {
        this.container.clear();
        this.router.navigate(['../map'], { relativeTo: this.route });
      }
      return;
    }

    // Si hay contenido, lo renderizamos
    this.renderContent(content);
  });

  ngOnInit(): void {
    // Aquí solo gestionamos el inicio del viaje si no hay nada cargado
    if (!this.historyService.currentContent()) {
      const initial = this.historyService.beginJourney();
      if (!initial) {
        console.error('Unable to start history journey. Redirecting to map.');
        this.router.navigate(['../map'], { relativeTo: this.route });
        return;
      }
    }
  }

  ngOnDestroy(): void {
    // El efecto se destruye automáticamente al ser una propiedad de clase
    this.clearAdvanceTimer();
  }

  private async renderContent(content: InteractiveContent): Promise<void> {
    const loader = resolveGameLoader(content.gameType);
    if (!loader) {
      console.error(`No loader registered for game type "${content.gameType}".`);
      return;
    }

    try {
      this.container.clear();
      const componentRef = this.container.createComponent(await loader(), {
        index: 0,
      });

      // Inyectamos los datos al componente dinámico
      componentRef.setInput('content', content);
      
      this.scheduleAdvance();
    } catch (error) {
      console.error(`Error loading component for game "${content.gameType}".`, error);
    }
  }

  private scheduleAdvance(): void {
    this.clearAdvanceTimer();
    if (!this.historyService.hasNextContent()) {
      return;
    }
    this.advanceTimer = setTimeout(() => {
      this.historyService.advanceToNext();
    }, GameRunnerComponent.AUTO_ADVANCE_DELAY_MS);
  }

  private clearAdvanceTimer(): void {
    if (this.advanceTimer) {
      clearTimeout(this.advanceTimer);
      this.advanceTimer = null;
    }
  }
}