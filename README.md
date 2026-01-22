# Matrix Vote: Online Voting Platform

## � Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
  - [Core Functionality](#core-functionality)
  - [Additional Features](#additional-features)
  - [Admin Dashboard](#admin-dashboard)
- [Tech Stack](#️-tech-stack)
  - [Frontend + Backend](#frontend--backend)
  - [Authentication](#authentication)
  - [Email Functionality](#email-functionality)
  - [Database](#database)
  - [Deployment](#deployment)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Docker Setup](#option-1-docker-recommended-for-quick-start)
  - [Automated Local Setup](#option-2-automated-local-setup-windows)
  - [Manual Setup](#option-3-manual-setup)
- [OAuth Setup](#-oauth-setup-optional)
- [Admin Setup for Production](#-admin-setup-for-production)
- [Available Scripts](#-available-scripts)
- [Database Schema](#-database-schema)
- [Usage Flow](#-usage-flow)
  - [For Public Users](#for-public-users-not-logged-in)
  - [For Voters](#for-voters)
  - [For Administrators](#for-administrators)
- [Security Features](#-security-features)
- [UI/UX Features](#-uiux-features)
- [License](#-license)
- [Author](#-author)

---

## �📋 Project Overview

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
- **About Page** - Comprehensive platform information with voting procedure and rules
- **Candidates Page** - Public showcase of all candidates with stats and profiles  
- **Dark Mode** - System-aware theme toggle
- **Responsive Design** - Mobile-first approach
- **Loading States** - Skeleton loaders for better UX
- **Professional UI** - Clean design with custom animated components
- **LinkedIn Integration** - Clickable LinkedIn profiles for candidates and voters
- **Custom Animations** - ShinyText, GlowingEffect, Tubelight Navbar components

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
- **Countdown Timer** - CompactCountdown displays on all public pages
- **PDF Reports** - Generate comprehensive voting analytics reports
- **Password Management** - Change admin password securely

## 🛠️ Tech Stack

### Frontend + Backend
- **Next.js 14.2.18** (App Router)
- **TypeScript 5.6.3** - Type-safe development
- **React 18.3.1** - UI library
- **Tailwind CSS 3.4.15** - Utility-first styling
- **Framer Motion 12.26.2** - Animation library
- **Motion 12.27.0** - Additional animation utilities
- **Radix UI** - Accessible component primitives (Dialog, Label, Tabs)
- **Custom UI Components** - ShinyText, GlowingEffect, TubelightNavbar
- **Chart.js 4.4.1** - Data visualization for analytics
- **react-chartjs-2 5.2.0** - React wrapper for Chart.js
- **jsPDF 2.5.2** - PDF report generation
- **Lucide React 0.460.0** - Icon library

### Authentication
- **NextAuth.js 4.24.10** - Complete auth solution
- **Google OAuth** - Sign in with Google
- **LinkedIn OAuth** - Sign in with LinkedIn  
- **bcryptjs 2.4.3** - Password hashing (10 rounds)
- **jose 5.9.6** - JWT signing and verification for admin auth
- **OTP Verification** - Email-based one-time password for registration
- **Password Reset** - Secure forgot password flow with email tokens

### Email Functionality
- **nodemailer 7.0.12** - SMTP email client
- **Gmail Integration** - Secure email delivery via Gmail SMTP
- **OTP Verification for Registration**
  - One-Time Password sent via email during signup
  - Time-limited OTP validation (stored in memory)
  - Prevents unauthorized registrations
- **Forgot Password Implementation**
  - Password reset link sent via email
  - Secure token-based reset flow
  - Time-limited reset tokens for security

### Database
- **PostgreSQL 15+** - Production-ready relational database
- **Prisma ORM 5.22.0** - Type-safe database client with migrations
- **Database Level Constraints** - Prevent duplicate votes via unique constraint
- **Soft Deletes** - Archive system for candidates (isArchived flag)
- **Connection Pooling** - PgBouncer support for serverless deployments

### Deployment
- **Vercel Ready** - Optimized for Edge deployment with automatic builds
- **Docker Support** - Full containerization with docker-compose (PostgreSQL + App)
- **Environment Variables** - Secure configuration management
- **Database Options** - Supabase, Neon, Railway, PlanetScale compatible
- **CI/CD** - GitHub integration for automated deployments
- **Production Optimized** - Multi-stage Docker builds, image optimization

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
│   │   ├── about-page-flow.tsx
│   │   ├── admin-login-flow.tsx
│   │   ├── button.tsx
│   │   ├── candidates-page-flow.tsx
│   │   ├── card.tsx
│   │   ├── complete-profile-flow.tsx
│   │   ├── dialog.tsx
│   │   ├── forgot-password-flow.tsx
│   │   ├── glowing-effect.tsx
│   │   ├── infinite-grid-background.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── profile-dropdown.tsx
│   │   ├── reset-password-flow.tsx
│   │   ├── results-page-flow.tsx
│   │   ├── shiny-button.tsx
│   │   ├── ShinyText.tsx
│   │   ├── sign-in-flow-1.tsx
│   │   ├── sign-up-flow.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── the-infinite-grid.tsx
│   │   ├── tubelight-navbar.tsx
│   │   └── vote-page-flow.tsx
│   ├── compact-countdown.tsx
│   ├── index.ts
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
├── public/
├── middleware.ts
├── .dockerignore
├── .env.docker
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── docker-start.ps1
├── docker-start.sh
├── next.config.js
├── package.json
├── postcss.config.js
├── setup.ps1
├── tailwind.config.js
├── tsconfig.json
├── DEPLOYMENT.md
├── DOCKER.md
└── README.md
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
- Gmail account with app password (required for OTP & password reset)

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
   
   # Required for OTP verification and password reset
   GMAIL_USER="your-email@gmail.com"
   GMAIL_PASS="your-16-character-app-password"
   ```
   
   **How to get Gmail App Password:**
   1. Go to your Google Account settings
   2. Enable 2-Step Verification if not already enabled
   3. Visit https://myaccount.google.com/apppasswords
   4. Select "Mail" and "Other (Custom name)", enter "Matrix Vote"
   5. Copy the 16-character password (no spaces)
   6. Paste it as GMAIL_PASS in .env

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
   - Email: `admin@matrixvote.com`
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
  'admin@matrixvote.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGa676.oa2G0B4PBgy',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
```

**Default Admin Credentials:**
- Email: `admin@matrixvote.com`
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
WHERE email = 'admin@matrixvote.com';
```

## � Available Scripts

```bash
# Development
npm run dev              # Start development server on localhost:3000
npm run build            # Build production bundle
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run postinstall      # Auto-generates Prisma Client (runs after npm install)
npm run db:push          # Push schema changes to database (no migration)
npm run db:seed          # Seed database with sample candidates
npm run admin:seed       # Create default admin user

# Docker
npm run docker:up        # Start Docker containers
npm run docker:down      # Stop Docker containers  
npm run docker:logs      # View Docker logs
npm run docker:build     # Rebuild and start Docker containers
```

## �📊 Database Schema

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

### For Public Users (Not Logged In)
1. **Landing Page**
   - View platform overview
   - Access About page for detailed information
   - View Candidates page to see all participants
   - See CompactCountdown if voting deadline is set

2. **About Page**
   - Learn about the platform and its features
   - Understand the voting procedure (4 steps)
   - Review voting rules and guidelines
   - Call-to-action to register or view candidates

3. **Candidates Page**
   - Browse all candidates without logging in
   - View candidate profiles and bios
   - See total candidates count and live voting status
   - LinkedIn profiles accessible

### For Voters
1. **Register/Login**
   - User creates account or signs in
   - OAuth options available (Google/LinkedIn)
   - OTP verification for email registration
   - Complete profile with LinkedIn URL

2. **Vote**
   - Dynamic navigation based on vote status
   - View candidates with detailed profiles
   - See countdown timer if voting deadline is set
   - Click "Vote" button
   - Confirm vote in modal dialog
   - Vote is recorded (one-time only)

3. **Results**
   - Automatic redirect after voting
   - View live vote counts with percentages
   - Winner spotlight with glowing effect
   - See all voters with LinkedIn links
   - Live activity feed (most recent votes)
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

- **Password Security**
  - bcrypt hashing with 10 salt rounds
  - Minimum password requirements enforced
  - Secure password reset with time-limited tokens
  
- **Authentication**
  - JWT session tokens via NextAuth.js
  - Separate admin authentication with jose JWT
  - HTTP-only cookies for session management
  - Token expiration and rotation
  
- **API Security**
  - Protected API routes with middleware
  - Role-based access control (admin vs user)
  - Request validation with Zod schemas
  - CSRF protection via NextAuth
  
- **Database Security**
  - Unique constraints prevent duplicate votes
  - SQL injection protection via Prisma ORM
  - Connection string encryption
  - Database-level foreign key constraints
  
- **Application Security**
  - Environment variable isolation
  - Input sanitization on all forms
  - XSS protection via React
  - Rate limiting on sensitive endpoints (OTP, password reset)
  
- **Email Security**
  - App-specific passwords for Gmail
  - Time-limited OTP codes (stored in-memory)
  - Secure password reset tokens
  - No sensitive data in email content

## 🎨 UI/UX Features

- **Modern Design System**
  - Custom animated components (ShinyText, GlowingEffect)
  - Tubelight Navbar with dynamic highlighting
  - Infinite Grid Background animations
  - Consistent color palette with CSS variables
  
- **Responsive Design**
  - Mobile-first approach
  - Breakpoint system (xs, sm, md, lg, xl)
  - Touch-friendly interactions
  - Optimized for all screen sizes
  
- **User Experience**
  - Loading skeletons for better perceived performance
  - Confirmation modals for critical actions
  - Real-time updates without page refresh
  - Success/error feedback with toast notifications
  - Profile dropdown with quick actions
  
- **Accessibility**
  - Radix UI primitives for a11y
  - Keyboard navigation support
  - ARIA labels and roles
  - Semantic HTML structure
  
- **Theme Support**
  - Dark mode with system preference detection
  - Smooth theme transitions
  - Theme toggle in navbar
  - Persistent theme preference
  
- **Visual Feedback**
  - Hover effects and transitions
  - Progress bars with percentages
  - Winner spotlight with glowing effect
  - Live activity feed animations
  - Card hover states with scale effects


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
