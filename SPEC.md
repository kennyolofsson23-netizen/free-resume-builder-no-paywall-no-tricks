# SPEC.md — Free Resume Builder: No Paywall, No Tricks

## 1. Product Overview

### Problem

Job seekers need professional resumes but every major resume builder (Zety, Resume Genius, Resume.io, Novoresume) uses dark patterns: you build your entire resume for free, then at the final download step, you hit a paywall. Zety's "$1.95 trial" auto-renews at $25.90/month. Users feel tricked. Reddit, Trustpilot (Zety: 4.2/5 with thousands of 1-star reviews about billing), and "is Zety a scam" queries confirm massive frustration.

### Solution

A 100% client-side resume builder with 5 professional templates, real-time PDF preview, and instant download. No account. No email. No paywall. No server. Resume data never leaves the browser. Counter-positioning copy on every page makes the value proposition unmistakable.

### Target Users

- Job seekers actively applying to positions (high urgency, high intent)
- College students and recent graduates building their first resume
- Career changers updating their resume after years
- International applicants who need a clean U.S.-format resume

### Differentiators

| Us                                    | Zety / Resume.io                    |
| ------------------------------------- | ----------------------------------- |
| PDF download is free, always          | PDF locked behind $1.95 → $25.90/mo |
| No account required                   | Email + payment required            |
| Data stays in browser (localStorage)  | Data stored on their servers        |
| Zero server cost (static site)        | Server infrastructure costs         |
| Counter-positioning copy builds trust | Misleading "free" marketing         |
| Shareable preview link (URL-encoded)  | No sharing without account          |

### Competitive Landscape

| Competitor      | Free PDF?      | Account Required?    | Templates | Our Advantage                            |
| --------------- | -------------- | -------------------- | --------- | ---------------------------------------- |
| **Zety**        | No (paywall)   | Yes                  | 18        | We're free, they're not                  |
| **Resume.io**   | No (paywall)   | Yes                  | 25        | We're free, they're not                  |
| **FlowCV**      | Yes (1 resume) | Yes                  | 20+       | No account needed, unlimited             |
| **OpenResume**  | Yes            | No                   | 1         | 5 templates vs 1, shareable links        |
| **Canva**       | Yes (basic)    | Yes                  | 1000+     | No account, purpose-built for resumes    |
| **Google Docs** | Yes            | Yes (Google account) | 5         | No account, real-time preview, better UX |

---

## 2. User Personas

### Persona 1: Sarah — The Frustrated Job Seeker

- **Age:** 28, Marketing Coordinator
- **Context:** Spent 45 minutes on Zety building a resume, hit the paywall at download. Googled "free resume builder no paywall" in frustration.
- **Goals:** Download a professional PDF resume in under 10 minutes. Apply to 5 jobs tonight.
- **Frustrations:** Dark-pattern paywalls, mandatory account creation, "free trials" that auto-bill, cluttered UIs with upsell modals.
- **Success criteria:** Lands on site → builds resume → downloads PDF in one session without ever seeing a payment form.

### Persona 2: Marcus — The College Senior

- **Age:** 22, CS student graduating in May
- **Context:** Needs his first real resume for internship/job applications. Has limited work experience but projects and coursework to highlight.
- **Goals:** Create a clean, ATS-friendly resume that doesn't look empty. Share it with his career counselor for feedback.
- **Frustrations:** Doesn't know resume best practices, intimidated by blank pages, doesn't want to pay for a resume builder before he has a job.
- **Success criteria:** Fills in sections with guided placeholders → previews in real time → shares link with counselor → downloads PDF.

### Persona 3: Priya — The Career Changer

- **Age:** 35, transitioning from teaching to UX design
- **Context:** Needs to reframe 10 years of teaching experience for a new industry. Wants to try multiple template styles to see which presents her background best.
- **Goals:** Experiment with different templates, emphasize transferable skills, download multiple versions.
- **Frustrations:** Builders that limit you to one template on the free tier, can't easily compare how her resume looks across designs.
- **Success criteria:** Switches between all 5 templates in real time → downloads her preferred version → saves progress to come back later.

---

## 3. Core Features

