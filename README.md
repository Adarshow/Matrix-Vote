# White Matrix Online Voting Platform

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
  - Current leader display with trophy icon
  - Complete voters list with LinkedIn links
  - Vote timestamp tracking

### Additional Features
- **Dark Mode** - System-aware theme toggle
- **Responsive Design** - Mobile-first approach
- **Loading States** - Skeleton loaders for better UX
- **Professional UI** - Clean design using shadcn/ui components
- **LinkedIn Integration** - Clickable LinkedIn profiles for candidates and voters

## 🛠️ Tech Stack

### Frontend + Backend
- **Next.js 14** (App Router)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality React components

### Authentication
- **NextAuth.js v4** - Complete auth solution
- **Google OAuth** - Sign in with Google
- **LinkedIn OAuth** - Sign in with LinkedIn
- **bcryptjs** - Password hashing

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
- **Environment Variables** - Secure configuration
- **Database Options** - Supabase, Neon, Railway compatible

## 📁 Project Structure

```
white-matrix-voting/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── candidates/route.ts
│   │   ├── vote/route.ts
│   │   └── voters/route.ts
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
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
│   │   └── skeleton.tsx
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

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google OAuth credentials (optional)
- LinkedIn OAuth credentials (optional)

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd "c:\Users\User\Desktop\White Matrix"
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
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Create database tables
   npx prisma db push
   
   # Seed candidates
   npm run db:seed
   ```

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

### Vote Model
- Enforces one vote per user (unique constraint on `userId`)
- Links user to candidate
- Records vote timestamp

## 🎯 Usage Flow

1. **Register/Login**
   - User creates account or signs in
   - OAuth options available (Google/LinkedIn)

2. **Vote**
   - View two candidates with profiles
   - Click "Vote" button
   - Confirm vote in modal dialog
   - Vote is recorded (one-time only)

3. **Results**
   - Automatic redirect after voting
   - View live vote counts
   - See all voters with LinkedIn links
   - Updates every 5 seconds

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

## 📦 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

3. **Set up production database**
   - Use Neon, Supabase, or Railway
   - Update `DATABASE_URL` in Vercel
   - Run migrations: `npx prisma db push`
   - Seed database: `npm run db:seed`

4. **Update OAuth URLs**
   - Add production URLs to Google/LinkedIn OAuth settings
   - Update `NEXTAUTH_URL` to your Vercel domain

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login with credentials
- [ ] Login with Google (if configured)
- [ ] Login with LinkedIn (if configured)
- [ ] Vote for candidate
- [ ] Verify cannot vote twice
- [ ] Check results page
- [ ] Verify LinkedIn links work
- [ ] Test dark mode
- [ ] Test mobile responsiveness
- [ ] Test forgot password flow

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with candidates
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma db push   # Sync schema to database
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check network connectivity

### OAuth Not Working
- Verify Client IDs and Secrets
- Check redirect URLs match exactly
- Ensure OAuth apps are enabled

### Build Errors
- Delete `.next` folder and rebuild
- Run `npm install` again
- Clear node_modules and reinstall

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
