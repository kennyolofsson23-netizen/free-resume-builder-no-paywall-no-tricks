# TEST_PLAN.md — Free Resume Builder: No Paywall, No Tricks

> **Toolchain:** Vitest 1.x (unit/component) · Playwright 1.40 (E2E) · fast-check (property-based)
> **Test root:** `src/__tests__/` (unit/component) · `e2e/` (Playwright)
> **Run commands:** `npm run test` · `npm run test:e2e`
> **Last updated:** 2026-03-19

---

## 1. Test Strategy & Pyramid Ratios

### Why This Shape

This is a **100% client-side, zero-server** application. There are no HTTP APIs, no database, and no
authentication layer. Every "integration" boundary is in the browser:

- **Zustand store** ↔ localStorage
- **Form components** ↔ Zustand store
- **URL codec (pako + base64url)** ↔ Zustand store
- **jsPDF + html2canvas** ↔ DOM element
- **Next.js App Router** ↔ URL params / hash fragments

This shifts the pyramid compared to a typical full-stack app: the middle "integration" tier is thin
(store + codec roundtrips), unit tests are the bulk of confidence, and E2E tests cover critical
user-facing flows end-to-end.

```
                        ████████
                   ██ E2E (8%) ██          ~20 scenarios  (Playwright)
               ████████████████████
          █ Integration / Store (22%) █    ~55 tests      (Vitest, real jsdom)
      ████████████████████████████████████
  ████  Unit + Component (70%)  █████████  ~175 tests     (Vitest + RTL)
████████████████████████████████████████████
```

| Layer | Approx. Count | Tool | Speed | Confidence Focus |
|---|---|---|---|---|
| Unit / Component | ~175 | Vitest + RTL | < 30 s | Logic, validation, rendering |
| Integration | ~55 | Vitest (jsdom) | < 15 s | Store ↔ localStorage, codec roundtrips, data flows |
| E2E | ~20 | Playwright | ~3 min | Complete user journeys, PDF download, clipboard |
| Property-based | ~15 | fast-check | < 10 s | Serialization correctness, validator completeness |

### Guiding Principles

1. **Every acceptance criterion in SPEC.md maps to ≥ 1 automated test** (see §8 traceability matrix).
2. **Mock at the right boundary.** Mock `html2canvas`/`jsPDF` in unit tests; let them run real in Playwright.
3. **No mocking localStorage in integration tests** — use the real jsdom `localStorage` already wired in `src/test/setup.ts`.
4. **`data-testid` attributes are the stable E2E selector contract** — never couple to CSS classes or copy that changes with marketing tweaks (see §4 required attributes list).
5. **Performance assertions belong in Playwright** via `page.metrics()` and injected `PerformanceObserver`.

---

## 2. Unit Tests

### 2.1 `src/lib/schemas/resume-schema.ts`

**File:** `src/__tests__/schemas.test.ts` *(new)*

| Test | Criterion |
|---|---|
| `personalInfoSchema` accepts valid email formats | F001-AC5 |
| `personalInfoSchema` rejects blank `fullName` | F001-AC4 |
| `personalInfoSchema` rejects invalid email on parse | F001-AC5 |
| `personalInfoSchema` rejects `email` > 254 chars | field limits |
| `personalInfoSchema` rejects `fullName` > 100 chars | field limits |
| `personalInfoSchema` accepts empty `website`/`linkedin`/`github` (`""`) | optional URLs |
| `personalInfoSchema` rejects malformed non-empty URLs | security |
| `personalInfoSchema` rejects `summary` > 2000 chars | field limits |
| `experienceSchema` requires `jobTitle` | schema |
| `experienceSchema` requires `company` | schema |
| `experienceSchema` requires `startDate` | schema |
| `experienceSchema` accepts `currentlyWorking: true` with no `endDate` | F001-AC6 |
| `experienceSchema` rejects `description` > 5000 chars | field limits |
| `educationSchema` requires `school` and `degree` | schema |
| `skillSchema` rejects `name` > 50 chars | field limits |
| `skillSchema` accepts all 4 level enum values (`beginner`–`expert`) | schema |
| `skillSchema` rejects unknown `level` value | schema |
| `projectSchema` accepts optional `link` as `""` | optional URLs |
| `projectSchema` rejects non-URL non-empty `link` | security |
| `projectSchema` accepts empty `technologies` array | schema |
| `certificationSchema` requires `name` and `issuer` | schema |
| `certificationSchema` rejects `credentialUrl` that is not a URL | security |
| `resumeSchema` accepts valid 6-digit hex `accentColor` | F012-AC1 |
| `resumeSchema` rejects non-hex `accentColor` (e.g. `"red"`) | F012-AC1 |
| `resumeSchema` rejects invalid `template` name | F003 |
| `resumeSchema` requires ISO datetime for `createdAt`/`updatedAt` | schema |

**Edge cases:**
- Unicode chars in `fullName` (e.g. `"Ångström, Björn"`) — accepted
- XSS injection strings in text fields (e.g. `"<script>alert(1)</script>"`) — accepted as plain text, never evaluated (React escaping verified separately)
- Exactly at boundary values (100 chars, 2000 chars) — pass; one over — fail

**Mock boundaries:** None — pure Zod, no I/O.

---

### 2.2 `src/lib/sharing/url-codec.ts`

**File:** `src/__tests__/shareable-link.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| `encodeResumeData` produces `j:` prefix for data < 8 KB | F007-AC3 |
| `encodeResumeData` produces `c:` prefix for data ≥ 8 KB | F007-AC3 |
| `encodeResumeForURL` produces `z:` prefix for compressed new codec | F007-AC1 |
| `decodeResumeData('j:...')` roundtrips perfectly *(existing)* | F007-AC2 |
| `decodeResumeData('c:...')` roundtrips with compression *(existing)* | F007-AC3 |
| `decodeResumeData` returns `null` for empty string *(existing)* | error handling |
| `decodeResumeData` returns `null` for invalid base64 *(existing)* | error handling |
| `decodeResumeData` returns `null` for `c:` + corrupt deflate *(existing)* | error handling |
| `decodeResumeFromURL` handles `z:` prefix (new codec) | F007-AC2 |
| `decodeResumeFromURL` handles legacy `c:` and `j:` prefixes | backward compat |
| Output is URL-safe (no `+`, `/`, `=`) | F007-AC1 |
| Encoded data contains no `#` or `?` | F007-AC5, security |
| Full 6-section resume roundtrips without data loss | F007-AC2 |

**Mock boundaries:** None — pure functions (pako + base64).

---

### 2.3 `src/lib/pdf/generate-pdf.ts`

