# Database Schema - Dental Second Opinion Platform

**ORM**: Drizzle ORM
**Database**: PostgreSQL 15
**Schema Location**: `shared/schema.ts`
**Last Updated**: October 18, 2025

---

## 📊 Entity Relationship Diagram

```
┌──────────┐
│  users   │───┐
└──────────┘   │
     │         │
     │ 1:N     │ 1:N
     ▼         ▼
┌──────────┐ ┌───────────────┐
│  cases   │ │ humanReviews  │
└──────────┘ └───────────────┘
     │
     │ 1:N
     ├─────────────────┬─────────────┬──────────┐
     ▼                 ▼             ▼          ▼
┌─────────┐     ┌──────────┐  ┌──────────┐ ┌────────┐
│  files  │     │aiReports │  │ payments │ │ leads  │
└─────────┘     └──────────┘  └──────────┘ └────────┘
                                                 │
                                                 │ N:1
                                                 ▼
                                            ┌──────────┐
                                            │practices │
                                            └──────────┘
```

---

## 📋 Tables Overview

| Table | Records | Purpose |
|-------|---------|---------|
| users | ~1000 | User accounts (patients, dentists, admins) |
| cases | ~500 | Dental cases submitted by patients |
| files | ~2000 | Medical images and documents |
| aiReports | ~300 | AI analysis results |
| humanReviews | ~200 | Dentist professional reviews |
| payments | ~400 | Payment transactions |
| practices | ~50 | Partner dental practices |
| leads | ~100 | Patient leads sent to practices |
| auditLogs | ~5000 | GDPR compliance audit trail |
| sessions | ~200 | User session storage |

---

## 🗂️ Table Schemas

### 1. users

**Purpose**: Store user accounts with role-based access

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  role role_enum NOT NULL DEFAULT 'PATIENT',
  email_verified BOOLEAN NOT NULL DEFAULT false,
  verification_token VARCHAR,
  verification_token_expiry TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Columns**:
- `id` - UUID primary key
- `email` - Unique email address
- `first_name`, `last_name` - User name
- `profile_image_url` - Avatar URL
- `role` - PATIENT | DENTIST | ADMIN
- `email_verified` - Email verification status
- `verification_token` - Email verification token
- `verification_token_expiry` - Token expiry timestamp
- `created_at`, `updated_at` - Audit timestamps

**Indexes**:
- Primary key on `id`
- Unique index on `email`

---

### 2. cases

**Purpose**: Store dental cases submitted by patients

