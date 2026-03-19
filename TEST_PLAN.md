# TEST_PLAN.md — Free Resume Builder: No Paywall, No Tricks

> Every acceptance criterion from SPEC.md maps to at least one test case in this plan.
> Test tooling: **Vitest** (unit/component), **React Testing Library** (component integration), **Playwright** (E2E).

---

## 1. Test Strategy & Pyramid Ratios

### Why This Ratio

This is a **fully client-side, zero-API application**. There are no HTTP routes, no database queries, and no auth flows to verify with integration tests in the traditional sense. The risk surface lives entirely in:

1. **Pure logic** — Zod schemas, URL codec (compress/decompress), store reducers, PDF filename generation, undo/redo stack management.
2. **React component behavior** — real-time preview updates, form validation messages, template switching, mobile layout switching, dark mode toggle.
3. **Full user flows in a real browser** — PDF download initiates a file save, clipboard writes succeed, localStorage round-trips, `window.location.hash` is read on `/preview`.

```
                   ┌───────────────┐
                   │    E2E (15%)  │  Playwright — 15 critical flows
                   │   ~25 tests   │
              ┌────┴───────────────┴────┐
              │ Component/Integration   │  React Testing Library — per-component
              │        (35%)            │  ~90 tests
         ┌────┴─────────────────────────┴────┐
         │          Unit (50%)               │  Vitest — pure logic, schemas, hooks
         │         ~130 tests                │
         └───────────────────────────────────┘
```

| Layer | Tools | Focus | Target Count |
|---|---|---|---|
| Unit | Vitest | Schemas, store methods, codec, PDF options, hook logic | ~130 |
| Component | Vitest + RTL | Form sections, templates, toolbar, preview panel, pages | ~90 |
| E2E | Playwright | Complete user flows from landing → PDF download | ~25 |
| **Total** | | | **~245** |

### Key Testing Principles

- **No server to mock** — mock `localStorage`, `navigator.clipboard`, `document.getElementById`, `html2canvas`, `jsPDF`, and `window.location`.
- **Data isolation** — every test that touches `useResumeStore` calls `useResumeStore.getState().reset()` in `beforeEach`.
- **Deterministic IDs** — mock `Date.now()` and `Math.random()` when testing ID generation.
- **PDF generation** — mock `html2canvas` + `jsPDF` at the module boundary; test *filename logic* and *validation gating* independently of the canvas pipeline.
- **Compression threshold** — the `SHARE_COMPRESSION_THRESHOLD` is 8192 bytes; test both branches explicitly (small payload → `j:` prefix, large payload → `z:` prefix).

---

## 2. Unit Tests

### 2.1 `src/lib/schemas/resume-schema.ts`

**Coverage target: 100%**

#### `personalInfoSchema`

| Test | Scenario | Expected |
|---|---|---|
| `PI-001` | Valid full object with all fields | `success: true` |
| `PI-002` | `fullName: ''` | Fails with `'Full name is required'` |
| `PI-003` | `fullName` with 101 chars | Fails max(100) |
| `PI-004` | `email: 'not-an-email'` | Fails with `'Invalid email address'` |
| `PI-005` | `email: ''` | Fails (min 1 implicit from email validator) |
| `PI-006` | `phone` with 21 chars | Fails max(20) |
| `PI-007` | `website: 'https://example.com'` | Passes |
| `PI-008` | `website: ''` | Passes (`.or(z.literal(''))`) |
| `PI-009` | `website: 'not-a-url'` | Fails with `'Invalid URL'` |
| `PI-010` | `linkedin`, `github` same URL/empty logic | Same as `website` |
| `PI-011` | `summary` with 2001 chars | Fails max(2000) |
| `PI-012` | `summary` omitted entirely | Passes (optional) |

#### `experienceSchema`

| Test | Scenario | Expected |
|---|---|---|
| `EX-001` | Valid experience with all fields | `success: true` |
| `EX-002` | `jobTitle: ''` | Fails with `'Job title is required'` |
| `EX-003` | `company: ''` | Fails with `'Company is required'` |
| `EX-004` | `startDate: ''` | Fails with `'Start date is required'` |
| `EX-005` | `currentlyWorking: true`, `endDate: ''` | Passes |
| `EX-006` | `description` with 5001 chars | Fails max(5000) |
| `EX-007` | `id` is empty string | Passes (string, no min) |

#### `educationSchema`

| Test | Scenario | Expected |
|---|---|---|
| `ED-001` | Valid education | `success: true` |
| `ED-002` | `school: ''` | Fails `'School is required'` |
| `ED-003` | `degree: ''` | Fails `'Degree is required'` |
| `ED-004` | `gpa: '12345678901'` (11 chars) | Fails max(10) |
| `ED-005` | `endDate` omitted | Passes (optional) |

#### `skillSchema`

| Test | Scenario | Expected |
|---|---|---|
| `SK-001` | `name: ''` | Fails `'Skill name is required'` |
| `SK-002` | `name` with 51 chars | Fails max(50) |
| `SK-003` | `level: 'expert'` | Passes |
| `SK-004` | `level: 'master'` | Fails (not in enum) |
| `SK-005` | `level` omitted | Passes (optional) |

#### `projectSchema`

| Test | Scenario | Expected |
|---|---|---|
| `PJ-001` | Valid project | `success: true` |
| `PJ-002` | `title: ''` | Fails `'Project title is required'` |
| `PJ-003` | `link: 'not-url'` | Fails |
| `PJ-004` | `link: ''` | Passes |
| `PJ-005` | `technologies: ['React', 'TypeScript']` | Passes |

#### `certificationSchema`

| Test | Scenario | Expected |
|---|---|---|
| `CE-001` | Valid certification | `success: true` |
| `CE-002` | `name: ''` | Fails |
| `CE-003` | `issuer: ''` | Fails |
| `CE-004` | `issueDate: ''` | Fails `'Issue date is required'` |
| `CE-005` | `credentialUrl: 'https://valid.com'` | Passes |
| `CE-006` | `credentialUrl: ''` | Passes |

#### `resumeSchema`

| Test | Scenario | Expected |
|---|---|---|
| `RS-001` | Complete valid resume | `success: true` |
| `RS-002` | `template: 'unknown'` | Fails (not in enum) |
| `RS-003` | `accentColor: '#GGGGGG'` | Fails regex |
| `RS-004` | `accentColor: '#2563eb'` | Passes |
| `RS-005` | `accentColor: '#2563EB'` | Passes (case-insensitive regex) |
| `RS-006` | `accentColor` missing — default applied | Default `'#2563eb'` |
| `RS-007` | `experiences` missing — default `[]` | Empty array |
| `RS-008` | All optional arrays missing | All default to `[]` |

---

### 2.2 `src/store/resume-store.ts`

**Coverage target: 95%**

Setup: `beforeEach` — `useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })`

#### `createNewResume`

| Test | Scenario | Expected |
|---|---|---|
| `ST-001` | Call `createNewResume()` | `resume` is not null, `template === 'modern'`, `accentColor === '#2563eb'`, all arrays empty |
| `ST-002` | `id` is unique across two calls | Two different IDs |
| `ST-003` | `createdAt` and `updatedAt` are valid ISO strings | Parseable by `new Date()` |
| `ST-004` | `pastStates` and `futureStates` cleared | Both `[]` |

#### `updatePersonalInfo`

| Test | Scenario | Expected |
|---|---|---|
| `ST-010` | Update `fullName` | `resume.personalInfo.fullName` updated |
| `ST-011` | Partial update preserves other fields | Other fields unchanged |
| `ST-012` | `updatedAt` timestamp advances | `updatedAt > createdAt` |
| `ST-013` | Pushes previous state to `pastStates` | `pastStates.length === 1` |
| `ST-014` | Clears `futureStates` | `futureStates === []` |
| `ST-015` | Called when `resume === null` | State unchanged (no-op) |

