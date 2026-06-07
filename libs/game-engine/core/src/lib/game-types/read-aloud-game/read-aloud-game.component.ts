import {
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
  ReadAloudGameData,
  ReadAloudInteractiveContent,
  toReadAloudGameModel,
} from './read-aloud-game.model';
import { ReadAloudService } from './read-aloud.service';
import {
  RecordingError,
  RecordingErrorType,
  RecordingState,
} from './read-aloud.types';


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
  selector: 'lib-read-aloud-game',
  standalone: true,
  templateUrl: './read-aloud-game.component.html',
  styleUrl: './read-aloud-game.component.scss',
})
export class ReadAloudGameComponent implements OnDestroy, BaseGameComponent {
  readonly answerSubmitted = output<AnyGameResult>();


  readonly content = input.required<ReadAloudInteractiveContent>();


  readonly disabled = input<boolean>(false);


  readonly viewModel = computed(() => toReadAloudGameModel(this.content()));

  private readonly readAloudService = inject(ReadAloudService);


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
      permissionDenied:    'Microphone Access Denied',
      microphoneNotFound:  'No Microphone Found',
      recorderError:       'Recording Error',
      networkError:        'Connection Problem',
      serverError:         'Server Error',
      timeout:             'Request Timed Out',
    };
    return titles[type];
  });


  readonly errorIcon = computed(() => {
    const type = this.recordingError()?.type;
    if (!type) return '❌';

    const icons: Record<RecordingErrorType, string> = {
      permissionDenied:    '🔒',
      microphoneNotFound:  '🎙️',
      recorderError:       '⚠️',
      networkError:        '📡',
      serverError:         '🖥️',
      timeout:             '⏱',
    };
    return icons[type];
  });

  private mediaStream:    MediaStream    | null = null;
  private mediaRecorder:  MediaRecorder  | null = null;
  private audioChunks:    Blob[]                = [];
  private recordedBlob:   Blob           | null = null;
  private timerIntervalId: ReturnType<typeof setInterval> | null = null;
  private submissionSub:  Subscription   | null = null;

  async startRecording(view: ReadAloudGameData): Promise<void> {
    if (this.disabled()) return;

    this.clearAudioUrl();
    this.recordingError.set(null);
    this.state.set('requestingPermission');

    let stream: MediaStream;

    try {
      stream = await this.readAloudService.requestMicrophonePermission();
    } catch (err: unknown) {
      this.state.set('error');
      this.recordingError.set(err as RecordingError);
      return;
    }

    this.mediaStream = stream;
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
    this.mediaRecorder.start(/* timeslice */ 100); // collect chunks every 100 ms
    this.state.set('recording');
    this.startTimer(view.recording.maxDurationSec);
  }


  stopRecording(): void {
    this.stopTimer();
    if (this.mediaRecorder?.state !== 'inactive') {
      this.mediaRecorder?.stop(); // triggers onstop → 'recorded' state
    }
  }


  cancelRecording(): void {
    this.stopTimer();

    if (this.mediaRecorder?.state !== 'inactive') {
      // Nullify handlers before stopping to discard the chunks cleanly
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


  submitRecording(view: ReadAloudGameData): void {
    if (!this.recordedBlob || !this.canSubmit() || this.disabled()) return;

    this.state.set('submitting');

    this.submissionSub = this.readAloudService
      .submitRecording({
        contentId:  this.content().id,
        audioBlob:  this.recordedBlob,
        durationSec: this.timer(),
        locale:     view.locale,
        expectedText: view.text,
      })
      .subscribe({
        next: () => {
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
        const mimeType   = this.mediaRecorder?.mimeType ?? 'audio/webm';
        this.recordedBlob = new Blob(this.audioChunks, { type: mimeType });
        const objectUrl  = URL.createObjectURL(this.recordedBlob);
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
    this.answerSubmitted.emit({
      gameType:     'read-aloud',
      answer: {
        audioUrl:       this.audioUrl() ?? '',
        recognizedText: '',
      },
      isCorrect:    true,
      score:        100,
      timeSpentMs:  this.timer() * 1000,
    });
  }
}