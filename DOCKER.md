# Docker Deployment Guide

This guide explains how to run the Matrix Vote Voting Platform using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- 4GB+ RAM allocated to Docker

## Quick Start

### 1. Setup Environment Variables

Copy the Docker environment template:

```bash
cp .env.docker .env
```

Edit `.env` and set your values:

```env
# Required
DB_PASSWORD=your_secure_password
NEXTAUTH_SECRET=your_secret_key_from_openssl

# Optional (for OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Required (for OTP & Password Reset)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-16-character-app-password
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

**Get Gmail App Password:**
1. Visit https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification first
3. Create app password for "Mail" → "Other (Matrix Vote)"
4. Copy the 16-character password (no spaces)

### 2. Build and Start

Start all services:

```bash
docker-compose up -d
```

This will:
- Build the Next.js application image
- Start PostgreSQL database
- Run database migrations automatically
- Start the application on http://localhost:3000

### 3. Create Admin User

**Option A: Using the seed script (inside container)**

```bash
docker-compose exec app npm run admin:seed
```

**Option B: Using PostgreSQL directly**

```bash
docker-compose exec postgres psql -U postgres -d voting_db
```

Then run:
```sql
INSERT INTO "Admin" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Admin',
  'admin@matrixvote.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGa676.oa2G0B4PBgy',
  'admin',
  NOW(),
  NOW()
);
\q
```

### 4. Access the Application

- **Main App**: http://localhost:3000
- **Admin Portal**: http://localhost:3000/admin/login
  - Email: `admin@matrixvote.com`
  - Password: `admin123`

⚠️ **Change the default password immediately!**

## Docker Commands

### Start Services
```bash
# Start in background
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up -d app
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Execute Commands in Container
```bash
# Run Prisma commands
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma studio

# Seed database
docker-compose exec app npm run db:seed
docker-compose exec app npm run admin:seed

# Shell access
docker-compose exec app sh
docker-compose exec postgres psql -U postgres -d voting_db
```

### Rebuild After Code Changes
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

### Using Docker Compose on VPS

1. **Setup VPS** (Ubuntu/Debian)
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo apt-get install docker-compose-plugin
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/white-matrix-voting.git
   cd white-matrix-voting
   ```

3. **Configure Environment**
   ```bash
   cp .env.docker .env
   nano .env  # Edit with your production values
   ```

4. **Update docker-compose.yml for production**
   ```yaml
   # Change NEXTAUTH_URL to your domain
   NEXTAUTH_URL: https://yourdomain.com
   ```

5. **Start Services**
   ```bash
   docker-compose up -d
   ```

6. **Setup Nginx Reverse Proxy** (optional)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Using Container Registry

Build and push to Docker Hub:

```bash
# Build for production
docker build -t yourusername/matrixvote-voting:latest .

# Push to Docker Hub
docker login
docker push yourusername/matrixvote-voting:latest

# Pull and run on server
docker pull yourusername/matrixvote-voting:latest
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="your_db_url" \
  -e NEXTAUTH_SECRET="your_secret" \
  yourusername/matrixvote-voting:latest
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker-compose logs app
docker-compose logs postgres
```

### Database Connection Issues

Verify database is running:
```bash
docker-compose ps
docker-compose exec postgres pg_isready -U postgres
```

### Migration Errors

Run migrations manually:
```bash
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma generate
```

### Port Already in Use

Change ports in docker-compose.yml:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### Out of Memory

Increase Docker memory limit:
- Docker Desktop → Settings → Resources → Memory
- Increase to at least 4GB

### Permission Issues

Fix ownership:
```bash
sudo chown -R $USER:$USER .
```

## Development with Docker

### Hot Reload Development Setup

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: voting_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      DATABASE_URL: postgresql://postgres:mysecretpassword@postgres:5432/voting_db
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: dev-secret
    depends_on:
      - postgres
    command: npm run dev

volumes:
  postgres_data:
```

Create `Dockerfile.dev`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

Run development environment:
```bash
docker-compose -f docker-compose.dev.yml up
```

## Data Management

### Backup Database

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres voting_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres voting_db < backup.sql
```

### Access Database

```bash
# Using psql
docker-compose exec postgres psql -U postgres -d voting_db

# Using Prisma Studio
docker-compose exec app npx prisma studio
# Access at http://localhost:5555
```

### Reset Database

```bash
# WARNING: This deletes all data
docker-compose down -v
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
docker-compose exec app npm run admin:seed
```

## Performance Optimization

### Use BuildKit
```bash
DOCKER_BUILDKIT=1 docker-compose build
```

### Multi-platform Builds
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t matrixvote-voting .
```

### Resource Limits
Add to docker-compose.yml:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Security Best Practices

1. **Use secrets for sensitive data**
   ```bash
   docker secret create db_password /path/to/password
   ```

2. **Run as non-root user** (already configured in Dockerfile)

3. **Use specific image versions** (already configured)

4. **Scan images for vulnerabilities**
   ```bash
   docker scan matrixvote-voting
   ```

5. **Keep containers updated**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## Kubernetes Deployment

For Kubernetes deployment, see the example manifests in `/k8s` folder (if needed).

Basic deployment:
```bash
kubectl apply -f k8s/
```

---

For more information:
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Prisma with Docker](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)
