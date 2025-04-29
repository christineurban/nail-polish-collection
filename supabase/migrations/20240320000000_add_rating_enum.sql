-- Create the rating enum type
CREATE TYPE rating_enum AS ENUM (
  'A_PLUS',
  'A',
  'A_MINUS',
  'B_PLUS',
  'B',
  'B_MINUS',
  'C_PLUS',
  'C',
  'C_MINUS',
  'D_PLUS',
  'D',
  'D_MINUS',
  'F'
);

-- Convert the text column to use the enum type
ALTER TABLE nail_polish
ALTER COLUMN rating TYPE rating_enum
USING rating::rating_enum;

-- If you need to drop the old rating_id column (if it exists)
ALTER TABLE nail_polish
DROP COLUMN IF EXISTS rating_id;
