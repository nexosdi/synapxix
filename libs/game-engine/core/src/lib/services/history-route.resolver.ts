import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { HISTORY_MOCK } from '../history-mock';
import { HistoryService } from './history.service';

export const historyRouteResolver: ResolveFn<boolean> = async (route) => {
  const historyService = inject(HistoryService);
  const router = inject(Router);

  const historyId = route.paramMap.get('historyId');
  if (!historyId) {
    router.navigate(['/']);
    return false;
  }

  const loaded = await historyService.loadHistory(historyId);
  if (!loaded) {
    // Prevent circular redirection loop: if the mock history itself failed to load,
    // fallback to the home route ('/') instead of recursively targeting HISTORY_MOCK.
    if (historyId !== HISTORY_MOCK.id) {
      router.navigate(['/history', HISTORY_MOCK.id, 'map']);
    } else {
      router.navigate(['/']);
    }
    return false;
  }

  return true;
};
