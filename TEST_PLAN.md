# TEST_PLAN.md — Free Resume Builder: No Paywall, No Tricks

> **Toolchain:** Vitest 1.1 + React Testing Library 14 (unit/component) · Playwright 1.40 (E2E)
> **Test root:** `src/__tests__/` (unit/component) · `e2e/` (Playwright)
> **Run commands:** `npm run test` · `npm run test:e2e`

---

## 1. Test Strategy

### 1.1 Guiding Principles

This is a **100 % client-side, zero-API application**. There are no HTTP routes, no database, and no authentication. That shifts the pyramid sharply toward unit/component tests:

- The Zustand store is the application's "API" — it must be tested as rigorously as a REST backend.
- The URL codec (pako + base64url) and Zod schemas are pure functions — ideal for property-based tests.
- E2E tests cover the highest-value user journeys: build → download, share, import/export.
- Performance and accessibility are tested via Lighthouse CI and Playwright axe audits — not mocked in unit tests.

### 1.2 Test Pyramid & Ratios

```
                ┌─────────┐
                │  E2E    │  ~10 %   (15–20 Playwright scenarios)
                │Playwright│         Cross-browser, full user journeys
                └────┬────┘
           ┌─────────┴──────────┐
           │  Component / Hook  │  ~30 %   (40–50 RTL tests)
           │  (React Testing    │          Render + interaction + state wiring
           │   Library)         │
           └─────────┬──────────┘
      ┌──────────────┴────────────────┐
      │         Unit Tests             │  ~60 %   (80–100 Vitest tests)
      │  (Vitest, pure TS modules)     │          Store, codecs, schemas, pdf hook
      └────────────────────────────────┘
```

### 1.3 Mock Boundaries

| Boundary | Strategy |
|---|---|
| `localStorage` | Functional in-memory mock in `src/test/setup.ts` |
| `html2canvas` | `vi.mock` returning a fake canvas with `toDataURL` stub |
| `jsPDF` | `vi.mock` — spy on `.addImage()` and `.save()` |
| `pako` | **Not mocked** — real library (pure function, no I/O) |
| `navigator.clipboard` | `vi.stubGlobal` with `writeText` spy |
| `window.location` | `vi.stubGlobal` or `Object.defineProperty` per test |
| `ResizeObserver` | Already mocked in `src/test/setup.ts` |
| `window.matchMedia` | Already mocked in `src/test/setup.ts` |
| `setTimeout` / `clearTimeout` | `vi.useFakeTimers()` for auto-save debounce tests |
| Dynamic `import()` (`generate-pdf.ts`) | `vi.mock('@/lib/pdf/generate-pdf')` |
| Filesystem (PDF `.save()`) | Spy on `jsPDF.prototype.save` |

### 1.4 ⚠️ Known Implementation Gap — PDF Text Selectability

**SPEC F004 AC4** requires:
> "When I copy text from it, Then all text is selectable and copyable (not rasterized images)"

**Current implementation** (`generate-pdf.ts`) uses `html2canvas → JPEG → jsPDF.addImage()`, which **rasterizes all content**. Text is not selectable in the resulting PDF. Tests must assert the current behaviour AND flag this as a spec violation requiring a text-layer solution (e.g., direct jsPDF text calls or a PDF-lib approach) before the acceptance criterion can pass.

---

## 2. Unit Tests

### 2.1 `src/lib/schemas/resume-schema.ts`

**File:** `src/__tests__/resume-schema.test.ts`

#### personalInfoSchema
| Test ID | Description | Input | Expected |
|---|---|---|---|
| SCH-001 | valid full object passes | all fields populated correctly | `success: true` |
| SCH-002 | fullName empty string rejects | `fullName: ''` | error on `fullName` |
| SCH-003 | fullName at max length (100) passes | 100-char string | `success: true` |
| SCH-004 | fullName over max (101 chars) rejects | 101-char string | error |
| SCH-005 | invalid email rejects | `email: 'not-an-email'` | error on `email` |
| SCH-006 | valid email passes | `email: 'a@b.com'` | `success: true` |
| SCH-007 | website URL valid passes | `website: 'https://example.com'` | `success: true` |
| SCH-008 | website invalid URL rejects | `website: 'ftp://bad'` | error |
| SCH-009 | website empty string passes (optional) | `website: ''` | `success: true` |
| SCH-010 | linkedin empty string passes | `linkedin: ''` | `success: true` |
| SCH-011 | github empty string passes | `github: ''` | `success: true` |
| SCH-012 | summary at max (2000 chars) passes | 2000-char string | `success: true` |
| SCH-013 | summary over max rejects | 2001-char string | error |
| SCH-014 | phone at max (20 chars) passes | 20-char string | `success: true` |
| SCH-015 | phone over max rejects | 21-char string | error |

#### experienceSchema
| Test ID | Description | Expected |
|---|---|---|
| SCH-020 | jobTitle required — empty rejects | error |
| SCH-021 | company required — empty rejects | error |
| SCH-022 | startDate required — empty rejects | error |
| SCH-023 | currentlyWorking defaults to false | `currentlyWorking: false` |
| SCH-024 | endDate optional — omitted passes | `success: true` |
| SCH-025 | description max 5000 chars | error at 5001 |

#### educationSchema
| Test ID | Description | Expected |
|---|---|---|
| SCH-030 | school required | error when empty |
| SCH-031 | degree required | error when empty |
| SCH-032 | gpa optional, max 10 chars | error at 11 |

#### skillSchema
| Test ID | Description | Expected |
|---|---|---|
| SCH-040 | name required, max 50 | errors at empty and 51 |
| SCH-041 | level enum accepts valid values | passes all four: beginner/intermediate/advanced/expert |
| SCH-042 | level rejects unknown value | error on `'master'` |
| SCH-043 | level optional — omitted passes | `success: true` |

#### projectSchema
| Test ID | Description | Expected |
|---|---|---|
| SCH-050 | title required | error when empty |
| SCH-051 | link must be URL or empty | error on non-URL, passes on empty/valid URL |
| SCH-052 | technologies defaults to `[]` | empty array |

#### certificationSchema
| Test ID | Description | Expected |
|---|---|---|
| SCH-060 | name, issuer, issueDate all required | errors when each is empty |
| SCH-061 | credentialUrl optional URL | passes empty, errors on invalid |

#### resumeSchema
| Test ID | Description | Expected |
|---|---|---|
| SCH-070 | accentColor hex regex valid | `#2563eb` passes |
| SCH-071 | accentColor rejects non-hex | `'blue'`, `'#GGG'` reject |
| SCH-072 | template enum only accepts 5 values | error on `'fancy'` |
| SCH-073 | createdAt/updatedAt must be ISO datetime strings | error on `'2024-01-01'` (no time) |
| SCH-074 | full valid resume object passes | `success: true`, data matches input |

---

### 2.2 `src/store/resume-store.ts`

**File:** `src/__tests__/resume-store.test.ts` *(extend existing)*