### P0 — Must Ship (MVP)

#### F001: Resume Form Editor

Multi-section form for entering all resume data with real-time validation.

**User Stories:**

- As a job seeker, I want to enter my personal info, experience, education, skills, projects, and certifications so that I can build a complete resume.
- As a user, I want to add/remove/reorder entries in each section so that I can customize my resume content.

**Acceptance Criteria:**

- Given the builder page loads, When I start typing in any field, Then the preview updates within 200ms
- Given I am in the Experience section, When I click "Add Experience", Then a new empty experience form appears with all required fields
- Given I have multiple experiences, When I drag an experience to a new position, Then the order updates in both the form and preview
- Given I leave a required field empty (fullName, email), When I attempt to download, Then a validation error highlights the missing field
- Given I enter an invalid email format, When the field loses focus, Then an inline error message appears
- Given I check "Currently Working", When the form updates, Then the end date field is hidden and "Present" shows in the preview

#### F002: Real-Time PDF Preview

Live preview panel that renders the resume exactly as it will appear in the downloaded PDF.

**User Stories:**

- As a user, I want to see my resume update in real time as I type so that I know exactly what I'm downloading.

**Acceptance Criteria:**

- Given I type in any form field, When the input changes, Then the preview panel re-renders within 200ms
- Given the preview is visible, When I view it on desktop (≥1024px), Then it displays side-by-side with the form editor
- Given I am on mobile (<768px), When I tap "Preview", Then the preview shows full-screen in a bottom sheet
- Given the preview renders, When compared pixel-for-pixel to the downloaded PDF, Then they are identical in layout

#### F003: Five Resume Templates

Five distinct, professional, ATS-friendly resume templates.

**Templates:**

1. **Modern** — Clean sans-serif, subtle accent color, two-column skills sidebar
2. **Classic** — Traditional single-column, serif headings, horizontal rule separators
3. **Minimal** — Maximum whitespace, single-column, no color except black
4. **Creative** — Bold accent header, icon-enhanced contact info, subtle background patterns
5. **Professional** — Corporate two-column, dark sidebar with contact info, structured sections

**Acceptance Criteria:**

- Given I am on the builder page, When I click a template thumbnail, Then the preview immediately switches to that template
- Given any template is selected, When the resume contains all section types, Then all sections render correctly without overlap or truncation
- Given any template renders, When parsed by standard ATS software, Then all text content is extractable (no text-as-image)
- Given I switch templates, When the preview updates, Then no resume data is lost
- Given a template renders a full-page resume, When the content exceeds one page, Then it cleanly flows to a second page with consistent headers

#### F004: Instant PDF Download

One-click PDF generation and download, entirely client-side.

**User Stories:**

- As a user, I want to download my resume as a PDF with one click so that I can attach it to job applications immediately.

**Acceptance Criteria:**

- Given my resume has at minimum fullName and email filled in, When I click "Download PDF", Then a PDF file downloads within 2 seconds
- Given the PDF downloads, When I open it in any PDF reader, Then the layout matches the preview exactly
- Given the PDF generates, When I check network requests, Then zero HTTP requests are made to any server (fully client-side)
- Given the PDF generates, When I copy text from it, Then all text is selectable and copyable (not rasterized images)
- Given the downloaded file, When I check the filename, Then it is formatted as "{FullName}\_Resume.pdf"

#### F005: LocalStorage Persistence

Auto-save all resume data to the browser so users never lose work.

**User Stories:**

- As a user, I want my resume data to be automatically saved so that I don't lose my progress if I close the tab.

**Acceptance Criteria:**

- Given I type in any form field, When 1 second passes without further input (debounce), Then the resume data is saved to localStorage
- Given I saved data previously, When I return to the site, Then all my data is restored exactly as I left it
- Given localStorage is full or unavailable, When the save fails, Then a non-blocking toast warns the user
- Given I want to start fresh, When I click "New Resume", Then a confirmation dialog appears before clearing data

#### F006: Landing Page with Counter-Positioning Copy

SEO-optimized landing page that directly addresses the Zety/paywall frustration.

**User Stories:**

