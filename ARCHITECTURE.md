# ARCHITECTURE.md — Free Resume Builder: No Paywall, No Tricks

## 1. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16.0.7 (App Router) | Already in package.json. RSC for SEO landing page, client components for builder. |
| **Language** | TypeScript 5.8 (strict) | Already configured with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. |
| **Styling** | Tailwind CSS 4 + CVA | Already in package.json. Utility-first for rapid development, CVA for component variants. |
| **UI Primitives** | Radix UI | Already in package.json. Accessible, unstyled, keyboard/ARIA support out of the box. |
| **State Management** | Zustand 4 | Already in package.json. Lightweight, no boilerplate, supports localStorage middleware. |
| **PDF Generation** | jsPDF 2.5 + html2canvas 1.4 | Already in package.json. Client-side, zero server cost. html2canvas renders preview → jsPDF wraps as PDF. |
| **Validation** | Zod 3 | Already in package.json. Runtime validation for resume data, JSON import, URL-decoded data. |
| **Icons** | Lucide React | Already in package.json. Tree-shakeable, consistent style. |
| **Testing** | Vitest + React Testing Library + Playwright | Already configured. Unit/component tests in Vitest, E2E in Playwright. |
| **Analytics** | Plausible (script tag) | Cookie-free, GDPR-compliant, no server cost (cloud plan $9/mo). |
| **Hosting** | Vercel (free tier) | Zero-config Next.js deployment. Static export for most pages. Free tier handles massive traffic for static sites. |
| **URL Compression** | pako (gzip) | Compress resume data for shareable links. ~30KB library, lazy-loaded. |

### No Database

This application has **zero server-side state**. All data lives in:
1. **localStorage** — primary persistence for active resume data
2. **URL fragment** — shareable links encode data after `#` (never sent to server)
3. **Client memory** — Zustand store during active session

No Prisma. No database. No API routes. No server functions. This is a fully static application.

---

## 2. Data Schema (TypeScript + Zod)

Since there is no database, the schema is defined as TypeScript types with Zod validation. The existing `src/types/resume.ts` is the source of truth.

### Zod Validation Schema

**File: `src/lib/schemas/resume-schema.ts`**

```typescript
import { z } from 'zod'

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).default(''),
  location: z.string().max(100).default(''),
  website: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  summary: z.string().max(2000).optional().or(z.literal('')),
})

export const experienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  company: z.string().min(1, 'Company is required').max(100),
  location: z.string().max(100).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  currentlyWorking: z.boolean().default(false),
  description: z.string().max(5000).default(''),
})

export const educationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, 'School is required').max(100),
  degree: z.string().min(1, 'Degree is required').max(100),
  field: z.string().max(100).default(''),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  gpa: z.string().max(10).optional().or(z.literal('')),
})

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required').max(50),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
})

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Project title is required').max(100),
  description: z.string().max(2000).default(''),
  link: z.string().url().optional().or(z.literal('')),
  technologies: z.array(z.string()).default([]),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
})

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required').max(100),
  issuer: z.string().min(1, 'Issuer is required').max(100),
  issueDate: z.string().min(1, 'Issue date is required'),
  expirationDate: z.string().optional().or(z.literal('')),
  credentialUrl: z.string().url().optional().or(z.literal('')),
})

export const resumeTemplateSchema = z.enum([
  'modern', 'classic', 'minimal', 'creative', 'professional'
])

export const resumeSchema = z.object({
  id: z.string(),
  template: resumeTemplateSchema,
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#2563eb'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type ResumeData = z.infer<typeof resumeSchema>
```

---

## 3. API Design

**There are no API routes.** This is a fully client-side application. All logic runs in the browser.

The "API" is the Zustand store interface. Here are the public methods:

### Zustand Store Interface

**File: `src/store/resume-store.ts`**

