/**
 * E2E tests for the Shareable Preview page (/preview#<encoded-data>)
 *
 * Covers:
 * 1. No hash → invalid/error state is shown
 * 2. Invalid/garbage hash → error state is shown with a "Build Your Own" CTA
 * 3. Valid encoded resume hash → resume preview is shown
 * 4. Correct resume data (name, job title, skills) appears in the preview
 * 5. "Build Your Own Resume" / "Use This Template" CTA is present
 * 6. Templates page link present in the preview CTA
 */
import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helpers — build encoded hashes for test resumes
// ---------------------------------------------------------------------------

/**
 * A minimal schema-valid resume object.
 * The preview page decodes these from the URL hash.
 */
const sampleResume = {
  id: 'e2e-preview-1',
  template: 'modern' as const,
  personalInfo: {
    fullName: 'Preview E2E User',
    email: 'e2e@example.com',
    phone: '555-0199',
    location: 'Portland, OR',
    website: '',
    linkedin: '',
    github: '',
    summary: 'A test engineer verifying the preview page.',
  },
  experiences: [
    {
      id: 'exp-e2e-1',
      jobTitle: 'E2E Test Engineer',
      company: 'Playwright Inc',
      location: 'Remote',
      startDate: '2022-01',
      endDate: '',
      currentlyWorking: true,
      description: 'Writing automated tests for resume previews.',
    },
  ],
  education: [
    {
      id: 'edu-e2e-1',
      school: 'State University',
      degree: 'BS',
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: '',
    },
  ],
  skills: [
    { id: 'skill-e2e-1', name: 'Playwright', level: 'expert' as const },
    { id: 'skill-e2e-2', name: 'TypeScript', level: 'advanced' as const },
  ],
  projects: [],
  certifications: [],
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

/** Encode a resume object as a plain base64url hash (no compression). */
function encodeResumeAsHash(resume: object): string {
  const json = JSON.stringify(resume)
  // Simple base64 encoding (matching what the store's generateShareableURL does)
  const encoded = btoa(unescape(encodeURIComponent(json)))
  return encoded
}

// Pre-compute the hash for use in tests
const validHash = encodeResumeAsHash(sampleResume)

// ---------------------------------------------------------------------------
// No hash — invalid state
// ---------------------------------------------------------------------------

test.describe('Preview Page — no hash', () => {
  test('shows error state when there is no hash fragment', async ({ page }) => {
    await page.goto('/preview')
    // Wait for loading to finish
    await page.waitForLoadState('networkidle')

    // Should show the "didn't work" error heading
    await expect(
      page.getByRole('heading', { name: /share link didn't work/i })
    ).toBeVisible()
  })

  test('shows a CTA to build a resume when no hash present', async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')

    const cta = page.getByRole('link', { name: /build your own resume/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/builder')
  })
})

// ---------------------------------------------------------------------------
// Invalid hash — graceful error
// ---------------------------------------------------------------------------

test.describe('Preview Page — invalid hash', () => {
  test('shows error state for garbage hash', async ({ page }) => {
    await page.goto('/preview#!!!this-is-not-valid!!!')
    await page.waitForLoadState('networkidle')

    await expect(
      page.getByRole('heading', { name: /share link didn't work/i })
    ).toBeVisible()
  })

  test('shows error state for valid base64 but invalid schema data', async ({
    page,
  }) => {
    // Valid base64 but the JSON inside fails resumeSchema validation
    const badData = btoa(JSON.stringify({ not: 'a resume' }))
    await page.goto(`/preview#${badData}`)
    await page.waitForLoadState('networkidle')

    await expect(
      page.getByRole('heading', { name: /share link didn't work/i })
    ).toBeVisible()
  })

  test('invalid state includes a link to /builder', async ({ page }) => {
    await page.goto('/preview#AAAA')
    await page.waitForLoadState('networkidle')

    const builderLink = page.getByRole('link', { name: /build your own resume/i })
    await expect(builderLink).toHaveAttribute('href', '/builder')
  })
})

// ---------------------------------------------------------------------------
// Valid hash — resume is shown
// ---------------------------------------------------------------------------

test.describe('Preview Page — valid encoded resume', () => {
  test('renders the resume preview for a valid hash', async ({ page }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')

    // Should NOT show the error heading
    await expect(
      page.getByRole('heading', { name: /share link didn't work/i })
    ).not.toBeVisible()
  })

  test("shows the resume owner's full name", async ({ page }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Preview E2E User').first()).toBeVisible()
  })

  test('shows the job title from experience', async ({ page }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/E2E Test Engineer/i).first()).toBeVisible()
  })

  test('shows the company name from experience', async ({ page }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/Playwright Inc/i).first()).toBeVisible()
  })

  test('shows a skill name in the preview', async ({ page }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Playwright').first()).toBeVisible()
  })

  test('shows school name from education', async ({ page }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/State University/i).first()).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// Preview CTA (anti-paywall CTA shown to viewers)
// ---------------------------------------------------------------------------

test.describe('Preview Page — Preview CTA', () => {
  test('shows a CTA to build own resume or use same template', async ({
    page,
  }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')

    // Should show a CTA linking to the builder
    const builderLinks = page.getByRole('link', { name: /build|use this template|create/i })
    await expect(builderLinks.first()).toBeVisible()
  })

  test('CTA links to /builder or /builder?template=modern', async ({ page }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')

    const builderLinks = await page
      .getByRole('link')
      .filter({ hasText: /build|use this template|create/i })
      .all()

    expect(builderLinks.length).toBeGreaterThan(0)

    for (const link of builderLinks) {
      const href = await link.getAttribute('href')
      expect(href).toMatch(/\/builder/)
    }
  })

  test('page title includes Resume Preview', async ({ page }) => {
    await page.goto(`/preview#${validHash}`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/resume preview/i)
  })
})

// ---------------------------------------------------------------------------
// Preview Page — different templates
// ---------------------------------------------------------------------------

test.describe('Preview Page — template variants', () => {
  const templates = ['classic', 'minimal', 'creative', 'professional'] as const

  for (const template of templates) {
    test(`renders ${template} template preview`, async ({ page }) => {
      const hash = encodeResumeAsHash({ ...sampleResume, id: `e2e-${template}`, template })
      await page.goto(`/preview#${hash}`)
      await page.waitForLoadState('networkidle')

      // The name should appear regardless of template
      await expect(page.getByText('Preview E2E User').first()).toBeVisible()
    })
  }
})
