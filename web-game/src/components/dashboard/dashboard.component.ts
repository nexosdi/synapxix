import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service';
import { CognitiveElement } from './models/CognitiveElement.model';
import { BalanceData, StudentProgressData } from './models/DashboardData.model';
import { SessionSummary } from './models/SessionReport.model';
import { CognitiveService } from './services/Cognitive.service';
import { EconomyService } from './services/Economy.service';
import { GameSessionService } from './services/GameSession.service';
import { CognitiveCardComponent } from './components/CognitiveCard.component';
import { CognitiveChartComponent } from './components/CognitiveCharts.components';
import { BalanceHeaderComponent } from './components/BalanceHeader.component';
import { StudentProgressComponent } from './components/StudentProgress.component';
import { SessionSummaryComponent } from './components/SessionSummary.component';

/**
 * Main Student Dashboard component.
 *
 * Connects four real backend data sources:
 *   1. GET /api/economy/balance                      → credits and XP
 *   2. GET /api/analytics/individual-average/:userId → cognitive metrics
 *   3. GET /api/analytics/student-progress/:userId   → curricular progress
 *   4. GET /api/game-session/me/report               → sessions played
 *
 * Each section is independent: if one endpoint fails, the others keep
 * rendering. "Retry" buttons use standard Angular @Output binding — the
 * child emits, the parent reacts.
 *
 * The Keycloak token flows automatically via KeycloakBearerInterceptor
 * registered in app.config.ts.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CognitiveCardComponent,
    CognitiveChartComponent,
    BalanceHeaderComponent,
    StudentProgressComponent,
    SessionSummaryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./Dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // ── Balance (economy) state ─────────────────────────────────────────
  readonly balance = signal<BalanceData | null>(null);
  readonly balanceLoading = signal(true);
  readonly balanceError = signal(false);

  // ── Cognitive metrics state ─────────────────────────────────────────
  readonly elements = signal<CognitiveElement[]>([]);
  readonly selectedElement = signal<CognitiveElement | null>(null);
  readonly cognitiveLoading = signal(true);
  readonly cognitiveError = signal(false);

  // ── Curricular progress state ───────────────────────────────────────
  readonly studentProgress = signal<StudentProgressData | null>(null);
  readonly progressLoading = signal(true);
  readonly progressError = signal(false);

  // ── Sessions played state ───────────────────────────────────────────
  readonly sessionSummary = signal<SessionSummary | null>(null);
  readonly sessionsLoading = signal(true);
  readonly sessionsError = signal(false);

  private readonly auth = inject(AuthService);
  private readonly cognitiveService = inject(CognitiveService);
  private readonly economyService = inject(EconomyService);
  private readonly gameSessionService = inject(GameSessionService);

  ngOnInit(): void {
    this.loadBalance();
    this.loadCognitiveData();
    this.loadStudentProgress();
    this.loadSessionSummary();
  }

  // ── Load balance ─────────────────────────────────────────────────────

  loadBalance(): void {
    this.balanceLoading.set(true);
    this.balanceError.set(false);

    this.economyService.getBalance().subscribe({
      next: (data) => {
        this.balance.set(data);
        this.balanceLoading.set(false);
      },
      error: (err) => {
        this.balanceLoading.set(false);
        this.balanceError.set(true);
        console.error('Error loading balance:', err);
      },
    });
  }

  // ── Load cognitive metrics ──────────────────────────────────────────

  loadCognitiveData(): void {
    this.cognitiveLoading.set(true);
    this.cognitiveError.set(false);

    const userId = this.auth.getUserId();
    if (!userId) {
      this.cognitiveLoading.set(false);
      this.cognitiveError.set(true);
      return;
    }

    this.cognitiveService.getElements(userId).subscribe({
      next: (data) => {
        this.elements.set(data);
        this.selectedElement.set(data[0] ?? null);
        this.cognitiveLoading.set(false);
      },
      error: (err) => {
        this.cognitiveLoading.set(false);
        this.cognitiveError.set(true);
        console.error('Error loading cognitive metrics:', err);
      },
    });
  }

  // ── Load curricular progress ────────────────────────────────────────

  loadStudentProgress(): void {
    this.progressLoading.set(true);
    this.progressError.set(false);

    const userId = this.auth.getUserId();
    if (!userId) {
      this.progressLoading.set(false);
      this.progressError.set(true);
      return;
    }

    this.cognitiveService.getStudentProgress(userId).subscribe({
      next: (data) => {
        this.studentProgress.set(data);
        this.progressLoading.set(false);
      },
      error: (err) => {
        this.progressLoading.set(false);
        this.progressError.set(true);
        console.error('Error loading student progress:', err);
      },
    });
  }

  // ── Load sessions played ────────────────────────────────────────────

  loadSessionSummary(): void {
    this.sessionsLoading.set(true);
    this.sessionsError.set(false);

    this.gameSessionService.getMyReport().subscribe({
      next: (data) => {
        this.sessionSummary.set(data.summary);
        this.sessionsLoading.set(false);
      },
      error: (err) => {
        this.sessionsLoading.set(false);
        this.sessionsError.set(true);
        console.error('Error loading sessions:', err);
      },
    });
  }

  // ── UI handler: cognitive element selection ─────────────────────────

  onElementSelected(element: CognitiveElement): void {
    this.selectedElement.set(element);
  }
}
