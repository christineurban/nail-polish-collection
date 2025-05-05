-- Add check constraint to ensure no_image_available is false when image_url exists
ALTER TABLE "nail_polish" ADD CONSTRAINT "image_url_no_image_available_check"
  CHECK (
    image_url IS NULL OR no_image_available = false
  );
