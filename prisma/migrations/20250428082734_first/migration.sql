/*
  Warnings:

  - The `rating` column on the `nail_polish` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('A_PLUS', 'A', 'A_MINUS', 'B_PLUS', 'B', 'B_MINUS', 'C_PLUS', 'C', 'C_MINUS', 'D_PLUS', 'D', 'D_MINUS', 'F');

-- AlterTable
ALTER TABLE "nail_polish" DROP COLUMN "rating",
ADD COLUMN     "rating" "Rating";

-- DropEnum
DROP TYPE "rating_enum";
