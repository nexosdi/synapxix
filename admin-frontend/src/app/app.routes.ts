import { Route } from '@angular/router';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { AuthGuard } from './keycloak-auth.guard';
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
>>>>>>> 77a51fb (eliminar keycloak)
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LoginPreviewComponent } from './login-preview/login-preview.component';
import { RegisterPreviewComponent } from './register-preview/register-preview.component';

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
    canActivate: [AuthGuard],
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
>>>>>>> 77a51fb (eliminar keycloak)
  },
  {
    path: '**',
    redirectTo: 'login',
  },
<<<<<<< HEAD
<<<<<<< HEAD
];
=======
];
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
];
>>>>>>> 77a51fb (eliminar keycloak)
