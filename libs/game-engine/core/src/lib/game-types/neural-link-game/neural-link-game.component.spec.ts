import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NeuralLinkGameComponent } from './neural-link-game.component';
import { ComponentRef } from '@angular/core';
import { MemoryInteractiveContent } from './neural-link-game.model';

describe('NeuralLinkGameComponent', () => {
  let component: NeuralLinkGameComponent;
  let fixture: ComponentFixture<NeuralLinkGameComponent>;
  let componentRef: ComponentRef<NeuralLinkGameComponent>;

  const mockContent: MemoryInteractiveContent = {
    id: 'test-1',
    gameType: 'neural-link',
    gameInput: {
      prompt: 'Test prompt',
      locale: 'en',
      cards: [
        { id: '1', matchId: 'group1', text: 'A' },
        { id: '2', matchId: 'group1', text: 'A-match' },
        { id: '3', matchId: 'group2', text: 'B' },
        { id: '4', matchId: 'group2', text: 'B-match' }
      ]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeuralLinkGameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeuralLinkGameComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    componentRef.setInput('content', mockContent);
    componentRef.setInput('disabled', false);
    fixture.detectChanges();
  });

  it('should create and initialize cards', () => {
    expect(component).toBeTruthy();
    expect(component.cards().length).toBe(4);
    expect(component.cards().every(c => !c.isFlipped && !c.isMatched)).toBe(true);
  });

  it('should flip a card when clicked', () => {
    const card = component.cards()[0];
    component.flipCard(card);
    
    expect(component.cards().find(c => c.id === card.id)?.isFlipped).toBe(true);
    expect(component.flippedCards().length).toBe(1);
  });

  it('should ignore clicks if disabled', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const card = component.cards()[0];
    component.flipCard(card);
    
    expect(component.cards().find(c => c.id === card.id)?.isFlipped).toBe(false);
  });

  it('should handle successful match', fakeAsync(() => {
    const pair1 = component.cards().filter(c => c.matchId === 'group1');
    expect(pair1.length).toBe(2);

    jest.spyOn(component.answerSubmitted, 'emit');

    component.flipCard(pair1[0]);
    component.flipCard(pair1[1]);

    expect(component.flippedCards().length).toBe(2);
    
    // Simulate setTimeout
    tick(500);

    const updatedPair = component.cards().filter(c => c.matchId === 'group1');
    expect(updatedPair[0].isMatched).toBe(true);
    expect(updatedPair[1].isMatched).toBe(true);
    expect(component.flippedCards().length).toBe(0);
  }));

  it('should handle failed match', fakeAsync(() => {
    // find two cards that do not match
    const c1 = component.cards().find(c => c.matchId === 'group1');
    const c2 = component.cards().find(c => c.matchId === 'group2');
    
    if (!c1 || !c2) throw new Error('Setup failed');

    component.flipCard(c1);
    component.flipCard(c2);

    expect(component.flippedCards().length).toBe(2);

    // Simulate setTimeout
    tick(1000);

    const updatedC1 = component.cards().find(c => c.id === c1.id);
    const updatedC2 = component.cards().find(c => c.id === c2.id);
    
    expect(updatedC1?.isMatched).toBe(false);
    expect(updatedC2?.isMatched).toBe(false);
    expect(updatedC1?.isFlipped).toBe(false);
    expect(updatedC2?.isFlipped).toBe(false);
    expect(component.flippedCards().length).toBe(0);
  }));

  it('should emit answerSubmitted when all cards are matched', fakeAsync(() => {
    jest.spyOn(component.answerSubmitted, 'emit');

    // Match pair 1
    const pair1 = component.cards().filter(c => c.matchId === 'group1');
    component.flipCard(pair1[0]);
    component.flipCard(pair1[1]);
    tick(500);

    // Match pair 2
    const pair2 = component.cards().filter(c => c.matchId === 'group2');
    component.flipCard(pair2[0]);
    component.flipCard(pair2[1]);
    tick(500);

    expect(component.feedbackState()).toBe('success');
    expect(component.answerSubmitted.emit).toHaveBeenCalledWith({
      gameType: 'neural-link',
      answer: { connections: [] },
      isCorrect: true,
      score: 100,
      timeSpentMs: 0
    });
  }));
});
