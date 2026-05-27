import { TestBed } from '@angular/core/testing';
import { GameSessionService } from './game-session.service';

describe('GameSessionService', () => {
  let service: GameSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameSessionService],
    });
    service = TestBed.inject(GameSessionService);
  });

  describe('initial state', () => {
    it('should have no active session', () => {
      expect(service.currentSession()).toBeNull();
    });

    it('should have empty attempts', () => {
      expect(service.attempts()).toEqual([]);
    });

    it('should have null progress', () => {
      expect(service.progress()).toBeNull();
    });
  });

  describe('startSession', () => {
    it('should create a new session with correct fields', () => {
      service.startSession('history-1', 'user-1', 5);
      
      const session = service.currentSession();
      expect(session).not.toBeNull();
      expect(session!.historyId).toBe('history-1');
      expect(session!.userId).toBe('user-1');
      expect(session!.status).toBe('playing');
      expect(session!.startedAt).toBeInstanceOf(Date);
      expect(session!.finishedAt).toBeUndefined();
    });

    it('should store category when provided', () => {
      service.startSession('history-1', 'user-1', 5, 'matematica');
      
      const session = service.currentSession();
      expect(session!.category).toBe('matematica');
    });

    it('should clear previous attempts', () => {
      // Start first session and add an attempt
      service.startSession('h1', 'u1', 2);
      service.submitAttempt('c1', {
        gameType: 'intruder',
        answer: { selectedItemId: '1' },
        isCorrect: true,
        score: 100,
        timeSpentMs: 0,
      });
      expect(service.attempts().length).toBe(1);

      // Start new session — attempts should reset
      service.startSession('h2', 'u1', 3);
      expect(service.attempts().length).toBe(0);
    });

    it('should initialize progress correctly', () => {
      service.startSession('history-1', 'user-1', 10);
      
      const progress = service.progress();
      expect(progress).not.toBeNull();
      expect(progress!.totalGames).toBe(10);
      expect(progress!.completedGames).toBe(0);
      expect(progress!.correctCount).toBe(0);
      expect(progress!.totalScore).toBe(0);
      expect(progress!.currentIndex).toBe(0);
    });
  });

  describe('submitAttempt', () => {
    beforeEach(() => {
      service.startSession('history-1', 'user-1', 5);
    });

    it('should add an attempt to the list', () => {
      service.submitAttempt('content-1', {
        gameType: 'intruder',
        answer: { selectedItemId: '1' },
        isCorrect: true,
        score: 100,
        timeSpentMs: 2000,
      });

      expect(service.attempts().length).toBe(1);
      const attempt = service.attempts()[0];
      expect(attempt.contentId).toBe('content-1');
      expect(attempt.gameType).toBe('intruder');
      expect(attempt.isCorrect).toBe(true);
      expect(attempt.score).toBe(100);
      expect(attempt.timeSpentMs).toBe(2000);
    });

    it('should update progress after each attempt', () => {
      service.submitAttempt('c1', {
        gameType: 'read-select',
        answer: { selectedOptionId: 'a' },
        isCorrect: true,
        score: 50,
        timeSpentMs: 1000,
      });

      service.submitAttempt('c2', {
        gameType: 'intruder',
        answer: { selectedItemId: '2' },
        isCorrect: false,
        score: 0,
        timeSpentMs: 3000,
      });

      const progress = service.progress();
      expect(progress!.completedGames).toBe(2);
      expect(progress!.correctCount).toBe(1);
      expect(progress!.totalScore).toBe(50);
      expect(progress!.currentIndex).toBe(2);
    });

    it('should warn and skip if no session is active', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Create service without starting session
      const freshService = TestBed.inject(GameSessionService);
      freshService.submitAttempt('c1', {
        gameType: 'intruder',
        answer: { selectedItemId: 'any' },
        isCorrect: true,
        score: 100,
        timeSpentMs: 0,
      });

      // The attempt should not be added (original service has the session)
      expect(freshService.attempts().length).toBe(0);
      warnSpy.mockRestore();
    });
  });

  describe('completeSession', () => {
    it('should mark session as completed with finishedAt date', () => {
      service.startSession('history-1', 'user-1', 2);
      service.completeSession();

      const session = service.currentSession();
      expect(session!.status).toBe('completed');
      expect(session!.finishedAt).toBeInstanceOf(Date);
    });

    it('should not throw if no session exists', () => {
      expect(() => service.completeSession()).not.toThrow();
    });
  });

  describe('getProgress helper', () => {
    it('should return same value as progress signal', () => {
      service.startSession('h1', 'u1', 3);
      expect(service.getProgress()).toEqual(service.progress());
    });
  });
});
