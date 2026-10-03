import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WordAssociationGameComponent } from './word-association.component';
import { WordAssociationInteractiveContent } from './word-association.model';
import { AnyGameResult } from '../../models/game-result.model';

const CONTENT: WordAssociationInteractiveContent = {
  id: 'word-assoc-test',
  gameType: 'word-association',
  gameInput: {
    prompt: 'Select related words',
    baseWord: 'OCEAN',
    locale: 'en',
    options: [
      { id: '1', word: 'Water', isRelated: true },
      { id: '2', word: 'Fish', isRelated: true },
      { id: '3', word: 'Car', isRelated: false },
      { id: '4', word: 'Fire', isRelated: false },
    ],
  },
};

describe('WordAssociationGameComponent', () => {
  let fixture: ComponentFixture<WordAssociationGameComponent>;
  let component: WordAssociationGameComponent;

  function createFixture(
    content: WordAssociationInteractiveContent,
  ): ComponentFixture<WordAssociationGameComponent> {
    const f = TestBed.createComponent(WordAssociationGameComponent);
    f.componentRef.setInput('content', content);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    return f;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordAssociationGameComponent],
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
      expect(fixture.nativeElement.textContent).toContain('Select related words');
      expect(fixture.nativeElement.textContent).toContain('OCEAN');
    });

    it('should initialize with no words selected', () => {
      expect(component.selectedOptionIds().length).toBe(0);
    });
  });

  describe('gameplay', () => {
    it('should toggle selection when option is clicked', () => {
      component.toggleSelection('1');
      expect(component.selectedOptionIds().length).toBe(1);
      expect(component.selectedOptionIds()).toContain('1');
      
      component.toggleSelection('1'); // untoggle
      expect(component.selectedOptionIds().length).toBe(0);
    });

    it('should calculate perfect score when all correct options are selected and no incorrect ones', fakeAsync(() => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.toggleSelection('1');
      component.toggleSelection('2');
      
      component.submitSelection();
      
      expect(component.isProcessing()).toBe(true);
      expect(component.feedbackState()).toBe('success');
      
      tick(1500); // Wait for completion timeout
      
      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(true);
      expect(emitted[0].score).toBe(100);
      expect(emitted[0].gameType).toBe('word-association');
    }));

    it('should penalize for incorrect options', fakeAsync(() => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      component.toggleSelection('1'); // correct
      component.toggleSelection('3'); // incorrect
      
      component.submitSelection();
      
      expect(component.isProcessing()).toBe(true);
      expect(component.feedbackState()).toBe('error'); // (1/2)*100 - (1/4)*100 = 50 - 25 = 25 score < 70
      
      tick(1500);
      
      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(false);
      expect(emitted[0].score).toBe(25);
    }));
  });

  describe('disabled state', () => {
    it('should not toggle selection when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      
      component.toggleSelection('1');
      
      expect(component.selectedOptionIds().length).toBe(0);
    });
  });
});