- As a frustrated job seeker who just hit a paywall, I want to immediately understand this site is truly free so that I feel safe investing time here.

**Acceptance Criteria:**

- Given a user lands on the homepage, When the page loads, Then the hero section displays "Free Resume Builder — No Paywall, No Tricks" above the fold
- Given the page content, When I search for counter-positioning copy, Then at least 3 distinct anti-paywall messages appear (e.g., "Unlike Zety, we don't lock your PDF behind a subscription")
- Given the page, When I look for a CTA, Then a prominent "Build Your Resume — It's Free" button is visible above the fold
- Given the page loads, When I measure Largest Contentful Paint, Then LCP is under 2.5 seconds
- Given the page source, When I inspect meta tags, Then title, description, and OG tags target "free resume builder no paywall" and "Zety free alternative" keywords

### P1 — Fast Follow

#### F007: Shareable Resume Preview Link

Generate a URL that encodes the resume data so users can share a read-only preview without any server.

**User Stories:**

- As Marcus, I want to share my resume with my career counselor via a link so they can review it without me sending a file.

**Acceptance Criteria:**

- Given I have a resume with data, When I click "Share", Then a URL is generated containing the resume data encoded in a URL-safe format
- Given the URL is generated, When I copy and open it in a new browser, Then the resume renders in read-only preview mode with all data intact
- Given a shared URL, When it exceeds 8KB of data, Then the data is compressed (pako/gzip) before base64url encoding
- Given a shared URL, When the recipient views it, Then they see a "Build Your Own — It's Free" CTA but cannot edit the resume
- Given a shared URL, When it is opened, Then no data is sent to any server (decoded entirely client-side)

#### F008: JSON Import/Export

Allow users to save their resume data as a JSON file and import it later.

**User Stories:**

- As a user, I want to export my resume data as JSON so that I have a portable backup that works across browsers/devices.

**Acceptance Criteria:**

- Given I click "Export JSON", When the file saves, Then it contains the complete resume data as valid JSON
- Given I have a valid resume JSON file, When I click "Import JSON" and select it, Then all data loads into the form and preview
- Given I import an invalid JSON file, When the parse fails, Then an error toast appears and no data is overwritten
- Given the exported JSON, When I inspect it, Then it conforms to the Resume TypeScript type schema

#### F009: Print-Optimized Stylesheet

CSS print styles so users can also print directly from the preview.

**Acceptance Criteria:**

- Given I press Ctrl+P / Cmd+P on the preview page, When the print dialog opens, Then only the resume renders (no UI chrome, no navigation)
- Given the print layout, When printed on US Letter paper, Then margins and layout match the PDF download

#### F010: Dark Mode

System-preference-aware dark mode for the editor UI (not the resume preview).

**Acceptance Criteria:**

- Given the user's OS is set to dark mode, When they visit the site, Then the editor UI renders in dark theme
- Given dark mode is active, When viewing the resume preview, Then the preview always renders with a white background (as it will print)
- Given the toggle, When I click the dark/light mode switch, Then the UI theme changes immediately without page reload

### P2 — Nice to Have

#### F011: Multiple Resumes Management

Save and switch between multiple resumes in localStorage.

**Acceptance Criteria:**

- Given I have a resume, When I click "New Resume", Then I can create a second resume without losing the first
- Given I have multiple resumes, When I view the resume list, Then each shows the name, template, and last-modified date
- Given I have multiple resumes, When I delete one, Then a confirmation dialog appears before deletion

#### F012: Custom Accent Color Picker

Let users customize the accent color used in templates that support it.

**Acceptance Criteria:**

- Given I am using a template with accent colors (Modern, Creative, Professional), When I open the color picker, Then I can choose from 12 preset colors or enter a hex value
- Given I pick a color, When the preview updates, Then all accent elements (headers, lines, icons) use the new color
- Given I pick a very light color, When contrast against white background is below 3:1, Then a warning appears

#### F013: Undo/Redo

Standard undo/redo for all form changes.

**Acceptance Criteria:**

- Given I make changes in the form, When I press Ctrl+Z, Then the last change is reverted in both form and preview
- Given I have undone a change, When I press Ctrl+Shift+Z, Then the change is re-applied
- Given the undo stack, When it contains more than 50 entries, Then the oldest entries are dropped

