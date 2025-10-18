# Environment Variables - Dental Second Opinion Platform

Complete reference for all environment variables used in the application.

---

## 📋 Environment File Structure

The `.env` file should be placed in the project root directory:

```
DentalSecondOpinion/
├── .env                 ← Create this file
├── .env.example         ← Template (if exists)
├── server/
├── client/
└── ...
```

---

## 🔑 Required Variables

These variables **must** be set for the application to run:

### Database

```env
DATABASE_URL=postgresql://username:password@host:port/database
```

**Description**: PostgreSQL connection string

**Examples**:
- Local: `postgresql://myuser@localhost:5432/dental_db`
- Neon: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

**How to get it**:
1. Local PostgreSQL: `postgresql://$(whoami)@localhost:5432/dental_db`
2. Neon: Sign up at [neon.tech](https://neon.tech) and copy connection string

### Session Security

```env
SESSION_SECRET=your-super-secret-random-string-minimum-32-characters
```

**Description**: Secret key for encrypting session cookies

**How to generate**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example**:
```env
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## ⚙️ Application Settings

```env
# Port the server runs on
PORT=3000

# Base URL of the application
BASE_URL=http://localhost:3000

# Node environment
NODE_ENV=development
```

**Defaults**:
- PORT: `5000` (but use `3000` locally to avoid macOS ControlCenter conflict)
- BASE_URL: `http://localhost:5000`
- NODE_ENV: `development` (auto-set by npm scripts)

---

## 🔐 Authentication (Replit)

```env
# Replit domains (comma-separated)
REPLIT_DOMAINS=localhost

# Replit application ID
REPL_ID=local-dev

# OIDC issuer URL
ISSUER_URL=https://replit.com/oidc
```

**For local development**, use these values as-is.

**For production on Replit**, these are auto-provided by the platform.

---

## 💳 Stripe Payment Integration

### Required for Payments

```env
# Stripe secret key (server-side)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

# Stripe publishable key (client-side)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx

# Webhook secret for verifying Stripe events
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
```

**How to get Stripe keys**:
1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy "Publishable key" and "Secret key"
4. For webhook secret:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/payments/webhook`
   - Copy "Signing secret"

**Test mode vs Live mode**:
- Test keys start with `sk_test_` and `pk_test_`
- Live keys start with `sk_live_` and `pk_live_`

**For local development**, you can use test keys or skip Stripe (payments won't work).

---

## 📧 Email Configuration (Optional)

### SMTP Settings

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@dentalsecondopinion.com
```

**For Gmail**:
1. Enable 2-factor authentication
2. Generate app password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use app password as `SMTP_PASS`

**For other providers**:
| Provider | SMTP_HOST | SMTP_PORT | SMTP_SECURE |
|----------|-----------|-----------|-------------|
| Gmail | smtp.gmail.com | 587 | false |
| Outlook | smtp-mail.outlook.com | 587 | false |
| SendGrid | smtp.sendgrid.net | 587 | false |
| Mailgun | smtp.mailgun.org | 587 | false |

---

## 📦 Object Storage (Optional)

```env
# S3-compatible storage bucket ID
DEFAULT_OBJECT_STORAGE_BUCKET_ID=dental-uploads

# Public object paths
PUBLIC_OBJECT_SEARCH_PATHS=/public

# Private object directory
PRIVATE_OBJECT_DIR=/private
```

**For Replit deployment**, these are auto-configured.

**For local development**, file uploads won't work without S3/MinIO setup.

---

## 🔧 Complete .env Template

Copy this template and fill in your values:

```env
# ====================================
# REQUIRED - DATABASE
# ====================================
DATABASE_URL=postgresql://username@localhost:5432/dental_db

# ====================================
# REQUIRED - SECURITY
# ====================================
SESSION_SECRET=generate-random-string-here

# ====================================
# APPLICATION SETTINGS
# ====================================
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development

# ====================================
# AUTHENTICATION
# ====================================
REPLIT_DOMAINS=localhost
REPL_ID=local-dev
ISSUER_URL=https://replit.com/oidc

# ====================================
# STRIPE PAYMENTS (Optional)
# ====================================
STRIPE_SECRET_KEY=sk_test_your_key_here
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# ====================================
# EMAIL (Optional)
# ====================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@dentalsecondopinion.com

# ====================================
# OBJECT STORAGE (Optional)
# ====================================
DEFAULT_OBJECT_STORAGE_BUCKET_ID=dental-uploads
PUBLIC_OBJECT_SEARCH_PATHS=/public
PRIVATE_OBJECT_DIR=/private
```

---

## 🌍 Environment-Specific Configurations

### Development (.env)

```env
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://username@localhost:5432/dental_db
STRIPE_SECRET_KEY=sk_test_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

### Staging (.env.staging)

```env
NODE_ENV=staging
PORT=3000
BASE_URL=https://staging.dentalsecondopinion.ch
DATABASE_URL=postgresql://user:pass@staging-db.neon.tech/dental_staging
STRIPE_SECRET_KEY=sk_test_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

### Production (.env.production)

```env
NODE_ENV=production
PORT=443
BASE_URL=https://dentalsecondopinion.ch
DATABASE_URL=postgresql://user:pass@prod-db.neon.tech/dental_production
STRIPE_SECRET_KEY=sk_live_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

---

## 🔒 Security Best Practices

### DO ✅
- ✅ Add `.env` to `.gitignore`
- ✅ Use different secrets per environment
- ✅ Rotate secrets regularly
- ✅ Use strong, random SESSION_SECRET
- ✅ Use environment variables, never hardcode secrets

### DON'T ❌
- ❌ Commit `.env` to version control
- ❌ Share `.env` files
- ❌ Use production secrets in development
- ❌ Hardcode API keys in source code
- ❌ Use weak or predictable secrets

---

## 🧪 Testing Environment Variables

### Verify Variables Are Loaded

Create `scripts/check-env.js`:

```javascript
import 'dotenv/config';

const required = [
  'DATABASE_URL',
  'SESSION_SECRET',
];

const optional = [
  'STRIPE_SECRET_KEY',
  'SMTP_USER',
];

console.log('Required Variables:');
required.forEach(key => {
  const value = process.env[key];
  console.log(`  ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
});

console.log('\nOptional Variables:');
optional.forEach(key => {
  const value = process.env[key];
  console.log(`  ${key}: ${value ? '✅ Set' : '⚠️  Not set'}`);
});
```

Run:
```bash
node scripts/check-env.js
```

---

## 🆘 Troubleshooting

### Variables Not Loading

**Problem**: `process.env.XXX` is undefined

**Solution**:
1. Check `.env` file exists in project root
2. Add `import "dotenv/config";` at top of `server/index.ts`
3. Restart dev server

### DATABASE_URL Error

**Problem**: `Error: DATABASE_URL must be set`

**Solution**:
1. Check `.env` has `DATABASE_URL=...`
2. Verify no typos in `.env`
3. Ensure dotenv is loaded before db.ts

### Stripe Errors

**Problem**: `Invalid API Key`

**Solution**:
1. Check STRIPE_SECRET_KEY is set
2. Verify key starts with `sk_test_` or `sk_live_`
3. Check no extra spaces in .env file

---

## 📚 Related Documentation

- [Installation Guide](./INSTALLATION.md)
- [Database Setup](./DATABASE.md)
- [Deployment Guide](../7-Deployment/DEPLOYMENT.md)

---

**Last Updated**: October 18, 2025