**File:** `src/__tests__/pdf-generator.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Module exports a `generatePDF` function *(existing)* | F004 |
| Filename formatted as `{FullName}_Resume.pdf` *(existing)* | F004-AC5 |
| Special characters in name are sanitized in filename *(existing)* | F004-AC5 |
| Hyphens and spaces in name preserved *(existing)* | F004-AC5 |
| `generatePDF` options accept `elementId`, `fileName`, `scale` | F004 |
| `generatePDF` calls `html2canvas` with scale ≥ 2 (quality) | F004-AC2 |
| `generatePDF` produces US Letter dimensions (612 × 792 pt) | F004-AC2 |
| `generatePDF` tiles multiple pages when canvas height > 792 pt | F003-AC5 |
| `generatePDF` makes zero fetch/XHR calls (client-side only) | F004-AC3 |
| Module does not import Node.js-only APIs (`fs`, `path`) | F004-AC3 |

**Mock boundaries:** Mock `html2canvas` to return a fixed `HTMLCanvasElement` stub; mock `jsPDF`
constructor to capture calls. Do **not** mock in E2E.

---

### 2.4 `src/store/resume-store.ts`

**File:** `src/__tests__/resume-store.test.ts` *(extends existing — already comprehensive)*

Missing cases to add:

| Test | Criterion |
|---|---|
| `createNewResume` stamps `createdAt` and `updatedAt` as ISO strings | schema |
| `updatePersonalInfo` updates `updatedAt` timestamp | F005-AC1 |
| `addExperience` generates a unique non-empty `id` | F001-AC2 |
| `addExperience` called twice produces two different IDs | F001-AC2 |
| `reorderExperiences` with unknown IDs is a no-op (no crash) | resilience |
| `reorderEducation` preserves total entry count | F001-AC3 |
| Undo stack caps at `MAX_UNDO_HISTORY` (50) entries | F013-AC3 |
| After cap exceeded, oldest entry is dropped, newest retained | F013-AC3 |
| `undo()` when `pastStates` is empty is a no-op | F013 |
| `redo()` when `futureStates` is empty is a no-op | F013 |
| Any new mutation after undo clears `futureStates` | F013 |
| `saveToLocalStorage` writes to `STORAGE_KEY` | F005-AC1 |
| `loadFromLocalStorage` restores all 6 sections | F005-AC2 |
| `loadFromLocalStorage` with corrupted JSON falls back gracefully | F005-AC3 |
| `loadFromLocalStorage` with Zod-invalid data falls back gracefully | F005-AC3 |
| `reset` clears both store state and `localStorage[STORAGE_KEY]` | F005-AC4 |
| `generateShareableURL` embeds data in `#` fragment (not `?`) | F007-AC5, security |
| `importFromJSON` with schema-invalid data returns `false` without mutating state | F008-AC3 |
| `importFromJSON` success resets undo/redo history | usability |
| `loadFromShareableURL` with valid hash roundtrips all fields | F007-AC2 |

---

### 2.5 `src/hooks/use-auto-save.ts`

**File:** `src/__tests__/auto-save.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Does not save on first render (mount) | F005 |
| Saves after 1000 ms debounce following a change | F005-AC1 |
| Resets debounce timer on rapid successive changes | F005-AC1 |
| Exposes `isSaving: true` during debounce window | UX |
| Exposes `lastSaved` Date after successful save | UX |
| Shows non-blocking error toast when `localStorage.setItem` throws `QuotaExceededError` | F005-AC3 |
| Clears pending timer on unmount (no memory leak) | F005 |

**Mock boundaries:** Mock `localStorage.setItem` to throw `QuotaExceededError` for storage-full test.

---

### 2.6 `src/hooks/use-pdf-generator.ts`

**File:** `src/__tests__/pdf-generator.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| `downloadPDF` shows error toast when `fullName` is empty | F004-AC1, F001-AC4 |
| `downloadPDF` shows error toast when `email` is empty | F004-AC1, F001-AC4 |
| `isGenerating` is `true` while PDF is being created | UX |
| `status` transitions: `idle` → `generating` → `success` | UX |
| `status` transitions: `idle` → `generating` → `error` on failure | UX |
| `generatePDF` is dynamically imported (not in initial bundle) | NFR bundle size |
| `downloadPDF` resolves within mocked 2 s timeout | F004-AC1 |

**Mock boundaries:** Mock dynamic `import('@/lib/pdf/generate-pdf')`.

---

### 2.7 `src/hooks/use-keyboard-shortcuts.ts`

**File:** `src/__tests__/undo-redo.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| `Ctrl+Z` calls `store.undo()` | F013-AC1 |
| `Cmd+Z` calls `store.undo()` (macOS) | F013-AC1 |
| `Ctrl+Shift+Z` calls `store.redo()` | F013-AC2 |
| `Ctrl+Y` calls `store.redo()` | F013-AC2 |
| `Ctrl+Z` while an `<input>` is focused is ignored | F013-AC1 |
| `Ctrl+Z` while a `<textarea>` is focused is ignored | F013-AC1 |
| Event listener cleaned up on unmount | resilience |

**Mock boundaries:** Mock `useResumeStore` selectors.

---

### 2.8 `src/hooks/use-shareable-link.ts`

*(Already well-covered in existing `shareable-link.test.ts`)*

Additional cases:

| Test | Criterion |
|---|---|
| `isCopied` resets to `false` after 2000 ms *(existing)* | F007-AC1 |
| Shows destructive toast when no resume in store *(existing)* | F007 |
| Shows destructive toast when clipboard write is rejected *(existing)* | F007 |
| Generated URL contains `/preview#` *(existing)* | F007-AC1 |

---

### 2.9 `src/components/landing/` (Component tests)

