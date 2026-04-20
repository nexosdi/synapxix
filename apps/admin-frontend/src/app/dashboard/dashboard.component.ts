import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { PlaygroundComponent, Category, Difficulty } from './playground/playground.component';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChatbotComponent, PlaygroundComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string = '';
  loading: boolean = true;

  // Datos para el Playground (Configuración base con IDs reales del catálogo)
  categories: Category[] = [
    { id: 'linguistic', name: 'Lingüística', icon: '📚', bgColorClass: 'bg-secondary-container' },
    { id: 'logical_mathematical', name: 'Lógica', icon: '🧮', bgColorClass: 'bg-tertiary-container' },
    { id: 'spatial', name: 'Espacial', icon: '🗺️', bgColorClass: 'bg-primary-container' },
    { id: 'musical', name: 'Musical', icon: '🎵', bgColorClass: 'bg-error-container' }
  ];

  difficulties: Difficulty[] = [
    { id: 'visual_summary', name: 'Visual', stars: 1, baseClass: 'bg-primary-container', shadowClass: 'shadow-primary', ageText: 'Resumen visual' },
    { id: 'interactive_quiz', name: 'Interactiva', stars: 2, baseClass: 'bg-secondary-container', shadowClass: 'shadow-secondary', ageText: 'Quiz rápido' },
    { id: 'project_challenge', name: 'Desafío', stars: 3, baseClass: 'bg-tertiary-container', shadowClass: 'shadow-tertiary', ageText: 'Proyecto mini' }
  ];

  // Mini-juego: Whack-a-Mole
  gameScore: number = 0;
  moleVisible: boolean = false;
  molePosition = { top: 50, left: 50 };
  moleEmoji: string = '🐹';
  gameInterval: any;
  moleEmojis = ['🐹', '🐰', '🐻', '🐼', '🐨', '🦊', '🐸', '🐙'];
  
  // Animación de puntos
  showPointsAnimation: boolean = false;
  pointsAnimationPosition = { top: 50, left: 50 };

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService
  ) {
    // Cargar puntuación guardada del localStorage
    const savedScore = localStorage.getItem('synapsis_game_score');
    if (savedScore) {
      this.gameScore = parseInt(savedScore, 10);
    }
  }

  async ngOnInit() {
    try {
      // Cargamos el perfil para obtener el nombre y el ID.
      await this.keycloakService.loadUserProfile();
      this.username = this.keycloakService.getUsername() || 'Usuario';
      
      // Liberamos el estado de carga lo antes posible para evitar rebotes
      this.loading = false;
      this.startMoleGame();
      this.cdr.detectChanges();

      // Sincronización en segundo plano (no bloqueante)
      const userId = this.keycloakService.getKeycloakInstance()?.subject;
      if (userId) {
        this.apiService.post('learning/bootstrap', {}).pipe(
          switchMap(() => this.apiService.post('learning/users', { 
            userId: userId, 
            name: this.username 
          }))
        ).subscribe({
          next: () => console.log('[Dashboard] Entorno de aprendizaje sincronizado.'),
          error: (err: any) => console.error('[Dashboard] Error sincronizando aprendizaje:', err)
        });
      }
    } catch (err) {
      console.error('[Dashboard] Error en inicialización:', err);
      this.loading = false;
      this.username = 'Usuario Synapsis';
      this.startMoleGame();
      this.cdr.detectChanges();
    }
  }

  // Se necesita importar switchMap
  // Nota: Ya existe import de switchMap en otros archivos, 
  // pero hay que verificar en este archivo.


  ngOnDestroy() {
    // Limpiar el intervalo cuando se destruya el componente
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
  }

  logout() {
    this.keycloakService.logout(window.location.origin);
  }

  getUserInitial(): string {
    return this.username.charAt(0).toUpperCase();
  }

  // Mini-juego: Whack-a-Mole
  startMoleGame() {
    this.gameInterval = setInterval(() => {
      this.showMole();
    }, 30000); 

    setTimeout(() => this.showMole(), 5000);
  }

  showMole() {
    // Generar posición aleatoria
    this.molePosition = {
      top: Math.random() * 70 + 10, // 10-80%
      left: Math.random() * 70 + 10  // 10-80%
    };

    // Seleccionar emoji aleatorio
    this.moleEmoji = this.moleEmojis[Math.floor(Math.random() * this.moleEmojis.length)];

    // Mostrar el topo
    this.moleVisible = true;

    // Ocultar después de 3 segundos si no lo atrapan
    setTimeout(() => {
      this.moleVisible = false;
    }, 3000);
  }

  catchMole() {
    if (this.moleVisible) {
      this.gameScore += 10;
      this.moleVisible = false;
      
      // Guardar puntuación en localStorage
      localStorage.setItem('synapsis_game_score', this.gameScore.toString());
      
      // Mostrar animación de puntos
      this.pointsAnimationPosition = { ...this.molePosition };
      this.showPointsAnimation = true;
      
      // Ocultar animación después de 1 segundo
      setTimeout(() => {
        this.showPointsAnimation = false;
      }, 1000);
      
      console.log('¡Atrapaste al topo! Puntos:', this.gameScore);
    }
  }


}