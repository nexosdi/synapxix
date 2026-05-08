-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "audit";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "communication";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "knowledge";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "psychometrics";

-- CreateEnum
CREATE TYPE "auth"."linkType" AS ENUM ('1', '2', '3', '4');

-- CreateTable
CREATE TABLE "core"."institution" (
    "institution_id" UUID NOT NULL,
    "name" VARCHAR(150),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institution_pkey" PRIMARY KEY ("institution_id")
);

-- CreateTable
CREATE TABLE "core"."structure" (
    "structure_id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "parent_id" UUID,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "structure_pkey" PRIMARY KEY ("structure_id")
);

-- CreateTable
CREATE TABLE "auth"."app_user" (
    "user_id" UUID NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "firstname" VARCHAR(150) NOT NULL,
    "lastname" VARCHAR(150) NOT NULL,
    "role" VARCHAR(150) NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "credits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "core"."economy_transaction" (
    "transaction_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "game_session_id" VARCHAR(150) NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL DEFAULT 'GAME_VICTORY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "economy_transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "auth"."user_link" (
    "link_id" UUID NOT NULL,
    "id_user_from" UUID,
    "id_user_to" UUID,
    "link_type" "auth"."linkType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_link_pkey" PRIMARY KEY ("link_id")
);

-- CreateTable
CREATE TABLE "auth"."user_structure" (
    "user_id" UUID NOT NULL,
    "structure_id" UUID NOT NULL,

    CONSTRAINT "user_structure_pkey" PRIMARY KEY ("user_id","structure_id")
);

-- CreateTable
CREATE TABLE "auth"."session" (
    "session_id" UUID NOT NULL,
    "user_id" UUID,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "psychometrics"."dimension" (
    "dimension_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,

    CONSTRAINT "dimension_pkey" PRIMARY KEY ("dimension_id")
);

-- CreateTable
CREATE TABLE "psychometrics"."archetype" (
    "archetype_id" UUID NOT NULL,
    "dimension_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,

    CONSTRAINT "archetype_pkey" PRIMARY KEY ("archetype_id")
);

-- CreateTable
CREATE TABLE "knowledge"."content" (
    "content_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "prerequisite_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_pkey" PRIMARY KEY ("content_id")
);

-- CreateTable
CREATE TABLE "knowledge"."user_content_progress" (
    "user_id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "progress" DOUBLE PRECISION,
    "last_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_content_progress_pkey" PRIMARY KEY ("user_id","content_id")
);

-- CreateTable
CREATE TABLE "audit"."audit_log" (
    "audit_id" UUID NOT NULL,
    "user_id" UUID,
    "table_name" VARCHAR(100) NOT NULL,
    "record_id" UUID,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "communication"."notification" (
    "notification_id" UUID NOT NULL,
    "user_id" UUID,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "economy_transaction_game_session_id_key" ON "core"."economy_transaction"("game_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_link_id_user_from_id_user_to_link_type_key" ON "auth"."user_link"("id_user_from", "id_user_to", "link_type");

-- AddForeignKey
ALTER TABLE "core"."structure" ADD CONSTRAINT "structure_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "core"."institution"("institution_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."structure" ADD CONSTRAINT "structure_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "core"."structure"("structure_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."economy_transaction" ADD CONSTRAINT "economy_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_link" ADD CONSTRAINT "user_link_id_user_from_fkey" FOREIGN KEY ("id_user_from") REFERENCES "auth"."app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_link" ADD CONSTRAINT "user_link_id_user_to_fkey" FOREIGN KEY ("id_user_to") REFERENCES "auth"."app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_structure" ADD CONSTRAINT "user_structure_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "core"."structure"("structure_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_structure" ADD CONSTRAINT "user_structure_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psychometrics"."archetype" ADD CONSTRAINT "archetype_dimension_id_fkey" FOREIGN KEY ("dimension_id") REFERENCES "psychometrics"."dimension"("dimension_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge"."content" ADD CONSTRAINT "content_prerequisite_id_fkey" FOREIGN KEY ("prerequisite_id") REFERENCES "knowledge"."content"("content_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge"."user_content_progress" ADD CONSTRAINT "user_content_progress_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "knowledge"."content"("content_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge"."user_content_progress" ADD CONSTRAINT "user_content_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication"."notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
