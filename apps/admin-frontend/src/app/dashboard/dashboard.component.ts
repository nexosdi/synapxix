import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { PlaygroundComponent } from './playground/playground.component';

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
    private cdr: ChangeDetectorRef
  ) {
    // Cargar puntuación guardada del localStorage
    const savedScore = localStorage.getItem('synapsis_game_score');
    if (savedScore) {
      this.gameScore = parseInt(savedScore, 10);
    }
  }

  async ngOnInit() {
    try {
      const isLogged = await this.keycloakService.isLoggedIn();
      
      if (!isLogged) {
        console.log('[Dashboard] Not logged in, redirecting to login');
        this.router.navigate(['/login']);
        return;
      }

      await this.keycloakService.loadUserProfile();
      
      this.username = this.keycloakService.getUsername() || 'Usuario';
      
      this.loading = false;
      
      // Iniciar el mini-juego
      this.startMoleGame();
      
      this.cdr.detectChanges();
    } catch (err) {
      console.error('[Dashboard] Error:', err);
      this.username = 'Error al cargar usuario';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

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