-- Documentos profesionales del Primer Pulso (CV y enlaces), separados de D.A.L.A.
CREATE TABLE "core"."team_document" (
    "document_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "kind" VARCHAR(20) NOT NULL,
    "filename" VARCHAR(200),
    "mime" VARCHAR(120),
    "size" INTEGER,
    "data" BYTEA,
    "url" VARCHAR(500),
    "consent_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_document_pkey" PRIMARY KEY ("document_id")
);

CREATE INDEX "team_document_member_id_idx" ON "core"."team_document"("member_id");
