import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DalaService } from '../../core/services/dala.service';
import { DalaDecision, DalaTrace } from '../../core/models/dala.models';

@Component({
  selector: 'app-dala-review',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dala-review.component.html',
  styleUrls: ['./dala-review.component.css']
})
export class DalaReviewComponent implements OnInit {
  private readonly dalaService = inject(DalaService);
  private readonly router = inject(Router);

  readonly decisions = signal<DalaDecision[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly selectedTrace = signal<DalaTrace | null>(null);
  readonly loadingTrace = signal(false);
  readonly traceError = signal<string | null>(null);

  readonly reviewReason = signal('');
  readonly submitting = signal(false);
  readonly drawerOpen = signal(false);

  ngOnInit() {
    this.loadDecisions();
  }

  loadDecisions() {
    this.loading.set(true);
    this.error.set(null);
    this.dalaService.getDecisions('pending').subscribe({
      next: (res) => {
        this.decisions.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load pending decisions.');
        this.loading.set(false);
      }
    });
  }

  openDecision(decision: DalaDecision) {
    this.drawerOpen.set(true);
    this.loadingTrace.set(true);
    this.traceError.set(null);
    this.reviewReason.set('');
    this.selectedTrace.set(null);
    
    this.dalaService.getTrace(decision.decision_id).subscribe({
      next: (trace) => {
        this.selectedTrace.set(trace);
        this.loadingTrace.set(false);
      },
      error: () => {
        this.traceError.set('Could not load trace details.');
        this.loadingTrace.set(false);
      }
    });
  }

  closeDrawer() {
    this.drawerOpen.set(false);
    this.selectedTrace.set(null);
    this.traceError.set(null);
    this.reviewReason.set('');
  }

  submitReview(verdict: 'approved' | 'rejected') {
    const trace = this.selectedTrace();
    const reason = this.reviewReason().trim();
    if (!trace || !reason) return;

    this.submitting.set(true);
    this.dalaService.reviewDecision(trace.decision.decision_id, verdict, reason).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeDrawer();
        this.loadDecisions();
      },
      error: () => {
        this.traceError.set(`Failed to ${verdict} decision.`);
        this.submitting.set(false);
      }
    });
  }

  backToDashboard() {
    this.router.navigate(['/teacher']);
  }
}
