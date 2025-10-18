# System Architecture - Dental Second Opinion Platform

**Last Updated**: October 18, 2025

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS / CLIENTS                         │
│  (Patients, Dentists, Admins via Web Browsers)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React SPA)                       │
│  • React 18 + TypeScript                                     │
│  • Vite Build Tool                                           │
│  • Tailwind CSS + Shadcn UI                                  │
│  • React Query (State Management)                            │
│  • Wouter (Routing)                                          │
│  • i18next (Internationalization)                            │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Express Server)                    │
│  • Node.js + Express                                         │
│  • TypeScript                                                │
│  • Passport.js (Authentication)                              │
│  • Session Management                                        │
│  • API Routes                                                │
└─────┬──────────┬──────────┬──────────┬──────────┬───────────┘
      │          │          │          │          │
      ▼          ▼          ▼          ▼          ▼
┌──────────┐ ┌─────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│PostgreSQL│ │ Stripe  │ │Object  │ │AI      │ │Email     │
│ (Neon)   │ │Payments │ │Storage │ │Service │ │(SMTP)    │
│          │ │         │ │(S3)    │ │(FastAPI│ │          │
│          │ │         │ │        │ │+Ollama)│ │          │
└──────────┘ └─────────┘ └────────┘ └────────┘ └──────────┘
```

---

## 🎯 Architecture Layers

### 1. **Presentation Layer** (Client-Side)

**Technology**: React 18 + TypeScript + Vite

**Responsibilities**:
- User interface rendering
- User interaction handling
- Client-side routing
- Form validation
- State management (React Query)
- Internationalization (DE, EN, FR, IT)

**Key Components**:
```
client/src/
├── pages/           # Route pages
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities
└── i18n/            # Translations
```

### 2. **Application Layer** (Server-Side)

**Technology**: Node.js + Express + TypeScript

**Responsibilities**:
- HTTP request handling
- Business logic
- Authentication & authorization
- Session management
- API endpoint routing
- Data validation
- Error handling

**Key Modules**:
```
server/
├── index.ts         # Server entry point
├── routes.ts        # API route definitions
├── db.ts            # Database connection
├── replitAuth.ts    # Authentication logic
├── aiService.ts     # AI integration
└── emailService.ts  # Email sending
```

### 3. **Data Layer** (Database)

**Technology**: PostgreSQL + Drizzle ORM

**Responsibilities**:
- Data persistence
- Data integrity
- Transactions
- Indexes
- Relationships

**Schema Location**: `shared/schema.ts`

### 4. **Integration Layer** (External Services)

**Integrations**:
- **Stripe** - Payment processing
- **Replit Auth** - OAuth authentication
- **AI Service** - Dental analysis (FastAPI + Ollama)
- **Object Storage** - File storage (S3-compatible)
- **SMTP** - Email notifications

---

## 📊 Data Flow

### Case Upload Flow

```
1. USER uploads dental images
   ↓
2. FRONTEND validates files (size, format)
   ↓
3. POST /api/files/upload-url
   ↓
4. BACKEND generates presigned URL
   ↓
5. FRONTEND uploads directly to Object Storage
   ↓
6. POST /api/files (create file record)
   ↓
7. POST /api/cases (create case)
   ↓
8. DATABASE stores case + file references
```

### Payment Flow

```
1. USER selects product (AI Analysis / Expert Review)
   ↓
2. POST /api/payments/create-checkout
   ↓
3. BACKEND creates Stripe Checkout Session
   ↓
4. USER redirected to Stripe hosted page
   ↓
5. USER completes payment
   ↓
6. STRIPE sends webhook to /api/payments/webhook
   ↓
7. BACKEND verifies webhook signature
   ↓
8. DATABASE updates payment status
   ↓
9. If AI Analysis: Trigger AI processing
```

### AI Analysis Flow

```
1. Payment confirmed for AI Analysis
   ↓
