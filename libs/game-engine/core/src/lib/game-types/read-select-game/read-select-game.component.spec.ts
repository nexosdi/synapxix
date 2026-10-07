import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadSelectGameComponent } from './read-select-game.component';
import { ReadSelectInteractiveContent } from './read-select-game.model';

describe('ReadSelectGameComponent', () => {
  let component: ReadSelectGameComponent;
  let fixture: ComponentFixture<ReadSelectGameComponent>;

  const mockContent: ReadSelectInteractiveContent = {
    contentType: 'read-select',
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
    fixture.componentRef.setInput('content', mockContent);
    fixture.detectChanges();
  });

  it('should be created correctly', () => {
    expect(component).toBeTruthy();
    expect(component.options().length).toBe(4);
  });

  it('should register a correct word in foundWords', () => {
    const correctOption = component.options().find(o => o.isReal)!;
    component.onOptionClick(correctOption);

    expect(component.foundWords().has(correctOption.text)).toBeTrue();
    expect(component.wrongWords().has(correctOption.text)).toBeFalse();
  });

  it('should register an incorrect word in wrongWords', () => {
    const wrongOption = component.options().find(o => !o.isReal)!;
    component.onOptionClick(wrongOption);

    expect(component.wrongWords().has(wrongOption.text)).toBeTrue();
    expect(component.foundWords().has(wrongOption.text)).toBeFalse();
  });

  it('should not register words if disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const correctOption = component.options().find(o => o.isReal)!;
    component.onOptionClick(correctOption);

    expect(component.foundWords().size).toBe(0);
  });

  it('should emit answerSubmitted when the minimum of correct options is reached', () => {
    spyOn(component.answerSubmitted, 'emit');

    const correctOptions = component.options().filter(o => o.isReal);
    
    // Select the first one
    component.onOptionClick(correctOptions[0]);
    expect(component.answerSubmitted.emit).not.toHaveBeenCalled();
    expect(component.isFinished()).toBeFalse();

    // Select the second one (reaches minCorrectToPass = 2)
    component.onOptionClick(correctOptions[1]);
    
    expect(component.isFinished()).toBeTrue();
    expect(component.answerSubmitted.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      isCorrect: true,
      gameType: 'read-select',
      answer: { selectedOptionId: 'Correct 1,Correct 2' }
    }));
  });
});