#### Lifecycle
| Test ID | Description | Expected |
|---|---|---|
| STR-001 | `createNewResume()` — template is `'modern'` | `resume.template === 'modern'` |
| STR-002 | `createNewResume()` — accentColor is `'#2563eb'` | `resume.accentColor === '#2563eb'` |
| STR-003 | `createNewResume()` — all section arrays empty | `experiences/education/skills/projects/certifications` all `[]` |
| STR-004 | `createNewResume()` — history cleared | `pastStates === []`, `futureStates === []` |
| STR-005 | `reset()` — clears resume and localStorage | `resume === null`, `localStorage.removeItem` called with `STORAGE_KEY` |
| STR-006 | `setResume()` — pushes old state to history | `pastStates.length === 1` after one setResume call |
| STR-007 | `setResume()` — clears futureStates | futureStates emptied |
| STR-008 | `setResume()` — no history push when resume is null | `pastStates.length === 0` |

#### Personal Info
| Test ID | Description | Expected |
|---|---|---|
| STR-010 | `updatePersonalInfo()` — merges partial update | only supplied fields change |
| STR-011 | `updatePersonalInfo()` — pushes to history | `pastStates.length > 0` |
| STR-012 | `updatePersonalInfo()` — no-op when resume is null | state unchanged |
| STR-013 | `updatePersonalInfo()` — updates `updatedAt` | `updatedAt` changes |

#### Experience CRUD (already partially covered — add edge cases)
| Test ID | Description | Expected |
|---|---|---|
| STR-020 | `addExperience()` — new entry has unique ID | `id` matches `generateId` pattern |
| STR-021 | `addExperience()` — all fields default to empty/false | `jobTitle === ''`, `currentlyWorking === false` |
| STR-022 | `updateExperience()` — unknown ID silently no-ops | array length unchanged, no error |
| STR-023 | `reorderExperiences()` — IDs not in list are dropped | only mapped IDs survive |
| STR-024 | `removeExperience()` — only removes matching ID | other items intact |

#### Undo/Redo (extend existing)
| Test ID | Description | Expected |
|---|---|---|
| STR-030 | `undo()` when `pastStates` empty — no-op | state unchanged |
| STR-031 | `redo()` when `futureStates` empty — no-op | state unchanged |
| STR-032 | `undo()` pushes current to futureStates | `futureStates.length === 1` |
| STR-033 | Making a new change after undo clears futureStates | `futureStates === []` |
| STR-034 | History cap at 50 — 51st change drops oldest | `pastStates.length === 50` |
| STR-035 | `canUndo()` returns true after one change | `true` |
| STR-036 | `canRedo()` returns true after undo | `true` |
| STR-037 | `updateTemplate()` does NOT push to undo history | `pastStates` unchanged |
| STR-038 | `updateAccentColor()` does NOT push to undo history | `pastStates` unchanged |

#### Persistence
| Test ID | Description | Expected |
|---|---|---|
| STR-040 | `saveToLocalStorage()` — serialises and stores under `STORAGE_KEY` | `localStorage.getItem(STORAGE_KEY)` is valid JSON |
| STR-041 | `saveToLocalStorage()` — updates `updatedAt` timestamp | stored `updatedAt` differs from `createdAt` |
| STR-042 | `saveToLocalStorage()` — no-op when resume is null | `localStorage.setItem` not called |
| STR-043 | `saveToLocalStorage()` — throws when `localStorage.setItem` throws | error propagated to caller |
| STR-044 | `loadFromLocalStorage()` — valid JSON sets resume | `resume` matches stored data |
| STR-045 | `loadFromLocalStorage()` — invalid JSON creates empty resume | `resume` has empty `personalInfo` |
| STR-046 | `loadFromLocalStorage()` — missing key creates empty resume | `resume` created fresh |
| STR-047 | `loadFromLocalStorage()` — schema-invalid object creates empty resume | Zod failure → createEmptyResume |
| STR-048 | `loadFromLocalStorage()` — clears history on load | `pastStates === []` |

#### Import / Export
| Test ID | Description | Expected |
|---|---|---|
| STR-050 | `exportAsJSON()` — output is valid JSON | `JSON.parse(output)` succeeds |
| STR-051 | `exportAsJSON()` — contains all sections | keys: `personalInfo`, `experiences`, etc. |
| STR-052 | `exportAsJSON()` — returns `''` when no resume | `'' === result` |
| STR-053 | `importFromJSON()` — valid JSON returns `true` and sets resume | success |
| STR-054 | `importFromJSON()` — malformed string returns `false` | `false` |
| STR-055 | `importFromJSON()` — schema-invalid JSON returns `false` | `false`, old resume unchanged |
| STR-056 | `importFromJSON()` — clears undo history on success | `pastStates === []` |

#### Shareable URL (store-level)
| Test ID | Description | Expected |
|---|---|---|
| STR-060 | `generateShareableURL()` — returns `''` when no resume | `''` |
| STR-061 | `generateShareableURL()` — URL contains `/preview#` | string includes `/preview#` |
| STR-062 | `loadFromShareableURL()` — round-trip with `generateShareableURL()` | data restored exactly |
| STR-063 | `loadFromShareableURL()` — invalid base64 returns `false` | `false` |
| STR-064 | `loadFromShareableURL()` — valid base64, invalid schema returns `false` | `false` |

---

### 2.3 `src/lib/sharing/url-codec.ts`

**File:** `src/__tests__/url-codec.test.ts`

| Test ID | Description | Input | Expected |
|---|---|---|---|
| COD-001 | `encodeResumeData` + `decodeResumeData` round-trip (small, `j:` prefix) | object < 8192 bytes | decoded equals original |
| COD-002 | `encodeResumeData` + `decodeResumeData` round-trip (large, `c:` prefix) | object > 8192 bytes | decoded equals original |
| COD-003 | `encodeResumeData` uses `j:` prefix below threshold | small object | starts with `j:` |
| COD-004 | `encodeResumeData` uses `c:` prefix at/above threshold | large object | starts with `c:` |
| COD-005 | `encodeResumeForURL` + `decodeResumeFromURL` round-trip (plain) | small object | decoded equals original |
| COD-006 | `encodeResumeForURL` + `decodeResumeFromURL` round-trip (compressed, `z:`) | object > 8192 bytes | decoded equals original |
| COD-007 | `encodeResumeForURL` uses `z:` prefix above threshold | large object | starts with `z:` |
| COD-008 | `decodeResumeData` returns `null` on garbage input | `'!!!garbage!!!'` | `null` |
| COD-009 | `decodeResumeFromURL` returns `null` on invalid base64 | `'!!!garbage!!!'` | `null` |
| COD-010 | `decodeResumeData` returns `null` for unknown prefix | `'x:abc'` | `null` |
| COD-011 | Encoded strings are URL-safe (no `+`, `/`, `=`) | any object | regex `/^[A-Za-z0-9\-_:]*$/` |
| COD-012 | Unicode resume data (CJK, accented chars) round-trips correctly | `fullName: '张伟'` | decoded matches input |
| COD-013 | Empty object round-trips | `{}` | decoded equals `{}` |
| COD-014 | At exactly the threshold byte count — uses uncompressed path | 8192-byte JSON | does NOT start with `c:` or `z:` |
| COD-015 | One byte over threshold — uses compressed path | 8193-byte JSON | starts with `c:` or `z:` |

