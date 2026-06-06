import { TestBed } from '@angular/core/testing';
import { EconomyBridgeService } from './economy-bridge.service';
import {
  EconomyDispatcher,
  ECONOMY_DISPATCHER,
  EconomyClaimPayload,
} from './economy-dispatcher';

class MockEconomyDispatcher implements EconomyDispatcher {
  dispatched: EconomyClaimPayload[] = [];

  async dispatch(payload: EconomyClaimPayload): Promise<void> {
    this.dispatched.push(payload);
  }
}

describe('EconomyBridgeService', () => {
  let service: EconomyBridgeService;
  let mockDispatcher: MockEconomyDispatcher;

  beforeEach(() => {
    mockDispatcher = new MockEconomyDispatcher();
    TestBed.configureTestingModule({
      providers: [
        EconomyBridgeService,
        { provide: ECONOMY_DISPATCHER, useValue: mockDispatcher },
      ],
    });
    service = TestBed.inject(EconomyBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('processGameResult — juegos recompensados', () => {
    it('should dispatch payload for a correct answer', async () => {
      service.processGameResult('session-1', {
        gameType: 'intruder',
        answer: { selectedItemId: '4' },
        isCorrect: true,
        score: 100,
        timeSpentMs: 2000,
      });

      await Promise.resolve();
      expect(mockDispatcher.dispatched).toHaveLength(1);
      expect(mockDispatcher.dispatched[0]).toEqual({
        gameSessionId: 'session-1',
        score: 100,
        victory: true,
      });
    });

    it('should dispatch payload for an incorrect answer', async () => {
      service.processGameResult('session-2', {
        gameType: 'read-select',
        answer: { selectedOptionId: 'wrong' },
        isCorrect: false,
        score: 20,
        timeSpentMs: 5000,
      });

      await Promise.resolve();
      expect(mockDispatcher.dispatched[0].victory).toBe(false);
      expect(mockDispatcher.dispatched[0].score).toBe(20);
    });

    it('should map sessionId correctly as gameSessionId', async () => {
      const sessionId = 'abc-123-xyz';
      service.processGameResult(sessionId, {
        gameType: 'intruder',
        answer: { selectedItemId: '1' },
        isCorrect: true,
        score: 50,
        timeSpentMs: 1000,
      });

      await Promise.resolve();
      expect(mockDispatcher.dispatched[0].gameSessionId).toBe(sessionId);
    });
  });

  describe('processGameResult — juegos sin recompensa', () => {
    it('should NOT dispatch for avatar game type', async () => {
      service.processGameResult('session-avatar', {
        gameType: 'avatar',
        answer: { selectedAvatarId: 'astro' },
        isCorrect: true,
        score: 50,
        timeSpentMs: 0,
      });

      await Promise.resolve();
      expect(mockDispatcher.dispatched).toHaveLength(0);
    });
  });

  describe('processGameResult — todos los game types recompensados', () => {
    const rewardedTypes = [
      'read-select',
      'fill-in-the-blanks',
      'intruder',
      'listen-type',
      'read-aloud',
      'timeline-order',
      'categorization',
      'spotlight',
      'neural-link',
      'balance-master',
      'sound-match',
      'speak-about-photo',
    ] as const;

    rewardedTypes.forEach((gameType) => {
      it(`should dispatch for game type: ${gameType}`, async () => {
        const localDispatcher = new MockEconomyDispatcher();
        TestBed.overrideProvider(ECONOMY_DISPATCHER, { useValue: localDispatcher });
        const svc = TestBed.inject(EconomyBridgeService);

        svc.processGameResult(`session-${gameType}`, {
          gameType,
          answer: {},
          isCorrect: true,
          score: 100,
          timeSpentMs: 1000,
        } as any);

        await Promise.resolve();
        expect(localDispatcher.dispatched).toHaveLength(1);
      });
    });
  });
});