-- CreateEnum
CREATE TYPE "rating_enum" AS ENUM ('A_PLUS', 'A', 'A_MINUS', 'B_PLUS', 'B', 'B_MINUS', 'C_PLUS', 'C', 'C_MINUS', 'D_PLUS', 'D', 'D_MINUS', 'F');

-- CreateTable
CREATE TABLE "nail_polish_colors" (
    "nail_polish_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "color_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "nail_polish_colors_pkey" PRIMARY KEY ("nail_polish_id","color_id")
);

-- CreateTable
CREATE TABLE "nail_polish_finishes" (
    "nail_polish_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finish_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "nail_polish_finishes_pkey" PRIMARY KEY ("nail_polish_id","finish_id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finishes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "finishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nail_polish" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image_url" TEXT,
    "brand_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "link" TEXT,
    "coats" SMALLINT,
    "rating" "rating_enum",
    "notes" TEXT,
    "purchase_year" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "nail_polish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "colors_name_key" ON "colors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "finishes_name_key" ON "finishes"("name");

-- AddForeignKey
ALTER TABLE "nail_polish_colors" ADD CONSTRAINT "nail_polish_colors_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nail_polish_colors" ADD CONSTRAINT "nail_polish_colors_nail_polish_id_fkey" FOREIGN KEY ("nail_polish_id") REFERENCES "nail_polish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nail_polish_finishes" ADD CONSTRAINT "nail_polish_finishes_finish_id_fkey" FOREIGN KEY ("finish_id") REFERENCES "finishes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nail_polish_finishes" ADD CONSTRAINT "nail_polish_finishes_nail_polish_id_fkey" FOREIGN KEY ("nail_polish_id") REFERENCES "nail_polish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nail_polish" ADD CONSTRAINT "nail_polish_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
