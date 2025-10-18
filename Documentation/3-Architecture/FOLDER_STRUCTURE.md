# Folder Structure - Dental Second Opinion Platform

**Last Updated**: October 18, 2025

---

## 📁 Project Root

\`\`\`
DentalSecondOpinion/
├── client/                   # Frontend React application
├── server/                   # Backend Express server
├── shared/                   # Shared TypeScript types & schemas
├── scripts/                  # Utility scripts
├── Documentation/            # Project documentation
├── public/                   # Static assets
├── attached_assets/          # Additional assets
├── node_modules/             # Dependencies (gitignored)
├── .env                      # Environment variables (gitignored)
├── .git/                     # Git repository
├── package.json              # NPM dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── drizzle.config.ts         # Drizzle ORM configuration
└── README.md                 # Project overview
\`\`\`

---

## 🎨 Frontend Structure (`client/`)

\`\`\`
client/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles
│   ├── i18n.ts               # i18next configuration
│   │
│   ├── pages/                # Route pages (11 pages)
│   │   ├── landing.tsx       # Landing page
│   │   ├── upload.tsx        # Case upload
│   │   ├── case-detail.tsx   # Case details
│   │   ├── dashboard.tsx     # Patient dashboard
│   │   ├── dentist-reviews.tsx  # Dentist review queue
│   │   ├── admin-dashboard.tsx  # Admin panel
│   │   └── ...
│   │
│   ├── components/           # Reusable UI components (56 components)
│   │   ├── ui/               # Shadcn UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── case/             # Case-related components
│   │   │   ├── CaseCard.tsx
│   │   │   ├── CaseUpload.tsx
│   │   │   └── FileViewer.tsx
│   │   ├── DicomViewer.tsx   # Medical image viewer
│   │   ├── StructuredData.tsx # SEO structured data
│   │   └── ...
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth.ts       # Authentication hook
│   │   ├── use-cases.ts      # Case data hook
│   │   └── use-toast.ts      # Toast notifications
│   │
│   ├── lib/                  # Utilities & helpers
│   │   ├── api.ts            # API client
│   │   ├── utils.ts          # General utilities
│   │   └── queryClient.ts    # React Query setup
│   │
│   └── types/                # TypeScript types (client-specific)
│       └── index.ts
│
└── index.html                # HTML template
\`\`\`

---

## ⚙️ Backend Structure (`server/`)

\`\`\`
server/
├── index.ts                  # Server entry point & Express setup
├── routes.ts                 # API route definitions (23 endpoints)
├── db.ts                     # Database connection (Drizzle)
├── vite.ts                   # Vite dev server integration
├── replitAuth.ts             # Authentication (Replit OAuth)
├── aiService.ts              # AI analysis integration
└── emailService.ts           # Email notifications (Nodemailer)
\`\`\`

**Key Files**:
- `index.ts` - Server initialization, middleware setup
- `routes.ts` - All API endpoints
- `db.ts` - Database connection pooling
- `replitAuth.ts` - OAuth flow, session management
- `aiService.ts` - FastAPI + Ollama integration
- `emailService.ts` - SMTP email sending

---

## 🔗 Shared Code (`shared/`)

\`\`\`
shared/
└── schema.ts                 # Database schema & types (Drizzle ORM)
\`\`\`

**Purpose**: Code shared between client & server
- Database table definitions
- TypeScript types
- Validation schemas (Zod)

---

## 📜 Scripts (`scripts/`)

\`\`\`
scripts/
└── auto-doc.js               # Auto-documentation generator
\`\`\`

**Usage**:
\`\`\`bash
node scripts/auto-doc.js         # Generate documentation
node scripts/auto-doc.js --verbose  # With debug logs
\`\`\`

---

## 📚 Documentation (`Documentation/`)

\`\`\`
Documentation/
├── README.md                 # Documentation index
├── DOCUMENTATION_SUMMARY.md  # This summary
│
├── 1-Overview/
│   ├── PROJECT_OVERVIEW.md
│   ├── FEATURES.md (auto-generated)
│   └── TECH_STACK.md
│
├── 2-Setup/
│   ├── INSTALLATION.md
│   ├── ENVIRONMENT.md
│   └── DATABASE.md
│
├── 3-Architecture/
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   └── FOLDER_STRUCTURE.md (this file)
│
├── 4-API/
│   ├── API_REFERENCE.md
│   ├── AUTHENTICATION.md
│   └── WEBHOOKS.md
│
├── 5-Features/
│   ├── CASE_MANAGEMENT.md
│   ├── AI_ANALYSIS.md
│   ├── PAYMENT_SYSTEM.md
│   └── ADMIN_DASHBOARD.md
│
├── 6-Development/
│   ├── DEVELOPMENT_LOG.md (auto-generated)
│   ├── DEVELOPMENT_GUIDE.md
│   ├── CODE_STANDARDS.md
│   └── TESTING.md
│
├── 7-Deployment/
│   ├── DEPLOYMENT.md
│   ├── CICD.md
│   └── MONITORING.md
│
└── 8-Compliance/
    ├── GDPR.md
    ├── SECURITY.md
    └── AUDIT_LOGS.md
\`\`\`

---

## 🌐 Public Assets (`public/`)

\`\`\`
public/
├── locales/                  # i18n translation files
│   ├── de/                   # German
│   │   └── translation.json
│   ├── en/                   # English
│   │   └── translation.json
│   ├── fr/                   # French
│   │   └── translation.json
│   └── it/                   # Italian
│       └── translation.json
├── logo.png                  # Application logo
└── favicon.ico               # Favicon
\`\`\`

---

## 📦 Configuration Files

### TypeScript
- **`tsconfig.json`** - TypeScript compiler options
- **`tsconfig.node.json`** - Node-specific TS config

### Build Tools
- **`vite.config.ts`** - Vite configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`postcss.config.js`** - PostCSS configuration

### Database
- **`drizzle.config.ts`** - Drizzle ORM configuration

### Package Management
- **`package.json`** - Dependencies & scripts
- **`package-lock.json`** - Locked dependency versions

---

## 🚫 Ignored Files (`.gitignore`)

\`\`\`
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.vscode/
.idea/
\`\`\`

---

## 📊 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `CaseCard.tsx`)
- **Utilities**: camelCase (e.g., `apiClient.ts`)
- **Types**: camelCase (e.g., `types.ts`)
- **Configs**: kebab-case (e.g., `vite.config.ts`)
- **Docs**: UPPER_CASE (e.g., `README.md`)

### Directories
- **lowercase** for most directories
- **PascalCase** for component directories (optional)

---

## 📈 Code Organization Principles

### 1. **Feature-based** (Frontend)
Components grouped by feature (case/, admin/, etc.)

### 2. **Layer-based** (Backend)
Separation by responsibility (routes, services, db)

### 3. **Shared Code**
Common types & schemas in `shared/`

### 4. **Configuration**
All config files at root level

### 5. **Documentation**
Centralized in `Documentation/`

---

**See Also**:
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Development Guide](../6-Development/DEVELOPMENT_GUIDE.md)

---

**Last Updated**: October 18, 2025
