/**
 * E2E tests for the Template Gallery page (/templates)
 *
 * Covers:
 * 1. Page loads and shows an h1 heading
 * 2. All 5 template sections are rendered
 * 3. Each template has a "Use This Template" CTA linking to /builder?template=…
 * 4. Anti-paywall messaging is present on the page
 * 5. Navigation links (Builder, Home) are accessible from this page
 * 6. Template previews render sample resume data (Alex Johnson)
 * 7. Page title contains "Templates"
 */
import { test, expect } from '@playwright/test'

const TEMPLATE_IDS = ['modern', 'classic', 'minimal', 'creative', 'professional'] as const

// ---------------------------------------------------------------------------
// Page load
// ---------------------------------------------------------------------------

test.describe('Templates Page — load', () => {
  test('loads the /templates page successfully', async ({ page }) => {
    await page.goto('/templates')
    await expect(page).toHaveURL('/templates')
  })

  test('page title contains "Templates"', async ({ page }) => {
    await page.goto('/templates')
    await expect(page).toHaveTitle(/templates/i)
  })

  test('renders an h1 heading', async ({ page }) => {
    await page.goto('/templates')
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
  })

  test('h1 heading mentions templates or resume', async ({ page }) => {
    await page.goto('/templates')
    const h1 = page.getByRole('heading', { level: 1 })
    const text = await h1.textContent()
    expect(text?.toLowerCase()).toMatch(/template|resume/)
  })
})

// ---------------------------------------------------------------------------
// Template sections
// ---------------------------------------------------------------------------

test.describe('Templates Page — template sections', () => {
  test('renders exactly 5 template sections', async ({ page }) => {
    await page.goto('/templates')
    // Each template has an article with id="template-{id}"
    const sections = page.locator('article[id^="template-"]')
    await expect(sections).toHaveCount(5)
  })

  for (const id of TEMPLATE_IDS) {
    test(`renders article section for "${id}" template`, async ({ page }) => {
      await page.goto('/templates')
      const section = page.locator(`#template-${id}`)
      await expect(section).toBeVisible()
    })
  }

  test('renders at least 5 h2 template name headings', async ({ page }) => {
    await page.goto('/templates')
    const h2s = page.getByRole('heading', { level: 2 })
    const count = await h2s.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })
})

// ---------------------------------------------------------------------------
// Use This Template CTAs
// ---------------------------------------------------------------------------

test.describe('Templates Page — Use This Template CTAs', () => {
  test('renders 5 "Use This Template" CTA links', async ({ page }) => {
    await page.goto('/templates')
    const ctaLinks = page.getByRole('link', { name: /use this template/i })
    await expect(ctaLinks).toHaveCount(5)
  })

  for (const id of TEMPLATE_IDS) {
    test(`"Use This Template" for ${id} links to /builder?template=${id}`, async ({
      page,
    }) => {
      await page.goto('/templates')
      // Find the article for this template and look for the CTA inside it
      const section = page.locator(`#template-${id}`)
      const cta = section.getByRole('link', { name: /use this template/i })
      await expect(cta).toHaveAttribute('href', `/builder?template=${id}`)
    })
  }

  test('clicking "Use This Template" navigates to /builder', async ({
    page,
  }) => {
    await page.goto('/templates')
    const firstCta = page.getByRole('link', { name: /use this template/i }).first()
    await firstCta.click()
    await expect(page).toHaveURL(/\/builder/)
  })
})

// ---------------------------------------------------------------------------
// Sample data in previews
// ---------------------------------------------------------------------------

test.describe('Templates Page — preview sample data', () => {
  test('at least one preview shows "Alex Johnson"', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.getByText('Alex Johnson').first()).toBeVisible()
  })

  test('previews show a job title', async ({ page }) => {
    await page.goto('/templates')
    // The sample resume has "Senior Software Engineer" as job title
    await expect(
      page.getByText(/senior software engineer/i).first()
    ).toBeVisible()
  })

  test('scaled preview containers use CSS transform', async ({ page }) => {
    await page.goto('/templates')
    // Preview wrappers apply a CSS transform for scale
    const scaledEls = page.locator('[style*="transform: scale"]')
    const count = await scaledEls.count()
    expect(count).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// Anti-paywall messaging
// ---------------------------------------------------------------------------

test.describe('Templates Page — anti-paywall messaging', () => {
  test('page mentions Zety as a competitor', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.getByText(/zety/i).first()).toBeVisible()
  })

  test('page references no paywall', async ({ page }) => {
    await page.goto('/templates')
    const html = await page.content()
    expect(html.toLowerCase()).toMatch(/paywall|no paywall|free/)
  })

  test('page has at least one link to /builder', async ({ page }) => {
    await page.goto('/templates')
    const builderLinks = await page
      .getByRole('link')
      .filter({ hasAttribute: ['href', '/builder'] })
      .all()
    // Alternatively, just check any link with href starting with /builder
    const allLinks = page.locator('a[href^="/builder"]')
    const count = await allLinks.count()
    expect(count).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

test.describe('Templates Page — navigation', () => {
  test('has a navigation header visible', async ({ page }) => {
    await page.goto('/templates')
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('has a link back to the home page or brand name', async ({ page }) => {
    await page.goto('/templates')
    const homeLink = page.getByRole('link', { name: /free resume builder|home/i }).first()
    await expect(homeLink).toBeVisible()
  })

  test('has a link to the /builder page in the nav', async ({ page }) => {
    await page.goto('/templates')
    const builderLink = page.getByRole('link', { name: /^builder$/i }).first()
    await expect(builderLink).toBeVisible()
  })

  test('renders a footer', async ({ page }) => {
    await page.goto('/templates')
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
  })
})
