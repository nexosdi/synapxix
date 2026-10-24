import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js';
import { CognitiveChartComponent } from './CognitiveCharts.components';
import { CognitiveElement } from '../models/CognitiveElement.model';
import { buildChartData } from '../utils/Chart.utils';

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

describe('CognitiveChartComponent', () => {
  let component: CognitiveChartComponent;
  let fixture: ComponentFixture<CognitiveChartComponent>;

  const mockElementWithHistory: CognitiveElement = {
    id: 'accuracy',
    name: 'Precisión',
    current_score: 85,
    color: '#1e90ff',
    history: [
      { date: '2026-10-01', value: 70 },
      { date: '2026-10-05', value: 85 },
    ],
  };

  const mockElementEmptyHistory: CognitiveElement = {
    id: 'memory_retention',
    name: 'Memoria',
    current_score: 60,
    color: '#0a4fbf',
    history: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CognitiveChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CognitiveChartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize without error (Charts inicializa sin error)', () => {
    component.element = null;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(Chart).toBeDefined();
  });

  describe('Empty / No Data State', () => {
    it('should display prompt to select an element when element is null', () => {
      component.element = null;
      fixture.detectChanges();

      const emptyWrapper = fixture.debugElement.query(By.css('.chart-wrapper--empty'));
      expect(emptyWrapper).toBeTruthy();
      expect(emptyWrapper.nativeElement.textContent).toContain(
        'Selecciona un elemento para ver su evolución.'
      );

      const canvas = fixture.debugElement.query(By.css('canvas'));
      expect(canvas).toBeFalsy();
    });

    it('should display friendly message when element has empty history', () => {
      component.element = mockElementEmptyHistory;
      fixture.detectChanges();

      const emptyWrapper = fixture.debugElement.query(By.css('.chart-wrapper--empty'));
      expect(emptyWrapper).toBeTruthy();
      expect(emptyWrapper.nativeElement.textContent).toContain(
        'Todavía no hay histórico disponible para Memoria.'
      );

      const canvas = fixture.debugElement.query(By.css('canvas'));
      expect(canvas).toBeFalsy();
    });
  });

  describe('Rendering with Historical Data', () => {
    beforeEach(() => {
      component.element = mockElementWithHistory;
      component.ngOnChanges({
        element: new SimpleChange(null, mockElementWithHistory, true),
      });
      fixture.detectChanges();
    });

    it('should render the chart container, title and badge when history is present', () => {
      const titleEl = fixture.debugElement.query(By.css('.chart-wrapper__title'));
      expect(titleEl).toBeTruthy();
      expect(titleEl.nativeElement.textContent.trim()).toBe('Histórico: Precisión');

      const badgeEl = fixture.debugElement.query(By.css('.chart-wrapper__badge'));
      expect(badgeEl).toBeTruthy();
      expect(badgeEl.nativeElement.textContent.trim()).toBe('Sincronizado con Prisma');

      const canvas = fixture.debugElement.query(By.css('canvas'));
      expect(canvas).toBeTruthy();
    });

    it('should generate proper chartData structure via buildChartData', () => {
      expect(component.chartData.labels).toEqual(['2026-10-01', '2026-10-05']);
      expect(component.chartData.datasets.length).toBe(1);

      const dataset = component.chartData.datasets[0];
      expect(dataset.data).toEqual([70, 85]);
      expect(dataset.label).toBe('Progress (%)');
      expect(dataset.borderColor).toBe('#1e90ff');
      expect(dataset.fill).toBe(true);
    });

    it('should have default line chart options configured', () => {
      expect(component.chartOptions).toBeDefined();
      expect(component.chartOptions?.responsive).toBe(true);
      expect(component.chartOptions?.maintainAspectRatio).toBe(false);
    });
  });

  describe('ngOnChanges Lifecycle', () => {
    it('should update chartData and call chart.update() when element input changes', () => {
      const updatedElement: CognitiveElement = {
        id: 'attention_span',
        name: 'Atención',
        current_score: 95,
        color: '#93c6ff',
        history: [{ date: '2026-10-10', value: 95 }],
      };

      // Mock BaseChartDirective instance
      const mockChartDirective = {
        update: jest.fn(),
      } as unknown as BaseChartDirective;
      component.chart = mockChartDirective;

      component.element = updatedElement;
      component.ngOnChanges({
        element: new SimpleChange(mockElementWithHistory, updatedElement, false),
      });
      fixture.detectChanges();

      expect(component.chartData.labels).toEqual(['2026-10-10']);
      expect(component.chartData.datasets[0].data).toEqual([95]);
      expect(mockChartDirective.update).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if changes does not contain element or element is null', () => {
      component.element = null;
      component.chartData = { datasets: [], labels: [] };

      component.ngOnChanges({
        otherInput: new SimpleChange(null, 'test', true),
      });

      expect(component.chartData.labels).toEqual([]);
    });
  });

  describe('buildChartData utility', () => {
    it('should build fallback color if color is non-hex format', () => {
      const elem: CognitiveElement = {
        id: 'test',
        name: 'Test',
        current_score: 50,
        color: 'rgb(0, 0, 0)',
        history: [{ date: '2026-01-01', value: 50 }],
      };

      const result = buildChartData(elem);
      expect(result.datasets[0].backgroundColor).toBe('rgba(59, 130, 246, 0.1)');
    });
  });
});
