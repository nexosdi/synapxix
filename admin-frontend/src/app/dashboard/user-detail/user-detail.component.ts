import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { AdminService } from '../../core/services/admin.service';
import { UserMetrics } from '../../core/models/admin.models';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminService);
  
  metrics$: Observable<UserMetrics> | null = null;
  userId: string = '';

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  
  public pieChartData: ChartConfiguration<'pie'>['data'] | null = null;

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.loadMetrics();
    }
  }

  loadMetrics(): void {
    this.metrics$ = this.adminService.getUserMetrics(this.userId);
    if (this.metrics$) {
      this.metrics$.subscribe(metrics => {
        this.setupChart(metrics);
      });
    }
  }

  setupChart(metrics: UserMetrics): void {
    if (!metrics.gamesPlayed || metrics.gamesPlayed.length === 0) return;
    
    // Get CSS variables for chart colors based on BRAND.md
    const getCssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    
    const bgColors = [
      getCssVar('--sx-chart-1'),
      getCssVar('--sx-chart-2'),
      getCssVar('--sx-chart-3'),
      getCssVar('--sx-chart-4'),
      getCssVar('--sx-chart-5'),
      getCssVar('--sx-chart-6'),
    ];

    this.pieChartData = {
      labels: metrics.gamesPlayed.map(g => g.gameName),
      datasets: [
        {
          data: metrics.gamesPlayed.map(g => g.playCount),
          backgroundColor: bgColors.slice(0, metrics.gamesPlayed.length),
          borderWidth: 0
        }
      ]
    };
  }
}