#### `addExperience` / `updateExperience` / `removeExperience`

| Test | Scenario | Expected |
|---|---|---|
| `ST-020` | `addExperience()` on empty list | `experiences.length === 1`, entry has empty string fields |
| `ST-021` | `addExperience()` twice | `experiences.length === 2`, distinct IDs |
| `ST-022` | `updateExperience(id, { jobTitle: 'Engineer' })` | Target entry updated, others unchanged |
| `ST-023` | `updateExperience` with unknown ID | No entries mutated |
| `ST-024` | `removeExperience(id)` | Entry removed, `experiences.length` decremented |
| `ST-025` | `removeExperience` with unknown ID | List unchanged |

#### `reorderExperiences`

| Test | Scenario | Expected |
|---|---|---|
| `ST-030` | Provide IDs in reversed order | `experiences` reordered accordingly |
| `ST-031` | Include unknown ID in array | Unknown IDs filtered out (`.filter(Boolean)`) |
| `ST-032` | Empty array | `experiences` becomes `[]` |

*(Same CRUD + reorder patterns apply for Education, Skills, Projects, Certifications — each section needs counterpart tests `ST-033..ST-039` etc.)*

#### `updateTemplate` / `updateAccentColor`

| Test | Scenario | Expected |
|---|---|---|
| `ST-040` | `updateTemplate('classic')` | `resume.template === 'classic'` |
| `ST-041` | `updateTemplate` does **not** push to `pastStates` | `pastStates` length unchanged |
| `ST-042` | `updateAccentColor('#7c3aed')` | `resume.accentColor === '#7c3aed'` |

#### `saveToLocalStorage` / `loadFromLocalStorage`

| Test | Scenario | Expected |
|---|---|---|
| `ST-050` | Save valid resume | `localStorage.setItem` called with `STORAGE_KEY` |
| `ST-051` | Save round-trips: save → clear store → load | Store restored to saved state |
| `ST-052` | `loadFromLocalStorage` with no stored data | `createEmptyResume()` called (empty resume) |
| `ST-053` | `loadFromLocalStorage` with corrupted JSON | Catches error, creates empty resume |
| `ST-054` | `loadFromLocalStorage` with invalid schema | Zod failure → creates empty resume |
| `ST-055` | `saveToLocalStorage` throws (quota exceeded) | Error is re-thrown (caller handles toast) |
| `ST-056` | `typeof window === 'undefined'` (SSR guard) | Returns early, no crash |

#### `exportAsJSON` / `importFromJSON`

| Test | Scenario | Expected |
|---|---|---|
| `ST-060` | `exportAsJSON()` returns valid JSON string | `JSON.parse()` succeeds |
| `ST-061` | Exported JSON parsed by `resumeSchema` | `success: true` |
| `ST-062` | `exportAsJSON()` when `resume === null` | Returns `''` |
| `ST-063` | `importFromJSON(validJson)` | Returns `true`, store updated |
| `ST-064` | `importFromJSON('not json')` | Returns `false` |
| `ST-065` | `importFromJSON(jsonFailingSchema)` | Returns `false`, store unchanged |
| `ST-066` | `importFromJSON` resets `pastStates` and `futureStates` | Both `[]` after import |

#### `generateShareableURL` / `loadFromShareableURL`

| Test | Scenario | Expected |
|---|---|---|
| `ST-070` | `generateShareableURL()` returns URL containing `/preview#` | String includes `/preview#` |
| `ST-071` | Round-trip: generate → load | Loaded resume equals original |
| `ST-072` | `generateShareableURL()` when `resume === null` | Returns `''` |
| `ST-073` | `loadFromShareableURL('')` | Returns `false` |
| `ST-074` | `loadFromShareableURL(invalidBase64)` | Returns `false`, no crash |
| `ST-075` | `loadFromShareableURL(validHashBadSchema)` | Returns `false` |

#### `undo` / `redo`

| Test | Scenario | Expected |
|---|---|---|
| `ST-080` | `canUndo()` with empty `pastStates` | `false` |
| `ST-081` | After one update, `canUndo()` | `true` |
| `ST-082` | `undo()` restores previous state | `resume` equals pre-update value |
| `ST-083` | `undo()` moves current state to `futureStates` | `futureStates.length === 1` |
| `ST-084` | `canRedo()` after undo | `true` |
| `ST-085` | `redo()` re-applies future state | `resume` restored |
| `ST-086` | New mutation after undo clears `futureStates` | `futureStates === []` |
| `ST-087` | 51 mutations: `pastStates.length` stays ≤ 50 | Oldest entry dropped (MAX_UNDO_HISTORY = 50) |
| `ST-088` | `undo()` when `pastStates` is empty | No-op, state unchanged |
| `ST-089` | `redo()` when `futureStates` is empty | No-op, state unchanged |

---

### 2.3 `src/lib/sharing/url-codec.ts`

**Coverage target: 100%**

| Test | Scenario | Expected |
|---|---|---|
| `UC-001` | `encodeResumeData` with small object (< 8192 bytes) | Returns string starting with `'j:'` |
| `UC-002` | `encodeResumeData` with large object (> 8192 bytes) | Returns string starting with `'c:'` |
| `UC-003` | `decodeResumeData('j:' + encoded)` round-trip | Returns original object |
| `UC-004` | `decodeResumeData('c:' + compressed)` round-trip | Returns original object |
| `UC-005` | `decodeResumeData('garbage')` | Returns `null` (no prefix match) |
| `UC-006` | `decodeResumeData` with malformed base64 | Returns `null` (caught) |
| `UC-007` | `encodeResumeForURL` small payload | No `'z:'` prefix, plain base64url |
| `UC-008` | `encodeResumeForURL` large payload (> 8192 bytes) | Returns string starting with `'z:'` |
| `UC-009` | `decodeResumeFromURL('z:' + encoded)` | Returns original object |
| `UC-010` | `decodeResumeFromURL` plain base64url | Returns original object |
| `UC-011` | `decodeResumeFromURL` corrupted `z:` payload | Returns `null` |
| `UC-012` | `decodeResumeFromURL` empty string | Returns `null` |
| `UC-013` | Encoded string is URL-safe (no `+`, `/`, `=`) | `!/[+/=]/.test(encoded)` |
| `UC-014` | Unicode resume data (international name e.g. "张伟") | Round-trips correctly |

---

### 2.4 `src/lib/pdf/generate-pdf.ts`

**Coverage target: 80%** (canvas APIs mocked at module boundary)

Mock strategy: `vi.mock('html2canvas', ...)` returning a fixed canvas stub; `vi.mock('jspdf', ...)` capturing `addImage` / `save` calls.

| Test | Scenario | Expected |
|---|---|---|
| `PDF-001` | `generatePDF()` when element not found | Throws `'Element #resume-preview-container not found'` |
| `PDF-002` | Single-page content (canvas height ≤ page height) | `pdf.addImage` called once, `pdf.addPage` not called |
| `PDF-003` | Multi-page content (canvas height > page height) | `pdf.addPage` called for each additional page |
| `PDF-004` | Default filename is `'Resume.pdf'` | `pdf.save('Resume.pdf')` called |
| `PDF-005` | Custom filename passed via options | `pdf.save(customFilename)` called |
| `PDF-006` | `html2canvas` options: `scale: 2`, `backgroundColor: '#ffffff'`, `useCORS: true` | Options match exactly |
| `PDF-007` | PDF format is `'letter'`, orientation `'portrait'` | jsPDF constructed with these options |

