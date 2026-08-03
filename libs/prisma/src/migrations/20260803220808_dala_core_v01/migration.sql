-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dala";

-- CreateTable
CREATE TABLE "dala"."instrument" (
    "instrument_id" TEXT NOT NULL,
    "instrument_version" TEXT NOT NULL,
    "description" TEXT,
    "payload_schema" JSONB,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instrument_pkey" PRIMARY KEY ("instrument_id")
);

-- CreateTable
CREATE TABLE "dala"."behavior_event" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "subject_id" VARCHAR(64) NOT NULL,
    "session_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "sequence" INTEGER NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instrument_id" VARCHAR(100) NOT NULL,
    "instrument_version" VARCHAR(20) NOT NULL,
    "schema_version" VARCHAR(40) NOT NULL,
    "context_json" JSONB NOT NULL,
    "payload_json" JSONB NOT NULL,
    "consent_scope" VARCHAR(64) NOT NULL,
    "research_allowed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "behavior_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dala"."evidence_observation" (
    "observation_id" UUID NOT NULL,
    "subject_id" VARCHAR(64) NOT NULL,
    "session_id" UUID NOT NULL,
    "source_event_id" UUID NOT NULL,
    "rule_id" VARCHAR(80) NOT NULL,
    "rule_version" VARCHAR(20) NOT NULL,
    "construct_id" VARCHAR(50) NOT NULL,
    "kind" VARCHAR(30) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "confidence_contribution" DOUBLE PRECISION NOT NULL,
    "observed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_observation_pkey" PRIMARY KEY ("observation_id")
);

-- CreateTable
CREATE TABLE "dala"."construct_estimate" (
    "id" UUID NOT NULL,
    "subject_id" VARCHAR(64) NOT NULL,
    "construct_id" VARCHAR(50) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "stability" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "uncertainty" JSONB NOT NULL,
    "evidence_count" INTEGER NOT NULL,
    "evidence_refs" JSONB NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "model_version" VARCHAR(40) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "construct_estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dala"."human_state_snapshot" (
    "snapshot_id" UUID NOT NULL,
    "subject_id" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state_json" JSONB NOT NULL,
    "source_event_from" UUID NOT NULL,
    "source_event_to" UUID NOT NULL,
    "model_version" VARCHAR(40) NOT NULL,

    CONSTRAINT "human_state_snapshot_pkey" PRIMARY KEY ("snapshot_id")
);

-- CreateTable
CREATE TABLE "dala"."decision_record" (
    "decision_id" UUID NOT NULL,
    "subject_id" VARCHAR(64) NOT NULL,
    "objective" TEXT NOT NULL,
    "candidate_actions" JSONB NOT NULL,
    "selected_action" VARCHAR(30) NOT NULL,
    "reasons" JSONB NOT NULL,
    "state_snapshot_id" UUID NOT NULL,
    "policy_version" VARCHAR(40) NOT NULL,
    "model_version" VARCHAR(40) NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "requires_human_approval" BOOLEAN NOT NULL DEFAULT true,
    "expected_outcome" JSONB,
    "human_verdict" VARCHAR(20),
    "human_verdict_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_record_pkey" PRIMARY KEY ("decision_id")
);

-- CreateTable
CREATE TABLE "dala"."outcome" (
    "outcome_id" UUID NOT NULL,
    "decision_id" UUID NOT NULL,
    "intervention_id" VARCHAR(100) NOT NULL,
    "subject_id" VARCHAR(64) NOT NULL,
    "metrics" JSONB NOT NULL,
    "observed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outcome_pkey" PRIMARY KEY ("outcome_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_instrument_version" ON "dala"."instrument"("instrument_id", "instrument_version");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_event_event_id_key" ON "dala"."behavior_event"("event_id");

-- CreateIndex
CREATE INDEX "behavior_event_subject_id_occurred_at_idx" ON "dala"."behavior_event"("subject_id", "occurred_at");

-- CreateIndex
CREATE INDEX "behavior_event_instrument_id_instrument_version_idx" ON "dala"."behavior_event"("instrument_id", "instrument_version");

-- CreateIndex
CREATE UNIQUE INDEX "uq_session_sequence" ON "dala"."behavior_event"("session_id", "sequence");

-- CreateIndex
CREATE INDEX "evidence_observation_subject_id_construct_id_idx" ON "dala"."evidence_observation"("subject_id", "construct_id");

-- CreateIndex
CREATE INDEX "evidence_observation_source_event_id_idx" ON "dala"."evidence_observation"("source_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_subject_construct" ON "dala"."construct_estimate"("subject_id", "construct_id");

-- CreateIndex
CREATE INDEX "human_state_snapshot_subject_id_created_at_idx" ON "dala"."human_state_snapshot"("subject_id", "created_at");

-- CreateIndex
CREATE INDEX "decision_record_subject_id_created_at_idx" ON "dala"."decision_record"("subject_id", "created_at");

-- CreateIndex
CREATE INDEX "outcome_decision_id_idx" ON "dala"."outcome"("decision_id");
