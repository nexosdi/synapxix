import { GameStateMachine, GameState, StateTransitionEvent } from './game-state-machine';

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

    it('READY → PLAYING', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      const result = machine.transitionTo('PLAYING');
      expect(result).toBe(true);
      expect(machine.isPlaying()).toBe(true);
    });

    it('PLAYING → ANSWERING', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      const result = machine.transitionTo('ANSWERING');
      expect(result).toBe(true);
      expect(machine.isAnswering()).toBe(true);
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
  });

  describe('invalid transitions', () => {
    it('IDLE → PLAYING should fail', () => {
      const result = machine.transitionTo('PLAYING');
      expect(result).toBe(false);
      expect(machine.currentState()).toBe('IDLE');
    });

    it('IDLE → FEEDBACK should fail', () => {
      const result = machine.transitionTo('FEEDBACK');
      expect(result).toBe(false);
    });

    it('LOADING → PLAYING should fail (must go through READY)', () => {
      machine.transitionTo('LOADING');
      const result = machine.transitionTo('PLAYING');
      expect(result).toBe(false);
      expect(machine.currentState()).toBe('LOADING');
    });

    it('PLAYING → FEEDBACK should fail (must go through ANSWERING)', () => {
      machine.transitionTo('LOADING');
      machine.transitionTo('READY');
      machine.transitionTo('PLAYING');
      const result = machine.transitionTo('FEEDBACK');
      expect(result).toBe(false);
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

      machine.transitionTo('PLAYING'); // Invalid from IDLE

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
});
