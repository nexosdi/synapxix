import { Injectable, inject } from '@angular/core';
import { PulseSessionService } from './pulse-session.service';

const API = '/api/team/v1';

export interface JoinResponse {
  token: string;
  subjectId: string;
  consent: { scopeId: string; researchAllowed: boolean };
  member: { memberId: string; name: string | null; roleLabel: string | null; status: string };
}

export interface ConstructState {
  value: number;
  confidence: number;
  stability: number;
  status: string;
  uncertainty: { lower: number; upper: number; method: string };
  evidenceCount: number;
  validUntil: string | null;
  modelVersion: string;
  /** Explicaciones rivales aún no descartadas (capa narrativa del reporte). */
  alternatives: string[];
  /** Qué observación confirmaría o refutaría esta lectura. */
  nextValidation: string | null;
}

export interface PulseReport {
  member: { memberId: string; name: string | null; roleLabel: string | null; status: string; archetype: string | null };
  subjectId: string;
  constructs: Record<string, ConstructState>;
  /** Desempeño en El Caso: separar observado de inferido y decidir con límites. */
  rigor: { answers: number; correct: number; accuracy: number; reading: string } | null;
  activity: { totalEvents: number; sessions: number; byType: Record<string, number> };
  declared: {
    entryMode?: string;
    workRhythm?: string;
    feedbackMode?: string;
    shareConditions?: boolean;
  };
  decisions: Array<{
    decisionId: string;
    objective: string;
    selectedAction: string;
    reasons: Array<{ type: string; referenceId: string; explanation: string }>;
    confidence: number;
    policyVersion: string;
    requiresHumanApproval: boolean;
    humanVerdict: string | null;
    humanVerdictReason: string | null;
    expectedOutcome: { metric: string; probability: number } | null;
    createdAt: string;
  }>;
  archetypes: Array<{
    archetype: string;
    affinity: number;
    signals: string[];
    meta: { label: string; accentA: string; accentB: string; mood: string };
  }>;
}

/** Cliente de la API del Primer Pulso. El token vive en PulseSessionService. */
@Injectable({ providedIn: 'root' })
export class PulseApiService {
  private readonly session = inject(PulseSessionService);

  join(inviteCode: string, name: string, roleLabel?: string): Promise<JoinResponse> {
    return this.post(`${API}/join`, { inviteCode, name, roleLabel }, false);
  }

  saveDeclared(declared: {
    entryMode?: string;
    workRhythm?: string;
    feedbackMode?: string;
    shareConditions?: boolean;
  }) {
    return this.post(`${API}/declared`, declared);
  }

  requestDecision(): Promise<{
    decision_id: string;
    objective: string;
    selected_action: string;
    candidate_actions: string[];
    reasons: Array<{ type: string; referenceId: string; explanation: string }>;
    confidence: number;
    policy_version: string;
    requires_human_approval: boolean;
    expected_outcome: { metric: string; probability: number } | null;
  }> {
    return this.post(`${API}/me/decision`, {});
  }

  review(decisionId: string, verdict: 'approved' | 'rejected' | 'edited', reason?: string) {
    return this.post(`${API}/me/decisions/${decisionId}/review`, { verdict, reason });
  }

  recordOutcome(decisionId: string, interventionId: string, metrics: Record<string, unknown>) {
    return this.post(`${API}/me/outcomes`, { decisionId, interventionId, metrics });
  }

  report(): Promise<PulseReport> {
    return this.get(`${API}/me/report`);
  }

  trace(decisionId: string): Promise<{
    decision: unknown;
    stateSnapshot: unknown;
    evidence: Array<{ observationId: string; constructId: string; rule: string; weight: number }>;
    outcomes: unknown[];
  }> {
    return this.get(`${API}/me/trace/${decisionId}`);
  }

  complete(archetype?: string) {
    return this.post(`${API}/complete`, { archetype });
  }

  starAi(archetype: string): Promise<{ mimeType: string; base64: string; label: string }> {
    return this.post(`${API}/me/star/ai`, { archetype });
  }

  private async post<T>(url: string, body: unknown, withAuth = true): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(withAuth ? this.session.authHeader : {}),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error((detail as { message?: string }).message ?? `request_failed_${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  private async get<T>(url: string): Promise<T> {
    const response = await fetch(url, { headers: this.session.authHeader });
    if (!response.ok) throw new Error(`request_failed_${response.status}`);
    return response.json() as Promise<T>;
  }
}
