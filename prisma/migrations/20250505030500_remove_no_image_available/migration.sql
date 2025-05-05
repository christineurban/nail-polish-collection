-- First update any records marked as no_image_available to have image_url = 'n/a'
UPDATE "nail_polish"
SET image_url = 'n/a'
WHERE no_image_available = true;

-- Then remove the column and constraint
ALTER TABLE "nail_polish" DROP CONSTRAINT IF EXISTS "image_url_no_image_available_check";
ALTER TABLE "nail_polish" DROP COLUMN "no_image_available";
