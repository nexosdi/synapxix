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
    router.navigate(['/history', HISTORY_MOCK.id, 'map']);
    return false;
  }

  return true;
};
