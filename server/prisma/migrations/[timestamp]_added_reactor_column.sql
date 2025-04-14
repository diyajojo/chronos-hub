-- First add the column as nullable
ALTER TABLE "Reaction" ADD COLUMN "reactor" TEXT;

-- Update existing rows with a default value
UPDATE "Reaction" SET "reactor" = 'Anonymous';

-- Then make the column required
ALTER TABLE "Reaction" ALTER COLUMN "reactor" SET NOT NULL;
