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

  gameScore: number = 0;
  moleVisible: boolean = false;
  molePosition = { top: 50, left: 50 };
  moleEmoji: string = '🐹';
  gameInterval: any;
  moleEmojis = ['🐹', '🐰', '🐻', '🐼', '🐨', '🦊', '🐸', '🐙'];
  
  showPointsAnimation: boolean = false;
  pointsAnimationPosition = { top: 50, left: 50 };

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService
  ) {
    const savedScore = localStorage.getItem('synapsis_game_score');
    if (savedScore) {
      this.gameScore = parseInt(savedScore, 10);
    }
  }

  async ngOnInit() {
    try {
      await this.keycloakService.loadUserProfile();
      this.username = this.keycloakService.getUsername() || 'Usuario';
      this.loading = false;
      this.startMoleGame();
      this.cdr.detectChanges();

      const userId = this.keycloakService.getKeycloakInstance()?.subject;
      if (userId) {
        this.apiService.post('learning/bootstrap', {}).pipe(
          switchMap(() => this.apiService.post('learning/users', {
            userId: userId,
            name: this.username
          }))
        ).subscribe({
          next: () => console.log('[Dashboard] Learning environment synced.'),
          error: (err: any) => console.error('[Dashboard] Sync error:', err)
        });
      }
    } catch (err) {
      console.error('[Dashboard] Initialization error:', err);
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

  startMoleGame() {
    this.gameInterval = setInterval(() => this.showMole(), 30000);
    setTimeout(() => this.showMole(), 5000);
  }

  showMole() {
    this.molePosition = {
      top: Math.random() * 70 + 10,
      left: Math.random() * 70 + 10
    };
    this.moleEmoji = this.moleEmojis[Math.floor(Math.random() * this.moleEmojis.length)];
    this.moleVisible = true;
    setTimeout(() => { this.moleVisible = false; }, 3000);
  }

  catchMole() {
    if (this.moleVisible) {
      this.gameScore += 10;
      this.moleVisible = false;
      localStorage.setItem('synapsis_game_score', this.gameScore.toString());
      this.pointsAnimationPosition = { ...this.molePosition };
      this.showPointsAnimation = true;
      setTimeout(() => { this.showPointsAnimation = false; }, 1000);
    }
  }
}