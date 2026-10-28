-- CreateTable
CREATE TABLE "psychometrics"."archetype_dimension_weight" (
    "archetype_id" UUID NOT NULL,
    "dimension_id" UUID NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "archetype_dimension_weight_pkey" PRIMARY KEY ("archetype_id","dimension_id")
);

-- AddForeignKey
ALTER TABLE "psychometrics"."archetype_dimension_weight" ADD CONSTRAINT "archetype_dimension_weight_archetype_id_fkey" FOREIGN KEY ("archetype_id") REFERENCES "psychometrics"."archetype"("archetype_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psychometrics"."archetype_dimension_weight" ADD CONSTRAINT "archetype_dimension_weight_dimension_id_fkey" FOREIGN KEY ("dimension_id") REFERENCES "psychometrics"."dimension"("dimension_id") ON DELETE RESTRICT ON UPDATE CASCADE;