---

### 2.5 `src/hooks/use-auto-save.ts`

**Coverage target: 90%** (using `vi.useFakeTimers()`)

| Test | Scenario | Expected |
|---|---|---|
| `AS-001` | Initial mount: no save triggered | `saveToLocalStorage` not called on mount |
| `AS-002` | Resume changes: save triggered after debounce (1000ms) | `saveToLocalStorage` called after `vi.advanceTimersByTime(1000)` |
| `AS-003` | Rapid changes within debounce window | Only one save call (debounce resets) |
| `AS-004` | `lastSaved` set after successful save | `lastSaved` is a `Date` instance |
| `AS-005` | `isSaving` transitions: `false` → `true` → `false` | State machine verified |
| `AS-006` | `saveToLocalStorage` throws | `toast` called with `variant: 'destructive'` |
| `AS-007` | Component unmounts during debounce | Timer cleared, no save on unmount |
| `AS-008` | `resume === null` | No save attempted |

---

### 2.6 `src/hooks/use-pdf-generator.ts`

**Coverage target: 90%**

Mock: `vi.mock('@/lib/pdf/generate-pdf')` + store seeded with controlled resume state.

| Test | Scenario | Expected |
|---|---|---|
| `PG-001` | `resume === null` — `downloadPDF()` | Toast: `'Add your details in the editor first'`, status stays `'idle'` |
| `PG-002` | `fullName` empty — `downloadPDF()` | Toast: `'Add your name in the Personal tab...'` |
| `PG-003` | `email` empty — `downloadPDF()` | Toast: `'Add your email in the Personal tab...'` |
| `PG-004` | Valid resume — `downloadPDF()` | `generatePDF` called with `{ elementId: 'resume-preview-container', filename: 'John_Doe_Resume.pdf' }` |
| `PG-005` | Filename: `'John Doe'` → `'John_Doe_Resume.pdf'` | Spaces replaced with underscores |
| `PG-006` | `status` transitions: `idle` → `generating` → `success` | State machine verified |
| `PG-007` | `generatePDF` throws → `status === 'error'` | Error toast shown |
| `PG-008` | Status resets to `'idle'` after 2s (success) | Fake timer advances 2000ms |
| `PG-009` | `isGenerating` is `true` only while `status === 'generating'` | Derived boolean correct |

---

### 2.7 `src/hooks/use-shareable-link.ts`

**Coverage target: 90%**

Mock: `navigator.clipboard.writeText`, `encodeResumeForURL`, `window.location.origin`.

| Test | Scenario | Expected |
|---|---|---|
| `SL-001` | `generateLink()` with valid resume | Clipboard written with URL containing `/preview#` |
| `SL-002` | `isCopied` is `true` after successful copy | State reflects clipboard write |
| `SL-003` | `isCopied` resets to `false` after 2 seconds | Fake timers verify reset |
| `SL-004` | `generateLink()` when `resume === null` | Toast: `'Nothing to share yet'` |
| `SL-005` | Clipboard write fails | Toast: `'Clipboard access denied'` |
| `SL-006` | URL fragment contains data (after `#`), not query string | `url.includes('#')` and `!url.includes('?')` |
| `SL-007` | URL uses `/preview` path | `url.includes('/preview#')` |

---

### 2.8 `src/hooks/use-keyboard-shortcuts.ts`

**Coverage target: 90%**

| Test | Scenario | Expected |
|---|---|---|
| `KS-001` | `Ctrl+Z` when NOT in input, `canUndo() === true` | `undo()` called |
| `KS-002` | `Ctrl+Z` when focus is in `<input>` | `undo()` NOT called |
| `KS-003` | `Ctrl+Z` when focus is in `<textarea>` | `undo()` NOT called |
| `KS-004` | `Ctrl+Z` when `canUndo() === false` | `undo()` NOT called |
| `KS-005` | `Ctrl+Shift+Z` when `canRedo() === true` | `redo()` called |
| `KS-006` | `Ctrl+Y` when `canRedo() === true` | `redo()` called |
| `KS-007` | Mac: `Cmd+Z` triggers undo (`metaKey: true`) | `undo()` called |
| `KS-008` | `enabled: false` | No event listener registered |
| `KS-009` | Unmount cleans up event listener | `removeEventListener` called |

---

### 2.9 `src/lib/constants.ts`

**Coverage target: 100%** (static data — verify values are correct)

| Test | Scenario | Expected |
|---|---|---|
| `CN-001` | `TEMPLATE_LIST` has exactly 5 entries | Length 5, IDs: modern/classic/minimal/creative/professional |
| `CN-002` | `PRESET_ACCENT_COLORS` has exactly 12 entries | Length 12 |
| `CN-003` | `DEFAULT_ACCENT_COLOR === '#2563eb'` | Exact match |
| `CN-004` | `MAX_UNDO_HISTORY === 50` | Exact match |
| `CN-005` | `SHARE_COMPRESSION_THRESHOLD === 8192` | Exact match |
| `CN-006` | `AUTO_SAVE_DEBOUNCE_MS === 1000` | Exact match |
| `CN-007` | `STORAGE_KEY === 'resume-builder-data'` | Exact match |
| `CN-008` | Every preset color matches hex regex `#[0-9a-fA-F]{6}` | All 12 pass |

---

### 2.10 `src/lib/cn.ts`

**Coverage target: 100%**

| Test | Scenario | Expected |
|---|---|---|
| `LIB-001` | Merge conflicting Tailwind classes | Later class wins (`'p-2 p-4'` → `'p-4'`) |
| `LIB-002` | Conditional classes with `clsx` | Falsy conditionals excluded |

---

## 3. Component / Integration Tests (React Testing Library)

> Each test renders the component in a `jsdom` environment, interacts via `userEvent`, and asserts on the DOM. Store is reset before each test via `beforeEach`.

### 3.1 `src/components/builder/sections/personal-info-form.tsx`

**Coverage target: 85%** | Maps to: F001, F004 (validation), F005 (data flow)

| Test | Scenario | Expected |
|---|---|---|
| `PIF-001` | Renders all fields with labels | `fullName`, `email`, `phone`, `location`, `website`, `linkedin`, `github`, `summary` inputs present |
| `PIF-002` | All inputs have visible `<label>` (not placeholder-only) | Each `<input>` associated via `htmlFor` or `aria-label` — use `getByLabelText` |
| `PIF-003` | Type in `fullName` field | Store `personalInfo.fullName` updated |
| `PIF-004` | Blur `email` with invalid value | Inline error message appears (F001 AC: inline error on blur) |
| `PIF-005` | Blur `email` with valid value | No error message |
| `PIF-006` | `website` field accepts empty string | No validation error |
| `PIF-007` | `website` field with invalid URL blurred | Error shown |
| `PIF-008` | All inputs have `data-testid` attributes | Playwright can target them |

### 3.2 `src/components/builder/sections/experience-form.tsx`

**Coverage target: 85%** | Maps to: F001

| Test | Scenario | Expected |
|---|---|---|
| `EXF-001` | Renders "Add Experience" button when list is empty | Button present |
| `EXF-002` | Click "Add Experience" | New entry appended, form fields visible |
| `EXF-003` | Click "Add Experience" twice | Two entries shown with distinct IDs |
| `EXF-004` | Check "Currently Working" checkbox | `endDate` field hidden, store `currentlyWorking: true` |
| `EXF-005` | Uncheck "Currently Working" | `endDate` field reappears |
| `EXF-006` | Click remove/delete button on entry | Entry removed from store and DOM |
| `EXF-007` | Drag handle is present (`data-testid="drag-handle"`) | Element in DOM for E2E targeting |

