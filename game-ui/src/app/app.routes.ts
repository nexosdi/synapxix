import { Routes } from '@angular/router';
import { MapComponent } from '../components/map.component';
import { SplashComponent } from '../components/splash.component';
import { GameComponent } from '../games/level-1/level.component';

export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'game/:gameCode',
    component: GameComponent,
  },
];