---

### 2.4 `src/lib/pdf/generate-pdf.ts`

**File:** `src/__tests__/pdf-generator.test.ts` *(extend existing)*

Mock setup:
```ts
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    width: 1224,
    height: 1584,
    toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,fake'),
    getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
  }),
}))
vi.mock('jspdf', () => {
  const mockSave = vi.fn()
  const mockAddImage = vi.fn()
  const MockJsPDF = vi.fn(() => ({
    internal: { pageSize: { getWidth: () => 612, getHeight: () => 792 } },
    addImage: mockAddImage,
    addPage: vi.fn(),
    save: mockSave,
  }))
  return { default: MockJsPDF, __mockSave: mockSave, __mockAddImage: mockAddImage }
})
```

| Test ID | Description | Expected |
|---|---|---|
| PDF-001 | throws when `#resume-preview-container` not in DOM | `Error: Element #resume-preview-container not found` |
| PDF-002 | single-page content — `addImage` called once, `addPage` not called | `addImage.calls === 1`, `addPage.calls === 0` |
| PDF-003 | multi-page content — `addPage` called for each page beyond first | `addPage.calls === Math.ceil(height/pageHeight) - 1` |
| PDF-004 | `html2canvas` called with `scale: 2` and `backgroundColor: '#ffffff'` | spy assertions |
| PDF-005 | `pdf.save(filename)` called with the supplied filename | `save.mock.calls[0][0] === 'John_Doe_Resume.pdf'` |
| PDF-006 | image format is JPEG with quality 0.95 | `toDataURL('image/jpeg', 0.95)` |
| PDF-007 | PDF format is US Letter portrait (`612 × 792 pt`) | constructor arg `format: 'letter'` |

---

### 2.5 `src/hooks/use-pdf-generator.ts`

**File:** `src/__tests__/use-pdf-generator.test.ts`

Mock: `vi.mock('@/lib/pdf/generate-pdf')`, `vi.mock('@/hooks/use-toast')`

| Test ID | Description | Setup | Expected |
|---|---|---|---|
| PHK-001 | blocks download when resume is null | no resume in store | toast with `'Cannot download'` |
| PHK-002 | blocks download when fullName empty | resume with `fullName: ''` | toast error, `generatePDF` not called |
| PHK-003 | blocks download when email empty | resume with `email: ''` | toast error |
| PHK-004 | filename format `"{Name}_Resume.pdf"` | `fullName: 'Jane Smith'` | filename `'Jane_Smith_Resume.pdf'` |
| PHK-005 | filename — multi-space collapsed to single `_` | `fullName: 'A  B'` | `'A__B_Resume.pdf'` *(documents actual regex behaviour)* |
| PHK-006 | status transitions: idle → generating → success | happy path | status sequence verified |
| PHK-007 | status resets to idle 2s after success | `vi.useFakeTimers()` | status `'idle'` after advance 2000ms |
| PHK-008 | generatePDF throws → status `'error'`, toast shown | mock rejects | error toast, status `'error'` |
| PHK-009 | status resets to idle 3s after error | `vi.useFakeTimers()` | status `'idle'` after 3000ms |
| PHK-010 | `isGenerating` is `true` only during generation | check mid-call | `true` only while awaiting |

---

### 2.6 `src/hooks/use-auto-save.ts`

**File:** `src/__tests__/auto-save.test.ts` *(extend existing)*

Use `vi.useFakeTimers()` throughout.

| Test ID | Description | Expected |
|---|---|---|
| ASV-001 | does NOT save on first render | `saveToLocalStorage` not called after mount |
| ASV-002 | saves after 1s debounce following resume change | called once after `vi.advanceTimersByTime(1000)` |
| ASV-003 | rapid changes only save once (debounce resets) | 3 changes then 1s wait → 1 save call |
| ASV-004 | `isSaving` is true during debounce, false after | state sequence verified |
| ASV-005 | `lastSaved` is set after successful save | `Date` instance, not null |
| ASV-006 | `saveToLocalStorage` throws → toast with `'Auto-save failed'` | toast mock called |
| ASV-007 | cleanup on unmount cancels pending timer | unmount before 1s → `saveToLocalStorage` not called |

---

### 2.7 `src/hooks/use-shareable-link.ts`

**File:** `src/__tests__/use-shareable-link.test.ts`

| Test ID | Description | Expected |
|---|---|---|
| SHL-001 | with resume — uses `encodeResumeForURL`, not store method | spy confirms `encodeResumeForURL` called |
| SHL-002 | generated URL is `origin/preview#<encoded>` | URL format validated |
| SHL-003 | calls `navigator.clipboard.writeText` with URL | clipboard spy called |
| SHL-004 | `isCopied` becomes `true` after copy | state = `true` |
| SHL-005 | `isCopied` resets to `false` after 2s | `vi.advanceTimersByTime(2000)` |
| SHL-006 | clipboard failure → error toast | mock `writeText` rejecting → toast shown |
| SHL-007 | no resume → error toast `'No resume data to share.'` | toast shown, clipboard not called |

---

### 2.8 `src/hooks/use-keyboard-shortcuts.ts`

**File:** `src/__tests__/use-keyboard-shortcuts.test.ts`

| Test ID | Description | Expected |
|---|---|---|
| KBD-001 | `Ctrl+Z` fires `undo()` | store `undo` spy called |
| KBD-002 | `Ctrl+Shift+Z` fires `redo()` | store `redo` spy called |
| KBD-003 | `Ctrl+S` calls `saveToLocalStorage` | save spy called |
| KBD-004 | Events with `canUndo() === false` — undo still fires (gracefully) | no error thrown |
| KBD-005 | Shortcut handler removed on unmount | keydown after unmount does not trigger spy |

---

### 2.9 `src/lib/cn.ts`

| Test ID | Description | Expected |
|---|---|---|
| CN-001 | merges tailwind classes, deduplicates conflicting utilities | `cn('p-4', 'p-2')` → `'p-2'` |
| CN-002 | handles conditional classes | `cn('a', false && 'b')` → `'a'` |

---

## 3. Component / Integration Tests

> All component tests use `@testing-library/react` + `renderWithProviders` (wraps in Zustand store + Toaster).

### 3.1 Resume Form Sections

**File:** `src/__tests__/form-editor.test.ts` *(extend existing)*

**`personal-info-form.tsx`**
| Test ID | AC | Description | Expected |
|---|---|---|---|
| FRM-001 | F001-AC5 | Invalid email blur shows inline error | `'Invalid email address'` visible |
| FRM-002 | F001-AC5 | Corrected email clears error | error disappears |
| FRM-003 | F001-AC1 | Typing updates store within same event loop | `updatePersonalInfo` spy called |
| FRM-004 | — | Website field rejects non-URL on blur | error message shown |
| FRM-005 | — | All inputs have visible `<label>` (not just placeholder) | `getByLabelText` finds each input |

