# Quick Setup Script for White Matrix Voting Platform

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "White Matrix Voting Platform - Quick Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host " .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "  IMPORTANT: Edit .env file and add your DATABASE_URL" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host " .env file already exists" -ForegroundColor Green
    Write-Host ""
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host " Dependencies installed" -ForegroundColor Green
} else {
    Write-Host " Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if DATABASE_URL is set
$envContent = Get-Content ".env" -Raw
if ($envContent -match 'DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/voting_db"') {
    Write-Host "  WARNING: DATABASE_URL not configured!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update .env file with your PostgreSQL connection string" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
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

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host " Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host " Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Push database schema
Write-Host "Pushing database schema..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -eq 0) {
    Write-Host " Database schema pushed" -ForegroundColor Green
} else {
    Write-Host " Failed to push database schema" -ForegroundColor Red
    Write-Host "   Make sure your DATABASE_URL is correct and PostgreSQL is running" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Seed database
Write-Host "Seeding database with candidates..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host " Database seeded with 2 candidates" -ForegroundColor Green
} else {
    Write-Host " Failed to seed database" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host " Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "3. Register a new account" -ForegroundColor White
Write-Host "4. Cast your vote!" -ForegroundColor White
Write-Host ""
Write-Host "Optional OAuth Setup:" -ForegroundColor Cyan
Write-Host "- Add Google OAuth credentials to .env" -ForegroundColor White
Write-Host "- Add LinkedIn OAuth credentials to .env" -ForegroundColor White
Write-Host ""
Write-Host "For deployment instructions, see DEPLOYMENT.md" -ForegroundColor Yellow
Write-Host ""
