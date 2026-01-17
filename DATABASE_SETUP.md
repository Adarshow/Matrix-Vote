# Database Setup Quick Reference

This file provides SQL commands for setting up the database manually if needed.

## For Fresh Database Setup

If you're setting up the database manually (via Supabase, Neon, or any PostgreSQL provider):

### Option 1: Using Prisma Migrations (Recommended)

```bash
# Generate Prisma Client
npx prisma generate

# Run all migrations
npx prisma migrate deploy

# Or push schema directly
npx prisma db push
```

### Option 2: Manual SQL Execution

Run these SQL commands in your database console in order:

#### 1. Base Migration (000_init)

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "linkedinUrl" TEXT,
    "provider" TEXT,
    "hasVoted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "linkedinUrl" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "Vote_userId_key" ON "Vote"("userId");
CREATE INDEX "Vote_candidateId_idx" ON "Vote"("candidateId");

ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

#### 2. Admin and VotingSettings Migration (001_add_admin_and_voting_settings)

```sql
-- Add isArchived and archivedAt to Candidate
ALTER TABLE "Candidate" ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Candidate" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);

-- Add linkedinUrl unique constraint to User
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
```

#### 3. Create Default Admin User

```sql
-- Insert default admin (password is 'admin123')
INSERT INTO "Admin" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Admin',
  'admin@whitematrix.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGa676.oa2G0B4PBgy',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
```

**Default Admin Credentials:**
- Email: `admin@whitematrix.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change this password immediately after first login!

## Seeding Data

### Seed Candidates (Optional)

After database setup, you can seed sample candidates:

```bash
npm run db:seed
```

Or manually via SQL:

```sql
INSERT INTO "Candidate" (id, name, image, bio, "linkedinUrl", "voteCount", "isArchived", "createdAt")
VALUES 
  (
    gen_random_uuid()::text,
    'Candidate Name 1',
    'https://example.com/image1.jpg',
    'Candidate bio and qualifications',
    'https://linkedin.com/in/candidate1',
    0,
    false,
    NOW()
  ),
  (
    gen_random_uuid()::text,
    'Candidate Name 2',
    'https://example.com/image2.jpg',
    'Candidate bio and qualifications',
    'https://linkedin.com/in/candidate2',
    0,
    false,
    NOW()
  );
```

## Verification

Check if tables were created successfully:

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check Admin table
SELECT * FROM "Admin";

-- Check if VotingSettings table exists
SELECT * FROM "VotingSettings";

-- Check Candidates
SELECT * FROM "Candidate";
```

## Troubleshooting

### Tables Already Exist Error
If you get "table already exists" errors, the tables are already created. You can skip to creating the admin user.

### Permission Denied
Ensure your database user has CREATE privileges:
```sql
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
```

### Foreign Key Constraint Errors
Make sure you run the migrations in order. The base migration (000_init) must run before the admin migration (001_add_admin_and_voting_settings).

### UUID Generation Not Working
Some PostgreSQL installations might not have the UUID extension enabled:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Then use uuid_generate_v4() instead of gen_random_uuid()
```

## Prisma Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Seed database
npm run db:seed

# Seed admin
npm run admin:seed
```

## Production Deployment Checklist

- [ ] Database URL configured in environment variables
- [ ] All migrations run successfully
- [ ] Prisma Client generated
- [ ] Admin user created
- [ ] Default admin password changed
- [ ] Test admin login works
- [ ] Verify all tables exist
- [ ] Check foreign key constraints are in place
- [ ] Seed candidates (if needed)
- [ ] Test voting flow end-to-end

---

For more details, see:
- [README.md](README.md) - General setup instructions
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) - Admin portal usage
