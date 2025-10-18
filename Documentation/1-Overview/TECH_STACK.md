# Technology Stack - Dental Second Opinion Platform

## 🎨 Frontend

### Core Framework
- **React 18.3.1** - UI library
- **TypeScript 5.6.3** - Type-safe JavaScript
- **Vite 5.4.20** - Build tool and dev server

### UI Components & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **@tailwindcss/vite 4.1.3** - Tailwind Vite plugin
- **Radix UI** - Accessible component primitives
  - Dialog, Dropdown, Popover, Toast, etc.
  - 30+ Radix UI packages
- **Shadcn UI** - Pre-built accessible components
- **Lucide React 0.453.0** - Icon library
- **Framer Motion 11.13.1** - Animation library

### State Management & Data Fetching
- **TanStack React Query 5.60.5** - Server state management
- **Wouter 3.3.5** - Lightweight routing
- **React Hook Form 7.55.0** - Form management
- **@hookform/resolvers 3.10.0** - Form validation

### Medical Imaging
- **@cornerstonejs/core 4.5.6** - Medical image rendering
- **@cornerstonejs/tools 4.5.6** - Medical imaging tools
- **dicom-parser 1.8.21** - DICOM file parsing

### Internationalization
- **i18next 25.6.0** - i18n framework
- **react-i18next 16.0.0** - React bindings for i18next
- **i18next-browser-languagedetector 8.2.0** - Language detection
- **i18next-http-backend 3.0.2** - Translation loading

### Payment Integration
- **@stripe/react-stripe-js 5.2.0** - Stripe React components
- **@stripe/stripe-js 8.0.0** - Stripe JavaScript SDK

### Validation
- **Zod 3.24.2** - TypeScript-first schema validation
- **zod-validation-error 3.4.0** - Readable Zod errors

### Other UI Libraries
- **date-fns 3.6.0** - Date utility library
- **recharts 2.15.2** - Charts and graphs
- **react-day-picker 8.10.1** - Date picker
- **embla-carousel-react 8.6.0** - Carousel component
- **react-resizable-panels 2.1.7** - Resizable panels
- **cmdk 1.1.1** - Command palette
- **vaul 1.1.2** - Drawer component
- **input-otp 1.4.2** - OTP input
- **next-themes 0.4.6** - Theme management

## ⚙️ Backend

### Core Framework
- **Node.js 24.10.0** - JavaScript runtime
- **Express 4.21.2** - Web framework
- **TypeScript 5.6.3** - Type safety

### Database
- **PostgreSQL** - Primary database
- **@neondatabase/serverless 0.10.4** - Neon serverless driver
- **Drizzle ORM 0.39.1** - TypeScript ORM
- **drizzle-kit 0.31.4** - Drizzle CLI tools
- **drizzle-zod 0.7.0** - Zod integration for Drizzle

### Authentication
- **Passport.js 0.7.0** - Authentication middleware
- **passport-local 1.0.0** - Local strategy
- **openid-client 6.8.1** - OpenID Connect client (Replit Auth)
- **express-session 1.18.1** - Session middleware
- **connect-pg-simple 10.0.0** - PostgreSQL session store

### Payments
- **Stripe 19.1.0** - Payment processing SDK
- **stripe API Version**: 2024-12-18.acacia

### Email
- **Nodemailer 7.0.9** - Email sending
- **SMTP Support** - Gmail, custom SMTP servers

### Utilities
- **crypto** (built-in) - Cryptographic functions
- **ws 8.18.0** - WebSocket support
- **memoizee 0.4.17** - Function memoization
- **memorystore 1.6.7** - Memory-based session store (dev)

## 🗄️ Database

### Database Provider
- **Neon PostgreSQL** - Serverless PostgreSQL
- **Version**: PostgreSQL 15

### ORM & Schema
- **Drizzle ORM** - Type-safe database access
- **Schema Location**: `shared/schema.ts`

