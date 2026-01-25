// src/teachers-forms/roadmap-builder.component.ts
import { Component, signal, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gameFormRegistry } from './game-form-registry';
import { History, InteractiveContent } from '../../../libs/game-engine/core/src/lib/models/history.model';

@Component({
  selector: 'app-roadmap-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-100 p-8 grid grid-cols-12 gap-8 font-sans">
      
      <div class="col-span-4 space-y-6">
        <section class="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
          <h2 class="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest text-center">Datos de la Lección</h2>
          <input [(ngModel)]="historyMetadata.name" placeholder="Nombre de la lección..." 
                 class="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold">
        </section>

        <section class="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
          <h2 class="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest text-center">Roadmap de Pasos</h2>
          
          <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            @for (step of steps(); track step.id; let i = $index) {
              <div (click)="editStep(i)" 
                   class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center"
                   [class]="editingIndex() === i ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-50 bg-white hover:border-slate-200'">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-500 text-[10px] font-bold text-white">{{ i + 1 }}</span>
                  <div class="overflow-hidden">
                    <p class="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">{{ step.gameType }}</p>
                    <p class="text-xs font-bold text-slate-700 truncate w-32">{{ step.gameInput.prompt || 'Sin consigna...' }}</p>
                  </div>
                </div>
                <button (click)="removeStep(i); $event.stopPropagation()" class="text-slate-300 hover:text-red-500 p-1">×</button>
              </div>
            } @empty {
              <div class="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 text-xs italic">
                No hay pasos en el mapa aún.
              </div>
            }
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100">
            <p class="text-[10px] font-black text-slate-400 uppercase mb-4 text-center tracking-widest">Catálogo de Juegos</p>
            <div class="grid grid-cols-1 gap-2">
              @for (type of availableTypes; track type) {
                <button (click)="createNewStep(type)" class="p-3 text-[10px] font-bold border-2 border-slate-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all uppercase">
                  + AÑADIR {{ type }}
                </button>
              }
            </div>
          </div>

          <button (click)="finishAndExport()" [disabled]="steps().length === 0" 
                  class="w-full mt-8 p-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all text-[10px]">
            Finalizar y Generar JSON
          </button>
        </section>
      </div>

      <div class="col-span-8">
        @if (editingIndex() !== null && currentForm()) {
          <div class="bg-white p-10 rounded-[40px] shadow-2xl border-2 border-emerald-500 ring-[12px] ring-emerald-500/5">
            <h2 class="text-3xl font-black text-slate-800 mb-8 uppercase italic border-b pb-4 tracking-tighter">
              Configurando: {{ steps()[editingIndex()!].gameType }}
            </h2>

            <div class="mb-8 p-6 bg-slate-50 rounded-3xl">
              <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Prompt del Alumno</label>
              <input [(ngModel)]="tempGameInput.prompt" class="w-full p-4 bg-white border-none rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500" 
                     placeholder="¿Qué instrucción verá el alumno?">
            </div>

            <div class="min-h-[300px]">
              <ng-container *ngComponentOutlet="currentForm(); inputs: { data: tempGameInput }"></ng-container>
            </div>

            <button (click)="saveCurrentStep()" class="w-full mt-10 p-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 transition-all">
              Guardar Configuración
            </button>
          </div>
        } @else {
          <div class="h-full min-h-[500px] flex items-center justify-center border-4 border-dashed border-slate-200 rounded-[40px] text-slate-300 bg-white/50 text-xl font-bold italic tracking-tighter">
            Selecciona un módulo de la izquierda para editar su contenido
          </div>
        }
      </div>
    </div>
  `,
})
export class RoadmapBuilderComponent {
  // Extrae los tipos automáticamente del registro
  readonly availableTypes = Object.keys(gameFormRegistry);
  
  steps = signal<any[]>([]);
  editingIndex = signal<number | null>(null);
  currentForm = signal<Type<any> | null>(null);
  
  historyMetadata = { 
    name: '', 
    description: '',
    introTitle: '¡Bienvenido!',
    introText: 'Comienza tu aventura educativa.'
  };
  
  tempGameInput: any = {};

  async createNewStep(type: string) {
    const newStep = { 
      id: `step-${Date.now()}`, 
      gameType: type, 
      gameInput: this.getInitialData(type) 
    };
    this.steps.update(prev => [...prev, newStep]);
    await this.editStep(this.steps().length - 1);
  }

  async editStep(index: number) {
    this.editingIndex.set(index);
    const type = this.steps()[index].gameType;
    
    // Clonamos para no afectar el Roadmap hasta darle a "Guardar"
    this.tempGameInput = JSON.parse(JSON.stringify(this.steps()[index].gameInput));
    
    const loader = gameFormRegistry[type];
    if (loader) {
      this.currentForm.set(await loader());
    }
  }

  saveCurrentStep() {
    const index = this.editingIndex();
    if (index !== null) {
      this.steps.update(prev => {
        const updated = [...prev];
        updated[index].gameInput = { ...this.tempGameInput };
        return updated;
      });
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingIndex.set(null);
    this.currentForm.set(null);
    this.tempGameInput = {};
  }

  removeStep(index: number) {
    this.steps.update(prev => prev.filter((_, i) => i !== index));
    if (this.editingIndex() === index) this.cancelEdit();
  }

  private getInitialData(type: string) {
    const base = { prompt: '', locale: 'es-AR' };
    
    // Inicialización según el modelo exacto de cada juego
    switch (type) {
      case 'balance-master':
        return { ...base, leftSide: { value: 0, label: '' }, rightSide: { value: 0, label: '' }, correctOperator: '=' };
      case 'sound-match':
        return { ...base, audioUrl: '', options: [] };
      case 'speak-about-photo':
        return { 
          ...base, 
          imageUrl: '', 
          recording: { minDurationSec: 5, maxDurationSec: 20 }, 
          scoring: { keywordsRequired: 1, fluencyHint: '' },
          targetKeywords: [] 
        };
      default:
        return base;
    }
  }

  finishAndExport() {
    const finalHistory: History = {
      id: 'history-' + crypto.randomUUID(),
      name: this.historyMetadata.name || 'Nueva Lección',
      description: this.historyMetadata.description,
      originalContent: {
        id: 'intro',
        type: 'text',
        content: { title: this.historyMetadata.introTitle, text: this.historyMetadata.introText }
      },
      contentMap: this.steps(),
      path: this.steps().map(s => s.id)
    };

    console.log('✅ ROADMAP GENERADO:', finalHistory);
    alert('Objeto generado en consola. Listo para guardar.');
  }
}