import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ReadSelectGameComponent } from './read-select-game.component';
import { ReadSelectInteractiveContent } from './read-select-game.model';

describe('ReadSelectGameComponent', () => {
  let component: ReadSelectGameComponent;
  let fixture: ComponentFixture<ReadSelectGameComponent>;
  let componentRef: ComponentRef<ReadSelectGameComponent>;

  const mockContent: ReadSelectInteractiveContent = {
    id: 'test-2',
    gameType: 'read-select',
    gameInput: {
      prompt: 'Select the correct options',
      locale: 'en',
      minCorrectToPass: 2,
      timeLimitSec: 60,
      options: [
        { text: 'Correct 1', isReal: true },
        { text: 'Correct 2', isReal: true },
        { text: 'Incorrect 1', isReal: false },
        { text: 'Incorrect 2', isReal: false }
      ]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadSelectGameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadSelectGameComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('content', mockContent);
    componentRef.setInput('disabled', false);
    fixture.detectChanges();
  });

  it('should create and initialize options correctly', () => {
    expect(component).toBeTruthy();
    expect(component.options().length).toBe(4);
    expect(component.foundWords().size).toBe(0);
    expect(component.wrongWords().size).toBe(0);
  });

  it('should register a correct word in foundWords', () => {
    const correctOption = component.options().find(o => o.isReal)!;
    component.onOptionClick(correctOption);

    expect(component.foundWords().has(correctOption.text)).toBe(true);
    expect(component.wrongWords().has(correctOption.text)).toBe(false);
  });

  it('should register an incorrect word in wrongWords', () => {
    const wrongOption = component.options().find(o => !o.isReal)!;
    component.onOptionClick(wrongOption);

    expect(component.wrongWords().has(wrongOption.text)).toBe(true);
    expect(component.foundWords().has(wrongOption.text)).toBe(false);
  });

  it('should not register words if disabled', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const correctOption = component.options().find(o => o.isReal)!;
    component.onOptionClick(correctOption);

    expect(component.foundWords().size).toBe(0);
  });

  it('should emit answerSubmitted when the minimum of correct options is reached', () => {
    jest.spyOn(component.answerSubmitted, 'emit');

    const correctOptions = component.options().filter(o => o.isReal);
    
    // Seleccionamos la primera
    component.onOptionClick(correctOptions[0]);
    expect(component.answerSubmitted.emit).not.toHaveBeenCalled();
    expect(component.isFinished()).toBe(false);

    // Seleccionamos la segunda (alcanza minCorrectToPass = 2)
    component.onOptionClick(correctOptions[1]);
    
    expect(component.isFinished()).toBe(true);
    expect(component.answerSubmitted.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        isCorrect: true,
        gameType: 'read-select',
        score: 100,
        answer: { selectedOptionId: 'Correct 1,Correct 2' }
      })
    );
  });
});