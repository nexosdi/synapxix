import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { GameSessionRepository } from '../game-session.repository';

describe('GameSessionRepository', () => {
  let repository: GameSessionRepository;

  const SESSION_ID = '00000000-0000-4000-8000-000000000010';
  const USER_ID    = '00000000-0000-4000-8000-000000000001';

  const mockPrisma = {
    gameSession: {
      create:     jest.fn(),
      findUnique: jest.fn(),
      findMany:   jest.fn(),
      update:     jest.fn(),
    },
    gameAttempt: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<GameSessionRepository>(GameSessionRepository);
    jest.clearAllMocks();
  });

  // ─── getSession ────────────────────────────────────────────────────────────

  describe('getSession', () => {
    it('should return null when the session does not exist', async () => {
      mockPrisma.gameSession.findUnique.mockResolvedValue(null);

      const result = await repository.getSession('non-existent-id');

      expect(mockPrisma.gameSession.findUnique).toHaveBeenCalledWith({
        where: { session_id: 'non-existent-id' },
      });
      expect(result).toBeNull();
    });

    it('should return the session when it exists', async () => {
      const session = { session_id: SESSION_ID, user_id: USER_ID, status: 'playing' };
      mockPrisma.gameSession.findUnique.mockResolvedValue(session);

      const result = await repository.getSession(SESSION_ID);

      expect(result).toEqual(session);
    });
  });

  // ─── createSession ─────────────────────────────────────────────────────────

  describe('createSession', () => {
    it('should create a session with status "playing"', async () => {
      const created = { session_id: SESSION_ID, user_id: USER_ID, status: 'playing' };
      mockPrisma.gameSession.create.mockResolvedValue(created);

      const result = await repository.createSession(USER_ID, {
        historyId: 'history-1',
        category: 'memory',
      });

      expect(mockPrisma.gameSession.create).toHaveBeenCalledWith({
        data: {
          user_id:    USER_ID,
          history_id: 'history-1',
          category:   'memory',
          status:     'playing',
        },
      });
      expect(result.session_id).toBe(SESSION_ID);
      expect(result.status).toBe('playing');
    });
  });

  // ─── completeSession ───────────────────────────────────────────────────────

  describe('completeSession', () => {
    it('should update status to "completed" and set finished_at', async () => {
      const updated = { session_id: SESSION_ID, status: 'completed', finished_at: new Date() };
      mockPrisma.gameSession.update.mockResolvedValue(updated);

      const result = await repository.completeSession(SESSION_ID);

      expect(mockPrisma.gameSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { session_id: SESSION_ID },
          data:  expect.objectContaining({ status: 'completed' }),
        }),
      );
      expect(result.status).toBe('completed');
      expect(result.finished_at).toBeDefined();
    });
  });
});
