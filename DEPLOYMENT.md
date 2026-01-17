# Deployment Guide - White Matrix Voting Platform

## Quick Deployment to Vercel + Supabase

### Step 1: Set Up Supabase Database

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up or log in

2. **Create New Project**
   - Click "New Project"
   - Name: `white-matrix-voting`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
   - Click "Create new project"

3. **Get Database URL**
   - Go to Project Settings → Database
   - Find "Connection string" → "URI"
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password
   - Add `?pgbouncer=true&connection_limit=1` at the end

   Example:
   ```
   postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
   ```

### Step 2: Deploy to Vercel

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "White Matrix Voting Platform"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   
   Add these in Vercel project settings:
   
   ```
   DATABASE_URL=your_supabase_connection_string
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=run: openssl rand -base64 32
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Step 3: Initialize Database

1. **Install Prisma CLI locally (if not done)**
   ```bash
   npm install -g prisma
   ```

2. **Set DATABASE_URL locally**
   - Copy your Supabase connection string to `.env`

3. **Push Database Schema**
   ```bash
   npx prisma db push
   ```
   
   Or run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed Candidates (Optional)**
   ```bash
   npm run db:seed
   ```

5. **Create Admin User**
   
   **Option A: Using seed script**
   ```bash
   npm run admin:seed
   ```
   
   **Option B: Using Supabase SQL Editor**
   
   Go to Supabase Dashboard → SQL Editor → New Query:
   
   ```sql
   -- Create Admin table (if migrations didn't run)
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
   
   CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");
   
   -- Create VotingSettings table (if migrations didn't run)
   CREATE TABLE IF NOT EXISTS "VotingSettings" (
       "id" TEXT NOT NULL,
       "votingDeadline" TIMESTAMP(3),
       "updatedAt" TIMESTAMP(3) NOT NULL,
       CONSTRAINT "VotingSettings_pkey" PRIMARY KEY ("id")
   );
   
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
   - URL: `https://your-project.vercel.app/admin/login`
   - Email: `admin@whitematrix.com`
   - Password: `admin123`
   
   ⚠️ **CRITICAL**: Change the password immediately after first login!

### Step 4: Configure OAuth (Optional)

#### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client
4. Add Authorized redirect URI:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```

#### LinkedIn OAuth
1. [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Edit your app
3. Add Authorized redirect URL:
   ```
   https://your-project.vercel.app/api/auth/callback/linkedin
   ```

### Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Register a new account
3. Vote for a candidate
4. Check results page
5. Test OAuth logins
6. Verify dark mode works

## Alternative: Deploy to Railway

### Railway + PostgreSQL

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL**
   - Click "New"
   - Select "Database" → "Add PostgreSQL"
   - Copy the `DATABASE_URL` from Variables tab

4. **Add Environment Variables**
   - Go to your app service
   - Add all environment variables (same as Vercel)

5. **Deploy**
   - Railway will auto-deploy on push

6. **Initialize Database**
   - Use Railway's CLI or connect via connection string
   - Run `npx prisma db push`
   - Run `npm run db:seed`

## Alternative: Neon Database

### Neon (Serverless PostgreSQL)

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up

2. **Create Project**
   - Click "Create Project"
   - Name: `white-matrix-voting`
   - Region: Choose closest

3. **Get Connection String**
   - Copy the connection string
   - Use in Vercel or Railway

## Post-Deployment Checklist

- [ ] Database is seeded with 2 candidates
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] OAuth redirects work (if configured)
- [ ] Can cast a vote
- [ ] Cannot vote twice
- [ ] Results page displays correctly
- [ ] LinkedIn links work
- [ ] Dark mode functions
- [ ] Mobile responsive

## Monitoring & Maintenance

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor performance and traffic

### Database Management
- Use Supabase dashboard for queries
- Monitor database usage
- Set up backups (in Supabase settings)

### Logs
- View logs in Vercel dashboard
- Check for errors or issues

## Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify DATABASE_URL is correct
- Check build logs in Vercel

### Database Connection Issues
- Verify Supabase project is active
- Check connection string format
- Ensure SSL is enabled

### OAuth Errors
- Verify redirect URLs match exactly
- Check OAuth app is not restricted
- Ensure credentials are correct

## Cost Breakdown (Free Tiers)

- **Vercel**: Free for hobby projects
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Railway**: Free tier ($5 credit/month)
- **Neon**: Free tier (3GB storage)

## Support

For issues or questions:
1. Check the main README.md
2. Review Prisma logs
3. Check Vercel deployment logs
4. Verify environment variables

---

**Your White Matrix Voting Platform is now live! 🎉**
