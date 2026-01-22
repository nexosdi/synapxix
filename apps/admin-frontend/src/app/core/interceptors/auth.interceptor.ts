import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
    // 1. Convertir la promesa del token a Observable
    return new Observable<string>(observer => {
      this.keycloakService.getToken()
        .then(token => {
          observer.next(token);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    }).pipe(
      switchMap(token => {
        // 2. Si hay token, añadirlo al header Authorization
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        
        // 3. Pasar la petición al siguiente interceptor
        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        // 4. Manejar errores de autenticación
        if (error.status === 401) {
          console.warn('⚠️ Token expirado o inválido, intentando renovar...');
          
          // Intentar renovar el token antes de desconectar
          return new Observable<HttpEvent<any>>(observer => {
            this.keycloakService.updateToken(5)
              .then(refreshed => {
                if (refreshed) {
                  console.log('✅ Token renovado exitosamente, reintentando petición...');
                  
                  // Obtener el nuevo token y reintentar la petición original
                  this.keycloakService.getToken()
                    .then(newToken => {
                      const clonedReq = req.clone({
                        setHeaders: {
                          Authorization: `Bearer ${newToken}`,
                        },
                      });
                      
                      // Reintentar la petición con el nuevo token
                      next.handle(clonedReq).subscribe({
                        next: (event) => observer.next(event),
                        error: (err) => observer.error(err),
                        complete: () => observer.complete()
                      });
                    })
                    .catch(err => {
                      console.error('❌ Error obteniendo nuevo token:', err);
                      this.keycloakService.logout();
                      this.router.navigate(['/login']);
                      observer.error(error);
                    });
                } else {
                  // Token no se pudo renovar (refresh token expirado)
                  console.warn('⚠️ No se pudo renovar el token, cerrando sesión...');
                  this.keycloakService.logout();
                  this.router.navigate(['/login']);
                  observer.error(error);
                }
              })
              .catch(err => {
                console.error('❌ Error renovando token:', err);
                this.keycloakService.logout();
                this.router.navigate(['/login']);
                observer.error(error);
              });
          });
        }

        if (error.status === 403) {
          console.error('❌ Acceso denegado: no tienes permisos para esta acción');
        }

        return throwError(() => error);
      })
    );
  }
}
