import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpotlightGameComponent } from './spotlight-game.component';
import { ComponentRef } from '@angular/core';
import { SpotlightInteractiveContent } from './spotlight-game.model';

describe('SpotlightGameComponent', () => {
  let component: SpotlightGameComponent;
  let fixture: ComponentFixture<SpotlightGameComponent>;
  let componentRef: ComponentRef<SpotlightGameComponent>;

  const validContent: SpotlightInteractiveContent = {
    id: 'test-spotlight',
    gameType: 'spotlight',
    gameInput: {
      prompt: 'Encuentra los objetos',
      backgroundImage: 'bg.jpg',
      locale: 'es-AR',
      targets: [
        { id: '1', name: 'Manzana', x: 10, y: 10, found: true }, // comes as true to test if it resets to false
        { id: '2', name: 'Banana', x: 50, y: 50, found: false }
      ]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotlightGameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpotlightGameComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('content', validContent);
    componentRef.setInput('disabled', false);
    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should create and show prompt', () => {
      expect(component).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('Encuentra los objetos');
    });

    it('should show target names in the sidebar', () => {
      expect(fixture.nativeElement.textContent).toContain('Manzana');
      expect(fixture.nativeElement.textContent).toContain('Banana');
    });

    it('should start with progress at 0', () => {
      expect(component.progress()).toBe(0);
    });
  });

  describe('ngOnInit', () => {
    it('should initialize all targets with found: false', () => {
      const targets = component.targets();
      expect(targets[0].found).toBe(false); // even if original was true
      expect(targets[1].found).toBe(false);
    });

    it('should preserve target count', () => {
      expect(component.targets().length).toBe(2);
    });
  });

  describe('onTargetFound', () => {
    it('should mark target as found', () => {
      const target = component.targets()[0];
      component.onTargetFound(target);
      expect(component.targets()[0].found).toBe(true);
    });

    it('should update progress to 50%', () => {
      const target = component.targets()[0];
      component.onTargetFound(target);
      expect(component.progress()).toBe(50);
    });

    it('should not affect other targets', () => {
      const target = component.targets()[0];
      component.onTargetFound(target);
      expect(component.targets()[0].found).toBe(true);
      expect(component.targets()[1].found).toBe(false);
    });

    it('should emit answerSubmitted and set showWin when all targets are found', () => {
      jest.spyOn(component.answerSubmitted, 'emit');
      
      component.onTargetFound(component.targets()[0]);
      expect(component.showWin()).toBe(false);
      expect(component.answerSubmitted.emit).not.toHaveBeenCalled();

      component.onTargetFound(component.targets()[1]);
      
      expect(component.showWin()).toBe(true);
      expect(component.answerSubmitted.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          gameType: 'spotlight',
          isCorrect: true,
          score: 100,
          answer: { selectedAreas: ['1', '2'] }
        })
      );
    });

    it('should be idempotent on already-found target', () => {
      jest.spyOn(component.answerSubmitted, 'emit');
      
      // First find
      component.onTargetFound(component.targets()[0]);
      
      // Re-find same target
      component.onTargetFound(component.targets()[0]);
      
      expect(component.progress()).toBe(50);
      expect(component.answerSubmitted.emit).not.toHaveBeenCalled();
    });
  });

  describe('disabled', () => {
    it('should block clicks when disabled', () => {
      componentRef.setInput('disabled', true);
      fixture.detectChanges();
      
      component.onTargetFound(component.targets()[0]);
      expect(component.targets()[0].found).toBe(false);
    });
  });
});
