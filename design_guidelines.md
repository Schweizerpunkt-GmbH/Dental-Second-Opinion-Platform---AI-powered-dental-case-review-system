# Design Guidelines: Dental Second Opinion Platform

## Design Approach

**Selected Approach**: Design System (Material Design 3) with Healthcare Specialization

**Rationale**: This medical platform requires established UI patterns that convey trust, professionalism, and clinical precision. Material Design 3 provides the necessary structure for complex workflows while maintaining accessibility standards crucial for healthcare applications.

**Key Principles**:
- Clinical Precision: Clear hierarchy and unambiguous interactions
- Trust & Credibility: Professional aesthetics without appearing cold
- Workflow Efficiency: Optimized for both patient and dentist journeys
- Accessibility First: WCAG 2.1 AA compliance minimum

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 210 85% 45% (Medical Blue - trust, professionalism)
- Primary Variant: 210 70% 35% (Deeper blue for emphasis)
- Secondary: 160 45% 45% (Calming Teal - healthcare association)
- Background: 0 0% 98% (Soft white)
- Surface: 0 0% 100% (Pure white for cards/modals)
- Error: 0 65% 50% (Medical red for alerts)
- Success: 145 60% 45% (Positive green for confirmations)
- Warning: 35 85% 55% (Amber for caution states)

**Dark Mode**:
- Primary: 210 75% 65% (Lighter blue for contrast)
- Primary Variant: 210 65% 55%
- Secondary: 160 40% 55%
- Background: 220 15% 12% (Deep blue-gray)
- Surface: 220 12% 16% (Elevated surface)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

**Semantic Colors**:
- AI Analysis: 270 60% 60% (Purple - technology/AI)
- Dentist Review: 25 75% 55% (Orange - human expertise)
- Payment: 145 55% 45% (Green - financial)
- Critical Findings: 0 70% 55% (Red - urgent attention)

**Pastel Accent Colors** (for backgrounds, hero sections, feature highlights):
- Soft Medical Blue: 210 70% 92% (Trust, calmness)
- Mint Fresh: 160 60% 90% (Clean, healthcare)
- Lavender Trust: 250 60% 92% (Technology, comfort)
- Warm Peach: 25 70% 90% (Welcoming, friendly)
- Soft Lilac: 270 50% 90% (AI/Innovation sections)
- Pale Sky: 200 60% 92% (Openness, clarity)

### B. Typography

**Font Stack**:
- Primary: 'Inter' (via Google Fonts) - exceptional legibility for medical data
- Monospace: 'JetBrains Mono' - for technical IDs and codes

**Scale**:
- Hero/Display: 48px/56px (font-bold, tracking-tight)
- H1 (Page Titles): 32px/40px (font-semibold)
- H2 (Section Headers): 24px/32px (font-semibold)
- H3 (Card Headers): 20px/28px (font-medium)
- Body Large: 16px/24px (font-normal)
- Body: 14px/20px (font-normal)
- Small/Caption: 12px/16px (font-normal)
- Medical Labels: 13px/18px (font-medium, uppercase tracking-wide)

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 8, 12, 16, 20, 24 (strict adherence for consistency)

**Container Strategy**:
- Max Width: 1280px (container mx-auto)
- Section Padding: py-16 md:py-24
- Card Padding: p-6 md:p-8
- Form Fields: p-4
- Tight Spacing: gap-2 or gap-4
- Standard Spacing: gap-8
- Section Spacing: gap-16 or gap-20

**Grid Patterns**:
- Dashboard: 12-column grid
- Image Viewer: Full viewport with overlay controls
- Forms: Single column (max-w-2xl) for patient flow
- Admin Tables: Full width with horizontal scroll

### D. Component Library

**Navigation**:
- Top Header: Fixed position, frosted glass effect (backdrop-blur-md), role-based menu items
- Patient Nav: Simple (Cases, Upload, Profile)
- Dentist Nav: Work-focused (Queue, Reviews, Earnings)
- Admin Nav: Full control (Cases, Users, Payments, Audit)

**Cards & Surfaces**:
- Elevation: shadow-sm (default), shadow-md (hover), shadow-lg (modals)
- Borders: border border-gray-200 dark:border-gray-700
- Radius: rounded-lg (standard), rounded-xl (prominent cards)

**Upload Zone**:
- Drag-and-drop with dashed border (border-2 border-dashed)
- File type indicators (X-ray icon, OPT badge, etc.)
- Progress bars with percentage and file size
- Thumbnail previews in grid (grid-cols-2 md:grid-cols-4)

