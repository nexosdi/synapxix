import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CategorizationGameComponent } from './categorization-game.component';
import { CategorizationInteractiveContent, SortableItem } from './categorization-game.model';
import { DalaInstrumentationService } from '../../services/dala.service';
import { AnyGameResult } from '../../models/game-result.model';

const CONTENT: CategorizationInteractiveContent = {
  id: 'cat-test-1',
  gameType: 'categorization',
  gameInput: {
    prompt: 'Clasifica los animales',
    locale: 'es',
    categories: [
      { id: 'cat1', label: 'Mamíferos', icon: '🐾' },
      { id: 'cat2', label: 'Aves', icon: '🦅' },
    ],
    items: [
      { id: 'item1', text: 'Perro', categoryId: 'cat1' },
      { id: 'item2', text: 'Águila', categoryId: 'cat2' },
    ],
  },
};

const SINGLE_ITEM_CONTENT: CategorizationInteractiveContent = {
  id: 'cat-test-single',
  gameType: 'categorization',
  gameInput: {
    prompt: 'Clasifica',
    locale: 'es',
    categories: [
      { id: 'cat1', label: 'Mamíferos', icon: '🐾' },
      { id: 'cat2', label: 'Aves', icon: '🦅' },
    ],
    items: [{ id: 'item1', text: 'Perro', categoryId: 'cat1' }],
  },
};

function makeDragEvent(
  dataMap: Record<string, string> = {},
  currentTarget?: HTMLElement,
): DragEvent {
  return {
    preventDefault: jest.fn(),
    dataTransfer: {
      getData: (key: string) => dataMap[key] ?? '',
      setData: jest.fn(),
      effectAllowed: 'move' as DataTransfer['effectAllowed'],
    },
    currentTarget: currentTarget ?? document.createElement('div'),
  } as unknown as DragEvent;
}

