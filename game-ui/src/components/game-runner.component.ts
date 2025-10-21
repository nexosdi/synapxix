import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { games } from '../app/games';

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

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const gameCode = this.route.snapshot.paramMap.get('gameCode');
    if (gameCode) {
      try {
        const component = games[gameCode];

        if (component) {
          this.container.createComponent(await component.componentLoader(), {
            index: 0,
          });
        } else {
          console.error(`Component for game code "${gameCode}" not found.`);
        }
      } catch (error) {
        console.error(
          `Error loading game module for code "${gameCode}":`,
          error
        );
      }
    } else {
      console.error('No game code provided in the route.');
    }
  }
}
