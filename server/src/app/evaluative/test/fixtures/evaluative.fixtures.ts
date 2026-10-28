import { EvaluateSessionDto, EvaluateAiInputDto, GameAttemptRecordDto } from '../../dto/evaluate-session.dto';
import { KeycloakJwtPayload } from '../../../auth/jwt.strategy';

/**
 * Mock User ID used across tests to simulate an authenticated user.
 */
export const mockUserId = 'usr-test-1234-uuid';

/**
 * Mock Session ID used across tests to identify a specific game session.
 */
export const mockSessionId = 'sess-test-5678-uuid';

/**
 * Mock JWT payload mimicking the data provided by Keycloak for a standard student user.
 */
export const mockUserJwtPayload: KeycloakJwtPayload = {
  sub: mockUserId,
  email_verified: true,
  preferred_username: 'student_user',
  email: 'student@example.com',
  realm_access: { roles: ['user'] },
  resource_access: {},
};

/**
 * A collection of mock game attempts representing a typical session.
 * Includes a fast correct answer, a slow incorrect answer, and a repeated correct answer 
 * to test various metrics like accuracy, cognitive load, and memory retention.
 */
export const mockValidAttempts: GameAttemptRecordDto[] = [
  {
    contentId: 'content-1',
    gameType: 'memory',
    isCorrect: true,
    score: 100,
    completedQuickly: true,
    reactionTimeMs: 1200,
  },
  {
    contentId: 'content-2',
    gameType: 'memory',
    isCorrect: false,
    score: 0,
    completedQuickly: false,
    reactionTimeMs: 3500,
  },
  {
    contentId: 'content-1', // repeated content to test memory retention
    gameType: 'memory',
    isCorrect: true,
    score: 95,
    completedQuickly: true,
    reactionTimeMs: 1500,
  }
];

/**
 * Mock DTO for a standard session evaluation containing the session ID and the attempts.
 */
export const mockEvaluateSessionDto: EvaluateSessionDto = {
  sessionId: mockSessionId,
  attempts: mockValidAttempts,
};

/**
 * Mock DTO for AI semantic evaluation, omitting audio-related fields.
 */
export const mockEvaluateAiInputDto: EvaluateAiInputDto = {
  sessionId: mockSessionId,
  gameType: 'phonological',
  promptOrContext: 'Repeat the word: "Cat"',
  studentTextResponse: 'Cat',
};

/**
 * Mock DTO for AI audio/phonetic evaluation, including base64 audio data and expected text.
 */
export const mockEvaluateAiAudioDto: EvaluateAiInputDto = {
  sessionId: mockSessionId,
  gameType: 'phonological',
  promptOrContext: 'Read aloud: "The quick brown fox"',
  expectedText: 'The quick brown fox',
  audioMimeType: 'audio/webm',
  audioBase64: 'UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==', // dummy base64
};

/**
 * Mock structure for the resulting cognitive metric saved in the database after evaluation.
 */
export const mockCognitiveMetricResult = {
  metric_id: 'metric-123',
  session_id: mockSessionId,
  user_id: mockUserId,
  accuracy: 0.6667,
  reaction_time: 2066.67,
  cognitive_load: 37.33,
  memory_retention: 1,
  attention_span: 1,
  created_at: new Date('2026-09-01T12:00:00Z'),
};

/**
 * Mock representation of an active game session from the database.
 */
export const mockGameSession = {
  session_id: mockSessionId,
  user_id: mockUserId,
  game_id: 'game-1',
  status: 'in_progress',
  started_at: new Date('2026-09-01T11:55:00Z'),
  finished_at: null,
};
