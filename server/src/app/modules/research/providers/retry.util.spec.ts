import { Logger } from '@nestjs/common';
import { withRetry } from './retry.util';

/**
 * Unit tests for the `withRetry` utility function.
 *
 * These tests verify the exponential-backoff retry mechanism in isolation,
 * without any dependency on external APIs or NestJS runtime.
 *
 * Strategy:
 *   - `setTimeout` is mocked via Jest fake timers to avoid real delays.
 *   - A mock `Logger` captures log calls for assertion.
 *   - Each test exercises a specific retry scenario (success, retryable
 *     errors, non-retryable errors, Retry-After header, etc.).
 */

// Use fake timers to avoid real delays during tests
jest.useFakeTimers();

describe('withRetry', () => {
  let mockLogger: Logger;

  beforeEach(() => {
    // Create a mock logger to verify log output without console noise
    mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
    } as unknown as Logger;
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  /**
   * Happy path: the wrapped function succeeds on the first call.
   * No retries should occur and no logs should be emitted.
   */
  it('should return result on first try without retrying', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    const resultPromise = withRetry(fn, { maxRetries: 3 }, mockLogger);
    // Advance timers in case setTimeout was scheduled (it shouldn't be)
    jest.runAllTimers();
    const result = await resultPromise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(mockLogger.warn).not.toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  /**
   * Verifies that a 429 error triggers a retry and the function ultimately
   * succeeds on the second attempt.
   */
  it('should retry on retryable error (429) and succeed on next attempt', async () => {
    const retryableError = { status: 429, message: 'Rate limited' };
    const fn = jest
      .fn()
      .mockRejectedValueOnce(retryableError)
      .mockResolvedValue('recovered');

    const resultPromise = withRetry(
      fn,
      { maxRetries: 3, baseDelayMs: 100 },
      mockLogger,
    );

    // Flush all pending timers (the retry delay)
    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('429'),
    );
  });

  /**
   * Same as above but for HTTP 500 — both 429 and 500 are retryable by default.
   */
  it('should retry on retryable error (500) and succeed on next attempt', async () => {
    const serverError = { status: 500, message: 'Internal Server Error' };
    const fn = jest
      .fn()
      .mockRejectedValueOnce(serverError)
      .mockResolvedValue('recovered');

    const resultPromise = withRetry(
      fn,
      { maxRetries: 3, baseDelayMs: 100 },
      mockLogger,
    );

    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  /**
   * When all retry attempts are exhausted (persistent 429), the function
   * should throw the last error and log an exhaustion message.
   */
  it('should exhaust retries and throw on persistent retryable error', async () => {
    const retryableError = { status: 429, message: 'Rate limited' };
    const fn = jest.fn().mockRejectedValue(retryableError);

    let caughtError: unknown;
    const resultPromise = withRetry(
      fn,
      { maxRetries: 2, baseDelayMs: 100 },
      mockLogger,
    ).catch((err) => {
      caughtError = err;
    });

    await jest.runAllTimersAsync();
    await resultPromise;

    expect(caughtError).toEqual(retryableError);
    // 1 initial + 2 retries = 3 total calls
    expect(fn).toHaveBeenCalledTimes(3);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('All retry attempts exhausted'),
    );
  });


  /**
   * Non-retryable errors (e.g. 401 Unauthorized) must cause immediate
   * failure with no retries.
   */
  it('should not retry on non-retryable errors (401)', async () => {
    const authError = { status: 401, message: 'Unauthorized' };
    const fn = jest.fn().mockRejectedValue(authError);

    const resultPromise = withRetry(
      fn,
      { maxRetries: 3, baseDelayMs: 100 },
      mockLogger,
    );

    await expect(resultPromise).rejects.toEqual(authError);
    // Only 1 call — no retries for 401
    expect(fn).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Non-retryable'),
    );
  });

  /**
   * When the error contains a `retryAfter` field, the delay should use
   * that value (in seconds → ms) instead of the computed exponential backoff.
   */
  it('should respect Retry-After header when present', async () => {
    const errorWithRetryAfter = {
      status: 429,
      message: 'Rate limited',
      retryAfter: 2, // 2 seconds
    };
    const fn = jest
      .fn()
      .mockRejectedValueOnce(errorWithRetryAfter)
      .mockResolvedValue('recovered');

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const resultPromise = withRetry(
      fn,
      { maxRetries: 3, baseDelayMs: 100 },
      mockLogger,
    );

    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toBe('recovered');
    // Verify that setTimeout was called with a delay of 2000ms (2 seconds * 1000)
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2000);

    setTimeoutSpy.mockRestore();
  });

  /**
   * Exponential backoff verification: successive delays should grow by
   * roughly a factor of 2 (plus random jitter).
   */
  it('should use exponential backoff for delays', async () => {
    const retryableError = { status: 503, message: 'Service Unavailable' };
    const fn = jest
      .fn()
      .mockRejectedValueOnce(retryableError)
      .mockRejectedValueOnce(retryableError)
      .mockResolvedValue('recovered');

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const resultPromise = withRetry(
      fn,
      { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000 },
      mockLogger,
    );

    await jest.runAllTimersAsync();
    await resultPromise;

    // Extract the delay values from setTimeout calls related to retry
    const delays = setTimeoutSpy.mock.calls
      .map((call) => call[1] as number)
      .filter((d) => d >= 1000);

    // First delay should be around baseDelayMs * 2^0 + jitter ≈ 1000–2000ms
    expect(delays[0]).toBeGreaterThanOrEqual(1000);
    expect(delays[0]).toBeLessThanOrEqual(2000);

    // Second delay should be around baseDelayMs * 2^1 + jitter ≈ 2000–3000ms
    expect(delays[1]).toBeGreaterThanOrEqual(2000);
    expect(delays[1]).toBeLessThanOrEqual(3000);

    setTimeoutSpy.mockRestore();
  });

  /**
   * When no logger is provided, the function should still work correctly
   * without throwing due to undefined logger references.
   */
  it('should work without a logger', async () => {
    const retryableError = { status: 500, message: 'Server Error' };
    const fn = jest
      .fn()
      .mockRejectedValueOnce(retryableError)
      .mockResolvedValue('ok');

    const resultPromise = withRetry(fn, { maxRetries: 2, baseDelayMs: 100 });

    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
