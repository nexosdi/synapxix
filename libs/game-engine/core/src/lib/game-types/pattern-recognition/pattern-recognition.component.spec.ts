import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PatternRecognitionGameComponent } from './pattern-recognition.component';
import { PatternRecognitionInteractiveContent } from './pattern-recognition.model';
import { AnyGameResult } from '../../models/game-result.model';

const CONTENT: PatternRecognitionInteractiveContent = {
  id: 'pattern-rec-test',
  gameType: 'pattern-recognition',
  gameInput: {
    prompt: '¿Qué elemento sigue en el patrón?',
    locale: 'es',
    sequence: ['🔵', '🟢', '🔵', '🟢', '?'],
    options: [
      { id: 'opt-1', content: '🔵', isCorrect: true },
      { id: 'opt-2', content: '🟢', isCorrect: false },
      { id: 'opt-3', content: '🔴', isCorrect: false },
    ],
  },
};

describe('PatternRecognitionGameComponent', () => {
  let fixture: ComponentFixture<PatternRecognitionGameComponent>;
  let component: PatternRecognitionGameComponent;

  function createFixture(
    content: PatternRecognitionInteractiveContent,
  ): ComponentFixture<PatternRecognitionGameComponent> {
    const f = TestBed.createComponent(PatternRecognitionGameComponent);
    f.componentRef.setInput('content', content);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    return f;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternRecognitionGameComponent],
    }).compileComponents();

    fixture = createFixture(CONTENT);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should create and show the prompt from content', () => {
      expect(component).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('¿Qué elemento sigue en el patrón?');
    });

    it('should initialize with no option selected', () => {
      expect(component.selectedOptionId()).toBeNull();
    });

    it('should initialize feedbackState as idle', () => {
      expect(component.feedbackState()).toBe('idle');
    });
  });

  describe('option selection', () => {
    it('should select an option when clicked', () => {
      component.selectOption(CONTENT.gameInput.options[0]);
      expect(component.selectedOptionId()).toBe('opt-1');
    });

    it('should replace selection when another option is clicked', () => {
      component.selectOption(CONTENT.gameInput.options[0]);
      component.selectOption(CONTENT.gameInput.options[1]);
      expect(component.selectedOptionId()).toBe('opt-2');
    });

    it('should not select when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      component.selectOption(CONTENT.gameInput.options[0]);

      expect(component.selectedOptionId()).toBeNull();
    });
  });

  describe('correct answer submission', () => {
    it('should emit answerSubmitted with isCorrect=true and score=100', fakeAsync(() => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.selectOption(CONTENT.gameInput.options[0]); // correct
      component.submitAnswer();

      expect(component.isProcessing()).toBe(true);
      expect(component.feedbackState()).toBe('success');

      tick(1500);

      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(true);
      expect(emitted[0].score).toBe(100);
      expect(emitted[0].gameType).toBe('pattern-recognition');
    }));
  });

  describe('incorrect answer submission', () => {
    it('should emit answerSubmitted with isCorrect=false and score=0', fakeAsync(() => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.selectOption(CONTENT.gameInput.options[1]); // incorrect
      component.submitAnswer();

      expect(component.isProcessing()).toBe(true);
      expect(component.feedbackState()).toBe('error');

      tick(1500);

      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(false);
      expect(emitted[0].score).toBe(0);
    }));
  });

  describe('submit guard', () => {
    it('should not emit if no option is selected', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.submitAnswer();

      expect(emitted).toHaveLength(0);
    });

    it('should not select or submit when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.selectOption(CONTENT.gameInput.options[0]);
      component.submitAnswer();

      expect(emitted).toHaveLength(0);
    });
  });
});