```sql
CREATE TABLE cases (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status case_status_enum NOT NULL DEFAULT 'DRAFT',
  symptoms TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Columns**:
- `id` - UUID primary key
- `user_id` - Foreign key to users table
- `status` - DRAFT | QUEUED | AI_DONE | DOCTOR_ASSIGNED | CLOSED
- `symptoms` - Patient description of symptoms
- `created_at` - Creation timestamp

**Status Flow**:
```
DRAFT → QUEUED → AI_DONE → DOCTOR_ASSIGNED → CLOSED
```

**Foreign Keys**:
- `user_id` → `users.id` (CASCADE DELETE)

---

### 3. files

**Purpose**: Store references to uploaded medical files

```sql
CREATE TABLE files (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  kind file_kind_enum NOT NULL,
  s3_key VARCHAR NOT NULL,
  mime VARCHAR NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Columns**:
- `id` - UUID primary key
- `case_id` - Foreign key to cases table
- `kind` - RX | OPT | DVT | CBCT | OFFER | OTHER
- `s3_key` - Object storage key path
- `mime` - MIME type (e.g., image/jpeg)
- `size` - File size in bytes
- `created_at` - Upload timestamp

**File Types**:
- `RX` - X-ray
- `OPT` - Panoramic X-ray (Orthopantomogram)
- `DVT` - Digital Volume Tomography
- `CBCT` - Cone Beam CT
- `OFFER` - Treatment offer/plan
- `OTHER` - Other documents

**Foreign Keys**:
- `case_id` → `cases.id` (CASCADE DELETE)

---

### 4. aiReports

**Purpose**: Store AI-generated analysis reports

```sql
CREATE TABLE ai_reports (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR NOT NULL UNIQUE REFERENCES cases(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  findings JSONB NOT NULL,
  confidence REAL NOT NULL,
  pdf_s3_key VARCHAR NOT NULL,
  original_price_chf REAL,
  recommended_price_chf REAL,
  potential_savings_chf REAL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Columns**:
- `id` - UUID primary key
- `case_id` - Foreign key to cases (UNIQUE - 1:1 relationship)
- `summary` - Text summary of findings
- `findings` - Detailed findings as JSON
- `confidence` - AI confidence score (0.0 to 1.0)
- `pdf_s3_key` - Generated PDF report location
- `original_price_chf` - Original treatment price
- `recommended_price_chf` - Recommended price
- `potential_savings_chf` - Calculated savings
- `created_at` - Report generation timestamp

**Findings JSON Structure**:
```json
{
  "teeth": [
    {
      "number": 18,
      "condition": "cavity",
      "severity": "moderate",
      "recommendation": "filling"
    }
  ],
  "overall_health": "fair",
  "urgent_issues": []
}
```

**Foreign Keys**:
- `case_id` → `cases.id` (CASCADE DELETE, UNIQUE)

---

### 5. humanReviews

**Purpose**: Store professional dentist reviews

```sql
CREATE TABLE human_reviews (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  dentist_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes TEXT,
  status review_status_enum NOT NULL DEFAULT 'REQUESTED',
  signed_pdf_key VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Columns**:
- `id` - UUID primary key
- `case_id` - Foreign key to cases
- `dentist_id` - Foreign key to users (dentist)
- `notes` - Dentist's review notes
- `status` - REQUESTED | IN_PROGRESS | COMPLETED | REJECTED
- `signed_pdf_key` - Signed PDF report location
- `created_at` - Review request timestamp

**Status Flow**:
```
REQUESTED → IN_PROGRESS → COMPLETED
                       ↘ REJECTED
```

**Foreign Keys**:
- `case_id` → `cases.id` (CASCADE DELETE)
- `dentist_id` → `users.id` (CASCADE DELETE)

---

### 6. payments

**Purpose**: Track payment transactions

```sql
CREATE TABLE payments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  type payment_type_enum NOT NULL,
  amount INTEGER NOT NULL,
  status payment_status_enum NOT NULL DEFAULT 'INIT',
  stripe_sess VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Columns**:
- `id` - UUID primary key
- `case_id` - Foreign key to cases
- `type` - AI | REVIEW | LEAD
- `amount` - Amount in cents (990 = 9.90 CHF)
- `status` - INIT | REQUIRES_ACTION | PAID | FAILED | REFUNDED
- `stripe_sess` - Stripe session ID
- `created_at` - Payment initialization timestamp

**Payment Types**:
- `AI` - AI Analysis (990 cents = 9.90 CHF)
- `REVIEW` - Expert Review (6000 cents = 60 CHF)
- `LEAD` - Lead purchase (variable)

**Status Flow**:
```
INIT → REQUIRES_ACTION → PAID
                      ↘ FAILED
PAID → REFUNDED
```

**Foreign Keys**:
- `case_id` → `cases.id` (CASCADE DELETE)

---

### 7. practices

**Purpose**: Store partner dental practices

```sql
CREATE TABLE practices (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  city VARCHAR,
  country VARCHAR,
  roaadent_org_id VARCHAR,
  lead_fee INTEGER NOT NULL DEFAULT 0
);
```

**Columns**:
- `id` - UUID primary key
- `name` - Practice name
- `city` - City location
- `country` - Country (CH, DE, AT)
- `roaadent_org_id` - Integration ID
- `lead_fee` - Fee per lead in cents

---

### 8. leads

**Purpose**: Track patient leads sent to practices

```sql
CREATE TABLE leads (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  practice_id VARCHAR NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  status lead_status_enum NOT NULL DEFAULT 'CREATED',
  payout_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Columns**:
- `id` - UUID primary key
- `case_id` - Foreign key to cases
- `practice_id` - Foreign key to practices
- `status` - CREATED | SENT | ACCEPTED | DECLINED | PAID
- `payout_cents` - Payout amount to practice
- `created_at` - Lead creation timestamp

**Status Flow**:
```
CREATED → SENT → ACCEPTED → PAID
              ↘ DECLINED
```

**Foreign Keys**:
- `case_id` → `cases.id` (CASCADE DELETE)
- `practice_id` → `practices.id` (CASCADE DELETE)

---

### 9. auditLogs

**Purpose**: GDPR compliance audit trail

```sql
CREATE TABLE audit_logs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id VARCHAR,
  action VARCHAR NOT NULL,
  meta JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Columns**:
- `id` - UUID primary key
- `actor_id` - User ID who performed action (nullable for system actions)
- `action` - Action type (e.g., CASE_CREATED, PAYMENT_COMPLETED)
- `meta` - Additional metadata as JSON
- `created_at` - Action timestamp

**Common Actions**:
- `USER_CREATED`, `USER_UPDATED`, `USER_DELETED`
- `CASE_CREATED`, `CASE_UPDATED`, `CASE_CLAIMED`
- `FILE_UPLOADED`, `FILE_DELETED`
- `PAYMENT_CREATED`, `PAYMENT_COMPLETED`, `PAYMENT_REFUNDED`
- `REVIEW_ASSIGNED`, `REVIEW_COMPLETED`
- `DATA_EXPORTED`, `DATA_DELETED`

---

### 10. sessions

**Purpose**: Store user sessions for authentication

```sql
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IDX_session_expire ON sessions(expire);
```

**Columns**:
- `sid` - Session ID (primary key)
- `sess` - Session data as JSON
- `expire` - Session expiry timestamp

**Indexes**:
- Primary key on `sid`
- Index on `expire` for cleanup

---

## 🔗 Relationships

```typescript
users (1) ───── (N) cases
users (1) ───── (N) humanReviews (as dentist)
cases (1) ───── (N) files
cases (1) ───── (1) aiReports
cases (1) ───── (N) humanReviews
cases (1) ───── (N) payments
cases (1) ───── (N) leads
practices (1) ─── (N) leads
```

---

## 🎯 Enums

### role_enum
```sql
CREATE TYPE role AS ENUM ('PATIENT', 'DENTIST', 'ADMIN');
```

### case_status_enum
```sql
CREATE TYPE case_status AS ENUM ('DRAFT', 'QUEUED', 'AI_DONE', 'DOCTOR_ASSIGNED', 'CLOSED');
```

### file_kind_enum
```sql
CREATE TYPE file_kind AS ENUM ('RX', 'OPT', 'DVT', 'CBCT', 'OFFER', 'OTHER');
```

### review_status_enum
```sql
CREATE TYPE review_status AS ENUM ('REQUESTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');
```

### payment_type_enum
```sql
CREATE TYPE payment_type AS ENUM ('AI', 'REVIEW', 'LEAD');
```

### payment_status_enum
```sql
CREATE TYPE payment_status AS ENUM ('INIT', 'REQUIRES_ACTION', 'PAID', 'FAILED', 'REFUNDED');
```

### lead_status_enum
```sql
CREATE TYPE lead_status AS ENUM ('CREATED', 'SENT', 'ACCEPTED', 'DECLINED', 'PAID');
```

---

## 🔍 Common Queries

### Get user with cases
```typescript
const userWithCases = await db
  .select()
  .from(users)
  .leftJoin(cases, eq(users.id, cases.userId))
  .where(eq(users.id, userId));
```

### Get case with all related data
```typescript
const caseData = await db.query.cases.findFirst({
  where: eq(cases.id, caseId),
  with: {
    user: true,
    files: true,
    aiReport: true,
    reviews: {
      with: { dentist: true }
    },
    payments: true,
    leads: {
      with: { practice: true }
    }
  }
});
```

### Get pending reviews for dentist
```typescript
const reviews = await db
  .select()
  .from(humanReviews)
  .where(
    and(
      eq(humanReviews.dentistId, dentistId),
      eq(humanReviews.status, 'REQUESTED')
    )
  );
```

---

## 📈 Indexes

**Automatically created**:
- Primary keys on all tables
- Unique constraints (users.email, aiReports.case_id)
- Foreign key indexes

**Custom indexes**:
- `sessions.expire` - For session cleanup

**Recommended additional indexes** (for optimization):
```sql
CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_files_case_id ON files(case_id);
CREATE INDEX idx_payments_case_id ON payments(case_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

---

## 🛡️ Constraints

### CASCADE DELETE
All foreign keys use `ON DELETE CASCADE`:
- Deleting a user deletes all their cases
- Deleting a case deletes all files, reports, reviews, payments, leads

### NOT NULL
Required fields are marked `NOT NULL`

### DEFAULT VALUES
- All IDs: `gen_random_uuid()`
- Timestamps: `NOW()`
- Status fields: Initial enum values

---

## 🔄 Migrations

Using **Drizzle Kit** for migrations:

```bash
# Generate migration
npx drizzle-kit generate:pg

# Push schema to database
npm run db:push

# View current schema
npx drizzle-kit introspect:pg
```

---

## 📊 Sample Data

### Users
```json
{
  "id": "user-123",
  "email": "patient@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PATIENT",
  "emailVerified": true,
  "createdAt": "2025-10-18T10:00:00Z"
}
```

### Cases
```json
{
  "id": "case-456",
  "userId": "user-123",
  "status": "AI_DONE",
  "symptoms": "Tooth pain on left side",
  "createdAt": "2025-10-18T10:05:00Z"
}
```

---

**See Also**:
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [API Reference](../4-API/API_REFERENCE.md)

---

**Last Updated**: October 18, 2025
