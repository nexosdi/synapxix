import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import {
  ReadAloudSubmissionPayload,
  ReadAloudSubmissionResponse,
  RecordingError,
} from './read-aloud.types';


const SUBMISSION_TIMEOUT_MS = 15_000;


const API_BASE = '/api/exercises/read-aloud';


@Injectable({ providedIn: 'root' })
export class ReadAloudService {
  private readonly http = inject(HttpClient);


  async requestMicrophonePermission(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (err: unknown) {
      throw this.mapMediaDevicesError(err);
    }
  }


  submitRecording(
    payload: ReadAloudSubmissionPayload,
  ): Observable<ReadAloudSubmissionResponse> {
    const form = new FormData();
    form.append(
      'audio',
      payload.audioBlob,
      `recording-${payload.contentId}.webm`,
    );
    form.append('contentId', payload.contentId);
    form.append('durationSec', String(payload.durationSec));
    form.append('locale', payload.locale);

    return this.http
      .post<ReadAloudSubmissionResponse>(`${API_BASE}/submit`, form)
      .pipe(
        timeout(SUBMISSION_TIMEOUT_MS),
        catchError((err) => throwError(() => this.mapHttpError(err))),
      );
  }



  private mapMediaDevicesError(err: unknown): RecordingError {
    if (err instanceof DOMException) {
      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        return {
          type: 'permissionDenied',
          message:
            'Microphone access was denied. Please allow microphone access in your browser settings and try again.',
        };
      }

      if (
        err.name === 'NotFoundError' ||
        err.name === 'DevicesNotFoundError'
      ) {
        return {
          type: 'microphoneNotFound',
          message:
            'No microphone was found. Please connect a microphone and try again.',
        };
      }
    }

    return {
      type: 'recorderError',
      message:
        'An unexpected error occurred while accessing your microphone. Please try again.',
    };
  }

  private mapHttpError(err: unknown): RecordingError {
    if (err instanceof TimeoutError) {
      return {
        type: 'timeout',
        message:
          'The server took too long to respond. Please check your connection and try again.',
      };
    }

    if (err instanceof HttpErrorResponse) {
      if (!err.status || err.status === 0) {
        return {
          type: 'networkError',
          message:
            'Unable to reach the server. Please check your internet connection and try again.',
        };
      }

      return {
        type: 'serverError',
        message:
          'The server encountered an error. Please try again in a moment.',
      };
    }

    return {
      type: 'networkError',
      message:
        'Something went wrong while submitting your recording. Please try again.',
    };
  }
}
