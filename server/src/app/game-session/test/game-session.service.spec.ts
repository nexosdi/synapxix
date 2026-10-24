import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { GameSessionService } from '../game-session.service';
import { GameSessionRepository } from '../game-session.repository';

describe('GameSessionService', () => {
  let service: GameSessionService;

  const USER_ID    = '00000000-0000-4000-8000-000000000001';
  const OTHER_ID   = '00000000-0000-4000-8000-000000000002';
  const SESSION_ID = '00000000-0000-4000-8000-000000000010';

  const mockRepository = {
    createSession:          jest.fn(),
    getSession:             jest.fn(),
    getSessionWithAttempts: jest.fn(),
    getSessionsWithAttempts:jest.fn(),
    createAttempt:          jest.fn(),
    completeSession:        jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionService,
        { provide: GameSessionRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<GameSessionService>(GameSessionService);
    jest.clearAllMocks();
  });

  // ─── startSession ──────────────────────────────────────────────────────────

  describe('startSession', () => {
    it('should return the new sessionId (happy path)', async () => {
      mockRepository.createSession.mockResolvedValue({ session_id: SESSION_ID });

      const result = await service.startSession(USER_ID, {
        historyId: 'history-1',
        category: 'memory',
      });

      expect(mockRepository.createSession).toHaveBeenCalledWith(USER_ID, {
        historyId: 'history-1',
        category: 'memory',
      });
      expect(result).toEqual({ sessionId: SESSION_ID });
    });
  });

  // ─── submitAttempt ─────────────────────────────────────────────────────────

  describe('submitAttempt', () => {
    const dto = {
      contentId: 'content-1',
      gameType: 'memory',
      isCorrect: true,
      score: 100,
      completedQuickly: true,
    };

    it('should return attemptId and completedQuickly (happy path)', async () => {
      mockRepository.getSession.mockResolvedValue({
        session_id: SESSION_ID,
        user_id: USER_ID,
        status: 'playing',
      });
      mockRepository.createAttempt.mockResolvedValue({
        attempt_id: 'attempt-1',
        completed_quickly: true,
      });

      const result = await service.submitAttempt(USER_ID, SESSION_ID, dto);

      expect(mockRepository.createAttempt).toHaveBeenCalledWith(SESSION_ID, dto);
      expect(result).toEqual({ attemptId: 'attempt-1', completedQuickly: true });
    });

    it('should throw NotFoundException when the session does not exist', async () => {
      mockRepository.getSession.mockResolvedValue(null);

      await expect(service.submitAttempt(USER_ID, SESSION_ID, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.createAttempt).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when the session belongs to another user', async () => {
      mockRepository.getSession.mockResolvedValue({
        session_id: SESSION_ID,
        user_id: OTHER_ID,
        status: 'playing',
      });

      await expect(service.submitAttempt(USER_ID, SESSION_ID, dto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockRepository.createAttempt).not.toHaveBeenCalled();
    });
  });

  // ─── completeSession ───────────────────────────────────────────────────────

  describe('completeSession', () => {
    it('should return the sessionId on a successful completion (happy path)', async () => {
      mockRepository.getSession.mockResolvedValue({
        session_id: SESSION_ID,
        user_id: USER_ID,
        status: 'playing',
      });
      mockRepository.completeSession.mockResolvedValue({ session_id: SESSION_ID });

      const result = await service.completeSession(USER_ID, SESSION_ID);

      expect(mockRepository.completeSession).toHaveBeenCalledWith(SESSION_ID);
      expect(result).toEqual({ sessionId: SESSION_ID });
    });

    it('should throw NotFoundException when the session does not exist', async () => {
      mockRepository.getSession.mockResolvedValue(null);

      await expect(service.completeSession(USER_ID, SESSION_ID)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.completeSession).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when the session belongs to another user', async () => {
      mockRepository.getSession.mockResolvedValue({
        session_id: SESSION_ID,
        user_id: OTHER_ID,
        status: 'completed',
      });

      await expect(service.completeSession(USER_ID, SESSION_ID)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockRepository.completeSession).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when trying to complete an already-completed session', async () => {
      mockRepository.getSession.mockResolvedValue({
        session_id: SESSION_ID,
        user_id:    USER_ID,
        status:     'completed',
      });

      await expect(service.completeSession(USER_ID, SESSION_ID)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.completeSession).not.toHaveBeenCalled();
    });
  });
});
