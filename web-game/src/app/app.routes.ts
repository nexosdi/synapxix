import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import {
  GameRunnerComponent,
  HistoryService,
  historyRouteResolver,
} from '@nexosdi.synapxix/game-engine/core';
import { MapComponent } from '../components/map.component';
import { SplashComponent } from '../components/splash.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

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
    providers: [HistoryService],
    // El AuthGuard protege esta ruta y todas sus hijas (map y game)
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
  // Esta ruta captura cualquier error de tipeo en la URL y vuelve al inicio
  {
    path: '**',
    redirectTo: '',
  },
];