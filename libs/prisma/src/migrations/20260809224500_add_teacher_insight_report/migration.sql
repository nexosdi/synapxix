-- CreateTable
CREATE TABLE "core"."teacher_insight_report" (
    "report_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "student_count" INTEGER NOT NULL DEFAULT 0,
    "active_students" INTEGER NOT NULL DEFAULT 0,
    "metrics_summary" JSONB NOT NULL,
    "report_text" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'GENERATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_insight_report_pkey" PRIMARY KEY ("report_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_insight_report_teacher_id_period_start_period_end_key" ON "core"."teacher_insight_report"("teacher_id", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "teacher_insight_report_teacher_id_created_at_idx" ON "core"."teacher_insight_report"("teacher_id", "created_at");

-- AddForeignKey
ALTER TABLE "core"."teacher_insight_report" ADD CONSTRAINT "teacher_insight_report_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "auth"."app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