2. BACKEND triggers AI Service (FastAPI)
   ↓
3. AI Service downloads images from Object Storage
   ↓
4. Ollama processes images
   ↓
5. AI generates findings + recommendations
   ↓
6. BACKEND stores AI report in database
   ↓
7. BACKEND generates PDF report
   ↓
8. EMAIL notification sent to user
```

---

## 🔐 Authentication & Authorization

### Authentication Flow (OAuth 2.0 / OpenID Connect)

```
1. User clicks "Login"
   ↓
2. GET /api/login
   ↓
3. Redirect to Replit OAuth
   ↓
4. User authenticates
   ↓
5. Redirect to /api/callback?code=xxx
   ↓
6. Exchange code for tokens
   ↓
7. Create/update user in database
   ↓
8. Create session (stored in PostgreSQL)
   ↓
9. Set session cookie (httpOnly, secure)
   ↓
10. Redirect to dashboard
```

### Session Management

**Storage**: PostgreSQL (via `connect-pg-simple`)

**Session Data**:
```javascript
{
  userId: "user-123",
  claims: { sub, email, ... },
  access_token: "...",
  refresh_token: "...",
  expires_at: 1234567890
}
```

**Session Lifetime**: 7 days

### Authorization (Role-Based Access Control)

**Roles**:
1. **PATIENT** - Upload cases, view own data
2. **DENTIST** - Review assigned cases
3. **ADMIN** - Full system access

**Middleware**:
```typescript
function requireRole(role: string) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
```

---

## 💾 Database Design

### Schema Overview

**10 Tables**:

1. **users** - User accounts
2. **cases** - Dental cases
3. **files** - Uploaded files
4. **aiReports** - AI analysis results
5. **humanReviews** - Dentist reviews
6. **payments** - Payment records
7. **practices** - Dental practices
8. **leads** - Patient leads
9. **auditLogs** - GDPR audit trail
10. **sessions** - User sessions

### Key Relationships

```
users (1) ──── (many) cases
cases (1) ──── (many) files
cases (1) ──── (1) aiReports
cases (1) ──── (1) humanReviews
cases (1) ──── (1) payments
cases (1) ──── (1) leads
practices (1) ──── (many) leads
```

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema.

---

## 🔄 State Management

### Client-Side State

**Technology**: React Query (TanStack Query)

**Strategy**:
- Server state cached by React Query
- Local UI state in React (useState, useContext)
- Form state via React Hook Form

**Cache Configuration**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### Server-Side State

**Session State**: PostgreSQL session store
**Database State**: PostgreSQL via Drizzle ORM

---

## 📡 API Design

### RESTful Principles

- **Resource-based URLs**: `/api/cases/:id`
- **HTTP verbs**: GET (read), POST (create), PATCH (update), DELETE
- **Status codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
- **JSON responses**: All responses in JSON format

### API Structure

```
/api/
├── /auth/              # Authentication
├── /cases/             # Case management
├── /files/             # File operations
├── /payments/          # Payment processing
├── /reviews/           # Dentist reviews
└── /admin/             # Admin operations
```

---

## 🛡️ Security Architecture

### Security Layers

1. **Transport Security**
   - HTTPS only in production
   - TLS 1.2+
   - HSTS headers

2. **Authentication**
   - OAuth 2.0 / OpenID Connect
   - Session-based auth
   - HttpOnly + Secure cookies
   - CSRF protection

3. **Authorization**
   - Role-based access control (RBAC)
   - Permission checks on every endpoint

4. **Data Security**
   - Encrypted at rest (database)
   - Encrypted in transit (HTTPS)
   - SQL injection prevention (parameterized queries)
   - XSS prevention (React escaping)

5. **Audit Logging**
   - All actions logged to `auditLogs` table
   - GDPR compliance

---

## 🚀 Performance Considerations

### Frontend Optimization

- **Code splitting** - Vite automatic chunking
- **Lazy loading** - React.lazy for routes
- **Memoization** - React.memo, useMemo, useCallback
- **Image optimization** - WebP format
- **Bundle size** - Tree shaking via Vite

### Backend Optimization

- **Connection pooling** - Neon database pooling
- **Query optimization** - Drizzle ORM efficient queries
- **Caching** - React Query caching
- **Async operations** - Non-blocking I/O

### Database Optimization

- **Indexes** - On frequently queried columns
- **Query optimization** - Efficient joins
- **Connection pooling** - Limited connections

---

## 📈 Scalability

### Horizontal Scaling

- **Stateless backend** - Sessions in database, not memory
- **Load balancing** - Multiple server instances
- **CDN** - Static asset distribution

### Vertical Scaling

- **Database scaling** - Neon auto-scaling
- **Server resources** - Increase CPU/RAM as needed

---

## 🔍 Monitoring & Observability

### Planned Monitoring

- **Error tracking** - Sentry integration (planned)
- **Performance monitoring** - APM (planned)
- **Uptime monitoring** - Uptime Robot (planned)
- **Log aggregation** - LogTail (planned)

### Current Logging

- Express request logging
- Error logging to console
- Audit logs in database

---

## 🌍 Deployment Architecture

### Current Platform: Replit

```
┌─────────────────────────────────────┐
│         Replit Platform              │
│                                      │
│  ┌────────────────────────────┐    │
│  │   Application Container     │    │
│  │  • Node.js server           │    │
│  │  • Static file serving      │    │
│  │  • Auto-scaling             │    │
│  └────────────────────────────┘    │
│                                      │
│  External Services:                  │
│  • Neon PostgreSQL                   │
│  • Object Storage (S3)               │
│  • Stripe                            │
│  • AI Service (FastAPI)              │
└─────────────────────────────────────┘
```

### Alternative Deployment Options

- **Vercel** - Frontend + Serverless Functions
- **AWS** - EC2 + RDS + S3
- **Docker** - Containerized deployment
- **Kubernetes** - Orchestrated containers

---

## 🔄 CI/CD Pipeline (Planned)

```
Code Push (GitHub)
    ↓