### 3.3 `src/components/builder/sections/education-form.tsx`

**Coverage target: 85%** | Maps to: F001

| Test | Scenario | Expected |
|---|---|---|
| `EDF-001` | "Add Education" button present | Renders |
| `EDF-002` | Click "Add Education" | Entry added to store |
| `EDF-003` | Remove education entry | Removed from store |

### 3.4 `src/components/builder/sections/skills-form.tsx`

**Coverage target: 85%** | Maps to: F001

| Test | Scenario | Expected |
|---|---|---|
| `SKF-001` | "Add Skill" button present | Renders |
| `SKF-002` | Click "Add Skill" → enter name | Store updated |
| `SKF-003` | Skill level dropdown shows beginner/intermediate/advanced/expert | All 4 options present |
| `SKF-004` | Remove skill | Removed from store |

### 3.5 `src/components/builder/sections/projects-form.tsx` & `certifications-form.tsx`

**Coverage target: 80%** | Maps to: F001

| Test | Scenario | Expected |
|---|---|---|
| `PRF-001` | Add project, fill title | Store updated |
| `PRF-002` | Project `link` field with invalid URL blurred | Error shown |
| `CRF-001` | Add certification, fill name + issuer + issueDate | Store updated |
| `CRF-002` | Remove certification | Removed |

### 3.6 `src/components/builder/builder-toolbar.tsx`

**Coverage target: 85%** | Maps to: F003, F004, F007, F008, F012

| Test | Scenario | Expected |
|---|---|---|
| `TB-001` | Template selector renders 5 options | All template IDs present |
| `TB-002` | Select "Classic" template | `store.updateTemplate('classic')` called |
| `TB-003` | "Download PDF" button present | Visible with `data-testid="download-pdf-btn"` |
| `TB-004` | "Download PDF" with no resume → shows validation toast | Error toast appears |
| `TB-005` | "Share" button present | Visible |
| `TB-006` | "Export JSON" triggers download | `store.exportAsJSON()` called |
| `TB-007` | "Import JSON" file input triggers `store.importFromJSON` | Valid file → store updated |
| `TB-008` | "Import JSON" with invalid file | Toast: invalid format |
| `TB-009` | Color picker button (for supported templates) | Opens color picker |
| `TB-010` | Color picker shows 12 preset swatches | 12 buttons/swatches rendered |

### 3.7 `src/components/builder/preview-panel.tsx`

**Coverage target: 80%** | Maps to: F002, F003

| Test | Scenario | Expected |
|---|---|---|
| `PP-001` | Renders `<div id="resume-preview-container">` | Element present in DOM |
| `PP-002` | Receives resume data → renders name in preview | `fullName` appears in rendered output |
| `PP-003` | Template prop `'modern'` → renders `<ModernTemplate>` | Not `ClassicTemplate` etc. |
| `PP-004` | Template switches without losing data | Name still present after template change |
| `PP-005` | Preview has `data-testid="preview-panel"` | Present for E2E targeting |

### 3.8 `src/components/templates/template-renderer.tsx` + all 5 templates

**Coverage target: 90%** | Maps to: F003

For each template (`modern`, `classic`, `minimal`, `creative`, `professional`):

| Test | Scenario | Expected |
|---|---|---|
| `TR-001..005` | Renders with full sample data | No crashes, all sections visible |
| `TR-006..010` | `personalInfo.fullName` appears in output | Name rendered |
| `TR-011..015` | Experience section with 2 entries renders both | Both job titles appear |
| `TR-016..020` | Education, skills, projects, certifications all render | All section data present |
| `TR-021..025` | Empty arrays → sections gracefully hidden or empty | No "undefined" text, no crashes |
| `TR-026..030` | `accentColor` prop applied to template | Color used in CSS style or class |
| `TR-031` | Unknown template name passed | `TemplateRenderer` falls back gracefully (no crash) |

### 3.9 `src/components/builder/builder-layout.tsx`

**Coverage target: 80%** | Maps to: F002

| Test | Scenario | Expected |
|---|---|---|
| `BL-001` | Desktop viewport (≥1024px): form and preview side-by-side | Both panels visible |
| `BL-002` | Mobile viewport (<768px): only form tab visible initially | Preview not visible without switching tab |
| `BL-003` | Mobile: tap "Preview" tab | Preview panel becomes visible |
| `BL-004` | Mobile preview sheet button present | `data-testid="mobile-preview-btn"` |

### 3.10 `src/components/landing/` (hero, feature-grid, trust-signals, faq, footer)

**Coverage target: 80%** | Maps to: F006

| Test | Scenario | Expected |
|---|---|---|
| `LP-001` | Hero renders "Free Resume Builder — No Paywall, No Tricks" heading | Text present |
| `LP-002` | "Build Your Resume — It's Free" CTA button links to `/builder` | `href="/builder"` |
| `LP-003` | ≥3 distinct anti-paywall messages in page | Count of matching strings ≥ 3 |
| `LP-004` | Trust signals section mentions "Zety" or competitor | Competitor name present |
| `LP-005` | FAQ section renders at least 3 Q&A pairs | ≥3 expandable items |
| `LP-006` | Footer contains affiliate link(s) | Link with external `href` |
| `LP-007` | No email input or payment form anywhere on landing page | No `<input type="email">` or `<input type="payment">` |

### 3.11 `src/components/shared/theme-toggle.tsx`

**Coverage target: 85%** | Maps to: F010

| Test | Scenario | Expected |
|---|---|---|
| `TT-001` | Toggle button renders | Present in DOM |
| `TT-002` | Click toggle → theme class changes | `data-theme` or class on `<html>` changes |
| `TT-003` | Dark mode: preview panel still has white background class | `bg-white` or equivalent present on preview container |

### 3.12 `src/components/ui/color-picker.tsx`

**Coverage target: 85%** | Maps to: F012

| Test | Scenario | Expected |
|---|---|---|
| `CP-001` | Renders 12 preset color swatches | 12 buttons with distinct color values |
| `CP-002` | Click preset → `onChange` called with hex | Callback receives `#7c3aed` etc. |
| `CP-003` | Custom hex input with valid color | `onChange` called |
| `CP-004` | Low-contrast color (e.g., `#eeeeee` against white background, ratio < 3:1) → warning shown | Warning text present |
| `CP-005` | Contrast ratio ≥ 3:1 → no warning | Warning absent |

### 3.13 `src/components/preview/preview-viewer.tsx`

**Coverage target: 85%** | Maps to: F007

| Test | Scenario | Expected |
|---|---|---|
| `PV-001` | Valid hash in URL → renders resume | Name visible |
| `PV-002` | Invalid/corrupt hash → error state shown | Error message, resume not rendered |
| `PV-003` | No edit controls present | No form inputs visible (read-only) |
| `PV-004` | "Build Your Own — It's Free" CTA present | Link to `/builder` |

### 3.14 `src/components/builder/resume-list-panel.tsx`

**Coverage target: 80%** | Maps to: F011

| Test | Scenario | Expected |
|---|---|---|
| `RL-001` | Shows each resume: name, template, last-modified date | All three data points rendered |
| `RL-002` | "New Resume" button present | Visible |
| `RL-003` | Delete button → confirmation dialog appears | Dialog visible before deletion |
| `RL-004` | Confirm delete → resume removed | Store updated |
| `RL-005` | Cancel delete → resume remains | Store unchanged |

---

## 4. E2E Tests (Playwright)

> Run against `localhost:3000` (or preview deploy). Each spec corresponds to a SPEC.md user story.
> Playwright config: `chromium`, `firefox`, `webkit`, `Pixel 5` (mobile Chrome), `iPhone 14` (mobile Safari).

