import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

/**
 * Interceptor HTTP para:
 * 1. Añadir token de Keycloak a cada petición
 * 2. Manejar errores de autenticación (401, 403)
 * 3. Redirigir a login si el token expiró
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 1. Obtener el token de Keycloak
    const token = this.keycloakService.getToken();

    // 2. Si hay token, añadirlo al header Authorization
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // 3. Pasar la petición al siguiente interceptor o al servidor
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // 4. Manejar errores de autenticación
        if (error.status === 401) {
          console.warn('⚠️ Token expirado o inválido, redirigiendo a login...');
          this.keycloakService.logout();
          this.router.navigate(['/login']);
        }

        if (error.status === 403) {
          console.error('❌ Acceso denegado: no tienes permisos para esta acción');
          // Opcional: mostrar mensaje al usuario
        }

        return throwError(() => error);
      })
    );
  }
}