---

## 4. Non-Functional Requirements

### Performance

- **LCP:** < 2.5s on 4G connection
- **INP:** < 200ms for all interactions
- **CLS:** < 0.1
- **Preview re-render:** < 200ms after input change
- **PDF generation:** < 2 seconds for a 2-page resume
- **Bundle size:** < 250KB initial JS (excluding PDF library, which is lazy-loaded)
- **Lighthouse score:** ≥ 90 on Performance, Accessibility, Best Practices, SEO

### Browser Support

- Chrome/Edge 111+
- Firefox 111+
- Safari 16.4+
- Mobile Safari (iOS 16.4+) and Chrome Android
- No IE11 support

### Accessibility (WCAG 2.2 AA)

- All form inputs have visible labels (not just placeholders)
- Color contrast ratios meet WCAG 2.2 AA minimums (4.5:1 normal text, 3:1 large text)
- Full keyboard navigation for all interactive elements
- Touch targets ≥ 44×44 CSS pixels on mobile
- Focus indicators visible (2px+ outline, ≥3:1 contrast)
- Screen reader announcements for dynamic content changes (live regions for preview updates)
- Route announcements on navigation

### Security

- No server, no API, no authentication = minimal attack surface
- Content Security Policy headers block inline scripts
- X-Frame-Options: DENY prevents embedding
- No third-party scripts except analytics (if added) and ad network
- Resume data never transmitted — stays in localStorage and client memory
- Shareable links encode data in URL fragment (after #) so it's never sent to the server

### SEO

- Server-rendered landing page (Next.js RSC)
- Meta tags targeting: "free resume builder", "resume builder no paywall", "Zety free alternative", "free resume download"
- Structured data (WebApplication schema)
- Sitemap.xml and robots.txt
- OG image showing a resume template preview

---

## 5. Monetization Model

### Primary: Affiliate Revenue

- **Kickresume affiliate link** — "Want AI-powered suggestions? Try Kickresume" with prominent but non-intrusive placement in the sidebar. Target: 50% commission per conversion.
- **Job board affiliates** — "Resume done? Start applying" links to Indeed, LinkedIn Jobs, etc.

### Secondary: Display Advertising

- **Job board display ads** — Google AdSense or job-board-specific ad networks (Indeed Ads, ZipRecruiter)
- **Placement:** Below the fold on the landing page, sidebar on the builder page (never overlapping the preview)
- **Rules:** No interstitials, no pop-ups, no ads before PDF download, no ads in the PDF itself

### What We Will Never Do

- Charge for PDF download
- Require email or account creation
- Show a paywall or "premium" tier
- Sell user data (we don't collect any)

---

## 6. Success Metrics

| Metric                          | Target (Month 1) | Target (Month 6) |
| ------------------------------- | ---------------- | ---------------- |
| Monthly unique visitors         | 5,000            | 50,000           |
| Resumes created (PDF downloads) | 1,000            | 15,000           |
| Bounce rate (landing page)      | < 50%            | < 40%            |
| Time to first PDF download      | < 8 min          | < 6 min          |
| Shareable link generates        | 100              | 3,000            |
| Affiliate click-through rate    | 2%               | 3%               |
| Lighthouse Performance score    | ≥ 90             | ≥ 95             |
| Core Web Vitals (all green)     | Yes              | Yes              |

### Tracking (Privacy-Respecting)

- Plausible Analytics or Umami (cookie-free, GDPR-compliant)
- Custom events: `resume_created`, `pdf_downloaded`, `template_switched`, `share_link_generated`, `affiliate_clicked`
- No Google Analytics, no Facebook Pixel, no user tracking

---

## 7. Out of Scope for V1

- AI-powered content suggestions (would require API costs)
- ATS keyword scoring/optimization
- Cover letter builder
- User accounts / cloud sync
- Resume parsing (import from existing PDF/DOCX)
- Multi-language / i18n support
- Custom template creation
- Mobile-native app
- A/B testing framework
- Email collection or newsletter
- Payment processing of any kind
