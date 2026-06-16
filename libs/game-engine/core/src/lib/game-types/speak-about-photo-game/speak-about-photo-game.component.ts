import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  NgZone,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AnyGameResult } from '../../models/game-result.model';
import { BaseGameComponent } from '../../components/base-game.component';
import {
  SpeakAboutPhotoGameData,
  SpeakAboutPhotoInteractiveContent,
  toSpeakAboutPhotoGameModel,
} from './speak-about-photo-game.model';
import { SpeakAboutPhotoService } from './speak-about-photo.service';
import {
  RecordingError,
  RecordingErrorType,
  RecordingState,
  SpeakAboutPhotoSubmissionResponse,
} from './speak-about-photo.types';


const PREFERRED_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
  'audio/mp4',
] as const;


function getSupportedMimeType(): string {
  return PREFERRED_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
}


@Component({
  selector: 'lib-speak-about-photo-game',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './speak-about-photo-game.component.html',
  styleUrl: './speak-about-photo-game.component.scss',
})
export class SpeakAboutPhotoGameComponent implements OnDestroy, BaseGameComponent {
  readonly answerSubmitted = output<AnyGameResult>();
  readonly content = input.required<SpeakAboutPhotoInteractiveContent>();
  readonly disabled = input<boolean>(false);
  readonly viewModel = computed(() => toSpeakAboutPhotoGameModel(this.content()));

  private readonly speakAboutPhotoService = inject(SpeakAboutPhotoService);
  private readonly ngZone = inject(NgZone);

  readonly state = signal<RecordingState>('idle');
  readonly timer = signal<number>(0);
  readonly audioUrl = signal<string | null>(null);
  readonly recordingError = signal<RecordingError | null>(null);

  readonly canSubmit = computed(
    () => this.timer() >= (this.viewModel()?.recording.minDurationSec ?? 0),
  );

  readonly errorTitle = computed(() => {
    const type = this.recordingError()?.type;
    if (!type) return 'Something went wrong';

    const titles: Record<RecordingErrorType, string> = {
      permissionDenied:   'Microphone Access Denied',
      microphoneNotFound: 'No Microphone Found',
      recorderError:      'Recording Error',
      networkError:       'Connection Problem',
      serverError:        'Server Error',
      timeout:            'Request Timed Out',
    };
    return titles[type];
  });

  private mediaStream:     MediaStream   | null = null;
  private mediaRecorder:   MediaRecorder | null = null;
  private audioChunks:     Blob[]               = [];
  private recordedBlob:    Blob          | null = null;
  private timerIntervalId: ReturnType<typeof setInterval> | null = null;
  private submissionSub:   Subscription  | null = null;
  private lastApiResponse: SpeakAboutPhotoSubmissionResponse | null = null;

  async startRecording(view: SpeakAboutPhotoGameData): Promise<void> {
    if (this.disabled()) return;

    this.clearAudioUrl();
    this.recordingError.set(null);
    this.state.set('requestingPermission');

    let stream: MediaStream;

    try {
      stream = await this.speakAboutPhotoService.requestMicrophonePermission();
    } catch (err: unknown) {
      this.state.set('error');
      this.recordingError.set(err as RecordingError);
      return;
    }

    this.mediaStream  = stream;
    this.audioChunks  = [];
    this.recordedBlob = null;

    try {
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: getSupportedMimeType(),
      });
    } catch {
      this.handleRecorderInitError();
      return;
    }

    this.bindMediaRecorderEvents();
    this.mediaRecorder.start(100);
    this.state.set('recording');
    this.startTimer(view.recording.maxDurationSec);
  }

  stopRecording(): void {
    this.stopTimer();
    if (this.mediaRecorder?.state !== 'inactive') {
      this.mediaRecorder?.stop();
    }
  }

  cancelRecording(): void {
    this.stopTimer();

    if (this.mediaRecorder?.state !== 'inactive') {
      this.mediaRecorder!.ondataavailable = null;
      this.mediaRecorder!.onstop          = null;
      this.mediaRecorder!.stop();
    }

    this.stopMediaStream();
    this.audioChunks  = [];
    this.recordedBlob = null;
    this.timer.set(0);
    this.state.set('idle');
  }

  submitRecording(view: SpeakAboutPhotoGameData): void {
    if (!this.recordedBlob || !this.canSubmit() || this.disabled()) return;

    this.state.set('submitting');

    this.submissionSub = this.speakAboutPhotoService
      .submitResponse({
        contentId:   this.content().id,
        audioBlob:   this.recordedBlob,
        durationSec: this.timer(),
        locale:      view.locale,
        prompt:      view.prompt,
      })
      .subscribe({
        next: (response: SpeakAboutPhotoSubmissionResponse) => {
          this.lastApiResponse = response;
          this.state.set('success');
          this.emitResult();
        },
        error: (err: RecordingError) => {
          this.state.set('error');
          this.recordingError.set(err);
        },
      });
  }

  resetToIdle(): void {
    this.submissionSub?.unsubscribe();
    this.clearAudioUrl();
    this.recordingError.set(null);
    this.audioChunks  = [];
    this.recordedBlob = null;
    this.timer.set(0);
    this.state.set('idle');
  }

  formatTime(sec: number): string {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.stopMediaStream();
    this.clearAudioUrl();
    this.submissionSub?.unsubscribe();
    this.destroyMediaRecorder();
  }

  private bindMediaRecorderEvents(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.ngZone.run(() => {
        const mimeType    = this.mediaRecorder?.mimeType ?? 'audio/webm';
        this.recordedBlob = new Blob(this.audioChunks, { type: mimeType });
        const objectUrl   = URL.createObjectURL(this.recordedBlob);
        this.audioUrl.set(objectUrl);
        this.state.set('recorded');
        this.stopMediaStream();
      });
    };

    this.mediaRecorder.onerror = () => {
      this.ngZone.run(() => {
        this.stopTimer();
        this.stopMediaStream();
        this.state.set('error');
        this.recordingError.set({
          type:    'recorderError',
          message: 'A recording error occurred. Please try again.',
        });
      });
    };
  }

  private handleRecorderInitError(): void {
    this.state.set('error');
    this.recordingError.set({
      type:    'recorderError',
      message: 'Could not initialize the recorder. Please try a different browser.',
    });
    this.stopMediaStream();
  }

  private startTimer(maxDurationSec: number): void {
    this.timer.set(0);

    this.timerIntervalId = setInterval(() => {
      this.timer.update((t) => t + 1);

      if (this.timer() >= maxDurationSec) {
        this.stopRecording();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  private stopMediaStream(): void {
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = null;
  }

  private clearAudioUrl(): void {
    const url = this.audioUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this.audioUrl.set(null);
    }
  }

  private destroyMediaRecorder(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = null;
    this.mediaRecorder.onstop          = null;
    this.mediaRecorder.onerror         = null;

    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.mediaRecorder = null;
  }

  private emitResult(): void {
    const res = this.lastApiResponse;
    this.answerSubmitted.emit({
      gameType:    'speak-about-photo',
      answer: {
        audioUrl:       this.audioUrl() ?? '',
        recognizedText: '',
      },
      isCorrect:   res?.isCorrect ?? true,
      score:       res?.score     ?? 100,
      timeSpentMs: this.timer() * 1000,
      feedback:    res?.feedback,
    });
  }
}