**File:** `src/__tests__/landing-page.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Hero heading contains "Free Resume Builder — No Paywall, No Tricks" | F006-AC1 |
| CTA "Build Your Resume — It's Free" is rendered | F006-AC3 |
| At least 3 distinct anti-paywall messages are present in the DOM | F006-AC2 |
| CTA button links to `/builder` | F006-AC3 |
| `<title>` targets "free resume builder no paywall" | F006-AC5 |
| `<meta name="description">` contains "Zety free alternative" | F006-AC5 |
| `<meta property="og:title">` is defined | F006-AC5 |
| `<meta property="og:description">` is defined | F006-AC5 |
| Template showcase section renders all 5 template names | F003 |
| FAQ section is present in the DOM | F006 |
| Footer has affiliate link to Kickresume | Monetization |
| No paywall / "premium" / "upgrade" UI element is present | Monetization rule |
| No account-creation prompt anywhere | Monetization rule |

---

### 2.10 `src/components/templates/` (Component tests)

**File:** `src/__tests__/templates.test.ts` *(extends existing)*

For each of the 5 templates (`modern`, `classic`, `minimal`, `creative`, `professional`):

| Test | Criterion |
|---|---|
| Renders `fullName` from `personalInfo` | F003-AC2 |
| Renders `email`, `phone`, `location` | F003-AC2 |
| Renders all experience entries | F003-AC2 |
| Renders all education entries | F003-AC2 |
| Renders all skills | F003-AC2 |
| Renders all projects | F003-AC2 |
| Renders all certifications | F003-AC2 |
| Experience with `currentlyWorking: true` shows "Present" not end date | F001-AC6 |
| Accepts `accentColor` prop and reflects it in accent elements | F012-AC2 |
| Renders with all sections empty without crashing | resilience |
| Renders with maximum field lengths without DOM overflow | F003-AC2 |
| All text is in the DOM (not CSS `content:` or `<canvas>`) | F004-AC4, F003-AC3 |
| Container width is 816 px (US Letter equivalent) | F003-AC2, F004-AC2 |

**`template-renderer.tsx` additional tests:**

| Test | Criterion |
|---|---|
| Routes `template: 'modern'` to `<ModernTemplate>` | F003 |
| Routes all 5 template values to correct components | F003 |
| Switching template prop re-renders without data loss | F003-AC4 |

---

### 2.11 `src/components/builder/sections/` (Form section tests)

**File:** `src/__tests__/form-editor.test.ts` *(extends existing)*

**`personal-info-form.tsx`:**

| Test | Criterion |
|---|---|
| All inputs have associated `<label>` elements (not just placeholders) | NFR Accessibility |
| Typing in `fullName` calls `updatePersonalInfo` | F001-AC1 |
| Blurring `email` with invalid value shows inline error message | F001-AC5 |
| Blurring `email` with valid value clears error | F001-AC5 |
| Blurring `website` with non-URL value shows error | F001-AC5, security |
| Required fields carry `aria-required="true"` | NFR Accessibility |
| Error messages are associated via `aria-describedby` | NFR Accessibility |

**`experience-form.tsx`:**

| Test | Criterion |
|---|---|
| "Add Experience" button appends a new entry | F001-AC2 |
| "Remove" button removes the correct entry by ID | F001-AC2 |
| "Currently Working" checkbox hides end date field | F001-AC6 |
| Unchecking "Currently Working" restores end date field | F001-AC6 |
| Drag handle has `data-testid="drag-handle"` | E2E selector contract |

**`education-form.tsx`, `skills-form.tsx`, `projects-form.tsx`, `certifications-form.tsx`:**

| Test | Criterion |
|---|---|
| "Add" button appends entry for each section type | F001-AC2 |
| "Remove" button removes the correct entry | F001-AC2 |
| Skill level `<select>` offers all 4 levels | schema |

---

### 2.12 `src/components/builder/preview-panel.tsx`

**File:** `src/__tests__/preview-panel.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Renders element with `id="resume-preview-container"` (PDF capture target) | F004 |
| Re-renders when Zustand store changes | F002-AC1 |
| Contains `<TemplateRenderer>` receiving current store data | F002 |
| Preview container background is always white regardless of theme | F010-AC2 |
| Contains an `aria-live="polite"` region for screen reader updates | NFR Accessibility |

---

### 2.13 `src/components/builder/builder-toolbar.tsx`

**File:** `src/__tests__/builder-toolbar.test.ts` *(new)*

| Test | Criterion |
|---|---|
| Template dropdown renders all 5 template options | F003-AC1 |
| Selecting a template calls `updateTemplate` with correct value | F003-AC1 |
| "Download PDF" button is visible | F004 |
| "Download PDF" click triggers `downloadPDF` from hook | F004-AC1 |
| "Share" button click triggers `generateLink` | F007-AC1 |
| "New Resume" button click shows confirmation dialog | F005-AC4 |
| Confirming "New Resume" calls `reset` | F005-AC4 |
| Cancelling "New Resume" does not call `reset` | F005-AC4 |
| "Import JSON" triggers hidden file input click | F008-AC2 |
| "Export JSON" click triggers `.json` file download | F008-AC1 |
| Undo button is disabled when `canUndo()` is `false` | F013 |
| Redo button is disabled when `canRedo()` is `false` | F013 |
| Accent color picker is present for `modern`/`creative`/`professional` | F012-AC1 |

---

### 2.14 `src/components/ui/color-picker.tsx`

**File:** `src/__tests__/color-picker.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Renders exactly 12 preset color swatches | F012-AC1 |
| Clicking a swatch calls `onChange` with its hex value | F012-AC2 |
| Hex input field updates on valid 6-digit hex entry | F012-AC1 |
| Hex input ignores invalid hex strings (no crash, no state change) | F012-AC1 |
| Low-contrast color (< 3:1 against white) shows warning message | F012-AC3 |
| High-contrast color clears the warning | F012-AC3 |

---

### 2.15 `src/components/shared/theme-toggle.tsx`

**File:** `src/__tests__/dark-mode.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Clicking toggle switches `<html>` from `light` to `dark` class | F010-AC3 |
| Clicking toggle again removes `dark` class | F010-AC3 |
| System `prefers-color-scheme: dark` sets dark theme on initial mount | F010-AC1 |
| Dark mode does not apply to resume preview background | F010-AC2 |

---

### 2.16 `src/components/builder/resume-list-panel.tsx`

**File:** `src/__tests__/multiple-resumes.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Shows list of all saved resumes | F011-AC2 |
| Each entry shows resume name, template, and last-modified date | F011-AC2 |
| Clicking a resume loads it into the store | F011-AC1 |
| "New Resume" creates a second resume without deleting the first | F011-AC1 |
| "Delete" button opens a confirmation dialog | F011-AC3 |
| Confirming deletion removes the resume | F011-AC3 |
| Cancelling deletion keeps the resume intact | F011-AC3 |

---

### 2.17 Monetization — no paywall guards

**File:** `src/__tests__/monetization.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Kickresume affiliate link is present in the DOM | Monetization |
| Affiliate link has `rel="noopener noreferrer"` | Security |
| No PDF download gate or paywall element anywhere in DOM | Monetization rule |
| No account creation prompt anywhere | Monetization rule |
| No "premium" or "upgrade" UI element anywhere | Monetization rule |

---

### 2.18 Print Styles

**File:** `src/__tests__/print-styles.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| `@media print` CSS hides `<header>` and navigation | F009-AC1 |
| `@media print` hides toolbar elements | F009-AC1 |
| `@media print` shows only resume container | F009-AC1 |
| Print page size targets US Letter | F009-AC2 |

---

## 3. Integration Tests

> Tests for data flows across the full Zustand store interface — the "API" of this
> client-side app. All run in Vitest with real jsdom `localStorage`.

### 3.1 Form → Store → Preview Data Flow

**File:** `src/__tests__/data-flow.test.ts` *(new)*

| Test | Criterion |
|---|---|
| Updating `fullName` → `updatePersonalInfo` → store reflects new value | F001-AC1, F002-AC1 |
| Adding 3 experiences → store has 3 experiences in correct order | F001-AC2 |
| Reordering experiences → store order matches new ID array | F001-AC3 |
| Template switch → store `resume.template` changes, data is intact | F003-AC4 |
| Accent color change → store `resume.accentColor` updates | F012-AC2 |
| All 6 sections populated → `exportAsJSON` output contains all data | F008-AC1 |

---

### 3.2 Store → localStorage Persistence Flow

**File:** `src/__tests__/auto-save.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| After `saveToLocalStorage`, `localStorage[STORAGE_KEY]` is valid JSON | F005-AC1 |
| Saved JSON passes `resumeSchema.safeParse` | F005-AC2 |
| `loadFromLocalStorage` after `saveToLocalStorage` roundtrips 100% | F005-AC2 |
| `loadFromLocalStorage` with stale data (missing optional fields) gracefully defaults | F005-AC2 |
| `reset()` removes `localStorage[STORAGE_KEY]` entirely | F005-AC4 |
| Multiple rapid updates → only 1 `setItem` call (debounce) | F005-AC1 |
| `QuotaExceededError` on `setItem` → toast shown, store state unchanged | F005-AC3 |

