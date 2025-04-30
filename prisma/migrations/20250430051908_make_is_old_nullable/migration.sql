-- AlterTable
ALTER TABLE "nail_polish" ALTER COLUMN "is_old" DROP NOT NULL,
ALTER COLUMN "is_old" DROP DEFAULT;

-- Update existing records
UPDATE "nail_polish" SET "is_old" = NULL;
