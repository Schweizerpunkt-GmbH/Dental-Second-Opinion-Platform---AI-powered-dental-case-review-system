# Case Management - Dental Second Opinion Platform

Complete guide to the case management system.

**Last Updated**: October 18, 2025

---

## Overview

The case management system handles the entire lifecycle of a dental second opinion request, from initial upload through AI analysis, payment, expert review, and final delivery.

---

## Case Lifecycle

\`\`\`
1. DRAFT        → User uploads files & describes symptoms
2. QUEUED       → Payment confirmed, waiting for AI processing
3. AI_DONE      → AI analysis complete
4. DOCTOR_ASSIGNED → Dentist assigned for review (if purchased)
5. CLOSED       → All processing complete
\`\`\`

---

## Features

### Anonymous Upload
- Users can upload cases without authentication
- Claim later by logging in with \`POST /api/cases/:id/claim\`

### File Types Supported
- X-rays (RX)
- Panoramic X-rays (OPT)
- CBCT scans
- DICOM files
- Treatment offers (PDF)
- Photos (JPEG, PNG)

### Case Data
- Symptoms description
- Medical history
- Current medications
- Uploaded files

---

## API Endpoints

- \`POST /api/cases/anonymous\` - Create anonymous case
- \`POST /api/cases\` - Create authenticated case
- \`GET /api/cases\` - List user's cases
- \`GET /api/cases/:id\` - Get case details
- \`PATCH /api/cases/:id\` - Update case
- \`POST /api/cases/:id/claim\` - Claim anonymous case

---

**See Also**: [API Reference](../4-API/API_REFERENCE.md), [Database Schema](../3-Architecture/DATABASE_SCHEMA.md)
