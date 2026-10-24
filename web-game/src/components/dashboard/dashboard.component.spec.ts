import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../app/services/auth.service';
import { CognitiveService } from './services/Cognitive.service';
import { EconomyService } from './services/Economy.service';
import { GameSessionService } from './services/GameSession.service';
import { BalanceHeaderComponent } from './components/BalanceHeader.component';
import { StudentProgressComponent } from './components/StudentProgress.component';
import { SessionSummaryComponent } from './components/SessionSummary.component';
import { CognitiveCardComponent } from './components/CognitiveCard.component';
import { CognitiveChartComponent } from './components/CognitiveCharts.components';
import { CognitiveElement } from './models/CognitiveElement.model';
import { BalanceData, StudentProgressData } from './models/DashboardData.model';
import { UserReportData } from './models/SessionReport.model';

// Mock Chart.js so CognitiveChartComponent initializes cleanly
jest.mock('chart.js', () => {
  const actual = jest.requireActual('chart.js');
  return {
    ...actual,
    Chart: Object.assign(
      jest.fn().mockImplementation((ctx, config) => ({
        config: config || { data: { datasets: [], labels: [] }, options: {}, plugins: [] },
        data: config?.data || { datasets: [], labels: [] },
        options: config?.options || {},
        destroy: jest.fn(),
        update: jest.fn(),
        render: jest.fn(),
        stop: jest.fn(),
        resize: jest.fn(),
        clear: jest.fn(),
        toBase64Image: jest.fn(),
        generateLegend: jest.fn(),
        ctx: {},
        canvas: {},
      })),
      {
        register: jest.fn(),
        unregister: jest.fn(),
        defaults: actual.defaults || {},
      }
    ),
    registerables: [],
  };
});

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let mockAuthService: { getUserId: jest.Mock };
  let mockCognitiveService: { getElements: jest.Mock; getStudentProgress: jest.Mock };
  let mockEconomyService: { getBalance: jest.Mock };
  let mockGameSessionService: { getMyReport: jest.Mock };

  const mockUserId = 'user-test-uuid-456';

  const mockBalance: BalanceData = {
    credits: 1500,
    experience_points: 3200,
  };

  const mockProgress: StudentProgressData = {
    student_id: mockUserId,
    progress: 0.72,
  };

  const mockReport: UserReportData = {
    summary: {
      totalSessions: 14,
      completedSessions: 12,
      accuracy: 0.88,
    },
    sessions: [],
  };

  const mockElements: CognitiveElement[] = [
    {
      id: 'accuracy',
      name: 'Precisión',
      current_score: 88,
      color: '#1e90ff',
      history: [
        { date: '2026-10-01', value: 75 },
        { date: '2026-10-08', value: 88 },
      ],
    },
    {
      id: 'memory_retention',
      name: 'Memoria',
      current_score: 65,
      color: '#0a4fbf',
      history: [
        { date: '2026-10-01', value: 60 },
        { date: '2026-10-08', value: 65 },
      ],
    },
  ];

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());

    mockAuthService = {
      getUserId: jest.fn().mockReturnValue(mockUserId),
    };

    mockCognitiveService = {
      getElements: jest.fn().mockReturnValue(of(mockElements)),
      getStudentProgress: jest.fn().mockReturnValue(of(mockProgress)),
    };

    mockEconomyService = {
      getBalance: jest.fn().mockReturnValue(of(mockBalance)),
    };

    mockGameSessionService = {
      getMyReport: jest.fn().mockReturnValue(of(mockReport)),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CognitiveService, useValue: mockCognitiveService },
        { provide: EconomyService, useValue: mockEconomyService },
        { provide: GameSessionService, useValue: mockGameSessionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the dashboard component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Subcomponents Assembly (Dashboard ensambla subcomponentes)', () => {
    it('should assemble all required header cards: BalanceHeader, StudentProgress and SessionSummary', () => {
      fixture.detectChanges();

      const balanceHeader = fixture.debugElement.query(By.directive(BalanceHeaderComponent));
      const studentProgress = fixture.debugElement.query(By.directive(StudentProgressComponent));
      const sessionSummary = fixture.debugElement.query(By.directive(SessionSummaryComponent));

      expect(balanceHeader).toBeTruthy();
      expect(studentProgress).toBeTruthy();
      expect(sessionSummary).toBeTruthy();
    });

    it('should assemble CognitiveCard components for each cognitive element', () => {
      fixture.detectChanges();

      const cards = fixture.debugElement.queryAll(By.directive(CognitiveCardComponent));
      expect(cards.length).toBe(mockElements.length);
    });

    it('should assemble CognitiveChart component with the selected element', () => {
      fixture.detectChanges();

      const chartComponent = fixture.debugElement.query(By.directive(CognitiveChartComponent));
      expect(chartComponent).toBeTruthy();
      expect(chartComponent.componentInstance.element).toEqual(mockElements[0]);
    });
  });

  describe('Initial Data Loading (ngOnInit)', () => {
    it('should invoke all 4 backend services on initialization', () => {
      fixture.detectChanges();

      expect(mockEconomyService.getBalance).toHaveBeenCalledTimes(1);
      expect(mockAuthService.getUserId).toHaveBeenCalled();
      expect(mockCognitiveService.getElements).toHaveBeenCalledWith(mockUserId);
      expect(mockCognitiveService.getStudentProgress).toHaveBeenCalledWith(mockUserId);
      expect(mockGameSessionService.getMyReport).toHaveBeenCalledTimes(1);
    });

    it('should set signals with received data and clear loading states', () => {
      fixture.detectChanges();

      expect(component.balance()).toEqual(mockBalance);
      expect(component.balanceLoading()).toBe(false);
      expect(component.balanceError()).toBe(false);

      expect(component.studentProgress()).toEqual(mockProgress);
      expect(component.progressLoading()).toBe(false);
      expect(component.progressError()).toBe(false);

      expect(component.sessionSummary()).toEqual(mockReport.summary);
      expect(component.sessionsLoading()).toBe(false);
      expect(component.sessionsError()).toBe(false);

      expect(component.elements()).toEqual(mockElements);
      expect(component.selectedElement()).toEqual(mockElements[0]);
      expect(component.cognitiveLoading()).toBe(false);
      expect(component.cognitiveError()).toBe(false);
    });
  });

  describe('Cognitive Element Selection', () => {
    it('should update selectedElement signal when onElementSelected is invoked', () => {
      fixture.detectChanges();

      const secondElement = mockElements[1];
      component.onElementSelected(secondElement);
      fixture.detectChanges();

      expect(component.selectedElement()).toEqual(secondElement);

      const chartComponent = fixture.debugElement.query(By.directive(CognitiveChartComponent));
      expect(chartComponent.componentInstance.element).toEqual(secondElement);
    });

    it('should react to (selected) output from CognitiveCardComponent in template', () => {
      fixture.detectChanges();

      const cards = fixture.debugElement.queryAll(By.directive(CognitiveCardComponent));
      expect(cards.length).toBe(2);

      // Emit selected event on second card
      cards[1].componentInstance.selected.emit(mockElements[1]);
      fixture.detectChanges();

      expect(component.selectedElement()).toEqual(mockElements[1]);
    });
  });

  describe('Error Handling and Independent Resilience', () => {
    it('should handle balance service error independently without breaking other sections', () => {
      mockEconomyService.getBalance.mockReturnValue(throwError(() => new Error('Economy down')));

      fixture.detectChanges();

      expect(component.balanceError()).toBe(true);
      expect(component.balanceLoading()).toBe(false);
      expect(component.balance()).toBeNull();

      // Cognitive metrics and progress still load
      expect(component.cognitiveError()).toBe(false);
      expect(component.elements().length).toBe(2);
      expect(component.studentProgress()).toEqual(mockProgress);
    });

    it('should allow retrying balance load via loadBalance()', () => {
      mockEconomyService.getBalance.mockReturnValueOnce(throwError(() => new Error('Temp failure')));

      fixture.detectChanges();
      expect(component.balanceError()).toBe(true);

      // Switch mock to success on retry
      mockEconomyService.getBalance.mockReturnValueOnce(of(mockBalance));
      component.loadBalance();

      expect(component.balanceLoading()).toBe(false);
      expect(component.balanceError()).toBe(false);
      expect(component.balance()).toEqual(mockBalance);
    });

    it('should handle cognitive metrics error, show error alert and support retry', () => {
      mockCognitiveService.getElements.mockReturnValue(throwError(() => new Error('Analytics down')));

      fixture.detectChanges();

      expect(component.cognitiveError()).toBe(true);
      expect(component.cognitiveLoading()).toBe(false);

      const errorAlert = fixture.debugElement.query(By.css('.dashboard__error'));
      expect(errorAlert).toBeTruthy();
      expect(errorAlert.nativeElement.textContent).toContain('No se pudieron cargar las métricas cognitivas.');

      // Test retry button
      const retryBtn = fixture.debugElement.query(By.css('#retry-cognitive-btn'));
      expect(retryBtn).toBeTruthy();

      const loadSpy = jest.spyOn(component, 'loadCognitiveData');
      retryBtn.nativeElement.click();
      expect(loadSpy).toHaveBeenCalled();
    });

    it('should set error state if auth.getUserId() returns null', () => {
      mockAuthService.getUserId.mockReturnValue(null);

      fixture.detectChanges();

      expect(component.cognitiveError()).toBe(true);
      expect(component.cognitiveLoading()).toBe(false);
      expect(mockCognitiveService.getElements).not.toHaveBeenCalled();

      expect(component.progressError()).toBe(true);
      expect(component.progressLoading()).toBe(false);
      expect(mockCognitiveService.getStudentProgress).not.toHaveBeenCalled();
    });

    it('should handle session summary service error independently', () => {
      mockGameSessionService.getMyReport.mockReturnValue(throwError(() => new Error('Session report error')));

      fixture.detectChanges();

      expect(component.sessionsError()).toBe(true);
      expect(component.sessionsLoading()).toBe(false);
      expect(component.sessionSummary()).toBeNull();
    });
  });
});
