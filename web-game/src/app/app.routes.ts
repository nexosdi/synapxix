import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import {
  GameRunnerComponent,
  HistoryService,
  historyRouteResolver,
} from '@nexosdi.synapxix/core';
import { MapComponent } from '../components/map.component';
import { SplashComponent } from '../components/splash.component';

export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
  },
  {
    path: 'history/:historyId',
    providers: [HistoryService],
    canActivate: [AuthGuard],
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