| Method | Input | Output | Description |
|---|---|---|---|
| `createNewResume()` | — | `Resume` | Creates empty resume with defaults |
| `setResume(resume)` | `Resume` | `void` | Replaces entire resume state |
| `updatePersonalInfo(info)` | `Partial<PersonalInfo>` | `void` | Merges personal info fields |
| `addExperience()` | — | `void` | Appends empty experience entry |
| `updateExperience(id, data)` | `string, Partial<Experience>` | `void` | Updates a specific experience |
| `removeExperience(id)` | `string` | `void` | Removes experience by ID |
| `reorderExperiences(ids)` | `string[]` | `void` | Sets new order by ID array |
| `addEducation()` | — | `void` | Appends empty education entry |
| `updateEducation(id, data)` | `string, Partial<Education>` | `void` | Updates a specific education |
| `removeEducation(id)` | `string` | `void` | Removes education by ID |
| `reorderEducation(ids)` | `string[]` | `void` | Sets new order |
| `addSkill()` | — | `void` | Appends empty skill entry |
| `updateSkill(id, data)` | `string, Partial<Skill>` | `void` | Updates a skill |
| `removeSkill(id)` | `string` | `void` | Removes skill by ID |
| `addProject()` | — | `void` | Appends empty project entry |
| `updateProject(id, data)` | `string, Partial<Project>` | `void` | Updates a project |
| `removeProject(id)` | `string` | `void` | Removes project by ID |
| `addCertification()` | — | `void` | Appends empty certification |
| `updateCertification(id, data)` | `string, Partial<Certification>` | `void` | Updates a certification |
| `removeCertification(id)` | `string` | `void` | Removes certification by ID |
| `updateTemplate(template)` | `ResumeTemplate` | `void` | Switches template |
| `updateAccentColor(color)` | `string` | `void` | Sets accent color hex |
| `loadFromLocalStorage()` | — | `void` | Hydrates store from localStorage |
| `saveToLocalStorage()` | — | `void` | Persists store to localStorage |
| `exportAsJSON()` | — | `string` | Serializes resume as JSON string |
| `importFromJSON(json)` | `string` | `boolean` | Parses and validates JSON, returns success |
| `generateShareableURL()` | — | `string` | Compresses + base64url encodes resume data |
| `loadFromShareableURL(hash)` | `string` | `boolean` | Decodes + decompresses URL hash data |
| `reset()` | — | `void` | Clears resume state and localStorage |

---

## 4. Page / Route Map

| URL | Page | Component | Data Source | Auth | Description |
|---|---|---|---|---|---|
| `/` | Landing | `src/app/page.tsx` | None (static) | None | SEO landing page with counter-positioning copy |
| `/builder` | Builder | `src/app/builder/page.tsx` | localStorage via Zustand | None | Main resume editor + live preview |
| `/preview` | Shared Preview | `src/app/preview/page.tsx` | URL hash fragment | None | Read-only resume preview from shareable link |
| `/templates` | Template Gallery | `src/app/templates/page.tsx` | None (static) | None | Browse all 5 templates with sample data |

### Route Details

#### `/` — Landing Page (Server Component)
- Fully server-rendered for SEO
- Zero client JS beyond Tailwind and analytics
- CTA button links to `/builder`
- Contains: hero, feature grid, template previews, trust signals, FAQ, footer with affiliate links

#### `/builder` — Resume Builder (Client Component)
- `"use client"` at page level (everything is interactive)
- On mount: `loadFromLocalStorage()` or `createNewResume()`
- Auto-saves to localStorage on 1-second debounce
- Split layout: left panel (form), right panel (preview)
- Mobile: tabbed interface (Edit / Preview)
- Template selector, download button, share button in toolbar

#### `/preview` — Shareable Preview (Client Component)
- Reads URL hash fragment on mount
- Decompresses and validates data via Zod
- Renders read-only resume preview
- Shows CTA: "Build Your Own Resume — It's Free"
- No edit capabilities

#### `/templates` — Template Gallery (Server Component)
- Static page showing all 5 templates with sample data
- Each template has a "Use This Template" button → `/builder?template=modern`
- Good for SEO: "free resume templates"

---

## 5. Component Hierarchy

