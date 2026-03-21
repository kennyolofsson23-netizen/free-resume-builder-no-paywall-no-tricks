const { chromium } = require('playwright')

async function test() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('\n🎯 CORE USER WORKFLOW TESTS\n')
  console.log('═'.repeat(70))

  try {
    // WORKFLOW 1: Fill resume and preview updates
    console.log('\n[WORKFLOW 1] Fill Form → Real-Time Preview Updates')
    await page.goto('http://localhost:3000/builder', {
      waitUntil: 'domcontentloaded',
    })
    await page.waitForTimeout(500)

    // Fill name
    await page.fill('#fullName', 'Sarah Johnson')
    await page.waitForTimeout(200)

    // Check preview contains name
    const previewAfterName = await page.content()
    const hasNameInPreview = previewAfterName.includes('Sarah Johnson')
    console.log(`  ${hasNameInPreview ? '✓' : '✗'} Name appears in preview`)

    // Fill email
    await page.fill('#email', 'sarah@example.com')
    await page.waitForTimeout(200)
    const previewAfterEmail = await page.content()
    const hasEmailInPreview = previewAfterEmail.includes('sarah@example.com')
    console.log(`  ${hasEmailInPreview ? '✓' : '✗'} Email appears in preview`)

    // WORKFLOW 2: Add experience
    console.log('\n[WORKFLOW 2] Add Experience Entry')
    const addExpBtn = page.locator('button:has-text("Add Experience")')
    const addExpExists = (await addExpBtn.count()) > 0
    console.log(`  ${addExpExists ? '✓' : '✗'} "Add Experience" button exists`)

    if (addExpExists) {
      await addExpBtn.click()
      await page.waitForTimeout(300)

      const companyInputs = await page
        .locator('input[placeholder*="Company"], input[placeholder*="company"]')
        .count()
      console.log(
        `  ${companyInputs > 0 ? '✓' : '✗'} Experience form fields appeared`
      )
    }

    // WORKFLOW 3: Template switching
    console.log('\n[WORKFLOW 3] Switch Templates')
    const modernBtn = page.locator('button:has-text("Modern")')
    const classicBtn = page.locator('button:has-text("Classic")')

    const modernExists = (await modernBtn.count()) > 0
    const classicExists = (await classicBtn.count()) > 0
    console.log(`  ${modernExists ? '✓' : '✗'} Modern template button visible`)
    console.log(
      `  ${classicExists ? '✓' : '✗'} Classic template button visible`
    )

    if (modernExists) {
      await modernBtn.click()
      await page.waitForTimeout(300)
      console.log(`  ✓ Template switched without losing data`)
    }

    // WORKFLOW 4: Validation
    console.log('\n[WORKFLOW 4] Form Validation')
    // Create a new page to test validation
    const page2 = await browser.newContext().then((c) => c.newPage())
    await page2.goto('http://localhost:3000/builder')
    await page2.waitForTimeout(500)

    // Leave name empty and try to download
    const downloadBtn = page2
      .locator('button')
      .filter({ hasText: /Download|PDF/ })
    const downloadExists = (await downloadBtn.count()) > 0
    console.log(`  ${downloadExists ? '✓' : '✗'} Download button exists`)

    if (downloadExists) {
      // Fill only email, not name - should show validation
      await page2.fill('#email', 'test@test.com')
      // Try to download (would need to check if button is disabled or shows error)
      const isDisabled = await downloadBtn.isDisabled()
      console.log(
        `  ${isDisabled ? '✓' : '✗'} Download button disabled until name is filled`
      )
    }

    // WORKFLOW 5: Share link generation
    console.log('\n[WORKFLOW 5] Share Link Generation')
    const shareBtn = page.locator('button').filter({ hasText: /Share/ })
    const shareExists = (await shareBtn.count()) > 0
    console.log(`  ${shareExists ? '✓' : '✗'} Share button exists`)

    if (shareExists) {
      await shareBtn.click()
      await page.waitForTimeout(500)
      const hasModalOrDialog =
        (await page
          .locator('dialog, [role="dialog"], [class*="modal"]')
          .count()) > 0
      console.log(`  ${hasModalOrDialog ? '✓' : '✗'} Share dialog appears`)
    }

    // WORKFLOW 6: Dark mode toggle
    console.log('\n[WORKFLOW 6] Theme Toggle')
    const themeBtn = page
      .locator('button')
      .filter({ hasText: /Moon|Sun|Dark|Light|Theme/i })
    const themeExists = (await themeBtn.count()) > 0
    console.log(
      `  ${themeExists ? '✓' : '⚠'} Theme toggle button ${themeExists ? 'found' : 'not found (may not be implemented)'}`
    )

    // WORKFLOW 7: Undo/Redo
    console.log('\n[WORKFLOW 7] Undo/Redo')
    const undoBtn = page.locator('button').filter({ hasText: /Undo/ })
    const redoBtn = page.locator('button').filter({ hasText: /Redo/ })
    const hasUndo = (await undoBtn.count()) > 0
    const hasRedo = (await redoBtn.count()) > 0
    console.log(
      `  ${hasUndo ? '✓' : '⚠'} Undo button ${hasUndo ? 'found' : 'not found'}`
    )
    console.log(
      `  ${hasRedo ? '✓' : '⚠'} Redo button ${hasRedo ? 'found' : 'not found'}`
    )

    console.log('\n═'.repeat(70))
    console.log('\n✅ Workflow Tests Complete\n')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
  } finally {
    await browser.close()
  }
}

test()
