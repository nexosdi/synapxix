import { Injectable, inject } from '@angular/core';
import type { DalaClaim, DalaSnapshotV2 } from '@nexosdi.synapxix/dala/contracts';
import { PulseSessionService } from './pulse-session.service';

const API = '/api/team/v1';

export interface JoinResponse {
  token: string;
  subjectId: string;
  consent: { scopeId: string; researchAllowed: boolean };
  member: { memberId: string; name: string | null; roleLabel: string | null; status: string };
}

export interface FrameworkView {
  version: string;
  ambitos: Array<{ id: string; name: string; question: string; withoutOpportunity: string }>;
  skills: Record<string, string>;
  scenes: Array<{ id: string; title: string }>;
  decisions: Array<{ id: string; label: string; purpose: string }>;
  constructs: Array<{
    id: string;
    name: string;
    question: string;
    limits: string;
    sufficiency: { provisional: { minOpportunities: number }; supported: { minOpportunities: number; minScenes: number } };
  }>;
}

export interface PulseReport {
  member: { memberId: string; name: string | null; roleLabel: string | null; status: string };
  subjectId: string;
  declared: { area?: string; portal?: string };
  snapshot: DalaSnapshotV2 & { snapshotId: string; reused: boolean };
  framework: FrameworkView;
  decisions: Array<{
    decisionId: string;
    selectedAction: string;
    humanVerdict: string | null;
    humanVerdictReason: string | null;
    stateSnapshotId: string;
    createdAt: string;
    outcome: { independiente?: boolean; resuelta?: boolean; pista_usada?: boolean; omitida?: boolean } | null;
  }>;
}

export interface ShadowDecision {
  decisionId: string;
  selected: string;
  label: string;
  objective: string;
  reasons: Array<{ type: string; referenceId: string; explanation: string }>;
  alternatives: Array<{ id: string; label: string; whyNot: string }>;
  expectedOutcome: { metric: string; description: string };
  verification: string;
  snapshotId: string;
  policyVersion: string;
}

export interface ReviewResult {
  decisionId: string;
  verdict: 'approved' | 'edited' | 'rejected';
  assigned: { id: string; label: string; content: { scene: string; hintAvailable: boolean } };
}

export interface TraceEvent {
  eventId: string;
  seconds: number;
  scene: string;
  sceneRef: string;
  opportunity: { id: string; kind: string } | null;
  type: string;
  origin: string;
  payload: Record<string, unknown>;
}

export interface TraceResult {
  claim: DalaClaim;
  snapshotId: string;
  events: TraceEvent[];
}

export interface ReplayCheck {
  reproducible: boolean | null;
  snapshotId?: string;
  events?: number;
  claims?: number;
  engineVersion?: string;
}

export interface MemberRow {
  memberId: string;
  name: string | null;
  roleLabel: string | null;
  status: string;
  email: string | null;
  completedAt: string | null;
  declared: { area?: string; portal?: string } | string;
}

/** Cliente de la API del Primer Pulso. El token vive en PulseSessionService. */
@Injectable({ providedIn: 'root' })
export class PulseApiService {
  private readonly session = inject(PulseSessionService);

  join(inviteCode: string, name: string, roleLabel?: string): Promise<JoinResponse> {
    return this.post(`${API}/join`, { inviteCode, name, roleLabel }, false);
  }

  /** Inscripción abierta del onboarding web. Idempotente por email. */
  register(input: { name: string; email: string; age: number; area: string }): Promise<JoinResponse & { returning: boolean }> {
    return this.post(`${API}/register`, input, false);
  }

  saveDeclared(declared: { portal?: string; area?: string; ageBand?: string }) {
    return this.post(`${API}/declared`, declared);
  }

  decide(): Promise<ShadowDecision> {
    return this.post(`${API}/me/decision`, {});
  }

  review(decisionId: string, verdict: 'approved' | 'edited' | 'rejected', chosen?: string, reason?: string): Promise<ReviewResult> {
    return this.post(`${API}/me/decisions/${decisionId}/review`, { verdict, chosen, reason });
  }

  recordOutcome(decisionId: string, interventionId: string, metrics: Record<string, unknown>) {
    return this.post(`${API}/me/outcomes`, { decisionId, interventionId, metrics });
  }

  report(): Promise<PulseReport> {
    return this.get(`${API}/me/report`);
  }

  traceClaim(claimKey: string): Promise<TraceResult> {
    return this.get(`${API}/me/claims/${encodeURIComponent(claimKey)}/trace`);
  }

  replay(): Promise<ReplayCheck> {
    return this.get(`${API}/me/replay`);
  }

  exportOwn(): Promise<unknown> {
    return this.get(`${API}/me/export`);
  }

  complete(archetype?: string) {
    return this.post(`${API}/complete`, { archetype });
  }

  // ── Vista de investigación ──────────────────────────────────────────────

  adminMembers(code: string): Promise<MemberRow[]> {
    return this.get(`${API}/admin/members`, code);
  }

  adminReport(code: string, memberId: string): Promise<PulseReport> {
    return this.get(`${API}/admin/members/${memberId}/report`, code);
  }

  adminTrace(code: string, memberId: string, claimKey: string): Promise<TraceResult> {
    return this.get(`${API}/admin/members/${memberId}/claims/${encodeURIComponent(claimKey)}/trace`, code);
  }

  adminReplay(code: string, memberId: string): Promise<ReplayCheck> {
    return this.get(`${API}/admin/members/${memberId}/replay`, code);
  }

  adminExport(code: string, memberId: string): Promise<unknown> {
    return this.get(`${API}/admin/members/${memberId}/export`, code);
  }

  private async post<T>(url: string, body: unknown, withAuth = true): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(withAuth ? this.session.authHeader : {}) },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error((detail as { message?: string }).message ?? `request_failed_${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  private async get<T>(url: string, adminCode?: string): Promise<T> {
    const headers: Record<string, string> = adminCode ? { 'X-Team-Admin-Code': adminCode } : this.session.authHeader;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`request_failed_${response.status}`);
    return response.json() as Promise<T>;
  }
}