**Medical Viewer (DICOM/OPT)**:
- Full-screen black background (#000)
- Floating control panel (top-right, frosted glass)
- Window level sliders (bottom bar)
- AI finding overlays (semi-transparent colored regions)
- Measurement tools (distinct yellow/cyan lines)

**Report Display**:
- Two-column layout: Findings (left 60%) | Images (right 40%)
- Confidence score visualization (circular progress, color-coded)
- Expandable sections for detailed findings
- Clear disclaimer banner (amber background, icon, bold text)

**Forms & Inputs**:
- Outlined style with focus ring (ring-2 ring-primary)
- Floating labels on focus
- Validation states: error (red border), success (green border)
- Multi-step wizard with progress indicator (numbered circles connected by lines)

**Payment Flow**:
- Pricing cards with feature comparison (3-column grid)
- Security badges (lock icon, "256-bit SSL", "PCI compliant")
- Stripe-hosted checkout (embed or redirect)
- Payment confirmation with receipt download

**Data Tables (Admin/Dentist)**:
- Sticky header with sorting indicators
- Row hover states (bg-gray-50 dark:bg-gray-800)
- Action dropdowns (right-aligned)
- Status badges (pill-shaped, color-coded)
- Pagination controls (bottom center)

**Status Indicators**:
- Draft: gray badge
- Queued: blue badge with spinner
- AI Done: purple badge
- Doctor Assigned: orange badge
- Closed: green badge
- Payment statuses: color-coded with icons

### E. Animations & Motion

**Marketing/Landing Pages** (Framer Motion):
- Fade-in on scroll: Subtle reveal animations (opacity 0→1, y: 20→0)
- Parallax backgrounds: Hero images scroll at 0.5x speed
- Floating elements: Gentle up/down motion for icons (translateY: -5px to 5px)
- Stagger children: Sequential fade-in for feature cards (staggerChildren: 0.1)
- Gradient shifts: Subtle color transitions on hover

**Application Pages** (Clinical):
- Page transitions: None (instant for clinical efficiency)
- Modal entry: Fade + subtle scale (duration-200)
- Upload progress: Smooth width transition (transition-all)
- AI analysis: Pulsing indicator only when active
- Hover states: Transform scale-[1.02] for cards (duration-150)
- Focus states: Ring expansion (transition-shadow)

**Prohibited**:
- Auto-playing carousels
- Aggressive/distracting animations
- Long animation durations (>400ms)

## Page-Specific Guidelines

### Patient Upload Wizard
- Clean, single-column flow (max-w-3xl mx-auto)
- Step indicator at top (1. Symptoms → 2. Upload → 3. Payment → 4. Results)
- Large upload zones with clear file type labels
- Symptom description: textarea with character count
- Payment summary sidebar (sticky on desktop)

### AI Report View
- Hero section: Confidence score + summary (bg-gradient-to-br from-blue-50 to-purple-50)
- Findings cards: Icon + title + description + severity badge
- Image gallery: Thumbnails with lightbox (click to expand with annotations)
- Download PDF: Prominent button (top-right)
- Request Review: Upgrade CTA card (bottom)

### Dentist Dashboard
- Queue table: Sortable by date, priority, case type
- Case detail: Split view (images left, notes right)
- Review editor: Rich text with template snippets
- Sign-off: Digital signature pad + confirmation modal

### Admin Console
- Metrics cards: 4-column grid (Total Cases, Revenue, Active Dentists, Leads)
- Search bar: Global with filters (status, date range, user)
- Audit log: Timeline view with actor, action, timestamp
- Refund modal: Confirmation with reason selection

## Images

**Hero Section (Marketing/Landing)**:
- Large hero image: Modern dental practice with natural lighting, diverse patients, warm and professional atmosphere (not stock-looking)
- Placement: Full-width background with gradient overlay (from-black/60 to-transparent)
- Dimensions: Minimum 1920x1080, optimized WebP format

**Product Screenshots**:
- AI analysis report: Annotated X-ray showing findings
- Dentist review interface: Clean dashboard view
- Mobile app screens: Upload and report viewing
- Placement: Feature sections with device mockups (MacBook/iPhone frames)

**Trust Signals**:
- Dentist portraits: Professional headshots with credentials
- Certification badges: Medical associations, data privacy seals
- Placement: Social proof section, footer

**Medical Imagery**:
- Sample anonymized X-rays (for demos): Watermarked, labeled as examples
- Placement: How-it-works section, education content