-- Add linkedinUrl unique constraint to User (if not already exists)
-- Add isArchived and archivedAt to Candidate
ALTER TABLE "Candidate" ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Candidate" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);

-- Add linkedinUrl unique constraint to User (if not already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'User_linkedinUrl_key'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_linkedinUrl_key" UNIQUE ("linkedinUrl");
    END IF;
END $$;

-- CreateTable Admin
CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable VotingSettings
CREATE TABLE IF NOT EXISTS "VotingSettings" (
    "id" TEXT NOT NULL,
    "votingDeadline" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VotingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");
