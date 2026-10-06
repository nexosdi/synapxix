import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IntruderGameComponent } from './intruder-game.component';
import { OddOneOutInteractiveContent, toOddOneOutModel, OptionItem } from './intruder-game.model';
import { DalaInstrumentationService } from '../../services/dala.service';
import { AnyGameResult } from '../../models/game-result.model';

const MOCK_CONTENT: OddOneOutInteractiveContent = {
  id: 'intruder-test-1',
  gameType: 'intruder',
  gameInput: {
    prompt: '¿Cuál no es un medio de transporte?',
    locale: 'es',
    options: [
      { id: 'opt-1', text: 'Auto', imageUrl: 'https://example.com/car.png', isCorrect: false },
      { id: 'opt-2', text: 'Avión', imageUrl: 'https://example.com/plane.png', isCorrect: false },
      { id: 'opt-3', text: 'Manzana', imageUrl: 'https://example.com/apple.png', isCorrect: true }, // Intruso
      { id: 'opt-4', text: 'Barco', isCorrect: false },
    ],
  },
};

describe('IntruderGameComponent', () => {
  let fixture: ComponentFixture<IntruderGameComponent>;
  let component: IntruderGameComponent;
  let mockAdapter: { mapInteraction: jest.Mock };

  function createFixture(
    content: OddOneOutInteractiveContent = MOCK_CONTENT,
    disabled = false
  ): ComponentFixture<IntruderGameComponent> {
    const f = TestBed.createComponent(IntruderGameComponent);
    f.componentRef.setInput('content', content);
    f.componentRef.setInput('disabled', disabled);
    f.detectChanges();
    return f;
  }

  beforeEach(async () => {
    mockAdapter = { mapInteraction: jest.fn() };
    const dalaStub = { createAdapter: jest.fn().mockReturnValue(mockAdapter) };

    await TestBed.configureTestingModule({
      imports: [IntruderGameComponent],
      providers: [{ provide: DalaInstrumentationService, useValue: dalaStub }],
    }).compileComponents();

    fixture = createFixture();
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display the prompt and instructional subtitle', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('¿Cuál no es un medio de transporte?');
      expect(text).toContain('Toca al que no pertenece al grupo');
    });

    it('should render all 4 option buttons with their texts', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(4);
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Auto');
      expect(text).toContain('Avión');
      expect(text).toContain('Manzana');
      expect(text).toContain('Barco');
    });

    it('should render images when imageUrl is provided', () => {
      const images = fixture.nativeElement.querySelectorAll('img');
      expect(images.length).toBe(3);
      expect(images[0].getAttribute('src')).toBe('https://example.com/car.png');
      expect(images[1].getAttribute('src')).toBe('https://example.com/plane.png');
      expect(images[2].getAttribute('src')).toBe('https://example.com/apple.png');
    });

    it('should start with initial state (idle feedback and null wrongId)', () => {
      expect(component.feedbackState()).toBe('idle');
      expect(component.wrongId()).toBeNull();
    });
  });

  describe('DALA lifecycle on init', () => {
    it('should emit task_shown interaction with task ID and difficulty', () => {
      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith({
        kind: 'task_shown',
        taskId: 'intruder-task',
        difficulty: 4,
      });
    });
  });

  describe('correct selection', () => {
    it('should set feedbackState to success on selecting the intruder', () => {
      const intruderItem = MOCK_CONTENT.gameInput.options.find((o) => o.isCorrect) as OptionItem;
      component.selectOption(intruderItem);

      expect(component.feedbackState()).toBe('success');
      expect(component.feedbackConfig().title).toBe('¡LO ENCONTRASTE!');
      expect(component.feedbackConfig().icon).toBe('🎯');
    });

    it('should emit answerSubmitted with correct data and score=100', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((res) => emitted.push(res));

      const intruderItem = MOCK_CONTENT.gameInput.options.find((o) => o.isCorrect) as OptionItem;
      component.selectOption(intruderItem);

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toEqual(
        expect.objectContaining({
          gameType: 'intruder',
          answer: { selectedItemId: 'opt-3' },
          isCorrect: true,
          score: 100,
        })
      );
      expect(emitted[0].timeSpentMs).toBeGreaterThanOrEqual(0);
    });

    it('should emit DALA item_action, answer (correct: true), and complete events', () => {
      const intruderItem = MOCK_CONTENT.gameInput.options.find((o) => o.isCorrect) as OptionItem;
      component.selectOption(intruderItem);

      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith({
        kind: 'item_action',
        taskId: 'intruder-task',
        detail: { action: 'select', itemId: 'opt-3' },
      });

      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith({
        kind: 'answer',
        taskId: 'intruder-task',
        correct: true,
        attempt: 1,
      });

      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith({
        kind: 'complete',
        taskId: 'intruder-task',
      });
    });

    it('should ignore subsequent option selections after reaching success state', () => {
      const intruderItem = MOCK_CONTENT.gameInput.options.find((o) => o.isCorrect) as OptionItem;
      const otherItem = MOCK_CONTENT.gameInput.options.find((o) => !o.isCorrect) as OptionItem;

      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((res) => emitted.push(res));

      component.selectOption(intruderItem);
      expect(emitted).toHaveLength(1);

      const callsAfterFirst = mockAdapter.mapInteraction.mock.calls.length;
      component.selectOption(otherItem);

      expect(emitted).toHaveLength(1);
      expect(mockAdapter.mapInteraction.mock.calls.length).toBe(callsAfterFirst);
      expect(component.feedbackState()).toBe('success');
    });
  });

  describe('incorrect selection', () => {
    it('should set wrongId and feedbackState to error when clicking a non-intruder', () => {
      const nonIntruder = MOCK_CONTENT.gameInput.options.find((o) => !o.isCorrect) as OptionItem;
      component.selectOption(nonIntruder);

      expect(component.wrongId()).toBe(nonIntruder.id);
      expect(component.feedbackState()).toBe('error');
      expect(component.feedbackConfig().title).toBe('¡INTENTA OTRA VEZ!');
      expect(component.feedbackConfig().icon).toBe('🧐');
    });

    it('should NOT emit answerSubmitted on incorrect choice', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((res) => emitted.push(res));

      const nonIntruder = MOCK_CONTENT.gameInput.options.find((o) => !o.isCorrect) as OptionItem;
      component.selectOption(nonIntruder);

      expect(emitted).toHaveLength(0);
    });

    it('should emit DALA item_action and answer (correct: false) with attempt count', () => {
      const nonIntruder = MOCK_CONTENT.gameInput.options.find((o) => !o.isCorrect) as OptionItem;
      component.selectOption(nonIntruder);

      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith({
        kind: 'item_action',
        taskId: 'intruder-task',
        detail: { action: 'select', itemId: nonIntruder.id },
      });

      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith({
        kind: 'answer',
        taskId: 'intruder-task',
        correct: false,
        attempt: 1,
      });
    });

    it('should reset feedbackState to idle and wrongId to null after 1200ms', fakeAsync(() => {
      const nonIntruder = MOCK_CONTENT.gameInput.options.find((o) => !o.isCorrect) as OptionItem;
      component.selectOption(nonIntruder);

      expect(component.feedbackState()).toBe('error');
      expect(component.wrongId()).toBe(nonIntruder.id);

      tick(1200);

      expect(component.feedbackState()).toBe('idle');
      expect(component.wrongId()).toBeNull();
    }));

    it('should increment attempt count across repeated incorrect tries and succeeding try', fakeAsync(() => {
      const opt1 = MOCK_CONTENT.gameInput.options[0];
      const opt2 = MOCK_CONTENT.gameInput.options[1];
      const intruder = MOCK_CONTENT.gameInput.options[2];

      component.selectOption(opt1);
      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'answer', correct: false, attempt: 1 })
      );

      tick(1200);

      component.selectOption(opt2);
      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'answer', correct: false, attempt: 2 })
      );

      tick(1200);

      component.selectOption(intruder);
      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'answer', correct: true, attempt: 3 })
      );
    }));
  });

  describe('disabled state', () => {
    it('should have disabled attribute on all buttons when disabled input is true', () => {
      const disFixture = createFixture(MOCK_CONTENT, true);
      const buttons = disFixture.nativeElement.querySelectorAll('button');
      buttons.forEach((btn: HTMLButtonElement) => {
        expect(btn.disabled).toBe(true);
      });
    });

    it('should not process clicks or emit events when disabled', () => {
      const disFixture = createFixture(MOCK_CONTENT, true);
      const disComponent = disFixture.componentInstance;
      const callsBefore = mockAdapter.mapInteraction.mock.calls.length;

      const emitted: AnyGameResult[] = [];
      disComponent.answerSubmitted.subscribe((res) => emitted.push(res));

      const intruderItem = MOCK_CONTENT.gameInput.options.find((o) => o.isCorrect) as OptionItem;
      disComponent.selectOption(intruderItem);

      expect(emitted).toHaveLength(0);
      expect(disComponent.feedbackState()).toBe('idle');
      expect(mockAdapter.mapInteraction.mock.calls.length).toBe(callsBefore);
    });
  });

  describe('model function toOddOneOutModel', () => {
    it('should extract gameInput from valid interactive content', () => {
      const result = toOddOneOutModel(MOCK_CONTENT);
      expect(result).toBe(MOCK_CONTENT.gameInput);
      expect(result.options.length).toBe(4);
    });

    it('should return safe default if content is nullish', () => {
      const result = toOddOneOutModel(null as unknown as OddOneOutInteractiveContent);
      expect(result).toEqual({ prompt: '', options: [], locale: 'es' });
    });
  });
});
