/**
 * All possible UI states for the Read Aloud exercise.
 *
 * State machine transitions:
 *   idle → requestingPermission → recording → recorded → submitting → success
 *                                                                    ↘ error
 *   Any state → error (on unexpected failure)
 *   error / recorded → idle (via reset)
 */
export type RecordingState =
  | 'idle'
  | 'requestingPermission'
  | 'recording'
  | 'recorded'
  | 'submitting'
  | 'success'
  | 'error';

export type RecordingErrorType =
  | 'permissionDenied'
  | 'microphoneNotFound'
  | 'recorderError'
  | 'networkError'
  | 'serverError'
  | 'timeout';

export interface RecordingError {
  type: RecordingErrorType;
  message: string;
}

export interface ReadAloudSubmissionPayload {
  contentId: string;
  audioBlob: Blob;
  durationSec: number;
  locale: string;
  expectedText: string;
}

export interface ReadAloudSubmissionResponse {
  isCorrect: boolean;
  score: number;
  feedback: string;
  rawResult?: string;
}