### Required `data-testid` Attributes

| Selector | Component | Purpose |
|---|---|---|
| `[data-testid="hero-heading"]` | `hero.tsx` | Assert landing page copy |
| `[data-testid="hero-cta-btn"]` | `hero.tsx` | Click to go to builder |
| `[data-testid="download-pdf-btn"]` | `builder-toolbar.tsx` | Trigger PDF download |
| `[data-testid="share-btn"]` | `builder-toolbar.tsx` | Trigger share link |
| `[data-testid="template-selector"]` | `builder-toolbar.tsx` | Template dropdown |
| `[data-testid="template-option-{id}"]` | `builder-toolbar.tsx` | Individual template options |
| `[data-testid="form-panel"]` | `form-panel.tsx` | Left panel container |
| `[data-testid="preview-panel"]` | `preview-panel.tsx` | Right panel |
| `[data-testid="preview-container"]` | `preview-panel.tsx` | `id="resume-preview-container"` element |
| `[data-testid="field-fullName"]` | `personal-info-form.tsx` | Name input |
| `[data-testid="field-email"]` | `personal-info-form.tsx` | Email input |
| `[data-testid="add-experience-btn"]` | `experience-form.tsx` | Add experience |
| `[data-testid="experience-entry-{index}"]` | `section-entry.tsx` | Individual entry wrapper |
| `[data-testid="currently-working-checkbox"]` | `experience-form.tsx` | Currently working toggle |
| `[data-testid="drag-handle-{id}"]` | `section-entry.tsx` | Drag reorder handle |
| `[data-testid="remove-entry-{id}"]` | `section-entry.tsx` | Delete entry button |
| `[data-testid="new-resume-btn"]` | `builder-toolbar.tsx` | Create new resume |
| `[data-testid="confirm-dialog"]` | `dialog.tsx` | Confirmation modal |
| `[data-testid="theme-toggle"]` | `theme-toggle.tsx` | Dark/light toggle |
| `[data-testid="export-json-btn"]` | `builder-toolbar.tsx` | Export JSON |
| `[data-testid="import-json-input"]` | `builder-toolbar.tsx` | File input for import |
| `[data-testid="preview-cta-link"]` | `preview-cta.tsx` | Build own resume CTA |

---

### E2E-001: Landing Page → Builder Navigation (F006)

**Maps to:** F006-AC1, F006-AC3, F006-AC5

```
Step 1:  Navigate to /
Step 2:  Assert <title> contains "free resume builder" (case-insensitive)
Step 3:  Assert [data-testid="hero-heading"] text === "Free Resume Builder — No Paywall, No Tricks"
Step 4:  Assert meta[name="description"] content contains "no paywall"
Step 5:  Assert meta[property="og:title"] is present and non-empty
Step 6:  Count elements with text matching /paywall|No Paywall|Unlike Zety|subscription/i → assert count ≥ 3
Step 7:  Assert [data-testid="hero-cta-btn"] bounding box top < viewport height (above fold)
Step 8:  Click [data-testid="hero-cta-btn"]
Step 9:  Assert URL === /builder
Step 10: Assert [data-testid="form-panel"] is visible
```

---

### E2E-002: Complete Resume Build & PDF Download (F001, F002, F004)

**Maps to:** F001-AC1, F001-AC2, F002-AC1, F004-AC1, F004-AC3, F004-AC5

```
Step 1:  Navigate to /builder (clear localStorage first via storageState: {})
Step 2:  Fill [data-testid="field-fullName"] with "Jane Smith"
Step 3:  Assert [data-testid="preview-container"] contains text "Jane Smith" within 500ms
Step 4:  Fill [data-testid="field-email"] with "jane@example.com"
Step 5:  Click [data-testid="add-experience-btn"]
Step 6:  Fill experience jobTitle input with "Software Engineer"
Step 7:  Fill experience company input with "Acme Corp"
Step 8:  Fill experience startDate with "2022-01"
Step 9:  Assert preview contains "Software Engineer" and "Acme Corp"
Step 10: Set up network request interception (capture all outgoing requests)
Step 11: Click [data-testid="download-pdf-btn"]
Step 12: Assert download event fired — filename matches "Jane_Smith_Resume.pdf"
Step 13: Assert no requests made to any domain other than localhost
```

---

### E2E-003: Validation Gate — Download Without Required Fields (F001, F004)

**Maps to:** F001-AC4, F004-AC1

```
Step 1:  Navigate to /builder (empty state)
Step 2:  Click [data-testid="download-pdf-btn"] immediately
Step 3:  Assert toast appears containing text "Add your"
Step 4:  Assert no download event fired
Step 5:  Fill [data-testid="field-fullName"] with "Test User" only
Step 6:  Click [data-testid="download-pdf-btn"]
Step 7:  Assert toast contains "email"
Step 8:  Fill [data-testid="field-email"] with "test@test.com"
Step 9:  Click [data-testid="download-pdf-btn"]
Step 10: Assert download triggered (success toast appears)
```

---

### E2E-004: Template Switching — All 5 Templates (F003)

**Maps to:** F003-AC1, F003-AC2, F003-AC4

```
Step 1:  Navigate to /builder
Step 2:  Fill fullName = "Template Tester", email = "t@test.com"
Step 3:  Add one experience entry with jobTitle = "Designer"
Step 4:  For each template in [modern, classic, minimal, creative, professional]:
   a.   Select template via [data-testid="template-selector"]
   b.   Assert preview updates and contains "Template Tester"
   c.   Assert form [data-testid="field-fullName"] still shows "Template Tester" (data not lost)
   d.   Assert no page reload occurred (track navigation events)
Step 5:  Assert 5 template switches complete without error
```

---

### E2E-005: LocalStorage Persistence — Auto-Save & Restore (F005)

**Maps to:** F005-AC1, F005-AC2, F005-AC3, F005-AC4

```
Step 1:  Navigate to /builder (fresh session)
Step 2:  Fill fullName = "Persisted User", email = "p@persist.com"
Step 3:  Wait 1500ms (debounce 1000ms + write time)
Step 4:  Open a new page to /builder (same browser context, same localStorage)
Step 5:  Assert [data-testid="field-fullName"] value === "Persisted User"
Step 6:  Assert [data-testid="field-email"] value === "p@persist.com"
Step 7:  Click [data-testid="new-resume-btn"]
Step 8:  Assert [data-testid="confirm-dialog"] is visible
Step 9:  Click cancel/dismiss button on dialog
Step 10: Assert [data-testid="field-fullName"] still shows "Persisted User"
Step 11: Click [data-testid="new-resume-btn"] again → confirm
Step 12: Assert form fields are cleared / empty
```

---

### E2E-006: Shareable Link — Generate, Open, Read-Only (F007)

**Maps to:** F007-AC1, F007-AC2, F007-AC4, F007-AC5

```
Step 1:  Navigate to /builder
Step 2:  Fill fullName = "Share Test User", email = "share@test.com"
Step 3:  Set up network request interceptor
Step 4:  Click [data-testid="share-btn"]
Step 5:  Assert toast "Link copied!" appears
Step 6:  Read clipboard content (or capture URL from toast detail)
Step 7:  Assert URL contains "/preview#"
Step 8:  Assert URL fragment (text after #) is non-empty
Step 9:  Assert URL does not contain "?" (data is NOT in query string)
Step 10: Open captured URL in a new browser context
Step 11: Assert "Share Test User" is visible in preview
Step 12: Assert no form inputs are present (read-only mode)
Step 13: Assert [data-testid="preview-cta-link"] is visible with href="/builder"
Step 14: Assert zero requests made to any external domain
```

---

### E2E-007: JSON Import / Export Round-Trip (F008)

