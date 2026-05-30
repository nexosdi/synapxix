import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

/**
 * Servicio de Categorías
 * Encapsula todas las llamadas al backend para categorías
 */
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private apiService: ApiService) {}

  /**
   * Obtener todas las categorías
   */
  getCategories(pagination?: PaginationDto): Observable<any> {
    return this.apiService.get('categories', pagination);
  }

  /**
   * Obtener categoría por ID
   */
  getCategory(id: number): Observable<Category> {
    return this.apiService.get(`categories/${id}`);
  }

  /**
   * Crear categoría
   * ✅ Requiere: rol 'admin'
   */
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.apiService.post('categories', category);
  }

  /**
   * Actualizar categoría
   * ✅ Requiere: rol 'admin'
   */
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.apiService.patch(`categories/${id}`, category);
  }

  /**
   * Eliminar categoría
   * ✅ Requiere: rol 'admin'
   */
  deleteCategory(id: number): Observable<void> {
    return this.apiService.delete(`categories/${id}`);
  }

  /**
   * Obtener conteo público (sin autenticación)
   */
  getPublicCount(): Observable<{ totalCategories: number; message: string }> {
    return this.apiService.get('categories/public/count');
  }
}
