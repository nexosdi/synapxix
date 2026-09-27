import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RealHistoryDataProvider } from './real-history-data-provider';
import { HISTORY_MOCK } from '../history-mock';

describe('RealHistoryDataProvider', () => {
  let provider: RealHistoryDataProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RealHistoryDataProvider]
    });
    provider = TestBed.inject(RealHistoryDataProvider);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getHistory()', () => {
    it('should fetch session and map it to HISTORY_MOCK', async () => {
      const sessionId = 'session-123';
      const mockSession = {
        session_id: sessionId,
        user_id: 'user-1',
        history_id: HISTORY_MOCK.id,
        category: 'test',
        status: 'completed',
        started_at: '2023-01-01',
        finished_at: '2023-01-01',
        attempts: [
          {
            attempt_id: 'att-1',
            content_id: HISTORY_MOCK.contentMap[0]?.id || 'fake-id',
            game_type: 'test',
            is_correct: true,
            score: 100,
            completed_quickly: true,
            created_at: '2023-01-01'
          }
        ]
      };

      const promise = provider.getHistory(sessionId);
      
      const req = httpMock.expectOne(`/api/game-session/${sessionId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSession);

      const result = await promise;
      expect(result).toBeTruthy();
      expect(result?.id).toBe(sessionId);
      
      if (HISTORY_MOCK.contentMap.length > 0) {
        const mappedContent = result?.contentMap.find(c => c.id === mockSession.attempts[0].content_id);
        expect(mappedContent?.result?.isCorrect).toBe(true);
        expect(mappedContent?.result?.score).toBe(100);
      }
    });

    it('should return null if history_id does not match HISTORY_MOCK', async () => {
      const sessionId = 'session-123';
      const mockSession = {
        session_id: sessionId,
        history_id: 'different-history-id',
        attempts: []
      };

      const promise = provider.getHistory(sessionId);
      httpMock.expectOne(`/api/game-session/${sessionId}`).flush(mockSession);
      const result = await promise;

      expect(result).toBeNull();
    });

    it('should return null on HTTP error', async () => {
      const sessionId = 'session-123';

      const promise = provider.getHistory(sessionId);
      httpMock.expectOne(`/api/game-session/${sessionId}`).flush(null, { status: 404, statusText: 'Not Found' });
      const result = await promise;

      expect(result).toBeNull();
    });
  });

  describe('getHistories()', () => {
    it('should return an empty array and log a warning', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const result = await provider.getHistories();
      expect(result).toEqual([]);
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