**Maps to:** F008-AC1, F008-AC2, F008-AC3, F008-AC4

```
Step 1:  Navigate to /builder, fill fullName = "Export User", email = "e@export.com"
Step 2:  Click [data-testid="export-json-btn"]
Step 3:  Capture the downloaded file content
Step 4:  Parse the file as JSON — assert it is valid JSON
Step 5:  Assert parsed JSON contains fullName === "Export User"
Step 6:  Assert parsed JSON passes resumeSchema validation
Step 7:  Navigate to fresh /builder session
Step 8:  Upload exported file via [data-testid="import-json-input"]
Step 9:  Assert [data-testid="field-fullName"] value === "Export User"
Step 10: Upload a file containing "{ not valid json }"
Step 11: Assert error toast appears
Step 12: Assert [data-testid="field-fullName"] still shows "Export User" (not overwritten)
```

---

### E2E-008: Undo / Redo Keyboard Shortcuts (F013)

**Maps to:** F013-AC1, F013-AC2

```
Step 1:  Navigate to /builder
Step 2:  Fill fullName = "First Version"
Step 3:  Tab away to blur the field
Step 4:  Clear fullName field, type "Second Version", tab away
Step 5:  Click outside all inputs (body element) to ensure focus is not in input
Step 6:  Press Ctrl+Z (or Cmd+Z on Mac)
Step 7:  Assert [data-testid="field-fullName"] value === "First Version"
Step 8:  Assert preview contains "First Version"
Step 9:  Press Ctrl+Shift+Z (or Cmd+Shift+Z on Mac)
Step 10: Assert [data-testid="field-fullName"] value === "Second Version"
```

---

### E2E-009: Dark Mode — OS Preference & Toggle (F010)

**Maps to:** F010-AC1, F010-AC2, F010-AC3

```
Step 1:  Launch browser with colorScheme: 'dark' (Playwright media emulation)
Step 2:  Navigate to /builder
Step 3:  Assert <html> element has dark mode class or attribute (e.g., class contains "dark")
Step 4:  Assert [data-testid="preview-container"] computed background-color is white (rgb(255,255,255))
Step 5:  Click [data-testid="theme-toggle"]
Step 6:  Assert <html> dark class is removed (light mode active)
Step 7:  Assert URL has not changed (no page reload)
Step 8:  Click [data-testid="theme-toggle"] again
Step 9:  Assert dark class is restored
```

---

### E2E-010: Mobile Layout — Preview in Bottom Sheet (F002)

**Maps to:** F002-AC3

```
Step 1:  Set viewport to 375x812 (iPhone 14)
Step 2:  Navigate to /builder
Step 3:  Assert [data-testid="form-panel"] is visible
Step 4:  Assert [data-testid="preview-panel"] is NOT visible or is off-screen
Step 5:  Tap the mobile preview button or "Preview" tab
Step 6:  Assert preview content is visible
Step 7:  Assert resume data (or placeholder) appears in preview
```

---

### E2E-011: Currently Working Toggle Hides End Date / Shows "Present" (F001)

**Maps to:** F001-AC6

```
Step 1:  Navigate to /builder
Step 2:  Click [data-testid="add-experience-btn"]
Step 3:  Assert endDate input is visible
Step 4:  Check [data-testid="currently-working-checkbox"]
Step 5:  Assert endDate input is no longer visible (display:none or removed from DOM)
Step 6:  Fill jobTitle = "Engineer", company = "Corp", startDate = "2022-01"
Step 7:  Assert preview contains "Present" text
Step 8:  Uncheck [data-testid="currently-working-checkbox"]
Step 9:  Assert endDate input is visible again
```

---

### E2E-012: Experience Drag-and-Drop Reorder (F001)

**Maps to:** F001-AC3

```
Step 1:  Navigate to /builder
Step 2:  Add experience A: jobTitle = "Job A", company = "Company A", startDate = "2020-01"
Step 3:  Add experience B: jobTitle = "Job B", company = "Company B", startDate = "2018-01"
Step 4:  Assert preview shows "Job A" before "Job B" (initial order)
Step 5:  Drag [data-testid="drag-handle-{id_A}"] below entry B
Step 6:  Assert preview now shows "Job B" before "Job A"
Step 7:  Assert form also reflects the new order
```

---

### E2E-013: Template Gallery Page (F003)

**Maps to:** F003-AC1, and landing F006

```
Step 1:  Navigate to /templates
Step 2:  Assert all 5 template names visible: Modern, Classic, Minimal, Creative, Professional
Step 3:  Assert each has a "Use This Template" button or link
Step 4:  Click "Use This Template" for "Classic"
Step 5:  Assert URL navigates to /builder (with or without ?template=classic param)
Step 6:  Assert template is set to "classic" in the builder
```

---

### E2E-014: Invalid Email Inline Validation (F001)

**Maps to:** F001-AC5

```
Step 1:  Navigate to /builder
Step 2:  Click [data-testid="field-email"]
Step 3:  Type "not-an-email"
Step 4:  Press Tab (blur the field)
Step 5:  Assert inline error message is visible near the email field
Step 6:  Clear field, type "valid@email.com", press Tab
Step 7:  Assert error message is no longer visible
```

---

### E2E-015: No Paywall / No Account / No Email Gate (MON-1)

**Maps to:** SPEC §5 Monetization "What We Will Never Do"

```
Step 1:  Navigate to /
Step 2:  Assert no <input type="email"> present (no email collection)
Step 3:  Assert no payment-related text ("credit card", "billing", "subscribe", "trial")
Step 4:  Navigate to /builder
Step 5:  Click [data-testid="download-pdf-btn"] after filling required fields
Step 6:  Assert download happens without any modal, paywall, or login prompt
Step 7:  Assert no interstitial or overlay appears before or after download
```

---

## 5. Property-Based Test Candidates