---

### 3.3 URL Codec ↔ Store Sharing Flow

**File:** `src/__tests__/shareable-link.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| Full resume → `generateShareableURL` → `loadFromShareableURL` roundtrips | F007-AC2 |
| URL fragment is after `#` (never in HTTP request path or query) | F007-AC5 |
| Encoded URL for a 6-section resume is under ~50 KB | F007-AC1 |
| Opening hash with missing required fields → Zod parse fails gracefully | F007-AC2 |
| Legacy `c:` prefix decoded correctly by new codec | backward compat |
| Legacy `j:` prefix decoded correctly by new codec | backward compat |

---

### 3.4 JSON Import/Export Flow

**File:** `src/__tests__/json-import-export.test.ts` *(extends existing)*

| Test | Criterion |
|---|---|
| `exportAsJSON` output is parseable by `JSON.parse` | F008-AC1 |
| Exported JSON conforms to `resumeSchema` | F008-AC4 |
| `importFromJSON` with exported JSON recreates identical resume | F008-AC2 |
| `importFromJSON` with extra unknown fields strips them (Zod) | F008-AC3 |
| `importFromJSON` with missing required fields returns `false` | F008-AC3 |
| `importFromJSON` with malformed JSON string returns `false` | F008-AC3 |
| On `importFromJSON` failure, previous resume state is untouched | F008-AC3 |

---

### 3.5 Builder Page Mount Flow

**File:** `src/__tests__/builder-page.test.ts` *(new)*

| Test | Criterion |
|---|---|
| With empty localStorage → `createNewResume` called on mount | F005 flow |
| With valid localStorage data → `loadFromLocalStorage` is used | F005-AC2 |
| With `?template=modern` URL param → `updateTemplate('modern')` called | F003-AC1 |
| With `?template=invalid` URL param → ignored, defaults preserved | F003 |
| With `?template=creative` URL param → creative template is set | F003-AC1 |

---

### 3.6 Preview Page Mount Flow

**File:** `src/__tests__/preview-page.test.ts` *(new)*

| Test | Criterion |
|---|---|
| With valid `#hash` → resume renders in read-only mode | F007-AC2 |
| With invalid `#hash` → error state shown + CTA to builder | F007-AC2 |
| With empty hash → error state shown | F007-AC2 |
| Edit controls (form, save) are absent from the preview page | F007-AC4 |
| "Build Your Own — It's Free" CTA is present | F007-AC4 |

---

## 4. End-to-End Tests (Playwright)

> Run against `http://localhost:3000` across Chromium, Firefox, and WebKit.

### Required `data-testid` Attributes

These stable selectors must exist in source components before E2E tests can be written:

| `data-testid` | Component | Purpose |
|---|---|---|
| `hero-heading` | `hero.tsx` | Assert landing headline |
| `cta-button` | `hero.tsx` | Primary CTA click |
| `anti-paywall-message` | landing sections | Count ≥ 3 messages |
| `template-selector` | `builder-toolbar.tsx` | Template dropdown trigger |
| `template-option-{name}` | `builder-toolbar.tsx` | Per-template option |
| `download-pdf-btn` | `builder-toolbar.tsx` | PDF download button |
| `share-btn` | `builder-toolbar.tsx` | Share link button |
| `new-resume-btn` | `builder-toolbar.tsx` | New resume button |
| `confirm-new-resume` | dialog | Confirm clearing data |
| `import-json-btn` | `builder-toolbar.tsx` | Import JSON trigger |
| `export-json-btn` | `builder-toolbar.tsx` | Export JSON trigger |
| `undo-btn` | `builder-toolbar.tsx` | Undo button |
| `redo-btn` | `builder-toolbar.tsx` | Redo button |
| `color-picker` | `color-picker.tsx` | Accent color trigger |
| `color-swatch-{hex}` | `color-picker.tsx` | Individual color swatch |
| `form-panel` | `form-panel.tsx` | Left panel container |
| `preview-panel` | `preview-panel.tsx` | Right panel container |
| `personal-info-tab` | `form-panel.tsx` | Personal info tab |
| `experience-tab` | `form-panel.tsx` | Experience tab |
| `field-fullName` | `personal-info-form.tsx` | Full name input |
| `field-email` | `personal-info-form.tsx` | Email input |
| `field-phone` | `personal-info-form.tsx` | Phone input |
| `field-summary` | `personal-info-form.tsx` | Summary textarea |
| `error-email` | `personal-info-form.tsx` | Email error message |
| `add-experience-btn` | `experience-form.tsx` | Add experience button |
| `remove-experience-{id}` | `section-entry.tsx` | Remove specific entry |
| `drag-handle-{id}` | `section-entry.tsx` | Drag handle |
| `currently-working-{id}` | `experience-form.tsx` | "Currently Working" checkbox |
| `mobile-preview-btn` | `mobile-preview-sheet.tsx` | Preview trigger on mobile |
| `resume-preview-container` | `preview-panel.tsx` | PDF capture target (already present) |
| `preview-cta` | `preview-cta.tsx` | "Build Your Own" CTA |
| `dark-mode-toggle` | `theme-toggle.tsx` | Theme switch |
| `resume-list-panel` | `resume-list-panel.tsx` | Multiple resumes list |
| `resume-list-item-{id}` | `resume-list-panel.tsx` | Individual resume row |
| `delete-resume-{id}` | `resume-list-panel.tsx` | Delete resume button |
| `confirm-delete-resume` | dialog | Confirm deletion |
| `use-template-{name}` | `template-gallery.tsx` | "Use This Template" button |

---

### 4.1 Flow: First-Time Visitor — Land and Build

