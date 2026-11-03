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

/** Una sola autorización, obligatoria para entrar. */
export interface ConsentChoice {
  accepted: boolean;
}

/** Afirmación de la instantánea A, reducida a lo que se compara. */
export interface BaselineClaim {
  key: string;
  numerator: number;
  denominator: number;
  evidenceStatus: string;
}

/** Perfil de trabajo declarado en «Tu primera semana» (no es evidencia). */
export interface Perfil {
  superpoderes?: string[];
  aprender?: string;
  motivacion?: string;
  trabajo?: Record<string, string>;
  reunion?: { dia: string; horario: string };
}

export interface PulseReport {
  member: { memberId: string; name: string | null; roleLabel: string | null; status: string };
  subjectId: string;
  declared: { area?: string; portal?: string; perfil?: Perfil };
  snapshot: DalaSnapshotV2 & { snapshotId: string; reused: boolean };
  /** Instantánea A (al terminar de aprender D.A.L.A.), si se pidió con `since`. */
  baseline?: { snapshotId: string; createdAt: string; claims: BaselineClaim[] } | null;
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

export interface ProfileDocument {
  documentId: string;
  kind: 'cv' | 'link';
  filename: string | null;
  mime: string | null;
  size: number | null;
  url: string | null;
  createdAt: string;
}

export interface MemberRow {
  memberId: string;
  name: string | null;
  roleLabel: string | null;
  status: string;
  email: string | null;
  joinedAt: string | null;
  completedAt: string | null;
  createdAt?: string;
  declared: { area?: string; edad?: number; portal?: string; perfil?: Perfil } | string;
}

/** Cliente de la API del Primer Pulso. El token vive en PulseSessionService. */
@Injectable({ providedIn: 'root' })
export class PulseApiService {
  private readonly session = inject(PulseSessionService);

  join(inviteCode: string, name: string, roleLabel: string | undefined, consent: ConsentChoice): Promise<JoinResponse> {
    return this.post(`${API}/join`, { inviteCode, name, roleLabel, consent }, false);
  }

  /** Inscripción abierta del onboarding web. Idempotente por email. */
  register(input: {
    name: string;
    email: string;
    age: number;
    area: string;
    consent: ConsentChoice;
  }): Promise<JoinResponse & { returning: boolean }> {
    return this.post(`${API}/register`, input, false);
  }

  saveDeclared(declared: { portal?: string; area?: string; ageBand?: string; perfil?: Perfil }) {
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

  /** @param since instantánea A contra la que se muestra qué cambió. */
  report(since?: string | null): Promise<PulseReport> {
    return this.get(`${API}/me/report${since ? `?since=${encodeURIComponent(since)}` : ''}`);
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

  /** CV (base64) y enlaces profesionales, con su autorización propia. */
  saveCv(input: { consent: boolean; cv?: { filename: string; mime: string; base64: string }; links: string[] }) {
    return this.post<{ saved: number; cv: boolean; links: number }>(`${API}/me/cv`, input);
  }

  complete(archetype?: string) {
    return this.post(`${API}/complete`, { archetype });
  }

  // ── Vista de investigación ──────────────────────────────────────────────

  adminMembers(code: string): Promise<MemberRow[]> {
    return this.get(`${API}/admin/members`, code);
  }

  /** Retira a una persona con todos sus datos (D.A.L.A., CV, enlaces y ficha). */
  async adminRemoveMember(code: string, memberId: string): Promise<{ removed: boolean; events: number }> {
    const response = await fetch(`${API}/admin/members/${memberId}`, { method: 'DELETE', headers: { 'X-Team-Admin-Code': code } });
    if (!response.ok) throw new Error(`request_failed_${response.status}`);
    return response.json();
  }

  adminReport(code: string, memberId: string): Promise<PulseReport> {
    return this.get(`${API}/admin/members/${memberId}/report`, code);
  }

  adminTrace(code: string, memberId: string, claimKey: string): Promise<TraceResult> {
    return this.get(`${API}/admin/members/${memberId}/claims/${encodeURIComponent(claimKey)}/trace`, code);
  }

  adminDocuments(code: string, memberId: string): Promise<ProfileDocument[]> {
    return this.get(`${API}/admin/members/${memberId}/documents`, code);
  }

  async adminDocumentBlob(code: string, memberId: string, documentId: string): Promise<Blob> {
    const response = await fetch(`${API}/admin/members/${memberId}/documents/${documentId}`, { headers: { 'X-Team-Admin-Code': code } });
    if (!response.ok) throw new Error(`request_failed_${response.status}`);
    return response.blob();
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