**`experience-form.tsx`**
| Test ID | AC | Description | Expected |
|---|---|---|---|
| FRM-010 | F001-AC2 | "Add Experience" button click calls `addExperience()` | spy called |
| FRM-011 | F001-AC6 | "Currently Working" checkbox hides end date field | end date input not in document |
| FRM-012 | F001-AC3 | Drag handle is present for each experience entry | `data-testid="drag-handle"` exists |
| FRM-013 | — | Delete button on entry calls `removeExperience(id)` | spy called with correct id |

**`education-form.tsx`, `skills-form.tsx`, `projects-form.tsx`, `certifications-form.tsx`**
| Test ID | AC | Description | Expected |
|---|---|---|---|
| FRM-020 | F001-AC2 | "Add" button in each section adds an entry | entry count increases |
| FRM-021 | — | Delete button removes entry | entry count decreases |
| FRM-022 | — | Skill level dropdown shows all 4 options | 4 `option` elements |

---

### 3.2 Preview Panel

**File:** `src/__tests__/preview-panel.test.ts` *(extend existing)*

| Test ID | AC | Description | Expected |
|---|---|---|---|
| PRV-001 | F002-AC1 | Re-render triggered by store change — verify within 200ms | `performance.now()` delta < 200 |
| PRV-002 | F002-AC4 | Preview container has id `resume-preview-container` | `document.getElementById('resume-preview-container')` exists |
| PRV-003 | F001-AC6 | `currentlyWorking: true` → "Present" appears in preview | text "Present" in template output |
| PRV-004 | F003-AC4 | Template switch preserves all data | personal info still rendered after switch |
| PRV-005 | F010-AC2 | Preview has white background even in dark mode | element has `background: white` or `bg-white` |

---

### 3.3 Template Renderer

**File:** `src/__tests__/templates.test.ts` *(extend existing)*

Test each of the 5 templates with `sampleResumeData` (full fixture with all sections populated).

| Test ID | AC | Description | Expected |
|---|---|---|---|
| TPL-001 | F003-AC2 | Modern — all section headings present | Experience, Education, Skills, etc. visible |
| TPL-002 | F003-AC2 | Classic — all section headings present | same |
| TPL-003 | F003-AC2 | Minimal — all section headings present | same |
| TPL-004 | F003-AC2 | Creative — all section headings present | same |
| TPL-005 | F003-AC2 | Professional — all section headings present | same |
| TPL-006 | F003-AC2 | No template overflows its container (no `overflow: hidden` clipping) | container scroll height ≤ scroll height of content |
| TPL-007 | F003-AC3 | All text content is in DOM text nodes (not images) | `textContent` contains fullName, job title, company |
| TPL-008 | F003-AC4 | Data unchanged after switching template via `updateTemplate` | personalInfo fields identical |
| TPL-009 | F012-AC2 | Accent color prop updates header/border color | inline style or CSS var contains supplied hex |
| TPL-010 | — | Empty resume renders without crash (no required-data errors) | no thrown errors, fallback placeholders shown |

---

### 3.4 Builder Layout

**File:** `src/__tests__/builder-layout.test.ts`

| Test ID | AC | Description | Expected |
|---|---|---|---|
| BLT-001 | F002-AC2 | Desktop (≥1024px): form and preview side-by-side | `getByTestId('form-panel')` and `preview-panel` both visible |
| BLT-002 | F002-AC3 | Mobile (<768px): Preview tab shows `MobilePreviewSheet` | sheet present in DOM after "Preview" tab click |
| BLT-003 | F005-AC1 | Auto-save status bar visible (`"Saved X"`) | appears after save |
| BLT-004 | F005-AC4 | "New Resume" button shows confirmation dialog | dialog rendered with confirm/cancel options |
| BLT-005 | F005-AC4 | Confirming "New Resume" calls `reset()` | reset spy called |
| BLT-006 | F005-AC4 | Cancelling "New Resume" does not call `reset()` | reset spy NOT called |

---

### 3.5 Builder Toolbar

**File:** `src/__tests__/builder-toolbar.test.ts`

| Test ID | AC | Description | Expected |
|---|---|---|---|
| TBR-001 | F003-AC1 | Template dropdown lists all 5 templates | 5 items rendered |
| TBR-002 | F003-AC1 | Selecting a template calls `updateTemplate` | spy called with correct template id |
| TBR-003 | F004-AC1 | "Download PDF" button present | button in DOM |
| TBR-004 | F004-AC4 | "Download PDF" with empty name → validation error toast | toast with `'Cannot download'` |
| TBR-005 | F007-AC1 | "Share" button calls `generateLink` from hook | `encodeResumeForURL` spy triggered |
| TBR-006 | F008-AC1 | "Export JSON" triggers file download | `URL.createObjectURL` or anchor click triggered |
| TBR-007 | F008-AC2 | "Import JSON" file input accepts `.json` | `accept=".json"` on input |
| TBR-008 | F012-AC1 | Color picker shows 12 preset swatches | 12 color swatch elements |
| TBR-009 | F012-AC2 | Selecting a color calls `updateAccentColor` | spy called with hex |
| TBR-010 | F012-AC3 | Very light color triggers contrast warning | warning text visible |

---

### 3.6 Landing Page

**File:** `src/__tests__/landing-page.test.ts` *(extend existing)*

| Test ID | AC | Description | Expected |
|---|---|---|---|
| LND-001 | F006-AC1 | Hero heading contains exact text "Free Resume Builder — No Paywall, No Tricks" | `getByRole('heading', { name: /Free Resume Builder/i })` |
| LND-002 | F006-AC2 | At least 3 anti-paywall messages | count of elements matching anti-paywall copy ≥ 3 |
| LND-003 | F006-AC3 | CTA "Build Your Resume — It's Free" is visible above fold | CTA button in DOM |
| LND-004 | F006-AC3 | CTA links to `/builder` | `href="/builder"` |
| LND-005 | F006-AC5 | `<title>` contains "free resume builder" | document title matches |
| LND-006 | F006-AC5 | `<meta name="description">` present with target keywords | meta content checked |
| LND-007 | F006-AC5 | OG tags present (`og:title`, `og:description`, `og:image`) | meta tags in DOM |
| LND-008 | — | Template showcase section present | section visible |
| LND-009 | — | FAQ section present | visible |
| LND-010 | — | Affiliate links have `rel="noopener noreferrer"` | link attributes checked |

---

### 3.7 Shareable Preview Page

**File:** `src/__tests__/preview-page.test.ts`

| Test ID | AC | Description | Expected |
|---|---|---|---|
| PVW-001 | F007-AC2 | Valid hash renders resume preview | `TemplateRenderer` renders with decoded data |
| PVW-002 | F007-AC4 | CTA "Build Your Own — It's Free" visible | button/link in DOM |
| PVW-003 | F007-AC4 | No form inputs rendered (read-only) | no `<input>`, `<textarea>` in preview |
| PVW-004 | F007-AC5 | Hash decoded client-side — no fetch calls | `vi.spyOn(global, 'fetch')` never called |
| PVW-005 | — | Invalid/corrupted hash shows error state + CTA | error message + "Build Your Own" CTA |
| PVW-006 | — | Missing hash shows empty/error state | no crash |

---