**File:** `e2e/landing-to-builder.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| `GET /` | Page `<title>` contains "Free Resume Builder" | F006-AC5 |
| | `[data-testid="hero-heading"]` visible above fold | F006-AC1 |
| | Text "No Paywall, No Tricks" visible | F006-AC1 |
| | At least 3 `[data-testid="anti-paywall-message"]` elements | F006-AC2 |
| | `[data-testid="cta-button"]` visible without scrolling | F006-AC3 |
| Click CTA button | URL becomes `/builder` | F006-AC3 |
| | `[data-testid="form-panel"]` visible | F001 |
| | `[data-testid="preview-panel"]` visible (desktop) | F002-AC2 |
| Type "Sarah Chen" in `[data-testid="field-fullName"]` | Preview updates within 200 ms | F001-AC1, F002-AC1 |
| | Preview contains text "Sarah Chen" | F002-AC1 |

---

### 4.2 Flow: Complete Resume and Download PDF

**File:** `e2e/complete-resume-download.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/builder` | Page loads | F001 |
| Fill `fullName`: "Jane Smith" | — | F001 |
| Fill `email`: "jane@example.com" | — | F001 |
| Click Experience tab → "Add Experience" | New experience form visible | F001-AC2 |
| Fill `jobTitle`: "Engineer", `company`: "Acme" | — | F001 |
| Click Education tab → "Add Education" | New education form visible | F001-AC2 |
| Fill `school`: "MIT", `degree`: "BS" | — | F001 |
| Click Skills tab → "Add Skill" | New skill form visible | F001-AC2 |
| Fill skill `name`: "TypeScript" | — | F001 |
| Click `[data-testid="download-pdf-btn"]` | Download initiated | F004-AC1 |
| | Downloaded file is named "Jane Smith_Resume.pdf" | F004-AC5 |
| | Download completes within 2 seconds | F004-AC1 |
| Intercept network during download | Zero external HTTP requests made | F004-AC3 |

---

### 4.3 Flow: Validation Prevents Download with Missing Fields

**File:** `e2e/validation.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/builder` (fresh state) | — | — |
| Click `[data-testid="download-pdf-btn"]` immediately | Validation error or toast visible | F001-AC4, F004-AC1 |
| | No PDF download initiated | F001-AC4 |
| Fill `fullName` only → click Download | Error shown (email still missing) | F001-AC4 |
| Enter `"not-an-email"` in email → blur | `[data-testid="error-email"]` visible | F001-AC5 |
| Correct email to `"jane@example.com"` → blur | Error message cleared | F001-AC5 |
| Click Download | Download proceeds successfully | F004-AC1 |

---

### 4.4 Flow: Template Switching

**File:** `e2e/template-switching.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/builder`, fill `fullName` | — | — |
| Open `[data-testid="template-selector"]` | Dropdown shows 5 options | F003-AC1 |
| Select "Classic" | Preview immediately shows classic layout | F003-AC1 |
| | `fullName` still visible in preview | F003-AC4 |
| Select "Minimal" | Preview immediately updates | F003-AC1, F003-AC4 |
| Select "Creative" | Preview immediately updates | F003-AC1, F003-AC4 |
| Select "Professional" | Preview immediately updates | F003-AC1, F003-AC4 |
| Select "Modern" | Preview returns to modern layout | F003-AC1, F003-AC4 |
| All 5 switches complete | No data loss observed in any switch | F003-AC4 |

---

### 4.5 Flow: LocalStorage Persistence (Session Restore)

**File:** `e2e/persistence.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/builder` | — | — |
| Fill `fullName`: "Persistent Pete", `email`: "pete@test.com" | — | F005 |
| Wait 1500 ms (debounce + buffer) | `localStorage[STORAGE_KEY]` contains resume data | F005-AC1 |
| Close and reopen `/builder` (new `page` object) | `fullName` "Persistent Pete" restored | F005-AC2 |
| | `email` "pete@test.com" restored | F005-AC2 |
| Click "New Resume" → "Confirm" | Form clears | F005-AC4 |
| Reload page | Fresh empty resume shown | F005-AC4 |

---

### 4.6 Flow: "New Resume" Confirmation Dialog

**File:** `e2e/new-resume-dialog.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Fill resume with data | — | — |
| Click `[data-testid="new-resume-btn"]` | Confirmation dialog appears | F005-AC4 |
| Click "Cancel" | Dialog dismisses, data intact | F005-AC4 |
| Click "New Resume" again → "Confirm" | Form clears | F005-AC4 |
| | Preview shows empty resume | F005-AC4 |

---

### 4.7 Flow: Shareable Link Generation and Consumption

**File:** `e2e/shareable-link.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/builder`, fill `fullName` + `email` | — | — |
| Click `[data-testid="share-btn"]` | Toast "Link copied to clipboard!" appears | F007-AC1 |
| Intercept clipboard value | URL contains `/preview#` | F007-AC1 |
| Navigate to captured URL | `/preview` page loads | F007-AC2 |
| | `fullName` visible in resume preview | F007-AC2 |
| | `[data-testid="preview-cta"]` ("Build Your Own") visible | F007-AC4 |
| | No form / edit controls visible | F007-AC4 |
| Monitor network during page load | No XHR/fetch to any backend | F007-AC5 |

---

### 4.8 Flow: JSON Import and Export

**File:** `e2e/json-import-export.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Fill resume with all 6 sections | — | — |
| Click `[data-testid="export-json-btn"]` | `.json` file downloads | F008-AC1 |
| Inspect downloaded file | Contains valid JSON conforming to Resume type | F008-AC4 |
| Click "New Resume" → Confirm | Form clears | — |
| Click `[data-testid="import-json-btn"]` → select downloaded file | All data fully restored | F008-AC2 |
| Import an invalid text file | Error toast shown, existing form data unchanged | F008-AC3 |

---

### 4.9 Flow: Undo / Redo with Keyboard Shortcuts

**File:** `e2e/undo-redo.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/builder` | — | — |
| Type `fullName`: "Before" | Preview shows "Before" | F013 |
| Clear and type `fullName`: "After" | Preview shows "After" | F013 |
| Press `Ctrl+Z` | `fullName` reverts to "Before" | F013-AC1 |
| | Preview shows "Before" | F013-AC1 |
| Press `Ctrl+Shift+Z` | `fullName` becomes "After" | F013-AC2 |
| | `[data-testid="undo-btn"]` enabled | F013 |
| | `[data-testid="redo-btn"]` disabled | F013 |

---

### 4.10 Flow: Mobile Preview Bottom Sheet

**File:** `e2e/mobile-preview.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Set viewport to 375 × 812 | — | — |
| Navigate to `/builder` | Form panel visible | F002-AC3 |
| | `[data-testid="preview-panel"]` NOT visible (hidden on mobile) | F002-AC3 |
| Click `[data-testid="mobile-preview-btn"]` | Bottom sheet slides up with resume preview | F002-AC3 |
| Dismiss sheet | Sheet closes, form re-visible | F002-AC3 |

---

### 4.11 Flow: Template Gallery → Builder

**File:** `e2e/template-gallery.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/templates` | All 5 template names visible | F003 |
| | Sample resume data rendered inside each template | F003-AC2 |
| Click `[data-testid="use-template-creative"]` | Navigates to `/builder?template=creative` | F003-AC1 |
| | Builder loads with creative template active in toolbar | F003-AC1 |

---

### 4.12 Flow: Dark Mode Toggle

**File:** `e2e/dark-mode.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/builder` | Default theme applied | F010 |
| Click `[data-testid="dark-mode-toggle"]` | `<html>` gains `class="dark"` | F010-AC3 |
| | Editor UI background is dark | F010-AC3 |
| | `[data-testid="resume-preview-container"]` background is white | F010-AC2 |
| Click toggle again | `class="dark"` is removed | F010-AC3 |

---

### 4.13 Flow: Accent Color Picker

**File:** `e2e/color-picker.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/builder` (modern template active) | — | — |
| Click `[data-testid="color-picker"]` | Color picker opens with 12 swatches | F012-AC1 |
| Click `[data-testid="color-swatch-#ef4444"]` (red) | Picker closes | F012-AC2 |
| | Preview accent elements show red | F012-AC2 |
| Enter `#ffffff` in hex input | Low-contrast warning message appears | F012-AC3 |

---

### 4.14 Flow: "Currently Working" Toggle

