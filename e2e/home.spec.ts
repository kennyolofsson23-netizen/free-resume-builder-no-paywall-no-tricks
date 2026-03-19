import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Free Resume Builder/)
  })

  test('should display the hero section', async ({ page }) => {
    await page.goto('/')
    const heading = page.getByRole('heading', {
      name: /Free Resume Builder/i,
    })
    await expect(heading).toBeVisible()
  })

  test('should have a start building button', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('link', { name: /Start Building/i })
    await expect(button).toBeVisible()
  })

  test('should navigate to builder page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Start Building/i }).click()
    await expect(page).toHaveURL('/builder')
  })

  test('should display features section', async ({ page }) => {
    await page.goto('/')
    // h2 heading in the FeatureGrid section
    const heading = page.getByRole('heading', {
      name: /job seekers|burned before|free resume|everything you need/i,
    })
    await expect(heading).toBeVisible()
  })
})
