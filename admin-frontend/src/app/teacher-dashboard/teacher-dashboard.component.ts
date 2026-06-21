import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { AnalyticsService } from '../core/services/analytics.service';
import {
  CohortStats,
  StudentSummary,
  CognitiveMetricRecord,
} from '../core/models/analytics.models';

// Register Chart.js components (tree-shakeable)
Chart.register(
  BarController, BarElement,
  LineController, LineElement, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler
);

type SortField = 'displayName' | 'totalSessions' | 'avgAccuracy' | 'avgCognitiveLoad' | 'lastActive';
type SortDir   = 'asc' | 'desc';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  private readonly analytics = inject(AnalyticsService);
  private readonly router    = inject(Router);

  // ── Loading / error per section ───────────────────────────────────────────
  readonly loadingCohort   = signal(true);
  readonly loadingStudents = signal(true);
  readonly loadingDetail   = signal(false);
  readonly errorCohort     = signal<string | null>(null);
  readonly errorStudents   = signal<string | null>(null);
  readonly errorDetail     = signal<string | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  readonly cohortStats     = signal<CohortStats | null>(null);
  readonly students        = signal<StudentSummary[]>([]);
  readonly selectedStudent = signal<StudentSummary | null>(null);
  readonly studentMetrics  = signal<CognitiveMetricRecord[]>([]);

  // ── Table sort ────────────────────────────────────────────────────────────
  readonly sortField = signal<SortField>('avgAccuracy');
  readonly sortDir   = signal<SortDir>('desc');

  readonly sortedStudents = computed(() => {
    const field = this.sortField();
    const dir   = this.sortDir();
    return [...this.students()].sort((a, b) => {
      const va = a[field] as string | number;
      const vb = b[field] as string | number;
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ?  1 : -1;
      return 0;
    });
  });

  readonly drawerOpen = signal(false);

  // TODO: Replace with name claim from JWT token once Auth0/Keycloak is integrated.
  readonly teacherName = signal('');

  // ── KPI computed ─────────────────────────────────────────────────────────
  readonly kpiAccuracyPct   = computed(() => Math.round((this.cohortStats()?.avgAccuracy ?? 0) * 100));
  readonly kpiCogLoadRound  = computed(() => Math.round(this.cohortStats()?.avgCognitiveLoad ?? 0));
  readonly kpiMemRetPct     = computed(() => Math.round((this.cohortStats()?.avgMemoryRetention ?? 0) * 100));
  readonly kpiAttSpanPct    = computed(() => Math.round((this.cohortStats()?.avgAttentionSpan ?? 0) * 100));

  // ── Bar chart: cohort averages ────────────────────────────────────────────
  readonly barChartData = signal<ChartData<'bar'>>({
    labels: ['Accuracy', 'Cognitive Load', 'Memory Retention', 'Attention Span'],
    datasets: [{
      label: 'Class Average',
      data: [0, 0, 0, 0],
      backgroundColor: ['rgba(167,139,250,0.7)', 'rgba(244,114,182,0.7)', 'rgba(52,211,153,0.7)', 'rgba(96,165,250,0.7)'],
      borderColor:     ['#a78bfa', '#f472b6', '#34d399', '#60a5fa'],
      borderWidth: 2,
      borderRadius: 8,
    }],
  });

  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,5,32,0.95)',
        titleColor: '#c4b5fd',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || 'Average';
            const value = context.parsed.y;
            if (context.label === 'Cog. Load') {
              return `${label}: ${value} (Index)`;
            }
            return `${label}: ${value}%`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.06)' },
        ticks: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 12 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.06)' },
        ticks: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 12 } },
        min: 0,
        max: 100,
      },
    },
  };

  // ── Line chart: student detail ────────────────────────────────────────────
  readonly lineChartData = signal<ChartData<'line'>>({
    labels: [],
    datasets: [
      { label: 'Accuracy', data: [], borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#a78bfa' },
      { label: 'Cognitive Load', data: [], borderColor: '#f472b6', backgroundColor: 'rgba(244,114,182,0.1)', tension: 0.4, fill: false, pointBackgroundColor: '#f472b6' },
    ],
  });

  readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter', size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(15,5,32,0.95)',
        titleColor: '#c4b5fd',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.06)' },
        ticks: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 11 }, maxRotation: 0 },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.06)' },
        ticks: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 11 } },
        min: 0,
        max: 100,
      },
    },
  };

  // ─────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.loadCohort();
    this.loadStudents();
  }

  ngOnDestroy(): void {}

  // ── Data loading ──────────────────────────────────────────────────────────
  loadCohort(): void {
    this.loadingCohort.set(true);
    this.errorCohort.set(null);
    this.analytics.getCohortStats().subscribe({
      next: (stats) => {
        this.cohortStats.set(stats);
        this.barChartData.set({
          labels: ['Accuracy', 'Cog. Load', 'Memory', 'Attention'],
          datasets: [{
            label: 'Class Average',
            data: [
              Math.round(stats.avgAccuracy * 100),
              Math.round(stats.avgCognitiveLoad),
              Math.round(stats.avgMemoryRetention * 100),
              Math.round(stats.avgAttentionSpan * 100),
            ],
            backgroundColor: ['rgba(167,139,250,0.7)', 'rgba(244,114,182,0.7)', 'rgba(52,211,153,0.7)', 'rgba(96,165,250,0.7)'],
            borderColor:     ['#a78bfa', '#f472b6', '#34d399', '#60a5fa'],
            borderWidth: 2,
            borderRadius: 8,
          }],
        });
        this.loadingCohort.set(false);
      },
      error: () => {
        this.errorCohort.set('Could not load cohort statistics.');
        this.loadingCohort.set(false);
      },
    });
  }

  loadStudents(): void {
    this.loadingStudents.set(true);
    this.errorStudents.set(null);
    this.analytics.getStudentList().subscribe({
      next: (list) => {
        this.students.set(list);
        this.loadingStudents.set(false);
      },
      error: () => {
        this.errorStudents.set('Could not load student list.');
        this.loadingStudents.set(false);
      },
    });
  }

  openStudentDetail(student: StudentSummary): void {
    this.selectedStudent.set(student);
    this.drawerOpen.set(true);
    this.loadingDetail.set(true);
    this.errorDetail.set(null);

    this.analytics.getStudentDetail(student.userId).subscribe({
      next: (metrics) => {
        this.studentMetrics.set(metrics);
        const labels = metrics.map((m) =>
          new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        this.lineChartData.set({
          labels,
          datasets: [
            {
              label: 'Accuracy %',
              data: metrics.map((m) => Math.round(m.accuracy * 100)),
              borderColor: '#a78bfa',
              backgroundColor: 'rgba(167,139,250,0.12)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#a78bfa',
              pointRadius: 5,
            },
            {
              label: 'Cog. Load',
              data: metrics.map((m) => Math.round(m.cognitiveLoad)),
              borderColor: '#f472b6',
              backgroundColor: 'rgba(244,114,182,0.05)',
              tension: 0.4,
              fill: false,
              pointBackgroundColor: '#f472b6',
              pointRadius: 5,
            },
          ],
        });
        this.loadingDetail.set(false);
      },
      error: () => {
        this.errorDetail.set('Could not load student metrics.');
        this.loadingDetail.set(false);
      },
    });
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
    this.selectedStudent.set(null);
  }

  // ── Table sort ────────────────────────────────────────────────────────────
  sortBy(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDir.set('desc');
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  pct(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  accuracyClass(value: number): string {
    if (value >= 0.8) return 'pill pill--green';
    if (value >= 0.6) return 'pill pill--amber';
    return 'pill pill--red';
  }

  relativeDate(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  }

  getUserInitial(): string {
    return (this.teacherName() || 'Teacher').charAt(0).toUpperCase();
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
