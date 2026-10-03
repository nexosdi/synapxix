import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MemoryMatchGameComponent } from './memory-match.component';
import { MemoryMatchInteractiveContent } from './memory-match.model';
import { AnyGameResult } from '../../models/game-result.model';

const CONTENT: MemoryMatchInteractiveContent = {
  id: 'memory-match-test',
  gameType: 'memory-match',
  gameInput: {
    prompt: 'Find the pairs',
    locale: 'en',
    columns: 2,
    cards: [
      { id: '1a', pairId: 'p1', label: 'A' },
      { id: '1b', pairId: 'p1', label: 'A' },
      { id: '2a', pairId: 'p2', label: 'B' },
      { id: '2b', pairId: 'p2', label: 'B' },
    ],
  },
};

describe('MemoryMatchGameComponent', () => {
  let fixture: ComponentFixture<MemoryMatchGameComponent>;
  let component: MemoryMatchGameComponent;

  function createFixture(
    content: MemoryMatchInteractiveContent,
  ): ComponentFixture<MemoryMatchGameComponent> {
    const f = TestBed.createComponent(MemoryMatchGameComponent);
    f.componentRef.setInput('content', content);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    return f;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryMatchGameComponent],
    }).compileComponents();

    fixture = createFixture(CONTENT);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should create and show the prompt from content', () => {
      expect(component).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('Find the pairs');
    });

    it('should initialize with no cards flipped', () => {
      const cards = component.cards();
      expect(cards.length).toBe(4);
      expect(cards.every(c => !c.isFlipped && !c.isMatched)).toBe(true);
    });

    it('should calculate totalPairs correctly', () => {
      expect(component.totalPairs()).toBe(2);
    });
  });

  describe('gameplay', () => {
    it('should flip a card when clicked', () => {
      const card = component.cards()[0];
      component.flipCard(card);
      expect(component.cards()[0].isFlipped).toBe(true);
      expect(component.flippedCards().length).toBe(1);
    });

    it('should match two identical cards and clear flipped state', fakeAsync(() => {
      const cards = component.cards();
      
      component.flipCard(cards[0]); // p1
      component.flipCard(cards[1]); // p1
      
      expect(component.isProcessing()).toBe(true);
      expect(component.attempts()).toBe(1);
      
      tick(500); // Wait for the match animation timeout
      
      expect(component.matchedPairs().length).toBe(1);
      expect(component.matchedPairs()[0]).toBe('p1');
      expect(component.flippedCards().length).toBe(0);
      expect(component.cards()[0].isMatched).toBe(true);
      expect(component.cards()[1].isMatched).toBe(true);
    }));

    it('should unflip cards if they do not match', fakeAsync(() => {
      const cards = component.cards();
      
      component.flipCard(cards[0]); // p1
      component.flipCard(cards[2]); // p2
      
      expect(component.isProcessing()).toBe(true);
      expect(component.attempts()).toBe(1);
      
      tick(1000); // Wait for mismatch animation timeout
      
      expect(component.matchedPairs().length).toBe(0);
      expect(component.flippedCards().length).toBe(0);
      expect(component.cards()[0].isFlipped).toBe(false);
      expect(component.cards()[2].isFlipped).toBe(false);
      expect(component.cards()[0].isMatched).toBe(false);
    }));

    it('should complete the game and emit result when all pairs are matched', fakeAsync(() => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      const cards = component.cards();
      
      component.flipCard(cards[0]); // p1
      component.flipCard(cards[1]); // p1
      tick(500);
      
      component.flipCard(cards[2]); // p2
      component.flipCard(cards[3]); // p2
      tick(500);
      
      expect(component.feedbackState()).toBe('success');
      
      tick(1500); // Wait for completion timeout
      
      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(true);
      expect(emitted[0].score).toBe(100); // 2 pairs in 2 attempts = 100 score
      expect(emitted[0].gameType).toBe('memory-match');
    }));
  });

  describe('disabled state', () => {
    it('should not flip cards when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      
      const card = component.cards()[0];
      component.flipCard(card);
      
      expect(component.cards()[0].isFlipped).toBe(false);
      expect(component.flippedCards().length).toBe(0);
    });
  });
});