### Tables (10 models)
1. `users` - User accounts
2. `cases` - Dental cases
3. `files` - Uploaded files
4. `aiReports` - AI analysis reports
5. `humanReviews` - Dentist reviews
6. `payments` - Payment records
7. `practices` - Dental practices
8. `leads` - Patient leads
9. `auditLogs` - GDPR audit trail
10. `sessions` - User sessions

## 🚀 Build & Development Tools

### Build Tools
- **Vite 5.4.20** - Build tool
- **esbuild 0.25.0** - JavaScript bundler
- **tsx 4.20.5** - TypeScript execution
- **@vitejs/plugin-react 4.7.0** - React plugin for Vite

### Development Plugins
- **@replit/vite-plugin-cartographer 0.3.1** - Code cartography
- **@replit/vite-plugin-dev-banner 0.1.1** - Dev banner
- **@replit/vite-plugin-runtime-error-modal 0.0.3** - Error overlay

### PostCSS & Autoprefixer
- **PostCSS 8.4.47** - CSS processor
- **Autoprefixer 10.4.20** - CSS autoprefixing
- **@tailwindcss/typography 0.5.15** - Typography plugin

## 📦 Package Management

- **npm 11.6.2** - Package manager
- **Node.js 24.10.0** - Runtime environment

## 🌐 Deployment & Infrastructure

### Hosting Platform
- **Replit** - Primary deployment platform
  - Auto-deployment on push
  - Built-in secrets management
  - HTTPS by default

### Database Hosting
- **Neon Database** - Serverless PostgreSQL
  - Auto-scaling
  - Branching support
  - Connection pooling

### Object Storage
- **S3-Compatible Storage** - File storage
  - DICOM files
  - X-ray images
  - PDF reports
  - Treatment offers

### CDN & Assets
- Static assets served from `/public`
- Medical images from object storage

## 🔧 Development Environment

### Required Tools
- Node.js 18+ (recommended 20+)
- npm 9+
- PostgreSQL 15+ (for local development)
- Git

### Optional Tools
- Docker (for containerized development)
- pgAdmin / TablePlus (database GUI)
- Postman / Insomnia (API testing)
- VS Code (recommended IDE)

## 🧪 Testing (To Be Implemented)

### Planned Testing Stack
- **Vitest** - Unit testing
- **Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW** - API mocking

## 📊 Monitoring & Analytics (To Be Implemented)

### Planned Tools
- **Sentry** - Error tracking
- **PostHog** - Product analytics
- **LogTail** - Log aggregation
- **Uptime Robot** - Uptime monitoring

## 🔐 Security

### Dependencies
- Regular `npm audit` checks
- Automated Dependabot updates (if on GitHub)
- Current vulnerabilities: 12 (3 low, 9 moderate)

### Best Practices
- Environment variable management
- HTTPS-only in production
- Secure session cookies
- CSRF protection
- SQL injection prevention (parameterized queries via Drizzle)
- XSS prevention (React escaping)

## 🌍 Internationalization

### Languages Supported
1. **German (DE)** - Primary
2. **English (EN)**
3. **French (FR)**
4. **Italian (IT)**

### i18n Implementation
- Translation files in `/public/locales/`
- Runtime language switching
- Browser language detection
- Fallback to English

## 📈 Performance

### Optimization Strategies
- **Code splitting** - Vite automatic chunking
- **Lazy loading** - React.lazy for routes
- **Image optimization** - WebP format support
- **Caching** - React Query caching
- **Memoization** - React.memo, useMemo, useCallback
- **Connection pooling** - Neon database pooling

## 🔄 Version Control

- **Git** - Source control
- **GitHub** (assumed) - Code hosting
- **Semantic Versioning** - v1.0.0

---

**Last Updated**: October 18, 2025
**Total Dependencies**: 120+ packages
**Bundle Size**: TBD (run build analysis)
