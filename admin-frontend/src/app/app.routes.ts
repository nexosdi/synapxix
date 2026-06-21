
import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LoginPreviewComponent } from './login-preview/login-preview.component';
import { RegisterPreviewComponent } from './register-preview/register-preview.component';
import { roleGuard } from './core/guards/role.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login-preview',
    component: LoginPreviewComponent,
  },
  {
    path: 'register-preview',
    component: RegisterPreviewComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'teacher',
    canActivate: [roleGuard],
    loadComponent: () =>
      import('./teacher-dashboard/teacher-dashboard.component').then(
        (m) => m.TeacherDashboardComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
