import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StudentProgressComponent } from './StudentProgress.component';
import { StudentProgressData } from '../models/DashboardData.model';

describe('StudentProgressComponent', () => {
  let component: StudentProgressComponent;
  let fixture: ComponentFixture<StudentProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentProgressComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.isLoading = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Loading State (Skeleton)', () => {
    it('should display the skeleton card with aria-busy when isLoading is true', () => {
      component.isLoading = true;
      component.hasError = false;
      component.data = null;
      fixture.detectChanges();

      const skeletonEl = fixture.debugElement.query(By.css('.progress-card--skeleton'));
      expect(skeletonEl).toBeTruthy();
      expect(skeletonEl.attributes['aria-busy']).toBe('true');
      expect(skeletonEl.attributes['aria-label']).toBe('Cargando progreso…');

      const errorEl = fixture.debugElement.query(By.css('.progress-card--error'));
      const realDataEl = fixture.debugElement.query(By.css('[role="region"]'));
      expect(errorEl).toBeFalsy();
      expect(realDataEl).toBeFalsy();
    });
  });

  describe('Error State', () => {
    it('should display error alert when hasError is true and isLoading is false', () => {
      component.isLoading = false;
      component.hasError = true;
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('.progress-card--error'));
      expect(errorEl).toBeTruthy();
      expect(errorEl.attributes['role']).toBe('alert');
      expect(errorEl.nativeElement.textContent).toContain('No se pudo obtener tu progreso.');

      const skeletonEl = fixture.debugElement.query(By.css('.progress-card--skeleton'));
      expect(skeletonEl).toBeFalsy();
    });

    it('should emit retryClicked when the retry button is clicked', () => {
      component.isLoading = false;
      component.hasError = true;
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.retryClicked, 'emit');
      const retryBtn = fixture.debugElement.query(By.css('.progress-card__retry-btn'));
      expect(retryBtn).toBeTruthy();

      retryBtn.nativeElement.click();
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Real Data State', () => {
    const mockData: StudentProgressData = {
      student_id: 'user-123',
      progress: 0.65,
    };

    it('should render progress bar and percentage when data is available', () => {
      component.isLoading = false;
      component.hasError = false;
      component.data = mockData;
      fixture.detectChanges();

      const pctEl = fixture.debugElement.query(By.css('#student-progress-pct'));
      expect(pctEl).toBeTruthy();
      expect(pctEl.nativeElement.textContent.trim()).toBe('65%');

      const progressbar = fixture.debugElement.query(By.css('[role="progressbar"]'));
      expect(progressbar).toBeTruthy();
      expect(progressbar.attributes['aria-valuenow']).toBe('65');

      const fillEl = fixture.debugElement.query(By.css('.progress-card__fill'));
      expect(fillEl).toBeTruthy();
      expect(fillEl.styles['width']).toBe('65%');
    });

    it('should correctly round fractional progress percentages', () => {
      component.isLoading = false;
      component.hasError = false;
      component.data = { student_id: 'user-123', progress: 0.456 };
      fixture.detectChanges();

      expect(component.progressPct).toBe(46);
      const pctEl = fixture.debugElement.query(By.css('#student-progress-pct'));
      expect(pctEl.nativeElement.textContent.trim()).toBe('46%');
    });

    it('should safely default progressPct to 0 when data is null', () => {
      component.isLoading = false;
      component.hasError = false;
      component.data = null;
      fixture.detectChanges();

      expect(component.progressPct).toBe(0);
      const realDataEl = fixture.debugElement.query(By.css('[role="region"]'));
      expect(realDataEl).toBeFalsy();
    });

    describe('Hint messages according to progressPct range', () => {
      it('should display "Recién empezando" when progress is less than 25%', () => {
        component.isLoading = false;
        component.hasError = false;
        component.data = { student_id: 'user-123', progress: 0.15 };
        fixture.detectChanges();

        const hintEl = fixture.debugElement.query(By.css('.progress-card__hint'));
        expect(hintEl.nativeElement.textContent.trim()).toBe('Recién empezando');
      });

      it('should display "Buen comienzo, seguí así" when progress is between 25% and 49%', () => {
        component.isLoading = false;
        component.hasError = false;
        component.data = { student_id: 'user-123', progress: 0.35 };
        fixture.detectChanges();

        const hintEl = fixture.debugElement.query(By.css('.progress-card__hint'));
        expect(hintEl.nativeElement.textContent.trim()).toBe('Buen comienzo, seguí así');
      });

      it('should display "Vas por la mitad del camino" when progress is between 50% and 74%', () => {
        component.isLoading = false;
        component.hasError = false;
        component.data = { student_id: 'user-123', progress: 0.5 };
        fixture.detectChanges();

        const hintEl = fixture.debugElement.query(By.css('.progress-card__hint'));
        expect(hintEl.nativeElement.textContent.trim()).toBe('Vas por la mitad del camino');
      });

      it('should display "Casi llegás, no pares" when progress is between 75% and 99%', () => {
        component.isLoading = false;
        component.hasError = false;
        component.data = { student_id: 'user-123', progress: 0.85 };
        fixture.detectChanges();

        const hintEl = fixture.debugElement.query(By.css('.progress-card__hint'));
        expect(hintEl.nativeElement.textContent.trim()).toBe('Casi llegás, no pares');
      });

      it('should display "Curso completado" when progress is 100%', () => {
        component.isLoading = false;
        component.hasError = false;
        component.data = { student_id: 'user-123', progress: 1.0 };
        fixture.detectChanges();

        const hintEl = fixture.debugElement.query(By.css('.progress-card__hint'));
        expect(hintEl.nativeElement.textContent.trim()).toBe('Curso completado');
      });
    });
  });
});
