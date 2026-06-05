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

export interface SpeakAboutPhotoSubmissionPayload {
  contentId: string;
  audioBlob: Blob;
  durationSec: number;
  locale: string;
}

export interface SpeakAboutPhotoSubmissionResponse {
  sessionId: string;
  score: number;
  recognizedText: string;
}
