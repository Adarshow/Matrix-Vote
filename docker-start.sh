#!/bin/bash

# White Matrix Voting Platform - Docker Quick Start Script
# This script helps you get started with Docker deployment quickly

set -e

echo "===================================="
echo "White Matrix Voting Platform"
echo "Docker Quick Start"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first:"
    echo "   https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "✓ Docker is installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.docker .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your configuration:"
    echo "   - Set a secure DB_PASSWORD"
    echo "   - Generate NEXTAUTH_SECRET with: openssl rand -base64 32"
    echo "   - Add OAuth credentials (optional)"
    echo ""
    read -p "Press Enter after you've edited .env file to continue..."
else
    echo "✓ .env file already exists"
fi

echo ""
echo "🚀 Starting Docker containers..."
echo ""

# Start Docker Compose
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "📊 Checking container status..."
docker-compose ps

echo ""
echo "🔧 Running database migrations..."
docker-compose exec -T app npx prisma migrate deploy

echo ""
read -p "Do you want to create the default admin user? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "👤 Creating admin user..."
    docker-compose exec -T app npm run admin:seed
    echo ""
    echo "✓ Admin user created!"
    echo ""
    echo "Default Admin Credentials:"
    echo "  Email: admin@whitematrix.com"
    echo "  Password: admin123"
    echo ""
    echo "⚠️  CHANGE THIS PASSWORD IMMEDIATELY!"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📍 Access your application:"
echo "   Main App:     http://localhost:3000"
echo "   Admin Portal: http://localhost:3000/admin/login"
echo ""
echo "📚 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop containers:  docker-compose down"
echo "   Restart:          docker-compose restart"
echo ""
echo "For more information, see DOCKER.md"
echo ""
