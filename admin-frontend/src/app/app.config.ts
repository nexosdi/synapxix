<<<<<<< HEAD
<<<<<<< HEAD
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
// import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
=======
import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
// import { provideClientHydration } from '@angular/platform-browser';
import { KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './keycloak-initializer';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
>>>>>>> 77a51fb (eliminar keycloak)

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
<<<<<<< HEAD
<<<<<<< HEAD
  ],
};
=======
    KeycloakService,
    // Registrar el interceptor HTTP para autenticación
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
};
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
  ],
};
>>>>>>> 77a51fb (eliminar keycloak)
