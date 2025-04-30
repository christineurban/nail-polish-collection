/*
  Warnings:

  - You are about to drop the column `status` on the `nail_polish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nail_polish" DROP COLUMN "status";

-- DropEnum
DROP TYPE "PolishStatus";
