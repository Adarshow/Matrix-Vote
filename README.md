# Matrix Vote: Online Voting Platform

## 📋 Project Overview

A secure, production-ready online voting platform built for the White Matrix Internship Machine Test (December 2025). This platform enables authenticated users to vote for their preferred candidate exactly once, with real-time results and comprehensive voter tracking.

## ✨ Features

### Core Functionality
- **Secure Authentication**
  - Email/Password login with bcrypt hashing
  - Google OAuth integration
  - LinkedIn OAuth integration
  - Forgot password flow
  - JWT session strategy with NextAuth.js

- **Voting System**
  - One vote per user (enforced at database level)
  - Two candidates with profiles
  - Vote confirmation modal
  - Cannot change vote after submission
  - Real-time vote counting

- **Results Dashboard**
  - Live vote count updates (every 5 seconds)
  - Visual progress bars with percentages
  - Current leader display 
  - Complete voters list with LinkedIn links
  - Vote timestamp tracking

### Additional Features
- **Dark Mode** - System-aware theme toggle
- **Responsive Design** - Mobile-first approach
- **Loading States** - Skeleton loaders for better UX
- **Professional UI** - Clean design using shadcn/ui components
- **LinkedIn Integration** - Clickable LinkedIn profiles for candidates and voters

### Admin Dashboard
- **Secure Admin Portal** - Separate JWT-based authentication
- **Candidate Management** - Full CRUD operations (Create, Read, Update, Delete)
- **Archive System** - Soft delete candidates with restore functionality
- **Analytics Dashboard** - Real-time voting statistics and charts
  - Voting trend visualization (Line chart)
  - Top candidates comparison (Bar chart)
  - Voter engagement metrics (Doughnut chart)
- **User Management** - View all registered users with LinkedIn profiles
- **Voting Deadline** - Set and manage voting closing date/time
- **Countdown Timer** - Display voting deadline across all pages
- **PDF Reports** - Generate comprehensive voting analytics reports
- **Password Management** - Change admin password securely

## 🛠️ Tech Stack

### Frontend + Backend
- **Next.js 14** (App Router)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality React components
- **Chart.js** - Data visualization for analytics
- **jsPDF** - PDF report generation

### Authentication
- **NextAuth.js v4** - Complete auth solution
- **Google OAuth** - Sign in with Google
- **LinkedIn OAuth** - Sign in with LinkedIn
- **bcryptjs** - Password hashing
- **jose** - JWT signing and verification for admin auth

### Email Functionality
- **Forgot Password Implementation**
  - Users can reset their passwords using the "Forgot Password" feature.
  - The platform uses Gmail SMTP to send password reset emails securely.
  - The reset link is valid for a limited time to ensure security.

  - **OTP Verification for Registration**
  - During registration, users receive a One-Time Password (OTP) via email.
  - Gmail SMTP is used to send the OTP securely.
  - The OTP must be entered within a specific time frame to complete registration.

### Database
- **PostgreSQL** - Production database
- **Prisma ORM** - Type-safe database client
- **Database Level Constraints** - Prevent duplicate votes

### Deployment
- **Vercel Ready** - Optimized for deployment
- **Docker Support** - Full containerization with docker-compose
- **Environment Variables** - Secure configuration
- **Database Options** - Supabase, Neon, Railway compatible

## 📁 Project Structure

```
white-matrix-voting/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── forgot-password/route.ts
│   │   │   ├── reset-password/route.ts
│   │   │   ├── send-otp/route.ts
│   │   │   └── verify-otp/route.ts
│   │   ├── admin/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── verify/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   ├── candidates/route.ts
│   │   │   ├── users/route.ts
│   │   │   ├── voting-settings/route.ts
│   │   │   └── change-password/route.ts
│   │   ├── candidates/route.ts
│   │   ├── vote/route.ts
│   │   ├── voters/route.ts
│   │   └── user/update-linkedin/route.ts
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   └── login/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── complete-profile/page.tsx
│   ├── vote/page.tsx
│   ├── results/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── label.tsx
│   │   ├── dialog.tsx
│   │   ├── skeleton.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── alert.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── countdown-timer.tsx
│   ├── providers.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── otpstore.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   ├── seed-admin.js
│   └── migrations/
│       ├── 000_init/migration.sql
│       └── 001_add_admin_and_voting_settings/migration.sql
├── middleware.ts
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```
│   ├── providers.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 🚀 Getting Started

### Choose Your Setup Method

#### Option 1: Docker (Recommended for Quick Start)

The easiest way to get started - automated setup script:

**Windows (PowerShell):**
```powershell
.\docker-start.ps1
```

**Linux/Mac:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

**Or manually:**
```bash
# 1. Copy environment file
cp .env.docker .env

# 2. Edit .env with your values
# 3. Start everything with one command
docker-compose up -d
# or: npm run docker:up

# 4. Create admin user
docker-compose exec app npm run admin:seed

# Access at http://localhost:3000
```

See [DOCKER.md](DOCKER.md) for complete Docker documentation.

#### Option 2: Automated Local Setup (Windows)

**Quick Setup Wizard:**
```powershell
.\setup.ps1
```

This interactive wizard will guide you through the entire setup process including:
- Environment configuration
- Dependency installation
- Database schema creation
- Optional candidate seeding
- Optional admin user creation

