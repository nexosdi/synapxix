import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ListenTypeGameComponent } from './listen-type-game.component';
import {
  ListenTypeInteractiveContent,
  toListenTypeGameModel,
  evaluateListenTypeAnswer,
  levenshteinDistance,
} from './listen-type-game.model';
import { AnyGameResult } from '../../models/game-result.model';

const MOCK_CONTENT: ListenTypeInteractiveContent = {
  id: 'listen-test-1',
  gameType: 'listen-type',
  gameInput: {
    audioUrl: 'https://example.com/audio/sample.mp3',
    answer: 'The quick brown fox',
    tolerance: {
      caseInsensitive: true,
      allowedTypos: 1,
      punctuationIgnored: true,
    },
    timeLimitSec: 60,
    hint: 'A famous pangram sentence',
    locale: 'en',
  },
};

const CONTENT_WITHOUT_HINT: ListenTypeInteractiveContent = {
  id: 'listen-test-2',
  gameType: 'listen-type',
  gameInput: {
    audioUrl: 'https://example.com/audio/simple.mp3',
    answer: 'Hello world',
    tolerance: {
      caseInsensitive: false,
      allowedTypos: 0,
      punctuationIgnored: false,
    },
    timeLimitSec: 30,
    locale: 'en',
  },
};

describe('ListenTypeGameComponent', () => {
  let fixture: ComponentFixture<ListenTypeGameComponent>;
  let component: ListenTypeGameComponent;

  function createFixture(
    content: ListenTypeInteractiveContent = MOCK_CONTENT,
    disabled = false
  ): ComponentFixture<ListenTypeGameComponent> {
    const f = TestBed.createComponent(ListenTypeGameComponent);
    f.componentRef.setInput('content', content);
    f.componentRef.setInput('disabled', disabled);
    f.detectChanges();
    return f;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListenTypeGameComponent, FormsModule],
    }).compileComponents();

    fixture = createFixture();
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should display the header title and mission badge', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Listening Mission');
      expect(text).toContain('Listen and Type');
    });

    it('should render the audio play button and audio element with audioUrl', () => {
      const playBtn = fixture.nativeElement.querySelector('button');
      expect(playBtn).toBeTruthy();
      expect(playBtn.textContent).toContain('PLAY AUDIO');

      const audioElement: HTMLAudioElement = fixture.nativeElement.querySelector('audio');
      expect(audioElement).toBeTruthy();
      expect(audioElement.getAttribute('src')).toBe('https://example.com/audio/sample.mp3');
    });

    it('should render the text input with placeholder', () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      expect(input).toBeTruthy();
      expect(input.placeholder).toBe('Type what you hear...');
    });

    it('should render the hint when present', () => {
      expect(fixture.nativeElement.textContent).toContain('Hint:');
      expect(fixture.nativeElement.textContent).toContain('A famous pangram sentence');
    });

    it('should NOT render hint section when hint is omitted', () => {
      const f = createFixture(CONTENT_WITHOUT_HINT);
      expect(f.nativeElement.textContent).not.toContain('Hint:');
    });

    it('should start with initial signals (isCorrect: false, showError: false, empty userInput)', () => {
      expect(component.userInput).toBe('');
      expect(component.isCorrect()).toBe(false);
      expect(component.showError()).toBe(false);
    });
  });

  describe('correct answer', () => {
    it('should set isCorrect to true and render PERFECT overlay', () => {
      component.userInput = 'The quick brown fox';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);
      fixture.detectChanges();

      expect(component.isCorrect()).toBe(true);
      expect(component.showError()).toBe(false);
      expect(fixture.nativeElement.textContent).toContain('PERFECT! 🎧');
    });

    it('should emit answerSubmitted with correct data, score=100 and timeSpentMs', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((res) => emitted.push(res));

      component.userInput = 'The quick brown fox';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toEqual(
        expect.objectContaining({
          gameType: 'listen-type',
          answer: { typedText: 'The quick brown fox' },
          isCorrect: true,
          score: 100,
        })
      );
      expect(emitted[0].timeSpentMs).toBeGreaterThanOrEqual(0);
    });

    it('should ignore subsequent checkAnswer calls once isCorrect is true', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((res) => emitted.push(res));

      component.userInput = 'The quick brown fox';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);
      expect(emitted).toHaveLength(1);

      // Re-triggering should not emit again
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);
      expect(emitted).toHaveLength(1);
    });
  });

  describe('incorrect answer', () => {
    it('should set showError to true and not emit answerSubmitted on wrong answer', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((res) => emitted.push(res));

      component.userInput = 'Completely wrong sentence';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);
      fixture.detectChanges();

      expect(component.isCorrect()).toBe(false);
      expect(component.showError()).toBe(true);
      expect(fixture.nativeElement.textContent).toContain('Try again! ❌');
      expect(emitted).toHaveLength(0);
    });

    it('should auto-hide error message after 2000ms', fakeAsync(() => {
      component.userInput = 'Wrong input';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);

      expect(component.showError()).toBe(true);

      tick(2000);

      expect(component.showError()).toBe(false);
    }));
  });

  describe('tolerance handling', () => {
    it('should match case-insensitively when caseInsensitive is true', () => {
      component.userInput = 'THE QUICK BROWN FOX';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);

      expect(component.isCorrect()).toBe(true);
    });

    it('should require exact case when caseInsensitive is false', () => {
      const strictFixture = createFixture(CONTENT_WITHOUT_HINT);
      const strictComp = strictFixture.componentInstance;

      strictComp.userInput = 'hello world'; // Target is 'Hello world'
      strictComp.checkAnswer(CONTENT_WITHOUT_HINT.gameInput.answer);

      expect(strictComp.isCorrect()).toBe(false);
      expect(strictComp.showError()).toBe(true);

      strictComp.userInput = 'Hello world';
      strictComp.checkAnswer(CONTENT_WITHOUT_HINT.gameInput.answer);
      expect(strictComp.isCorrect()).toBe(true);
    });

    it('should ignore punctuation when punctuationIgnored is true', () => {
      component.userInput = 'The, quick brown fox!';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);

      expect(component.isCorrect()).toBe(true);
    });

    it('should require punctuation when punctuationIgnored is false', () => {
      const punctContent: ListenTypeInteractiveContent = {
        ...CONTENT_WITHOUT_HINT,
        gameInput: {
          ...CONTENT_WITHOUT_HINT.gameInput,
          answer: 'Hello, world!',
          tolerance: {
            caseInsensitive: true,
            allowedTypos: 0,
            punctuationIgnored: false,
          },
        },
      };
      const punctFixture = createFixture(punctContent);
      const punctComp = punctFixture.componentInstance;

      punctComp.userInput = 'Hello world';
      punctComp.checkAnswer(punctContent.gameInput.answer);
      expect(punctComp.isCorrect()).toBe(false);

      punctComp.userInput = 'Hello, world!';
      punctComp.checkAnswer(punctContent.gameInput.answer);
      expect(punctComp.isCorrect()).toBe(true);
    });

    it('should accept small typos when allowedTypos > 0', () => {
      // 1 typo in 'brown' -> 'brwn' (deletion)
      component.userInput = 'The quick brwn fox';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);

      expect(component.isCorrect()).toBe(true);
    });

    it('should reject when typos exceed allowedTypos', () => {
      // 3 typos
      component.userInput = 'The qk brn fx';
      component.checkAnswer(MOCK_CONTENT.gameInput.answer);

      expect(component.isCorrect()).toBe(false);
    });
  });

  describe('audio playback', () => {
    it('should trigger play on audio element when playAudio is invoked', () => {
      const playSpy = jest.fn().mockResolvedValue(undefined);
      if (component.audioPlayerRef) {
        component.audioPlayerRef.nativeElement.play = playSpy;
      }

      component.playAudio();

      if (component.audioPlayerRef) {
        expect(playSpy).toHaveBeenCalled();
      }
    });
  });

  describe('disabled state', () => {
    it('should have disabled attributes on buttons and input when disabled input is true', () => {
      const disFixture = createFixture(MOCK_CONTENT, true);
      const input: HTMLInputElement = disFixture.nativeElement.querySelector('input');
      const buttons = disFixture.nativeElement.querySelectorAll('button');

      expect(input.disabled || input.hasAttribute('disabled')).toBe(true);
      buttons.forEach((btn: HTMLButtonElement) => {
        expect(btn.disabled || btn.hasAttribute('disabled')).toBe(true);
      });
    });

    it('should not process checkAnswer or emit events when disabled', () => {
      const disFixture = createFixture(MOCK_CONTENT, true);
      const disComp = disFixture.componentInstance;

      const emitted: AnyGameResult[] = [];
      disComp.answerSubmitted.subscribe((res) => emitted.push(res));

      disComp.userInput = 'The quick brown fox';
      disComp.checkAnswer(MOCK_CONTENT.gameInput.answer);

      expect(emitted).toHaveLength(0);
      expect(disComp.isCorrect()).toBe(false);
      expect(disComp.showError()).toBe(false);
    });

    it('should not trigger playAudio when disabled', () => {
      const disFixture = createFixture(MOCK_CONTENT, true);
      const disComp = disFixture.componentInstance;
      const playSpy = jest.fn();
      if (disComp.audioPlayerRef) {
        disComp.audioPlayerRef.nativeElement.play = playSpy;
      }

      disComp.playAudio();

      expect(playSpy).not.toHaveBeenCalled();
    });
  });

  describe('model helper functions', () => {
    it('toListenTypeGameModel should extract gameInput or provide safe fallback', () => {
      expect(toListenTypeGameModel(MOCK_CONTENT)).toBe(MOCK_CONTENT.gameInput);

      const fallback = toListenTypeGameModel(null as unknown as ListenTypeInteractiveContent);
      expect(fallback).toEqual(
        expect.objectContaining({
          audioUrl: '',
          answer: '',
          timeLimitSec: 60,
          locale: 'es',
        })
      );
      expect(fallback.tolerance.caseInsensitive).toBe(true);
    });

    it('levenshteinDistance should calculate exact edit distances', () => {
      expect(levenshteinDistance('', '')).toBe(0);
      expect(levenshteinDistance('a', '')).toBe(1);
      expect(levenshteinDistance('', 'abc')).toBe(3);
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
      expect(levenshteinDistance('apple', 'apple')).toBe(0);
      expect(levenshteinDistance('cat', 'bat')).toBe(1);
    });

    it('evaluateListenTypeAnswer should handle whitespace and edge cases', () => {
      expect(evaluateListenTypeAnswer('  hello   world  ', 'hello world')).toBe(true);
      expect(evaluateListenTypeAnswer('¡Hola, mundo!', 'hola mundo')).toBe(true);
      expect(evaluateListenTypeAnswer('test', 'text', { allowedTypos: 1 })).toBe(true);
      expect(evaluateListenTypeAnswer('test', 'toast', { allowedTypos: 2 })).toBe(true);
      expect(evaluateListenTypeAnswer('test', 'toast', { allowedTypos: 1 })).toBe(false);
      expect(evaluateListenTypeAnswer('test', 'toast', { allowedTypos: 0 })).toBe(false);
    });
  });
});
