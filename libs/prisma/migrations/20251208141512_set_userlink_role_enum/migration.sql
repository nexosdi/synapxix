/*
  Warnings:

  - Changed the type of `link_type` on the `user_link` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "auth"."Role" AS ENUM ('Manager', 'Teacher', 'Tutor', 'Student');

-- AlterTable
ALTER TABLE "auth"."user_link" DROP COLUMN "link_type",
ADD COLUMN     "link_type" "auth"."Role" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_link_id_user_from_id_user_to_link_type_key" ON "auth"."user_link"("id_user_from", "id_user_to", "link_type");
