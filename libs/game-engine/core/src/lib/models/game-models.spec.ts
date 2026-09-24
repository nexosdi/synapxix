import {
  createGameFlowConfig,
  DEFAULT_FLOW_CONFIG,
} from './game-flow-config';
import {
  createGameResult,
  createReadSelectResult,
  createFillBlanksResult,
  createIntruderResult,
  createAvatarResult,
  createListenTypeResult,
  createReadAloudResult,
  createTimelineOrderResult,
  createCategorizationResult,
  createSpotlightResult,
  createNeuralLinkResult,
  createBalanceMasterResult,
  createSoundMatchResult,
  createSpeakAboutPhotoResult,
} from './game-result.model';
import {
  createGameSession,
  createGameAttempt,
  createGameProgress,
  createGameSessionSummary,
} from './game-session.model';

describe('Game Engine Models & Factories', () => {
  describe('GameFlowConfig Factory', () => {
    it('should create default config when no overrides are passed', () => {
      const config = createGameFlowConfig();
      expect(config).toEqual(DEFAULT_FLOW_CONFIG);
      expect(config.readyToPlayDelayMs).toBe(300);
      expect(config.answerToFeedbackDelayMs).toBe(800);
      expect(config.feedbackAutoAdvanceMs).toBe(0);
    });

    it('should allow partial overrides of timing properties', () => {
      const config = createGameFlowConfig({
        readyToPlayDelayMs: 500,
        feedbackAutoAdvanceMs: 1500,
      });
      expect(config.readyToPlayDelayMs).toBe(500);
      expect(config.answerToFeedbackDelayMs).toBe(800);
      expect(config.feedbackAutoAdvanceMs).toBe(1500);
    });
  });

  describe('GameResult Factories', () => {
    it('createGameResult should create generic game result with defaults and overrides', () => {
      const defaultResult = createGameResult('read-select');
      expect(defaultResult.gameType).toBe('read-select');
      expect(defaultResult.isCorrect).toBe(true);
      expect(defaultResult.score).toBe(100);
      expect(defaultResult.timeSpentMs).toBe(1500);

      const overridden = createGameResult('read-select', {
        isCorrect: false,
        score: 0,
        timeSpentMs: 3200,
        feedback: 'Incorrect choice',
      });
      expect(overridden.isCorrect).toBe(false);
      expect(overridden.score).toBe(0);
      expect(overridden.timeSpentMs).toBe(3200);
      expect(overridden.feedback).toBe('Incorrect choice');
    });

    it('createReadSelectResult should have valid structure and allow overrides', () => {
      const res = createReadSelectResult();
      expect(res.gameType).toBe('read-select');
      expect(res.answer.selectedOptionId).toBe('opt-1');

      const custom = createReadSelectResult({
        answer: { selectedOptionId: 'custom-opt' },
        score: 80,
      });
      expect(custom.answer.selectedOptionId).toBe('custom-opt');
      expect(custom.score).toBe(80);
    });

    it('createFillBlanksResult should have valid structure', () => {
      const res = createFillBlanksResult();
      expect(res.gameType).toBe('fill-in-the-blanks');
      expect(res.answer.blanks).toEqual({ 'blank-1': 'word' });
    });

    it('createIntruderResult should have valid structure', () => {
      const res = createIntruderResult();
      expect(res.gameType).toBe('intruder');
      expect(res.answer.selectedItemId).toBe('item-intruder');
    });

    it('createAvatarResult should have valid structure', () => {
      const res = createAvatarResult();
      expect(res.gameType).toBe('avatar');
      expect(res.isCorrect).toBe(true);
    });

    it('createListenTypeResult should have valid structure', () => {
      const res = createListenTypeResult();
      expect(res.gameType).toBe('listen-type');
      expect(res.answer.typedText).toBe('sample text');
    });

    it('createReadAloudResult should have valid structure', () => {
      const res = createReadAloudResult();
      expect(res.gameType).toBe('read-aloud');
      expect(res.answer.recognizedText).toBe('sample audio text');
      expect(res.answer.audioUrl).toBeDefined();
    });

    it('createTimelineOrderResult should have valid structure', () => {
      const res = createTimelineOrderResult();
      expect(res.gameType).toBe('timeline-order');
      expect(res.answer.orderedItemIds).toEqual(['item-1', 'item-2', 'item-3']);
    });

    it('createCategorizationResult should have valid structure', () => {
      const res = createCategorizationResult();
      expect(res.gameType).toBe('categorization');
      expect(res.answer.categoryMapping).toEqual({ 'item-1': 'cat-1', 'item-2': 'cat-2' });
    });

    it('createSpotlightResult should have valid structure', () => {
      const res = createSpotlightResult();
      expect(res.gameType).toBe('spotlight');
      expect(res.answer.selectedAreas).toEqual(['area-1', 'area-2']);
    });

    it('createNeuralLinkResult should have valid structure', () => {
      const res = createNeuralLinkResult();
      expect(res.gameType).toBe('neural-link');
      expect(res.answer.connections).toEqual([{ fromId: 'node-1', toId: 'node-2' }]);
    });

    it('createBalanceMasterResult should have valid structure', () => {
      const res = createBalanceMasterResult();
      expect(res.gameType).toBe('balance-master');
      expect(res.answer.balancedItems).toBeDefined();
    });

    it('createSoundMatchResult should have valid structure', () => {
      const res = createSoundMatchResult();
      expect(res.gameType).toBe('sound-match');
      expect(res.answer.matchedPairs).toEqual([{ soundId: 'snd-1', optionId: 'opt-1' }]);
    });

    it('createSpeakAboutPhotoResult should have valid structure', () => {
      const res = createSpeakAboutPhotoResult();
      expect(res.gameType).toBe('speak-about-photo');
      expect(res.answer.recognizedText).toBe('description of photo');
      expect(res.answer.audioUrl).toBeDefined();
    });
  });

  describe('GameSession Factories', () => {
    it('createGameSession should generate session with default values and unique ID', () => {
      const session1 = createGameSession();
      const session2 = createGameSession();

      expect(session1.id).toBeDefined();
      expect(session2.id).toBeDefined();
      expect(session1.id).not.toBe(session2.id);
      expect(session1.status).toBe('playing');
      expect(session1.historyId).toBe('history-mock-1');
      expect(session1.category).toBe('lengua');

      const customSession = createGameSession({
        userId: 'user-42',
        status: 'completed',
        category: 'matematica',
      });
      expect(customSession.userId).toBe('user-42');
      expect(customSession.status).toBe('completed');
      expect(customSession.category).toBe('matematica');
    });

    it('createGameAttempt should generate attempt with defaults and overrides', () => {
      const attempt1 = createGameAttempt();
      const attempt2 = createGameAttempt();

      expect(attempt1.id).not.toBe(attempt2.id);
      expect(attempt1.gameType).toBe('read-select');
      expect(attempt1.isCorrect).toBe(true);
      expect(attempt1.score).toBe(100);

      const customAttempt = createGameAttempt({
        gameType: 'intruder',
        score: 85,
        isCorrect: false,
      });
      expect(customAttempt.gameType).toBe('intruder');
      expect(customAttempt.score).toBe(85);
      expect(customAttempt.isCorrect).toBe(false);
    });

    it('createGameProgress should generate progress with defaults and overrides', () => {
      const progress = createGameProgress();
      expect(progress.sessionId).toBe('session-mock-1');
      expect(progress.totalGames).toBe(5);
      expect(progress.completedGames).toBe(1);
      expect(progress.correctCount).toBe(1);
      expect(progress.totalScore).toBe(100);
      expect(progress.currentIndex).toBe(1);

      const customProgress = createGameProgress({
        totalGames: 10,
        completedGames: 8,
        totalScore: 800,
      });
      expect(customProgress.totalGames).toBe(10);
      expect(customProgress.completedGames).toBe(8);
      expect(customProgress.totalScore).toBe(800);
    });

    it('createGameSessionSummary should generate summary with defaults and overrides', () => {
      const summary = createGameSessionSummary();
      expect(summary.sessionId).toBe('session-mock-1');
      expect(summary.totalScore).toBe(450);
      expect(summary.averageScore).toBe(90);
      expect(summary.bestScore).toBe(100);
      expect(summary.totalTimeSpentMs).toBe(12500);
      expect(summary.correctPercentage).toBe(90);

      const customSummary = createGameSessionSummary({
        totalScore: 500,
        averageScore: 100,
        correctPercentage: 100,
      });
      expect(customSummary.totalScore).toBe(500);
      expect(customSummary.averageScore).toBe(100);
      expect(customSummary.correctPercentage).toBe(100);
    });
  });
});
