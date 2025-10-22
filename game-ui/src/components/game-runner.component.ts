import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { resolveGameLoader } from '../app/games';
import { HistoryService } from '../app/services/history.service';

@Component({
  selector: 'app-game-runner',
  template: `<ng-container #dynamicComponentContainer></ng-container>`,
})
export class GameRunnerComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  container!: ViewContainerRef;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly historyService: HistoryService
  ) {}

  async ngOnInit() {
    const contentId = this.route.snapshot.paramMap.get('gameCode');
    if (!contentId) {
      console.error('No game code provided in the route.');
      return;
    }

    const content = this.historyService.getInteractiveContentById(contentId);
    if (!content) {
      console.error(`Interactive content for id "${contentId}" not found.`);
      return;
    }

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
    } catch (error) {
      console.error(
        `Error loading component for game "${content.gameType}" (${contentId}):`,
        error
      );
    }
  }
}
