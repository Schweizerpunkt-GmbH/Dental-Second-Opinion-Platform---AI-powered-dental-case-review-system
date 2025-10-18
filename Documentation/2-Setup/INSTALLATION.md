# Installation Guide - Dental Second Opinion Platform

Complete step-by-step guide to set up the project locally.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** (recommended: 20+)
  ```bash
  node --version  # Should be v18.0.0 or higher
  ```

- **npm 9+**
  ```bash
  npm --version  # Should be 9.0.0 or higher
  ```

- **PostgreSQL 15+** (for local development)
  ```bash
  psql --version  # Should be 15.0 or higher
  ```

- **Git**
  ```bash
  git --version
  ```

---

## 🚀 Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DentalSecondOpinion
```

### 2. Install Dependencies

```bash
npm install
```

This will install all 120+ dependencies (takes 2-3 minutes).

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env  # If .env.example exists
# OR
touch .env
```

See [Environment Variables](./ENVIRONMENT.md) for detailed configuration.

**Minimum required** for local development:

```env
# Database
DATABASE_URL=postgresql://your-username@localhost:5432/dental_db

# Session Secret
SESSION_SECRET=your-super-secret-random-string-here

# Application
PORT=3000
BASE_URL=http://localhost:3000

# Replit (for local dev)
REPLIT_DOMAINS=localhost
REPL_ID=local-dev
```

### 4. Set Up Database

#### Option A: Local PostgreSQL

**Install PostgreSQL** (macOS with Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Create database**:
```bash
createdb dental_db
```

**Update DATABASE_URL** in `.env`:
```env
DATABASE_URL=postgresql://YOUR-USERNAME@localhost:5432/dental_db
```

**Push database schema**:
```bash
npm run db:push
```

#### Option B: Neon Database (Cloud)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Update `.env`:
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```
6. Run migrations:
```bash
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 📦 Detailed Installation Steps

### Step 1: System Setup

#### macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows

1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
3. Install both following the installers

### Step 2: Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd DentalSecondOpinion

# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Environment Configuration

Create `.env` file with all variables:

```env
# ====================================
# DATABASE CONFIGURATION
# ====================================
DATABASE_URL=postgresql://username@localhost:5432/dental_db

# ====================================
# SESSION & SECURITY
# ====================================
SESSION_SECRET=generate-a-random-secret-here-minimum-32-chars

# ====================================
# STRIPE PAYMENT (Optional for testing)
# ====================================
STRIPE_SECRET_KEY=sk_test_your_test_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ====================================
# OBJECT STORAGE (Optional)
# ====================================
DEFAULT_OBJECT_STORAGE_BUCKET_ID=dental-uploads
PUBLIC_OBJECT_SEARCH_PATHS=/public
PRIVATE_OBJECT_DIR=/private

# ====================================
# EMAIL CONFIGURATION (Optional)
# ====================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@dentalsecondopinion.com

# ====================================
# APPLICATION SETTINGS
# ====================================
BASE_URL=http://localhost:3000
PORT=3000
NODE_ENV=development

# ====================================
# REPLIT CONFIGURATION
# ====================================
REPLIT_DOMAINS=localhost
REPL_ID=local-dev
ISSUER_URL=https://replit.com/oidc
```

**Generate a secure SESSION_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Database Setup

```bash
# Create database
createdb dental_db

# Push Drizzle schema to database
npm run db:push

# Verify tables were created
psql dental_db -c "\dt"
```

Expected output:
```
             List of relations
 Schema |    Name     | Type  |   Owner
--------+-------------+-------+------------
 public | aiReports   | table | username
 public | auditLogs   | table | username
 public | cases       | table | username
 public | files       | table | username
 public | humanReviews| table | username
 public | leads       | table | username
 public | payments    | table | username
 public | practices   | table | username
 public | sessions    | table | username
 public | users       | table | username
```

### Step 5: Verify Installation

```bash
# Run type checking
npm run check

# Start dev server
npm run dev
```

Expected output:
```
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts

7:00:00 PM [express] serving on port 3000
```

Visit **http://localhost:3000** - you should see the landing page.

---

## 🐳 Docker Installation (Alternative)

### Using Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: dental_db
      POSTGRES_USER: dental_user
      POSTGRES_PASSWORD: dental_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://dental_user:dental_pass@db:5432/dental_db
      PORT: 3000
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

Run:
```bash
docker-compose up
```

---

## 🔧 Troubleshooting

### Error: `DATABASE_URL must be set`

**Solution**: Add `dotenv/config` to `server/index.ts`:
```typescript
import "dotenv/config";
```

### Error: `EADDRINUSE: address already in use`

**Solution**: Kill process on port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

Or change PORT in `.env`:
```env
PORT=3001
```

### Error: `Cannot find module 'fs/promises'`

**Solution**: Upgrade Node.js to version 18+:
```bash
nvm install 20
nvm use 20
```

### Error: `listen ENOTSUP: operation not supported`

**Solution**: Remove `reusePort: true` from server.listen() in `server/index.ts`.

### Database Connection Fails

**Check PostgreSQL is running**:
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

**Test connection**:
```bash
psql postgresql://username@localhost:5432/dental_db
```

### npm install fails

**Clear cache and reinstall**:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🧪 Verify Installation

### Run Health Checks

```bash
# 1. Check Node.js version
node --version  # Should be v18+

# 2. Check npm version
npm --version  # Should be 9+

# 3. Check database connection
npm run db:push

# 4. Check TypeScript compilation
npm run check

# 5. Start dev server
npm run dev
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Expected: {"status":"ok"}
```

---

## 📚 Next Steps

1. ✅ **Installation complete**
2. 📖 Read [Development Guide](../6-Development/DEVELOPMENT_GUIDE.md)
3. 🔌 Check [API Reference](../4-API/API_REFERENCE.md)
4. 🎨 Review [Code Standards](../6-Development/CODE_STANDARDS.md)
5. 🚀 Start building features!

---

## 🆘 Need Help?

- Check [Troubleshooting](../6-Development/DEVELOPMENT_GUIDE.md#troubleshooting)
- Review [GitHub Issues](https://github.com/your-repo/issues)
- Contact the team

---

**Installation Time**: ~10-15 minutes
**Last Updated**: October 18, 2025
