-- Add title column if it doesn't exist
ALTER TABLE "TravelLog" ADD COLUMN IF NOT EXISTS "title" TEXT DEFAULT 'Untitled Journey' NOT NULL;

-- Drop survivalChances column if it exists
ALTER TABLE "TravelLog" DROP COLUMN IF EXISTS "survivalChances"; 