### 3.8 Multiple Resume Management

**File:** `src/__tests__/multiple-resumes.test.ts` *(extend existing)*

| Test ID | AC | Description | Expected |
|---|---|---|---|
| MLT-001 | F011-AC1 | Creating second resume stores first in `RESUMES_STORAGE_KEY` | localStorage contains two entries |
| MLT-002 | F011-AC2 | Resume list shows name, template, last-modified for each | all three data points rendered per item |
| MLT-003 | F011-AC3 | Delete shows confirmation dialog | dialog present |
| MLT-004 | F011-AC3 | Confirming delete removes resume from list | list shrinks by one |
| MLT-005 | — | Switching resumes loads selected resume into store | `resume.id` matches selected |

---

### 3.9 Dark Mode

**File:** `src/__tests__/dark-mode.test.ts` *(extend existing)*

| Test ID | AC | Description | Expected |
|---|---|---|---|
| DRK-001 | F010-AC1 | `prefers-color-scheme: dark` → document has `class="dark"` | class present |
| DRK-002 | F010-AC3 | Clicking theme toggle changes class without reload | class toggles synchronously |
| DRK-003 | F010-AC2 | Preview container always has white background in dark mode | computed background is white |

---

### 3.10 JSON Import / Export

**File:** `src/__tests__/json-import-export.test.ts` *(extend existing)*

| Test ID | AC | Description | Expected |
|---|---|---|---|
| JSN-001 | F008-AC1 | Exported JSON is parseable and conforms to `resumeSchema` | `resumeSchema.safeParse(JSON.parse(exported)).success` |
| JSN-002 | F008-AC2 | Import of valid JSON restores all sections | all fields match |
| JSN-003 | F008-AC3 | Import of `{ bad: 'json' }` returns false, old data intact | `importFromJSON` returns `false` |
| JSN-004 | F008-AC3 | Import of malformed string (not JSON) returns false | `false` |
| JSN-005 | F008-AC4 | Exported object has keys matching TypeScript `Resume` type | key set matches interface |
| JSN-006 | — | Round-trip: export then import produces identical resume | deep equality |

---

### 3.11 Color Picker

**File:** `src/__tests__/color-picker.test.ts` *(extend existing)*

| Test ID | AC | Description | Expected |
|---|---|---|---|
| CLR-001 | F012-AC1 | 12 preset color swatches rendered | 12 clickable elements |
| CLR-002 | F012-AC1 | Hex input field accepts 6-digit hex | input value accepted |
| CLR-003 | F012-AC2 | Clicking preset updates `accentColor` in store | spy called with correct hex |
| CLR-004 | F012-AC3 | `#ffffff` (white) triggers contrast warning | warning text visible |
| CLR-005 | F012-AC3 | `#cccccc` (light gray, ~1.6:1 ratio) triggers warning | warning visible |
| CLR-006 | F012-AC3 | `#2563eb` (default, passes 3:1) shows no warning | no warning element |

---

### 3.12 Print Styles

**File:** `src/__tests__/print-styles.test.ts` *(extend existing)*

| Test ID | AC | Description | Expected |
|---|---|---|---|
| PRT-001 | F009-AC1 | `@media print` CSS hides navigation, toolbar, sidebar | elements have `print:hidden` class or equivalent |
| PRT-002 | F009-AC1 | `@media print` shows only `#resume-preview-container` | print-visible elements limited to resume content |

---

### 3.13 Undo/Redo (component level)

**File:** `src/__tests__/undo-redo.test.ts` *(extend existing)*

| Test ID | AC | Description | Expected |
|---|---|---|---|
| UND-001 | F013-AC3 | 51 mutations — `pastStates` capped at 50 | `pastStates.length === 50` |
| UND-002 | F013-AC1 | Form reflects undone state after `Ctrl+Z` | input value reverts |
| UND-003 | F013-AC2 | Form reflects redone state after `Ctrl+Shift+Z` | value re-applied |

---

## 4. E2E Tests (Playwright)

> **Config:** `playwright.config.ts` — chromium, firefox, webkit
> **Base URL:** `http://localhost:3000`
> All E2E tests run against the dev server (`npm run dev`).

### Page Object Pattern

```
e2e/
├── pages/
│   ├── landing.page.ts        # LandingPage POM
│   ├── builder.page.ts        # BuilderPage POM
│   └── preview.page.ts        # PreviewPage POM
├── fixtures/
│   └── full-resume.json       # Complete test resume fixture
└── specs/
    ├── landing.spec.ts
    ├── builder-core.spec.ts
    ├── pdf-download.spec.ts
    ├── share-link.spec.ts
    ├── import-export.spec.ts
    ├── templates.spec.ts
    ├── persistence.spec.ts
    ├── multiple-resumes.spec.ts
    ├── dark-mode.spec.ts
    └── accessibility.spec.ts
```

### Required `data-testid` Attributes

The following `data-testid` attributes must be present in the implementation for E2E selectors to work:

| Element | `data-testid` |
|---|---|
| Hero heading | `hero-heading` |
| Hero CTA button | `hero-cta` |
| Form panel | `form-panel` |
| Preview panel | `preview-panel` |
| Resume preview container | `resume-preview-container` (also `id="resume-preview-container"`) |
| Download PDF button | `download-pdf-btn` |
| Share button | `share-btn` |
| Template selector | `template-selector` |
| Export JSON button | `export-json-btn` |
| Import JSON input | `import-json-input` |
| New Resume button | `new-resume-btn` |
| Confirm dialog OK | `confirm-dialog-ok` |
| Cancel dialog | `confirm-dialog-cancel` |
| Color picker | `color-picker` |
| Theme toggle | `theme-toggle` |
| Auto-save status | `auto-save-status` |
| Preview tab (mobile) | `preview-tab` |
| Share CTA on /preview | `preview-cta` |

---

### E2E-001: Landing Page Load & Navigation
**Covers:** F006-AC1, F006-AC2, F006-AC3

```
Steps:
1. Navigate to /
2. Assert page title contains "Free Resume Builder"
3. Assert [data-testid="hero-heading"] text = "Free Resume Builder — No Paywall, No Tricks"
4. Assert at least 3 elements containing anti-paywall copy ("Unlike Zety", "no paywall", "no subscription", etc.)
5. Assert [data-testid="hero-cta"] is visible in viewport (above fold)
6. Click [data-testid="hero-cta"]
7. Assert URL = /builder
8. Assert builder page loaded (form-panel visible)
```

---

### E2E-002: First Visit — Empty State Created
**Covers:** F005-AC2 (first visit path), ARCH Flow 6

```
Steps:
1. Clear localStorage
2. Navigate to /builder
3. Assert resume form is empty (fullName input value = "")
4. Assert preview panel visible
5. Assert template = "modern" selected in toolbar
```

---

### E2E-003: Build a Complete Resume (Happy Path — Sarah's Journey)
**Covers:** F001-AC2, F002-AC1, F003-AC1, F004-AC1, F004-AC5

