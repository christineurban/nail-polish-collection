/*
  Warnings:

  - A unique constraint covering the columns `[brand_id,name]` on the table `nail_polish` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PolishStatus" AS ENUM ('ACTIVE', 'EMPTY', 'DISCONTINUED');

-- AlterTable
ALTER TABLE "nail_polish" ADD COLUMN     "empty_bottles" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "last_used" TIMESTAMPTZ(6),
ADD COLUMN     "status" "PolishStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "total_bottles" SMALLINT NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "nail_polish_brand_id_name_key" ON "nail_polish"("brand_id", "name");
