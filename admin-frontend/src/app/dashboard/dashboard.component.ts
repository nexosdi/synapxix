import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ApiService } from '../core/services/api.service';
import { switchMap } from 'rxjs/operators';

// Type interfaces for chatbot/playground
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
  imports: [CommonModule, ChatbotComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string = 'Usuario';
  loading: boolean = false;

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
      this.loading = false;
      this.startMoleGame();
      this.cdr.detectChanges();

      // Mock bootstrap (sin auth)
      this.apiService.post('learning/bootstrap', {}).pipe(
        switchMap(() =>
          this.apiService.post('learning/users', {
            userId: 'demo-user',
            name: this.username
          })
        )
      ).subscribe({
        next: () => console.log('[Dashboard] Learning environment synced.'),
        error: (err: any) => console.error('[Dashboard] Sync error:', err)
      });

    } catch (err) {
      console.error('[Dashboard] Initialization error:', err);
      this.loading = false;
      this.startMoleGame();
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
  }

  logout() {
    this.router.navigate(['/login']);
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