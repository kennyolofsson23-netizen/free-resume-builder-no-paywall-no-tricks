# DESIGN.md — Free Resume Builder: No Paywall, No Tricks

> UI/UX Design Specification — v1.1
> Stack: Next.js 16 · React 19 · Tailwind CSS v4 · shadcn/ui · Radix UI · Inter · Zustand · Zod
> Routes: `/` · `/builder` · `/preview` · `/templates`

---

## Table of Contents

1. [Design Principles & Visual Style](#1-design-principles--visual-style)
2. [Color Palette, Typography & Spacing System](#2-color-palette-typography--spacing-system)
3. [User Flows](#3-user-flows)
4. [Page Layouts](#4-page-layouts)
5. [Component Specs](#5-component-specs)
6. [Accessibility Requirements (WCAG AA)](#6-accessibility-requirements-wcag-aa)
7. [Responsive Breakpoints](#7-responsive-breakpoints)
8. [Loading, Empty & Error States](#8-loading-empty--error-states)

---

## 1. Design Principles & Visual Style

### Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Radical Transparency** | No hidden fees, no dark patterns. Copy says exactly what the tool does and doesn't cost. Anti-paywall badge visible above the fold on landing. Counter-positioning copy appears in ≥3 distinct places per SPEC F006. |
| **Speed First** | Builder loads instantly. Preview re-renders ≤200 ms after input (SPEC requirement). jsPDF + html2canvas lazy-loaded on first "Download PDF" click. PDF generates in <2 s. |
| **Trust Through Restraint** | Minimal UI chrome. White space over decoration. No fake star-ratings or invented social proof. Affiliate links clearly labeled; never block the primary user journey. |
| **Content Is the Product** | The resume preview — not the UI shell — is the hero element in the builder. Editor chrome recedes; resume canvas dominates. Preview always white-background (as it will print), even in dark mode. |
| **Keyboard-First** | Every action reachable without a mouse. Tab order logical. No focus traps outside dialogs and sheets. |
| **Zero Onboarding Friction** | Builder functional on first visit. No wizard, no splash screen, no account wall. URL param `?template=modern` pre-selects a template (e.g., from `/templates` page). |
| **Privacy by Design** | No data ever leaves the browser. Shareable links encode data in URL fragment (never sent to server). This is a selling point and must be reflected in copy throughout. |

### Visual Style

- **Aesthetic:** Clean, editorial, professional — not SaaS-startup-playful. Inspired by the restraint of linear.app and Vercel's dashboard.
- **Motion:** Purposeful micro-animations only (`transition-colors`, `transition-opacity`, accordion slide). No scroll-triggered animations, no hero parallax.
- **Depth:** Flat design with single-level shadows (`shadow-sm` on cards, `shadow-xl` on resume canvas). No glassmorphism.
- **Personality:** Direct, anti-corporate tone in copy. UI is calm and neutral so resume content stands out.
- **Dark mode:** Supported for editor UI. Preview canvas always renders white (print-accurate).

---

## 2. Color Palette, Typography & Spacing System

### 2.1 Color Palette

CSS custom properties in `globals.css`; consumed via Tailwind theme tokens. Hex values are computed equivalents.

#### Light Mode (`:root`)

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--background` | `0 0% 100%` | `#FFFFFF` | Page background |
| `--foreground` | `0 0% 3.6%` | `#090909` | Body text, headings |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card surfaces |
| `--card-foreground` | `0 0% 3.6%` | `#090909` | Card text |
| `--muted` | `0 0% 96.1%` | `#F5F5F5` | Subtle backgrounds, disabled states |
| `--muted-foreground` | `0 0% 45.1%` | `#737373` | Placeholders, helper text |
| `--border` | `0 0% 89.8%` | `#E5E5E5` | Dividers, input borders |
| `--input` | `0 0% 89.8%` | `#E5E5E5` | Input border color |
| `--ring` | `0 0% 3.6%` | `#090909` | Focus rings |
| `--primary` | `0 0% 9.0%` | `#171717` | Primary buttons, active states |
| `--primary-foreground` | `0 0% 98%` | `#FAFAFA` | Text on primary buttons |
| `--secondary` | `0 0% 96.1%` | `#F5F5F5` | Secondary buttons |
| `--secondary-foreground` | `0 0% 9.0%` | `#171717` | Text on secondary buttons |
| `--destructive` | `0 84.2% 60.2%` | `#F05252` | Delete, error states |
| `--destructive-foreground` | `0 0% 98%` | `#FAFAFA` | Text on destructive |
| `--accent` | `0 0% 9.0%` | `#171717` | Accent surfaces |
| `--accent-foreground` | `0 0% 98%` | `#FAFAFA` | Text on accent |

#### Dark Mode (`.dark`)

| Token | HSL | Hex |
|-------|-----|-----|
| `--background` | `0 0% 3.6%` | `#090909` |
| `--foreground` | `0 0% 98%` | `#FAFAFA` |
| `--card` | `0 0% 5.0%` | `#0D0D0D` |
| `--muted` | `0 0% 14.9%` | `#262626` |
| `--muted-foreground` | `0 0% 63.9%` | `#A3A3A3` |
| `--border` | `0 0% 14.9%` | `#262626` |
| `--primary` | `0 0% 98%` | `#FAFAFA` |
| `--primary-foreground` | `0 0% 9.0%` | `#171717` |
| `--destructive` | `0 72.2% 50.6%` | `#E53E3E` |

#### Contextual / Semantic Colors (fixed, non-theme)

Used for feature icons and badges; do **not** vary with dark/light mode.

| Purpose | Background | Icon/Text | Tailwind classes |
|---------|-----------|-----------|-----------------|
| Preview / Vision | `#EFF6FF` | `#2563EB` | `bg-blue-100 text-blue-600` |
| Download / Success | `#F0FDF4` | `#16A34A` | `bg-green-100 text-green-600` |
| Templates / Creative | `#FAF5FF` | `#9333EA` | `bg-purple-100 text-purple-600` |
| Privacy / Trust | `#FFFBEB` | `#D97706` | `bg-amber-100 text-amber-600` |
| Anti-paywall Badge | `#FEF2F2` | `#B91C1C` | `bg-red-100 text-red-700` |

#### Template Accent Colors (inside resume canvas only)

These are user-selectable via `accentColor` field (hex, default `#2563EB`). Preset palette of 12 colors:

| # | Name | Hex |
|---|------|-----|
| 1 | Cobalt Blue | `#2563EB` |
| 2 | Slate | `#475569` |
| 3 | Emerald | `#059669` |
| 4 | Violet | `#7C3AED` |
| 5 | Rose | `#E11D48` |
| 6 | Amber | `#D97706` |
| 7 | Teal | `#0891B2` |
| 8 | Indigo | `#4F46E5` |
| 9 | Fuchsia | `#C026D3` |
| 10 | Orange | `#EA580C` |
| 11 | Neutral Dark | `#171717` |
| 12 | Slate Blue | `#1D4ED8` |

Contrast check rule: if `getContrastRatio(accentColor, '#FFFFFF') < 3.0`, show warning badge "Low contrast — may be hard to read when printed." (SPEC F012)

#### Landing Hero Gradient

```css
background: linear-gradient(to bottom right, #0F172A, #1E293B, #0F172A);
/* Tailwind: bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 */
```

### 2.2 Typography

Font: **Inter** (Google Fonts, `subsets: ['latin']`), loaded via `next/font/google` with `display: swap`.

#### Type Scale

| Role | Tag | Size | Weight | Line-height | Tailwind |
|------|-----|------|--------|-------------|---------|
| Display XL | `h1` (landing desktop) | 60px / 3.75rem | 700 | 1.1 | `text-6xl font-bold tracking-tight` |
| Display L | `h1` (landing tablet) | 48px / 3rem | 700 | 1.1 | `text-5xl font-bold tracking-tight` |
| Display M | `h1` (landing mobile) | 36px / 2.25rem | 700 | 1.2 | `text-4xl font-bold tracking-tight` |
| Heading 2 | `h2` | 30px / 1.875rem | 700 | 1.25 | `text-3xl font-bold tracking-tight` |
| Heading 3 | `h3` | 18px / 1.125rem | 600 | 1.4 | `text-lg font-semibold` |
| Body Large | `p` | 20px / 1.25rem | 400 | 1.6 | `text-xl` |
| Body | `p` | 16px / 1rem | 400 | 1.5 | `text-base` |
| Body Small | `p`, `span` | 14px / 0.875rem | 400 | 1.5 | `text-sm` |
| Caption | `span` | 12px / 0.75rem | 400 | 1.4 | `text-xs` |
| Label / UI | `label` | 14px / 0.875rem | 500 | 1 | `text-sm font-medium` |
| Badge | `span` | 14px / 0.875rem | 600 | 1 | `text-sm font-semibold` |
| Monospace | code, URL fields | 14px / 0.875rem | 400 | 1.5 | `font-mono text-sm` |

#### Rules

- All headings: `tracking-tight`
- Hero on dark background: primary text `text-white`, secondary `text-slate-300`
- Muted/helper text: `text-muted-foreground text-sm`
- Never `font-black` (900) — conflicts with restrained aesthetic
- Resume canvas uses its own type styles set by each template component (independent of app UI type scale)

### 2.3 Spacing System

Tailwind's 4 px base unit. The project uses multiples of 4.

| Token | px | Typical usage |
|-------|----|--------------|
| `space-1` | 4 | Icon gap, tight inline spacing |
| `space-2` | 8 | Badge padding, input padding Y |
| `space-3` | 12 | Small component gaps |
| `space-4` | 16 | Card padding, standard form gaps |
| `space-6` | 24 | Section sub-gaps |
| `space-8` | 32 | Large card padding |
| `space-12` | 48 | Section vertical breathing room |
| `space-24` | 96 | Landing page section `py-24` |

#### Layout Widths

| Context | Max-width | Tailwind |
|---------|-----------|---------|
| Default content | 896px | `max-w-4xl` |
| Narrow CTA / forms | 672px | `max-w-2xl` |
| Builder editor panel | 480px | `w-[480px]` (fixed) |
| Resume canvas (A4 @ 96 dpi) | 816px | `w-[816px]` |
| Resume canvas height (A4) | 1056px | `min-h-[1056px]` |
| Full bleed | 100% | — |

#### Border Radius

| Token | Value | Tailwind |
|-------|-------|---------|
| `--radius` | 8px | `rounded-lg` |
| Medium | 6px | `rounded-md` |
| Small | 4px | `rounded-sm` |
| Pill | 9999px | `rounded-full` |

---

## 3. User Flows

### 3.1 Primary Flow: First-Time Visitor → Download PDF

```
[Land on /]
  │
  ├─ Reads hero: "No email. No account. No '$1.95 trial that auto-renews.'"
  ├─ Sees anti-paywall badge, trust signals, template showcase
  └─ Clicks "Start Building" (primary hero CTA)
       │
       ▼
[/builder — resume auto-initialized from localStorage or createNewResume()]
  │
  ├─ STEP 1: Personal Info (default active tab)
  │   ├─ Full Name *, Email *, Phone, Location
  │   └─ Optional: Website, LinkedIn, GitHub, Summary
  │
  ├─ STEP 2: Experience tab
  │   ├─ "+ Add Experience" → accordion item opens
  │   ├─ Fields: Job Title, Company, Location, Start Date, End Date / "Currently Working"
  │   └─ Description (bullet-style textarea)
  │
  ├─ STEP 3: Education tab → School, Degree, Field, Dates, GPA (optional)
  ├─ STEP 4: Skills tab → Skill name + level (inline add row)
  ├─ STEP 5: Projects tab → Title, Description, Link, Technologies, Dates
  ├─ STEP 6: Certifications tab → Name, Issuer, Date, Expiry, URL
  │
  ├─ STEP 7: Select template (toolbar or Template Switcher)
  │   └─ Preview re-renders immediately (≤200 ms)
  │
  ├─ STEP 8 (Optional): Click accent color swatch → pick color from palette
  │   └─ Template accent elements update immediately
  │
  └─ STEP 9: Click "Download PDF"
      ├─ Validate: fullName not empty; email valid format
      │   └─ If invalid: Toast error + focus first invalid field
      ├─ jsPDF + html2canvas lazy-load (if first download)
      ├─ Button → loading state (spinner + "Generating…" + disabled)
      ├─ html2canvas captures `.resume-preview` at 2× resolution
      ├─ jsPDF creates A4 document, embeds canvas image
      ├─ File downloads as: `{FullName}_Resume.pdf`
      └─ Button → success state (check icon + "Downloaded!" for 1.5 s)
         [Zero network requests during this entire flow]
```

### 3.2 Returning Visitor (localStorage restore)

```
[Navigate to /builder]
  │
  ├─ useEffect on mount → store.loadFromLocalStorage()
  ├─ localStorage key: 'resume-builder-data'
  ├─ Zod validates parsed data → set store
  ├─ All form fields hydrate
  └─ Preview renders immediately with saved data
     [User continues editing from where they left off]
```

### 3.3 Template Gallery → Builder with Pre-Selected Template

```
[/templates page]
  │
  ├─ User browses 5 template cards with sample data previews
  ├─ Clicks "Use This Template" on, e.g., Classic
  │
  ▼
[/builder?template=classic]
  │
  ├─ useEffect reads URLSearchParams.get('template')
  ├─ store.updateTemplate('classic')
  └─ Builder opens with Classic template pre-selected
```

### 3.4 Template Switching (inside builder)

```
[Builder open]
  │
  ├─ User clicks template selector (dropdown in toolbar, or thumbnail grid)
  ├─ Each option shows template name; thumbnails optional
  ├─ User selects "Creative"
  │   └─ store.updateTemplate('creative')
  ├─ Preview re-renders immediately (≤200 ms)
  └─ No data is lost; accent color preserved
```

### 3.5 New Resume (Clear + Start Fresh)

```
[User clicks "New Resume" in toolbar overflow menu]
  │
  ├─ AlertDialog: "Start a new resume?"
  │   "This will clear your current resume. This action cannot be undone."
  │   [Cancel] [Start Fresh]
  │
  ├─ If "Start Fresh":
  │   ├─ store.reset() → clears localStorage + Zustand state
  │   ├─ store.createNewResume() → empty resume
  │   └─ Editor resets; preview shows empty state
  └─ If "Cancel": dialog closes, no change
```

### 3.6 Share / Shareable Link Flow (F007)

```
[User clicks "Share" in toolbar]
  │
  ├─ Validate: resume has at least fullName
  │   └─ If empty: Toast "Add your name before sharing"
  │
  ├─ pako lazy-loads (if first share)
  ├─ store.generateShareableURL():
  │   ├─ JSON.stringify(resume)
  │   ├─ pako.deflate(jsonString) → compressed bytes
  │   ├─ base64url.encode(bytes) → encoded string
  │   └─ URL = origin + "/preview#" + encoded
  │
  ├─ Copy URL to clipboard (navigator.clipboard.writeText)
  ├─ Toast: "Link copied to clipboard!"
  └─ Button → success state (check icon + "Copied!" for 2 s)
```

### 3.7 Opening a Shared Link (`/preview#<encoded>`)

```
[Recipient opens /preview#<encoded-data>]
  │
  ├─ useEffect reads window.location.hash
  ├─ base64url.decode(hash) → compressed bytes
  ├─ pako.inflate(bytes) → JSON string
  ├─ JSON.parse → raw object
  ├─ resumeSchema.safeParse(raw)
  │   ├─ If valid: render <TemplateRenderer> (read-only)
  │   └─ If invalid: show error state + CTA to build own resume
  │
  └─ Always shows: "Build Your Own — It's Free" CTA banner (non-blocking)
     [Zero network requests; data decoded entirely client-side]
```

### 3.8 JSON Export / Import (F008)

```
EXPORT:
[User clicks "Export JSON" in toolbar overflow menu]
  ├─ store.exportAsJSON() → JSON string
  ├─ Blob URL created: new Blob([json], {type: 'application/json'})
  ├─ <a> click → browser downloads: `resume-data.json`
  └─ Toast: "Resume data exported"

IMPORT:
[User clicks "Import JSON"]
  ├─ Hidden <input type="file" accept=".json"> triggered
  ├─ FileReader reads file as text
  ├─ JSON.parse(text)
  ├─ resumeSchema.safeParse(parsed)
  │   ├─ If valid: store.setResume(validated) → form + preview update
  │   └─ If invalid: Toast error "Invalid resume format — check the file structure"
  └─ No existing data overwritten on failure
```

### 3.9 Dark Mode Toggle

```
[User clicks theme toggle (sun/moon icon)]
  │
  ├─ Toggle applies/removes .dark class on <html>
  ├─ Preference stored in localStorage: 'theme' = 'dark' | 'light'
  ├─ All UI tokens update via CSS custom properties
  └─ Resume canvas always stays white-background (print-accurate)
     [No page reload; CSS variables handle everything]
```

### 3.10 Print Flow (F009)

```
[User presses Ctrl+P / Cmd+P on /builder]
  │
  ├─ @media print styles activate:
  │   ├─ Editor panel hidden: display: none
  │   ├─ Builder toolbar hidden
  │   ├─ Preview panel fills full page
  │   └─ Resume canvas renders at 100% (no transform scale)
  └─ User prints or saves as PDF via browser print dialog
```

---

## 4. Page Layouts

### 4.1 Landing Page (`/`)

Complete section order:

```
1. [Skip to main content] (sr-only)
2. HERO — anti-paywall badge, h1, subtitle, CTAs
3. FEATURES — 2×2 icon card grid (F002, F004, F003, F005)
4. TEMPLATE SHOWCASE — live preview of all 5 templates with sample data
5. TRUST SIGNALS — privacy, speed, ATS badges/stats
6. FAQ — shadcn Accordion, 5–7 Q&A items
7. CTA FOOTER BAND — final "Build Your Resume — It's Free" CTA
8. FOOTER — links, affiliate disclosure, privacy policy note
```

#### Hero Section

```
┌──────────────────────────────────────────────────┐
│  bg-gradient-to-br from-slate-900 via-slate-800  │
│  px-4 py-24 sm:px-6 lg:px-8                     │
│                                                  │
│         [Anti-paywall pill badge]                │
│    h1: "Free Resume Builder"                     │
│    p: "Professional templates. Real-time…"       │
│    p: "No email. No account. No '$1.95…'"        │
│                                                  │
│    [Build Your Resume — It's Free →]             │
│    [Learn More]                                  │
└──────────────────────────────────────────────────┘
```

- Primary CTA: `href="/builder"`, `bg-white text-slate-900 hover:bg-slate-100`
- Secondary CTA: `href="#features"`, `border border-white text-white hover:bg-white/10`
- Mobile: CTAs stack full-width `flex-col gap-4`
- Tablet+: CTAs side-by-side `sm:flex-row sm:justify-center gap-4`

#### Features Section

```
┌──────────────────────────────────────────────────┐
│  id="features"  py-24 px-4–8                     │
│  h2: "Everything you need" (centered)            │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐              │
│  │ 👁 Real-time  │  │ ↓ Instant PDF│              │
│  │   Preview    │  │   Download   │              │
│  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐              │
│  │ ⚡ 5 Templates│  │ 🔒 100% Client│              │
│  │              │  │   -Side      │              │
│  └──────────────┘  └──────────────┘              │
│                                                  │
│  grid gap-8 md:grid-cols-2                       │
└──────────────────────────────────────────────────┘
```

#### Template Showcase Section

```
┌──────────────────────────────────────────────────┐
│  py-24  bg-muted/30                              │
│  h2: "5 Professional Templates" (centered)       │
│  p: "Switch instantly. No data lost."            │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ [Modern] [Classic] [Minimal] [Creative]  │    │
│  │ [Professional]   ← tab bar               │    │
│  ├──────────────────────────────────────────┤    │
│  │ Live template preview with sample data   │    │
│  │ (scaled down resume canvas, read-only)   │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  [Use This Template →] → /builder?template=X     │
└──────────────────────────────────────────────────┘
```

#### Trust Signals Section

```
┌──────────────────────────────────────────────────┐
│  py-16  border-y border-border                   │
│  grid grid-cols-2 md:grid-cols-4 gap-8          │
│                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │🔒 100%  │ │⚡ <200ms│ │📄 ATS  │ │0  No   │   │
│  │Private │ │Preview │ │Friendly│ │   Data │   │
│  │        │ │Update  │ │        │ │Uploaded│   │
│  └────────┘ └────────┘ └────────┘ └────────┘   │
└──────────────────────────────────────────────────┘
```

Each trust signal: icon (Lucide) + `text-sm font-semibold` heading + `text-xs text-muted-foreground` sub-copy.

#### FAQ Section

```
┌──────────────────────────────────────────────────┐
│  py-24  max-w-2xl mx-auto                        │
│  h2: "Frequently Asked Questions"                │
│                                                  │
│  <Accordion type="multiple">                     │
│  ┌──────────────────────────────────────────┐    │
│  │ Is this really free? [+]                 │    │
│  ├──────────────────────────────────────────┤    │
│  │ How is my data stored? [+]               │    │
│  ├──────────────────────────────────────────┤    │
│  │ Can I use this on mobile? [+]            │    │
│  ├──────────────────────────────────────────┤    │
│  │ Are resumes ATS-compatible? [+]          │    │
│  ├──────────────────────────────────────────┤    │
│  │ How do shareable links work? [+]         │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

#### Footer

```
┌──────────────────────────────────────────────────┐
│  border-t border-border bg-muted/50 py-12 px-4  │
│                                                  │
│  Logo + tagline (left)     Links (right)         │
│                            Privacy Policy        │
│                            Affiliate Disclosure  │
│                            GitHub                │
│                                                  │
│  p: "Made to be the anti-Zety."                  │
│  p: "© 2026 Free Resume Builder"                 │
│                                                  │
│  Affiliate disclosure:                           │
│  "This site earns commission from Kickresume     │
│   affiliate links. PDF download is always free." │
└──────────────────────────────────────────────────┘
```

#### Landing Layout — Breakpoints

| Element | Mobile (0–639px) | sm (640–767px) | md (768px+) | lg (1024px+) |
|---------|-----------------|----------------|-------------|--------------|
| Hero padding | `py-16 px-4` | `py-20 px-6` | `py-24 px-8` | Same |
| H1 size | `text-4xl` | `text-5xl` | `text-5xl` | `text-6xl` |
| CTA layout | `flex-col w-full` | `flex-row` | Same | Same |
| Feature grid | `grid-cols-1` | `grid-cols-1` | `grid-cols-2` | Same |
| Trust signals | `grid-cols-2` | `grid-cols-2` | `grid-cols-4` | Same |
| Template showcase tabs | scrollable | scrollable | full-width | full-width |
| Max content width | `100%` | `100%` | `100%` | `max-w-4xl mx-auto` |

---

### 4.2 Builder Page (`/builder`)

#### Overall Shell

```
┌──────────────────────────────────────────────────────────────┐
│  [Skip to main content]                                      │
├──────────────────────────────────────────────────────────────┤
│  BUILDER TOOLBAR (sticky h-14 z-40)                         │
├──────────────────────────────────────────────────────────────┤
│  EDITOR PANEL (left)          │  PREVIEW PANEL (right)       │
│  480px · border-r · scroll    │  flex-1 · bg-muted/30        │
│                               │  overflow-auto               │
└──────────────────────────────────────────────────────────────┘
```

#### Builder Toolbar (Desktop)

```
┌──────────────────────────────────────────────────────────────┐
│  h-14  px-4  border-b  bg-background  sticky top-0  z-40    │
│                                                              │
│ [← Logo]  [Template: Modern ▾]  [Accent ■]  [Share] [↓ PDF]│
│                                    [⋮ More: New/Import/Export]│
└──────────────────────────────────────────────────────────────┘
```

- Logo: `text-sm font-semibold` + link to `/`
- Template select: shadcn `Select`, `w-[160px]`
- Accent color swatch: small colored circle (`w-6 h-6 rounded-full border-2 border-border`), opens color picker popover
- Share button: `Button variant="outline" size="sm"` with `Share2` icon
- Download PDF: `Button variant="default" size="sm"` with `Download` icon
- More menu (⋮): shadcn `DropdownMenu` containing: New Resume, Import JSON, Export JSON, Print, Dark Mode toggle

#### Builder Toolbar (Mobile `< 768px`)

```
┌─────────────────────────────────────┐
│  [← Back]  "Resume Builder"  [↓]   │
│                               [⋮]   │
└─────────────────────────────────────┘
```

- Back link: `ChevronLeft` icon + hidden text label (goes to `/`)
- Download: icon only (`h-9 w-9`)
- Overflow: `DropdownMenu` with Template, Share, Accent Color, New, Import, Export

#### Editor Panel — Section Tabs

```
┌──────────────────────────────────┐
│  Tabs scrollable (overflow-x)    │
│  [Personal][Exp][Edu][Skills]    │
│  [Projects][Certs]               │
├──────────────────────────────────┤
│  Active tab form content         │
│  overflow-y-auto  p-4  space-y-4 │
│                                  │
│  [Form fields for current tab]   │
│                                  │
│  [+ Add Item] button (at bottom) │
└──────────────────────────────────┘
```

Tab trigger badges: show item count on collapsed tabs
- e.g., `Experience (2)` when 2 items exist
- Badge: `bg-muted text-muted-foreground text-xs rounded-full px-1.5 py-0.5`

#### Preview Panel (Desktop)

```
┌──────────────────────────────────────────────────────┐
│  flex-1  bg-muted/30  overflow-auto  p-8             │
│                                                      │
│       ┌────────────────────────────────────┐         │
│       │  id="resume-preview"               │         │
│       │  role="region"                     │         │
│       │  aria-label="Resume preview"       │         │
│       │  aria-live="polite"                │         │
│       │                                    │         │
│       │  w-[816px]  min-h-[1056px]         │         │
│       │  bg-white  shadow-xl               │         │
│       │  mx-auto                           │         │
│       │                                    │         │
│       │  [TemplateRenderer component]      │         │
│       └────────────────────────────────────┘         │
│                                                      │
│  [Affiliate banner — below canvas, subtle]           │
└──────────────────────────────────────────────────────┘
```

#### Mobile Layout (`< 768px`)

Uses Edit/Preview toggle tabs + mobile preview bottom sheet:

```
┌─────────────────────────────────────┐
│  TOOLBAR (sticky)                   │
├─────────────────────────────────────┤
│  [Edit ▶] [Preview]  ← full-width  │
│  (shadcn Tabs, w-full)              │
├─────────────────────────────────────┤
│  [Edit mode: section form tabs]     │
│  OR                                 │
│  [Preview mode: scaled canvas]      │
│  (full-screen, pinch-to-zoom)       │
└─────────────────────────────────────┘
```

- "Preview" tab shows the resume canvas scaled to fit width
- Alternatively: floating "Preview" button that opens `<MobilePreviewSheet />` (bottom sheet, 90vh)
- SPEC F002: "Mobile (<768px): tap 'Preview' → preview shows full-screen in a bottom sheet"

#### Tablet Layout (`768px – 1023px`)

```
┌─────────────────────────────────────┐
│  TOOLBAR                            │
├─────────────────────────────────────┤
│  EDITOR PANEL (45vh)                │
│  (full-width, scrollable)           │
├─────────────────────────────────────┤
│  PREVIEW PANEL (55vh)               │
│  (full-width, canvas scaled to fit) │
└─────────────────────────────────────┘
```

#### Desktop Layout (`≥ 1024px`)

```
┌─────────────────────────────────────────────────────────────┐
│  TOOLBAR (sticky)                                           │
├──────────────────────┬──────────────────────────────────────┤
│  EDITOR PANEL        │  PREVIEW PANEL                       │
│  w-[480px]           │  flex-1                              │
│  h-[calc(100vh-3.5   │  h-[calc(100vh-3.5rem)]             │
│  rem)]               │  overflow-auto                       │
│  overflow-y-auto     │                                      │
│  border-r            │  Resume canvas: w-[816px], centered  │
│  border-border       │  transform: scale(scaleX)            │
└──────────────────────┴──────────────────────────────────────┘
```

Canvas scale formula:
```ts
const scale = Math.min(1, (previewPanelWidth - 64) / 816)
// 64 = 32px padding each side
// Applied as: style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
```

---

### 4.3 Preview Page (`/preview`)

Read-only resume view from a shareable link. Data decoded from URL hash.

```
┌──────────────────────────────────────────────────────┐
│  PREVIEW HEADER (sticky h-14)                        │
│  Logo (left)          [Build Yours — Free →] (right)│
├──────────────────────────────────────────────────────┤
│  bg-muted/30  py-8  overflow-auto                    │
│                                                      │
│       ┌──────────────────────────────────┐           │
│       │  Resume Canvas (read-only)       │           │
│       │  Same render as builder preview  │           │
│       └──────────────────────────────────┘           │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  PREVIEW CTA BANNER (below canvas)           │   │
│  │  "Like this resume? Build yours free →"      │   │
│  │  [Start Building — No Account Needed]        │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

- No edit controls; all form fields absent
- Download PDF button still present (they can download someone else's resume as PDF)
- Error state: if hash is missing/invalid, show centered error card + CTA

---

### 4.4 Template Gallery Page (`/templates`)

Static RSC page. Good for SEO ("free resume templates").

```
┌──────────────────────────────────────────────────┐
│  HEADER (shared component)                       │
├──────────────────────────────────────────────────┤
│  HERO BAND                                       │
│  h1: "5 Free Professional Resume Templates"      │
│  p: "ATS-optimized. Download instantly."         │
├──────────────────────────────────────────────────┤
│  TEMPLATE GRID                                   │
│  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3       │
│                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ Modern      │ │ Classic     │ │ Minimal     ││
│  │ [preview]   │ │ [preview]   │ │ [preview]   ││
│  │             │ │             │ │             ││
│  │ "Clean sans │ │ "Traditional│ │ "Max white- ││
│  │ serif…"     │ │ single col" │ │ space…"     ││
│  │             │ │             │ │             ││
│  │[Use Template│ │[Use Template│ │[Use Template││
│  │     →]      │ │     →]      │ │     →]      ││
│  └─────────────┘ └─────────────┘ └─────────────┘│
│  ┌─────────────┐ ┌─────────────┐                │
│  │ Creative    │ │Professional │                │
│  │             │ │             │                │
│  │[Use Template│ │[Use Template│                │
│  │     →]      │ │     →]      │                │
│  └─────────────┘ └─────────────┘                │
├──────────────────────────────────────────────────┤
│  CTA FOOTER BAND                                 │
│  "Not sure which to pick? Start with Modern →"  │
└──────────────────────────────────────────────────┘
```

- Template previews: scaled resume canvas with `lib/templates/sample-data.ts`
- "Use This Template" → `href="/builder?template=[name]"`
- Template card hover: `hover:shadow-md transition-shadow`
- Template card focus: `focus-within:ring-2 focus-within:ring-ring`

---

## 5. Component Specs

### 5.1 `<BuilderToolbar />` (`components/builder/builder-toolbar.tsx`)

**shadcn:** `Button`, `Select`, `DropdownMenu`, `Popover`, `Tooltip`

```tsx
<header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background px-4">
  {/* Logo / Back */}
  <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-foreground mr-2">
    <FileText className="h-4 w-4" aria-hidden="true" />
    <span className="hidden sm:inline">Resume Builder</span>
  </Link>

  <Separator orientation="vertical" className="h-5 hidden sm:block" />

  {/* Template Select (desktop) */}
  <div className="hidden md:flex items-center gap-2">
    <span className="text-xs text-muted-foreground">Template:</span>
    <Select value={template} onValueChange={updateTemplate}>
      <SelectTrigger className="h-8 w-[148px] text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {RESUME_TEMPLATES.map((t) => (
          <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Accent Color */}
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Pick accent color">
        <span
          className="h-5 w-5 rounded-full border-2 border-border"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[220px] p-3">
      <AccentColorPicker />
    </PopoverContent>
  </Popover>

  <div className="flex-1" />

  {/* Theme Toggle */}
  <ThemeToggle />

  {/* Share */}
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="sm" className="h-8 hidden sm:flex" onClick={handleShare}>
        <Share2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
        Share
      </Button>
    </TooltipTrigger>
    <TooltipContent>Generate a shareable link</TooltipContent>
  </Tooltip>

  {/* Download */}
  <Button size="sm" className="h-8" onClick={handleDownload} disabled={isGenerating} aria-busy={isGenerating}>
    {isGenerating
      ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      : <Download className="h-3.5 w-3.5" aria-hidden="true" />
    }
    <span className="ml-1.5 hidden sm:inline">
      {isGenerating ? 'Generating…' : 'Download PDF'}
    </span>
  </Button>

  {/* Overflow Menu */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={handleNewResume}>
        <FilePlus className="h-4 w-4 mr-2" /> New Resume
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleImportJSON}>
        <Upload className="h-4 w-4 mr-2" /> Import JSON
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleExportJSON}>
        <FileJson className="h-4 w-4 mr-2" /> Export JSON
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => window.print()}>
        <Printer className="h-4 w-4 mr-2" /> Print
      </DropdownMenuItem>
      {/* Mobile-only items */}
      <DropdownMenuItem className="md:hidden" onClick={openTemplateSheet}>
        <LayoutTemplate className="h-4 w-4 mr-2" /> Change Template
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</header>
```

**Toolbar button states summary:**

| Button | Idle | Loading | Success | Error |
|--------|------|---------|---------|-------|
| Download | Default | Spinner + "Generating…" + `disabled` | Check + "Downloaded!" (1.5 s) | `AlertCircle` + "Try Again" |
| Share | Outline | Spinner + "Copying…" | Check + "Copied!" (2 s) | Toast error |

---

### 5.2 `<SectionTabs />` (`components/builder/form-panel.tsx`)

**shadcn:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Badge`

```tsx
<Tabs defaultValue="personal" className="flex flex-col h-full">
  <TabsList
    className="w-full justify-start overflow-x-auto rounded-none border-b border-border
               bg-background px-4 h-10 gap-0 scrollbar-hide"
    aria-label="Resume sections"
  >
    {[
      { value: 'personal', label: 'Personal', icon: User },
      { value: 'experience', label: 'Experience', count: experiences.length },
      { value: 'education', label: 'Education', count: education.length },
      { value: 'skills', label: 'Skills', count: skills.length },
      { value: 'projects', label: 'Projects', count: projects.length },
      { value: 'certifications', label: 'Certifications', count: certifications.length },
    ].map(({ value, label, count }) => (
      <TabsTrigger
        key={value}
        value={value}
        className="h-10 rounded-none border-b-2 border-transparent px-3 text-xs
                   data-[state=active]:border-primary data-[state=active]:text-foreground
                   text-muted-foreground whitespace-nowrap"
      >
        {label}
        {count > 0 && (
          <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]
                           leading-none text-muted-foreground">
            {count}
          </span>
        )}
      </TabsTrigger>
    ))}
  </TabsList>

  <div className="flex-1 overflow-y-auto">
    <TabsContent value="personal" className="p-4 mt-0 space-y-4">
      <PersonalInfoForm />
    </TabsContent>
    {/* … other tabs */}
  </div>
</Tabs>
```

---

### 5.3 `<PersonalInfoForm />` (`components/builder/sections/personal-info-form.tsx`)

**shadcn:** `Input`, `Textarea`, `Label`

```
Field layout (responsive grid):
┌──────────────────────────────────────┐
│ Full Name *              (full-width) │
├─────────────────┬────────────────────┤
│ Email *         │ Phone              │
├─────────────────┼────────────────────┤
│ Location        │ Website            │
├─────────────────┼────────────────────┤
│ LinkedIn        │ GitHub             │
├──────────────────────────────────────┤
│ Professional Summary    (full-width, │
│                          rows=4)     │
└──────────────────────────────────────┘
```

- 2-col grid at `sm:` breakpoint (`grid-cols-1 gap-4 sm:grid-cols-2`)
- Required fields (`fullName`, `email`): `aria-required="true"`, visual `*` with `aria-hidden="true"`
- Email field: `type="email"`, Zod `z.string().email()` validation on blur
- Website/LinkedIn/GitHub: `type="url"`, Zod URL validation on blur
- Summary: `<Textarea rows={4} className="resize-y min-h-[100px]" />`

---

### 5.4 `<SectionEntry />` (`components/builder/section-entry.tsx`)

Reusable collapsible wrapper for Experience, Education, Projects, Certifications.

**shadcn:** `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`, `Button`, `AlertDialog`

```tsx
<AccordionItem value={id} className="border border-border rounded-md mb-2">
  <AccordionTrigger
    className="flex items-center gap-2 px-3 py-3 text-sm font-medium hover:no-underline
               hover:bg-muted/50 rounded-t-md [&[data-state=open]]:rounded-b-none"
  >
    {/* Drag handle (future DnD) */}
    <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 cursor-grab"
                  aria-hidden="true" />
    {/* Item title */}
    <span className="flex-1 text-left text-sm truncate">{primaryLabel}</span>
    {/* Optional secondary label */}
    {secondaryLabel && (
      <span className="text-xs text-muted-foreground mr-2 hidden sm:block">{secondaryLabel}</span>
    )}
    {/* Delete button */}
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10
                 flex-shrink-0"
      onClick={(e) => { e.stopPropagation(); setShowDeleteDialog(true) }}
      aria-label={`Delete ${primaryLabel}`}
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
    </Button>
  </AccordionTrigger>
  <AccordionContent className="px-3 pb-4 pt-2">
    {children}
  </AccordionContent>
</AccordionItem>

{/* Delete confirmation */}
<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete "{primaryLabel}"?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={onDelete}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### Experience Form Fields

```
Job Title *            (full-width)
Company *  |  Location (2-col sm+)
Start Date |  End Date (2-col sm+; date inputs type="month")
[✓] Currently Working Here  (Checkbox + Label; hides End Date when checked)
Description            (Textarea, rows=5, resize-y)
Hint: "Use bullet points starting with action verbs"
```

#### Education Form Fields

```
School *        (full-width)
Degree *  |  Field of Study  (2-col sm+)
Start Date  |  End Date       (2-col sm+)
GPA (optional)  (full-width, max 10 chars)
```

#### Project Form Fields

```
Title *                     (full-width)
Project Link (URL)           (full-width)
Technologies (comma-separated Input with tag-display below)
Start Date  |  End Date      (2-col sm+)
Description                  (Textarea, rows=3)
```

#### Certification Form Fields

```
Certification Name *  (full-width)
Issuer *              (full-width)
Issue Date *  |  Expiration Date  (2-col sm+; optional expiry)
Credential URL        (full-width, type="url")
```

---

### 5.5 `<SkillsForm />` (`components/builder/sections/skills-form.tsx`)

Inline add-row (no accordion; skills are brief):

```tsx
<div className="space-y-1 p-4">
  {/* Existing skills */}
  {skills.map((skill) => (
    <div key={skill.id} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
      <span className="flex-1 text-sm">{skill.name}</span>
      <SkillLevelBadge level={skill.level} />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        aria-label={`Remove ${skill.name}`}
        onClick={() => removeSkill(skill.id)}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  ))}

  {/* Inline add row */}
  <div className="flex items-center gap-2 pt-3">
    <Input
      placeholder="Skill name"
      className="flex-1 h-8 text-sm"
      value={newSkillName}
      onChange={(e) => setNewSkillName(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
      aria-label="New skill name"
    />
    <Select value={newSkillLevel} onValueChange={setNewSkillLevel}>
      <SelectTrigger className="w-[130px] h-8 text-xs" aria-label="Skill level">
        <SelectValue placeholder="Level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="beginner">Beginner</SelectItem>
        <SelectItem value="intermediate">Intermediate</SelectItem>
        <SelectItem value="advanced">Advanced</SelectItem>
        <SelectItem value="expert">Expert</SelectItem>
      </SelectContent>
    </Select>
    <Button size="sm" className="h-8 px-3" onClick={handleAddSkill}
            aria-label="Add skill">
      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
    </Button>
  </div>
</div>
```

**Skill level badge colors:**

| Level | Tailwind classes |
|-------|-----------------|
| `beginner` | `bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300` |
| `intermediate` | `bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300` |
| `advanced` | `bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300` |
| `expert` | `bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300` |

---

### 5.6 `<AccentColorPicker />` (`components/ui/color-picker.tsx`)

**shadcn:** `Popover`, `Input`, `Label`, `Button`

```tsx
// 12 preset swatches in a 4×3 grid
<div className="space-y-3">
  <Label className="text-xs font-medium text-muted-foreground">Accent Color</Label>
  <div className="grid grid-cols-6 gap-2">
    {ACCENT_COLORS.map(({ hex, name }) => (
      <button
        key={hex}
        className={cn(
          "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
          accentColor === hex ? "border-foreground scale-110" : "border-transparent"
        )}
        style={{ backgroundColor: hex }}
        onClick={() => updateAccentColor(hex)}
        aria-label={`${name} accent color${accentColor === hex ? ' (selected)' : ''}`}
        aria-pressed={accentColor === hex}
      />
    ))}
  </div>
  {/* Custom hex input */}
  <div className="flex items-center gap-2">
    <div className="h-7 w-7 rounded-full border border-border flex-shrink-0"
         style={{ backgroundColor: accentColor }} aria-hidden="true" />
    <Input
      value={accentColor}
      onChange={(e) => handleHexInput(e.target.value)}
      className="h-7 text-xs font-mono"
      placeholder="#2563EB"
      maxLength={7}
      aria-label="Custom accent color hex value"
    />
  </div>
  {/* Low contrast warning */}
  {lowContrast && (
    <p className="text-xs text-amber-600 flex items-center gap-1" role="alert">
      <AlertCircle className="h-3 w-3" aria-hidden="true" />
      Low contrast — may be hard to read when printed
    </p>
  )}
</div>
```

---

### 5.7 `<TemplateSwitcher />` (Inline in toolbar / Sheet on mobile)

**shadcn:** `Select` (desktop) / `Sheet` (mobile)

```tsx
// Desktop: Select component in toolbar (see BuilderToolbar above)

// Mobile Sheet trigger (in overflow menu):
<Sheet>
  <SheetTrigger asChild>
    <DropdownMenuItem>
      <LayoutTemplate className="h-4 w-4 mr-2" /> Change Template
    </DropdownMenuItem>
  </SheetTrigger>
  <SheetContent side="bottom" className="h-auto rounded-t-xl">
    <SheetHeader>
      <SheetTitle>Choose a Template</SheetTitle>
    </SheetHeader>
    <div className="grid grid-cols-5 gap-3 py-4">
      {RESUME_TEMPLATES.map((t) => (
        <button
          key={t}
          onClick={() => { updateTemplate(t); close() }}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-colors",
            template === t
              ? "border-primary bg-primary/5"
              : "border-transparent hover:border-border"
          )}
          aria-pressed={template === t}
          aria-label={`${t} template`}
        >
          <TemplateThumbnail name={t} className="w-full aspect-[3/4] rounded shadow-sm" />
          <span className="text-[10px] font-medium capitalize">{t}</span>
        </button>
      ))}
    </div>
  </SheetContent>
</Sheet>
```

---

### 5.8 `<MobilePreviewSheet />` (`components/builder/mobile-preview-sheet.tsx`)

**shadcn:** `Sheet`

```tsx
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="bottom" className="h-[90vh] rounded-t-xl p-0">
    <SheetHeader className="border-b border-border px-4 py-3">
      <SheetTitle className="text-sm">Resume Preview</SheetTitle>
      <SheetDescription className="sr-only">
        Read-only preview of your resume
      </SheetDescription>
    </SheetHeader>
    <div className="overflow-auto h-full p-4 bg-muted/30">
      <div
        id="resume-preview"
        role="region"
        aria-label="Resume preview"
        className="bg-white shadow-lg mx-auto"
        style={{
          width: 816,
          minHeight: 1056,
          transform: `scale(${mobileScale})`,
          transformOrigin: 'top center',
        }}
      >
        <TemplateRenderer resume={resume} />
      </div>
    </div>
  </SheetContent>
</Sheet>
```

---

### 5.9 `<ResumeCanvas />` (`components/builder/preview-panel.tsx`)

```tsx
<div
  id="resume-preview"
  role="region"
  aria-label="Resume preview"
  aria-live="polite"
  aria-atomic="false"
  className="w-[816px] min-h-[1056px] bg-white mx-auto my-8 shadow-xl print:shadow-none print:my-0"
  style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
>
  <Suspense fallback={<ResumeCanvasSkeleton />}>
    <TemplateRenderer resume={resume} />
  </Suspense>
</div>
```

**Template visual specs (inside canvas — printed content):**

| Template | Layout | Accent usage | Serif? | Notes |
|----------|--------|-------------|--------|-------|
| Modern | Single-column + skills sidebar (2-col) | Section heading underlines, links | No | Accent color from `accentColor` |
| Classic | Single-column | Horizontal rules | Yes (headings) | Dark, traditional feel |
| Minimal | Single-column | None (pure black) | No | Maximum whitespace |
| Creative | Bold accent header block | Header background, icon bullets | No | Most visually distinctive |
| Professional | 2-col (dark sidebar + main) | Sidebar background | No | Corporate-appropriate |

---

### 5.10 `<FormField />` (reusable wrapper)

```tsx
interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

// Rendered:
<div className="space-y-1.5">
  <Label htmlFor={htmlFor} className="text-sm font-medium leading-none">
    {label}
    {required && (
      <span aria-hidden="true" className="text-destructive ml-0.5">*</span>
    )}
  </Label>
  {children}
  {error && (
    <p id={`${htmlFor}-error`} className="flex items-center gap-1 text-xs text-destructive" role="alert">
      <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      {error}
    </p>
  )}
  {hint && !error && (
    <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground">{hint}</p>
  )}
</div>
```

Input receives: `aria-describedby={error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined}`

---

### 5.11 `<DownloadButton />`

```tsx
type DownloadState = 'idle' | 'generating' | 'success' | 'error'

const labels: Record<DownloadState, string> = {
  idle: 'Download resume as PDF',
  generating: 'Generating PDF, please wait',
  success: 'Resume downloaded successfully',
  error: 'PDF generation failed. Click to try again',
}

<Button
  size="sm"
  disabled={state === 'generating'}
  aria-label={labels[state]}
  aria-busy={state === 'generating'}
  onClick={handleDownload}
>
  {state === 'idle'       && <Download className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />}
  {state === 'generating' && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" aria-hidden="true" />}
  {state === 'success'    && <Check className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />}
  {state === 'error'      && <AlertCircle className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />}
  <span className="hidden sm:inline">
    {state === 'idle'       && 'Download PDF'}
    {state === 'generating' && 'Generating…'}
    {state === 'success'    && 'Downloaded!'}
    {state === 'error'      && 'Try Again'}
  </span>
</Button>
```

---

### 5.12 `<ThemeToggle />` (`components/shared/theme-toggle.tsx`)

**shadcn:** `Button`, `Tooltip`

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark
        ? <Sun className="h-4 w-4" aria-hidden="true" />
        : <Moon className="h-4 w-4" aria-hidden="true" />
      }
    </Button>
  </TooltipTrigger>
  <TooltipContent>{isDark ? 'Light mode' : 'Dark mode'}</TooltipContent>
</Tooltip>
```

---

### 5.13 `<AffiliateBanner />` (`components/shared/affiliate-banner.tsx`)

Shown below the resume canvas in the preview panel (desktop). Never overlaps the canvas. Never shown on `/preview` page.

```tsx
<div className="mx-auto mt-4 max-w-[816px] rounded-md border border-border bg-card p-3
                flex items-center justify-between gap-4 text-sm">
  <div>
    <p className="font-medium">Want AI-powered suggestions?</p>
    <p className="text-xs text-muted-foreground">Try Kickresume for resume content ideas.</p>
  </div>
  <Button
    variant="outline"
    size="sm"
    asChild
    className="flex-shrink-0"
  >
    <a
      href="https://www.kickresume.com/?ref=freeresume"
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label="Try Kickresume (affiliate link, opens in new tab)"
    >
      Try Kickresume
      <ExternalLink className="ml-1.5 h-3 w-3" aria-hidden="true" />
    </a>
  </Button>
</div>
```

Rules per SPEC:
- Never before PDF download
- Never in the PDF itself
- Never as a pop-up or interstitial
- Clearly labeled as affiliate (via `rel="sponsored"` + disclosure in footer)

---

### 5.14 `<FeatureCard />` (Landing)

```tsx
<div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow duration-200">
  <div className={cn("mb-4 inline-block rounded-lg p-3", iconBg)}>
    <Icon className={cn("h-6 w-6", iconColor)} aria-hidden="true" />
  </div>
  <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
  <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
</div>
```

---

### 5.15 `<AntiPaywallBadge />`

```tsx
<div
  role="note"
  aria-label="This site is genuinely free — no paywall"
  className="mb-6 inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700"
>
  Unlike Zety — we don't lock your PDF behind a subscription
</div>
```

---

### 5.16 `<NewResumeDialog />`

**shadcn:** `AlertDialog`

```tsx
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Start a new resume?</AlertDialogTitle>
      <AlertDialogDescription>
        This will clear your current resume. Export your data first if you want to keep it.
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={handleConfirmNew}
      >
        Start Fresh
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### 5.17 `<PreviewCTABanner />` (`/preview` page)

```tsx
<div className="border-t border-border bg-muted/50 py-8 text-center">
  <p className="text-lg font-semibold mb-2">Like this resume? Build yours for free.</p>
  <p className="text-sm text-muted-foreground mb-4">
    No account. No email. No paywall. Takes less than 10 minutes.
  </p>
  <Button asChild>
    <Link href="/builder">
      Start Building — It's Free
      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
    </Link>
  </Button>
</div>
```

---

### 5.18 `<TrustSignal />` (Landing)

```tsx
// One of 4 items in a grid
<div className="flex flex-col items-center text-center gap-2">
  <div className="rounded-full bg-muted p-3">
    <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
  </div>
  <p className="text-sm font-semibold">{title}</p>
  <p className="text-xs text-muted-foreground max-w-[140px]">{description}</p>
</div>
```

| Icon | Title | Description |
|------|-------|-------------|
| `Lock` | 100% Private | Your data never leaves your browser |
| `Zap` | Instant Preview | Updates in under 200ms as you type |
| `CheckCircle` | ATS Friendly | Text is selectable, not rasterized |
| `Globe` | Shareable Links | Share read-only links without accounts |

---

## 6. Accessibility Requirements (WCAG AA)

### 6.1 Color Contrast

All combinations meet WCAG 2.2 AA: 4.5:1 for normal text, 3:1 for large text (≥18pt or ≥14pt bold).

| Combination | Foreground | Background | Ratio | Pass |
|------------|-----------|-----------|-------|------|
| Body text | `#090909` | `#FFFFFF` | 21:1 | ✅ |
| Muted text | `#737373` | `#FFFFFF` | 4.6:1 | ✅ AA |
| Primary button text | `#FAFAFA` | `#171717` | 18.1:1 | ✅ |
| Hero body (slate-300) | `#CBD5E1` | `#0F172A` | 9.5:1 | ✅ |
| Hero h1 | `#FFFFFF` | `#0F172A` | 19.1:1 | ✅ |
| Anti-paywall badge | `#B91C1C` (red-700) | `#FEF2F2` (red-50) | 6.1:1 | ✅ |
| Destructive button | `#FAFAFA` | `#F05252` | 4.7:1 | ✅ |
| Error text | `#F05252` | `#FFFFFF` | 3.5:1 | ✅ (bold) |
| Tab trigger (active) | `#090909` | `#FFFFFF` | 21:1 | ✅ |
| Tab trigger (muted) | `#737373` | `#FFFFFF` | 4.6:1 | ✅ AA |
| Skill badge beginner | `#475569` | `#F1F5F9` | 5.3:1 | ✅ |
| Skill badge intermediate | `#1D4ED8` | `#EFF6FF` | 7.2:1 | ✅ |
| Skill badge advanced | `#6D28D9` | `#F5F3FF` | 6.8:1 | ✅ |
| Skill badge expert | `#15803D` | `#F0FDF4` | 7.5:1 | ✅ |

> Placeholder text (#A3A3A3 on white = 2.6:1) is exempt from WCAG 1.4.3 as it is not functional content.

### 6.2 Focus Styles

```css
/* globals.css */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

- Focus ring: `#090909` (light mode), `#D4D4D4` (dark mode) — both exceed 3:1 contrast against page background
- Never `outline: none` without an equivalent visible replacement
- Accordion triggers retain focus ring on keyboard navigation
- Sheet/Dialog: focus trapped inside while open, restored to trigger on close

### 6.3 Keyboard Navigation

#### Tab Order — Landing

1. Skip-to-content link (sr-only until focused)
2. "Build Your Resume" CTA (hero)
3. "Learn More" anchor
4. Feature cards (if wrapped in `<a>`)
5. Template showcase tab triggers (←→ arrow keys)
6. "Use This Template" buttons
7. Trust signal items
8. FAQ accordion triggers
9. Final CTA button
10. Footer links

#### Tab Order — Builder

1. Skip-to-content link
2. Logo / back link
3. Template Select
4. Accent color swatch (Popover trigger)
5. Theme toggle
6. Share button
7. Download PDF button
8. Overflow menu trigger (⋮)
9. Section tab triggers (←→ within tab list)
10. All form fields in active tab (top to bottom)
11. Add-item button
12. Accordion triggers within section (↑↓ not required; Tab cycles through)
13. Delete buttons within accordion items

#### Component Keyboard Interactions

| Component | Key | Action |
|-----------|-----|--------|
| `<Tabs>` tab list | `←` `→` | Move focus between tabs, auto-activate |
| `<Accordion>` trigger | `Enter` / `Space` | Toggle open/close |
| `<Select>` | `↑` `↓` | Navigate options when open |
| `<Select>` | `Enter` / `Space` | Open; confirm selection |
| `<AlertDialog>` | `Esc` | Close (Cancel) |
| `<Sheet>` | `Esc` | Close |
| `<Popover>` | `Esc` | Close |
| `<DropdownMenu>` | `↑` `↓` | Navigate items |
| `<DropdownMenu>` | `Enter` | Activate item |
| Skill add row `<Input>` | `Enter` | Add skill (same as clicking + button) |
| Color swatch buttons | `Enter` / `Space` | Select color |
| Template thumbnail buttons | `Enter` / `Space` | Select template |

### 6.4 ARIA Attributes Reference

| Element | ARIA attributes |
|---------|----------------|
| Skip link | Points to `id="main-content"` |
| Builder `<main>` | `id="main-content"` |
| Section tabs list | `role="tablist"`, `aria-label="Resume sections"` |
| Tab triggers | `role="tab"`, `aria-selected`, `aria-controls` |
| Tab panels | `role="tabpanel"`, `aria-labelledby` |
| Accordion items | `aria-expanded`, `aria-controls` on trigger |
| Resume canvas | `role="region"`, `aria-label="Resume preview"`, `aria-live="polite"`, `aria-atomic="false"` |
| Template announce | Hidden `aria-live="polite"` region: `"[name] template selected"` |
| Download button | `aria-busy={generating}`, `aria-label` (changes per state) |
| Share button | `aria-label` (changes per state) |
| Delete buttons | `aria-label="Delete [item name]"` |
| Template thumbnails | `aria-pressed={selected}`, `aria-label="[name] template"` |
| Color swatches | `aria-pressed={selected}`, `aria-label="[name] accent color (selected)"` |
| Required field `*` | `aria-hidden="true"` on `*`; field has `aria-required="true"` |
| Error messages | `role="alert"`, `id` linked via `aria-describedby` on input |
| Empty states | `role="status"` |
| Anti-paywall badge | `role="note"` |
| Feature/trust icons | `aria-hidden="true"` (decorative) |
| Affiliate link | `aria-label="Try Kickresume (affiliate link, opens in new tab)"` |
| Toast (info/success) | `role="status"` (Sonner default) |
| Toast (error) | `role="alert"` (Sonner default) |

### 6.5 Touch Targets

Minimum **44×44 CSS px** for all interactive elements (WCAG 2.5.5):

| Component | Minimum size | Implementation |
|-----------|-------------|----------------|
| Primary CTA buttons | 48px height | `h-12 px-8` |
| Default `<Button>` | 40px height | Use `h-11` where touch is expected |
| Icon buttons in toolbar | 44×44px | `h-8 w-8` + `p-1` wrapper, or `h-11 w-11` |
| Section tab triggers | 40px height | Add `py-2` → use `h-11` |
| Accordion triggers | 44px height | `py-3` (full-width row) |
| Delete (trash) buttons | 44×44px | `h-11 w-11` ghost on mobile; `h-7 w-7` on desktop (acceptable — larger drag target on whole accordion row) |
| Checkbox | 44×44px | Extend click target via `<Label>` |
| Template thumbnails | 80×100px | Exceeds minimum |
| Color swatches | 28×28px on desktop; 36×36px on mobile | `h-7 w-7` → `h-9 w-9 sm:h-7 sm:w-7` |
| Skills delete (X) | 44×44px on mobile | `h-11 w-11 sm:h-7 sm:w-7` |

### 6.6 Screen Reader Experience

- Resume preview `aria-live="polite"` announces changes after typing stops (debounced 1 s)
- `aria-atomic="false"` so SR reads only changed content, not entire canvas
- Template switches announced: hidden `<span aria-live="polite" className="sr-only">{announcedTemplate} template selected</span>`
- PDF generation progress: button label changes are announced via `aria-label` updates
- Skill level badge text is visible (not just color-coded) — screen readers read "Intermediate"
- Date fields: `type="month"` with descriptive labels (don't rely on placeholder for format)
- "Currently Working" checkbox: hides End Date field — `<div aria-hidden={currentlyWorking}>`

### 6.7 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Accordion */
  [data-state="open"],
  [data-state="closed"] {
    animation: none !important;
    transition: none !important;
  }
  /* Spinner */
  .animate-spin {
    animation: none;
    opacity: 0.7;
  }
  /* Scale transitions on template switch */
  .resume-preview-wrapper {
    transition: none !important;
  }
}
```

### 6.8 Route Announcements

On client-side navigation (Next.js App Router), add a `<RouteAnnouncer />` pattern:

```tsx
// In layout.tsx or as shared component
<div aria-live="assertive" aria-atomic="true" className="sr-only" id="route-announcer">
  {/* Updated with page title on navigation */}
</div>
```

---

## 7. Responsive Breakpoints

Tailwind default breakpoints:

| Breakpoint | Min-width | Label | Key changes |
|-----------|-----------|-------|-------------|
| (default) | 0 | Mobile S | Single column, stacked everything |
| `sm` | 640px | Mobile L / Small tablet | Form fields go 2-col, CTAs go row, toolbar shows text labels |
| `md` | 768px | Tablet | Feature cards 2-col, builder goes stacked (editor / preview), template select in header |
| `lg` | 1024px | Desktop | Builder side-by-side, editor panel fixed 480px |
| `xl` | 1280px | Wide desktop | Preview canvas can render closer to 1:1 scale |

### 7.1 Landing Page

| Element | 0–639px | 640–767px | 768–1023px | 1024px+ |
|---------|---------|-----------|------------|---------|
| H1 | `text-4xl` | `text-5xl` | `text-5xl` | `text-6xl` |
| Hero subtitle | `text-lg` | `text-xl` | `text-xl` | `text-xl` |
| CTA buttons | `flex-col w-full` | `flex-row` | `flex-row` | `flex-row` |
| Feature grid | `grid-cols-1` | `grid-cols-1` | `grid-cols-2` | `grid-cols-2` |
| Trust signals | `grid-cols-2` | `grid-cols-2` | `grid-cols-4` | `grid-cols-4` |
| Template showcase | Single tab, scrollable preview | Same | Full tab row | Full tab row |
| Section padding | `py-16 px-4` | `py-20 px-6` | `py-24 px-6` | `py-24 px-8` |

### 7.2 Builder Page

| Element | 0–767px | 768–1023px | 1024px+ |
|---------|---------|------------|---------|
| Layout | Single panel + Edit/Preview toggle | Stacked (editor top 45vh, preview bottom 55vh) | Side-by-side |
| Editor width | `100%` | `100%` | `w-[480px]` |
| Preview position | Bottom sheet (Sheet component) | Below editor | Right panel |
| Template switcher | In `DropdownMenu` (Sheet on click) | In toolbar (Select) | In toolbar (Select) |
| Download label | Icon only | "Download" | "Download PDF" |
| Share button | In `DropdownMenu` | In toolbar | In toolbar |
| Canvas scale | ~0.35–0.42 | ~0.60–0.75 | ~0.85–1.0 |
| Toolbar height | `h-14` | `h-14` | `h-14` |

### 7.3 Template Gallery (`/templates`)

| Element | 0–639px | 640–1023px | 1024px+ |
|---------|---------|------------|---------|
| Template grid | `grid-cols-1` | `grid-cols-2` | `grid-cols-3` |
| Preview scale | 0.30 | 0.40 | 0.50 |

### 7.4 Preview Page (`/preview`)

| Element | 0–767px | 768–1023px | 1024px+ |
|---------|---------|------------|---------|
| Canvas scale | 0.35–0.45 | 0.60–0.75 | 0.85–1.0 |
| CTA banner | Below canvas, stacked | Below canvas, row | Below canvas, row |

### 7.5 Canvas Scaling Formula

```ts
// hooks/use-media-query.ts provides containerWidth
function getPreviewScale(containerWidth: number): number {
  const CANVAS_WIDTH = 816  // A4 at 96 dpi
  const PADDING = 64        // 32px each side
  return Math.min(1, (containerWidth - PADDING) / CANVAS_WIDTH)
}

// Applied to canvas wrapper:
// style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
// Also set wrapper height to avoid layout collapse:
// style={{ height: scale * 1056 }}  // Collapse parent to scaled height
```

---

## 8. Loading, Empty & Error States

### 8.1 Page Initial Load

#### Landing (`/`)

- Fully server-rendered (RSC): no loading state needed
- Inter font: `display: swap` eliminates FOUT
- LCP target: <2.5 s (SPEC requirement)

#### Builder (`/builder`)

`resume` is `null` during SSR hydration. Show skeleton for ~1 frame:

**Builder Loading Skeleton:**
```tsx
<div className="flex h-[calc(100vh-3.5rem)]">
  {/* Editor skeleton */}
  <div className="w-[480px] border-r border-border p-4 space-y-3 hidden lg:block">
    {/* Tab bar */}
    <div className="flex gap-2 pb-3 border-b border-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-7 w-16 rounded-md" />
      ))}
    </div>
    <Skeleton className="h-5 w-24" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-24 w-full" />
  </div>
  {/* Preview skeleton */}
  <div className="flex-1 flex items-start justify-center pt-8 bg-muted/30 overflow-hidden">
    <Skeleton className="w-[816px] h-[1056px]" />
  </div>
</div>
```

#### Preview Page (`/preview`)

Shows skeleton while decoding URL hash (usually <100 ms):

```tsx
<div className="flex justify-center pt-8">
  <Skeleton className="w-[816px] h-[1056px]" />
</div>
```

#### Template Gallery (`/templates`)

Static RSC: no loading state.

---

### 8.2 Empty States

Every list section shows a purposeful empty state before items are added.

**Pattern:**

```tsx
// Generic empty state component
<div className="flex flex-col items-center justify-center py-12 text-center px-4">
  <div className="mb-3 rounded-full bg-muted p-3">
    <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
  </div>
  <p className="text-sm font-medium text-foreground mb-1">{heading}</p>
  <p className="text-xs text-muted-foreground mb-4 max-w-[240px]">{subheading}</p>
  <Button variant="outline" size="sm" onClick={onAdd}>
    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
    {addLabel}
  </Button>
</div>
```

| Section | Icon | Heading | Subheading | Button label |
|---------|------|---------|------------|--------------|
| Experience | `Briefcase` | No experience added | Add your work history to strengthen your resume | Add Experience |
| Education | `GraduationCap` | No education added | Add your academic background | Add Education |
| Skills | `Zap` | No skills added | List your technical and soft skills | Add Skill |
| Projects | `FolderOpen` | No projects added | Showcase side projects and open-source work | Add Project |
| Certifications | `Award` | No certifications added | Add certifications to verify your expertise | Add Certification |

**Resume Preview — Empty (no name entered):**

```tsx
<div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
  <FileText className="h-20 w-20 mb-4 text-muted-foreground opacity-20" aria-hidden="true" />
  <p className="text-base font-medium text-muted-foreground">Your resume preview will appear here</p>
  <p className="text-sm text-muted-foreground mt-2">
    Start by entering your name in the Personal Info tab.
  </p>
</div>
```

**Template Gallery — No template selected (edge case):**
Falls back to "Modern" — always a valid selection.

---

### 8.3 Loading States

| Context | Loading UI | Duration | Notes |
|---------|-----------|---------|-------|
| Builder initial hydration | Skeleton panels | ~1 render frame | After `useEffect` runs, instant |
| Template component (lazy) | `<ResumeCanvasSkeleton />` via `Suspense` | <200 ms | Only if `React.lazy` is used |
| PDF generation | Button spinner + `disabled`; no overlay | 1–4 s | jsPDF + html2canvas |
| Share link (pako lazy-load) | Share button spinner + "Generating…" | <1 s | One-time lazy load |
| JSON import (file read) | No UI (synchronous) | <50 ms | FileReader is fast |
| URL hash decode (`/preview`) | Full-page skeleton | <100 ms | pako inflate + Zod parse |

**ResumeCanvasSkeleton:**
```tsx
<div className="w-[816px] min-h-[1056px] bg-white p-12 space-y-6">
  {/* Name */}
  <Skeleton className="h-10 w-56" />
  {/* Contact line */}
  <div className="flex gap-4">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-4 w-28" />
  </div>
  {/* Section 1 */}
  <div className="mt-8 space-y-2">
    <Skeleton className="h-6 w-40" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
  {/* Section 2 */}
  <div className="mt-6 space-y-2">
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
</div>
```

**PDF Generation — no overlay; button feedback is sufficient:**
```
Button: [⟳ Generating…] (disabled, aria-busy="true")
Preview canvas: pointer-events-none (prevents interaction during capture)
Scrollbar: hidden on canvas element during html2canvas capture
```

---

### 8.4 Error States

#### localStorage Unavailable or Parse Failure

Caught silently. `createEmptyResume()` used as fallback. Optional toast if in private browsing mode:

```tsx
toast('Changes may not be saved', {
  description: 'Private browsing detected. Your resume won't persist between sessions.',
  duration: 6000,
  icon: <Info className="h-4 w-4 text-amber-600" aria-hidden="true" />,
})
```

#### localStorage Storage Quota Full

```tsx
toast.error('Couldn't save changes', {
  description: 'Browser storage is full. Export your resume as JSON to avoid losing work.',
  duration: 8000,
  action: { label: 'Export JSON', onClick: handleExportJSON },
})
```

#### PDF Generation Failure

```tsx
// Button state → 'error' for 4 s
// Then returns to 'idle'
toast.error('Could not generate PDF', {
  description: 'Please try again. If the issue persists, try refreshing the page.',
  duration: 6000,
  action: { label: 'Retry', onClick: handleDownload },
})
// Focus remains on Download button
```

#### Form Validation — Missing Required Fields (download attempt)

```tsx
// 1. Toast
toast.error('Fill in required fields', {
  description: 'Full Name and Email are required to generate your resume.',
  duration: 4000,
})
// 2. First invalid field receives focus
document.getElementById('fullName')?.focus()
// 3. Field border turns destructive: border-destructive + error message below
```

#### JSON Import — Invalid Format

```tsx
toast.error('Invalid resume format', {
  description: 'The JSON file doesn\'t match the expected resume structure.',
  duration: 5000,
})
// No state change; existing resume preserved
```

#### Shareable Link Decode Failure (`/preview`)

```tsx
// Full-page error state (not a toast — this is the main content)
<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
  <div className="rounded-full bg-destructive/10 p-4 mb-4">
    <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
  </div>
  <h1 className="text-2xl font-bold mb-2">Couldn't load this resume</h1>
  <p className="text-muted-foreground mb-6 max-w-md">
    The link may be expired, corrupted, or from an older version.
    Ask the sender to generate a new share link.
  </p>
  <Button asChild>
    <Link href="/builder">Build Your Own Resume — It's Free</Link>
  </Button>
</div>
```

#### Accent Color — Low Contrast Warning

```tsx
// Inside AccentColorPicker, below hex input
{isLowContrast && (
  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1" role="alert">
    <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
    Low contrast — may be hard to read when printed
  </p>
)}
// Color is NOT prevented — just warned; user may want dark-on-color prints
```

---

### 8.5 Complete State Matrix

| Context | Loading | Empty | Error |
|---------|---------|-------|-------|
| Builder initial load | Skeleton panels (both) | — | Graceful fallback → blank resume |
| Template switch | Suspense `<ResumeCanvasSkeleton />` | — | — |
| PDF generation | Spinner button, `aria-busy` | — | Toast + "Try Again" button |
| Share link generation | Spinner on Share button | — | Toast error |
| Share link open (`/preview`) | Full-page skeleton | — | Full-page error + CTA |
| JSON export | None (instant) | — | Toast error |
| JSON import | None (instant) | — | Toast error + data preserved |
| Experience section | — | Empty state + Add btn | — |
| Education section | — | Empty state + Add btn | — |
| Skills section | — | Empty state + inline add | — |
| Projects section | — | Empty state + Add btn | — |
| Certifications section | — | Empty state + Add btn | — |
| Resume preview (no name) | — | Placeholder illustration | — |
| localStorage save | Silent | — | Toast warning (quota full / private) |
| localStorage load | ~0 ms (no UI) | Blank resume (valid) | Silent → blank resume + optional toast |
| Accent color (low contrast) | — | — | Inline warning (non-blocking) |
| New Resume confirmation | — | — | — |
| Form field validation | — | — | Red border + `role="alert"` msg below |

---

## Appendix A: shadcn/ui Components Used

| Component | Usage location |
|-----------|---------------|
| `Button` | CTAs, download, share, add items, delete, form submit |
| `Input` | All text form fields |
| `Textarea` | Summary, experience/project descriptions |
| `Label` | All form labels |
| `Select` / `SelectTrigger` / `SelectContent` / `SelectItem` | Template switcher, skill level |
| `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` | Section nav in editor; template showcase on landing; Edit/Preview mobile toggle |
| `Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent` | Experience, Education, Projects, Certifications, FAQ |
| `AlertDialog` | Delete confirmations, New Resume confirmation |
| `Dialog` | (Future: keyboard shortcuts help) |
| `Sheet` | Mobile template picker, mobile preview bottom sheet |
| `Popover` | Accent color picker |
| `DropdownMenu` | Toolbar overflow menu (New, Import, Export, Print) |
| `Tooltip` | Icon button labels on desktop |
| `Badge` | Skill levels, item count on section tabs |
| `Skeleton` | Loading states (builder, preview page) |
| `Separator` | Visual dividers in toolbar, editor |
| `Checkbox` | "Currently working here" |
| `Sonner` (Toast) | All notifications (save, download, share, errors) |

---

## Appendix B: Hooks Reference

| Hook | File | Purpose |
|------|------|---------|
| `useAutoSave` | `hooks/use-auto-save.ts` | Debounced (1 s) localStorage save on any store change |
| `usePdfGenerator` | `hooks/use-pdf-generator.ts` | Manages lazy-load of jsPDF + html2canvas, generation state machine |
| `useShareableLink` | `hooks/use-shareable-link.ts` | URL encoding (pako + base64url), clipboard copy |
| `useKeyboardShortcuts` | `hooks/use-keyboard-shortcuts.ts` | `Ctrl+Z` undo, `Ctrl+S` export, `Ctrl+P` print |
| `useMediaQuery` | `hooks/use-media-query.ts` | Breakpoint detection for layout switching |

---

## Appendix C: Print Stylesheet

```css
@media print {
  /* Hide everything except the resume canvas */
  .builder-toolbar,
  .editor-panel,
  .preview-panel-chrome,
  .affiliate-banner,
  [data-print-hide] {
    display: none !important;
  }

  /* Reset canvas transform for print */
  #resume-preview {
    transform: none !important;
    width: 100% !important;
    min-height: auto !important;
    margin: 0 !important;
    box-shadow: none !important;
  }

  /* Ensure white background even in dark mode */
  #resume-preview,
  #resume-preview * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* US Letter margins */
  @page {
    size: letter;
    margin: 0;
  }
}
```

---

## Appendix D: Key Tailwind Utility Reference

```
Layout:      flex items-center justify-between gap-4 gap-2
             grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8
             max-w-4xl max-w-2xl mx-auto px-4 sm:px-6 lg:px-8

Builder:     w-[480px] flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto overflow-auto
             sticky top-0 z-40 border-b border-r border-border

Spacing:     py-24 py-16 py-12 py-8 py-6 py-4 px-4 px-6 px-8 px-3
             space-y-4 space-y-2 space-y-1.5 gap-3 gap-2 gap-1.5 p-6 p-4 p-3

Typography:  text-6xl text-5xl text-4xl text-3xl text-xl text-lg text-base text-sm text-xs
             font-bold font-semibold font-medium tracking-tight leading-none leading-relaxed
             text-muted-foreground text-foreground text-white text-slate-300

Colors:      bg-background text-foreground
             bg-card border-border bg-muted/30 bg-muted/50
             bg-primary text-primary-foreground
             bg-destructive text-destructive-foreground
             bg-slate-900 via-slate-800 (hero gradient)

States:      hover:bg-muted/50 hover:shadow-md hover:text-destructive
             focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
             disabled:opacity-50 disabled:cursor-not-allowed
             data-[state=active]:border-primary data-[state=open]:rounded-b-none
             aria-[pressed=true]:border-primary aria-[busy=true]:cursor-wait

Transitions: transition-colors duration-200 transition-shadow duration-200

Motion:      animate-spin animate-pulse

Canvas:      w-[816px] min-h-[1056px] bg-white shadow-xl mx-auto my-8
             print:shadow-none print:my-0

Responsive:  sm:flex-row sm:grid-cols-2 md:grid-cols-2 md:flex
             lg:block lg:flex-row xl:max-w-6xl
             hidden sm:inline hidden md:flex md:hidden lg:block

A11y:        sr-only focus:not-sr-only
             outline-none focus-visible:ring-2
```

---

*DESIGN.md — v1.1 | Last updated: March 2026 | Matches SPEC.md v1.0 + ARCHITECTURE.md v1.0*
