import { Routes } from '@angular/router';
import { GameRunnerComponent } from '../components/game-runner.component';
import { MapComponent } from '../components/map.component';
import { SplashComponent } from '../components/splash.component';
import { historyRouteResolver } from './services/history-route.resolver';
import { HistoryService } from './services/history.service';

export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
  },
  {
    path: 'history/:historyId',
    providers: [HistoryService],
    resolve: {
      historyReady: historyRouteResolver,
    },
    children: [
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
      {
        path: 'map',
        component: MapComponent,
      },
      {
        path: 'game',
        component: GameRunnerComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
