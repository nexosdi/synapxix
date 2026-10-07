import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadSelectGameComponent } from './read-select-game.component';
import { ReadSelectInteractiveContent } from './read-select-game.model';

describe('ReadSelectGameComponent', () => {
  let component: ReadSelectGameComponent;
  let fixture: ComponentFixture<ReadSelectGameComponent>;

  const mockContent: ReadSelectInteractiveContent = {
    contentType: 'read-select',
    gameInput: {
      prompt: 'Selecciona las correctas',
      locale: 'es',
      minCorrectToPass: 2,
      timeLimitSec: 60,
      options: [
        { text: 'Correcta 1', isReal: true },
        { text: 'Correcta 2', isReal: true },
        { text: 'Incorrecta 1', isReal: false },
        { text: 'Incorrecta 2', isReal: false }
      ]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadSelectGameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadSelectGameComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', mockContent);
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(component.options().length).toBe(4);
  });

  it('debería registrar una palabra correcta en foundWords', () => {
    const correctOption = component.options().find(o => o.isReal)!;
    component.onOptionClick(correctOption);

    expect(component.foundWords().has(correctOption.text)).toBeTrue();
    expect(component.wrongWords().has(correctOption.text)).toBeFalse();
  });

  it('debería registrar una palabra incorrecta en wrongWords', () => {
    const wrongOption = component.options().find(o => !o.isReal)!;
    component.onOptionClick(wrongOption);

    expect(component.wrongWords().has(wrongOption.text)).toBeTrue();
    expect(component.foundWords().has(wrongOption.text)).toBeFalse();
  });

  it('no debería registrar palabras si está deshabilitado', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const correctOption = component.options().find(o => o.isReal)!;
    component.onOptionClick(correctOption);

    expect(component.foundWords().size).toBe(0);
  });

  it('debería emitir answerSubmitted cuando se alcanza el mínimo de correctas', () => {
    spyOn(component.answerSubmitted, 'emit');

    const correctOptions = component.options().filter(o => o.isReal);
    
    // Seleccionar la primera
    component.onOptionClick(correctOptions[0]);
    expect(component.answerSubmitted.emit).not.toHaveBeenCalled();
    expect(component.isFinished()).toBeFalse();

    // Seleccionar la segunda (se alcanza el minCorrectToPass = 2)
    component.onOptionClick(correctOptions[1]);
    
    expect(component.isFinished()).toBeTrue();
    expect(component.answerSubmitted.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      isCorrect: true,
      gameType: 'read-select',
      answer: { selectedOptionId: 'Correcta 1,Correcta 2' }
    }));
  });
});