```
Steps:
1. Navigate to /builder (clear localStorage)
2. Fill Personal Info: fullName="Jane Smith", email="jane@example.com", phone="555-0100", location="New York, NY"
3. Assert preview updates within 200ms of last keystroke (measure with performance.now())
4. Click "Add Experience" → assert new entry form appears
5. Fill: jobTitle="Software Engineer", company="Acme Corp", startDate="2022-01", check "Currently Working"
6. Assert preview shows "Present" (not end date)
7. Click "Add Education" → fill: school="MIT", degree="B.S. Computer Science", startDate="2018-01", endDate="2022-05"
8. Click "Add Skill" → fill: name="TypeScript", level="expert"
9. Assert template preview contains all entered data
10. Click "Download PDF"
11. Assert download initiated (check Downloads API or `page.waitForEvent('download')`)
12. Assert downloaded filename = "Jane_Smith_Resume.pdf"
```

---

### E2E-004: Template Switching — No Data Loss (Priya's Journey)
**Covers:** F003-AC1, F003-AC4

```
Steps:
1. Navigate to /builder, fill fullName="Priya Kapoor", email="priya@example.com"
2. For each template in [modern, classic, minimal, creative, professional]:
   a. Select template from dropdown
   b. Assert preview switches immediately (template-specific heading visible)
   c. Assert fullName "Priya Kapoor" still visible in preview
3. Assert no data lost after cycling all 5 templates
```

---

### E2E-005: PDF Download — Validation Blocked (F004 + F001-AC4)
**Covers:** F001-AC4, F004-AC1

```
Steps:
1. Navigate to /builder
2. Leave fullName empty
3. Click "Download PDF"
4. Assert toast with validation error appears ("Please enter your full name")
5. Assert no download event fired
6. Fill fullName="Test User", leave email empty
7. Click "Download PDF"
8. Assert toast with email validation error
9. Fill email="test@example.com"
10. Click "Download PDF"
11. Assert download event fires (file named "Test_User_Resume.pdf")
```

---

### E2E-006: LocalStorage Persistence (F005)
**Covers:** F005-AC1, F005-AC2, F005-AC3

```
Steps:
1. Navigate to /builder
2. Fill fullName="Persistence Test", email="p@example.com"
3. Wait 1.5 seconds (debounce + margin)
4. Assert [data-testid="auto-save-status"] shows "Saved" text
5. Assert localStorage key "resume-builder-data" contains fullName "Persistence Test"
6. Navigate away (to /)
7. Navigate back to /builder
8. Assert fullName input = "Persistence Test" (data restored)
```

---

### E2E-007: New Resume Confirmation (F005-AC4)
**Covers:** F005-AC4

```
Steps:
1. Navigate to /builder, fill some data
2. Click [data-testid="new-resume-btn"]
3. Assert confirmation dialog appears
4. Click [data-testid="confirm-dialog-cancel"]
5. Assert dialog dismissed, data still present
6. Click [data-testid="new-resume-btn"] again
7. Click [data-testid="confirm-dialog-ok"]
8. Assert form cleared (fullName = "")
```

---

### E2E-008: Shareable Link Generation & Preview (F007, Marcus's Journey)
**Covers:** F007-AC1, F007-AC2, F007-AC4, F007-AC5

```
Steps:
1. Navigate to /builder, fill fullName="Marcus Lee", email="marcus@example.com"
2. Click [data-testid="share-btn"]
3. Assert toast "Link copied to clipboard!"
4. Read clipboard (page.evaluate(() => navigator.clipboard.readText()))
5. Assert URL contains "/preview#" and encoded data
6. Open new page/tab → navigate to copied URL
7. Assert preview renders "Marcus Lee" (data intact)
8. Assert no form inputs present (read-only)
9. Assert [data-testid="preview-cta"] "Build Your Own" is visible
10. Assert no network requests made to server during decode (intercept fetch)
```

---

### E2E-009: Corrupted Share Link Graceful Degradation
**Covers:** F007-AC2 (invalid case)

```
Steps:
1. Navigate to /preview#thisisgarbageinvalidbase64!!!
2. Assert no crash (no uncaught error)
3. Assert error state UI shown
4. Assert [data-testid="preview-cta"] "Build Your Own" still visible
```

---

### E2E-010: JSON Export & Import Round-Trip (F008)
**Covers:** F008-AC1, F008-AC2, F008-AC3, F008-AC4

```
Steps:
1. Navigate to /builder, fill complete resume data
2. Click [data-testid="export-json-btn"]
3. Assert file downloaded with `.json` extension
4. Assert file contents parse as valid JSON conforming to resume schema
5. Navigate to /builder (fresh session), clear data
6. Click [data-testid="import-json-input"], upload the exported file
7. Assert all fields restored in form and preview
8. Upload a non-JSON file (e.g., a .txt file with garbage)
9. Assert error toast appears
10. Assert existing data NOT overwritten
```

---

### E2E-011: Dark Mode Toggle (F010)
**Covers:** F010-AC2, F010-AC3

```
Steps:
1. Navigate to /builder with prefers-color-scheme: light emulated
2. Click [data-testid="theme-toggle"]
3. Assert document.documentElement.classList contains 'dark'
4. Assert no page reload (performance.navigation.type === 0)
5. Assert #resume-preview-container has white background (getComputedStyle)
6. Click toggle again
7. Assert 'dark' class removed
```

---

### E2E-012: Undo / Redo via Keyboard (F013)
**Covers:** F013-AC1, F013-AC2

```
Steps:
1. Navigate to /builder
2. Fill fullName="Original"
3. Clear fullName, type "Changed"
4. Press Ctrl+Z
5. Assert fullName input = "Original"
6. Press Ctrl+Shift+Z
7. Assert fullName input = "Changed"
```

---

### E2E-013: Template Gallery Page (F003)
**Covers:** F003-AC1

```
Steps:
1. Navigate to /templates
2. Assert all 5 template names visible (Modern, Classic, Minimal, Creative, Professional)
3. Click "Use This Template" on Classic
4. Assert URL = /builder?template=classic
5. Assert builder loads with Classic template selected
```

---

### E2E-014: Mobile Preview Bottom Sheet (F002-AC3)
**Covers:** F002-AC3

```
Device: iPhone 12 (375×812)
Steps:
1. Navigate to /builder on mobile viewport
2. Assert form panel is visible
3. Assert split preview panel NOT visible (mobile layout)
4. Tap [data-testid="preview-tab"]
5. Assert bottom sheet / full-screen preview appears
6. Assert resume content is visible in sheet
```

---

### E2E-015: Accessibility Audit
**Covers:** NFR Accessibility (WCAG 2.2 AA)

```
Tool: @axe-core/playwright (axe.analyze())
Pages to audit: /, /builder, /preview (with valid hash), /templates

For each page:
1. Run axe accessibility scan
2. Assert zero critical violations
3. Assert zero serious violations
4. Check: all form inputs have labels (not placeholder-only)
5. Check: focus indicators visible (keyboard nav)
6. Check: color contrast ≥ 4.5:1 for normal text
```

---

### E2E-016: Performance — LCP and Bundle Size
**Covers:** F006-AC4, NFR Performance

