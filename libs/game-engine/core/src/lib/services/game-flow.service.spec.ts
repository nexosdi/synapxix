import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GameFlowService } from './game-flow.service';

describe('GameFlowService', () => {
  let service: GameFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameFlowService],
    });
    service = TestBed.inject(GameFlowService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  // ── Initial state ────────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('should start in IDLE', () => {
      expect(service.currentState()).toBe('IDLE');
      expect(service.isIdle()).toBe(true);
    });

    it('should have all non-idle states false', () => {
      expect(service.isLoading()).toBe(false);
      expect(service.isReady()).toBe(false);
      expect(service.isPlaying()).toBe(false);
      expect(service.isAnswering()).toBe(false);
      expect(service.isFeedback()).toBe(false);
      expect(service.isAdvancing()).toBe(false);
      expect(service.isCompleted()).toBe(false);
    });

    it('should have interaction disabled when not PLAYING', () => {
      expect(service.isInteractionDisabled()).toBe(true);
    });

    it('should have empty feedback content', () => {
      expect(service.feedbackContent()).toBe('');
    });
  });

  // ── Core flow transitions ────────────────────────────────────────────────────

  describe('flow: startLoading()', () => {
    it('should transition IDLE → LOADING', () => {
      expect(service.startLoading()).toBe(true);
      expect(service.currentState()).toBe('LOADING');
      expect(service.isLoading()).toBe(true);
    });

    it('should return false when called from an invalid state', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300); // → PLAYING

      // PLAYING → LOADING is not allowed
      expect(service.startLoading()).toBe(false);
      expect(service.currentState()).toBe('PLAYING');
    }));
  });

  describe('flow: contentReady()', () => {
    it('should transition LOADING → READY', () => {
      service.startLoading();
      expect(service.contentReady()).toBe(true);
      expect(service.currentState()).toBe('READY');
      expect(service.isReady()).toBe(true);
    });

    it('should auto-transition READY → PLAYING after the configured delay', fakeAsync(() => {
      service.startLoading();
      service.contentReady();

      expect(service.currentState()).toBe('READY');

      tick(300); // default readyToPlayDelayMs

      expect(service.currentState()).toBe('PLAYING');
      expect(service.isPlaying()).toBe(true);
      expect(service.isInteractionDisabled()).toBe(false);
    }));

    it('should NOT transition READY → PLAYING before the delay expires', fakeAsync(() => {
      service.startLoading();
      service.contentReady();

      tick(100); // less than 300ms

      expect(service.currentState()).toBe('READY');
    }));
  });

  describe('flow: answerSubmitted()', () => {
    it('should transition PLAYING → ANSWERING', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);

      expect(service.answerSubmitted()).toBe(true);
      expect(service.currentState()).toBe('ANSWERING');
      expect(service.isAnswering()).toBe(true);
    }));

    it('should auto-transition ANSWERING → FEEDBACK after the configured delay', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();

      expect(service.currentState()).toBe('ANSWERING');

      tick(800); // default answerToFeedbackDelayMs

      expect(service.currentState()).toBe('FEEDBACK');
      expect(service.isFeedback()).toBe(true);
    }));

    it('should NOT transition ANSWERING → FEEDBACK before the delay expires', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();

      tick(400); // less than 800ms

      expect(service.currentState()).toBe('ANSWERING');
    }));
  });

  // ── advanceNext() ────────────────────────────────────────────────────────────

  describe('advanceNext()', () => {
    it('should transition FEEDBACK → ADVANCING', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);

      service.advanceNext();

      expect(service.currentState()).toBe('ADVANCING');
      expect(service.isAdvancing()).toBe(true);
    }));

    it('should invoke the onAutoAdvance callback', fakeAsync(() => {
      const advanceSpy = jest.fn();
      service.onAutoAdvance(advanceSpy);

      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);

      service.advanceNext();

      expect(advanceSpy).toHaveBeenCalledTimes(1);
    }));

    it('should be a no-op when state is already COMPLETED', fakeAsync(() => {
      const advanceSpy = jest.fn();
      service.onAutoAdvance(advanceSpy);

      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);
      service.completeJourney();

      service.advanceNext();

      expect(service.currentState()).toBe('COMPLETED');
      expect(advanceSpy).not.toHaveBeenCalled();
    }));

    it('should be a no-op when state is already ADVANCING', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);

      service.advanceNext();
      expect(service.currentState()).toBe('ADVANCING');

      // Second call should not throw or change state unexpectedly
      service.advanceNext();
      expect(service.currentState()).toBe('ADVANCING');
    }));
  });

  // ── completeJourney() ────────────────────────────────────────────────────────

  describe('completeJourney()', () => {
    it('should transition to COMPLETED from FEEDBACK', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);

      expect(service.completeJourney()).toBe(true);
      expect(service.isCompleted()).toBe(true);
    }));

    it('should return true immediately if already COMPLETED', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);
      service.completeJourney();

      expect(service.completeJourney()).toBe(true);
      expect(service.currentState()).toBe('COMPLETED');
    }));
  });

  // ── reset() ──────────────────────────────────────────────────────────────────

  describe('reset()', () => {
    it('should return to IDLE from any state', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);

      service.reset();

      expect(service.currentState()).toBe('IDLE');
      expect(service.isIdle()).toBe(true);
    }));

    it('should clear feedback content', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      service.startFeedbackStream();
      service.appendFeedbackChunk('Some text');

      service.reset();

      expect(service.feedbackContent()).toBe('');
    }));

    it('should disable interaction after reset', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      expect(service.isInteractionDisabled()).toBe(false); // PLAYING

      service.reset();

      expect(service.isInteractionDisabled()).toBe(true);
    }));

    it('should clear the onAutoAdvance callback', fakeAsync(() => {
      const spy = jest.fn();
      service.onAutoAdvance(spy);

      service.reset();

      // Rebuild flow after reset
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);
      service.advanceNext();

      expect(spy).not.toHaveBeenCalled();
    }));

    it('should cancel pending timers so no late transitions occur', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      // In READY, a 300ms timer is scheduled

      service.reset(); // should cancel that timer
      tick(300); // timer fires — but state machine was reset

      expect(service.currentState()).toBe('IDLE');
    }));
  });

  // ── clearAutoAdvance() ───────────────────────────────────────────────────────

  describe('clearAutoAdvance()', () => {
    it('should prevent the callback from firing after being cleared', fakeAsync(() => {
      const spy = jest.fn();
      service.onAutoAdvance(spy);

      service.clearAutoAdvance();

      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);
      service.advanceNext();

      expect(spy).not.toHaveBeenCalled();
    }));
  });

  // ── Streaming feedback ───────────────────────────────────────────────────────

  describe('startFeedbackStream()', () => {
    it('should transition to FEEDBACK and return an AbortController', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();

      const controller = service.startFeedbackStream();

      expect(service.currentState()).toBe('FEEDBACK');
      expect(controller).toBeInstanceOf(AbortController);
      expect(controller.signal.aborted).toBe(false);
    }));

    it('should clear previous feedback text before streaming', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      service.startFeedbackStream();
      service.appendFeedbackChunk('old content');

      // Second call (new stream) should reset text
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      service.startFeedbackStream();

      expect(service.feedbackContent()).toBe('');
    }));

    it('should not re-transition to FEEDBACK if already there', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800); // timer already moved to FEEDBACK

      // Should not throw — already in FEEDBACK, just sets up AbortController
      expect(() => service.startFeedbackStream()).not.toThrow();
      expect(service.currentState()).toBe('FEEDBACK');
    }));
  });

  describe('appendFeedbackChunk()', () => {
    it('should accumulate text chunks correctly', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      service.startFeedbackStream();

      service.appendFeedbackChunk('Hello ');
      service.appendFeedbackChunk('World');
      service.appendFeedbackChunk('!');

      expect(service.feedbackContent()).toBe('Hello World!');
    }));
  });

  describe('clearFeedbackContent()', () => {
    it('should reset feedback text and abort the active stream', fakeAsync(() => {
      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();

      const controller = service.startFeedbackStream();
      service.appendFeedbackChunk('Some AI text');

      service.clearFeedbackContent();

      expect(service.feedbackContent()).toBe('');
      expect(controller.signal.aborted).toBe(true);
    }));
  });

  // ── configure() ─────────────────────────────────────────────────────────────

  describe('configure()', () => {
    it('should override readyToPlayDelayMs', fakeAsync(() => {
      service.configure({ readyToPlayDelayMs: 1000 });

      service.startLoading();
      service.contentReady();

      tick(300); // default delay — should NOT have fired
      expect(service.currentState()).toBe('READY');

      tick(700); // total: 1000ms
      expect(service.currentState()).toBe('PLAYING');
    }));

    it('should override answerToFeedbackDelayMs', fakeAsync(() => {
      service.configure({ answerToFeedbackDelayMs: 200 });

      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();

      tick(200); // custom delay
      expect(service.currentState()).toBe('FEEDBACK');
    }));

    it('should enable auto-advance from FEEDBACK when feedbackAutoAdvanceMs > 0', fakeAsync(() => {
      const spy = jest.fn();
      service.onAutoAdvance(spy);
      service.configure({ feedbackAutoAdvanceMs: 500 });

      service.startLoading();
      service.contentReady();
      tick(300);
      service.answerSubmitted();
      tick(800);

      expect(service.currentState()).toBe('FEEDBACK');

      tick(500); // auto-advance fires

      expect(service.currentState()).toBe('ADVANCING');
      expect(spy).toHaveBeenCalledTimes(1);
    }));
  });

  // ── Full game loop ───────────────────────────────────────────────────────────

  describe('full game loop', () => {
    it('should complete a full cycle: IDLE → LOADING → READY → PLAYING → ANSWERING → FEEDBACK → ADVANCING → COMPLETED', fakeAsync(() => {
      const spy = jest.fn();
      service.onAutoAdvance(spy);

      // Start
      expect(service.startLoading()).toBe(true);
      expect(service.currentState()).toBe('LOADING');

      expect(service.contentReady()).toBe(true);
      expect(service.currentState()).toBe('READY');

      tick(300); // READY → PLAYING
      expect(service.currentState()).toBe('PLAYING');
      expect(service.isInteractionDisabled()).toBe(false);

      // Answer
      expect(service.answerSubmitted()).toBe(true);
      expect(service.currentState()).toBe('ANSWERING');

      tick(800); // ANSWERING → FEEDBACK
      expect(service.currentState()).toBe('FEEDBACK');

      // Advance
      service.advanceNext();
      expect(service.currentState()).toBe('ADVANCING');
      expect(spy).toHaveBeenCalledTimes(1);

      // Complete
      expect(service.completeJourney()).toBe(true);
      expect(service.isCompleted()).toBe(true);
      expect(service.isInteractionDisabled()).toBe(true);
    }));

    it('should support looping through multiple games before completing', fakeAsync(() => {
      // Game 1
      service.startLoading();
      service.contentReady();
      tick(300); // → PLAYING
      service.answerSubmitted();
      tick(800); // → FEEDBACK
      service.advanceNext(); // → ADVANCING

      // Game 2 (loop back)
      service.contentReady(); // ADVANCING → READY
      tick(300); // → PLAYING
      service.answerSubmitted();
      tick(800); // → FEEDBACK

      // End journey
      service.completeJourney();

      expect(service.isCompleted()).toBe(true);
    }));
  });
});
