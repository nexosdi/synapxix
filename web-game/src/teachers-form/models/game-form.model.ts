// src/teachers-forms/models/game-form.model.ts
export interface IGameConfigForm {
  data: any; // El gameInput que estamos editando
  dataChange: any; // Para emitir cambios si usas signals o @Output
}