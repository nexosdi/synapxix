import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NeuralLinkGameComponent } from './neural-link-game.component';
import { MemoryInteractiveContent, MemoryCard } from './neural-link-game.model';

describe('NeuralLinkGameComponent', () => {
  let component: NeuralLinkGameComponent;
  let fixture: ComponentFixture<NeuralLinkGameComponent>;

  const mockContent: MemoryInteractiveContent = {
    contentType: 'neural-link',
    gameInput: {
      prompt: 'Encuentra las parejas',
      locale: 'es',
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

  it('debería crearse correctamente e inicializar las cartas', () => {
    expect(component).toBeTruthy();
    expect(component.cards().length).toBe(4);
    // Verificar que todas inician sin voltear y sin emparejar
    expect(component.cards().every(c => !c.isFlipped && !c.isMatched)).toBeTrue();
  });

  it('debería voltear una carta si es clickeada', () => {
    const card = component.cards()[0];
    component.flipCard(card);
    
    expect(component.flippedCards().length).toBe(1);
    expect(component.flippedCards()[0].id).toBe(card.id);
  });

  it('no debería voltear una carta si el juego está deshabilitado', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const card = component.cards()[0];
    component.flipCard(card);
    
    expect(component.flippedCards().length).toBe(0);
  });

  it('debería emparejar cartas exitosamente y emitir evento si todas coinciden', fakeAsync(() => {
    spyOn(component.answerSubmitted, 'emit');
    
    // Agrupar cartas por pareja
    const groupA = component.cards().filter(c => c.matchId === 'A');
    const groupB = component.cards().filter(c => c.matchId === 'B');

    // Voltear pareja A
    component.flipCard(groupA[0]);
    component.flipCard(groupA[1]);
    tick(500); // Esperar timeout de éxito

    expect(component.cards().filter(c => c.isMatched).length).toBe(2);

    // Voltear pareja B
    component.flipCard(groupB[0]);
    component.flipCard(groupB[1]);
    tick(500); // Esperar timeout de éxito

    expect(component.cards().filter(c => c.isMatched).length).toBe(4);
    expect(component.feedbackState()).toBe('success');
    expect(component.answerSubmitted.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      isCorrect: true,
      gameType: 'neural-link'
    }));
  }));

  it('debería regresar las cartas a su estado original si no coinciden', fakeAsync(() => {
    const groupA = component.cards().filter(c => c.matchId === 'A');
    const groupB = component.cards().filter(c => c.matchId === 'B');

    // Voltear una carta de A y una de B
    component.flipCard(groupA[0]);
    component.flipCard(groupB[0]);
    
    // Inmediatamente después de voltear, ambas deberían figurar como "isFlipped = true" en el arreglo global
    expect(component.flippedCards().length).toBe(2);

    tick(1000); // Esperar timeout de fallo

    expect(component.flippedCards().length).toBe(0);
    expect(component.cards().some(c => c.isMatched)).toBeFalse();
  }));
});