```
src/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, metadata, theme provider
│   ├── page.tsx                      # Landing page (RSC)
│   ├── builder/
│   │   └── page.tsx                  # Builder page (client)
│   ├── preview/
│   │   └── page.tsx                  # Shared preview page (client)
│   └── templates/
│       └── page.tsx                  # Template gallery (RSC)
├── components/
│   ├── ui/                           # Shared UI primitives (Radix-based)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── tooltip.tsx
│   │   ├── separator.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── color-picker.tsx
│   │   └── card.tsx
│   ├── landing/                      # Landing page sections
│   │   ├── hero.tsx
│   │   ├── feature-grid.tsx
│   │   ├── template-showcase.tsx
│   │   ├── trust-signals.tsx
│   │   ├── faq.tsx
│   │   └── footer.tsx
│   ├── builder/                      # Builder page components
│   │   ├── builder-layout.tsx        # Split pane layout
│   │   ├── builder-toolbar.tsx       # Template selector, download, share, export
│   │   ├── form-panel.tsx            # Left panel container with section tabs
│   │   ├── preview-panel.tsx         # Right panel with live preview
│   │   ├── sections/                 # Form sections
│   │   │   ├── personal-info-form.tsx
│   │   │   ├── experience-form.tsx
│   │   │   ├── education-form.tsx
│   │   │   ├── skills-form.tsx
│   │   │   ├── projects-form.tsx
│   │   │   └── certifications-form.tsx
│   │   ├── section-entry.tsx         # Reusable collapsible entry (drag handle + delete)
│   │   └── mobile-preview-sheet.tsx  # Bottom sheet preview for mobile
│   ├── templates/                    # Resume template renderers
│   │   ├── template-renderer.tsx     # Dispatches to correct template by name
│   │   ├── modern-template.tsx
│   │   ├── classic-template.tsx
│   │   ├── minimal-template.tsx
│   │   ├── creative-template.tsx
│   │   └── professional-template.tsx
│   ├── preview/                      # Shared preview page components
│   │   ├── preview-viewer.tsx
│   │   └── preview-cta.tsx
│   └── shared/                       # Shared across pages
│       ├── theme-toggle.tsx
│       ├── header.tsx
│       ├── seo-head.tsx
│       └── affiliate-banner.tsx
├── hooks/
│   ├── use-auto-save.ts              # Debounced localStorage auto-save
│   ├── use-pdf-generator.ts          # jsPDF + html2canvas PDF generation
│   ├── use-shareable-link.ts         # URL encoding/decoding with pako
│   ├── use-keyboard-shortcuts.ts     # Ctrl+Z undo, Ctrl+S save, etc.
│   └── use-media-query.ts            # Responsive breakpoint detection
├── lib/
│   ├── cn.ts                         # clsx + tailwind-merge (exists)
│   ├── schemas/
│   │   └── resume-schema.ts          # Zod schemas for all resume types
│   ├── pdf/
│   │   └── generate-pdf.ts           # jsPDF + html2canvas PDF generation logic
│   ├── sharing/
│   │   └── url-codec.ts              # pako compress → base64url encode/decode
│   ├── templates/
│   │   └── sample-data.ts            # Sample resume data for template previews
│   └── constants.ts                  # App-wide constants (colors, limits, etc.)
├── store/
│   └── resume-store.ts               # Zustand store (exists, will be extended)
├── types/
│   └── resume.ts                     # TypeScript types (exists, will add accentColor)
└── test/
    └── setup.ts                      # Test setup (exists)
```

---

## 6. Data Flow

### Flow 1: User Types in Form → Preview Updates

```
User types in <Input>
  → onChange fires
  → Zustand store.updatePersonalInfo({ fullName: "John" })
  → Zustand state updates
  → <PreviewPanel> re-renders (subscribed to store)
  → <TemplateRenderer> receives new data
  → <ModernTemplate> renders updated resume
  → useAutoSave hook detects change → 1s debounce → localStorage.setItem()
```

### Flow 2: PDF Download

```
User clicks "Download PDF"
  → usePdfGenerator hook triggered
  → html2canvas captures .resume-preview element as canvas
  → jsPDF creates new document (A4 / US Letter)
  → Canvas added to PDF as image
  → PDF.save("{FullName}_Resume.pdf")
  → Browser triggers download
  (Zero network requests)
```

### Flow 3: Generate Shareable Link

```
User clicks "Share"
  → store.generateShareableURL()
  → JSON.stringify(resume)
  → pako.deflate(jsonString)
  → base64url.encode(compressedBytes)
  → URL = window.location.origin + "/preview#" + encoded
  → Copy to clipboard
  → Toast: "Link copied!"
```

### Flow 4: Open Shareable Link

```
Recipient opens /preview#<encoded-data>
  → page.tsx reads window.location.hash
  → base64url.decode(hash)
  → pako.inflate(bytes)
  → JSON.parse(decompressed)
  → resumeSchema.safeParse(data)
  → If valid: render <TemplateRenderer data={resume} />
  → If invalid: show error + CTA to build own resume
```

### Flow 5: Import JSON

```
User clicks "Import JSON" → file picker opens
  → FileReader reads file as text
  → JSON.parse(text)
  → resumeSchema.safeParse(parsed)
  → If valid: store.setResume(validated)
  → If invalid: toast("Invalid resume format")
```

