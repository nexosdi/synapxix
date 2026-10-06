import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SoundMatchGameComponent } from './sound-match.component';
import { ComponentRef } from '@angular/core';
import { SoundMatchInteractiveContent } from './sound-match.model';

describe('SoundMatchGameComponent', () => {
  let component: SoundMatchGameComponent;
  let fixture: ComponentFixture<SoundMatchGameComponent>;
  let componentRef: ComponentRef<SoundMatchGameComponent>;
  let audioMock: Partial<HTMLAudioElement>;

  const validContent: SoundMatchInteractiveContent = {
    id: 'test-sound-match',
    gameType: 'sound-match',
    gameInput: {
      prompt: 'Escucha el sonido',
      audioUrl: 'test-audio.mp3',
      locale: 'es-AR',
      options: [
        { id: '1', text: 'Perro', isCorrect: true, imageUrl: 'dog.jpg' },
        { id: '2', text: 'Gato', isCorrect: false }
      ]
    }
  };

  beforeEach(async () => {
    // Mock HTMLAudioElement
    audioMock = {
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      load: jest.fn(),
      src: '',
      onplay: null,
      onended: null,
      onerror: null
    };
    jest.spyOn(globalThis, 'Audio').mockImplementation(() => audioMock as unknown as HTMLAudioElement);

    await TestBed.configureTestingModule({
      imports: [SoundMatchGameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SoundMatchGameComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('content', validContent);
    componentRef.setInput('disabled', false);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should create and show prompt', () => {
      expect(component).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('Escucha el sonido');
    });

    it('should show all options', () => {
      const options = component.viewModel()?.options ?? [];
      expect(options.length).toBe(2);
      expect(fixture.nativeElement.textContent).toContain('Perro');
      expect(fixture.nativeElement.textContent).toContain('Gato');
    });

    it('should compute null viewModel if gameInput is missing safely', () => {
      componentRef.setInput('content', { id: 'test', gameType: 'sound-match' });
      fixture.detectChanges();
      expect(component.viewModel()).toBeNull();
    });
  });

  describe('checkAnswer', () => {
    it('should stop audio, set success, and emit answerSubmitted on correct option', () => {
      jest.spyOn(component.answerSubmitted, 'emit');
      const correctOption = component.viewModel()?.options[0] ?? { id: '', text: '', isCorrect: true };
      
      component.playSound('test.mp3');
      component.checkAnswer(correctOption);
      
      expect(audioMock.pause).toHaveBeenCalled();
      expect(component.feedbackState()).toBe('success');
      expect(component.answerSubmitted.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          gameType: 'sound-match',
          isCorrect: true,
          score: 100,
          answer: { matchedPairs: [{ soundId: 'audio', optionId: '1' }] }
        })
      );
    });

    it('should set error state and reset to idle after 1500ms on wrong option', fakeAsync(() => {
      const wrongOption = component.viewModel()?.options[1] ?? { id: '', text: '', isCorrect: false };
      
      component.checkAnswer(wrongOption);
      
      expect(component.feedbackState()).toBe('error');
      
      tick(1500);
      
      expect(component.feedbackState()).toBe('idle');
    }));

    it('should block answer submission when disabled', () => {
      componentRef.setInput('disabled', true);
      fixture.detectChanges();
      jest.spyOn(component.answerSubmitted, 'emit');
      
      const correctOption = component.viewModel()?.options[0] ?? { id: '', text: '', isCorrect: true };
      component.checkAnswer(correctOption);
      
      expect(component.feedbackState()).toBe('idle');
      expect(component.answerSubmitted.emit).not.toHaveBeenCalled();
    });

    it('should block answer submission when feedbackState is not idle', () => {
      jest.spyOn(component.answerSubmitted, 'emit');
      // Set to error state first
      const wrongOption = component.viewModel()?.options[1] ?? { id: '', text: '', isCorrect: false };
      const correctOption = component.viewModel()?.options[0] ?? { id: '', text: '', isCorrect: true };
      component.checkAnswer(wrongOption);
      expect(component.feedbackState()).toBe('error');
      
      // Try correct option while in error state
      component.checkAnswer(correctOption);
      
      expect(component.answerSubmitted.emit).not.toHaveBeenCalled();
    });
  });

  describe('playSound', () => {
    it('should not play audio if url is empty', () => {
      component.playSound('');
      expect(audioMock.play).not.toHaveBeenCalled();
    });

    it('should not play audio if already playing', () => {
      component.playSound('test.mp3');
      audioMock.onplay(); // Simulate audio start
      expect(component.isPlaying()).toBe(true);
      
      component.playSound('test.mp3');
      expect(audioMock.play).toHaveBeenCalledTimes(1); // Only called once
    });
  });

  describe('lifecycle', () => {
    it('should call stopAudio on destroy', () => {
      component.playSound('test.mp3');
      audioMock.onplay();
      expect(component.isPlaying()).toBe(true);
      
      component.ngOnDestroy();
      
      expect(audioMock.pause).toHaveBeenCalled();
      expect(component.isPlaying()).toBe(false);
    });
  });
});