#### Option 3: Manual Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google OAuth credentials (optional)
- LinkedIn OAuth credentials (optional)
- Gmail Credentials
  How to get a Gmail App Password:
    1. Go to your Google Account settings
    2. Enable 2-Step Verification if not already enabled
    3. Visit https://myaccount.google.com/apppasswords
    4. Select "Mail" and "Other (Custom name)", enter "White Matrix"
    5. Copy the 16-character password (no spaces)
    6. Paste it as GMAIL_PASS in .env

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd "PROJECT ROOT FOLDER"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/voting_db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Optional OAuth (leave empty if not using)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   LINKEDIN_CLIENT_ID=""
   LINKEDIN_CLIENT_SECRET=""
   GMAIL_USER=
   GMAIL_PASS=
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Create database tables (migrations will run automatically)
   npx prisma db push
   
   # OR run migrations manually
   npx prisma migrate deploy
   
   # Seed candidates (optional - add your own candidates)
   npm run db:seed
   
   # Create admin user
   npm run admin:seed
   ```
   
   **Default Admin Credentials:**
   - Email: `admin@whitematrix.com`
   - Password: `admin123`
   
   ⚠️ **IMPORTANT**: Change the admin password immediately after first login!

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 OAuth Setup (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### LinkedIn OAuth
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URL: `http://localhost:3000/api/auth/callback/linkedin`
4. Request access to OpenID Connect
5. Copy Client ID and Client Secret to `.env`

## 🔧 Admin Setup for Production

When deploying to production (Vercel, Netlify, etc.), you'll need to create the admin user in your cloud database:

### Option 1: Using Local Environment (Recommended)
1. Temporarily update your local `.env` with production DATABASE_URL
2. Run: `npm run admin:seed`
3. Revert `.env` back to local database

### Option 2: Using Database SQL Editor (Supabase/Neon/etc.)
Run this SQL in your database SQL editor:

```sql
-- Create Admin table (if not exists from migrations)
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

-- Create VotingSettings table (if not exists from migrations)
CREATE TABLE IF NOT EXISTS "VotingSettings" (
    "id" TEXT NOT NULL,
    "votingDeadline" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VotingSettings_pkey" PRIMARY KEY ("id")
);

-- Insert default admin (password is bcrypt hash of 'admin123')
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

⚠️ **Change this password immediately after first login using the Change Password feature!**

### Changing Admin Password
To generate a custom bcrypt hash for your password:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your_secure_password';
bcrypt.hash(password, 10, (err, hash) => {
  console.log(hash);
});
```

Then update the password in your database:
```sql
UPDATE "Admin" 
SET password = 'your_bcrypt_hash_here'
WHERE email = 'admin@whitematrix.com';
```

## 📊 Database Schema

### User Model
- Stores user authentication data
- Tracks voting status (`hasVoted`)
- Links to LinkedIn profile
- Supports multiple auth providers

### Candidate Model
- Stores candidate information
- Tracks vote count
- Includes LinkedIn profile link
- Archive support (`isArchived`, `archivedAt`)

### Vote Model
- Enforces one vote per user (unique constraint on `userId`)
- Links user to candidate
- Records vote timestamp

### Admin Model
- Separate authentication for admin users
- Stores admin credentials (bcrypt hashed)
- Tracks login activity (`lastLoginAt`)

### VotingSettings Model
- Manages voting deadline
- Single record to store global settings
- Supports optional deadline (nullable)

## 🎯 Usage Flow

### For Voters
1. **Register/Login**
   - User creates account or signs in
   - OAuth options available (Google/LinkedIn)
   - OTP verification for email registration

2. **Vote**
   - View candidates with profiles
   - See countdown timer if voting deadline is set
   - Click "Vote" button
   - Confirm vote in modal dialog
   - Vote is recorded (one-time only)

3. **Results**
   - Automatic redirect after voting
   - View live vote counts
   - See all voters with LinkedIn links
   - Updates every 5 seconds

### For Administrators
1. **Admin Login**
   - Access admin portal at `/admin/login`
   - Use admin credentials (separate from user accounts)

2. **Dashboard**
   - View comprehensive analytics with charts
   - Monitor real-time voting statistics
   - See voter demographics and trends

3. **Candidate Management**
   - Add new candidates with details and LinkedIn URLs
   - Edit existing candidate information
   - Archive candidates (soft delete)
   - Restore archived candidates
   - Permanently delete archived candidates

4. **Voting Control**
   - Set voting deadline with date/time picker
   - Clear deadline to allow indefinite voting
   - Countdown displays automatically on all pages

5. **Reports**
   - Generate PDF reports with complete analytics
   - Export includes candidate results, voter data, and trends

6. **Security**
   - Change admin password via Change Password API
   - Secure logout with token invalidation

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT session tokens
- Protected API routes
- Database-level unique constraints
- Input validation with Zod
- CSRF protection via NextAuth
- Secure environment variables

## 🎨 UI/UX Features

- Clean, professional design
- Dark mode support
- Responsive on all devices
- Loading skeletons
- Confirmation modals
- Real-time updates
- Error handling
- Success feedback


## 📄 License

This project is created for the White Matrix Internship Machine Test (December 2025).

## 👤 Author

Developed as a complete, production-ready submission demonstrating:
- Full-stack development skills
- Clean code architecture
- Security best practices
- Professional UI/UX design
- Database design proficiency
- OAuth integration
- Deployment readiness

---

**Built with ❤️ for White Matrix Internship - December 2025**
