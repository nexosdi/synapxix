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
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { resolveGameLoader } from '../game-registry';
import { HistoryService } from '../services/history.service';
import { GameSessionService } from '../services/game-session.service';
import { GameFlowService } from '../services/game-flow.service';
import { SseStreamService } from '../services/sse-stream.service';
import { InteractiveContent } from '../models/history.model';
import { BaseGameComponent } from './base-game.component';
import { AnyGameResult } from '../models/game-result.model';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

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

    <!-- Feedback overlay — Synapxix branded modal -->
    @if (flowService.isFeedback()) {
      <div
        class="fixed inset-0 flex items-center justify-center p-4"
        style="z-index: 9999; background: rgba(30,0,60,0.55); backdrop-filter: blur(8px);"
        role="dialog"
        aria-modal="true"
        aria-label="Exercise Result"
      >
        <div
          class="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
          style="background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); border: 1.5px solid rgba(255,255,255,0.7);"
        >
          <!-- Colored header -->
          <div
            class="relative px-8 pt-10 pb-8 flex flex-col items-center gap-4 text-white overflow-hidden"
            [style.background]="feedbackResult()?.isCorrect
              ? 'linear-gradient(135deg, #5b21b6 0%, #2e1065 100%)'
              : 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)'"
          >
            <!-- Logo in corner -->
            <img
              src="/logo.png"
              alt="Synapxix"
              class="absolute top-4 right-4 h-8 w-8 object-contain mix-blend-screen opacity-90"
              aria-hidden="true"
            />

            <!-- Decorative background elements -->
            <div class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl"></div>

            <!-- Premium Icon Badge -->
            <div class="relative z-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white shadow-2xl ring-8 ring-white/20"
                 [class.shadow-emerald-900]="feedbackResult()?.isCorrect"
                 [class.shadow-rose-900]="!feedbackResult()?.isCorrect"
                 style="transform: rotate(-3deg);">
              @if (feedbackResult()?.isCorrect) {
                <!-- Success Star Icon -->
                <svg class="h-10 w-10 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div class="absolute -top-1 -right-1 h-5 w-5 animate-ping rounded-full bg-emerald-400 opacity-60"></div>
              } @else {
                <!-- Try Again Icon -->
                <svg class="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            </div>

            <h3 class="relative z-10 mt-2 text-3xl font-black italic text-center tracking-tight text-white drop-shadow-md">
              {{ feedbackResult()?.isCorrect ? 'Excellent!' : 'Keep it up!' }}
            </h3>
            
            <!-- Score badges -->
            <div class="relative z-10 flex gap-3 mt-2 w-full justify-center">
              <div class="flex flex-col items-center bg-black/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10 shadow-inner w-1/2">
                <span class="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Score</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-3xl font-black text-white">{{ feedbackResult()?.score ?? 0 }}</span>
                  <span class="text-sm font-bold text-white/50">/100</span>
                </div>
              </div>
              <div class="flex flex-col items-center bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 shadow-lg w-1/2">
                <span class="text-[10px] font-black uppercase tracking-widest text-white/90 mb-1">Experience</span>
                <span class="text-3xl font-black text-white drop-shadow-sm">+{{ feedbackXp() }}</span>
              </div>
            </div>
          </div>

          <!-- Feedback text body -->
          <div class="px-8 py-6 flex flex-col gap-5">
            @if (flowService.feedbackContent() || feedbackResult()?.feedback) {
              <div class="rounded-2xl px-5 py-4 ring-1"
                [style]="feedbackResult()?.isCorrect
                  ? 'background:rgba(52,211,153,0.08);border-color:rgba(52,211,153,0.25)'
                  : 'background:rgba(248,113,113,0.08);border-color:rgba(248,113,113,0.25)'"
              >
                <p class="text-[10px] font-black uppercase tracking-widest mb-1.5"
                  [style.color]="feedbackResult()?.isCorrect ? '#059669' : '#dc2626'"
                >AI Feedback</p>
                <p class="text-sm font-semibold text-gray-700 leading-relaxed">
                  {{ flowService.feedbackContent() || feedbackResult()?.feedback }}
                  @if (flowService.feedbackContent() && !feedbackResult()?.feedback) {
                    <span class="inline-block w-1.5 h-4 bg-violet-500 animate-pulse ml-0.5 align-text-bottom rounded-sm"></span>
                  }
                </p>
              </div>
            }

            <button
              id="feedback-continue-btn"
              type="button"
              (click)="onManualAdvance()"
              class="w-full py-4 rounded-2xl text-white text-sm font-black tracking-wide shadow-lg transition-transform active:scale-95"
              style="background: linear-gradient(135deg,#b794f4 0%,#f687b3 45%,#fbd38d 100%);"
            >
              Continue →
            </button>
          </div>
        </div>
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  // Default base URL for API, normally injected or from environment
  private readonly apiUrl = '/api/game-session';
  private readonly researchApiUrl = '/api/research';

  private currentComponentRef: ComponentRef<BaseGameComponent> | null = null;
  private completionRedirectTimer: ReturnType<typeof setTimeout> | null = null;
  /** High-resolution timestamp (ms) when the current game entered PLAYING */
  private playStartMs: number | null = null;
  /** Tracks the ID of the content currently being loaded defensively against concurrent renders */
  private pendingRenderId: string | null = null;
  /** Subscription to the active SSE stream for cleanup */
  private streamSubscription: Subscription | null = null;

  private readonly sseStream = inject(SseStreamService);
  private readonly destroyRef = inject(DestroyRef);

  /** Stores the last result emitted by a game so the feedback modal can display real AI data */
  protected readonly feedbackResult = signal<AnyGameResult | null>(null);

  /** XP to display in the feedback modal: 50% of score, minimum 5 */
  protected readonly feedbackXp = computed(() => {
    const score = this.feedbackResult()?.score ?? 0;
    return Math.max(5, Math.round(score * 0.5));
  });

  private readonly renderEffect = effect(() => {
    // Reactively listen to content changes
    const content = this.historyService.currentContent();
    
    // If no more content
    if (!content) {
      if (this.historyService.isJourneyComplete() && !this.flowService.isCompleted()) {
        this.flowService.completeJourney();
        this.sessionService.completeSession();
        this.container?.clear();
        
        // Enviar a backend para completar la sesión real
        const session = this.sessionService.currentSession();
        if (session) {
          this.http.post(`${this.apiUrl}/${session.id}/complete`, {}).subscribe({
            error: (err) => console.error('Failed to complete session on backend', err)
          });
        }
        
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

      // Auth0 / user logic: We use null for now until we define Auth0 / Keycloak 
      const userId: string | null = null;
      
      // Enviamos la petición al backend para iniciar sesión.
      // Cuando tengamos el session ID real, actualizamos el modelo.
      this.http.post<{sessionId: string}>(`${this.apiUrl}/start`, { 
        historyId, 
        category, 
        userId 
      }).subscribe({
        next: (res) => {
          // Usamos el ID devuelto por el backend para mantener la sincronización exacta
          this.sessionService.startSession(historyId, userId ?? '', totalGames, category, res.sessionId);
        },
        error: (err) => {
          console.warn('Backend session start failed, continuing with local session', err);
          this.sessionService.startSession(historyId, userId ?? '', totalGames, category);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.completionRedirectTimer) {
      clearTimeout(this.completionRedirectTimer);
    }
    // Cancel any active SSE stream to prevent memory leaks
    this.cleanupStream();
    // The flow service manages its own timers — we just need to
    // unregister our callback to prevent zombie calls
    this.flowService.clearAutoAdvance();
    this.flowService.clearFeedbackContent();

    // Prevent stale state from leaking into the next session
    this.historyService.resetJourney();
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
      
      // Transition LOADING → READY (the READY → PLAYING transition is handled by GameFlowService hooks)
      if (this.flowService.isLoading()) {
        this.flowService.contentReady();
        this.flowService.stateMachine.registerHooks('PLAYING', {
          onEnter: () => {
            this.playStartMs = performance.now();
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

    const completedQuickly = realTimeSpentMs < 60000;
    const enrichedResult: AnyGameResult = { ...result, timeSpentMs: realTimeSpentMs };

    // 3. Store result so the feedback modal can show real AI data
    this.feedbackResult.set(enrichedResult);

    // 4. Record the attempt
    const currentSession = this.sessionService.currentSession();
    this.sessionService.submitAttempt(contentId, enrichedResult);
    if (currentSession) {
      // Enviar attempt a backend con completedQuickly
      this.http.post(`${this.apiUrl}/${currentSession.id}/attempt`, {
        contentId,
        gameType: enrichedResult.gameType,
        isCorrect: enrichedResult.isCorrect,
        score: enrichedResult.score,
        completedQuickly
      }).subscribe({
        error: (err) => console.error('Failed to submit attempt to backend', err)
      });
    }

    // 5. Start SSE streaming for AI feedback.
    //    The ANSWERING → FEEDBACK transition is handled ONCE by
    //    flowService.startFeedbackStream() — subsequent chunks only
    //    update feedbackContent without re-transitioning state.
    this.startAiFeedbackStream(enrichedResult);
  }

  /**
   * Opens an SSE POST stream to the research endpoint and accumulates
   * AI-generated feedback tokens into `flowService.feedbackContent`.
   *
   * The FEEDBACK state transition happens exactly once before the stream
   * starts. If the stream fails, the component falls back to the static
   * `feedbackResult().feedback` that was already set.
   */
  private startAiFeedbackStream(result: AnyGameResult): void {
    // Clean up any previous stream
    this.cleanupStream();

    const content = this.historyService.currentContent();
    if (!content) return;

    // Build the payload matching ProcessGameActivityDto
    const payload = {
      studentId: this.sessionService.currentSession()?.userId || 'anonymous',
      gameType: content.gameType,
      gameInput: content,
      studentResult: {
        content: result.answer,
        duration: result.timeSpentMs,
        success: result.isCorrect,
      },
    };

    const { stream$, abort } = this.sseStream.streamPost(
      `${this.researchApiUrl}/process/stream`,
      payload,
    );

    // Transition ANSWERING → FEEDBACK once (the timer-based transition
    // in GameFlowService is bypassed because we drive it manually)
    // We wait a brief moment to show the "Validando..." overlay
    setTimeout(() => {
      this.flowService.startFeedbackStream();

      this.streamSubscription = stream$.subscribe({
        next: (chunk) => {
          this.flowService.appendFeedbackChunk(chunk);
        },
        error: (err) => {
          console.error('AI feedback stream error:', err);
          // Fallback: static feedback already in feedbackResult
        },
        complete: () => {
          // Stream finished — the accumulated text is the full feedback.
          // Update the feedbackResult with the streamed content so the
          // static display also has it.
          const streamedText = this.flowService.feedbackContent();
          if (streamedText) {
            const current = this.feedbackResult();
            if (current) {
              this.feedbackResult.set({ ...current, feedback: streamedText });
            }
          }
        },
      });
    }, this.flowService['_config'].answerToFeedbackDelayMs);
  }

  /**
   * Clean up the active SSE stream subscription.
   * Prevents memory leaks when the user navigates away mid-stream.
   */
  private cleanupStream(): void {
    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
      this.streamSubscription = null;
    }
  }

  public onManualAdvance(): void {
    this.cleanupStream();
    this.flowService.clearFeedbackContent();
    this.feedbackResult.set(null); // Prevent stale state leaking to next game
    this.flowService.advanceNext();
  }
}