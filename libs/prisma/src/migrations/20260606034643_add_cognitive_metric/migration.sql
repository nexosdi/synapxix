-- CreateTable
CREATE TABLE "psychometrics"."cognitive_metric" (
    "metric_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "user_id" UUID,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "reaction_time" DOUBLE PRECISION NOT NULL,
    "cognitive_load" DOUBLE PRECISION NOT NULL,
    "memory_retention" DOUBLE PRECISION,
    "attention_span" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cognitive_metric_pkey" PRIMARY KEY ("metric_id")
);

-- AddForeignKey
ALTER TABLE "psychometrics"."cognitive_metric" ADD CONSTRAINT "cognitive_metric_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "core"."game_session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psychometrics"."cognitive_metric" ADD CONSTRAINT "cognitive_metric_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;