# TEST_PLAN.md — Free Resume Builder: No Paywall, No Tricks

> **Generated:** 2026-03-21
> **Stack:** Next.js 16 (App Router) · TypeScript 5.8 · Zustand 4 · Zod 3 · jsPDF 2.5 · pako 2.1
> **Test runners:** Vitest 1 (unit/integration) · Playwright 1.40 (E2E)
> **Coverage tool:** `@vitest/coverage-v8`

---

## 0. Acceptance Criteria Index

Every SPEC.md acceptance criterion is tagged below and referenced throughout this plan.

| ID | Feature | Criterion |
|----|---------|-----------|
| AC-F001-1 | Form Editor | Preview updates within 200 ms of any keystroke |
| AC-F001-2 | Form Editor | "Add Experience" creates an empty form with all required fields |
| AC-F001-3 | Form Editor | Drag-reorder updates order in form and preview |
| AC-F001-4 | Form Editor | Downloading with empty fullName or email shows a validation error |
| AC-F001-5 | Form Editor | Invalid email format shows inline error on blur |
| AC-F001-6 | Form Editor | "Currently Working" hides end date and shows "Present" in preview |
| AC-F002-1 | Preview | Preview re-renders within 200 ms on input change |
| AC-F002-2 | Preview | Desktop (≥ 1024 px) shows side-by-side layout |
| AC-F002-3 | Preview | Mobile (< 768 px) shows full-screen bottom sheet on tap |
| AC-F002-4 | Preview | PDF layout is pixel-identical to preview (print engine) |
| AC-F003-1 | Templates | Clicking a template thumbnail switches immediately |
| AC-F003-2 | Templates | All sections render correctly in every template |
| AC-F003-3 | Templates | Text is extractable (not rasterized images) — print-based PDF |
| AC-F003-4 | Templates | Template switch does not lose resume data |
| AC-F003-5 | Templates | Content overflowing one page flows cleanly to second page |
| AC-F004-1 | PDF Download | PDF downloads within 2 s when fullName + email are present |
| AC-F004-2 | PDF Download | PDF layout matches preview |
| AC-F004-3 | PDF Download | Zero network requests during PDF generation |
| AC-F004-4 | PDF Download | Text in PDF is selectable/copyable |
| AC-F004-5 | PDF Download | Filename is `{FullName}_Resume.pdf` |
| AC-F005-1 | Persistence | Data auto-saves to localStorage with 1 s debounce |
| AC-F005-2 | Persistence | Data restored exactly on return visit |
| AC-F005-3 | Persistence | Toast warning when localStorage is unavailable/full |
| AC-F005-4 | Persistence | "New Resume" requires confirmation before clearing |
| AC-F006-1 | Landing Page | Hero shows "Free Resume Builder — No Paywall, No Tricks" above fold |
| AC-F006-2 | Landing Page | ≥ 3 distinct anti-paywall messages |
| AC-F006-3 | Landing Page | "Build Your Resume — It's Free" CTA visible above fold |
| AC-F006-4 | Landing Page | LCP < 2.5 s |
| AC-F006-5 | Landing Page | meta title, description, OG tags target "free resume builder no paywall" |
| AC-F007-1 | Share Link | Clicking "Share" generates a URL-encoded resume link |
| AC-F007-2 | Share Link | Link opens read-only preview with all data intact |
| AC-F007-3 | Share Link | Data > 8 KB is compressed with pako before base64url encoding |
| AC-F007-4 | Share Link | Shared view shows "Build Your Own" CTA; editing is disabled |
| AC-F007-5 | Share Link | No server request when decoding (fragment stays client-side) |
| AC-F008-1 | JSON Export | Exported file contains complete, valid JSON |
| AC-F008-2 | JSON Import | Valid JSON loads all data into form and preview |
| AC-F008-3 | JSON Import | Invalid JSON shows error toast; existing data is preserved |
| AC-F008-4 | JSON Export | Exported JSON conforms to Resume TypeScript schema |
| AC-F009-1 | Print | Ctrl+P on preview page renders only the resume (no UI chrome) |
| AC-F009-2 | Print | US Letter margins and layout match the PDF download |
| AC-F010-1 | Dark Mode | OS dark-mode preference activates dark theme on load |
| AC-F010-2 | Dark Mode | Resume preview always has white background regardless of theme |
| AC-F010-3 | Dark Mode | Theme toggle changes theme immediately without page reload |
| AC-F011-1 | Multi-Resume | "New Resume" creates second resume without losing first |
| AC-F011-2 | Multi-Resume | Resume list shows name, template, last-modified date |
| AC-F011-3 | Multi-Resume | Delete requires confirmation dialog |
| AC-F012-1 | Color Picker | 12 preset colors + hex input available for accent-color templates |
| AC-F012-2 | Color Picker | Picking a color updates all accent elements in preview |
| AC-F012-3 | Color Picker | Low-contrast color (< 3:1 against white) shows a warning |
| AC-F013-1 | Undo | Ctrl+Z reverts last change in form and preview |
| AC-F013-2 | Undo | Ctrl+Shift+Z re-applies undone change |
| AC-F013-3 | Undo | Undo stack caps at 50 entries, dropping oldest |

---

## 1. Test Strategy

### 1.1 Project-Specific Context

This application has **zero API routes, zero database, and zero server-side state**. All logic runs in the browser. The testing architecture reflects this:

