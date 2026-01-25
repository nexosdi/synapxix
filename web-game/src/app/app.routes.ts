import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import {
  GameRunnerComponent,
  HistoryService,
  historyRouteResolver,
} from '@nexosdi.synapxix/game-engine/core';
import { MapComponent } from '../components/map.component';
import { SplashComponent } from '../components/splash.component';
import { RoadmapBuilderComponent } from '../teachers-form/roadmap-builder.component';


export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
  },
  {
    path: 'history/:historyId',
    providers: [HistoryService],
    // canActivate: [AuthGuard],
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
      {
        path: 'admin/builder',
        component: RoadmapBuilderComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
