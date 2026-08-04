-- CreateTable
CREATE TABLE "core"."team_member" (
    "member_id" UUID NOT NULL,
    "invite_code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(120),
    "email" VARCHAR(200),
    "role_label" VARCHAR(120),
    "status" VARCHAR(20) NOT NULL DEFAULT 'invited',
    "declared_json" JSONB,
    "archetype" VARCHAR(40),
    "joined_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("member_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_member_invite_code_key" ON "core"."team_member"("invite_code");

-- CreateIndex
CREATE INDEX "team_member_status_idx" ON "core"."team_member"("status");
