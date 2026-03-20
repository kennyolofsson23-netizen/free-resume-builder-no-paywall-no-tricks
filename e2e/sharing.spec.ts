/**
 * E2E tests for the Shareable Preview Link feature.
 *
 * Covers:
 * 1. /preview page renders without crashing (no hash)
 * 2. /preview page with a valid encoded hash loads and shows the resume
 * 3. /preview page with an invalid hash shows a graceful error/fallback
 * 4. Share button on /builder generates a URL that includes /preview#
 * 5. /preview page shows no account / no paywall CTA
 */
import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Encode a simple resume object the same way the app does (base64url, no compression).
 * Mirrors the store's generateShareableURL without the 'z:' codec for small payloads.
 */
function encodeSmallResume(resume: object): string {
  const json = JSON.stringify(resume)
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '/')
    .replace(/=/g, '')
}

/** Minimal schema-valid resume for sharing tests. */
const minimalResume = {
  id: 'e2e-share-test',
  template: 'modern',
  personalInfo: {
    fullName: 'Share Test User',
    email: 'share@e2etest.com',
    phone: '555-0199',
    location: 'Remote',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// ---------------------------------------------------------------------------
// /preview page — no hash
// ---------------------------------------------------------------------------

test.describe('Preview Page — no hash', () => {
  test('loads /preview without crashing', async ({ page }) => {
    await page.goto('/preview')
    // Should not show a 500 / server error
    await expect(page).not.toHaveURL(/error/i)
  })

  test('shows some UI when no hash is present', async ({ page }) => {
    await page.goto('/preview')
    // Should render at least a body element
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// /preview page — with a valid encoded hash (store base64 codec)
// ---------------------------------------------------------------------------

test.describe('Preview Page — valid encoded hash (store codec)', () => {
  test('loads a resume from a valid base64 hash and shows the name', async ({
    page,
  }) => {
    // Generate the URL the same way the store's generateShareableURL does
    const json = JSON.stringify(minimalResume)
    const encoded = btoa(unescape(encodeURIComponent(json)))
    await page.goto(`/preview#${encoded}`)

    // The person's name should appear in the rendered template
    await expect(page.getByText('Share Test User').first()).toBeVisible()
  })

  test('shows the resume email in the preview', async ({ page }) => {
    const json = JSON.stringify(minimalResume)
    const encoded = btoa(unescape(encodeURIComponent(json)))
    await page.goto(`/preview#${encoded}`)

    await expect(page.getByText('share@e2etest.com').first()).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// /preview page — graceful handling of invalid hash
// ---------------------------------------------------------------------------

test.describe('Preview Page — invalid hash', () => {
  test('does not crash on a completely invalid hash', async ({ page }) => {
    await page.goto('/preview#this-is-not-valid-base64!!!')
    // Page should still load
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('does not crash on a hash that decodes to non-resume JSON', async ({
    page,
  }) => {
    const badHash = btoa(JSON.stringify({ foo: 'bar' }))
    await page.goto(`/preview#${badHash}`)
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// /preview page — no-account, no-paywall CTA
// ---------------------------------------------------------------------------

test.describe('Preview Page — no-account CTA', () => {
  test('shows a link or button to build a resume for free', async ({
    page,
  }) => {
    const json = JSON.stringify(minimalResume)
    const encoded = btoa(unescape(encodeURIComponent(json)))
    await page.goto(`/preview#${encoded}`)

    // The page should invite the viewer to create their own resume
    const cta = page
      .getByRole('link', { name: /build.*resume|create.*resume|free/i })
      .first()
    await expect(cta).toBeVisible()
  })

  test('has a download PDF button or link on the preview page', async ({
    page,
  }) => {
    const json = JSON.stringify(minimalResume)
    const encoded = btoa(unescape(encodeURIComponent(json)))
    await page.goto(`/preview#${encoded}`)

    const downloadElement = page
      .getByRole('button', { name: /download/i })
      .or(page.getByRole('link', { name: /download/i }))
      .first()

    await expect(downloadElement).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// /builder Share button — generates a /preview URL
// ---------------------------------------------------------------------------

test.describe('Builder — Share button copies a /preview URL', () => {
  test('clicking Share button copies a URL to clipboard', async ({
    page,
    context,
    browserName,
  }) => {
    // Firefox doesn't support clipboard-read; WebKit doesn't support clipboard-write.
    // Clipboard permission granting is only fully supported in Chromium.
    test.skip(
      browserName !== 'chromium',
      'Clipboard permissions only fully supported in Chromium'
    )
    // Grant clipboard permissions so the hook can write
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.goto('/builder')

    // Fill in at least name and email (required for the share URL to be generated)
    await page.getByLabel(/full name/i).fill('Clipboard User')
    await page.getByLabel(/email/i).fill('clipboard@test.com')

    const shareBtn = page
      .getByRole('button', { name: /share/i })
      .or(page.getByRole('button', { name: /copy link/i }))
      .first()

    await shareBtn.click()

    // Give the async clipboard write time to complete
    await page.waitForTimeout(500)

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    )

    expect(clipboardText).toContain('/preview#')
    expect(clipboardText).toContain(page.url().split('/')[2]) // same origin
  })
})

// ---------------------------------------------------------------------------
// /preview page — template switching via URL
// ---------------------------------------------------------------------------

test.describe('Preview Page — template from URL hash', () => {
  const templates = [
    'modern',
    'classic',
    'minimal',
    'creative',
    'professional',
  ] as const

  for (const template of templates) {
    test(`loads ${template} template from hash`, async ({ page }) => {
      const resume = { ...minimalResume, template }
      const json = JSON.stringify(resume)
      const encoded = btoa(unescape(encodeURIComponent(json)))
      await page.goto(`/preview#${encoded}`)

      // The name should still be visible regardless of template
      await expect(page.getByText('Share Test User').first()).toBeVisible()
    })
  }
})