**File:** `e2e/currently-working.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Add an experience entry | End date field visible | F001-AC6 |
| Check `[data-testid="currently-working-{id}"]` | End date field hidden | F001-AC6 |
| | Preview shows "Present" instead of end date | F001-AC6 |
| Uncheck "Currently Working" | End date field reappears | F001-AC6 |

---

### 4.15 Flow: Drag-to-Reorder

**File:** `e2e/drag-reorder.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Add 2 experience entries: company "Acme" then "Beta Corp" | Order in form: [Acme, Beta Corp] | F001-AC3 |
| Drag "Beta Corp" drag handle above "Acme" | Order in form: [Beta Corp, Acme] | F001-AC3 |
| | Preview shows "Beta Corp" before "Acme" | F001-AC3 |

---

### 4.16 Flow: Performance Assertions

**File:** `e2e/performance.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/` | LCP < 2500 ms (via injected `PerformanceObserver`) | F006-AC4, NFR |
| Navigate to `/builder` | Page interactive in < 5 s | NFR |
| Type in `fullName` field | Preview update latency < 200 ms | F001-AC1, F002-AC1, NFR |
| Open template selector | INP < 200 ms | NFR |
| Check initial JS bundle size | < 250 KB gzipped (via `next build` output) | NFR bundle |

---

### 4.17 Flow: Keyboard Navigation (Accessibility)

**File:** `e2e/accessibility.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Focus `<body>`, Tab through header | Focus indicator (2 px+ outline) visible on all elements | NFR Accessibility |
| Tab to form panel | Section tabs reachable by keyboard | NFR Accessibility |
| Tab into `fullName` → type → Tab | All form inputs focusable in logical order | NFR Accessibility |
| Tab to "Download PDF" button → Enter | PDF download triggers | NFR Accessibility |
| Run `axe` accessibility scan on `/` | Zero critical violations | NFR Accessibility |
| Run `axe` scan on `/builder` | Zero critical violations | NFR Accessibility |
| Run `axe` scan on `/templates` | Zero critical violations | NFR Accessibility |

> Use `@axe-core/playwright` for automated WCAG 2.2 AA scanning.

---

### 4.18 Flow: Multiple Resumes

**File:** `e2e/multiple-resumes.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Create resume #1 (fullName: "Resume A") | — | F011-AC1 |
| Click "New Resume" → Confirm | Resume #2 created | F011-AC1 |
| | Resume #1 still accessible in list | F011-AC1 |
| Open resume list panel | Both entries show name + template + date | F011-AC2 |
| Click Resume #1 entry | Form loads Resume #1 data | F011-AC1 |
| Click delete on Resume #2 → Cancel | Resume #2 remains in list | F011-AC3 |
| Click delete on Resume #2 → Confirm | Resume #2 removed from list | F011-AC3 |

---

### 4.19 Flow: Print Styles

**File:** `e2e/print-styles.spec.ts`

| Step | Assertion | Criterion |
|---|---|---|
| Navigate to `/preview#<valid-hash>` | — | — |
| Emulate `print` media via Playwright | `@media print` CSS applied | F009-AC1 |
| | Navigation / header elements hidden | F009-AC1 |
| | CTA button hidden | F009-AC1 |
| | `[data-testid="resume-preview-container"]` visible | F009-AC1 |
| | Page `@page` dimensions match US Letter | F009-AC2 |

---

### 4.20 Flow: Cross-Browser Smoke

**File:** `e2e/cross-browser.spec.ts` *(Playwright runs Chromium + Firefox + WebKit)*

| Step | Assertion | Browsers |
|---|---|---|
| `/` loads — hero heading visible | Heading rendered correctly | Chrome, Firefox, Safari |
| `/builder` loads — split layout | Form + preview side by side | Chrome, Firefox, Safari |
| Type `fullName` → preview updates | Preview reflects typed text | Chrome, Firefox, Safari |
| Template switch | Preview updates to new template | Chrome, Firefox, Safari |
| PDF download button click | Download event fires | Chrome, Firefox, Safari |
| Share button click | Clipboard write attempted | Chrome, Firefox, Safari |

---

## 5. Property-Based Tests

> Using **fast-check** (compatible with Vitest). Add as `src/__tests__/property-based.test.ts`.
>
> Install: `npm install --save-dev fast-check`

### 5.1 URL Codec Roundtrip (Critical)

| ID | Property | Criterion |
|---|---|---|
| FC-001 | `encodeResumeForURL(x)` → `decode(encode(x)) === x` for any serializable resume-shaped object | F007-AC2 |
| FC-002 | Encoded output contains only URL-safe characters `[A-Za-z0-9\-_~:.]` | F007-AC1 |
| FC-003 | Objects whose JSON exceeds 8 KB get a `z:` or `c:` prefix | F007-AC3 |
| FC-004 | `decodeResumeData` on any arbitrary string either returns a valid object or `null` — never throws | robustness |

### 5.2 Zod Schema Validators

| ID | Property | Criterion |
|---|---|---|
| FC-005 | Any string with `length > 100` fails `personalInfoSchema.fullName` validation | field limits |
| FC-006 | Any valid RFC 5321 email address passes `personalInfoSchema` | F001-AC5 |
| FC-007 | Any string not matching `/^#[0-9a-fA-F]{6}$/` fails `resumeSchema.accentColor` | F012-AC1 |
| FC-008 | `resumeSchema.safeParse` on any arbitrary object either succeeds cleanly or fails cleanly — never throws or hangs | robustness |

### 5.3 localStorage Persistence Roundtrip

| ID | Property | Criterion |
|---|---|---|
| FC-009 | Any valid `ResumeData` → `saveToLocalStorage` → `loadFromLocalStorage` → produces identical object | F005-AC2 |
| FC-010 | Any invalid JSON string passed to `importFromJSON` returns `false` and store state is unchanged | F008-AC3 |

### 5.4 PDF Filename Sanitization

