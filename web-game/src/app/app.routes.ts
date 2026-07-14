import { Routes } from '@angular/router';
import { keycloakAuthGuard } from './guards/keycloak-auth.guard';
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
import { ShopComponent } from '../components/shop/shop.component';


/**
 * Definición de rutas del web-game.
 * Las rutas protegidas (ej. shop, dashboard e history) utilizan el guard
 * `keycloakAuthGuard` para requerir token válido desde el servidor Keycloak del VPS.
 * La ruta raíz (splash) es pública.
 */
export const routes: Routes = [
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [keycloakAuthGuard],
  },
  {
    path: '',
    component: SplashComponent,
  },
 { path: 'dashboard',
   component: DashboardComponent, 
   canActivate: [keycloakAuthGuard],
 },
  {
    path: 'history/:historyId',
    canActivate: [keycloakAuthGuard],
    providers: [
      HistoryService,
      MockHistoryDataProvider,
      { provide: HISTORY_DATA_PROVIDER, useExisting: MockHistoryDataProvider },
    ],
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