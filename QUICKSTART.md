# ⚡ Quick Start Guide

## For Local Development (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL running locally OR cloud database (Supabase/Neon)

### Option 1: Automated Setup (Recommended)

```powershell
# Run the setup wizard (includes admin setup)
.\setup.ps1
```

This interactive wizard will:
- ✓ Copy .env.example to .env
- ✓ Install dependencies
- ✓ Generate Prisma client
- ✓ Push database schema
- ✓ Optionally seed sample candidates
- ✓ Optionally create admin user

**Admin Credentials (if created):**
- Email: `admin@matrixvote.com`
- Password: `admin123` (change immediately!)
- URL: http://localhost:3000/admin/login

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and add your DATABASE_URL
# For local: postgresql://postgres:password@localhost:5432/voting_db

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Seed candidates
npm run db:seed

# 6. Start development server
npm run dev
```

### Test the Application

1. Open http://localhost:3000
2. Click "Register" 
3. Create account: test@example.com / password123
4. Vote for a candidate
5. View results

## For Quick Demo (No Database)

If you just want to see the code structure:

```bash
npm install
npm run dev
```

Then review the code files without testing functionality.

## OAuth Setup (Optional)

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create OAuth credentials
3. Add to .env:
   ```
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   ```
4. Restart dev server

### LinkedIn OAuth
1. Go to https://linkedin.com/developers
2. Create app and get credentials
3. Add to .env:
   ```
   LINKEDIN_CLIENT_ID=your_id
   LINKEDIN_CLIENT_SECRET=your_secret
   ```
4. Restart dev server

## Project Structure at a Glance

```
white-matrix-voting/
├── app/
│   ├── api/              # Backend API routes
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── forgot-password/  # Password reset
│   ├── vote/            # Voting page
│   └── results/         # Results page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── providers.tsx    # Auth & theme providers
│   └── theme-toggle.tsx # Dark mode toggle
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Database client
│   └── utils.ts         # Utility functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
└── README.md            # Full documentation
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma db push      # Update database schema
npm run db:seed         # Seed candidates

# Utilities
npm run lint            # Run linter
```

## Environment Variables Explained

```env
# Required
DATABASE_URL=          # PostgreSQL connection string
NEXTAUTH_URL=          # Your app URL (http://localhost:3000)
NEXTAUTH_SECRET=       # Random secret (openssl rand -base64 32)

# Optional (OAuth)
GOOGLE_CLIENT_ID=      # Google OAuth credentials
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=    # LinkedIn OAuth credentials
LINKEDIN_CLIENT_SECRET=
```

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Try: `psql -U postgres` to test connection

### OAuth Not Working
- Verify credentials in .env
- Check redirect URLs match
- Restart dev server after changes

### Build Errors
- Delete `.next` folder
- Run `npm install` again
- Clear browser cache

## Next Steps

1. ✅ Review [README.md](README.md) for full documentation
2. ✅ Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details
3. ✅ See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide

## Support

For questions or issues:
- Review the documentation files
- Check error messages in terminal
- Verify environment variables
- Ensure database is accessible

---

**Happy Coding! 🚀**
