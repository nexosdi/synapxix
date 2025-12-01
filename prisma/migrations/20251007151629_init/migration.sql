/*
  Warnings:

  - You are about to drop the column `desc` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "desc",
ADD COLUMN     "description" TEXT;
