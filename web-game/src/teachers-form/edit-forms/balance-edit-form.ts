// src/teachers-forms/edit-forms/balance-form.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importamos tu interfaz exacta
import { BalanceGameData } from '@nexosdi.synapxix/game-engine/core';

@Component({
  selector: 'app-balance-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-in fade-in zoom-in duration-300">
      
      <div class="flex items-center gap-6 justify-between bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-inner">
        
        <div class="flex-1 space-y-4">
          <div class="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-blue-100 ring-4 ring-blue-50/50">
            <label for="leftValue" class="text-[10px] font-black text-blue-400 block mb-3 uppercase tracking-widest text-center">Lado Izquierdo</label>
            <input id="leftValue" type="number" [(ngModel)]="data.leftSide.value" 
                   class="w-full p-4 bg-blue-50/30 border-none rounded-2xl text-2xl font-black text-blue-600 text-center outline-none focus:ring-2 focus:ring-blue-400" placeholder="0">
            <label for="leftLabel" class="sr-only">Etiqueta Lado Izquierdo</label>
            <input id="leftLabel" [(ngModel)]="data.leftSide.label" 
                   class="w-full mt-3 p-2 bg-transparent border-b border-blue-100 text-center text-xs font-medium outline-none" placeholder="Etiqueta (ej: Perros)">
            <label for="leftImage" class="sr-only">URL Imagen Lado Izquierdo</label>
            <input id="leftImage" [(ngModel)]="data.leftSide.imageUrl" 
                   class="w-full mt-2 p-2 bg-slate-50 rounded-lg text-[10px] outline-none" placeholder="URL Imagen (opcional)">
          </div>
        </div>

        <div class="flex flex-col items-center gap-4 min-w-[80px]">
          <span class="text-[10px] font-black text-slate-300 uppercase italic">Lógica</span>
          <div class="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl rotate-3">
            {{ data.correctOperator }}
          </div>
        </div>

        <div class="flex-1 space-y-4">
          <div class="p-6 bg-white rounded-[2rem] shadow-sm border-2 border-indigo-100 ring-4 ring-indigo-50/50">
            <label for="rightValue" class="text-[10px] font-black text-indigo-400 block mb-3 uppercase tracking-widest text-center">Lado Derecho</label>
            <input id="rightValue" type="number" [(ngModel)]="data.rightSide.value" 
                   class="w-full p-4 bg-indigo-50/30 border-none rounded-2xl text-2xl font-black text-indigo-600 text-center outline-none focus:ring-2 focus:ring-indigo-400" placeholder="0">
            <label for="rightLabel" class="sr-only">Etiqueta Lado Derecho</label>
            <input id="rightLabel" [(ngModel)]="data.rightSide.label" 
                   class="w-full mt-3 p-2 bg-transparent border-b border-indigo-100 text-center text-xs font-medium outline-none" placeholder="Etiqueta (ej: Gatos)">
            <label for="rightImage" class="sr-only">URL Imagen Lado Derecho</label>
            <input id="rightImage" [(ngModel)]="data.rightSide.imageUrl" 
                   class="w-full mt-2 p-2 bg-slate-50 rounded-lg text-[10px] outline-none" placeholder="URL Imagen (opcional)">
          </div>
        </div>

      </div>

      <div class="p-6 bg-white border-2 border-slate-50 rounded-[2.5rem] shadow-sm">
        <h3 id="operatorLabel" class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-6 text-center">Definir Respuesta Correcta</h3>
        <div class="flex justify-center gap-4" aria-labelledby="operatorLabel">
          @for (op of ['<', '=', '>']; track op) {
            <button (click)="data.correctOperator = $any(op)" 
                    [class]="data.correctOperator === op ? 'bg-slate-900 text-white scale-110 shadow-xl' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'"
                    class="w-16 h-16 rounded-2xl font-black text-2xl transition-all duration-300 border-none">
              {{ op }}
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class BalanceFormComponent {
  @Input({ required: true }) data!: BalanceGameData;
}