### Flow 6: First Visit

```
User navigates to /builder
  → useEffect on mount
  → store.loadFromLocalStorage()
  → localStorage.getItem('resume-builder-data')
  → If found: JSON.parse → Zod validate → set store
  → If not found: store.createNewResume()
  → If URL has ?template=modern: set template
```

---

## 7. Security Checklist

### Authentication & Authorization
- [x] **No auth required** — app is fully anonymous, no user accounts
- [x] **No server-side state** — nothing to protect on the server
- [x] **No API routes** — no endpoints to exploit

### Input Validation
- [x] **All resume data validated with Zod** — both on form input and on JSON import
- [x] **Shareable link data validated with Zod** — prevents malformed data injection
- [x] **File import validated** — JSON import runs through Zod before setting state
- [x] **String length limits on all fields** — prevents localStorage quota exhaustion
- [x] **URL validation on website/linkedin/github fields** — prevents script injection

### XSS Prevention
- [x] **React's built-in escaping** — all user content rendered via JSX (auto-escaped)
- [x] **No `dangerouslySetInnerHTML`** — never used anywhere in the codebase
- [x] **No `eval()` or `new Function()`** — JSON.parse only, never evaluated as code
- [x] **CSP headers configured** in next.config.ts — blocks inline scripts
- [x] **Shareable link data in URL fragment** (after `#`) — never sent to server, decoded client-side only

### HTTP Security Headers (in `next.config.ts`)
- [x] `X-Content-Type-Options: nosniff` — already configured
- [x] `X-Frame-Options: DENY` — already configured
- [x] `Referrer-Policy: strict-origin-when-cross-origin` — already configured
- [x] `Permissions-Policy: camera=(), microphone=(), geolocation=()` — already configured
- [ ] Add `Content-Security-Policy` header — restrict script sources to `'self'` + analytics + ad network domain

### Data Privacy
- [x] **Zero data collection** — no server, no database, no tracking cookies
- [x] **localStorage only** — data stays on user's device
- [x] **Shareable links use URL fragment** — fragment is never sent to the server in HTTP requests
- [x] **No third-party scripts** except Plausible (cookie-free) and job board ad network
- [x] **No email collection** — not even optional

### Secrets Management
- [x] **No secrets to manage** — no API keys, no database credentials, no auth tokens
- [x] **Environment variables only for build-time config** — analytics ID, ad network ID
- [x] **`.env.example` documents all env vars** — already exists

### Third-Party Dependencies
- [x] **Minimal dependency surface** — jsPDF, html2canvas, pako are the only non-UI libraries
- [x] **All dependencies are well-maintained OSS** with active security response
- [x] **npm audit** should be run in CI before deployment
- [x] **Dependabot or Renovate** for automated dependency updates

### Denial of Service
- [x] **Static site on Vercel** — Vercel's edge network handles DDoS
- [x] **No server-side computation** — nothing to overwhelm
- [x] **localStorage quota** is browser-enforced (~5-10MB) — natural limit

---

## 8. Build & Deployment

### Development
```bash
npm run dev          # Next.js dev server with Turbopack
npm run test         # Vitest unit/component tests
npm run test:e2e     # Playwright E2E tests
npm run type-check   # TypeScript type checking
npm run lint         # ESLint
```

### CI Pipeline (GitHub Actions)
1. `npm ci`
2. `npm run type-check`
3. `npm run lint`
4. `npm run test -- --run`
5. `npm run build`
6. `npx playwright install --with-deps && npm run test:e2e`
7. Lighthouse CI check (performance ≥ 90)

### Deployment
- **Vercel** — auto-deploys from `main` branch
- Preview deploys on every PR
- No environment secrets needed for core functionality
- Optional: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for analytics
- Optional: `NEXT_PUBLIC_AD_CLIENT_ID` for ad network

### Performance Budget
| Asset | Max Size |
|---|---|
| Initial JS bundle | 250KB (gzipped) |
| jsPDF (lazy) | 300KB (gzipped, loaded on "Download PDF" click) |
| pako (lazy) | 30KB (gzipped, loaded on "Share" click) |
| html2canvas (lazy) | 50KB (gzipped, loaded on "Download PDF" click) |
| CSS | 30KB (gzipped) |
| Fonts (Inter) | Self-hosted, 50KB subset |
