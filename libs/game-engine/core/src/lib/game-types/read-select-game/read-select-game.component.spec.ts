import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadSelectGameComponent } from './read-select-game.component';
import { ComponentRef } from '@angular/core';
import { ReadSelectInteractiveContent } from './read-select-game.model';

describe('ReadSelectGameComponent', () => {
  let component: ReadSelectGameComponent;
  let fixture: ComponentFixture<ReadSelectGameComponent>;
  let componentRef: ComponentRef<ReadSelectGameComponent>;

  const mockContent: ReadSelectInteractiveContent = {
    id: 'test-2',
    gameType: 'read-select',
    gameInput: {
      prompt: 'Test read select',
      locale: 'es-AR',
      minCorrectToPass: 2,
      timeLimitSec: 60,
      options: [
        { text: 'Correct1', isReal: true },
        { text: 'Correct2', isReal: true },
        { text: 'Incorrect1', isReal: false }
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

  it('should create and initialize options', () => {
    expect(component).toBeTruthy();
    expect(component.options().length).toBe(3);
    expect(component.foundWords().size).toBe(0);
    expect(component.wrongWords().size).toBe(0);
  });

  it('should add to foundWords when correct option clicked', () => {
    const correctOption = component.options().find(o => o.isReal)!;
    component.onOptionClick(correctOption);
    
    expect(component.foundWords().has(correctOption.text)).toBe(true);
    expect(component.isFinished()).toBe(false);
  });

  it('should add to wrongWords when incorrect option clicked', () => {
    const incorrectOption = component.options().find(o => !o.isReal)!;
    component.onOptionClick(incorrectOption);
    
    expect(component.wrongWords().has(incorrectOption.text)).toBe(true);
    expect(component.foundWords().size).toBe(0);
    expect(component.isFinished()).toBe(false);
  });

  it('should ignore clicks if disabled', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const correctOption = component.options().find(o => o.isReal)!;
    component.onOptionClick(correctOption);
    
    expect(component.foundWords().has(correctOption.text)).toBe(false);
  });

  it('should finish game and emit answerSubmitted when minCorrectToPass reached', () => {
    jest.spyOn(component.answerSubmitted, 'emit');

    const correctOptions = component.options().filter(o => o.isReal);
    
    // We expect minCorrectToPass to be 2 (default calculation in toReadSelectGameModel)
    expect(component.viewModel().minCorrectToPass).toBe(2);

    component.onOptionClick(correctOptions[0]);
    expect(component.isFinished()).toBe(false);

    component.onOptionClick(correctOptions[1]);
    
    expect(component.isFinished()).toBe(true);
    expect(component.answerSubmitted.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        gameType: 'read-select',
        isCorrect: true,
        score: 100
      })
    );
  });
});
