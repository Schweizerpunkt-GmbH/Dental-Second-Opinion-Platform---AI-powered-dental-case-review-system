# GDPR-Compliant Dental Second Opinion Platform

## Project Overview
A comprehensive dental second opinion platform where patients upload dental images (X-rays, OPT, DVT, CBCT) and treatment offers, receive AI-powered analysis via Ollama, purchase professional dentist reviews, and get matched with dental practices via lead routing.

## Recent Changes (October 10, 2025)
- ✅ Implemented complete file upload system with object storage using presigned URLs
- ✅ Built case detail view page with symptoms, files, AI reports, reviews, and payment info
- ✅ Integrated Stripe payment checkout for AI analysis and dentist reviews
- ✅ Created dentist review workflow with review page for adding notes and signed PDFs
- ✅ Implemented AI analysis integration that triggers on payment completion
- ✅ Added mock AI service with realistic medical findings generation
- ✅ Auto-assignment of dentist reviews after payment

## Architecture

### Multi-Role System
- **Patient**: Create cases, upload files, request AI analysis/reviews, view results
- **Dentist**: Review assigned cases, add clinical notes, upload signed reports
- **Admin**: Manage users, view all cases, monitor payments, access audit logs

### Tech Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Replit Object Storage for medical images and documents
- **Payments**: Stripe with webhook integration
- **Auth**: Replit Auth with role-based access control
- **AI**: Mock service (placeholder for Ollama integration)

### Key Features Implemented
1. **Case Management**: Create, view, update cases with status tracking
2. **File Upload**: Secure upload of medical images (X-rays, CBCT, etc.) to object storage
3. **AI Analysis**: Automated analysis triggered by payment with findings generation
4. **Payment Processing**: Stripe checkout for AI ($29) and Dentist Review ($60) services
5. **Dentist Review System**: Professional review workflow with notes and signed PDF upload
6. **Audit Logging**: GDPR-compliant logging of all critical actions
7. **Role-Based Access**: Separate dashboards and permissions for each user role

## User Preferences
- Medical blue color scheme (HSL 210 85% 45%)
- Material Design 3 principles with dark mode support
- Schema-first development approach
- No mock data in production paths
- GDPR compliance mandatory for all user data

## Project Structure
```
client/src/
├── pages/
│   ├── landing.tsx             # Public landing page
│   ├── patient-dashboard.tsx   # Patient case list
│   ├── upload-wizard.tsx       # Multi-step case creation
│   ├── case-detail.tsx         # Case view with all details
│   ├── dentist-dashboard.tsx   # Dentist review queue
│   ├── dentist-review.tsx      # Dentist review form
│   └── admin-dashboard.tsx     # Admin stats and management
├── components/
│   └── ui/                     # shadcn components
└── lib/
    └── queryClient.ts          # TanStack Query setup

server/
├── routes.ts                   # All API endpoints
├── replitAuth.ts              # Replit authentication
├── aiService.ts               # AI analysis service (mock)
├── db.ts                      # Database connection
└── storage.ts                 # Object storage interface

shared/
└── schema.ts                  # Shared types and database schema
```

## Database Schema
- **users**: id, replitId, email, role (PATIENT/DENTIST/ADMIN)
- **cases**: id, userId, symptoms, status (DRAFT/QUEUED/AI_DONE/DOCTOR_ASSIGNED/CLOSED)
- **files**: id, caseId, kind (RX/OPT/DVT/CBCT/OFFER/OTHER), s3Key, mime, size
- **aiReports**: id, caseId, summary, findings (JSON), confidence, pdfS3Key
- **humanReviews**: id, caseId, dentistId, notes, status, signedPdfKey
- **payments**: id, caseId, type (AI/REVIEW), amount, status, stripeSess
- **auditLogs**: id, actorId, action, meta (JSON)
- **practices**: Practice/clinic information (not yet used)
- **leads**: Lead routing system (not yet implemented)

## Case Status Flow
1. **DRAFT**: Case created, files being uploaded
2. **QUEUED**: Payment received, waiting for AI analysis
3. **AI_DONE**: AI analysis complete, ready for dentist review (optional)
4. **DOCTOR_ASSIGNED**: Dentist assigned to review
5. **CLOSED**: Review completed

## Payment Flow
1. User clicks "Request Analysis" or "Request Dentist Review"
2. Stripe checkout session created with metadata (caseId, type, userId)
3. User completes payment on Stripe
4. Stripe webhook updates payment status to PAID
5. For AI: Case status → QUEUED, triggers AI analysis
6. For REVIEW: Creates review record, assigns dentist, updates case status

## AI Analysis Process
1. Triggered asynchronously after AI payment completion
2. Fetches case symptoms and uploaded files
3. Runs mock AI analysis (analyzeCase function)
4. Generates medical findings based on file types and symptoms
5. Stores report in aiReports table with confidence score
6. Updates case status to AI_DONE

## Security & Compliance
- GDPR-compliant audit logging for all critical actions
- Role-based access control with middleware
- Secure file storage with object storage
- Stripe webhook signature verification
- No sensitive data in frontend

## Environment Variables
- DATABASE_URL: PostgreSQL connection
- STRIPE_SECRET_KEY: Stripe API key
- STRIPE_WEBHOOK_SECRET: Webhook signing secret
- VITE_STRIPE_PUBLIC_KEY: Stripe publishable key
- SESSION_SECRET: Express session secret
- Object storage vars: DEFAULT_OBJECT_STORAGE_BUCKET_ID, PUBLIC_OBJECT_SEARCH_PATHS, PRIVATE_OBJECT_DIR

## Pending Features (Future Enhancements)
- [ ] PDF report generation for AI analysis
- [ ] Complete admin dashboard data connections
- [ ] DICOM/medical image viewer with zoom/pan
- [ ] Practice/lead routing system
- [ ] Actual Ollama integration for AI analysis
- [ ] Email notifications for case status changes
- [ ] Multi-language support
- [ ] Payment history and invoicing

## Known Limitations
- AI analysis uses mock service (Ollama integration pending)
- PDF generation not yet implemented
- File downloads use placeholder URLs
- DICOM viewer not implemented
- Practice matching/lead routing not implemented
