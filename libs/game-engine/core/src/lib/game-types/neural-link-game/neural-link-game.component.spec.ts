import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NeuralLinkGameComponent } from './neural-link-game.component';
import { MemoryInteractiveContent, MemoryCard } from './neural-link-game.model';

describe('NeuralLinkGameComponent', () => {
  let component: NeuralLinkGameComponent;
  let fixture: ComponentFixture<NeuralLinkGameComponent>;

  const mockContent: MemoryInteractiveContent = {
    contentType: 'neural-link',
    gameInput: {
      prompt: 'Find the pairs',
      locale: 'en',
      cards: [
        { id: '1', matchId: 'A' },
        { id: '2', matchId: 'A' },
        { id: '3', matchId: 'B' },
        { id: '4', matchId: 'B' }
      ]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeuralLinkGameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeuralLinkGameComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', mockContent);
    fixture.detectChanges();
  });

  it('should initialize correctly and set up cards', () => {
    expect(component).toBeTruthy();
    expect(component.cards().length).toBe(4);
    // Verify all cards start unflipped and unmatched
    expect(component.cards().every(c => !c.isFlipped && !c.isMatched)).toBeTrue();
  });

  it('should flip a card when clicked', () => {
    const card = component.cards()[0];
    component.flipCard(card);
    
    expect(component.flippedCards().length).toBe(1);
    expect(component.flippedCards()[0].id).toBe(card.id);
  });

  it('should not flip a card if the game is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const card = component.cards()[0];
    component.flipCard(card);
    
    expect(component.flippedCards().length).toBe(0);
  });

  it('should successfully match cards and emit event when all matched', fakeAsync(() => {
    spyOn(component.answerSubmitted, 'emit');
    
    // Group cards by matchId
    const groupA = component.cards().filter(c => c.matchId === 'A');
    const groupB = component.cards().filter(c => c.matchId === 'B');

    // Flip pair A
    component.flipCard(groupA[0]);
    component.flipCard(groupA[1]);
    tick(500); // Wait for success timeout

    expect(component.cards().filter(c => c.isMatched).length).toBe(2);

    // Flip pair B
    component.flipCard(groupB[0]);
    component.flipCard(groupB[1]);
    tick(500); // Wait for success timeout

    expect(component.cards().filter(c => c.isMatched).length).toBe(4);
    expect(component.feedbackState()).toBe('success');
    expect(component.answerSubmitted.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      isCorrect: true,
      gameType: 'neural-link'
    }));
  }));

  it('should revert cards to unflipped state if they do not match', fakeAsync(() => {
    const groupA = component.cards().filter(c => c.matchId === 'A');
    const groupB = component.cards().filter(c => c.matchId === 'B');

    // Flip one card from A and one from B
    component.flipCard(groupA[0]);
    component.flipCard(groupB[0]);
    
    // Immediately after flipping, both should be tracked as flipped
    expect(component.flippedCards().length).toBe(2);

    tick(1000); // Wait for failure timeout

    expect(component.flippedCards().length).toBe(0);
    expect(component.cards().some(c => c.isMatched)).toBeFalse();
  }));
});