```
Tool: Playwright + Chrome DevTools Protocol
Steps (on /):
1. Enable performance tracing
2. Load page on throttled 4G (12.5 MB/s, 70ms RTT)
3. Assert LCP < 2500ms
4. Check network requests for initial JS bundle < 250KB (gzipped)
5. Assert jsPDF/html2canvas NOT loaded on initial page load (no request)
6. Navigate to /builder, trigger "Download PDF"
7. Assert jsPDF loaded only after PDF button clicked (lazy load confirmed)
```

---

### E2E-017: Multiple Resumes Management (F011)
**Covers:** F011-AC1, F011-AC2, F011-AC3

```
Steps:
1. Navigate to /builder, fill fullName="Resume One", email="one@example.com"
2. Wait for auto-save
3. Click "New Resume" → confirm
4. Fill fullName="Resume Two", email="two@example.com"
5. Open resume list panel
6. Assert both resumes listed with name, template, and date
7. Switch to "Resume One"
8. Assert fullName = "Resume One"
9. Click delete on "Resume Two" → assert confirmation dialog
10. Confirm delete → assert only one resume in list
```

---

### E2E-018: Zero Network Requests for Core Features
**Covers:** F004-AC3, F007-AC5, NFR Security

```
Steps:
1. Navigate to /builder
2. Monitor all network requests via page.route('**', ...)
3. Fill in resume data, change template, change accent color
4. Download PDF
5. Generate share link
6. Assert NO outbound fetch/XHR to any non-asset URL during all above actions
   (Only allowed: static assets from the same origin)
```

---

## 5. Property-Based Test Candidates

> Use `fast-check` library (`npm i -D fast-check`).
> **File:** `src/__tests__/property-based.test.ts`

### PBT-001: URL Codec Round-Trip (`encodeResumeData` / `decodeResumeData`)

```ts
fc.assert(fc.property(
  fc.object({ maxDepth: 3 }),
  (obj) => {
    const encoded = encodeResumeData(obj)
    const decoded = decodeResumeData(encoded)
    return JSON.stringify(decoded) === JSON.stringify(obj)
  }
))
```

**Property:** For any JSON-serialisable object, encode → decode yields structural equality.

---

### PBT-002: URL Codec Round-Trip (`encodeResumeForURL` / `decodeResumeFromURL`)

```ts
fc.assert(fc.property(
  fc.object({ maxDepth: 3 }),
  (obj) => {
    const encoded = encodeResumeForURL(obj)
    const decoded = decodeResumeFromURL(encoded)
    return JSON.stringify(decoded) === JSON.stringify(obj)
  }
))
```

---

### PBT-003: Codec Output is Always URL-Safe

```ts
fc.assert(fc.property(
  fc.object(),
  (obj) => {
    const encoded = encodeResumeForURL(obj)
    // No characters that need URL encoding in a fragment
    return /^[A-Za-z0-9\-_:]*$/.test(encoded)
  }
))
```

---

### PBT-004: Compression Used Above Threshold

```ts
fc.assert(fc.property(
  fc.string({ minLength: SHARE_COMPRESSION_THRESHOLD + 1 }),
  (longStr) => {
    const obj = { data: longStr }
    const encoded = encodeResumeForURL(obj)
    return encoded.startsWith('z:')
  }
))
```

---

### PBT-005: Zod Schema — Valid Resume Always Serialises & Re-validates

```ts
// Build a valid Resume with fc.record() matching schema shape
fc.assert(fc.property(
  validResumeArbitrary(), // custom fc.record(...) matching resumeSchema
  (resume) => {
    const json = JSON.stringify(resume)
    const parsed = JSON.parse(json)
    return resumeSchema.safeParse(parsed).success
  }
))
```

**Property:** Any value that satisfies `resumeSchema` survives a JSON serialisation round-trip and still validates.

---

### PBT-006: Import/Export Round-Trip Preserves Schema Compliance

```ts
fc.assert(fc.property(
  validResumeArbitrary(),
  (resume) => {
    useResumeStore.getState().setResume(resume)
    const json = useResumeStore.getState().exportAsJSON()
    const success = useResumeStore.getState().importFromJSON(json)
    const restored = useResumeStore.getState().resume
    return success && JSON.stringify(restored) === JSON.stringify({ ...resume, updatedAt: restored?.updatedAt })
  }
))
```

---

### PBT-007: Undo History Never Exceeds MAX_UNDO_HISTORY

```ts
fc.assert(fc.property(
  fc.array(fc.string(), { minLength: 51, maxLength: 200 }),
  (names) => {
    useResumeStore.getState().createNewResume()
    for (const name of names) {
      useResumeStore.getState().updatePersonalInfo({ fullName: name })
    }
    return useResumeStore.getState().pastStates.length <= MAX_UNDO_HISTORY
  }
))
```

---

### PBT-008: personalInfoSchema Rejects All Invalid Emails

```ts
fc.assert(fc.property(
  fc.string().filter(s => !s.includes('@')), // guarantee no valid email
  (notEmail) => {
    const result = personalInfoSchema.safeParse({
      fullName: 'Test', email: notEmail,
    })
    return !result.success
  }
))
```

---

## 6. Coverage Targets

| Module | Target | Rationale |
|---|---|---|
| `src/lib/schemas/resume-schema.ts` | **100 %** | Pure Zod definitions, fully exercisable |
| `src/store/resume-store.ts` | **95 %** | Core app logic; only SSR guards (`typeof window`) may be uncovered |
| `src/lib/sharing/url-codec.ts` | **100 %** | Pure functions, no side-effects |
| `src/lib/pdf/generate-pdf.ts` | **90 %** | Requires DOM mocks; multi-page branch must be covered |
| `src/hooks/use-auto-save.ts` | **90 %** | Debounce + error path |
| `src/hooks/use-pdf-generator.ts` | **90 %** | All status transitions |
| `src/hooks/use-shareable-link.ts` | **85 %** | Clipboard API path + error |
| `src/hooks/use-keyboard-shortcuts.ts` | **90 %** | All keyboard events |
| `src/hooks/use-media-query.ts` | **80 %** | Limited to matchMedia mock |
| `src/components/builder/sections/*` | **80 %** | Form inputs, add/remove |
| `src/components/templates/*` | **85 %** | All 5 templates with full + empty data |
| `src/components/builder/builder-layout.tsx` | **80 %** | Desktop + mobile layout paths |
| `src/components/builder/builder-toolbar.tsx` | **80 %** | All button actions |
| `src/components/landing/*` | **70 %** | Static content; main concern is SEO text |
| `src/app/page.tsx` | **70 %** | RSC, mostly static |
| `src/app/builder/page.tsx` | **75 %** | Mount effects, template param handling |
| `src/app/preview/page.tsx` | **80 %** | Valid/invalid hash paths |
| `src/lib/constants.ts` | **100 %** (implicit) | Constants referenced by covered modules |
| **Overall project target** | **≥ 80 %** | Enforce via `vitest --coverage --reporter=lcov` in CI |

### Coverage Exceptions (do not count against target)

- `src/components/ui/*` — Radix UI wrappers; upstream library is tested by Radix
- `src/test/setup.ts` — test infrastructure
- Generated type files

