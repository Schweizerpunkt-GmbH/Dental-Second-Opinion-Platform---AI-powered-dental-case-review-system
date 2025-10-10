# Dental Second Opinion Platform

A GDPR-compliant dental second opinion platform with AI analysis, dentist reviews, Stripe payments, and lead routing.

## Features

- **Multi-role authentication** (Patient/Dentist/Admin) with Replit Auth
- **Case management** with file upload to object storage
- **AI analysis integration** via FastAPI service connected to Ollama
- **Automated PDF report generation** with findings and confidence scores
- **Stripe payment integration** for AI reports and dentist reviews
- **Dentist review workflow** with case assignment and signed PDFs
- **Practice/Lead routing system** with geolocation matching
- **DICOM/Medical image viewer** (placeholder for CornerstoneJS integration)
- **Comprehensive audit logging** for GDPR compliance
- **Admin dashboard** for oversight and management

## Tech Stack

### Frontend
- React + Vite with TypeScript
- Tailwind CSS + Shadcn UI
- Wouter for routing
- React Query for data fetching
- Stripe Elements for payments

### Backend
- Node.js with Express
- Prisma ORM with PostgreSQL
- Replit Auth for authentication
- Stripe SDK for payments
- Object Storage (Replit App Storage/S3-compatible)

### Infrastructure
- PostgreSQL database (Neon)
- Object Storage for file uploads
- Environment-based configuration

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
The following environment variables are automatically configured:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID` - Object storage bucket
- `PUBLIC_OBJECT_SEARCH_PATHS` - Public object paths
- `PRIVATE_OBJECT_DIR` - Private object directory

### 3. Database Setup
```bash
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at the provided Replit URL.

## User Roles

### Patient
- Upload dental images (X-rays, OPT, DVT, CBCT)
- Describe symptoms and concerns
- Pay for AI analysis or expert review
- View AI reports and dentist reviews
- Get matched with partner practices

### Dentist
- Review assigned cases
- Provide expert analysis and recommendations
- Upload signed review PDFs
- Track earnings from reviews

### Admin
- Oversee all cases and users
- Manage payments and refunds
- View audit logs
- Monitor system metrics

## Medical Disclaimer

This service is for informational purposes only and does not replace professional dental examination. All findings and recommendations should be verified by a licensed dental professional.

## GDPR Compliance

- All data is encrypted at rest and in transit
- Comprehensive audit logging
- Data export and deletion capabilities
- User consent management
- Session-based authentication with secure cookies

## Payment Processing

- Stripe integration for secure payments
- AI Analysis: $29
- AI + Expert Review: $89
- Webhook handling for payment status updates
- Automatic payment reconciliation

## Architecture

```
/client         # React frontend
/server         # Express backend
/shared         # Shared TypeScript types
/attached_assets # Static assets
```

## Development Guidelines

- Follow the design guidelines in `design_guidelines.md`
- Use medical blue theme (210 85% 45%)
- Maintain WCAG 2.1 AA accessibility standards
- Implement comprehensive error handling
- Add data-testid attributes for testing

## License

© 2024 DentalSecondOpinion. All rights reserved.
