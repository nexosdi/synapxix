import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import {
  GameRunnerComponent,
  HistoryService,
  historyRouteResolver,
  HISTORY_DATA_PROVIDER,
  MockHistoryDataProvider,
} from '@nexosdi.synapxix/game-engine/core';
import { MapComponent } from '../components/map.component';
import { SplashComponent } from '../components/splash.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { RoadmapBuilderComponent } from '../teachers-form/roadmap-builder.component';


export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
  },
 { path: 'dashboard',
   component: DashboardComponent, 
   canActivate: [AuthGuard] },
  {
    path: 'history/:historyId',
    canActivate: [AuthGuard],
    providers: [
      HistoryService,
      MockHistoryDataProvider,
      { provide: HISTORY_DATA_PROVIDER, useExisting: MockHistoryDataProvider },
    ],
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
  // Esta ruta captura cualquier error de tipeo en la URL y vuelve al inicio
  {
    path: '**',
    redirectTo: '',
  },
];