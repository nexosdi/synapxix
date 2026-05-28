import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
<<<<<<< HEAD
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
import { PlaygroundComponent, Category, Difficulty } from './playground/playground.component';
=======
>>>>>>> 5388f43 (fix(chatbot): remover import de PlaygroundComponent para feature/chatbot)
import { ApiService } from '../core/services/api.service';

// Type interfaces for playground (imported locally for feature/chatbot branch)
interface Category {
  id: string;
  name: string;
  icon: string;
  bgColorClass: string;
}

interface Difficulty {
  id: string;
  name: string;
  stars: number;
  baseClass: string;
  shadowClass: string;
  ageText: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
<<<<<<< HEAD
<<<<<<< HEAD
  imports: [CommonModule, PlaygroundComponent],
=======
  imports: [CommonModule, ChatbotComponent, PlaygroundComponent],
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
  imports: [CommonModule, ChatbotComponent],
>>>>>>> 5388f43 (fix(chatbot): remover import de PlaygroundComponent para feature/chatbot)
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
<<<<<<< HEAD

=======
  
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
  showPointsAnimation: boolean = false;
  pointsAnimationPosition = { top: 50, left: 50 };

  constructor(
<<<<<<< HEAD
=======
    private keycloakService: KeycloakService,
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
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
<<<<<<< HEAD
      this.username = 'Usuario';
=======
      await this.keycloakService.loadUserProfile();
      this.username = this.keycloakService.getUsername() || 'Usuario';
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
      this.loading = false;
      this.startMoleGame();
      this.cdr.detectChanges();

<<<<<<< HEAD
      const userId = 'test-user';

      this.apiService.post('learning/bootstrap', {}).pipe(
        switchMap(() => this.apiService.post('learning/users', {
          userId: userId,
          name: this.username
        }))
      ).subscribe({
        next: () => console.log('[Dashboard] Learning environment synced.'),
        error: (err: any) => console.error('[Dashboard] Sync error:', err)
      });

=======
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
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
    } catch (err) {
      console.error('[Dashboard] Initialization error:', err);
      this.loading = false;
      this.username = 'Usuario Synapsis';
      this.startMoleGame();
      this.cdr.detectChanges();
    }
  }

<<<<<<< HEAD
=======
  // Se necesita importar switchMap
  // Nota: Ya existe import de switchMap en otros archivos, 
  // pero hay que verificar en este archivo.


>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
  ngOnDestroy() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
  }

  logout() {
<<<<<<< HEAD
    this.router.navigate(['/login']);
=======
    this.keycloakService.logout(window.location.origin);
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
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
<<<<<<< HEAD

    this.moleEmoji = this.moleEmojis[Math.floor(Math.random() * this.moleEmojis.length)];
    this.moleVisible = true;

    setTimeout(() => {
      this.moleVisible = false;
    }, 3000);
=======
    this.moleEmoji = this.moleEmojis[Math.floor(Math.random() * this.moleEmojis.length)];
    this.moleVisible = true;
    setTimeout(() => { this.moleVisible = false; }, 3000);
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
  }

  catchMole() {
    if (this.moleVisible) {
      this.gameScore += 10;
      this.moleVisible = false;
<<<<<<< HEAD

      localStorage.setItem('synapsis_game_score', this.gameScore.toString());

      this.pointsAnimationPosition = { ...this.molePosition };
      this.showPointsAnimation = true;

      setTimeout(() => {
        this.showPointsAnimation = false;
      }, 1000);
=======
      localStorage.setItem('synapsis_game_score', this.gameScore.toString());
      this.pointsAnimationPosition = { ...this.molePosition };
      this.showPointsAnimation = true;
      setTimeout(() => { this.showPointsAnimation = false; }, 1000);
>>>>>>> b757008 (feat(chatbot): mover implementación del chatbot desde santiago-front)
    }
  }
}