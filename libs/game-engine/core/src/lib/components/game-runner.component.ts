import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Type,
  effect,
  inject,
  ComponentRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { resolveGameLoader } from '../game-registry';
import { HistoryService } from '../services/history.service';
import { GameSessionService } from '../services/game-session.service';
import { GameFlowService } from '../services/game-flow.service';
import { InteractiveContent } from '../models/history.model';
import { BaseGameComponent } from './base-game.component';
import { AnyGameResult } from '../models/game-result.model';
import { GamePerformanceService } from '../services/game-performance.service';

@Component({
  selector: 'lib-game-runner',
  standalone: true,
  template: `
    <!-- Loading bar -->
    @if (flowService.isLoading()) {
      <div class="fixed top-0 left-0 w-full p-2 bg-gray-600 text-white text-center text-xs z-50">
        Loading...
      </div>
    }

    <!-- Answering overlay (global, not per-game) -->
    @if (flowService.isAnswering()) {
      <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-800/10 backdrop-blur-[1px] animate-in fade-in duration-200">
        <div class="flex flex-col items-center gap-4 bg-white p-8 rounded-full shadow-xl border-2 border-slate-200">
          <div class="h-12 w-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Validando...</span>
        </div>
      </div>
    }

    <!-- Feedback bar -->
    @if (flowService.isFeedback()) {
      <div class="fixed top-0 left-0 w-full p-4 bg-green-600 text-white flex justify-between z-50">
        <span>Respuesta registrada.</span>
        <button (click)="onManualAdvance()" class="bg-white text-green-600 px-4 py-1 rounded font-bold shadow">Continuar</button>
      </div>
    }

    <!-- Completed message -->
    @if (flowService.isCompleted()) {
      <div class="p-8 text-center text-green-600 font-bold text-2xl">
        ¡Viaje Completado! Regresando al mapa...
      </div>
    }

    <!-- Dynamic Game Mount -->
    <ng-container #dynamicComponentContainer></ng-container>
  `,
})
export class GameRunnerComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  container!: ViewContainerRef;

  private readonly historyService = inject(HistoryService);
  private readonly sessionService = inject(GameSessionService);
  protected readonly flowService = inject(GameFlowService);
  private readonly performanceService = inject(GamePerformanceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private currentComponentRef: ComponentRef<BaseGameComponent> | null = null;
  private completionRedirectTimer: ReturnType<typeof setTimeout> | null = null;
  /** High-resolution timestamp (ms) when the current game entered PLAYING */
  private playStartMs: number | null = null;
  /** Tracks the ID of the content currently being loaded defensively against concurrent renders */
  private pendingRenderId: string | null = null;

  private readonly renderEffect = effect(() => {
    // Reactively listen to content changes
    const content = this.historyService.currentContent();
    
    // If no more content
    if (!content) {
      if (this.historyService.isJourneyComplete()) {
        this.flowService.completeJourney();
        this.sessionService.completeSession();
        this.performanceService.flush();
        this.container?.clear();
        
        // Wait briefly so they read the finished message
        this.completionRedirectTimer = setTimeout(() => {
          this.router.navigate(['../map'], { relativeTo: this.route });
        }, 2000);
      }
      return;
    }

    // Only render when we expect fresh loads (not during feedback or answering)
    if (this.flowService.isLoading() || this.flowService.isAdvancing() || this.flowService.isIdle()) {
      // Prevent double calls for the same content during async loading
      const currentRenderedId = this.currentComponentRef?.instance?.content
        ? (this.currentComponentRef.instance.content as any).id
        : undefined;
        
      if (currentRenderedId !== content.id && this.pendingRenderId !== content.id) {
        this.pendingRenderId = content.id;
        this.renderContent(content);
      }
    }
  });

  private readonly disabledEffect = effect(() => {
    // Keep the disabled input in sync reactively
    const isDisabled = this.flowService.isInteractionDisabled();
    if (this.currentComponentRef) {
      this.currentComponentRef.setInput('disabled', isDisabled);
    }
  });

  ngOnInit(): void {
    // Reset flow for a fresh start
    this.flowService.reset();

    // Register the advance callback so the flow service can drive the history
    this.flowService.onAutoAdvance(() => {
      this.historyService.advanceToNext();
    });

    // Start loading
    this.flowService.startLoading();

    // Begin the journey
    if (!this.historyService.currentContent()) {
      const initial = this.historyService.beginJourney();
      if (!initial) {
        console.error('Unable to start history journey. Redirecting to map.');
        this.router.navigate(['../map'], { relativeTo: this.route });
        return;
      }
    }

    const firstContent = this.historyService.currentContent();
    if (firstContent && this.sessionService.currentSession() === null) {
      const historyContext = this.historyService.activeHistory();
      const historyId = historyContext?.id || 'unknown';
      const totalGames = historyContext?.contentMap.length || 0;
      const category = historyContext?.category;

      // Sin user, se fuerza a que sea null haciendo un return, hay que integrarlo a keycloak luego
      const userId: string | null = null;
      if (!userId) {
        console.error('GameRunner: no authenticated user, aborting session.');
        return;
      }
      this.sessionService.startSession(historyId, userId, totalGames, category);
    }
  }

  ngOnDestroy(): void {
    if (this.completionRedirectTimer) {
      clearTimeout(this.completionRedirectTimer);
    }
    // The flow service manages its own timers — we just need to
    // unregister our callback to prevent zombie calls
    this.flowService.clearAutoAdvance();

    // Prevent stale state from leaking into the next session
    this.historyService.cleanup();
  }

  private async renderContent(content: InteractiveContent): Promise<void> {
    const loader = resolveGameLoader(content.gameType);
    if (!loader) {
      console.error('No loader registered for game type', content.gameType);
      return;
    }

    // Ensure we are in LOADING state for the UI
    if (!this.flowService.isLoading()) {
      this.flowService.startLoading();
    }

    try {
      const componentClass = await loader();
      
      // Clear right before mounting to guarantee atomic replacement 
      // preventing any race condition append overlaps.
      this.container.clear();
      this.currentComponentRef = this.container.createComponent<BaseGameComponent>(componentClass as Type<BaseGameComponent>);

      // Inject content
      this.currentComponentRef.setInput('content', content);
      
      // Inject disabled state — all games receive this
      this.currentComponentRef.setInput('disabled', this.flowService.isInteractionDisabled());

      // Wire up answer event
      if (this.currentComponentRef.instance.answerSubmitted) {
        this.currentComponentRef.instance.answerSubmitted.subscribe((result: AnyGameResult) => {
          this.onAnswerSubmitted(content.id, result);
        });
      }
      
      // Wire up optional interaction events for better reaction timing
      if (this.currentComponentRef.instance.firstInteraction) {
        this.currentComponentRef.instance.firstInteraction.subscribe(() => {
           this.performanceService.markFirstInteraction(content.id);
        });
      }

      // Transition LOADING → READY (the READY → PLAYING transition is handled by GameFlowService hooks)
      if (this.flowService.isLoading()) {
        this.flowService.contentReady();
        // Performance tracking starts when PLAYING is entered (via hook)
        this.flowService.stateMachine.registerHooks('PLAYING', {
          onEnter: () => {
            this.playStartMs = performance.now();
            this.performanceService.markPlayStart(content.id);
          },
        });
      }

    } catch (error) {
      console.error('Error loading component for game', content.gameType, error);
    }
  }

  private onAnswerSubmitted(contentId: string, result: AnyGameResult): void {
    // 1. Transition to ANSWERING (all timed transitions are handled by GameFlowService)
    this.flowService.answerSubmitted();

    // 2. Calculate real elapsed time at the runner level
    //    This replaces the hardcoded `timeSpentMs: 0` that games emit.
    const now = performance.now();
    const realTimeSpentMs = this.playStartMs != null
      ? Math.round(now - this.playStartMs)
      : result.timeSpentMs;
    this.playStartMs = null;

    const enrichedResult: AnyGameResult = { ...result, timeSpentMs: realTimeSpentMs };

    // 3. Record the attempt + performance event
    const currentSession = this.sessionService.currentSession();
    this.sessionService.submitAttempt(contentId, enrichedResult);
    if (currentSession) {
      this.performanceService.recordPerformance(contentId, enrichedResult, currentSession);
    }

    // That's it! The flow service handles:
    // ANSWERING →(800ms)→ FEEDBACK →(4500ms)→ ADVANCING (auto)
  }

  public onManualAdvance(): void {
    this.flowService.advanceNext();
  }
}