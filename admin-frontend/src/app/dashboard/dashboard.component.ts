import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { CognitiveChartsComponent } from './cognitive-charts/cognitive-charts.component';
import { environment } from '../../environments/environment';

interface BalanceResponse {
  credits: number;
  experience_points: number;
}

interface CognitiveMetrics {
  memory: number;
  reading: number;
  speech: number;
}

interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  svgPath: string;
  gradient: string;
  /** historyId in the web-game app to navigate to (e.g. 'onboarding') */
  historyId: string;
  tag: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChatbotComponent, CognitiveChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly username = signal<string>('Student');
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly credits = signal<number>(0);
  readonly experiencePoints = signal<number>(0);

  /** Placeholder metric data — ready to be wired when GET /evaluative/summary exists */
  readonly cognitiveMetrics = signal<CognitiveMetrics>({
    memory: 0,
    reading: 0,
    speech: 0,
  });

  readonly level = computed(() => Math.floor(this.experiencePoints() / 500) + 1);
  readonly xpInCurrentLevel = computed(() => this.experiencePoints() % 500);
  readonly xpProgressPercent = computed(() => Math.round((this.xpInCurrentLevel() / 500) * 100));

  readonly categories: ExerciseCategory[] = [
    {
      id: 'linguistic',
      name: 'Linguistic',
      description: 'Reading comprehension, vocabulary and writing exercises.',
      // Book open icon
      svgPath: 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      // TODO: Replace 'onboarding' with the real historyId for linguistic exercises
      // once the backend serves history records per category from the DB.
      historyId: 'onboarding',
      tag: 'Language',
    },
    {
      id: 'logical',
      name: 'Logical',
      description: 'Mathematical reasoning, patterns and problem solving.',
      // Function icon
      svgPath: 'M 7.5 4 C 7.5 4 5 4 5 6.5 L 5 17.5 C 5 17.5 5 20 7.5 20 L 16.5 20 C 16.5 20 19 20 19 17.5 L 19 6.5 C 19 6.5 19 4 16.5 4 Z M 9 8 L 15 8 M 9 12 L 15 12 M 9 16 L 12 16',
      gradient: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)',
      // TODO: Replace with real historyId for logical exercises
      historyId: 'onboarding',
      tag: 'Reasoning',
    },
    {
      id: 'spatial',
      name: 'Spatial',
      description: 'Visual memory, map navigation and spatial reasoning.',
      // Map icon
      svgPath: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)',
      // TODO: Replace with real historyId for spatial exercises
      historyId: 'onboarding',
      tag: 'Visual',
    },
    {
      id: 'musical',
      name: 'Musical',
      description: 'Sound recognition, rhythm and auditory memory.',
      // Music note icon
      svgPath: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #db2777 100%)',
      // TODO: Replace with real historyId for musical exercises
      historyId: 'onboarding',
      tag: 'Auditory',
    },
  ];

  ngOnInit(): void {
    // TODO: Replace hardcoded username with real value from Auth0/Keycloak token
    // once the authentication flow is integrated (user_name from JWT claims).
    this.loadBalance();

    // TODO: Wire to GET /evaluative/summary (pending backend endpoint).
    // That endpoint should return { memory: number, reading: number, speech: number }
    // each as a 0–100 score. Until then, metrics display as empty progress bars.
    this.loadCognitiveMetrics();
  }

  private loadCognitiveMetrics(): void {
    // Intentionally left with zero values until GET /evaluative/summary exists.
    // Replace this method body with an HTTP call when the endpoint is available:
    //
    //   this.http.get<CognitiveMetrics>(`${environment.apiUrl}/evaluative/summary`)
    //     .pipe(catchError(() => of({ memory: 0, reading: 0, speech: 0 })))
    //     .subscribe(metrics => this.cognitiveMetrics.set(metrics));
    this.cognitiveMetrics.set({ memory: 0, reading: 0, speech: 0 });
  }

  private loadBalance(): void {
    this.loading.set(true);
    this.error.set(null);

    /**
     * NOTE: The economy endpoint is JWT-protected. In this sprint we attempt the real call
     * and gracefully fall back to zeros if the token is not yet available.
     * Once Auth0/Keycloak is integrated, the AuthInterceptor will attach the token automatically.
     */
    this.http
      .get<BalanceResponse>(`${environment.apiUrl}/economy/balance`)
      .pipe(
        catchError(() => {
          // Graceful fallback — not an error state for the user
          return of({ credits: 0, experience_points: 0 });
        })
      )
      .subscribe((balance) => {
        this.credits.set(balance.credits);
        this.experiencePoints.set(balance.experience_points);
        this.loading.set(false);
      });
  }

  /**
   * Navigates to the web-game app for the given history.
   * Uses window.location.href because web-game is a separate Angular application
   * running on a different origin (port 4300 in dev, app.synapxix.com in prod).
   * TODO: Replace hardcoded historyId with real per-category history IDs
   * once the backend returns history records per SubjectCategory.
   */
  navigateTo(historyId: string): void {
    window.location.href = `${environment.gameAppUrl}/history/${historyId}/map`;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  getUserInitial(): string {
    return this.username().charAt(0).toUpperCase();
  }

  retry(): void {
    this.loadBalance();
  }
}