| ID | Property | Criterion |
|---|---|---|
| FC-011 | Any string as `fullName` produces a filename ending in `_Resume.pdf` | F004-AC5 |
| FC-012 | Filename never contains OS-forbidden characters (`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `\|`) | F004-AC5 |

---

## 6. Per-Module Coverage Targets

| Module / File | Line % | Branch % | Notes |
|---|---|---|---|
| `src/lib/schemas/resume-schema.ts` | **100** | **100** | Pure validation — every branch is testable |
| `src/lib/sharing/url-codec.ts` | **100** | **100** | Pure functions — all code paths exercisable |
| `src/lib/pdf/generate-pdf.ts` | **90** | **85** | html2canvas/jsPDF internals mocked; real multi-page path needs DOM |
| `src/store/resume-store.ts` | **95** | **90** | All 30+ public methods covered; Zustand middleware internals excluded |
| `src/hooks/use-auto-save.ts` | **95** | **90** | Timer branches, QuotaExceededError path required |
| `src/hooks/use-pdf-generator.ts` | **90** | **85** | Dynamic import path, error path required |
| `src/hooks/use-shareable-link.ts` | **95** | **90** | Clipboard success / failure / timeout paths |
| `src/hooks/use-keyboard-shortcuts.ts` | **90** | **85** | Input-focus guard branches required |
| `src/hooks/use-resume-list.ts` | **90** | **85** | CRUD + confirmation paths |
| `src/hooks/use-media-query.ts` | **85** | **80** | Breakpoint true/false branches |
| `src/components/templates/*.tsx` (all 5) | **85** | **80** | All sections, empty state, accentColor prop |
| `src/components/builder/sections/*.tsx` | **85** | **80** | Field inputs, validation messages, add/remove/toggle |
| `src/components/builder/builder-toolbar.tsx` | **85** | **80** | All button actions + dialog flows |
| `src/components/builder/preview-panel.tsx` | **85** | **80** | Re-render on store change, dark mode background |
| `src/components/builder/resume-list-panel.tsx` | **85** | **80** | CRUD + confirmation paths |
| `src/components/landing/*.tsx` | **80** | **75** | Static content; key copy / links verified |
| `src/components/ui/*.tsx` | **75** | **70** | Radix wrappers; core interactions tested via RTL |
| `src/components/shared/theme-toggle.tsx` | **90** | **85** | Both toggle directions + system preference |
| `src/app/builder/page.tsx` | **80** | **75** | Mount flows, URL param handling |
| `src/app/preview/page.tsx` | **85** | **80** | Valid hash, invalid hash, empty hash |
| `src/lib/constants.ts` | **100** | **100** | Imported constants; trivially covered as side effect |
| **Overall target** | **≥ 85** | **≥ 80** | Enforced in CI via `vitest --coverage` with threshold failure |

### Vitest Coverage Configuration

```ts
// vitest.config.mts — add coverage block
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov', 'html'],
  thresholds: {
    lines: 85,
    branches: 80,
    functions: 85,
    statements: 85,
  },
  exclude: [
    'src/test/**',
    '**/*.d.ts',
    'src/app/layout.tsx',       // boilerplate
    'tailwind.config.ts',
    'next.config.ts',
    'postcss.config.js',
    'src/components/ui/**',     // Radix wrappers — exercised via RTL
  ],
},
```

---

## 7. Test Infrastructure Checklist

### Vitest Setup (`src/test/setup.ts`)
- [x] `localStorage` mock available (jsdom default)
- [x] `ResizeObserver` mock (already present)
- [ ] `navigator.clipboard` mock — needed by shareable link tests
- [ ] `URL.createObjectURL` + `URL.revokeObjectURL` mock — needed by JSON export tests
- [ ] `HTMLElement.prototype.scrollIntoView` stub — needed by drag-reorder tests
- [ ] `window.matchMedia` mock — needed by dark mode / media query tests
- [ ] `PerformanceObserver` stub — needed by performance unit tests

### Playwright Config (`playwright.config.ts`)
- [x] Chromium, Firefox, WebKit configured
- [x] `baseURL: 'http://localhost:3000'`
- [x] `webServer: { command: 'npm run dev' }`
- [x] `retries: 2` in CI
- [ ] `screenshot: 'only-on-failure'` for CI debugging
- [ ] `video: 'retain-on-failure'` for E2E debugging
- [ ] `expect.timeout: 5000` for slow preview renders
- [ ] Install `@axe-core/playwright` for WCAG scanning in `accessibility.spec.ts`

### fast-check Installation
```bash
npm install --save-dev fast-check
```

### CI Pipeline Additions (`.github/workflows/ci.yml`)
```yaml
- name: Unit & integration tests with coverage
  run: npm run test -- --run --coverage

- name: E2E tests
  run: npx playwright install --with-deps && npm run test:e2e

- name: Lighthouse CI (performance ≥ 90, accessibility ≥ 90, SEO ≥ 90)
  run: npx lhci autorun

- name: Bundle size check (initial JS < 250 KB)
  run: npx size-limit
  # add size-limit config in package.json targeting < 250000 bytes

- name: Security headers smoke test
  run: |
    curl -sI http://localhost:3000 | grep -i "x-frame-options: DENY"
    curl -sI http://localhost:3000 | grep -i "x-content-type-options: nosniff"