> Use [`fast-check`](https://github.com/dubzzz/fast-check) with Vitest.

### 5.1 Schema Validation

| ID | Invariant | Generator |
|---|---|---|
| `PB-001` | Any object produced by the resumeSchema defaults passes re-validation | `fc.record()` of valid fields |
| `PB-007` | Schema rejects `fullName` with length > 100 | `fc.string({ minLength: 101, maxLength: 200 })` |
| `PB-008` | Schema accepts any valid hex color `#[0-9a-fA-F]{6}` | `fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => '#' + h)` |

### 5.2 Serialization Round-Trips

| ID | Invariant | Generator |
|---|---|---|
| `PB-002` | `exportAsJSON` → `importFromJSON` is identity for any valid resume | Arbitrary valid resume in store |
| `PB-003` | `encodeResumeData` → `decodeResumeData` is identity | Arbitrary JSON-serializable object |
| `PB-004` | `encodeResumeForURL` → `decodeResumeFromURL` is identity | Arbitrary object both below and above 8192 bytes |
| `PB-005` | `encodeResumeForURL` output never contains `+`, `/`, or `=` | Arbitrary object |
| `PB-006` | `generateShareableURL` → `loadFromShareableURL` restores data | Arbitrary valid resume |

### 5.3 Store Invariants

| ID | Invariant | Generator |
|---|---|---|
| `PB-009` | `pushHistory` never results in `pastStates.length > MAX_UNDO_HISTORY` | `fc.array(validResume, { minLength: 51, maxLength: 200 })` |
| `PB-010` | `reorderExperiences(ids)` preserves all valid entries, drops none | Any permutation of existing IDs |
| `PB-011` | After N undos followed by N redos, resume equals original | N random mutations then N undos/redos |

### 5.4 URL Codec Safety

| ID | Invariant | Generator |
|---|---|---|
| `PB-012` | Any valid resume data encodes to a non-empty string | Valid resume objects |
| `PB-013` | Corrupt encoded strings always return `null`, never throw | `fc.string()` (arbitrary garbage) |

---

## 6. Per-Module Coverage Targets

| Module | Unit Target | Component Target | Notes |
|---|---|---|---|
| `src/lib/schemas/resume-schema.ts` | **100%** | N/A | Pure Zod — every branch testable |
| `src/lib/sharing/url-codec.ts` | **100%** | N/A | Pure codec — both prefixes, both error paths |
| `src/lib/constants.ts` | **100%** | N/A | Static — verify exact values |
| `src/lib/cn.ts` | **100%** | N/A | Trivial utility |
| `src/store/resume-store.ts` | **95%** | N/A | All store methods; SSR guard branches |
| `src/hooks/use-auto-save.ts` | **90%** | N/A | Debounce + error path |
| `src/hooks/use-pdf-generator.ts` | **90%** | N/A | Validation paths; PDF mocked |
| `src/hooks/use-shareable-link.ts` | **90%** | N/A | Clipboard success/fail |
| `src/hooks/use-keyboard-shortcuts.ts` | **90%** | N/A | Input-focus guard branches |
| `src/hooks/use-resume-list.ts` | **85%** | N/A | CRUD for multiple resumes |
| `src/hooks/use-media-query.ts` | **80%** | N/A | matchMedia mock |
| `src/lib/pdf/generate-pdf.ts` | **80%** | N/A | Canvas mocked; filename/multi-page logic |
| `src/components/builder/sections/*` | N/A | **85%** | All 6 form sections |
| `src/components/builder/builder-toolbar.tsx` | N/A | **85%** | Template select, download, share, import |
| `src/components/builder/preview-panel.tsx` | N/A | **80%** | Preview container present |
| `src/components/builder/builder-layout.tsx` | N/A | **80%** | Desktop/mobile layout |
| `src/components/templates/*` | N/A | **90%** | All 5 templates × full + empty data |
| `src/components/landing/*` | N/A | **80%** | Hero copy, CTA, trust signals |
| `src/components/shared/theme-toggle.tsx` | N/A | **85%** | Toggle changes theme |
| `src/components/ui/color-picker.tsx` | N/A | **85%** | 12 presets, hex input, contrast warning |
| `src/components/preview/preview-viewer.tsx` | N/A | **85%** | Valid/invalid hash, read-only |
| `src/components/builder/resume-list-panel.tsx` | N/A | **80%** | List display, delete confirmation |
| `src/app/page.tsx` | N/A | **75%** | Landing page (RSC) |
| `src/app/builder/page.tsx` | N/A | **75%** | Builder mount, localStorage init |
| `src/app/preview/page.tsx` | N/A | **75%** | Hash decoding on mount |
| `src/app/templates/page.tsx` | N/A | **75%** | Gallery renders all 5 |
| **Overall project** | | **≥ 85%** | Combined line/branch coverage |

---

## 7. Acceptance Criteria Coverage Matrix

Every acceptance criterion from SPEC.md §3 is mapped here.

| Spec AC | Acceptance Criterion | Covering Tests |
|---|---|---|
| **F001-AC1** | Preview updates within 200ms on any field input | `PIF-003`, `E2E-002` Step 3 |
| **F001-AC2** | "Add Experience" appends new empty form | `EXF-002`, `ST-020`, `E2E-002` Steps 5–6 |
| **F001-AC3** | Drag reorder updates form and preview | `EXF-007`, `E2E-012` |
| **F001-AC4** | Download gated on `fullName` + `email` | `PG-002`, `PG-003`, `E2E-003` |
| **F001-AC5** | Invalid email format → inline error on blur | `PIF-004`, `E2E-014` |
| **F001-AC6** | "Currently Working" hides endDate / shows "Present" | `EXF-004`, `E2E-011` |
| **F002-AC1** | Preview re-renders within 200ms | `PP-002`, `E2E-002` Step 3 |
| **F002-AC2** | Desktop (≥1024px): side-by-side layout | `BL-001` |
| **F002-AC3** | Mobile (<768px): bottom sheet / full-screen preview | `BL-002`, `BL-003`, `E2E-010` |
| **F002-AC4** | Preview identical to downloaded PDF layout | `E2E-002` (visual assertion) |
| **F003-AC1** | Clicking template thumbnail switches preview immediately | `TB-002`, `E2E-004` |
| **F003-AC2** | All sections render correctly in each template | `TR-001..025` |
| **F003-AC3** | ATS text extractable | *Known gap — see §10* |
| **F003-AC4** | Template switch preserves resume data | `PP-004`, `E2E-004` Step c |
| **F003-AC5** | Multi-page content flows to second page | `PDF-003` |
| **F004-AC1** | PDF downloads within 2 seconds | `E2E-002` (timing), `PG-006` |
| **F004-AC2** | PDF layout matches preview | `E2E-002` (layout diff) |
| **F004-AC3** | Zero HTTP requests during PDF generation | `E2E-002` Steps 10–13 |
| **F004-AC4** | Text selectable in PDF | *Known gap — see §10* |
| **F004-AC5** | Filename: `{FullName}_Resume.pdf` | `PG-005`, `PDF-005`, `E2E-002` Step 12 |
| **F005-AC1** | Auto-save triggers after 1s debounce | `AS-002`, `AS-003` |
| **F005-AC2** | Data restored on return visit | `ST-051`, `E2E-005` Steps 4–6 |
| **F005-AC3** | Toast on localStorage failure | `AS-006`, `ST-055` |
| **F005-AC4** | Confirmation before clearing data | `E2E-005` Steps 7–11, `RL-003..005` |
| **F006-AC1** | Hero heading "Free Resume Builder — No Paywall, No Tricks" | `LP-001`, `E2E-001` Step 3 |
| **F006-AC2** | ≥ 3 anti-paywall messages | `LP-003`, `E2E-001` Step 6 |
| **F006-AC3** | "Build Your Resume — It's Free" CTA above fold | `LP-002`, `E2E-001` Steps 7–8 |
| **F006-AC4** | LCP < 2.5s | Lighthouse CI (pipeline step) |
| **F006-AC5** | Meta tags target relevant keywords | `E2E-001` Steps 4–5 |
| **F007-AC1** | "Share" generates URL-safe encoded URL | `SL-001`, `E2E-006` Steps 5–9 |
| **F007-AC2** | URL opens read-only preview with all data | `PV-001`, `E2E-006` Steps 10–11 |
| **F007-AC3** | Data > 8KB uses pako compression | `UC-002`, `UC-008`, `PB-004` |
| **F007-AC4** | Preview shows "Build Your Own" CTA | `PV-004`, `E2E-006` Step 13 |
| **F007-AC5** | No data sent to server (fragment encoding) | `SL-006`, `E2E-006` Step 14 |
| **F008-AC1** | Export JSON is valid | `ST-060`, `ST-061`, `E2E-007` Steps 3–6 |
| **F008-AC2** | Import valid JSON restores data | `ST-063`, `E2E-007` Steps 8–9 |
| **F008-AC3** | Invalid JSON → error toast, no overwrite | `ST-064`, `ST-065`, `E2E-007` Steps 10–12 |
| **F008-AC4** | Exported JSON conforms to resume schema | `ST-061`, `PB-002` |
| **F009-AC1** | Print hides UI chrome | `E2E-011` (Playwright print simulation) |
| **F009-AC2** | Print margins match PDF | `E2E-011` |
| **F010-AC1** | OS dark mode preference applied on load | `E2E-009` Steps 1–3 |
| **F010-AC2** | Preview always white background in dark mode | `TT-003`, `E2E-009` Step 4 |
| **F010-AC3** | Toggle changes theme without page reload | `TT-002`, `E2E-009` Steps 5–7 |
| **F011-AC1** | "New Resume" creates second without losing first | `RL-002`, `E2E-005` Steps 7–11 |
| **F011-AC2** | Resume list shows name, template, last-modified | `RL-001` |
| **F011-AC3** | Delete shows confirmation dialog | `RL-003`, `RL-004`, `RL-005` |
| **F012-AC1** | Color picker shows 12 presets + hex input | `CP-001`, `CP-003`, `TB-010` |
| **F012-AC2** | Color updates all accent elements in preview | `CP-002`, `TR-026..030` |
| **F012-AC3** | Low-contrast color warning (< 3:1 against white) | `CP-004`, `CP-005` |
| **F013-AC1** | Ctrl+Z reverts last change | `KS-001`, `E2E-008` Steps 6–8 |
| **F013-AC2** | Ctrl+Shift+Z re-applies undone change | `KS-005`, `E2E-008` Steps 9–10 |
| **F013-AC3** | Undo stack capped at 50 entries | `ST-087`, `PB-009` |
| **NFR-PERF-LCP** | LCP < 2.5s on 4G | Lighthouse CI |
| **NFR-PERF-INP** | INP < 200ms for all interactions | Lighthouse CI |
| **NFR-PERF-CLS** | CLS < 0.1 | Lighthouse CI |
| **NFR-PERF-BUNDLE** | Bundle < 250KB initial JS | `next build` bundle analysis in CI |
| **NFR-A11Y-LABELS** | All inputs have visible labels (not just placeholders) | `PIF-002` (RTL `getByLabelText`) |
| **NFR-A11Y-CONTRAST** | WCAG 2.2 AA contrast ratios | `CP-004`, Lighthouse Accessibility ≥ 90 |
| **NFR-A11Y-KEYBOARD** | Full keyboard navigation | `KS-001..009`, Playwright keyboard-only run |
| **NFR-SEC-NO-DANGERHTML** | No `dangerouslySetInnerHTML` | Static code audit in CI: `grep -r dangerouslySetInnerHTML src/` exits non-zero if found |
| **NFR-SEC-CSP** | CSP headers configured | Playwright response header assertion |
| **NFR-SEC-XFRAME** | X-Frame-Options: DENY | Response header assertion |
| **NFR-SEC-NOSERVER** | Resume data never sent to server | Network intercept in all E2E specs |
| **NFR-SEO-SSR** | Server-rendered landing + templates pages | Playwright: page HTML before JS contains content |
| **MON-NOPAYWALL** | No paywall, email gate, or payment form | `LP-007`, `E2E-015` |
| **MON-AFFILIATE** | Affiliate links present in footer | `LP-006` |
| **MON-NOINTERSTITIAL** | No interstitials/pop-ups before PDF download | `E2E-002`, `E2E-015` |

---

## 8. Test Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
      exclude: [
        'src/components/ui/**',   // Radix UI wrappers (library code, not our logic)
        'src/test/**',
        '**/*.d.ts',
        '**/node_modules/**',
      ],
    },
  },
})
```

### Playwright Config (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './tests/specs',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium',      use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',       use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',        use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

### Mock Strategy Summary

| Dependency | Mock Approach |
|---|---|
| `localStorage` | `vi.stubGlobal('localStorage', createLocalStorageMock())` in `src/test/setup.ts` |
| `html2canvas` | `vi.mock('html2canvas')` → returns stub canvas with `toDataURL()` |
| `jspdf` | `vi.mock('jspdf')` → captures constructor args, `addImage`, `save` calls |
| `pako` | **Not mocked** — test actual compress/decompress behavior |
| `navigator.clipboard` | `vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })` |
| `window.location` | `Object.defineProperty(window, 'location', { value: { origin: 'http://localhost:3000', hash: '' } })` |
| `Date.now()` / system time | `vi.setSystemTime(new Date('2024-01-15'))` for deterministic timestamps |
| `Math.random()` | `vi.spyOn(Math, 'random').mockReturnValue(0.123456)` for deterministic IDs |
| File downloads (E2E) | Playwright `page.waitForEvent('download')` |
| Clipboard (E2E) | Playwright `page.evaluate(() => navigator.clipboard.readText())` |

---

## 9. CI Integration

```yaml
# .github/workflows/test.yml
jobs:
  unit-and-component:
    steps:
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test -- --run --coverage
      # Fails if coverage < thresholds in vitest.config.ts

  build-and-e2e:
    needs: unit-and-component
    steps:
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  lighthouse:
    needs: build-and-e2e
    steps:
      - run: npx lhci autorun
      # Assert: performance ≥ 90, accessibility ≥ 90, seo ≥ 90, best-practices ≥ 90

  bundle-check:
    steps:
      - run: npm run build
      - run: node scripts/check-bundle-size.js
      # Assert: initial JS < 250KB gzipped (excludes lazy-loaded jsPDF/pako/html2canvas)

  security-audit:
    steps:
      - run: npm audit --audit-level=high
      - run: |
          if grep -r "dangerouslySetInnerHTML" src/; then
            echo "dangerouslySetInnerHTML found — FAIL"; exit 1
          fi