describe('CategorizationGameComponent', () => {
  let fixture: ComponentFixture<CategorizationGameComponent>;
  let component: CategorizationGameComponent;
  let mockAdapter: { mapInteraction: jest.Mock };

  function createFixture(
    content: CategorizationInteractiveContent,
  ): ComponentFixture<CategorizationGameComponent> {
    const f = TestBed.createComponent(CategorizationGameComponent);
    f.componentRef.setInput('content', content);
    f.componentRef.setInput('disabled', false);
    f.detectChanges();
    return f;
  }

  beforeEach(async () => {
    mockAdapter = { mapInteraction: jest.fn() };
    const dalaStub = { createAdapter: jest.fn().mockReturnValue(mockAdapter) };

    await TestBed.configureTestingModule({
      imports: [CategorizationGameComponent],
      providers: [{ provide: DalaInstrumentationService, useValue: dalaStub }],
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
      expect(fixture.nativeElement.textContent).toContain('Clasifica los animales');
    });

    it('should render the current pending item', () => {
      const item = component.currentItem() as SortableItem;
      expect(item).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain(item.text);
    });

    it('should render all categories', () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('Mamíferos');
      expect(el.textContent).toContain('Aves');
    });

    it('should start with feedbackState idle', () => {
      expect(component.feedbackState()).toBe('idle');
    });

    it('should start progress at 0%', () => {
      expect(component.progress()).toBe(0);
    });

    it('should expose a valid item as currentItem regardless of shuffle order', () => {
      const validIds = CONTENT.gameInput.items.map((i) => i.id);
      expect(validIds).toContain(component.currentItem()?.id);
    });
  });

  describe('correct drop', () => {
    it('should remove the item from remainingItems', () => {
      const before = component.remainingItems().length;
      const item = component.currentItem() as SortableItem;

      component.onDrop(makeDragEvent({ 'text/plain': item.categoryId }), item.categoryId);

      expect(component.remainingItems().length).toBe(before - 1);
    });

    it('should advance the progress bar', () => {
      const item = component.currentItem() as SortableItem;

      component.onDrop(makeDragEvent({ 'text/plain': item.categoryId }), item.categoryId);

      expect(component.progress()).toBeGreaterThan(0);
    });

    it('should emit answerSubmitted with isCorrect=true and score=100 on the last item', () => {
      const singleFixture = createFixture(SINGLE_ITEM_CONTENT);
      const singleComponent = singleFixture.componentInstance;

      const emitted: AnyGameResult[] = [];
      singleComponent.answerSubmitted.subscribe((r) => emitted.push(r));

      const item = singleComponent.currentItem() as SortableItem;
      singleComponent.onDrop(makeDragEvent({ 'text/plain': item.categoryId }), item.categoryId);

      expect(emitted).toHaveLength(1);
      expect(emitted[0].isCorrect).toBe(true);
      expect(emitted[0].score).toBe(100);
      expect(emitted[0].gameType).toBe('categorization');
    });

    it('should set feedbackState to success when all items are classified', () => {
      const singleFixture = createFixture(SINGLE_ITEM_CONTENT);
      const singleComponent = singleFixture.componentInstance;

      const item = singleComponent.currentItem() as SortableItem;
      singleComponent.onDrop(makeDragEvent({ 'text/plain': item.categoryId }), item.categoryId);

      expect(singleComponent.feedbackState()).toBe('success');
    });

    it('should not emit answerSubmitted while items remain', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      const item = component.currentItem() as SortableItem;
      component.onDrop(makeDragEvent({ 'text/plain': item.categoryId }), item.categoryId);

      expect(emitted).toHaveLength(0);
    });
  });

  describe('incorrect drop', () => {
    function wrongCategoryId(correctId: string): string {
      return correctId === 'cat1' ? 'cat2' : 'cat1';
    }

    it('should not emit answerSubmitted', () => {
      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      const item = component.currentItem() as SortableItem;
      component.onDrop(
        makeDragEvent({ 'text/plain': item.categoryId }),
        wrongCategoryId(item.categoryId),
      );

      expect(emitted).toHaveLength(0);
    });

    it('should set feedbackState to error', () => {
      const item = component.currentItem() as SortableItem;
      component.onDrop(
        makeDragEvent({ 'text/plain': item.categoryId }),
        wrongCategoryId(item.categoryId),
      );

      expect(component.feedbackState()).toBe('error');
    });

    it('should reset feedbackState to idle after 1500ms', fakeAsync(() => {
      const item = component.currentItem() as SortableItem;
      component.onDrop(
        makeDragEvent({ 'text/plain': item.categoryId }),
        wrongCategoryId(item.categoryId),
      );

      expect(component.feedbackState()).toBe('error');

      tick(1500);

      expect(component.feedbackState()).toBe('idle');
    }));

    it('should not remove the item from remainingItems', () => {
      const before = component.remainingItems().length;
      const item = component.currentItem() as SortableItem;
      component.onDrop(
        makeDragEvent({ 'text/plain': item.categoryId }),
        wrongCategoryId(item.categoryId),
      );

      expect(component.remainingItems().length).toBe(before);
    });
  });

  describe('drag over', () => {
    it('should set isHovering to the category id from the drop target', () => {
      const zone = document.createElement('div');
      zone.id = 'cat1';

      component.onDragOver(makeDragEvent({}, zone));

      expect(component.isHovering()).toBe('cat1');
    });
  });

  describe('disabled', () => {
    it('should not call mapInteraction on drag start when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const callsBefore = mockAdapter.mapInteraction.mock.calls.length;

      component.onDragStart(makeDragEvent(), component.currentItem() as SortableItem);

      expect(mockAdapter.mapInteraction.mock.calls.length).toBe(callsBefore);
    });

    it('should not update remainingItems on drop when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const before = component.remainingItems().length;
      const item = component.currentItem() as SortableItem;
      component.onDrop(makeDragEvent({ 'text/plain': item.categoryId }), item.categoryId);

      expect(component.remainingItems().length).toBe(before);
    });

    it('should not emit answerSubmitted on drop when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const emitted: AnyGameResult[] = [];
      component.answerSubmitted.subscribe((r) => emitted.push(r));

      const item = component.currentItem() as SortableItem;
      component.onDrop(makeDragEvent({ 'text/plain': item.categoryId }), item.categoryId);

      expect(emitted).toHaveLength(0);
    });

    it('should not set isHovering on drag over when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const zone = document.createElement('div');
      zone.id = 'cat2';
      component.onDragOver(makeDragEvent({}, zone));

      expect(component.isHovering()).toBeNull();
    });
  });
});