```

---

## 8. Acceptance Criteria Traceability Matrix

Every AC from SPEC.md §3 mapped to at least one automated test:

| SPEC AC | Description | Unit / Component | Integration | E2E |
|---|---|---|---|---|
| **F001-AC1** | Preview updates within 200 ms on typing | `preview-panel.test.ts` | `data-flow.test.ts` | `landing-to-builder.spec.ts` |
| **F001-AC2** | "Add Experience" appends empty form | `form-editor.test.ts` | `data-flow.test.ts` | `complete-resume-download.spec.ts` |
| **F001-AC3** | Drag reorder updates form + preview | `resume-store.test.ts` | `data-flow.test.ts` | `drag-reorder.spec.ts` |
| **F001-AC4** | Download blocked if fullName/email empty | `pdf-generator.test.ts` | — | `validation.spec.ts` |
| **F001-AC5** | Invalid email shows inline error on blur | `form-editor.test.ts` | — | `validation.spec.ts` |
| **F001-AC6** | "Currently Working" hides end date; shows "Present" | `form-editor.test.ts`, `templates.test.ts` | — | `currently-working.spec.ts` |
| **F002-AC1** | Preview re-renders within 200 ms | `preview-panel.test.ts` | `data-flow.test.ts` | `landing-to-builder.spec.ts`, `performance.spec.ts` |
| **F002-AC2** | Desktop: side-by-side layout | `preview-panel.test.ts` | — | `landing-to-builder.spec.ts` |
| **F002-AC3** | Mobile: bottom sheet on "Preview" tap | `mobile-preview-sheet` test | — | `mobile-preview.spec.ts` |
| **F002-AC4** | Preview matches PDF pixel-for-pixel | — | — | `complete-resume-download.spec.ts` (visual compare) |
| **F003-AC1** | Clicking template thumbnail switches immediately | `builder-toolbar.test.ts` | — | `template-switching.spec.ts` |
| **F003-AC2** | All sections render without overlap or truncation | `templates.test.ts` | — | `template-switching.spec.ts` |
| **F003-AC3** | All text extractable (not rasterized) | `templates.test.ts` (DOM assertion) | — | *(axe audit + pdf-parse)* |
| **F003-AC4** | Template switch does not lose data | `template-renderer.test.ts` | `data-flow.test.ts` | `template-switching.spec.ts` |
| **F003-AC5** | Multi-page content flows cleanly | `pdf-generator.test.ts` | — | `complete-resume-download.spec.ts` |
| **F004-AC1** | PDF downloads within 2 s | `pdf-generator.test.ts` | — | `complete-resume-download.spec.ts` |
| **F004-AC2** | PDF layout matches preview | — | — | `complete-resume-download.spec.ts` (visual) |
| **F004-AC3** | Zero HTTP requests during generation | `pdf-generator.test.ts` | — | `complete-resume-download.spec.ts` (network intercept) |
| **F004-AC4** | PDF text is selectable | `pdf-generator.test.ts` (DOM text check) | — | *(pdf-parse in E2E)* |
| **F004-AC5** | Filename: `{FullName}_Resume.pdf` | `pdf-generator.test.ts` | — | `complete-resume-download.spec.ts` |
| **F005-AC1** | Auto-save after 1 s debounce | `auto-save.test.ts` | `auto-save.test.ts` | `persistence.spec.ts` |
| **F005-AC2** | Data restored on return visit | `resume-store.test.ts` | `auto-save.test.ts` | `persistence.spec.ts` |
| **F005-AC3** | Storage full → non-blocking toast | `auto-save.test.ts` | `auto-save.test.ts` | *(manual)* |
| **F005-AC4** | "New Resume" shows confirmation dialog | `builder-toolbar.test.ts` | — | `new-resume-dialog.spec.ts` |
| **F006-AC1** | Hero shows "Free Resume Builder — No Paywall, No Tricks" | `landing-page.test.ts` | — | `e2e/home.spec.ts` |
| **F006-AC2** | ≥ 3 distinct anti-paywall messages | `landing-page.test.ts` | — | `landing-to-builder.spec.ts` |
| **F006-AC3** | "Build Your Resume — It's Free" CTA above fold | `landing-page.test.ts` | — | `landing-to-builder.spec.ts` |
| **F006-AC4** | LCP < 2.5 s | — | — | `performance.spec.ts` + Lighthouse CI |
| **F006-AC5** | Meta tags target correct keywords | `landing-page.test.ts` | — | *(Lighthouse SEO audit)* |
| **F007-AC1** | Share generates URL-safe encoded URL | `shareable-link.test.ts` | `shareable-link.test.ts` | `shareable-link.spec.ts` |
| **F007-AC2** | Opening URL renders all data intact | `resume-store.test.ts` | `preview-page.test.ts` | `shareable-link.spec.ts` |
| **F007-AC3** | Data > 8 KB is compressed | `shareable-link.test.ts` | `shareable-link.test.ts` | *(data size assertion in E2E)* |
| **F007-AC4** | Preview is read-only with "Build Your Own" CTA | `preview-page.test.ts` | `preview-page.test.ts` | `shareable-link.spec.ts` |
| **F007-AC5** | No server request — data stays in `#` fragment | `shareable-link.test.ts` | `shareable-link.test.ts` | `shareable-link.spec.ts` (network intercept) |
| **F008-AC1** | Export JSON is valid JSON | `resume-store.test.ts` | `json-import-export.test.ts` | `json-import-export.spec.ts` |
| **F008-AC2** | Import valid JSON loads all data | `resume-store.test.ts` | `json-import-export.test.ts` | `json-import-export.spec.ts` |
| **F008-AC3** | Import invalid JSON shows error, no overwrite | `resume-store.test.ts` | `json-import-export.test.ts` | `json-import-export.spec.ts` |
| **F008-AC4** | Exported JSON conforms to Resume schema | `resume-store.test.ts` | `json-import-export.test.ts` | `json-import-export.spec.ts` |
| **F009-AC1** | Print: only resume visible, no UI chrome | `print-styles.test.ts` | — | `print-styles.spec.ts` |
| **F009-AC2** | Print layout matches US Letter | `print-styles.test.ts` | — | `print-styles.spec.ts` |
| **F010-AC1** | OS dark preference auto-applies on load | `dark-mode.test.ts` | — | `dark-mode.spec.ts` |
| **F010-AC2** | Preview always white in dark mode | `preview-panel.test.ts` | — | `dark-mode.spec.ts` |
| **F010-AC3** | Toggle changes theme without page reload | `dark-mode.test.ts` | — | `dark-mode.spec.ts` |
| **F011-AC1** | Second resume created without losing first | `multiple-resumes.test.ts` | — | `multiple-resumes.spec.ts` |
| **F011-AC2** | List shows name, template, last-modified date | `multiple-resumes.test.ts` | — | `multiple-resumes.spec.ts` |
| **F011-AC3** | Delete shows confirmation dialog | `multiple-resumes.test.ts` | — | `multiple-resumes.spec.ts` |
| **F012-AC1** | 12 preset colors + hex input available | `color-picker.test.ts` | — | `color-picker.spec.ts` |
| **F012-AC2** | Picking color updates all accent elements | `color-picker.test.ts`, `templates.test.ts` | — | `color-picker.spec.ts` |
| **F012-AC3** | Low-contrast warning when < 3:1 on white | `color-picker.test.ts` | — | `color-picker.spec.ts` |
| **F013-AC1** | `Ctrl+Z` reverts last change | `undo-redo.test.ts` | — | `undo-redo.spec.ts` |
| **F013-AC2** | `Ctrl+Shift+Z` re-applies undone change | `undo-redo.test.ts` | — | `undo-redo.spec.ts` |
| **F013-AC3** | Undo stack capped at 50 entries | `resume-store.test.ts` | — | *(unit sufficient)* |
| **NFR-LCP** | LCP < 2.5 s on 4G | — | — | `performance.spec.ts`, Lighthouse CI |
| **NFR-INP** | INP < 200 ms for all interactions | — | — | `performance.spec.ts` |
| **NFR-PREVIEW** | Preview re-render < 200 ms | `preview-panel.test.ts` | — | `performance.spec.ts` |
| **NFR-BUNDLE** | Initial JS < 250 KB gzipped | — | — | `next build` + size-limit CI step |
| **NFR-A11Y** | WCAG 2.2 AA — labels, contrast, keyboard, touch targets | `form-editor.test.ts` | — | `accessibility.spec.ts` + axe |
| **NFR-SEC-XFRAME** | `X-Frame-Options: DENY` header set | — | — | CI curl headers check |
| **NFR-SEC-XSS** | No `dangerouslySetInnerHTML` anywhere | `grep` static check in CI | — | — |
| **NFR-SEC-FRAGMENT** | Shareable data never sent to server | `shareable-link.test.ts` | — | `shareable-link.spec.ts` |
| **NFR-BROWSER** | Works on Chrome 111+, FF 111+, Safari 16.4+ | — | — | `cross-browser.spec.ts` |

---

## 9. Test Naming Convention

```
describe('[Module] — [Feature Area]', () => {
  it('[action] [given condition]', () => { ... })
})
```

Examples:
- `describe('url-codec — encodeResumeData', () => { it('uses j: prefix for data < 8KB', ...) })`
- `describe('ResumeStore — experience CRUD', () => { it('adds experience to empty list', ...) })`
- E2E: `test('downloads PDF named {FullName}_Resume.pdf when required fields are filled', ...)`

---

## 10. What Is Explicitly NOT Tested Here

| Area | Reason |
|---|---|
| Radix UI internal animation / portal behavior | Owned by upstream; tested in Radix's own suite |
| jsPDF rendering pixel fidelity | Covered by jsPDF's own tests; we verify integration (file downloads, dimensions) |
| pako gzip correctness | Covered by pako's own tests; we verify roundtrip via codec |
| Next.js App Router internals | Framework responsibility |
| Plausible analytics event firing | Third-party, optional — not in critical user path |
| IE11 | Explicitly out-of-scope per SPEC.md §4 |
| AI suggestions, cover letter, PDF import, i18n | Out of V1 scope per SPEC.md §7 |
| Payment processing | Will never exist per product charter |
