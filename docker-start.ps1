# Matrix Vote Voting Platform - Docker Quick Start Script (Windows)
# This script helps you get started with Docker deployment quickly

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Matrix Vote Voting Platform" -ForegroundColor Cyan
Write-Host "Docker Quick Start" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✓ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first:" -ForegroundColor Red
    Write-Host "   https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.docker .env
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please edit .env file with your configuration:" -ForegroundColor Yellow
    Write-Host "   - Set a secure DB_PASSWORD" -ForegroundColor Yellow
    Write-Host "   - Generate NEXTAUTH_SECRET with: openssl rand -base64 32" -ForegroundColor Yellow
    Write-Host "   - Add Gmail credentials for OTP & password reset" -ForegroundColor Yellow
    Write-Host "     Get app password: https://myaccount.google.com/apppasswords" -ForegroundColor Cyan
    Write-Host "   - Add OAuth credentials (optional)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after you've edited .env file to continue"
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting Docker containers..." -ForegroundColor Cyan
Write-Host ""

# Start Docker Compose
docker-compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "📊 Checking container status..." -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🔧 Running database migrations..." -ForegroundColor Cyan
docker-compose exec -T app npx prisma migrate deploy

Write-Host ""
$createAdmin = Read-Host "Do you want to create the default admin user? (y/n)"
if ($createAdmin -eq 'y' -or $createAdmin -eq 'Y') {
    Write-Host "👤 Creating admin user..." -ForegroundColor Cyan
    docker-compose exec -T app npm run admin:seed
    Write-Host ""
    Write-Host "✓ Admin user created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Default Admin Credentials:" -ForegroundColor Yellow
    Write-Host "  Email: admin@matrixvote.com" -ForegroundColor White
    Write-Host "  Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  CHANGE THIS PASSWORD IMMEDIATELY!" -ForegroundColor Red
}

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access your application:" -ForegroundColor Cyan
Write-Host "   Main App:     http://localhost:3000" -ForegroundColor White
Write-Host "   Admin Portal: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "📚 Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs:        docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop containers:  docker-compose down" -ForegroundColor White
Write-Host "   Restart:          docker-compose restart" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see DOCKER.md" -ForegroundColor Yellow
Write-Host ""
