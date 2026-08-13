import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
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
 * Componente principal del Dashboard del Alumno.
 *
 * Conecta cuatro fuentes de datos reales del backend:
 *   1. GET /api/economy/balance                      → créditos y XP
 *   2. GET /api/analytics/individual-average/:userId → métricas cognitivas
 *   3. GET /api/analytics/student-progress/:userId   → progreso curricular
 *   4. GET /api/game-session/me/report               → sesiones jugadas
 *
 * Cada sección es independiente: si un endpoint falla, los demás
 * siguen mostrándose. Los botones de "Reintentar" usan binding @Output
 * estándar de Angular — el hijo emite, el padre reacciona.
 *
 * El token Keycloak fluye automáticamente vía KeycloakBearerInterceptor
 * registrado en app.config.ts.
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
  // ── Estado de balance (economía) ──────────────────────────────────────
  public balance: BalanceData | null = null;
  public balanceLoading = true;
  public balanceError = false;

  // ── Estado de métricas cognitivas ─────────────────────────────────────
  public elements: CognitiveElement[] = [];
  public selectedElement: CognitiveElement | null = null;
  public cognitiveLoading = true;
  public cognitiveError = false;

  // ── Estado de progreso curricular ─────────────────────────────────────
  public studentProgress: StudentProgressData | null = null;
  public progressLoading = true;
  public progressError = false;

  // ── Estado de sesiones jugadas ────────────────────────────────────────
  public sessionSummary: SessionSummary | null = null;
  public sessionsLoading = true;
  public sessionsError = false;

  private readonly keycloak = inject(KeycloakService);
  private readonly cognitiveService = inject(CognitiveService);
  private readonly economyService = inject(EconomyService);
  private readonly gameSessionService = inject(GameSessionService);

  ngOnInit(): void {
    this.loadBalance();
    this.loadCognitiveData();
    this.loadStudentProgress();
    this.loadSessionSummary();
  }

  // ── Carga de balance ──────────────────────────────────────────────────

  loadBalance(): void {
    this.balanceLoading = true;
    this.balanceError = false;

    this.economyService.getBalance().subscribe({
      next: (data) => {
        this.balance = data;
        this.balanceLoading = false;
      },
      error: (err) => {
        this.balanceLoading = false;
        this.balanceError = true;
        console.error('Error cargando balance:', err);
      },
    });
  }

  // ── Carga de métricas cognitivas ──────────────────────────────────────

  loadCognitiveData(): void {
    this.cognitiveLoading = true;
    this.cognitiveError = false;

    const userId = this.getUserId();
    if (!userId) {
      this.cognitiveLoading = false;
      this.cognitiveError = true;
      return;
    }

    this.cognitiveService.getElements(userId).subscribe({
      next: (data) => {
        this.elements = data;
        this.selectedElement = data[0] ?? null;
        this.cognitiveLoading = false;
      },
      error: (err) => {
        this.cognitiveLoading = false;
        this.cognitiveError = true;
        console.error('Error cargando métricas cognitivas:', err);
      },
    });
  }

  // ── Carga de progreso curricular ──────────────────────────────────────

  loadStudentProgress(): void {
    this.progressLoading = true;
    this.progressError = false;

    const userId = this.getUserId();
    if (!userId) {
      this.progressLoading = false;
      this.progressError = true;
      return;
    }

    this.cognitiveService.getStudentProgress(userId).subscribe({
      next: (data) => {
        this.studentProgress = data;
        this.progressLoading = false;
      },
      error: (err) => {
        this.progressLoading = false;
        this.progressError = true;
        console.error('Error cargando progreso del alumno:', err);
      },
    });
  }

  // ── Carga de sesiones jugadas ─────────────────────────────────────────

  loadSessionSummary(): void {
    this.sessionsLoading = true;
    this.sessionsError = false;

    this.gameSessionService.getMyReport().subscribe({
      next: (data) => {
        this.sessionSummary = data.summary;
        this.sessionsLoading = false;
      },
      error: (err) => {
        this.sessionsLoading = false;
        this.sessionsError = true;
        console.error('Error cargando sesiones:', err);
      },
    });
  }

  // ── Handler UI: selección de elemento cognitivo ───────────────────────

  onElementSelected(element: CognitiveElement): void {
    this.selectedElement = element;
  }

  // ── Helper: userId del token Keycloak ─────────────────────────────────

  /**
   * Obtiene el `sub` (userId) del token Keycloak.
   * Keycloak ya fue inicializado por APP_INITIALIZER antes de llegar aquí.
   */
  private getUserId(): string | null {
    try {
      return this.keycloak.getKeycloakInstance().subject ?? null;
    } catch {
      console.error('No se pudo obtener el userId de Keycloak.');
      return null;
    }
  }
}