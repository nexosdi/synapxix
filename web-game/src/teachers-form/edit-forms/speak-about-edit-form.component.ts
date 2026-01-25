// src/teachers-forms/edit-forms/speak-photo-form.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importamos el modelo que me acabas de pasar
import { SpeakAboutPhotoGameData } from '../../../../libs/game-engine/core/src/lib/game-types/speak-about-photo-game/speak-about-photo-game.model';

@Component({
  selector: 'app-speak-photo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block">Imagen Principal (URL)</label>
          <input [(ngModel)]="data.imageUrl" class="w-full p-2 bg-white border rounded-lg text-sm outline-emerald-500" placeholder="assets/images/...">
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block">Media / Fondo (Opcional)</label>
          <input [(ngModel)]="data.media" class="w-full p-2 bg-white border rounded-lg text-sm outline-emerald-500" placeholder="assets/backgrounds/...">
        </div>
      </div>

      <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
        <h4 class="text-[10px] font-black text-emerald-600 uppercase mb-4 tracking-widest text-center">Configuración de Grabación</h4>
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-1">
            <label class="text-[9px] font-bold text-emerald-400 uppercase ml-1">Mínimo (Segundos)</label>
            <input type="number" [(ngModel)]="data.recording.minDurationSec" class="w-full p-3 bg-white border-none rounded-xl shadow-sm text-center font-bold text-emerald-700">
          </div>
          <div class="space-y-1">
            <label class="text-[9px] font-bold text-emerald-400 uppercase ml-1">Máximo (Segundos)</label>
            <input type="number" [(ngModel)]="data.recording.maxDurationSec" class="w-full p-3 bg-white border-none rounded-xl shadow-sm text-center font-bold text-emerald-700">
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="p-6 bg-white border-2 border-slate-50 rounded-3xl">
          <div class="flex justify-between items-center mb-4">
            <label class="text-[10px] font-black text-slate-400 uppercase">Palabras Clave Requeridas</label>
            <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Mínimo para aprobar: {{data.scoring.keywordsRequired}}</span>
          </div>
          
          <div class="flex gap-2 flex-wrap mb-4">
            @for (keyword of data.targetKeywords; track $index) {
              <span class="bg-slate-800 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
                {{ keyword }}
                <button (click)="removeKeyword($index)" class="hover:text-red-400">×</button>
              </span>
            }
          </div>
          
          <input #keyInput (keyup.enter)="addKeyword(keyInput)" 
                 class="w-full p-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                 placeholder="Escribe una palabra y pulsa Enter...">
        </div>

        <div class="p-4 bg-slate-50 rounded-2xl">
          <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest ml-1">Pista de Fluidez (Fluency Hint)</label>
          <input [(ngModel)]="data.scoring.fluencyHint" class="w-full p-3 bg-white border-none rounded-xl shadow-sm outline-none" placeholder="Ej: No te detengas demasiado entre palabras...">
        </div>
      </div>
    </div>
  `
})
export class SpeakPhotoFormComponent {
  @Input({ required: true }) data!: SpeakAboutPhotoGameData;

  addKeyword(input: HTMLInputElement) {
    const val = input.value.trim();
    if (!val) return;
    if (!this.data.targetKeywords) this.data.targetKeywords = [];
    this.data.targetKeywords.push(val);
    input.value = '';
    // Ajustamos automáticamente la cantidad requerida si es 0
    if (this.data.scoring.keywordsRequired === 0) {
      this.data.scoring.keywordsRequired = 1;
    }
  }

  removeKeyword(index: number) {
    this.data.targetKeywords.splice(index, 1);
  }
}