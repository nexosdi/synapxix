import type { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { DALA_EVENT_SCHEMA_VERSION } from '@nexosdi.synapxix/dala/contracts';

// ── IDs fijos ────────────────────────────────────────────────────────────────

export const SUBJECT_ID  = 'subj-00000000-0001';
export const SESSION_ID  = 'sess-00000000-0001';
export const EVENT_ID    = 'evt-00000000-0001';
export const DECISION_ID = 'dec-00000000-0001';
export const SNAPSHOT_ID = 'snap-0000-0001';
export const USER_ID     = '00000000-0000-4000-8000-000000000001';

// ── Evento válido base ────────────────────────────────────────────────────────

export function makeEvent(overrides: Partial<DalaBehaviorEvent> = {}): DalaBehaviorEvent {
  return {
    schemaVersion: DALA_EVENT_SCHEMA_VERSION,
    eventId:       EVENT_ID,
    subjectId:     SUBJECT_ID,
    sessionId:     SESSION_ID,
    occurredAt:    '2026-09-14T20:00:00.000Z',
    sequence:      0,
    eventType:     'task_completed',
    source: {
      applicationId:     'synapxix-web-game',
      instrumentId:      'memory-match',
      instrumentVersion: '1.0.0',
    },
    context: { taskId: 'task-001', difficulty: 0.5 },
    payload: { score: 100 },
    consent: { scopeId: 'consent-v1', researchAllowed: true },
    ...overrides,
  };
}

// ── Decision record simulado ──────────────────────────────────────────────────

export const mockDecision = {
  decision_id:             DECISION_ID,
  subject_id:              SUBJECT_ID,
  objective:               'improve_fluency',
  candidate_actions:       ['repeat_level', 'advance_level'],
  selected_action:         'repeat_level',
  reasons:                 { low_score: true },
  state_snapshot_id:       SNAPSHOT_ID,
  policy_version:          '1.0.0',
  model_version:           '1.0.0',
  confidence:              0.8,
  requires_human_approval: true,
  human_verdict:           null,
  human_verdict_reason:    null,
  expected_outcome:        { metric: 'score' },
  created_at:              new Date('2026-09-14T20:00:00Z'),
};

export const mockSnapshot = {
  snapshot_id:       SNAPSHOT_ID,
  subject_id:        SUBJECT_ID,
  state_json:        { constructs: {} },
  source_event_from: 'none',
  source_event_to:   'none',
  model_version:     '1.0.0',
  created_at:        new Date('2026-09-14T20:00:00Z'),
};
