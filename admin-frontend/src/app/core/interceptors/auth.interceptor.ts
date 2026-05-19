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

/**
 * HTTP Interceptor that:
 * 1. Attaches the Keycloak Bearer token to every outgoing request
 * 2. On 401, attempts a token refresh and retries the request once
 * 3. Logs out the user if the token refresh fails
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.keycloakService.getToken()).pipe(
      switchMap(token => {
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;

        return next.handle(authReq);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return from(this.keycloakService.updateToken(5)).pipe(
            switchMap(() => from(this.keycloakService.getToken())),
            switchMap(newToken =>
              next.handle(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                })
              )
            ),
            catchError((refreshError: unknown) => {
              this.keycloakService.logout();
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
