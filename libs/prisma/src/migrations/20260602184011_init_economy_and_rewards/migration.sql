/*
  Warnings:

  - You are about to drop the column `amount` on the `economy_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `economy_transaction` table. All the data in the column will be lost.
  - Added the required column `credits_awarded` to the `economy_transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `game_session_id` on the `economy_transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "core"."economy_transaction" DROP CONSTRAINT "economy_transaction_user_id_fkey";

-- AlterTable
ALTER TABLE "auth"."app_user" ADD COLUMN     "experience_points" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "core"."economy_transaction" DROP COLUMN "amount",
DROP COLUMN "type",
ADD COLUMN     "credits_awarded" INTEGER NOT NULL,
ADD COLUMN     "reward_type" VARCHAR(50) NOT NULL DEFAULT 'GAME_VICTORY',
ADD COLUMN     "xp_awarded" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "game_session_id",
ADD COLUMN     "game_session_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "core"."game_session" (
    "session_id" UUID NOT NULL,
    "user_id" UUID,
    "history_id" VARCHAR(150) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'playing',
    "category" VARCHAR(50),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "game_session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "core"."game_attempt" (
    "attempt_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "content_id" VARCHAR(150) NOT NULL,
    "game_type" VARCHAR(50) NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "completed_quickly" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_attempt_pkey" PRIMARY KEY ("attempt_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "economy_transaction_game_session_id_key" ON "core"."economy_transaction"("game_session_id");

-- AddForeignKey
ALTER TABLE "core"."economy_transaction" ADD CONSTRAINT "economy_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."economy_transaction" ADD CONSTRAINT "economy_transaction_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "core"."game_session"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."game_session" ADD CONSTRAINT "game_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."app_user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."game_attempt" ADD CONSTRAINT "game_attempt_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "core"."game_session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;
