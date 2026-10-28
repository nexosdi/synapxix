import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TimelineOrderGameComponent } from './timeline-order-game.component';
import { TimelineOrderInteractiveContent } from './timeline-order-game.model';
import { DalaInstrumentationService } from '../../services/dala.service';
import { AnyGameResult } from '../../models/game-result.model';

const CONTENT: TimelineOrderInteractiveContent = {
  id: 'timeline-test-1',
  gameType: 'timeline-order',
  gameInput: {
    prompt: 'Ordena los eventos de la historia',
    locale: 'es',
    events: [
      { id: 'e1', text: 'Descubrimiento de América', order: 1 },
      { id: 'e2', text: 'Revolución Francesa', order: 2 },
      { id: 'e3', text: 'Primera Guerra Mundial', order: 3 },
    ],
  },
};

const NON_CONTIGUOUS_CONTENT: TimelineOrderInteractiveContent = {
  id: 'timeline-test-years',
  gameType: 'timeline-order',
  gameInput: {
    prompt: 'Ordena por año',
    locale: 'es',
    events: [
      { id: 'y1', text: 'Evento 1492', order: 1492 },
      { id: 'y2', text: 'Evento 1789', order: 1789 },
      { id: 'y3', text: 'Evento 1914', order: 1914 },
    ],
  },
};

describe('TimelineOrderGameComponent', () => {
  let fixture: ComponentFixture<TimelineOrderGameComponent>;
  let component: TimelineOrderGameComponent;
  let mockAdapter: { mapInteraction: jest.Mock };

  function createFixture(
    content: TimelineOrderInteractiveContent,
  ): ComponentFixture<TimelineOrderGameComponent> {
    const f = TestBed.createComponent(TimelineOrderGameComponent);
    f.componentRef.setInput('content', content);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    return f;
  }

  function select(ids: string[], content: TimelineOrderInteractiveContent = CONTENT): void {
    const events = content.gameInput.events;
    ids.forEach((id) => {
      const event = events.find((e) => e.id === id);
      if (!event) throw new Error(`Unknown event id: ${id}`);
      component.selectEvent(event);
    });
  }

  beforeEach(async () => {
    mockAdapter = { mapInteraction: jest.fn() };
    const dalaStub = { createAdapter: jest.fn().mockReturnValue(mockAdapter) };

    await TestBed.configureTestingModule({
      imports: [TimelineOrderGameComponent],
      providers: [{ provide: DalaInstrumentationService, useValue: dalaStub }],
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
      expect(fixture.nativeElement.textContent).toContain('Ordena los eventos de la historia');
    });

    it('should render one button per event', () => {
      const text = fixture.nativeElement.textContent as string;
      CONTENT.gameInput.events.forEach((e) => expect(text).toContain(e.text));
      expect(component.shuffledEvents()).toHaveLength(3);
    });

    it('should start with an empty timeline and no feedback', () => {
      expect(component.userOrder()).toHaveLength(0);
      expect(component.feedbackState()).toBe('idle');
    });

    it('should disable the check button until every event is placed', () => {
      const buttons = Array.from(
        fixture.nativeElement.querySelectorAll('button'),
      ) as HTMLButtonElement[];
      const check = buttons.find((b) => b.textContent?.includes('COMPROBAR'));
      expect(check?.disabled).toBe(true);

      select(['e1', 'e2', 'e3']);
      fixture.detectChanges();
      expect(check?.disabled).toBe(false);
    });

    it('should send a task_shown interaction on init', () => {
      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'task_shown', difficulty: 3 }),
      );
    });
  });

  describe('selection', () => {
    it('should append events to the timeline in click order', () => {
      select(['e2', 'e1']);
      expect(component.userOrder().map((e) => e.id)).toEqual(['e2', 'e1']);
    });

    it('should not add the same event twice', () => {
      select(['e1', 'e1']);
      expect(component.userOrder()).toHaveLength(1);
      expect(component.isEventSelected({ id: 'e1' })).toBe(true);
    });

    it('should ignore selection when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      select(['e1']);
      expect(component.userOrder()).toHaveLength(0);
    });

    it('should clear the timeline and feedback on reset', () => {
      select(['e1', 'e2']);
      component.reset();

      expect(component.userOrder()).toHaveLength(0);
      expect(component.feedbackState()).toBe('idle');
      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'retry' }),
      );
    });
  });

  describe('order validation', () => {
    it('should give success feedback and emit a perfect result when the order is correct', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      select(['e1', 'e2', 'e3']);
      component.checkAnswer();
      fixture.detectChanges();

      expect(component.feedbackState()).toBe('success');
      expect(component.feedbackConfig().title).toBe('¡INCREÍBLE!');
      expect(fixture.nativeElement.textContent).toContain('¡INCREÍBLE!');

      expect(emitted).toHaveLength(1);
      expect(emitted[0].gameType).toBe('timeline-order');
      expect(emitted[0].isCorrect).toBe(true);
      expect(emitted[0].score).toBe(100);
      expect(emitted[0].answer).toEqual({ orderedItemIds: ['e1', 'e2', 'e3'] });
    });

    it('should report the answer as correct to the instrumentation adapter', () => {
      select(['e1', 'e2', 'e3']);
      component.checkAnswer();

      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'answer', correct: true }),
      );
      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'complete' }),
      );
    });

    it('should give error feedback, emit nothing and reset after 2s when the order is wrong', fakeAsync(() => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      select(['e3', 'e1', 'e2']);
      component.checkAnswer();
      fixture.detectChanges();

      expect(component.feedbackState()).toBe('error');
      expect(component.feedbackConfig().title).toBe('¡UY, CASI!');
      expect(emitted).toHaveLength(0);
      expect(mockAdapter.mapInteraction).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'answer', correct: false }),
      );

      tick(2000);

      expect(component.feedbackState()).toBe('idle');
      expect(component.userOrder()).toHaveLength(0);
    }));

    it('should fail when only some events were placed, even if they are in order', fakeAsync(() => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      select(['e1', 'e2']);
      component.checkAnswer();

      expect(component.feedbackState()).toBe('error');
      expect(emitted).toHaveLength(0);
      tick(2000);
    }));

    it('should fail on an empty timeline', fakeAsync(() => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.checkAnswer();

      expect(component.feedbackState()).toBe('error');
      expect(emitted).toHaveLength(0);
      tick(2000);
    }));

    it('should accept non-contiguous `order` values when the sequence is ascending', () => {
      fixture = createFixture(NON_CONTIGUOUS_CONTENT);
      component = fixture.componentInstance;
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      select(['y1', 'y2', 'y3'], NON_CONTIGUOUS_CONTENT);
      component.checkAnswer();

      expect(component.feedbackState()).toBe('success');
      expect(emitted).toHaveLength(1);
    });

    it('should not validate or emit when disabled', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      select(['e1', 'e2', 'e3']);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      component.checkAnswer();

      expect(component.feedbackState()).toBe('idle');
      expect(emitted).toHaveLength(0);
    });
  });
});