- There is **no backend to mock** — integration tests target the Zustand store (the application's effective "API") and browser-native APIs (`localStorage`, URL fragments, `window.print`).
- **Serialization correctness is critical** — the URL codec and JSON import/export are the only inter-system boundaries. Property-based testing is a natural fit for these.
- **PDF generation uses `window.print()`**, not canvas rasterization. Text selectability is a first-class requirement. E2E tests must verify this cannot regress.
- **Performance is a product differentiator.** LCP, INP, and preview re-render timing need automated gates in CI so they can never silently degrade.
- The **Zustand store is the "API"** — it has 30+ public methods that are the boundary between UI and data. Its full contract must be covered at the integration layer.

### 1.2 Test Pyramid

```
             ╔═══════════════════════╗
             ║  E2E (Playwright)     ║  ~15 %
             ║  ~15 spec files       ║
             ║  ~120 tests           ║
             ╠═══════════════════════╣
             ║  Integration          ║  ~25 %
             ║  (Store + Hooks +     ║
             ║   Component RTL)      ║
             ║  ~15 test files       ║
             ║  ~200 tests           ║
             ╠═══════════════════════╣
             ║  Unit                 ║  ~60 %
             ║  (Pure functions)     ║
             ║  ~20 test files       ║
             ║  ~400 tests           ║
             ╚═══════════════════════╝
```

| Layer | Tool | Run Where | Primary Purpose |
|-------|------|-----------|-----------------|
| Unit | Vitest + jsdom | Local + CI every PR | Pure functions, Zod schemas, URL codec, utilities |
| Integration | Vitest + React Testing Library | Local + CI every PR | Zustand store operations, hooks with mocked browser APIs, component interaction |
| E2E | Playwright | Local + CI every PR (Chromium); nightly (Firefox, WebKit) | Full user flows, real browser APIs, visual correctness |
| Performance | Lighthouse CI | CI every PR on built app | LCP, INP, CLS, Lighthouse score, bundle size |
| Property-based | fast-check (inside Vitest) | Local + CI every PR | Serialization roundtrips, validator invariants, stack bounds |

### 1.3 CI Gates (must all pass before merge)

```
type-check → lint → unit+integration (--run) → build
                                                  └── e2e:chromium → lighthouse-ci
                                                  └── e2e:firefox  [parallel, nightly]
                                                  └── e2e:webkit   [parallel, nightly]
```

**Lighthouse CI thresholds** (`lighthouserc.json`):
```json
{
  "assert": {
    "assertions": {
      "categories:performance": ["error", {"minScore": 0.90}],
      "categories:accessibility": ["error", {"minScore": 0.90}],
      "categories:best-practices": ["error", {"minScore": 0.90}],
      "categories:seo": ["error", {"minScore": 0.90}]
    }
  }
}
```

---

## 2. Unit Tests

All unit tests live in `src/__tests__/` and run under Vitest + jsdom. These test pure functions with no browser API dependencies. Mock only when a global is unavoidable (e.g., `btoa`/`atob` in Node — polyfill them in `src/test/setup.ts`).

---

### 2.1 `src/lib/schemas/resume-schema.ts`

**File:** `src/__tests__/resume-schema.test.ts`
**Coverage target:** 100 % lines / 100 % branches

#### `personalInfoSchema`

| Test | Input | Expected | AC |
|------|-------|----------|----|
| valid full object | all fields populated | `success: true` | — |
| minimum valid (name + email only) | fullName + email, rest defaults | `success: true` | AC-F001-4 |
| empty fullName | `fullName: ""` | `ZodError` on `fullName` | AC-F001-4 |
| empty email | `email: ""` | `ZodError` on `email` | AC-F001-4 |
| invalid email format | `email: "notanemail"` | `ZodError` on `email` | AC-F001-5 |
| email with valid RFC 5321 format | `email: "a+b@sub.example.co.uk"` | `success: true` | — |
| fullName at max (100 chars) | 100-char string | `success: true` | — |
| fullName over max (101 chars) | 101-char string | `ZodError` | — |
| fullName with Unicode | `"张伟"` (Chinese) | `success: true` | — |
| valid URL on website | `"https://example.com"` | `success: true` | — |
| empty-string website allowed | `website: ""` | `success: true` (optional-or-empty) | — |
| malformed URL on website | `"not-a-url"` | `ZodError` | — |
| summary at limit (2000 chars) | 2000-char string | `success: true` | — |
| summary over limit (2001 chars) | 2001-char string | `ZodError` | — |
| XSS payload in summary | `"<script>alert(1)</script>"` | `success: true` (Zod passes; React escapes) | — |

#### `experienceSchema`

| Test | Input | Expected | AC |
|------|-------|----------|----|
| valid complete entry | all fields | `success: true` | — |
| missing jobTitle | `jobTitle: ""` | `ZodError` | AC-F001-4 |
| missing company | `company: ""` | `ZodError` | AC-F001-4 |
| missing startDate | `startDate: ""` | `ZodError` | — |
| currentlyWorking true with empty endDate | allowed by schema | `success: true` | AC-F001-6 |
| description at limit (5000 chars) | 5000-char string | `success: true` | — |
| description over limit (5001 chars) | 5001-char string | `ZodError` | — |
| id is required | `id: ""` | `ZodError` | — |

#### `educationSchema`

| Test | Input | Expected |
|------|-------|----------|
| valid entry | all fields | `success: true` |
| missing school | `school: ""` | `ZodError` |
| missing degree | `degree: ""` | `ZodError` |
| missing startDate | `startDate: ""` | `ZodError` |
| GPA optional, empty ok | `gpa: ""` | `success: true` |
| GPA at limit (10 chars) | 10-char string | `success: true` |

#### `skillSchema`

| Test | Input | Expected |
|------|-------|----------|
| valid entry with level | `{ id, name, level: 'expert' }` | `success: true` |
| valid entry without level | `{ id, name }` | `success: true` (level is optional) |
| invalid level value | `level: 'wizard'` | `ZodError` |
| all 4 level enum values accepted | `beginner`/`intermediate`/`advanced`/`expert` | `success: true` each |
| name at max (50 chars) | 50-char string | `success: true` |
| name over max (51 chars) | 51-char string | `ZodError` |

#### `projectSchema`

| Test | Input | Expected |
|------|-------|----------|
| valid entry | all fields | `success: true` |
| missing title | `title: ""` | `ZodError` |
| technologies empty array | `technologies: []` | `success: true` |
| technologies with multiple strings | `["React", "TypeScript"]` | `success: true` |
| empty link allowed | `link: ""` | `success: true` |
| malformed link | `link: "not-a-url"` | `ZodError` |

#### `certificationSchema`

| Test | Input | Expected |
|------|-------|----------|
| valid entry | all fields | `success: true` |
| missing name | `name: ""` | `ZodError` |
| missing issuer | `issuer: ""` | `ZodError` |
| missing issueDate | `issueDate: ""` | `ZodError` |
| credentialUrl empty | `credentialUrl: ""` | `success: true` |
| malformed credentialUrl | `"not-a-url"` | `ZodError` |

#### `resumeSchema` (top-level)

| Test | Input | Expected | AC |
|------|-------|----------|----|
| valid complete resume | all sections populated | `success: true` | AC-F008-4 |
| all 5 template enum values | `'modern'`…`'professional'` | `success: true` each | — |
| invalid template value | `template: "fancy"` | `ZodError` | — |
| accentColor valid 6-char hex | `"#2563eb"` | `success: true` | AC-F012-1 |
| accentColor invalid — name | `"blue"` | `ZodError` | AC-F012-1 |
| accentColor invalid — 3-char | `"#abc"` | `ZodError` | AC-F012-1 |
| accentColor uppercase hex | `"#AABBCC"` | `success: true` | — |
| timestamps not ISO 8601 | `createdAt: "yesterday"` | `ZodError` | — |
| empty arrays allowed for all section arrays | `experiences: []` etc. | `success: true` | — |
| extra unknown keys stripped | `{ ...validData, foo: 'bar' }` | `success: true`, `foo` absent from output | — |

---

### 2.2 `src/lib/sharing/url-codec.ts`

**File:** `src/__tests__/url-codec-extended.test.ts`
**Coverage target:** 100 % lines / 100 % branches

| Test | Scenario | Expected | AC |
|------|----------|----------|----|
| `encodeResumeData` → `decodeResumeData` roundtrip (small < 8 KB) | small object | decoded equals original; prefix `j:` | AC-F007-1 |
| `encodeResumeData` → `decodeResumeData` roundtrip (large > 8 KB) | large object | decoded equals original; prefix `c:` | AC-F007-3 |
| `encodeResumeForURL` → `decodeResumeFromURL` roundtrip (small) | small object | no `z:` prefix; decoded equals original | AC-F007-1 |
| `encodeResumeForURL` → `decodeResumeFromURL` roundtrip (large) | large object | `z:` prefix; decoded equals original | AC-F007-3 |
| `decodeResumeData` with unknown prefix `x:` | `"x:abc"` | returns `null` | — |
| `decodeResumeData` with empty string | `""` | returns `null` (no throw) | — |
| `decodeResumeData` with malformed base64 | `"j:!!!"` | returns `null` (no throw) | — |
| `decodeResumeFromURL` with corrupted compressed bytes | mangled `z:` payload | returns `null` (no throw) | — |
| `decodeResumeFromURL` with non-JSON inside | `encodeResumeForURL` of non-object | returns the value (passes through JSON.parse) | — |
| encoded string is URL-safe | any bytes | result matches `/^[A-Za-z0-9\-_.:]*$/` | AC-F007-1 |
| threshold boundary exactly 8192 bytes | 8192-byte JSON | uses uncompressed path (no `z:` or `c:`) | AC-F007-3 |
| threshold boundary 8193 bytes | 8193-byte JSON | uses compressed path (`z:` or `c:`) | AC-F007-3 |
| empty object roundtrips | `{}` | `decodeResumeFromURL(encodeResumeForURL({}))` equals `{}` | — |
| special chars in strings roundtrip | `{ name: "O'Brien & <Co>" }` | survives both encode+decode | — |
| Unicode strings roundtrip | `{ name: "张伟 αβγ" }` | survives both encode+decode | — |

---

### 2.3 `src/lib/pdf/generate-pdf.ts`

**File:** `src/__tests__/pdf-generator.test.ts`
**Coverage target:** 100 % lines / 85 % branches

Mock setup in each test via `vi.stubGlobal` / `vi.spyOn`:
- `window.print` → `vi.fn()` that synchronously dispatches `afterprint`
- `document.getElementById` → real jsdom DOM (create element in test)

| Test | Mock Setup | Action | Expected | AC |
|------|-----------|--------|----------|----|
| throws when element not found | no DOM element with given ID | `generatePDF({ elementId: 'missing' })` | rejects with `"Element #missing not found"` | — |
| sets document.title to filename before printing | spy on print | call generatePDF | `document.title === filename` when `print()` fires | AC-F004-5 |
| restores document.title after printing | spy + fire afterprint | await generatePDF | `document.title === originalTitle` after resolve | — |
| calls `window.print()` exactly once | spy | call generatePDF | `window.print` call count === 1 | — |
| resolves only after afterprint event | manual afterprint dispatch | await | promise resolves after event | — |
| default elementId is `resume-preview-container` | create DOM element with that ID | call `generatePDF()` (no options) | does not throw | — |
| default filename is `Resume.pdf` | call `generatePDF()` (no options) | | `document.title === 'Resume.pdf'` during print | — |
| spaces in name become underscores | `filename: "Jane Doe_Resume.pdf"` | | `document.title` set correctly | AC-F004-5 |

---

### 2.4 `src/lib/cn.ts`

**File:** `src/__tests__/cn.test.ts` | **Coverage target:** 100 %

| Test | Input | Expected |
|------|-------|----------|
| merges two class names | `cn('a', 'b')` | `"a b"` |
| deduplicates conflicting Tailwind | `cn('p-4', 'p-8')` | `"p-8"` |
| ignores `false` | `cn('a', false, 'b')` | `"a b"` |
| ignores `undefined` | `cn('a', undefined)` | `"a"` |
| ignores `null` | `cn('a', null)` | `"a"` |
| conditional object (true) | `cn({ 'text-red': true })` | `"text-red"` |
| conditional object (false) | `cn({ 'text-red': false })` | `""` |
| empty call | `cn()` | `""` |
| template literal | `cn(\`text-\${'red'}\`)` | `"text-red"` |

---

### 2.5 `src/lib/constants.ts`

**File:** `src/__tests__/constants.test.ts` | **Coverage target:** 100 %

| Test | Assertion | AC |
|------|----------|----|
| `TEMPLATE_LIST` has exactly 5 entries | `length === 5` | AC-F003-1 |
| `TEMPLATE_LIST` IDs match schema enum | all IDs in `['modern','classic','minimal','creative','professional']` | — |
| `TEMPLATE_LIST` all have `id`, `name`, `description` | each entry has all 3 keys | — |
| `PRESET_ACCENT_COLORS` has exactly 12 entries | `length === 12` | AC-F012-1 |
| all `PRESET_ACCENT_COLORS` are valid hex | each matches `^#[0-9a-fA-F]{6}$` | AC-F012-1 |
| `DEFAULT_ACCENT_COLOR` is in `PRESET_ACCENT_COLORS` | `includes(DEFAULT_ACCENT_COLOR)` | — |
| `STORAGE_KEY` is non-empty string | truthy | — |
| `RESUMES_STORAGE_KEY` is non-empty and different from `STORAGE_KEY` | truthy, not equal | — |
| `AUTO_SAVE_DEBOUNCE_MS === 1000` | strict equal | AC-F005-1 |
| `MAX_UNDO_HISTORY === 50` | strict equal | AC-F013-3 |
| `SHARE_COMPRESSION_THRESHOLD === 8192` | strict equal | AC-F007-3 |
| `PREVIEW_RERENDER_TARGET_MS === 200` | strict equal | AC-F002-1 |
| `FIELD_LIMITS.summary === 2000` | strict equal | — |
| `FIELD_LIMITS.description === 5000` | strict equal | — |
| `FIELD_LIMITS.fullName === 100` | strict equal | — |

---

### 2.6 Template Components (all 5)

**File:** `src/__tests__/templates.test.ts`
**Coverage target:** 90 % lines

Run the same suite for each of `ModernTemplate`, `ClassicTemplate`, `MinimalTemplate`, `CreativeTemplate`, `ProfessionalTemplate`:

| Test | Setup | Expected | AC |
|------|-------|----------|----|
| renders fullName | sample data | name text present in DOM | AC-F003-2 |
| renders email | sample data | email text present in DOM | AC-F003-2 |
| renders phone | sample data | phone text present in DOM | AC-F003-2 |
| renders both experience entries | 2 experiences | both `jobTitle` values present | AC-F003-2 |
| renders education entry | 1 education | `school` name present | AC-F003-2 |
| renders all skills | 3 skills | all 3 `name` values present | AC-F003-2 |
| renders project | 1 project | `title` present | AC-F003-2 |
| renders certification | 1 certification | `name` present | AC-F003-2 |
| `currentlyWorking: true` shows "Present" | experience with flag | "Present" in DOM | AC-F001-6 |
| `currentlyWorking: false` shows endDate | experience with `endDate: "2024-06"` | endDate text in DOM | — |
| empty all arrays renders without crash | all arrays `[]` | no error thrown | AC-F003-2 |
| accentColor applied | `accentColor: "#db2777"` | element with that color in style | AC-F012-2 |
| no `dangerouslySetInnerHTML` | static grep/render | attribute absent from rendered tree | — |

**`TemplateRenderer`:**

| Test | Input | Expected | AC |
|------|-------|----------|----|
| renders Modern for `template: 'modern'` | props | ModernTemplate in VDOM | AC-F003-1 |
| renders Classic for `template: 'classic'` | props | ClassicTemplate in VDOM | AC-F003-1 |
| renders Minimal, Creative, Professional | each | correct component | AC-F003-1 |
| unknown template falls back gracefully | `template: 'unknown' as any` | no crash, renders fallback | — |

---

### 2.7 `src/components/ui/color-picker.tsx`

**File:** `src/__tests__/color-picker.test.ts` | **Coverage target:** 85 %

| Test | Action | Expected | AC |
|------|--------|----------|----|
| renders 12 preset color swatches | mount | 12 swatch buttons visible | AC-F012-1 |
| clicking a preset swatch calls `onChange` with correct hex | click `#7c3aed` swatch | `onChange('#7c3aed')` called | AC-F012-2 |
| hex input field is present | mount | input element present | AC-F012-1 |
| typing valid 6-char hex calls `onChange` | type `#aabbcc` | `onChange('#aabbcc')` called | AC-F012-2 |
| typing invalid hex does not call `onChange` | type `xyz` | `onChange` not called | — |
| typing incomplete hex does not call `onChange` | type `#abc` | `onChange` not called | — |
| low-contrast color shows warning | `currentColor: '#eeeeee'` (near white) | warning text visible | AC-F012-3 |
| high-contrast color has no warning | `currentColor: '#000000'` | no warning text | AC-F012-3 |
| selected preset swatch has active state indicator | `currentColor` matches a preset | that swatch has active class/aria | — |

---

### 2.8 Landing Page Components

**File:** `src/__tests__/landing-page.test.ts` | **Coverage target:** 85 %

| Component | Test | Expected | AC |
|-----------|------|----------|----|
| `<Hero>` | renders exact headline text | "Free Resume Builder — No Paywall, No Tricks" in DOM | AC-F006-1 |
| `<Hero>` | CTA button links to `/builder` | anchor `href="/builder"` | AC-F006-3 |
| `<Hero>` | CTA text matches spec | text includes "Free" | AC-F006-3 |
| `<FeatureGrid>` | renders ≥ 3 anti-paywall feature items | count of elements with paywall-related text ≥ 3 | AC-F006-2 |
| `<TrustSignals>` | includes "Zety" comparison text | text node containing "Zety" present | AC-F006-2 |
| `<TrustSignals>` | "Unlike Zety" messaging | specific counter-positioning text | AC-F006-2 |
| `<FAQ>` | renders ≥ 3 FAQ entries | ≥ 3 `<details>` or question/answer elements | AC-F006-2 |
| `<Footer>` | Kickresume affiliate link present | link to `kickresume.com` | — |
| Root `layout.tsx` | `<title>` contains target keyword | "free resume builder" (case-insensitive) in title | AC-F006-5 |
| Root `layout.tsx` | meta description present | `name="description"` content contains "no paywall" | AC-F006-5 |
| Root `layout.tsx` | OG tags present | `og:title`, `og:description`, `og:image` all present | AC-F006-5 |

---

### 2.9 Dark Mode

**File:** `src/__tests__/dark-mode.test.ts` | **Coverage target:** 80 %

| Test | Setup | Expected | AC |
|------|-------|----------|----|
| `ThemeProvider` applies `dark` class when OS is dark | mock `window.matchMedia` → `matches: true` | `document.documentElement.classList.contains('dark')` | AC-F010-1 |
| `ThemeProvider` does not apply `dark` in light mode | mock → `matches: false` | no `dark` class | — |
| `ThemeToggle` button is present | render | button with accessible label | AC-F010-3 |
| clicking `ThemeToggle` toggles `dark` class | click | class changes; no navigation occurs | AC-F010-3 |
| resume preview container has white background class | render preview in dark mode context | `.resume-preview-container` or `#resume-preview-container` has `bg-white` | AC-F010-2 |

---

### 2.10 Print Styles

**File:** `src/__tests__/print-styles.test.ts` | **Coverage target:** 70 %

Print CSS cannot be fully simulated in jsdom. Test what can be inferred from component class names:

| Test | Method | Expected | AC |
|------|--------|----------|----|
| builder header has `print:hidden` Tailwind class | inspect rendered class strings | `print:hidden` in className | AC-F009-1 |
| form panel has `print:hidden` Tailwind class | inspect | `print:hidden` in className | AC-F009-1 |
| `#resume-preview-container` does NOT have `print:hidden` | inspect | `print:hidden` absent | AC-F009-1 |
| print-visible class present on resume container | inspect | `print:block` or no print-hidden | AC-F009-1 |

---

## 3. Integration Tests

Integration tests use Vitest + React Testing Library (RTL). They render real components with the real Zustand store and stub only browser APIs that cannot run in jsdom. Store is reset between each test with `beforeEach(() => useResumeStore.getState().reset())`.

---

### 3.1 Zustand Store — `src/store/resume-store.ts`

**File:** `src/__tests__/resume-store.test.ts`
**Coverage target:** 100 % lines / 95 % branches

#### Core CRUD

| Test | Action | Expected | AC |
|------|--------|----------|----|
| `createNewResume` initializes empty resume | call | `resume.personalInfo.fullName === ""`, all arrays empty | — |
| `createNewResume` sets `template: 'modern'` | call | `resume.template === 'modern'` | — |
| `createNewResume` sets `accentColor: '#2563eb'` | call | default color | — |
| `createNewResume` generates a unique ID | call twice, compare | IDs differ | — |
| `createNewResume` clears undo/redo history | call | `pastStates === []`, `futureStates === []` | — |
| `setResume` replaces entire state | call with custom resume object | `resume` equals provided object (with updated `updatedAt`) | AC-F008-2 |
| `setResume` pushes previous resume to `pastStates` | call when resume exists | `pastStates.length === 1` | AC-F013-1 |
| `setResume` clears `futureStates` | call after an undo | `futureStates.length === 0` | AC-F013-2 |
| `reset` sets `resume: null` | call | `resume === null` | AC-F005-4 |
| `reset` clears history | call | `pastStates === []`, `futureStates === []` | — |
| `reset` removes `STORAGE_KEY` from localStorage | call | `localStorage.getItem(STORAGE_KEY) === null` | AC-F005-4 |

#### Personal Info

| Test | Action | Expected | AC |
|------|--------|----------|----|
| `updatePersonalInfo` merges one field | `{ fullName: "Alice" }` | `fullName === "Alice"`, email unchanged | AC-F001-1 |
| `updatePersonalInfo` merges multiple fields | `{ fullName: "Alice", email: "alice@example.com" }` | both updated | — |
| `updatePersonalInfo` pushes to `pastStates` | call | `pastStates.length++` | AC-F013-1 |
| `updatePersonalInfo` clears `futureStates` | call | `futureStates === []` | — |
| `updatePersonalInfo` updates `updatedAt` | call | `updatedAt` is newer than before | — |
| `updatePersonalInfo` when `resume === null` | call without init | no crash; state unchanged | — |

#### Experience CRUD

| Test | Action | Expected | AC |
|------|--------|----------|----|
| `addExperience` appends an empty entry | call | `experiences.length === 1` | AC-F001-2 |
| new experience has all required fields | call | entry has `id`, `jobTitle`, `company`, `startDate` | AC-F001-2 |
| `addExperience` new entry ID is unique | call twice | IDs differ | — |
| `addExperience` pushes to `pastStates` | call | `pastStates.length++` | AC-F013-1 |
| `updateExperience` modifies the correct entry by ID | add two, update first | first entry updated, second unchanged | — |
| `updateExperience` with unknown ID is no-op | pass non-existent ID | array length and content unchanged | — |
| `removeExperience` removes entry by ID | add two, remove first | length === 1, correct entry remains | — |
| `removeExperience` with unknown ID is no-op | pass non-existent ID | array unchanged | — |
| `reorderExperiences` reorders correctly | add A, B, C; reorder to [C, A, B] | array order matches new order | AC-F001-3 |
| `reorderExperiences` drops unknown IDs | pass IDs with one unknown | unknown dropped; rest in order | — |

*(Identical test matrix applies to Education, Skills, Projects, and Certifications — all must be covered in the actual test file.)*

#### Template & Styling

| Test | Action | Expected | AC |
|------|--------|----------|----|
| `updateTemplate('classic')` changes template | call | `resume.template === 'classic'` | AC-F003-1 |
| `updateTemplate` does NOT affect `personalInfo` | call | `personalInfo` unchanged | AC-F003-4 |
| `updateTemplate` does NOT push to `pastStates` | call | `pastStates` length unchanged (template switching is not undo-able) | — |
| `updateAccentColor('#aabbcc')` sets valid hex | call | `resume.accentColor === '#aabbcc'` | AC-F012-2 |
| `updateAccentColor('red')` rejected — no hash | call | state unchanged | AC-F012-1 |
| `updateAccentColor('#abc')` rejected — 3-char | call | state unchanged | — |
| `updateAccentColor('aabbcc')` rejected — no hash | call | state unchanged | — |
| `updateAccentColor('#AABBCC')` accepted — uppercase | call | state updated | — |
| `updateAccentColor` when `resume === null` | call | no crash | — |

#### Persistence

| Test | Action | Expected | AC |
|------|--------|----------|----|
| `saveToLocalStorage` writes to `STORAGE_KEY` | call after createNewResume | `localStorage.getItem(STORAGE_KEY)` is valid JSON | AC-F005-1 |
| `saveToLocalStorage` serializes all fields | call | parsed JSON has all expected keys | AC-F008-4 |
| `loadFromLocalStorage` hydrates store | save, reset to null, load | `resume` equals saved | AC-F005-2 |
| `loadFromLocalStorage` when nothing stored creates new resume | empty `localStorage` | `resume` is empty resume (not null) | — |
| `loadFromLocalStorage` with corrupted JSON creates new resume | `localStorage.setItem(key, '{bad}')` | creates empty resume, no crash | — |
| `loadFromLocalStorage` uses lenient schema (empty required fields pass) | save resume with `fullName: ""` | loads successfully | — |
| `loadFromLocalStorage` clears undo history | load | `pastStates === []`, `futureStates === []` | — |
| `saveToLocalStorage` is no-op when `resume === null` | `reset()` then `saveToLocalStorage()` | no write to `localStorage` | — |
| `saveToLocalStorage` re-throws on quota exceeded | mock `localStorage.setItem` to throw | method re-throws | AC-F005-3 |

#### JSON Import / Export

| Test | Action | Expected | AC |
|------|--------|----------|----|
| `exportAsJSON` returns valid JSON string | call | `JSON.parse(result)` does not throw | AC-F008-1 |
| `exportAsJSON` includes all resume fields | call | parsed result has `id`, `template`, `personalInfo`, all sections | AC-F008-4 |
| `exportAsJSON` returns `""` when `resume === null` | call without init | `""` | — |
| `importFromJSON` with valid JSON returns `true` and loads resume | call | returns `true`; store has new resume | AC-F008-2 |
| `importFromJSON` with `"not json"` returns `false` | call | returns `false`; previous resume untouched | AC-F008-3 |
| `importFromJSON` with valid JSON but invalid schema returns `false` | `JSON.stringify({foo:'bar'})` | returns `false` | AC-F008-3 |
| `importFromJSON` does not overwrite on failure | fill store, then import invalid JSON | store state unchanged after failed import | AC-F008-3 |
| Export → import roundtrip | export then import | resume state equals original | AC-F008-1 |
| `importFromJSON` with in-progress resume (empty required fields) succeeds | lenient schema | returns `true` | — |
| `importFromJSON` clears undo/redo history | call | `pastStates === []`, `futureStates === []` | — |

#### Sharing

| Test | Action | Expected | AC |
|------|--------|----------|----|
| `generateShareableURL` returns URL starting with `origin/preview#` | call | `result.startsWith(origin + '/preview#')` | AC-F007-1 |
| `generateShareableURL` contains encoded resume data | call | URL hash decodes back to resume | AC-F007-1 |
| `generateShareableURL` returns `""` when `resume === null` | call without init | `""` | — |
| `loadFromShareableURL` with valid hash returns `true` and loads resume | encode + decode | returns `true`; resume equals original | AC-F007-2 |
| `loadFromShareableURL` with garbage hash returns `false` | `"garbage"` | returns `false`; state unchanged | — |
| `loadFromShareableURL` with schema-invalid decoded data returns `false` | valid base64 of `{foo:'bar'}` | returns `false` | — |
| Full round-trip: `generateShareableURL` → `loadFromShareableURL` | end-to-end | resume equals original | AC-F007-2 |

#### Undo / Redo

| Test | Action | Expected | AC |
|------|--------|----------|----|
| `canUndo()` is `false` on fresh resume | fresh resume | `canUndo() === false` | — |
| `canUndo()` is `true` after any update | `updatePersonalInfo(...)` | `canUndo() === true` | AC-F013-1 |
| `undo()` reverts last change | update name to "Alice", undo | `fullName` equals previous value (empty) | AC-F013-1 |
| `undo()` moves current to `futureStates` | undo | `futureStates.length === 1` | AC-F013-2 |
| `canRedo()` is `true` after undo | undo | `canRedo() === true` | AC-F013-2 |
| `redo()` re-applies undone change | undo then redo | `fullName === "Alice"` again | AC-F013-2 |
| `redo()` moves current to `pastStates` | redo | `pastStates.length++` | — |
| `redo()` clears `futureStates` (single item) | undo then redo | `futureStates.length === 0` | — |
| New action after undo clears `futureStates` | undo, then `updatePersonalInfo` | `futureStates.length === 0` | — |
| Undo stack capped at `MAX_UNDO_HISTORY` (50) | 51 `updatePersonalInfo` calls | `pastStates.length === 50` | AC-F013-3 |
| `undo()` on empty stack is no-op | call when `canUndo() === false` | state unchanged; no crash | — |
| `redo()` on empty `futureStates` is no-op | call when `canRedo() === false` | state unchanged; no crash | — |
| Multiple undo steps | 3 updates, 3 undos | each step correctly reverts | AC-F013-1 |

---

### 3.2 `useAutoSave` Hook

**File:** `src/__tests__/auto-save.test.ts`
**Coverage target:** 90 % lines

Use `renderHook`, `vi.useFakeTimers()`, and mock `saveToLocalStorage` in the Zustand store.

| Test | Setup | Expected | AC |
|------|-------|----------|----|
| does not save on initial mount | render hook | `saveToLocalStorage` not called | — |
| saves after debounce elapses | change resume, advance timer 1000 ms | `saveToLocalStorage` called exactly once | AC-F005-1 |
| does not save before debounce elapses | change resume, advance timer 999 ms | `saveToLocalStorage` not called | AC-F005-1 |
| rapid changes collapse to single save | 5 changes in 100 ms intervals, advance 1000 ms | `saveToLocalStorage` called exactly once | AC-F005-1 |
| `isSaving` is `true` immediately after change | observe state before timer fires | `isSaving === true` | — |
| `isSaving` is `false` after save completes | advance timer | `isSaving === false` | — |
| `lastSaved` is updated after successful save | advance timer | `lastSaved instanceof Date` | — |
| shows destructive toast when save throws | mock `saveToLocalStorage` to throw | toast called with `variant: 'destructive'` | AC-F005-3 |
| `isSaving` is `false` after error | mock throw, advance timer | `isSaving === false` | — |
| custom `debounceMs` is respected | render with `debounceMs=500`, advance 500 ms | `saveToLocalStorage` called | AC-F005-1 |
| does not save when `resume === null` | `reset()`, change | `saveToLocalStorage` not called | — |
| clears pending timer on unmount | unmount during debounce | no state update / no memory leak warning | — |

---

### 3.3 `usePdfGenerator` Hook

**File:** `src/__tests__/use-pdf-generator.test.ts`
**Coverage target:** 90 % lines

Mock `generatePDF` from `@/lib/pdf/generate-pdf` via `vi.mock`.

| Test | Setup | Expected | AC |
|------|-------|----------|----|
| initial `status` is `'idle'` | render | `status === 'idle'` | — |
| `isGenerating` is `false` initially | render | `isGenerating === false` | — |
| downloading with `resume === null` shows validation toast | resume null | toast with "Add your details" message | AC-F001-4 |
| downloading with empty `fullName` shows toast | `fullName: ""` | toast mentioning name | AC-F001-4 |
| downloading with empty `email` shows toast | `email: ""` | toast mentioning email | AC-F001-4 |
| `status` becomes `'generating'` during download | mock pending `generatePDF` | `status === 'generating'` while pending | — |
| `isGenerating` is `true` during download | same | `isGenerating === true` | — |
| `status` becomes `'success'` on resolve | `generatePDF` resolves | `status === 'success'` | AC-F004-1 |
| success toast shown | resolve | toast with PDF download confirmation | — |
| `status` resets to `'idle'` after 2 s on success | advance fake timers 2000 ms | `status === 'idle'` | — |
| `status` becomes `'error'` on rejection | `generatePDF` rejects | `status === 'error'` | — |
| error toast shown | reject | toast with error message | — |
| `status` resets to `'idle'` after 3 s on error | advance 3000 ms | `status === 'idle'` | — |
| `generatePDF` called with `elementId: 'resume-preview-container'` | valid resume, call `downloadPDF` | `generatePDF` spy called with correct elementId | — |
| filename is `{FirstName_LastName}_Resume.pdf` | `fullName: "Jane Doe"` | `generatePDF` called with `filename: "Jane_Doe_Resume.pdf"` | AC-F004-5 |
| multi-word name uses underscores | `fullName: "Mary Jane Watson"` | `filename: "Mary_Jane_Watson_Resume.pdf"` | AC-F004-5 |
| cleanup on unmount cancels pending timer | unmount during 2-second reset timer | no "Can't perform state update on unmounted" warning | — |

---

### 3.4 `useShareableLink` Hook

**File:** `src/__tests__/shareable-link.test.ts`
**Coverage target:** 85 % lines

Mock `navigator.clipboard.writeText`.

| Test | Setup | Expected | AC |
|------|-------|----------|----|
| returns a URL containing `/preview#` | valid resume | result includes `/preview#` | AC-F007-1 |
| copies URL to clipboard | call | `navigator.clipboard.writeText` called with URL | AC-F007-1 |
| shows success toast after copy | clipboard resolves | toast shown | — |
| shows error toast when clipboard fails | clipboard rejects | error toast shown | — |
| different resumes produce different URLs | two distinct resumes | URLs differ | — |
| large resume produces compressed URL | resume > 8 KB | URL contains `z:` prefix | AC-F007-3 |

---

### 3.5 `useKeyboardShortcuts` Hook

**File:** `src/__tests__/use-keyboard-shortcuts.test.ts`
**Coverage target:** 85 % lines

| Test | Event | Expected | AC |
|------|-------|----------|----|
| `Ctrl+Z` calls `undo()` | `keydown` with `ctrlKey + key:'z'` | `undo` called | AC-F013-1 |
| `Ctrl+Shift+Z` calls `redo()` | `keydown` with `ctrlKey + shiftKey + key:'z'` | `redo` called | AC-F013-2 |
| `Cmd+Z` calls `undo()` on Mac | `keydown` with `metaKey + key:'z'` | `undo` called | AC-F013-1 |
| `Ctrl+S` calls `event.preventDefault()` | `keydown` with `ctrlKey + key:'s'` | `preventDefault` called | — |
| shortcuts suppressed when `target` is `<input>` | `keydown` with `target = <input>` | `undo` not called | — |
| shortcuts suppressed when `target` is `<textarea>` | `keydown` with `target = <textarea>` | `undo` not called | — |
| listener is removed on unmount | unmount | no listener leak (verify via `removeEventListener` spy) | — |

---

### 3.6 `useMediaQuery` Hook

**File:** `src/__tests__/use-media-query.test.ts`
**Coverage target:** 100 % lines

| Test | Mock | Expected |
|------|------|----------|
| returns `true` when media query matches | mock `window.matchMedia` with `matches: true` | hook returns `true` |
| returns `false` when media query doesn't match | mock with `matches: false` | hook returns `false` |
| updates when change event fires | fire `MediaQueryList` change event | hook value updates |

---

### 3.7 Form Component Integration

**File:** `src/__tests__/form-editor.test.ts`
**Coverage target:** 80 % lines

| Component | Test | Expected | AC |
|-----------|------|----------|----|
| `<PersonalInfoForm>` | Full Name input has a visible `<label>` | `getByLabelText(/full name/i)` exists | NFR-A11Y-1 |
| `<PersonalInfoForm>` | Email input has a visible `<label>` | `getByLabelText(/email/i)` exists | NFR-A11Y-1 |
| `<PersonalInfoForm>` | typing in Full Name updates store | `userEvent.type(...)` → store `fullName` updated | AC-F001-1 |
| `<PersonalInfoForm>` | typing in Email updates store | `userEvent.type(...)` → store `email` updated | AC-F001-1 |
| `<ExperienceForm>` | "Add Experience" button renders new form | click → job title input appears | AC-F001-2 |
| `<ExperienceForm>` | new entry has Job Title, Company, Start Date fields | after add → all 3 labeled inputs present | AC-F001-2 |
| `<ExperienceForm>` | "Currently Working" checkbox hides end date field | check → end date hidden | AC-F001-6 |
| `<ExperienceForm>` | unchecking "Currently Working" shows end date | uncheck → end date visible | AC-F001-6 |
| `<ExperienceForm>` | remove button deletes the entry | click remove → entry gone | — |
| `<SkillsForm>` | "Add Skill" adds a labeled skill name input | click → `getByLabelText(/skill name/i)` visible | — |
| `<EducationForm>` | "Add Education" adds school input | click → `getByLabelText(/school/i)` visible | — |
| `<ProjectsForm>` | "Add Project" adds title input | click → `getByLabelText(/title/i)` visible | — |
| `<CertificationsForm>` | "Add Certification" adds name input | click → `getByLabelText(/certification name/i)` visible | — |

---

### 3.8 Preview Panel

**File:** `src/__tests__/preview-panel.test.ts`
**Coverage target:** 80 % lines

| Test | Setup | Expected | AC |
|------|-------|----------|----|
| reflects `fullName` change from store | update store → check panel | new name text present in preview panel DOM | AC-F002-1 |
| reflects template switch | `updateTemplate('classic')` | template-specific class/element present | AC-F002-1 |
| has `id="resume-preview-container"` | render | element with that ID exists | — |
| preview container has white background | render | `bg-white` class on container | AC-F010-2 |
| no edit inputs in preview panel | render | no `<input>` elements inside preview container | AC-F007-4 |

---

### 3.9 Multiple Resumes (`useResumeList`)

**File:** `src/__tests__/use-resume-list.test.ts`
**Coverage target:** 85 % lines

| Test | Action | Expected | AC |
|------|--------|----------|----|
| initial list has one item (current resume) | load | list length ≥ 1 | — |
| creating a second resume persists both | create second | list length === 2 | AC-F011-1 |
| first resume still accessible after creating second | switch back | original data intact | AC-F011-1 |
| list items include name, template, `updatedAt` | inspect entries | all 3 fields present | AC-F011-2 |
| deleting a resume from list removes it | delete | list length decreases | AC-F011-3 |
| switching to a different resume loads it into store | switch | store reflects switched resume | — |

---

### 3.10 Monetization

**File:** `src/__tests__/monetization.test.ts`
**Coverage target:** 70 % lines

| Test | Expected | AC |
|------|----------|---|
| affiliate banner contains link to Kickresume | `href` includes `kickresume.com` | — |
| affiliate link has `rel="noopener noreferrer"` | `rel` attribute present | — |
| no affiliate elements inside `#resume-preview-container` | query returns empty | — |
| no modal or overlay rendered before PDF download | no `role="dialog"` covering PDF button | — |

---

### 3.11 Store Persistence (Full Round-Trips)

**File:** `src/__tests__/store-persistence.test.ts`
**Coverage target:** 90 % lines

| Test | Action | Expected | AC |
|------|--------|----------|----|
| full resume data survives a save + load cycle | fill all fields, save, reset, load | all fields equal original | AC-F005-2 |
| `RESUMES_STORAGE_KEY` used for multi-resume list | save two resumes | both keys in localStorage | AC-F011-1 |
| corrupted single-resume key falls back to new resume | write bad JSON to `STORAGE_KEY`, load | empty resume created | — |
| corrupted multi-resume key falls back gracefully | write bad JSON to `RESUMES_STORAGE_KEY` | no crash; empty list or single empty resume | — |

---

## 4. E2E Tests (Playwright)

Run against a locally-built Next.js production server (`npm run build && npm run start`). Use `data-testid` attributes for stable selectors. Primary CI browser: **Chromium**. Nightly matrix: **Firefox + WebKit + Mobile Chrome + Mobile Safari**.

### 4.1 Required `data-testid` Attributes

Ensure these exist in source before running E2E tests:

| Component | Attribute |
|-----------|-----------|
| Hero headline `<h1>` | `data-testid="hero-headline"` |
| Hero CTA button | `data-testid="hero-cta"` |
| Builder form panel container | `data-testid="form-panel"` |
| Builder preview panel container | `data-testid="preview-panel"` |
| Download PDF button | `data-testid="download-pdf-btn"` |
| Share button | `data-testid="share-btn"` |
| Template selector | `data-testid="template-selector"` |
| Accent color picker trigger | `data-testid="accent-color-picker"` |
| Undo button | `data-testid="undo-btn"` |
| Redo button | `data-testid="redo-btn"` |
| New Resume button | `data-testid="new-resume-btn"` |
| Confirmation dialog | `data-testid="confirm-dialog"` |
| Resume preview container | `id="resume-preview-container"` |
| Mobile preview sheet trigger | `data-testid="mobile-preview-btn"` |
| Export JSON button | `data-testid="export-json-btn"` |
| Import JSON button | `data-testid="import-json-btn"` |
| Shared preview CTA banner | `data-testid="preview-cta"` |
| Toast notification | `data-testid="toast"` |

### 4.2 Page Object Models

```typescript
// e2e/pages/builder.page.ts
export class BuilderPage {
  constructor(private page: Page) {}
  goto()                { return this.page.goto('/builder') }
  formPanel()           { return this.page.getByTestId('form-panel') }
  previewPanel()        { return this.page.getByTestId('preview-panel') }
  previewContainer()    { return this.page.locator('#resume-preview-container') }
  fullNameInput()       { return this.page.getByLabel(/full name/i) }
  emailInput()          { return this.page.getByLabel(/email/i) }
  downloadBtn()         { return this.page.getByTestId('download-pdf-btn') }
  shareBtn()            { return this.page.getByTestId('share-btn') }
  templateSelector()    { return this.page.getByTestId('template-selector') }
  undoBtn()             { return this.page.getByTestId('undo-btn') }
  redoBtn()             { return this.page.getByTestId('redo-btn') }
  newResumeBtn()        { return this.page.getByTestId('new-resume-btn') }
  mobilePreviewBtn()    { return this.page.getByTestId('mobile-preview-btn') }
  exportJsonBtn()       { return this.page.getByTestId('export-json-btn') }
  importJsonBtn()       { return this.page.getByTestId('import-json-btn') }
  confirmDialog()       { return this.page.getByTestId('confirm-dialog') }
}

// e2e/pages/landing.page.ts
export class LandingPage {
  constructor(private page: Page) {}
  goto()       { return this.page.goto('/') }
  headline()   { return this.page.getByTestId('hero-headline') }
  ctaButton()  { return this.page.getByTestId('hero-cta') }
}

// e2e/pages/preview.page.ts
export class SharedPreviewPage {
  constructor(private page: Page) {}
  gotoWithHash(hash: string) { return this.page.goto(`/preview#${hash}`) }
  previewContainer()         { return this.page.locator('#resume-preview-container') }
  ctaBanner()                { return this.page.getByTestId('preview-cta') }
  formPanel()                { return this.page.getByTestId('form-panel') }
}
```

### 4.3 E2E Helpers

```typescript
// e2e/helpers/storage.ts
export async function seedLocalStorage(page: Page, data: object) {
  await page.evaluate((d) => {
    localStorage.setItem('resume-builder-data', JSON.stringify(d))
  }, data)
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

// Use in beforeEach:
test.beforeEach(async ({ page }) => clearLocalStorage(page))
```

---

### 4.4 E2E Flow: Landing Page

**File:** `e2e/home.spec.ts` | AC coverage: AC-F006-1 through AC-F006-5

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-HOME-01 | `goto('/')` | `hero-headline` text is "Free Resume Builder — No Paywall, No Tricks" | AC-F006-1 |
| E2E-HOME-02 | `goto('/')` — count anti-paywall elements | ≥ 3 elements containing "paywall", "free", or "no tricks" text | AC-F006-2 |
| E2E-HOME-03 | `goto('/')` — check CTA | `hero-cta` button is visible within viewport | AC-F006-3 |
| E2E-HOME-04 | `goto('/')` → click CTA | URL becomes `/builder` | AC-F006-3 |
| E2E-HOME-05 | `goto('/')` → `page.title()` | title contains "free resume builder" (case-insensitive) | AC-F006-5 |
| E2E-HOME-06 | `goto('/')` → inspect `<meta name="description">` | content contains "no paywall" | AC-F006-5 |
| E2E-HOME-07 | `goto('/')` → inspect OG meta tags | `og:title`, `og:description`, `og:image` all present and non-empty | AC-F006-5 |
| E2E-HOME-08 | Lighthouse CI run on `/` | LCP < 2500 ms, performance score ≥ 90 | AC-F006-4 |

---

### 4.5 E2E Flow: Builder Load & Layout

**File:** `e2e/builder.spec.ts` | AC: AC-F002-2, AC-F002-3

| ID | Viewport | Steps | Assertion | AC |
|----|----------|-------|----------|----|
| E2E-BUILDER-01 | 1280 × 900 | `goto('/builder')` | both `form-panel` and `preview-panel` visible | AC-F002-2 |
| E2E-BUILDER-02 | 375 × 812 | `goto('/builder')` | `preview-panel` not visible; `mobile-preview-btn` visible | AC-F002-3 |
| E2E-BUILDER-03 | 375 × 812 | tap `mobile-preview-btn` | bottom sheet / full-screen preview opens | AC-F002-3 |
| E2E-BUILDER-04 | 1280 × 900 | `goto('/builder')` | page title contains "Free Resume Builder" | — |

---

### 4.6 E2E Flow: Real-Time Preview

**File:** `e2e/builder.spec.ts` | AC: AC-F001-1, AC-F002-1

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-PREVIEW-01 | goto → fill Full Name "Alex Preview" | text "Alex Preview" appears in `preview-panel` | AC-F001-1, AC-F002-1 |
| E2E-PREVIEW-02 | goto → fill name → measure time | preview update occurs within 200 ms of last keystroke | AC-F002-1 |
| E2E-PREVIEW-03 | goto → add experience → fill Job Title "Staff Engineer" | "Staff Engineer" appears in preview | AC-F001-1 |
| E2E-PREVIEW-04 | goto → switch template via selector | preview DOM changes reflect new template | AC-F003-1 |

```typescript
// Measuring preview re-render timing (E2E-PREVIEW-02)
const start = performance.now()
await builderPage.fullNameInput().fill('Timing Test')
await expect(builderPage.previewPanel().getByText('Timing Test')).toBeVisible()
expect(performance.now() - start).toBeLessThan(200)
```

---

### 4.7 E2E Flow: Form Editing

**File:** `e2e/builder.spec.ts` | AC: AC-F001-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-FORM-01 | goto → click "Add Experience" | Job Title, Company, Start Date inputs visible | AC-F001-2 |
| E2E-FORM-02 | goto → add experience → fill Job Title → check preview | job title appears in preview | AC-F001-1 |
| E2E-FORM-03 | goto → add 2 experiences → drag first below second | order in preview reverses | AC-F001-3 |
| E2E-FORM-04 | goto → add experience → check "Currently Working" | End Date field hidden | AC-F001-6 |
| E2E-FORM-05 | goto → add experience → check "Currently Working" → inspect preview | "Present" text in preview | AC-F001-6 |
| E2E-FORM-06 | goto → type invalid email → blur field | inline error message visible | AC-F001-5 |
| E2E-FORM-07 | goto → fill name + email only → click Download | download proceeds (no validation error) | AC-F001-4 |
| E2E-FORM-08 | goto → leave empty → click Download | validation error toast visible | AC-F001-4 |
| E2E-FORM-09 | goto → add skill "TypeScript" | "TypeScript" in preview | — |
| E2E-FORM-10 | goto → add education school "MIT" | "MIT" in preview | — |
| E2E-FORM-11 | goto → add project "MyApp" | "MyApp" in preview | — |
| E2E-FORM-12 | goto → add certification "AWS SAA" | "AWS SAA" in preview | — |

---

### 4.8 E2E Flow: PDF Download

**File:** `e2e/builder.spec.ts` | AC: AC-F004-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-PDF-01 | goto → fill name + email → click Download | browser print dialog triggers (or download event) | AC-F004-1 |
| E2E-PDF-02 | goto → fill name "Jane Doe" → click Download | document title set to `Jane_Doe_Resume.pdf` during print | AC-F004-5 |
| E2E-PDF-03 | goto → click Download → intercept network | zero XHR/fetch requests to external URLs | AC-F004-3 |
| E2E-PDF-04 | verify `window.print` used (not canvas) | `#resume-preview-container` contains text nodes, not `<canvas>` | AC-F004-4, AC-F003-3 |

```typescript
// E2E-PDF-03: Network interception
const externalRequests: string[] = []
await page.route('**/*', (route) => {
  const url = route.request().url()
  if (!url.startsWith(process.env.BASE_URL!)) externalRequests.push(url)
  route.continue()
})
await builderPage.downloadBtn().click()
// Wait for afterprint or page settle
expect(externalRequests).toHaveLength(0)
```

---

### 4.9 E2E Flow: LocalStorage Persistence

**File:** `e2e/builder.spec.ts` | AC: AC-F005-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-PERSIST-01 | goto → fill name "AutoSaveUser" → wait 1.5 s → reload | name "AutoSaveUser" still in form | AC-F005-2 |
| E2E-PERSIST-02 | goto → fill name → wait only 0.5 s → reload immediately | form may be empty (debounce not complete) — tests that save is NOT instant | AC-F005-1 |
| E2E-PERSIST-03 | goto → click "New Resume" | confirmation dialog appears | AC-F005-4 |
| E2E-PERSIST-04 | goto → click "New Resume" → cancel confirmation | form data unchanged | AC-F005-4 |
| E2E-PERSIST-05 | goto → click "New Resume" → confirm | form cleared | AC-F005-4 |
| E2E-PERSIST-06 | seed localStorage with full resume → goto | all data pre-populated in form | AC-F005-2 |

---

### 4.10 E2E Flow: Templates

**File:** `e2e/templates.spec.ts` | AC: AC-F003-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-TPL-01 | `goto('/templates')` | all 5 template names (Modern, Classic, Minimal, Creative, Professional) visible | — |
| E2E-TPL-02 | `/templates` → click "Use This Template" for Classic | navigates to `/builder?template=classic` | — |
| E2E-TPL-03 | builder → select each template via selector | preview content changes for each; no error | AC-F003-1 |
| E2E-TPL-04 | builder → fill all 6 sections → switch to each template | all sections render in each template; no overflow/truncation | AC-F003-2 |
| E2E-TPL-05 | builder → fill personalInfo → switch template → inspect store | `personalInfo` values unchanged | AC-F003-4 |
| E2E-TPL-06 | builder → add very long description → check Modern template | content flows; no `overflow: hidden` clips text | AC-F003-5 |
| E2E-TPL-07 | builder → download PDF (print-based) → verify text nodes | `#resume-preview-container` has text nodes not `<canvas>` | AC-F003-3, AC-F004-4 |

---

### 4.11 E2E Flow: Shareable Link

**File:** `e2e/sharing.spec.ts` | AC: AC-F007-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-SHARE-01 | builder → fill form → click Share | toast "Link copied" visible | AC-F007-1 |
| E2E-SHARE-02 | builder → fill form → click Share → read clipboard | clipboard contains `http://…/preview#` | AC-F007-1 |
| E2E-SHARE-03 | builder → fill large resume (> 8 KB) → click Share | clipboard URL contains `z:` prefix | AC-F007-3 |
| E2E-SHARE-04 | open `/preview#<valid-encoded-small>` | resume name/email rendered correctly | AC-F007-2 |
| E2E-SHARE-05 | open `/preview#<valid-encoded-large>` | full resume data rendered correctly | AC-F007-2 |
| E2E-SHARE-06 | `/preview` page with valid hash | form panel absent from DOM | AC-F007-4 |
| E2E-SHARE-07 | `/preview` page with valid hash | `preview-cta` testid visible | AC-F007-4 |
| E2E-SHARE-08 | `/preview#<garbage>` | error state or empty state shown; CTA still visible | — |
| E2E-SHARE-09 | open preview URL → intercept all network | zero XHR/fetch requests made | AC-F007-5, AC-F004-3 |
| E2E-SHARE-10 | full round-trip: fill builder → share → open URL | all data identical in read-only preview | AC-F007-2 |

---

### 4.12 E2E Flow: JSON Import / Export

**File:** `e2e/builder.spec.ts` (or `e2e/import-export.spec.ts`) | AC: AC-F008-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-JSON-01 | goto → fill form → click Export JSON | file download with `.json` extension triggered | AC-F008-1 |
| E2E-JSON-02 | Export JSON → inspect download content | valid JSON with `personalInfo`, `experiences`, etc. | AC-F008-4 |
| E2E-JSON-03 | Export JSON → Import JSON (same file) | form fields repopulated with original data | AC-F008-2 |
| E2E-JSON-04 | Import JSON with `{ invalid: true }` file | error toast visible; previous data intact | AC-F008-3 |
| E2E-JSON-05 | Import JSON with non-JSON text file | error toast visible; previous data intact | AC-F008-3 |

---

### 4.13 E2E Flow: Dark Mode

**File:** `e2e/builder.spec.ts` | AC: AC-F010-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-DARK-01 | `page.emulateMedia({ colorScheme: 'dark' })` → goto builder | `<html>` has `dark` class | AC-F010-1 |
| E2E-DARK-02 | dark mode → inspect `#resume-preview-container` computed style | background-color is white (`rgb(255, 255, 255)`) | AC-F010-2 |
| E2E-DARK-03 | goto builder → click theme toggle button | `<html class>` changes; no navigation / full reload | AC-F010-3 |

---

### 4.14 E2E Flow: Undo / Redo

**File:** `e2e/builder.spec.ts` | AC: AC-F013-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-UNDO-01 | fill name "Alice" → press Ctrl+Z | name field empty (or previous value) | AC-F013-1 |
| E2E-UNDO-02 | fill name "Alice" → Ctrl+Z → Ctrl+Shift+Z | name "Alice" reappears | AC-F013-2 |
| E2E-UNDO-03 | fresh builder page | `undo-btn` is disabled | — |
| E2E-UNDO-04 | fresh builder page | `redo-btn` is disabled | — |
| E2E-UNDO-05 | click undo button (toolbar) | same effect as Ctrl+Z | AC-F013-1 |

---

### 4.15 E2E Flow: Multiple Resumes

**File:** `e2e/builder.spec.ts` | AC: AC-F011-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-MULTI-01 | fill resume "Alice" → New Resume → confirm → fill "Bob" | both in resume list | AC-F011-1 |
| E2E-MULTI-02 | create two resumes → open resume list panel | each entry shows name, template, date | AC-F011-2 |
| E2E-MULTI-03 | create two → delete one → confirm | list shows 1 entry | AC-F011-3 |
| E2E-MULTI-04 | create two → delete one → cancel | list unchanged at 2 entries | AC-F011-3 |

---

### 4.16 E2E Flow: Accent Color Picker

**File:** `e2e/builder.spec.ts` | AC: AC-F012-*

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-COLOR-01 | open color picker | 12 swatch buttons visible | AC-F012-1 |
| E2E-COLOR-02 | click pink swatch (`#db2777`) | preview accent elements change color | AC-F012-2 |
| E2E-COLOR-03 | type `#ff0000` in hex input and confirm | preview accent changes to red | AC-F012-2 |
| E2E-COLOR-04 | type very light hex `#eeeeee` | low-contrast warning message visible | AC-F012-3 |

---

### 4.17 E2E Flow: Accessibility

**File:** `e2e/builder.spec.ts` (or `e2e/a11y.spec.ts`) | NFR-A11Y-*

```typescript
import AxeBuilder from '@axe-core/playwright'

test('landing page has no critical accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0)
})
```

| ID | Page | Assertion | AC |
|----|------|----------|----|
| E2E-A11Y-01 | `/` | zero critical axe violations | NFR-A11Y-* |
| E2E-A11Y-02 | `/builder` | zero critical axe violations | NFR-A11Y-* |
| E2E-A11Y-03 | `/templates` | zero critical axe violations | NFR-A11Y-* |
| E2E-A11Y-04 | `/preview` with valid hash | zero critical axe violations | NFR-A11Y-* |
| E2E-A11Y-05 | `/builder` | Tab through all form fields — all reachable | NFR-A11Y-3 |
| E2E-A11Y-06 | `/builder` | all interactive elements have visible focus indicator | NFR-A11Y-5 |
| E2E-A11Y-07 | `/builder` | color contrast of text ≥ 4.5:1 (axe rule) | NFR-A11Y-2 |

---

### 4.18 E2E Flow: Print Styles

**File:** `e2e/builder.spec.ts` | AC: AC-F009-*

```typescript
// E2E-PRINT-01
await page.emulateMedia({ media: 'print' })
await expect(page.getByTestId('form-panel')).toBeHidden()
await expect(page.locator('nav')).toBeHidden()
await expect(page.locator('#resume-preview-container')).toBeVisible()
```

| ID | Steps | Assertion | AC |
|----|-------|----------|----|
| E2E-PRINT-01 | `emulateMedia({ media: 'print' })` on `/builder` | form panel and nav hidden; resume container visible | AC-F009-1 |

---

### 4.19 E2E Flow: Security Headers

**File:** `e2e/security.spec.ts` | NFR-SEC-*

```typescript
test('security headers are set', async ({ page }) => {
  const response = await page.goto('/')
  expect(response!.headers()['x-frame-options']).toBe('DENY')
  expect(response!.headers()['x-content-type-options']).toBe('nosniff')
  expect(response!.headers()['referrer-policy']).toBeTruthy()
  expect(response!.headers()['permissions-policy']).toBeTruthy()
})
```

| ID | Assertion | AC |
|----|----------|----|
| E2E-SEC-01 | `X-Frame-Options: DENY` | NFR-SEC |
| E2E-SEC-02 | `X-Content-Type-Options: nosniff` | NFR-SEC |
| E2E-SEC-03 | `Referrer-Policy` header present | NFR-SEC |
| E2E-SEC-04 | `Permissions-Policy` header present | NFR-SEC |
| E2E-SEC-05 | No cookies set on any page | `page.context().cookies()` empty | NFR-SEC |

---

## 5. Property-Based Tests

**File:** `src/__tests__/property-based.test.ts`
**Tool:** `fast-check` (add to devDependencies: `npm install -D fast-check`)

### 5.1 URL Codec Roundtrip

```typescript
import * as fc from 'fast-check'
import { encodeResumeData, decodeResumeData } from '@/lib/sharing/url-codec'
import { encodeResumeForURL, decodeResumeFromURL } from '@/lib/sharing/url-codec'

it('encodeResumeData ↔ decodeResumeData: roundtrip for any JSON-serializable object', () => {
  fc.assert(fc.property(
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 50 }),
      name: fc.unicodeString({ minLength: 0, maxLength: 200 }),
      summary: fc.unicodeString({ minLength: 0, maxLength: 5000 }),
    }),
    (obj) => {
      const encoded = encodeResumeData(obj)
      const decoded = decodeResumeData(encoded)
      expect(decoded).toEqual(obj)
    }
  ))
})

it('encodeResumeForURL ↔ decodeResumeFromURL: roundtrip for any JSON-serializable object', () => {
  fc.assert(fc.property(
    fc.record({
      n: fc.unicodeString({ maxLength: 1000 }),
      xs: fc.array(fc.string(), { maxLength: 20 }),
    }),
    (obj) => {
      const encoded = encodeResumeForURL(obj)
      const decoded = decodeResumeFromURL(encoded)
      expect(decoded).toEqual(obj)
    }
  ))
})

it('all encoded strings contain only URL-safe characters', () => {
  fc.assert(fc.property(
    fc.dictionary(fc.string(), fc.string({ maxLength: 100 })),
    (obj) => {
      const encoded = encodeResumeForURL(obj)
      // base64url alphabet + codec prefixes only
      expect(encoded).toMatch(/^[A-Za-z0-9\-_.:]*$/)
    }
  ))
})

it('decoding garbage inputs never throws — always returns null', () => {
  fc.assert(fc.property(
    fc.oneof(fc.string(), fc.constant(''), fc.constant('z:!!!'), fc.constant('c:@@@')),
    (garbage) => {
      expect(() => decodeResumeData(garbage)).not.toThrow()
      expect(() => decodeResumeFromURL(garbage)).not.toThrow()
    }
  ))
})
```

### 5.2 JSON Import / Export Roundtrip

```typescript
it('exportAsJSON → importFromJSON: roundtrip preserves personalInfo', () => {
  fc.assert(fc.property(
    fc.record({
      fullName: fc.string({ minLength: 1, maxLength: 100 }),
      email: fc.emailAddress(),
      phone: fc.string({ maxLength: 20 }),
      location: fc.string({ maxLength: 100 }),
    }),
    (personalInfo) => {
      const store = useResumeStore.getState()
      store.createNewResume()
      store.updatePersonalInfo(personalInfo)
      const json = store.exportAsJSON()
      store.createNewResume()
      const success = store.importFromJSON(json)
      expect(success).toBe(true)
      const restored = useResumeStore.getState().resume
      expect(restored?.personalInfo.fullName).toBe(personalInfo.fullName)
      expect(restored?.personalInfo.email).toBe(personalInfo.email)
    }
  ))
})
```

### 5.3 Zod Schema: Valid Data Always Passes

```typescript
import { PRESET_ACCENT_COLORS } from '@/lib/constants'

const validResumeArb = fc.record({
  id: fc.uuidV4(),
  template: fc.constantFrom('modern', 'classic', 'minimal', 'creative', 'professional' as const),
  personalInfo: fc.record({
    fullName: fc.string({ minLength: 1, maxLength: 100 }),
    email: fc.emailAddress(),
    phone: fc.string({ maxLength: 20 }),
    location: fc.string({ maxLength: 100 }),
    website: fc.constant(''),
    linkedin: fc.constant(''),
    github: fc.constant(''),
    summary: fc.string({ maxLength: 2000 }),
  }),
  experiences:     fc.constant([]),
  education:       fc.constant([]),
  skills:          fc.constant([]),
  projects:        fc.constant([]),
  certifications:  fc.constant([]),
  accentColor:     fc.constantFrom(...PRESET_ACCENT_COLORS),
  createdAt:       fc.date({ min: new Date('2000-01-01') }).map(d => d.toISOString()),
  updatedAt:       fc.date({ min: new Date('2000-01-01') }).map(d => d.toISOString()),
})

it('resumeSchema: any structurally valid resume passes', () => {
  fc.assert(fc.property(validResumeArb, (data) => {
    expect(resumeSchema.safeParse(data).success).toBe(true)
  }))
})
```

### 5.4 Zod Schema: Specific Invalids Always Fail

```typescript
it('personalInfoSchema: any non-email string fails email validation', () => {
  fc.assert(fc.property(
    fc.string().filter(s => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)),
    (nonEmail) => {
      const result = personalInfoSchema.safeParse({ fullName: 'A', email: nonEmail })
      expect(result.success).toBe(false)
    }
  ))
})

it('resumeSchema: any hex color not matching ^#[0-9a-fA-F]{6}$ fails', () => {
  fc.assert(fc.property(
    fc.string().filter(s => !/^#[0-9a-fA-F]{6}$/.test(s)),
    (badColor) => {
      const result = resumeSchema.safeParse({ ...validMinimalResume, accentColor: badColor })
      expect(result.success).toBe(false)
    }
  ))
})
```

### 5.5 Undo Stack Invariants

```typescript
it('pastStates.length never exceeds MAX_UNDO_HISTORY regardless of update count', () => {
  fc.assert(fc.property(
    fc.integer({ min: 1, max: 200 }),
    (numChanges) => {
      const store = useResumeStore.getState()
      store.createNewResume()
      for (let i = 0; i < numChanges; i++) {
        store.updatePersonalInfo({ fullName: `Name ${i}` })
      }
      expect(store.pastStates.length).toBeLessThanOrEqual(MAX_UNDO_HISTORY)
    }
  ))
})

it('after N undos, futureStates.length === N (bounded by available history)', () => {
  fc.assert(fc.property(
    fc.integer({ min: 1, max: 20 }),
    fc.integer({ min: 0, max: 20 }),
    (numChanges, numUndos) => {
      const store = useResumeStore.getState()
      store.createNewResume()
      for (let i = 0; i < numChanges; i++) {
        store.updatePersonalInfo({ fullName: `Name ${i}` })
      }
      const effectiveUndos = Math.min(numUndos, store.pastStates.length)
      for (let i = 0; i < numUndos; i++) store.undo()
      expect(store.futureStates.length).toBe(effectiveUndos)
    }
  ))
})
```

---

## 6. Per-Module Coverage Targets

Configured in `vitest.config.mts`:

```typescript
coverage: {
  provider: 'v8',
  thresholds: {
    lines:      80,
    branches:   75,
    functions:  80,
    statements: 80,
  },
  include: ['src/**/*.{ts,tsx}'],
  exclude: [
    'src/test/**',
    'src/**/*.test.*',
    'src/**/*.spec.*',
    'src/types/**',
    'src/app/**/layout.tsx',  // Metadata-only files
  ],
}
```

**Per-module targets:**

| Module / File | Lines % | Branches % | Notes |
|---------------|---------|------------|-------|
| `src/lib/schemas/resume-schema.ts` | 100 | 100 | Pure Zod; all paths enumerable |
| `src/lib/sharing/url-codec.ts` | 100 | 100 | All code paths (`c:`, `j:`, `z:`, plain, null) covered |
| `src/lib/pdf/generate-pdf.ts` | 100 | 85 | `afterprint` resolution hard in jsdom; branch gap is acceptable |
| `src/lib/cn.ts` | 100 | 100 | Trivial utility |
| `src/lib/constants.ts` | 100 | 100 | Data-only; all exported values verified |
| `src/store/resume-store.ts` | 95 | 90 | All CRUD + undo/redo; SSR guard `typeof window` branches count against 100 % |
| `src/hooks/use-auto-save.ts` | 90 | 85 | Timer/debounce branches via fake timers |
| `src/hooks/use-pdf-generator.ts` | 90 | 85 | Full status state machine |
| `src/hooks/use-shareable-link.ts` | 85 | 80 | Clipboard error path |
| `src/hooks/use-keyboard-shortcuts.ts` | 85 | 80 | Input-target guard branch |
| `src/hooks/use-media-query.ts` | 100 | 90 | Simple reactive hook |
| `src/hooks/use-resume-list.ts` | 85 | 80 | Multiple-resume list management |
| `src/hooks/use-toast.ts` | 70 | 65 | Mostly Radix plumbing; toast display covered by integration |
| `src/components/templates/template-renderer.tsx` | 100 | 100 | Dispatcher; fully enumerable (5 cases) |
| `src/components/templates/modern-template.tsx` | 90 | 85 | All section/field rendering paths |
| `src/components/templates/classic-template.tsx` | 90 | 85 | Same |
| `src/components/templates/minimal-template.tsx` | 90 | 85 | Same |
| `src/components/templates/creative-template.tsx` | 90 | 85 | Same |
| `src/components/templates/professional-template.tsx` | 90 | 85 | Same |
| `src/components/builder/sections/personal-info-form.tsx` | 80 | 75 | Form interaction; some paths E2E only |
| `src/components/builder/sections/experience-form.tsx` | 80 | 75 | Same |
| `src/components/builder/sections/education-form.tsx` | 80 | 75 | Same |
| `src/components/builder/sections/skills-form.tsx` | 80 | 75 | Same |
| `src/components/builder/sections/projects-form.tsx` | 80 | 75 | Same |
| `src/components/builder/sections/certifications-form.tsx` | 80 | 75 | Same |
| `src/components/builder/builder-layout.tsx` | 80 | 75 | Responsive layout branches |
| `src/components/builder/builder-toolbar.tsx` | 80 | 75 | Toolbar actions |
| `src/components/builder/preview-panel.tsx` | 80 | 75 | Store subscription |
| `src/components/builder/section-entry.tsx` | 80 | 75 | Reusable drag + delete |
| `src/components/ui/color-picker.tsx` | 85 | 80 | Contrast warning branch |
| `src/components/landing/hero.tsx` | 75 | 70 | Mostly static rendering |
| `src/components/landing/feature-grid.tsx` | 75 | 70 | Same |
| `src/components/landing/trust-signals.tsx` | 75 | 70 | Same |
| `src/components/landing/faq.tsx` | 75 | 70 | Same |
| `src/components/landing/footer.tsx` | 75 | 70 | Same |
| `src/components/preview/preview-viewer.tsx` | 80 | 75 | URL hash decode flow |
| `src/components/preview/preview-cta.tsx` | 80 | 70 | CTA rendering |
| `src/components/shared/header.tsx` | 75 | 70 | Navigation |
| `src/components/shared/theme-toggle.tsx` | 80 | 75 | Toggle behavior |
| `src/components/shared/affiliate-banner.tsx` | 75 | 70 | Static link rendering |
| **Overall project** | **≥ 80** | **≥ 75** | Enforced by Vitest `thresholds` |

---

## 7. Non-Functional Test Coverage

### 7.1 Performance

| Metric | Target | Automated Via |
|--------|--------|---------------|
| LCP | < 2500 ms | Lighthouse CI on `/` | AC-F006-4 |
| INP | < 200 ms | Lighthouse CI `interactiveTime` | NFR-PERF-2 |
| CLS | < 0.1 | Lighthouse CI `cumulativeLayoutShift` | NFR-PERF-3 |
| Lighthouse Performance | ≥ 90 | Lighthouse CI | NFR-PERF-7 |
| Lighthouse Accessibility | ≥ 90 | Lighthouse CI | NFR-A11Y-* |
| Initial JS bundle | < 250 KB gzipped | `size-limit` in CI | NFR-PERF-6 |
| Preview re-render | < 200 ms | E2E timing in E2E-PREVIEW-02 | AC-F002-1 |
| PDF generation | < 2000 ms | E2E timing from click to afterprint | AC-F004-1 |

**`size-limit` config (`.size-limit.json`):**
```json
[
  { "path": ".next/static/chunks/pages/_app*.js", "limit": "250 kB", "gzip": true },
  { "path": ".next/static/chunks/main*.js",       "limit": "250 kB", "gzip": true }
]
```

### 7.2 Accessibility

| Requirement | Test | AC |
|------------|------|----|
| All inputs have visible `<label>` elements | RTL: `getByLabelText` succeeds | NFR-A11Y-1 |
| Text color contrast ≥ 4.5:1 | axe-core `color-contrast` rule (E2E-A11Y-07) | NFR-A11Y-2 |
| Full keyboard navigation | E2E-A11Y-05: Tab through all interactive elements | NFR-A11Y-3 |
| Touch targets ≥ 44 × 44 CSS px | axe-core `target-size` rule | NFR-A11Y-4 |
| Visible focus indicators | axe-core `focus-visible` rule | NFR-A11Y-5 |
| ARIA live region on preview | check `aria-live` attribute on preview panel | NFR-A11Y-6 |

### 7.3 Security (Static Analysis)

Run these checks in CI as part of the lint step:

```bash
# No dangerouslySetInnerHTML usage
grep -r "dangerouslySetInnerHTML" src/ && exit 1 || echo "OK"

# No eval() or new Function() usage
grep -rE "eval\(|new Function\(" src/ && exit 1 || echo "OK"

# No hardcoded secrets (basic check)
grep -rE "(password|secret|api.?key)\s*=" src/ --include="*.ts" --include="*.tsx" && exit 1 || echo "OK"
```

---

## 8. Test Data Strategy

### 8.1 Shared Fixtures

```typescript
// e2e/fixtures/resumes.ts

export const minimalResume = {
  id: 'test-id-minimal',
  template: 'modern' as const,
  personalInfo: {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '', location: '', website: '', linkedin: '', github: '', summary: '',
  },
  experiences: [], education: [], skills: [], projects: [], certifications: [],
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const fullResume = {
  id: 'test-id-full',
  template: 'modern' as const,
  personalInfo: {
    fullName: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 555-0100',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.dev',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    summary: 'Senior full-stack engineer with 10+ years of experience building scalable web applications.',
  },
  experiences: [
    { id: 'exp-1', jobTitle: 'Staff Engineer', company: 'Acme Corp',
      location: 'SF', startDate: '2020-01', endDate: '', currentlyWorking: true,
      description: 'Led platform modernization initiative. Reduced p99 latency by 40%.' },
    { id: 'exp-2', jobTitle: 'Senior Engineer', company: 'Beta Inc',
      location: 'NY', startDate: '2016-03', endDate: '2019-12', currentlyWorking: false,
      description: 'Owned the backend API layer serving 5M requests/day.' },
  ],
  education: [
    { id: 'edu-1', school: 'MIT', degree: 'B.S.', field: 'Computer Science',
      startDate: '2010-09', endDate: '2014-05', gpa: '3.9' },
  ],
  skills: [
    { id: 'skill-1', name: 'TypeScript', level: 'expert' as const },
    { id: 'skill-2', name: 'React', level: 'expert' as const },
    { id: 'skill-3', name: 'PostgreSQL', level: 'advanced' as const },
  ],
  projects: [
    { id: 'proj-1', title: 'Open Resume Fork', description: 'Extended open-source resume builder.',
      link: 'https://github.com/alex/resume', technologies: ['TypeScript', 'Next.js'],
      startDate: '2023-01', endDate: '' },
  ],
  certifications: [
    { id: 'cert-1', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services',
      issueDate: '2022-06', expirationDate: '2025-06',
      credentialUrl: 'https://aws.amazon.com/cert/abc123' },
  ],
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Resume that exceeds the 8192-byte compression threshold
export const largeResume = {
  ...fullResume,
  id: 'test-id-large',
  personalInfo: { ...fullResume.personalInfo, summary: 'A'.repeat(2000) },
  experiences: Array.from({ length: 10 }, (_, i) => ({
    id: `exp-large-${i}`,
    jobTitle: `Senior Engineer ${i}`,
    company: `Company ${i}`,
    location: 'San Francisco, CA',
    startDate: '2010-01',
    endDate: '2012-01',
    currentlyWorking: false,
    description: `Detailed description for role ${i}. `.repeat(60),
  })),
}
```

### 8.2 localStorage Test Isolation

All E2E tests must clear `localStorage` before each test to prevent state leakage:

```typescript
// playwright.config.ts or e2e/helpers/storage.ts
test.beforeEach(async ({ page }) => {
  await page.goto('/builder')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})
```

Alternatively, use a blank storage state in the Playwright project config:

```typescript
// playwright.config.ts
use: {
  storageState: { cookies: [], origins: [] },
}
```

---

## 9. Complete Test File Map

### Unit / Integration (`src/__tests__/`)

| File | Layer | Modules Under Test | New? |
|------|-------|--------------------|------|
| `resume-schema.test.ts` | Unit | `src/lib/schemas/resume-schema.ts` | Exists |
| `url-codec-extended.test.ts` | Unit | `src/lib/sharing/url-codec.ts` | Exists |
| `pdf-generator.test.ts` | Unit | `src/lib/pdf/generate-pdf.ts` | Exists |
| `cn.test.ts` | Unit | `src/lib/cn.ts` | Exists |
| `constants.test.ts` | Unit | `src/lib/constants.ts` | Exists |
| `templates.test.ts` | Unit | All 5 templates + renderer | Exists |
| `color-picker.test.ts` | Integration | `src/components/ui/color-picker.tsx` | Exists |
| `landing-page.test.ts` | Integration | `src/components/landing/*.tsx` | Exists |
| `dark-mode.test.ts` | Integration | `src/components/shared/theme-*.tsx` | Exists |
| `print-styles.test.ts` | Integration | Print CSS class verification | Exists |
| `resume-store.test.ts` | Integration | `src/store/resume-store.ts` | Exists |
| `auto-save.test.ts` | Integration | `src/hooks/use-auto-save.ts` | Exists |
| `use-pdf-generator.test.ts` | Integration | `src/hooks/use-pdf-generator.ts` | Exists |
| `shareable-link.test.ts` | Integration | `src/hooks/use-shareable-link.ts` | Exists |
| `use-keyboard-shortcuts.test.ts` | Integration | `src/hooks/use-keyboard-shortcuts.ts` | Exists |
| `use-media-query.test.ts` | Integration | `src/hooks/use-media-query.ts` | **New** |
| `form-editor.test.ts` | Integration | `src/components/builder/sections/*.tsx` | Exists |
| `preview-panel.test.ts` | Integration | `src/components/builder/preview-panel.tsx` | Exists |
| `store-persistence.test.ts` | Integration | Store ↔ localStorage round-trips | Exists |
| `json-import-export.test.ts` | Integration | `importFromJSON` / `exportAsJSON` | Exists |
| `undo-redo.test.ts` | Integration | Undo/redo stack | Exists |
| `multiple-resumes.test.ts` | Integration | `src/hooks/use-resume-list.ts` | Exists |
| `monetization.test.ts` | Integration | `src/components/shared/affiliate-banner.tsx` | Exists |
| `keyboard-shortcuts.test.ts` | Integration | Keyboard behavior at component level | Exists |
| `property-based.test.ts` | Property | URL codec, JSON roundtrip, Zod, undo stack | **New** |

### E2E (`e2e/`)

| File | Flows Covered | New? |
|------|---------------|------|
| `home.spec.ts` | Landing page (AC-F006-*) | Exists (expand) |
| `builder.spec.ts` | Form, preview, persistence, dark mode, undo, multi-resume, color, PDF, a11y, print | Exists (expand) |
| `sharing.spec.ts` | Shareable links, network isolation (AC-F007-*) | Exists (expand) |
| `templates.spec.ts` | Template gallery, template switching (AC-F003-*) | Exists (expand) |
| `preview.spec.ts` | Read-only preview, CTA, invalid hash (AC-F007-*) | Exists (expand) |
| `security.spec.ts` | HTTP security headers (NFR-SEC-*) | **New** |
| `import-export.spec.ts` | JSON import/export (AC-F008-*) | **New** |

---

## 10. Running the Tests

```bash
# Unit + integration (watch mode during development)
npm run test

# Unit + integration (CI — single run with coverage report)
npm run test -- --run --coverage

# E2E tests (headless, CI)
npm run test:e2e

# E2E tests (headed, for debugging a single spec)
npx playwright test e2e/sharing.spec.ts --headed

# E2E — specific browser
npx playwright test --project=firefox
npx playwright test --project=webkit

# Full CI sequence (mirrors GitHub Actions)
npm run type-check && \
npm run lint && \
npm run test -- --run --coverage && \
npm run build && \
npm run test:e2e

# Property-based tests (subset, verbose)
npm run test -- --run --reporter=verbose src/__tests__/property-based.test.ts

# Static security checks
grep -r "dangerouslySetInnerHTML" src/ && echo "FAIL" || echo "PASS"
grep -rE "eval\(|new Function\(" src/ && echo "FAIL" || echo "PASS"
```

---

## 11. Spec → Test Traceability Matrix

Every acceptance criterion maps to at least one test at each applicable layer.

| Acceptance Criterion | Unit Test | Integration Test | E2E Test |
|---------------------|-----------|-----------------|---------|
| AC-F001-1 (preview within 200 ms) | — | `preview-panel.test.ts` | E2E-PREVIEW-01, E2E-PREVIEW-02 |
| AC-F001-2 (Add Experience form) | `resume-schema.test.ts` | `resume-store.test.ts`, `form-editor.test.ts` | E2E-FORM-01 |
| AC-F001-3 (drag reorder) | — | `resume-store.test.ts` (reorderExperiences) | E2E-FORM-03 |
| AC-F001-4 (validation on download) | `resume-schema.test.ts` | `use-pdf-generator.test.ts` | E2E-FORM-07, E2E-FORM-08 |
| AC-F001-5 (invalid email inline error) | `resume-schema.test.ts` | `form-editor.test.ts` | E2E-FORM-06 |
| AC-F001-6 (currently working) | `resume-schema.test.ts` | `form-editor.test.ts`, `templates.test.ts` | E2E-FORM-04, E2E-FORM-05 |
| AC-F002-1 (re-render 200 ms) | — | `preview-panel.test.ts` | E2E-PREVIEW-02 |
| AC-F002-2 (desktop side-by-side) | — | — | E2E-BUILDER-01 |
| AC-F002-3 (mobile bottom sheet) | — | — | E2E-BUILDER-02, E2E-BUILDER-03 |
| AC-F002-4 (PDF matches preview) | — | — | E2E-PDF-01, E2E-PDF-04 |
| AC-F003-1 (template switch) | — | `resume-store.test.ts` | E2E-TPL-03 |
| AC-F003-2 (all sections render) | `templates.test.ts` | — | E2E-TPL-04 |
| AC-F003-3 (text extractable) | `pdf-generator.test.ts` (print-based) | — | E2E-TPL-07, E2E-PDF-04 |
| AC-F003-4 (no data loss on switch) | — | `resume-store.test.ts` | E2E-TPL-05 |
| AC-F003-5 (multi-page flow) | — | — | E2E-TPL-06 |
| AC-F004-1 (PDF within 2 s) | — | `use-pdf-generator.test.ts` | E2E-PDF-01 |
| AC-F004-2 (PDF matches preview) | — | — | E2E-PDF-01, E2E-PDF-04 |
| AC-F004-3 (zero network requests) | `pdf-generator.test.ts` | — | E2E-PDF-03, E2E-SHARE-09 |
| AC-F004-4 (text selectable) | `pdf-generator.test.ts` (print engine used) | — | E2E-TPL-07, E2E-PDF-04 |
| AC-F004-5 (filename format) | — | `use-pdf-generator.test.ts` | E2E-PDF-02 |
| AC-F005-1 (1 s debounce) | — | `auto-save.test.ts` | E2E-PERSIST-01, E2E-PERSIST-02 |
| AC-F005-2 (restore on return) | — | `store-persistence.test.ts` | E2E-PERSIST-01, E2E-PERSIST-06 |
| AC-F005-3 (toast on quota error) | — | `auto-save.test.ts` | — |
| AC-F005-4 (confirm before clear) | — | `resume-store.test.ts` | E2E-PERSIST-03, E2E-PERSIST-04, E2E-PERSIST-05 |
| AC-F006-1 (hero headline) | — | `landing-page.test.ts` | E2E-HOME-01 |
| AC-F006-2 (≥ 3 anti-paywall messages) | — | `landing-page.test.ts` | E2E-HOME-02 |
| AC-F006-3 (CTA above fold) | — | `landing-page.test.ts` | E2E-HOME-03, E2E-HOME-04 |
| AC-F006-4 (LCP < 2.5 s) | — | — | E2E-HOME-08 (Lighthouse CI) |
| AC-F006-5 (meta tags) | — | `landing-page.test.ts` | E2E-HOME-05, E2E-HOME-06, E2E-HOME-07 |
| AC-F007-1 (share URL generated) | — | `shareable-link.test.ts`, `resume-store.test.ts` | E2E-SHARE-01, E2E-SHARE-02 |
| AC-F007-2 (preview reads URL correctly) | — | `resume-store.test.ts` | E2E-SHARE-04, E2E-SHARE-05, E2E-SHARE-10 |
| AC-F007-3 (compression > 8 KB) | `url-codec-extended.test.ts` | `resume-store.test.ts` | E2E-SHARE-03 |
| AC-F007-4 (read-only, CTA visible) | — | `preview-panel.test.ts` | E2E-SHARE-06, E2E-SHARE-07 |
| AC-F007-5 (no server request) | — | — | E2E-SHARE-09 |
| AC-F008-1 (valid JSON export) | — | `json-import-export.test.ts` | E2E-JSON-01, E2E-JSON-02 |
| AC-F008-2 (JSON import loads data) | — | `json-import-export.test.ts` | E2E-JSON-03 |
| AC-F008-3 (invalid JSON error; data preserved) | — | `json-import-export.test.ts` | E2E-JSON-04, E2E-JSON-05 |
| AC-F008-4 (JSON conforms to schema) | `resume-schema.test.ts` | `json-import-export.test.ts` | E2E-JSON-02 |
| AC-F009-1 (print hides UI chrome) | `print-styles.test.ts` | — | E2E-PRINT-01 |
| AC-F009-2 (print matches PDF) | — | — | Visual / manual check |
| AC-F010-1 (OS dark mode activates theme) | — | `dark-mode.test.ts` | E2E-DARK-01 |
| AC-F010-2 (preview always white) | — | `dark-mode.test.ts`, `preview-panel.test.ts` | E2E-DARK-02 |
| AC-F010-3 (toggle without reload) | — | `dark-mode.test.ts` | E2E-DARK-03 |
| AC-F011-1 (second resume without losing first) | — | `multiple-resumes.test.ts` | E2E-MULTI-01 |
| AC-F011-2 (list shows name/template/date) | — | `multiple-resumes.test.ts` | E2E-MULTI-02 |
| AC-F011-3 (delete confirmation) | — | `multiple-resumes.test.ts` | E2E-MULTI-03, E2E-MULTI-04 |
| AC-F012-1 (12 presets + hex input) | `constants.test.ts` | `color-picker.test.ts` | E2E-COLOR-01, E2E-COLOR-03 |
| AC-F012-2 (color updates preview) | — | `color-picker.test.ts`, `resume-store.test.ts` | E2E-COLOR-02, E2E-COLOR-03 |
| AC-F012-3 (low-contrast warning) | — | `color-picker.test.ts` | E2E-COLOR-04 |
| AC-F013-1 (Ctrl+Z reverts) | — | `undo-redo.test.ts`, `use-keyboard-shortcuts.test.ts` | E2E-UNDO-01, E2E-UNDO-05 |
| AC-F013-2 (Ctrl+Shift+Z re-applies) | — | `undo-redo.test.ts`, `use-keyboard-shortcuts.test.ts` | E2E-UNDO-02 |
| AC-F013-3 (stack caps at 50) | `constants.test.ts` | `undo-redo.test.ts`, `property-based.test.ts` | — |
