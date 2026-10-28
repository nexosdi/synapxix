import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillInTheBlanksGameComponent } from './fill-in-the-blanks-game.component';
import { FillInTheBlanksInteractiveContent } from './fill-in-the-blanks-game.model';
import { AnyGameResult } from '../../models/game-result.model';

const ONE_BLANK_CONTENT: FillInTheBlanksInteractiveContent = {
  id: 'fitb-test-1',
  gameType: 'fill-in-the-blanks',
  gameInput: {
    sentence: 'El cielo es ___',
    locale: 'es',
    shuffleChoices: false,
    blanks: [
      {
        index: 0,
        choices: [
          { label: 'azul', isCorrect: true },
          { label: 'verde', isCorrect: false },
        ],
      },
    ],
  },
};

const TWO_BLANK_CONTENT: FillInTheBlanksInteractiveContent = {
  id: 'fitb-test-2',
  gameType: 'fill-in-the-blanks',
  gameInput: {
    sentence: 'El ___ es ___',
    locale: 'es',
    shuffleChoices: false,
    blanks: [
      {
        index: 0,
        choices: [
          { label: 'cielo', isCorrect: true },
          { label: 'mar', isCorrect: false },
        ],
      },
      {
        index: 1,
        choices: [
          { label: 'azul', isCorrect: true },
          { label: 'rojo', isCorrect: false },
        ],
      },
    ],
  },
};

describe('FillInTheBlanksGameComponent', () => {
  let fixture: ComponentFixture<FillInTheBlanksGameComponent>;
  let component: FillInTheBlanksGameComponent;

  function createFixture(
    content: FillInTheBlanksInteractiveContent,
  ): ComponentFixture<FillInTheBlanksGameComponent> {
    const f = TestBed.createComponent(FillInTheBlanksGameComponent);
    f.componentRef.setInput('content', content);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    return f;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillInTheBlanksGameComponent],
    }).compileComponents();

    fixture = createFixture(ONE_BLANK_CONTENT);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should create and show the sentence from content', () => {
      expect(component).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('El cielo es ___');
    });

    it('should render one button per choice for each blank', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(2);
    });

    it('should render choice labels', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('azul');
      expect(el.textContent).toContain('verde');
    });

    it('should start with no selections', () => {
      expect(component.getSelectedChoice(0)).toBeUndefined();
    });

    it('should start with the game not finished', () => {
      expect(component.isFinished()).toBe(false);
    });
  });

  describe('correct selection', () => {
    it('should record the selection in getSelectedChoice', () => {
      component.onChoiceClick(0, { label: 'azul', isCorrect: true });
      expect(component.getSelectedChoice(0)).toBe('azul');
    });

    it('should return true from isCorrect when the blank is answered correctly', () => {
      component.onChoiceClick(0, { label: 'azul', isCorrect: true });
      expect(component.isCorrect(0)).toBe(true);
    });

    it('should emit answerSubmitted with isCorrect=true and score=100 when all blanks are correct', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.onChoiceClick(0, { label: 'azul', isCorrect: true });

      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(true);
      expect(emitted[0].score).toBe(100);
      expect(emitted[0].gameType).toBe('fill-in-the-blanks');
    });

    it('should set isFinished to true when all blanks are correct', () => {
      component.onChoiceClick(0, { label: 'azul', isCorrect: true });
      expect(component.isFinished()).toBe(true);
    });

    it('should lock a correct blank so a second click does not change the selection', () => {
      component.onChoiceClick(0, { label: 'azul', isCorrect: true });
      component.onChoiceClick(0, { label: 'verde', isCorrect: false });

      expect(component.getSelectedChoice(0)).toBe('azul');
    });

    it('should not emit answerSubmitted while blanks remain unanswered correctly', () => {
      const twoBlankFixture = createFixture(TWO_BLANK_CONTENT);
      const twoBlankComponent = twoBlankFixture.componentInstance;

      const emitted: AnyGameResult[] = [];
      twoBlankComponent.answerSubmitted.subscribe((r) => emitted.push(r));

      twoBlankComponent.onChoiceClick(0, { label: 'cielo', isCorrect: true });

      expect(emitted).toHaveLength(0);
    });

    it('should emit answerSubmitted only when every blank is correct', () => {
      const twoBlankFixture = createFixture(TWO_BLANK_CONTENT);
      const twoBlankComponent = twoBlankFixture.componentInstance;

      const emitted: AnyGameResult[] = [];
      twoBlankComponent.answerSubmitted.subscribe((r) => emitted.push(r));

      twoBlankComponent.onChoiceClick(0, { label: 'cielo', isCorrect: true });
      twoBlankComponent.onChoiceClick(1, { label: 'azul', isCorrect: true });

      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(true);
    });
  });

  describe('incorrect selection', () => {
    it('should record an incorrect selection in getSelectedChoice', () => {
      component.onChoiceClick(0, { label: 'verde', isCorrect: false });
      expect(component.getSelectedChoice(0)).toBe('verde');
    });

    it('should return false from isCorrect for an incorrect selection', () => {
      component.onChoiceClick(0, { label: 'verde', isCorrect: false });
      expect(component.isCorrect(0)).toBe(false);
    });

    it('should not emit answerSubmitted on an incorrect selection', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.onChoiceClick(0, { label: 'verde', isCorrect: false });

      expect(emitted).toHaveLength(0);
    });

    it('should not mark the game as finished on an incorrect selection', () => {
      component.onChoiceClick(0, { label: 'verde', isCorrect: false });
      expect(component.isFinished()).toBe(false);
    });

    it('should allow changing an incorrect answer to another option', () => {
      component.onChoiceClick(0, { label: 'verde', isCorrect: false });
      component.onChoiceClick(0, { label: 'azul', isCorrect: true });

      expect(component.getSelectedChoice(0)).toBe('azul');
      expect(component.isCorrect(0)).toBe(true);
    });

    it('should emit answerSubmitted after correcting to the right answer', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.onChoiceClick(0, { label: 'verde', isCorrect: false });
      component.onChoiceClick(0, { label: 'azul', isCorrect: true });

      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(true);
    });
  });

  describe('disabled', () => {
    it('should not update selections when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      component.onChoiceClick(0, { label: 'azul', isCorrect: true });

      expect(component.getSelectedChoice(0)).toBeUndefined();
    });

    it('should not emit answerSubmitted when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.onChoiceClick(0, { label: 'azul', isCorrect: true });

      expect(emitted).toHaveLength(0);
    });
  });
});
