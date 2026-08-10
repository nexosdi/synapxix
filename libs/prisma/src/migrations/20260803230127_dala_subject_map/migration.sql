-- CreateTable
CREATE TABLE "auth"."dala_subject_map" (
    "user_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dala_subject_map_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dala_subject_map_subject_id_key" ON "auth"."dala_subject_map"("subject_id");
