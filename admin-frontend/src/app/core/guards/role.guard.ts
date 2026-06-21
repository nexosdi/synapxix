import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Role guard — restricts access to teacher/admin routes.
 *
 * Current behaviour (demo mode):
 *   Reads `localStorage.getItem('role')` and allows access only when the value
 *   is 'teacher' or 'admin'. Redirects to /login for any other value (or no value).
 *
 * TODO: Once Auth0/Keycloak is integrated, replace the localStorage check with
 *   a real JWT role claim verification:
 *
 *   const authService = inject(AuthService);
 *   return authService.user$.pipe(
 *     map(user => {
 *       const roles: string[] = user?.['https://synapxix.com/roles'] ?? [];
 *       if (roles.includes('teacher') || roles.includes('admin')) return true;
 *       router.navigate(['/login']);
 *       return false;
 *     })
 *   );
 */
export const roleGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role === 'teacher' || role === 'admin') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
