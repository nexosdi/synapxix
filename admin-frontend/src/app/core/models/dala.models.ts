export interface DalaDecision {
  decision_id: string;
  subject_id: string;
  objective: string;
  candidate_actions: string[];
  selected_action: string;
  reasons: Record<string, any>;
  state_snapshot_id: string;
  policy_version: string;
  model_version: string;
  confidence: number;
  requires_human_approval: boolean;
  expected_outcome?: Record<string, any> | null;
  human_verdict?: string | null;
  human_verdict_reason?: string | null;
  created_at: string;
}

export interface DalaTrace {
  decision: DalaDecision;
  stateSnapshot: Record<string, any>;
  evidence: Array<{
    observationId: string;
    constructId: string;
    rule: string;
    weight: number;
    sourceEventId: string;
    observedAt: string;
  }>;
  outcomes: Record<string, any>[];
}
