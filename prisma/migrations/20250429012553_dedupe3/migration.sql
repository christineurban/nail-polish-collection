/*
  Warnings:

  - A unique constraint covering the columns `[brand_id,name]` on the table `nail_polish` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "nail_polish_brand_id_name_key" ON "nail_polish"("brand_id", "name");