---

## 7. Acceptance Criterion → Test Traceability Matrix

Every acceptance criterion from `SPEC.md` maps to at least one test.

| Feature | Criterion | Test IDs |
|---|---|---|
| **F001** | Preview updates <200ms | PRV-001, E2E-003 |
| **F001** | "Add Experience" creates empty form | FRM-010, E2E-003 |
| **F001** | Drag reorders form and preview | FRM-012, E2E-003 |
| **F001** | Download blocked when name/email empty | PHK-002, PHK-003, TBR-004, E2E-005 |
| **F001** | Invalid email shows inline error | FRM-001, FRM-002, E2E-005 |
| **F001** | "Currently Working" hides end date / shows "Present" | FRM-011, PRV-003, E2E-003 |
| **F002** | Preview re-renders <200ms | PRV-001, E2E-003 |
| **F002** | Desktop: side-by-side layout | BLT-001, E2E-003 |
| **F002** | Mobile: bottom sheet on "Preview" tap | BLT-002, E2E-014 |
| **F002** | Preview matches PDF layout | PRV-002, E2E-003 |
| **F003** | Template thumbnail switches preview immediately | TBR-002, E2E-004 |
| **F003** | All sections render in all templates | TPL-001–005, E2E-004 |
| **F003** | ATS-extractable text (**⚠️ spec gap**) | TPL-007 *(documents rasterization gap)* |
| **F003** | No data lost on template switch | TPL-008, PRV-004, E2E-004 |
| **F003** | Multi-page flow clean | TPL-006, PDF-003 |
| **F004** | PDF downloads in <2s | E2E-003 (timing assert) |
| **F004** | PDF layout matches preview | PDF-002, E2E-003 |
| **F004** | Zero HTTP requests during PDF | E2E-018 |
| **F004** | Text selectable (**⚠️ spec gap**) | PHK-006 *(documents JPEG rasterization)* |
| **F004** | Filename `{FullName}_Resume.pdf` | PDF-005, PHK-004, E2E-003 |
| **F005** | Saves after 1s debounce | ASV-002, STR-040, E2E-006 |
| **F005** | Data restored on return | STR-044, E2E-006 |
| **F005** | Toast when storage full | ASV-006, E2E-006 |
| **F005** | Confirmation before clearing data | BLT-004–006, E2E-007 |
| **F006** | Hero heading "Free Resume Builder — No Paywall, No Tricks" | LND-001, E2E-001 |
| **F006** | ≥3 anti-paywall messages | LND-002, E2E-001 |
| **F006** | "Build Your Resume — It's Free" CTA above fold | LND-003, LND-004, E2E-001 |
| **F006** | LCP < 2.5s | E2E-016 |
| **F006** | Meta/OG tags with target keywords | LND-005–007 |
| **F007** | Share generates encoded URL | SHL-002, STR-061, E2E-008 |
| **F007** | URL renders read-only preview with data | PVW-001, E2E-008 |
| **F007** | Data >8KB compressed | COD-006–007, E2E-008 |
| **F007** | Recipient sees CTA, cannot edit | PVW-002–003, E2E-008 |
| **F007** | No server request from fragment | PVW-004, E2E-008, E2E-018 |
| **F008** | Export JSON is complete and valid | STR-050–051, JSN-001, E2E-010 |
| **F008** | Import JSON restores data | STR-053, JSN-002, E2E-010 |
| **F008** | Invalid import shows toast, no overwrite | STR-055, JSN-003–004, E2E-010 |
| **F008** | Exported JSON conforms to Resume type | JSN-005, PBT-005 |
| **F009** | Ctrl+P shows only resume | PRT-001–002 |
| **F009** | Print layout matches PDF on US Letter | PRT-002 |
| **F010** | OS dark mode → dark theme | DRK-001 |
| **F010** | Preview always white in dark mode | DRK-003, PRV-005, E2E-011 |
| **F010** | Toggle changes theme without reload | DRK-002, E2E-011 |
| **F011** | New resume without losing first | MLT-001, E2E-017 |
| **F011** | List shows name, template, date | MLT-002, E2E-017 |
| **F011** | Delete confirmation | MLT-003–004, E2E-017 |
| **F012** | 12 presets + hex for supported templates | CLR-001–002, TBR-008 |
| **F012** | Color updates accent elements | CLR-003, TPL-009, TBR-009 |
| **F012** | Warning on low contrast | CLR-004–006, TBR-010 |
| **F013** | Ctrl+Z reverts last change | UND-002, STR-030–036, E2E-012 |
| **F013** | Ctrl+Shift+Z re-applies | UND-003, STR-036, E2E-012 |
| **F013** | Stack capped at 50 | UND-001, STR-034, PBT-007 |
| **NFR Perf** | LCP <2.5s | E2E-016 |
| **NFR Perf** | Bundle <250KB initial | E2E-016 |
| **NFR Perf** | jsPDF/html2canvas lazy-loaded | E2E-016 |
| **NFR A11y** | WCAG 2.2 AA | E2E-015 |
| **NFR Security** | No server transmission | E2E-018, PVW-004 |
| **NFR Security** | Zod validates all imports | STR-047, STR-055, JSN-003–004 |

---

## 8. CI Integration

Add to `.github/workflows/ci.yml`:

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: '20', cache: 'npm' }
    - run: npm ci
    - run: npm run type-check
    - run: npm run lint
    - run: npm run test -- --run --coverage --reporter=lcov
    - name: Enforce coverage thresholds
      run: |
        npx nyc check-coverage --lines 80 --functions 80 --branches 75
    - run: npm run build
    - run: npx playwright install --with-deps
    - run: npm run test:e2e
    - name: Upload Playwright report
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: playwright-report/
    - name: Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun --collect.url=http://localhost:3000 \
          --assert.preset=lighthouse:recommended \
          --assert.assertions.performance=["error",{"minScore":0.9}] \
          --assert.assertions.accessibility=["error",{"minScore":0.9}]
```

---

## 9. ⚠️ Spec Gaps Requiring Engineering Decision

The following acceptance criteria **cannot pass** with the current implementation and require a design decision before the corresponding tests can go green:

### Gap 1 — F004-AC4: PDF Text Selectability
**Criterion:** "All text is selectable and copyable (not rasterized images)"
**Current behaviour:** `html2canvas → JPEG → jsPDF.addImage()` rasterizes all content. Text is NOT selectable.
**Options:**
1. Replace `html2canvas` approach with direct `jsPDF` text layout (significant effort)
2. Use `pdf-lib` with text extraction
3. Generate HTML with `@react-pdf/renderer` which produces real text layers
**Test action:** Write `PDF-TEXT-001` asserting the failure until fixed; mark `@skip` with issue link.

### Gap 2 — F003-AC3: ATS Text Extraction
**Criterion:** "All text content is extractable (no text-as-image)"
**Current behaviour:** Same rasterization issue as Gap 1.
**Test action:** `TPL-007` documents this with a comment explaining the limitation.

---

*Generated: 2026-03-19 · Based on SPEC.md v1.0, ARCHITECTURE.md v1.0, and source code analysis*
