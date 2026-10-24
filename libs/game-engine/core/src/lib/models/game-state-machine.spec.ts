import {
  GameStateMachine,
  GameState,
  StateTransitionEvent,
  InvalidStateTransitionError,
} from './game-state-machine';

describe('GameStateMachine', () => {
  let machine: GameStateMachine;

  beforeEach(() => {
    machine = new GameStateMachine();
  });

  describe('initial state', () => {
    it('should start in IDLE state', () => {
      expect(machine.currentState()).toBe('IDLE');
    });

    it('should have isIdle as true', () => {
      expect(machine.isIdle()).toBe(true);
    });

    it('should have all other states as false', () => {
      expect(machine.isLoading()).toBe(false);
      expect(machine.isReady()).toBe(false);
      expect(machine.isPlaying()).toBe(false);
      expect(machine.isPaused()).toBe(false);
      expect(machine.isAnswering()).toBe(false);
      expect(machine.isFeedback()).toBe(false);
      expect(machine.isAdvancing()).toBe(false);
      expect(machine.isCompleted()).toBe(false);
    });
  });

  describe('valid transitions', () => {
    it('IDLE → LOADING', () => {
      const result = machine.transitionTo('LOADING');
      expect(result).toBe(true);
      expect(machine.currentState()).toBe('LOADING');
      expect(machine.isLoading()).toBe(true);
    });

    it('LOADING → READY', () => {
      machine.transitionTo('LOADING');
      const result = machine.transitionTo('READY');
      expect(result).toBe(true);
      expect(machine.currentState()).toBe('READY');
    });

    it('LOADING → IDLE (abort/cancel loading)', () => {
      machine.transitionTo('LOADING');
      const result = machine.transitionTo('IDLE');
      expect(result).toBe(true);
      expect(machine.currentState()).toBe('IDLE');
    });

    it('READY → PLAYING', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      const result = machine.transitionTo('PLAYING');
      expect(result).toBe(true);
      expect(machine.isPlaying()).toBe(true);
    });

    it('READY → IDLE (cancel session before play)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      const result = machine.transitionTo('IDLE');
      expect(result).toBe(true);
      expect(machine.currentState()).toBe('IDLE');
    });

    it('PLAYING → ANSWERING', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      const result = machine.transitionTo('ANSWERING');
      expect(result).toBe(true);
      expect(machine.isAnswering()).toBe(true);
    });

    it('PLAYING → PAUSED and PAUSED → PLAYING (pause / resume)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');

      const pauseResult = machine.transitionTo('PAUSED');
      expect(pauseResult).toBe(true);
      expect(machine.currentState()).toBe('PAUSED');
      expect(machine.isPaused()).toBe(true);

      const resumeResult = machine.transitionTo('PLAYING');
      expect(resumeResult).toBe(true);
      expect(machine.currentState()).toBe('PLAYING');
      expect(machine.isPlaying()).toBe(true);
    });

    it('PAUSED → COMPLETED (quit from paused)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('PAUSED');

      const result = machine.transitionTo('COMPLETED');
      expect(result).toBe(true);
      expect(machine.currentState()).toBe('COMPLETED');
    });

    it('PAUSED → IDLE (abort from paused)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('PAUSED');

      const result = machine.transitionTo('IDLE');
      expect(result).toBe(true);
      expect(machine.currentState()).toBe('IDLE');
    });

    it('PLAYING → ADVANCING (skip game)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      const result = machine.transitionTo('ADVANCING');
      expect(result).toBe(true);
      expect(machine.isAdvancing()).toBe(true);
    });

    it('PLAYING → COMPLETED (quit during play)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      const result = machine.transitionTo('COMPLETED');
      expect(result).toBe(true);
      expect(machine.isCompleted()).toBe(true);
    });

    it('PLAYING → IDLE (abort during play)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      const result = machine.transitionTo('IDLE');
      expect(result).toBe(true);
      expect(machine.isIdle()).toBe(true);
    });

    it('ANSWERING → FEEDBACK', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      const result = machine.transitionTo('FEEDBACK');
      expect(result).toBe(true);
      expect(machine.isFeedback()).toBe(true);
    });

    it('FEEDBACK → ADVANCING', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      machine.transitionTo('FEEDBACK');
      const result = machine.transitionTo('ADVANCING');
      expect(result).toBe(true);
      expect(machine.isAdvancing()).toBe(true);
    });

    it('FEEDBACK → IDLE (quit on feedback)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      machine.transitionTo('FEEDBACK');
      const result = machine.transitionTo('IDLE');
      expect(result).toBe(true);
      expect(machine.isIdle()).toBe(true);
    });

    it('ADVANCING → READY (loop for next game)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      machine.transitionTo('FEEDBACK');
      machine.transitionTo('ADVANCING');
      const result = machine.transitionTo('READY');
      expect(result).toBe(true);
      expect(machine.isReady()).toBe(true);
    });

    it('ADVANCING → LOADING (load dynamic content for next game)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      machine.transitionTo('FEEDBACK');
      machine.transitionTo('ADVANCING');
      const result = machine.transitionTo('LOADING');
      expect(result).toBe(true);
      expect(machine.isLoading()).toBe(true);
    });

    it('ADVANCING → COMPLETED (end of journey)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      machine.transitionTo('FEEDBACK');
      machine.transitionTo('ADVANCING');
      const result = machine.transitionTo('COMPLETED');
      expect(result).toBe(true);
      expect(machine.isCompleted()).toBe(true);
    });

    it('ADVANCING → IDLE (cancel on advancing)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      machine.transitionTo('FEEDBACK');
      machine.transitionTo('ADVANCING');
      const result = machine.transitionTo('IDLE');
      expect(result).toBe(true);
      expect(machine.isIdle()).toBe(true);
    });

    it('LOADING → COMPLETED (empty content edge case)', () => {
      machine.transitionTo('LOADING');
      const result = machine.transitionTo('COMPLETED');
      expect(result).toBe(true);
      expect(machine.isCompleted()).toBe(true);
    });

    it('FEEDBACK → COMPLETED (last game complete)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      machine.transitionTo('FEEDBACK');
      const result = machine.transitionTo('COMPLETED');
      expect(result).toBe(true);
    });

    it('COMPLETED → LOADING (restart)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('COMPLETED');
      const result = machine.transitionTo('LOADING');
      expect(result).toBe(true);
    });

    it('COMPLETED → IDLE (finish and reset)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('COMPLETED');
      const result = machine.transitionTo('IDLE');
      expect(result).toBe(true);
      expect(machine.isIdle()).toBe(true);
    });
  });

  describe('invalid transitions', () => {
    it('IDLE → PLAYING should throw InvalidStateTransitionError and retain state', () => {
      expect(() => machine.transitionTo('PLAYING')).toThrow(InvalidStateTransitionError);
      expect(machine.currentState()).toBe('IDLE');
    });

    it('IDLE → FEEDBACK should throw InvalidStateTransitionError', () => {
      expect(() => machine.transitionTo('FEEDBACK')).toThrow(InvalidStateTransitionError);
    });

    it('LOADING → PLAYING should throw InvalidStateTransitionError (must go through READY)', () => {
      machine.transitionTo('LOADING');
      expect(() => machine.transitionTo('PLAYING')).toThrow(InvalidStateTransitionError);
      expect(machine.currentState()).toBe('LOADING');
    });

    it('PLAYING → FEEDBACK should throw InvalidStateTransitionError (must go through ANSWERING)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      expect(() => machine.transitionTo('FEEDBACK')).toThrow(InvalidStateTransitionError);
      expect(machine.currentState()).toBe('PLAYING');
    });

    it('ANSWERING → READY should throw InvalidStateTransitionError', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.transitionTo('ANSWERING');
      expect(() => machine.transitionTo('READY')).toThrow(InvalidStateTransitionError);
      expect(machine.currentState()).toBe('ANSWERING');
    });

    it('COMPLETED → PLAYING should throw InvalidStateTransitionError', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('COMPLETED');
      expect(() => machine.transitionTo('PLAYING')).toThrow(InvalidStateTransitionError);
      expect(machine.currentState()).toBe('COMPLETED');
    });
  });

  describe('transition query methods', () => {
    it('canTransitionTo should return true for valid transitions and false for invalid without throwing', () => {
      expect(machine.canTransitionTo('LOADING')).toBe(true);
      expect(machine.canTransitionTo('PLAYING')).toBe(false);
      expect(machine.canTransitionTo('FEEDBACK')).toBe(false);

      machine.transitionTo('LOADING');
      expect(machine.canTransitionTo('READY')).toBe(true);
      expect(machine.canTransitionTo('COMPLETED')).toBe(true);
      expect(machine.canTransitionTo('IDLE')).toBe(true);
      expect(machine.canTransitionTo('PLAYING')).toBe(false);
    });

    it('getAllowedTransitions should return expected next states for current or given state', () => {
      expect(machine.getAllowedTransitions()).toEqual(['LOADING']);
      expect(machine.getAllowedTransitions('PLAYING')).toEqual([
        'ANSWERING',
        'ADVANCING',
        'PAUSED',
        'COMPLETED',
        'IDLE',
      ]);
      expect(machine.getAllowedTransitions('PAUSED')).toEqual([
        'PLAYING',
        'COMPLETED',
        'IDLE',
      ]);
      expect(machine.getAllowedTransitions('COMPLETED')).toEqual([
        'IDLE',
        'LOADING',
      ]);
    });
  });

  describe('helper methods', () => {
    it('startLoading() should transition from IDLE to LOADING', () => {
      machine.startLoading();
      expect(machine.currentState()).toBe('LOADING');
    });

    it('setReady() should transition from LOADING to READY', () => {
      machine.startLoading();
      machine.setReady();
      expect(machine.currentState()).toBe('READY');
    });

    it('pause() and resume() should work when in PLAYING state', () => {
      machine.startLoading();
      machine.setReady();
      machine.startPlaying();

      machine.pause();
      expect(machine.isPaused()).toBe(true);

      machine.resume();
      expect(machine.isPlaying()).toBe(true);
    });

    it('complete() should transition from FEEDBACK to COMPLETED', () => {
      machine.startLoading();
      machine.setReady();
      machine.startPlaying();
      machine.submitAnswer();
      machine.showFeedback();
      machine.complete();
      expect(machine.isCompleted()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset to IDLE from any state', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.reset();
      expect(machine.currentState()).toBe('IDLE');
      expect(machine.isIdle()).toBe(true);
    });
  });

  describe('hooks', () => {
    it('should call onEnter hook when transitioning into a state', () => {
      const onEnter = jest.fn();
      machine.registerHooks('LOADING', { onEnter });

      machine.transitionTo('LOADING');

      expect(onEnter).toHaveBeenCalledTimes(1);
      const event: StateTransitionEvent = onEnter.mock.calls[0][0];
      expect(event.from).toBe('IDLE');
      expect(event.to).toBe('LOADING');
      expect(event.timeInPreviousStateMs).toBeGreaterThanOrEqual(0);
    });

    it('should call onExit hook when leaving a state', () => {
      const onExit = jest.fn();
      machine.registerHooks('LOADING', { onExit });

      machine.transitionTo('LOADING');
      expect(onExit).not.toHaveBeenCalled();

      machine.transitionTo('READY');
      expect(onExit).toHaveBeenCalledTimes(1);
      const event: StateTransitionEvent = onExit.mock.calls[0][0];
      expect(event.from).toBe('LOADING');
      expect(event.to).toBe('READY');
    });

    it('should call both onExit and onEnter in correct order during transition', () => {
      const order: string[] = [];

      machine.registerHooks('LOADING', {
        onExit: () => order.push('exit-LOADING'),
      });
      machine.registerHooks('READY', {
        onEnter: () => order.push('enter-READY'),
      });

      machine.transitionTo('LOADING');
      machine.transitionTo('READY');

      expect(order).toEqual(['exit-LOADING', 'enter-READY']);
    });

    it('should NOT call hooks on reset', () => {
      const onExit = jest.fn();
      machine.registerHooks('PLAYING', { onExit });

      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      machine.reset();

      expect(onExit).not.toHaveBeenCalled();
    });

    it('should pass context through to hooks', () => {
      const onEnter = jest.fn();
      machine.registerHooks('LOADING', { onEnter });

      machine.transitionTo('LOADING', { reason: 'test' });

      const event: StateTransitionEvent = onEnter.mock.calls[0][0];
      expect(event.context).toEqual({ reason: 'test' });
    });
  });

  describe('global transition listeners', () => {
    it('should notify listeners on every successful transition', () => {
      const listener = jest.fn();
      machine.onTransition(listener);

      machine.transitionTo('LOADING');
      machine.transitionTo('READY');

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener.mock.calls[0][0].to).toBe('LOADING');
      expect(listener.mock.calls[1][0].to).toBe('READY');
    });

    it('should NOT notify listeners on failed transitions', () => {
      const listener = jest.fn();
      machine.onTransition(listener);

      expect(() => machine.transitionTo('PLAYING')).toThrow(InvalidStateTransitionError);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should allow removing listeners via cleanup function', () => {
      const listener = jest.fn();
      const cleanup = machine.onTransition(listener);

      machine.transitionTo('LOADING');
      expect(listener).toHaveBeenCalledTimes(1);

      cleanup();
      machine.transitionTo('READY');
      expect(listener).toHaveBeenCalledTimes(1); // Should not increase
    });
  });

  describe('clearHooks', () => {
    it('should remove all hooks and listeners', () => {
      const onEnter = jest.fn();
      const listener = jest.fn();

      machine.registerHooks('LOADING', { onEnter });
      machine.onTransition(listener);

      machine.clearHooks();
      machine.transitionTo('LOADING');

      expect(onEnter).not.toHaveBeenCalled();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('full game loop', () => {
    it('should complete a full loop: IDLE → LOADING → READY → PLAYING → ANSWERING → FEEDBACK → ADVANCING → READY → ... → COMPLETED', () => {
      // Start
      expect(machine.transitionTo('LOADING')).toBe(true);
      expect(machine.transitionTo('READY')).toBe(true);
      expect(machine.transitionTo('PLAYING')).toBe(true);

      // First game answer
      expect(machine.transitionTo('ANSWERING')).toBe(true);
      expect(machine.transitionTo('FEEDBACK')).toBe(true);
      expect(machine.transitionTo('ADVANCING')).toBe(true);

      // Second game
      expect(machine.transitionTo('READY')).toBe(true);
      expect(machine.transitionTo('PLAYING')).toBe(true);
      expect(machine.transitionTo('ANSWERING')).toBe(true);
      expect(machine.transitionTo('FEEDBACK')).toBe(true);

      // Journey complete
      expect(machine.transitionTo('COMPLETED')).toBe(true);
      expect(machine.isCompleted()).toBe(true);
    });
  });

  describe('exhaustive transition matrix (all from x to combinations)', () => {
    const ALL_STATES: GameState[] = [
      'IDLE',
      'LOADING',
      'READY',
      'PLAYING',
      'PAUSED',
      'ANSWERING',
      'FEEDBACK',
      'ADVANCING',
      'COMPLETED',
    ];

    it('should allow exactly valid transitions and throw InvalidStateTransitionError for all other combinations', () => {
      for (const fromState of ALL_STATES) {
        const allowedTargets = machine.getAllowedTransitions(fromState);

        for (const toState of ALL_STATES) {
          // Setup state machine to fromState using reset & valid path or helper
          const sm = new GameStateMachine();
          reachState(sm, fromState);
          expect(sm.currentState()).toBe(fromState);

          if (allowedTargets.includes(toState)) {
            expect(() => sm.transitionTo(toState)).not.toThrow();
            expect(sm.currentState()).toBe(toState);
          } else {
            expect(() => sm.transitionTo(toState)).toThrow(InvalidStateTransitionError);
            expect(sm.currentState()).toBe(fromState);
          }
        }
      }
    });

    function reachState(sm: GameStateMachine, target: GameState): void {
      if (target === 'IDLE') return;
      sm.transitionTo('LOADING');
      if (target === 'LOADING') return;
      if (target === 'COMPLETED') {
        sm.transitionTo('COMPLETED');
        return;
      }
      sm.transitionTo('READY');
      if (target === 'READY') return;
      sm.transitionTo('PLAYING');
      if (target === 'PLAYING') return;
      if (target === 'PAUSED') {
        sm.transitionTo('PAUSED');
        return;
      }
      sm.transitionTo('ANSWERING');
      if (target === 'ANSWERING') return;
      sm.transitionTo('FEEDBACK');
      if (target === 'FEEDBACK') return;
      sm.transitionTo('ADVANCING');
      if (target === 'ADVANCING') return;
    }
  });
});

