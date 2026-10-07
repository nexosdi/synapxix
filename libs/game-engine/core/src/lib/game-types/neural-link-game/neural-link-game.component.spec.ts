import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { NeuralLinkGameComponent } from './neural-link-game.component';
import { MemoryInteractiveContent } from './neural-link-game.model';

describe('NeuralLinkGameComponent', () => {
  let component: NeuralLinkGameComponent;
  let fixture: ComponentFixture<NeuralLinkGameComponent>;
  let componentRef: ComponentRef<NeuralLinkGameComponent>;

  const mockContent: MemoryInteractiveContent = {
    id: 'test-1',
    gameType: 'neural-link',
    gameInput: {
      prompt: 'Find the pairs',
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

  it('should initialize correctly and set up cards', () => {
    expect(component).toBeTruthy();
    expect(component.cards().length).toBe(4);
    // Usamos toBe(true) por convención de Jest
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
    expect(component.flippedCards().length).toBe(0);
  });

  it('should successfully match cards and emit event when all matched', fakeAsync(() => {
    // Usamos jest.spyOn para compatibilidad con el runner actual
    jest.spyOn(component.answerSubmitted, 'emit');
    
    const group1 = component.cards().filter(c => c.matchId === 'group1');
    const group2 = component.cards().filter(c => c.matchId === 'group2');

    // Volteamos el par 1
    component.flipCard(group1[0]);
    component.flipCard(group1[1]);
    tick(500); // Esperamos el timeout de éxito

    expect(component.cards().filter(c => c.isMatched).length).toBe(2);

    // Volteamos el par 2
    component.flipCard(group2[0]);
    component.flipCard(group2[1]);
    tick(500); // Esperamos el timeout de éxito

    expect(component.cards().filter(c => c.isMatched).length).toBe(4);
    expect(component.feedbackState()).toBe('success');
    
    // Verificamos el payload con la estructura estricta del motor
    expect(component.answerSubmitted.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        isCorrect: true,
        gameType: 'neural-link'
      })
    );
  }));

  it('should revert cards to unflipped state if they do not match', fakeAsync(() => {
    const group1 = component.cards().filter(c => c.matchId === 'group1');
    const group2 = component.cards().filter(c => c.matchId === 'group2');

    // Volteamos una carta de cada grupo para forzar el fallo
    component.flipCard(group1[0]);
    component.flipCard(group2[0]);
    
    expect(component.flippedCards().length).toBe(2);

    tick(1000); // Esperamos el timeout de fallo

    expect(component.flippedCards().length).toBe(0);
    expect(component.cards().some(c => c.isMatched)).toBe(false);
  }));
});