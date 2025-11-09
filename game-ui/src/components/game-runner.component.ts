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
import { resolveGameLoader } from '../app/games';
import { HistoryService } from '../app/services/history.service';
import { InteractiveContent } from '../app/models/history.model';

@Component({
  selector: 'app-game-runner',
  template: `<ng-container #dynamicComponentContainer></ng-container>`,
})
export class GameRunnerComponent implements OnInit, OnDestroy {
  private static readonly AUTO_ADVANCE_DELAY_MS = 3500;

  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  container!: ViewContainerRef;

  private readonly historyService = inject(HistoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private renderEffectRef: EffectRef | null = null;
  private advanceTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (!this.historyService.currentContent()) {
      const initial = this.historyService.beginJourney();
      if (!initial) {
        console.error('Unable to start history journey. Redirecting to map.');
        this.router.navigate(['../map'], { relativeTo: this.route });
        return;
      }
    }

    this.renderEffectRef = effect(() => {
      const content = this.historyService.currentContent();
      if (!content) {
        this.clearAdvanceTimer();
        if (this.historyService.isJourneyComplete()) {
          this.container.clear();
          this.router.navigate(['../map'], { relativeTo: this.route });
        }
        return;
      }
      this.renderContent(content);
    });
  }

  ngOnDestroy(): void {
    this.renderEffectRef?.destroy();
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
      componentRef.setInput('content', content);
      this.scheduleAdvance();
    } catch (error) {
      console.error(
        `Error loading component for game "${content.gameType}".`,
        error
      );
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
