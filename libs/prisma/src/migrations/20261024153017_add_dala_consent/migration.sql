-- CreateTable
CREATE TABLE "auth"."dala_consent" (
    "consent_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "scope" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "dala_consent_pkey" PRIMARY KEY ("consent_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dala_consent_user_id_scope_version_key" ON "auth"."dala_consent"("user_id", "scope", "version");

-- AddForeignKey
ALTER TABLE "auth"."dala_consent" ADD CONSTRAINT "dala_consent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
