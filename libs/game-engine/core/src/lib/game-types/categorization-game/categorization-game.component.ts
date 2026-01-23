import { Component, computed, inject, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../services/history.service';
import { 
  CategorizationInteractiveContent, 
  toCategorizationGameModel, 
  SortableItem 
} from './categorization-game.model';

@Component({
  selector: 'lib-categorization-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel(); as view) {
    <section class="relative mx-auto flex max-w-5xl flex-col gap-10 rounded-[4rem] bg-white p-12 shadow-2xl border-b-[16px] border-slate-200">
      
      @if (feedbackState() !== 'idle') {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in">
          <div [class]="feedbackConfig().class" class="flex flex-col items-center gap-6 rounded-[4rem] px-16 py-12 shadow-2xl border-b-[12px] animate-in zoom-in bounce-in">
            <span class="text-8xl">{{ feedbackConfig().icon }}</span>
            <h3 class="text-4xl font-black text-white italic tracking-tighter">{{ feedbackConfig().title }}</h3>
          </div>
        </div>
      }

      <header class="text-center space-y-4">
        <h2 class="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-none">
          {{ view.prompt }}
        </h2>
        <p class="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">Arrastra el elemento a su caja correcta</p>
      </header>

      <div class="flex justify-center items-center h-72 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
        @if (currentItem(); as item) {
          <div 
            draggable="true"
            (dragstart)="onDragStart($event, item)"
            class="group cursor-grab active:cursor-grabbing relative flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] shadow-2xl border-b-[8px] border-sky-400 min-w-[260px] transition-transform hover:scale-105"
          >
            @if (item.imageUrl) {
              <img [src]="item.imageUrl" class="h-32 w-32 rounded-2xl object-cover mb-4 shadow-md pointer-events-none" />
            }
            
            <span class="text-3xl font-black text-sky-900 uppercase tracking-widest text-center">
              {{ item.text }}
            </span>

            <div class="absolute -top-4 -right-4 bg-sky-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-lg">
              MOVER
            </div>
          </div>
        } @else {
          <div class="text-3xl font-black text-emerald-500 animate-bounce italic uppercase">¡Misión Cumplida!</div>
        }
      </div>

      <div class="grid grid-cols-2 gap-10">
        @for (cat of view.categories; track cat.id) {
          <div 
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event, cat.id)"
            class="relative flex flex-col items-center justify-center gap-6 rounded-[4rem] border-4 border-dashed p-12 transition-all duration-300"
            [class.bg-emerald-50]="cat.id === 'cat1'"
            [class.border-emerald-300]="cat.id === 'cat1'"
            [class.bg-amber-50]="cat.id === 'cat2'"
            [class.border-amber-300]="cat.id === 'cat2'"
            [class.scale-110]="isHovering() === cat.id"
            [class.ring-8]="isHovering() === cat.id"
            [class.ring-white/50]="isHovering() === cat.id"
          >
            <span class="text-8xl transition-transform" [class.scale-125]="isHovering() === cat.id">
              {{ cat.icon || '📦' }}
            </span>
            
            <div class="bg-white px-8 py-3 rounded-full shadow-lg border-2 border-slate-100">
              <span class="text-2xl font-black text-slate-700 uppercase tracking-tighter">
                {{ cat.label }}
              </span>
            </div>

            @if (isHovering() === cat.id) {
              <div class="absolute inset-4 rounded-[3.5rem] border-4 border-white opacity-40 animate-pulse"></div>
            }
          </div>
        }
      </div>

      <footer class="flex justify-center">
        <div class="w-full max-w-md h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
           <div class="h-full bg-emerald-400 rounded-full transition-all duration-700" [style.width.%]="progress()"></div>
        </div>
      </footer>
    </section>
    }
  `
})
export class CategorizationGameComponent implements OnInit {
  private readonly historyService = inject(HistoryService);
  readonly content = input.required<CategorizationInteractiveContent>();
  readonly viewModel = computed(() => toCategorizationGameModel(this.content()));

  remainingItems = signal<SortableItem[]>([]);
  totalCount = signal(0);
  feedbackState = signal<'idle' | 'success' | 'error'>('idle');
  isHovering = signal<string | null>(null);

  currentItem = computed(() => this.remainingItems()[0] || null);
  progress = computed(() => this.totalCount() > 0 ? ((this.totalCount() - this.remainingItems().length) / this.totalCount()) * 100 : 0);

  ngOnInit() {
    const items = [...this.viewModel().items].sort(() => Math.random() - 0.5);
    this.remainingItems.set(items);
    this.totalCount.set(items.length);
  }

  readonly feedbackConfig = computed(() => ({
    success: { title: '¡EXCELENTE!', icon: '🎈', class: 'bg-emerald-500 border-emerald-700' },
    error: { title: '¡CASI!', icon: '🧐', class: 'bg-rose-500 border-rose-700' }
  }[this.feedbackState() as 'success' | 'error'] || { title: '', icon: '', class: '' }));

  // --- LÓGICA DE DRAG & DROP VANILLA ---

  onDragStart(event: DragEvent, item: SortableItem) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', item.categoryId);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Necesario para permitir el Drop
    // Aquí detectamos sobre qué categoría estamos
    const target = event.currentTarget as HTMLElement;
    this.isHovering.set(target.id || 'hovering'); 
  }

  onDragLeave() {
    this.isHovering.set(null);
  }

  onDrop(event: DragEvent, categoryId: string) {
    event.preventDefault();
    this.isHovering.set(null);
    
    const correctCatId = event.dataTransfer?.getData('text/plain');

    if (correctCatId === categoryId) {
      this.remainingItems.update(list => list.slice(1));
      if (this.remainingItems().length === 0) {
        this.feedbackState.set('success');
        setTimeout(() => this.historyService.advanceToNext(), 2500);
      }
    } else {
      this.feedbackState.set('error');
      setTimeout(() => this.feedbackState.set('idle'), 1500);
    }
  }
}