```

---

## 10. Known Limitations & Documented Gaps

| Gap ID | Description | Spec AC | Risk | Recommended Mitigation |
|---|---|---|---|---|
| `GAP-001` | **PDF text not selectable.** `generate-pdf.ts` uses `toDataURL('image/jpeg')` — text is rasterized as a JPEG image, not a text layer. F004-AC4 ("all text selectable and copyable") **cannot pass** with current implementation. | F004-AC4, F003-AC3 | High | Switch to jsPDF's `text()` API for each template section, or use a React-PDF-based approach that generates proper PDF text. Document as P1 tech debt item. |
| `GAP-002` | **ATS text extraction.** Same root cause as GAP-001. ATS scanners cannot extract text from a JPEG-embedded PDF. | F003-AC3 | High | Same as GAP-001. |
| `GAP-003` | **Real 200ms preview timing in E2E.** CI machines have variable performance. The 200ms INP target (F002-AC1) is tested via unit fake-timers but cannot be reliably asserted at millisecond precision in E2E. | F002-AC1 | Medium | Assert in unit tests (mock timers). E2E uses `waitForFunction` with 500ms tolerance. Add Lighthouse INP measurement in CI. |
| `GAP-004` | **Print styles (F009) simulation fidelity.** `page.pdf()` in Playwright uses Chromium's headless print renderer, which may differ from a user's actual browser print dialog (especially Safari). | F009-AC1, F009-AC2 | Low | Supplement with manual QA checklist on Chrome/Safari/Firefox print preview before each release. |
| `GAP-005` | **Drag-and-drop E2E reliability.** DnD Kit interactions via Playwright's `dragAndDrop()` can be flaky depending on the drag implementation. | F001-AC3 | Medium | Verify store state (not just visual order) after drag. Add retry logic. Consider exposing a test-only `reorderExperiences` action trigger. |
| `GAP-006` | **Clipboard E2E in Firefox/WebKit.** `navigator.clipboard.readText()` requires user gesture permissions that Playwright cannot always grant in Firefox and WebKit. | F007-AC1 | Medium | Capture the URL from the toast notification text instead of clipboard in those browsers. |
| `GAP-007` | **Visual PDF-preview pixel parity (F002-AC4).** "Pixel-for-pixel identical" is aspirational — fonts, sub-pixel rendering, and JPEG compression introduce differences. | F002-AC4 | Medium | Use Playwright visual comparison with ≥5% threshold tolerance, or compare structural content rather than pixel diff. |
