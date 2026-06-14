import { Logger } from '@nestjs/common';

/**
 * Configuration options for the retry mechanism.
 *
 * @property maxRetries       - Maximum number of retry attempts (default: 3)
 * @property baseDelayMs      - Initial delay in milliseconds before the first retry (default: 1000)
 * @property maxDelayMs       - Upper cap on delay between retries (default: 30000)
 * @property retryableStatuses - HTTP status codes that should trigger a retry (default: [429, 500, 503])
 */
export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryableStatuses: number[];
}

/** Default retry configuration used when no overrides are supplied. */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  retryableStatuses: [429, 500, 503],
};

/**
 * Extracts an HTTP status code from an error object.
 *
 * Google Generative AI SDK errors may attach the status in different
 * locations depending on the error type. This helper normalises access.
 *
 * @param error - The caught error (may be any shape)
 * @returns The numeric HTTP status, or `undefined` if not found
 */
function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    const err = error as any;
    return err.status ?? err.httpStatusCode ?? err.code;
  }
  return undefined;
}

/**
 * Extracts the `Retry-After` value (in milliseconds) from an error, if present.
 *
 * Some APIs include a `Retry-After` header (or equivalent field) when
 * returning 429 responses. When available, this value takes precedence over
 * the computed exponential backoff delay.
 *
 * @param error - The caught error
 * @returns Delay in milliseconds, or `undefined` if no header is present
 */
function getRetryAfterMs(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    const err = error as any;
    const retryAfter = err.retryAfter ?? err.headers?.['retry-after'];
    if (retryAfter !== undefined) {
      const seconds = Number(retryAfter);
      if (!isNaN(seconds) && seconds > 0) {
        return seconds * 1000;
      }
    }
  }
  return undefined;
}

/**
 * Wraps an async operation with automatic retry logic using exponential backoff.
 *
 * Behaviour:
 *   - On a retryable error (status ∈ `retryableStatuses`), waits using
 *     exponential backoff with random jitter, then retries up to `maxRetries`.
 *   - If the error includes a `Retry-After` header, that value is used
 *     instead of the computed backoff delay.
 *   - Non-retryable errors (e.g. 400, 401, 403, 404) fail immediately.
 *   - If all retry attempts are exhausted, the last error is re-thrown.
 *
 * @template T - The return type of the wrapped function
 * @param fn      - The async function to execute (and potentially retry)
 * @param options - Partial retry configuration; defaults are applied for missing fields
 * @param logger  - Optional NestJS Logger for structured retry/failure messages
 * @returns The resolved value of `fn` on success
 * @throws The original error if it is non-retryable or all retries are exhausted
 *
 * @example
 * ```ts
 * const data = await withRetry(
 *   () => this.model.generateContent(prompt),
 *   { maxRetries: 3, baseDelayMs: 1000 },
 *   this.logger,
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
  logger?: Logger,
): Promise<T> {
  const config: RetryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      const status = getErrorStatus(error);
      const isRetryable =
        status !== undefined && config.retryableStatuses.includes(status);

      // --- Non-retryable error: fail immediately ---
      if (!isRetryable) {
        logger?.error(
          `Non-retryable error (HTTP ${status ?? 'unknown'}): ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        throw error;
      }

      // --- All retries exhausted ---
      if (attempt === config.maxRetries) {
        logger?.error(
          `All retry attempts exhausted after ${config.maxRetries} attempts. ` +
            `Last error: HTTP ${status} — ${
              error instanceof Error ? error.message : String(error)
            }`,
        );
        throw error;
      }

      // --- Calculate delay: prefer Retry-After header, fall back to exponential backoff with jitter ---
      const retryAfterMs = getRetryAfterMs(error);
      const exponentialDelay = Math.min(
        config.baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
        config.maxDelayMs,
      );
      const delay = retryAfterMs ?? exponentialDelay;

      logger?.warn(
        `Retryable error (HTTP ${status}) — retrying in ${Math.round(delay)}ms ` +
          `(attempt ${attempt + 1}/${config.maxRetries})`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This line is technically unreachable, but TypeScript requires it.
  throw lastError;
}
