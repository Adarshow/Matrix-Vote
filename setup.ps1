# Quick Setup Script for White Matrix Voting Platform
# This script sets up the complete voting platform including admin portal

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "White Matrix Voting Platform - Setup Wizard" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if .env exists
Write-Host "Step 1: Environment Configuration" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit .env file and add your DATABASE_URL" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Install dependencies
Write-Host "Step 2: Installing Dependencies" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Check if DATABASE_URL is set
Write-Host "Step 3: Database Configuration" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray
$envContent = Get-Content ".env" -Raw
if ($envContent -match 'DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/voting_db"') {
    Write-Host "⚠️  WARNING: DATABASE_URL not configured!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update .env file with your PostgreSQL connection string" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Database Options:" -ForegroundColor Cyan
    Write-Host "1. Local PostgreSQL: postgresql://username:password@localhost:5432/voting_db" -ForegroundColor White
    Write-Host "2. Supabase: Get from Supabase project settings" -ForegroundColor White
    Write-Host "3. Neon: Get from Neon dashboard" -ForegroundColor White
    Write-Host "4. Railway: Get from Railway variables" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Setup cancelled. Please configure DATABASE_URL first." -ForegroundColor Yellow
        exit 0
    }
}

# Step 4: Generate Prisma Client
Write-Host ""
Write-Host "Step 4: Generating Prisma Client" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client generated successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Push database schema
Write-Host "Step 5: Setting Up Database Schema" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray
npx prisma db push
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database schema created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push database schema" -ForegroundColor Red
    Write-Host "   Make sure your DATABASE_URL is correct and PostgreSQL is running" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 6: Seed candidates (optional)
Write-Host "Step 6: Seeding Database with Candidates" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray
$seedCandidates = Read-Host "Do you want to seed sample candidates? (y/n)"
if ($seedCandidates -eq "y" -or $seedCandidates -eq "Y") {
    npm run db:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database seeded with sample candidates" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Failed to seed database" -ForegroundColor Yellow
    }
} else {
    Write-Host "⊳ Skipping candidate seeding" -ForegroundColor Gray
}
Write-Host ""

# Step 7: Create admin user
Write-Host "Step 7: Creating Admin User" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray
$createAdmin = Read-Host "Do you want to create the default admin user? (y/n)"
if ($createAdmin -eq "y" -or $createAdmin -eq "Y") {
    npm run admin:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Admin user created successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "Default Admin Credentials:" -ForegroundColor Yellow
        Write-Host "  Email: admin@whitematrix.com" -ForegroundColor White
        Write-Host "  Password: admin123" -ForegroundColor White
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Change this password after first login!" -ForegroundColor Red
    } else {
        Write-Host "⚠️  Failed to create admin user" -ForegroundColor Yellow
    }
} else {
    Write-Host "⊳ Skipping admin user creation" -ForegroundColor Gray
}
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "3. Register a new account to vote" -ForegroundColor White
Write-Host ""
if ($createAdmin -eq "y" -or $createAdmin -eq "Y") {
    Write-Host "👤 Admin Portal:" -ForegroundColor Cyan
    Write-Host "URL: http://localhost:3000/admin/login" -ForegroundColor White
    Write-Host "Email: admin@whitematrix.com" -ForegroundColor White
    Write-Host "Password: admin123 (change immediately!)" -ForegroundColor White
    Write-Host ""
}
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- README.md - General information" -ForegroundColor White
Write-Host "- DEPLOYMENT.md - Deployment guide" -ForegroundColor White
Write-Host "- ADMIN_GUIDE.md - Admin portal usage" -ForegroundColor White
Write-Host "- DOCKER.md - Docker deployment" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Optional Configuration:" -ForegroundColor Cyan
Write-Host "- Add Google OAuth credentials to .env" -ForegroundColor White
Write-Host "- Add LinkedIn OAuth credentials to .env" -ForegroundColor White
Write-Host "- Add Gmail SMTP credentials to .env" -ForegroundColor White
Write-Host ""
