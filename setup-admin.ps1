# Admin Setup Script for White Matrix Voting Platform
# This script sets up the admin system

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "White Matrix Admin Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Generate Prisma Client
Write-Host "Step 2: Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate Prisma client!" -ForegroundColor Red
    exit 1
}
Write-Host "Prisma client generated successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Push database schema
Write-Host "Step 3: Pushing database schema..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push database schema!" -ForegroundColor Red
    exit 1
}
Write-Host "Database schema updated successfully!" -ForegroundColor Green
Write-Host ""

# Step 4: Seed admin user
Write-Host "Step 4: Creating admin user..." -ForegroundColor Yellow
node prisma/seed-admin.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create admin user!" -ForegroundColor Red
    exit 1
}
Write-Host "Admin user created successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Admin Credentials:" -ForegroundColor Yellow
Write-Host "Email: admin@whitematrix.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Admin Login URL: http://localhost:3000/admin/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Please change the password after first login!" -ForegroundColor Red
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor White
Write-Host ""