Build & Test
    ↓
Type Check (TypeScript)
    ↓
Run Tests (Vitest)
    ↓
Build Production Bundle
    ↓
Deploy to Staging
    ↓
Automated Tests
    ↓
Manual Approval
    ↓
Deploy to Production
    ↓
Health Check
```

---

## 📦 Third-Party Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Neon Database** | PostgreSQL hosting | Database connection string |
| **Stripe** | Payment processing | Stripe SDK + Webhooks |
| **Replit Auth** | OAuth authentication | OpenID Connect |
| **Object Storage** | File storage | S3-compatible API |
| **AI Service** | Dental analysis | REST API (FastAPI) |
| **SMTP** | Email sending | Nodemailer |

---

## 🎯 Design Principles

1. **Separation of Concerns** - Clear layer boundaries
2. **Single Responsibility** - Each module has one job
3. **Dependency Injection** - Loose coupling
4. **DRY (Don't Repeat Yourself)** - Shared code in `shared/`
5. **Type Safety** - TypeScript throughout
6. **Security First** - Authentication, authorization, audit logging
7. **GDPR Compliant** - Data export, deletion, audit trails

---

## 🔮 Future Enhancements

1. **Microservices** - Split into smaller services
2. **GraphQL** - Alternative to REST API
3. **WebSockets** - Real-time updates
4. **Caching Layer** - Redis for performance
5. **Message Queue** - RabbitMQ/SQS for async tasks
6. **API Gateway** - Centralized API management
7. **Service Mesh** - Advanced networking

---

**See Also**:
- [Database Schema](./DATABASE_SCHEMA.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [API Reference](../4-API/API_REFERENCE.md)

---

**Last Updated**: October 18, 2025
