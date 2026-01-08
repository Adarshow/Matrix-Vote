-- AlterTable
-- Add unique constraint to linkedinUrl column
-- First, handle any duplicate linkedinUrl values by setting them to NULL for duplicates
WITH duplicates AS (
  SELECT linkedinUrl, COUNT(*) as count
  FROM "User"
  WHERE linkedinUrl IS NOT NULL
  GROUP BY linkedinUrl
  HAVING COUNT(*) > 1
)
UPDATE "User"
SET linkedinUrl = NULL
WHERE id IN (
  SELECT u.id
  FROM "User" u
  INNER JOIN duplicates d ON u.linkedinUrl = d.linkedinUrl
  WHERE u.id NOT IN (
    SELECT MIN(id)
    FROM "User"
    WHERE linkedinUrl IN (SELECT linkedinUrl FROM duplicates)
    GROUP BY linkedinUrl
  )
);

-- Now add the unique constraint
CREATE UNIQUE INDEX "User_linkedinUrl_key" ON "User"("linkedinUrl");
