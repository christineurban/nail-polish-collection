/*
  Warnings:

  - You are about to drop the column `purchase_year` on the `nail_polish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nail_polish" DROP COLUMN "purchase_year",
ADD COLUMN     "is_old" BOOLEAN NOT NULL DEFAULT false;
