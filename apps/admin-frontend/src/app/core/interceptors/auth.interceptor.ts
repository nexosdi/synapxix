import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
    // 1. Obtener el token de forma síncrona si es posible o esperar a la promesa
    return from(this.keycloakService.getToken()).pipe(
      switchMap(token => {
        // 2. Si hay token, añadirlo. Si no, seguir sin él (el backend responderá 401 si es necesario)
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        
        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        // Manejar errores de autenticación (401 Unauthorized)
        if (error.status === 401) {
          console.warn('⚠️ Token expirado, intentando renovar...');
          
          return from(this.keycloakService.updateToken(5)).pipe(
            switchMap(() => from(this.keycloakService.getToken())),
            switchMap(newToken => {
              console.log('✅ Token renovado, reintentando petición...');
              return next.handle(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                })
              );
            }),
            catchError((err) => {
              console.error('❌ No se pudo renovar el token:', err);
              this.keycloakService.logout();
              return throwError(() => error);
            })
          );
        }

        if (error.status === 403) {
          console.error('❌ Acceso denegado: no tienes permisos para esta acción');
        }

        return throwError(() => error);
      })
    );
  }
}
