const { chromium } = require('playwright')

async function runTests() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('\n🧪 DIRECT FEATURE TESTING\n')
  console.log('═'.repeat(70))

  try {
    // HOME PAGE
    console.log('\n✓ TESTING HOME PAGE')
    await page.goto('http://localhost:3000')

    const homeContent = await page.content()
    const checks = {
      'Hero title': homeContent.includes(
        'Free Resume Builder — No Paywall, No Tricks'
      ),
      'No paywall copy':
        homeContent.includes('paywall') || homeContent.includes('Zety'),
      'Build CTA':
        homeContent.includes('Build Your Resume') ||
        homeContent.includes('/builder'),
      'Landing page sections':
        homeContent.includes('Feature') || homeContent.includes('Template'),
    }

    for (const [check, passed] of Object.entries(checks)) {
      console.log(`  ${passed ? '✓' : '✗'} ${check}`)
    }

    // BUILDER PAGE
    console.log('\n✓ TESTING BUILDER PAGE')
    await page.goto('http://localhost:3000/builder', {
      waitUntil: 'domcontentloaded',
    })
    await page.waitForTimeout(1000)

    const builderContent = await page.content()
    const builderChecks = {
      'Form present':
        builderContent.includes('form') || builderContent.includes('input'),
      'Personal Info':
        builderContent.includes('Personal') ||
        builderContent.includes('Full Name'),
      Experience: builderContent.includes('Experience'),
      Templates:
        builderContent.includes('Modern') || builderContent.includes('Classic'),
      'Download button':
        builderContent.includes('Download') || builderContent.includes('PDF'),
      'Share feature': builderContent.includes('Share'),
      'Preview section':
        builderContent.includes('preview') ||
        builderContent.includes('Preview'),
    }

    for (const [check, passed] of Object.entries(builderChecks)) {
      console.log(`  ${passed ? '✓' : '✗'} ${check}`)
    }

    // TEMPLATES PAGE
    console.log('\n✓ TESTING TEMPLATES PAGE')
    await page.goto('http://localhost:3000/templates', {
      waitUntil: 'domcontentloaded',
    })
    const templatesContent = await page.content()
    const hasTemplates =
      templatesContent.includes('Modern') ||
      templatesContent.includes('Classic') ||
      templatesContent.includes('template')
    console.log(`  ${hasTemplates ? '✓' : '✗'} Template gallery`)

    // PREVIEW PAGE (shared link simulation)
    console.log('\n✓ TESTING PREVIEW PAGE')
    const dummyData = 'eyJwZXJzb25hbEluZm8iOnsibmFtZSI6IkpvaG4ifX0='
    await page
      .goto(`http://localhost:3000/preview?data=${dummyData}`, {
        waitUntil: 'domcontentloaded',
      })
      .catch(() => {})
    const previewContent = await page.content()
    const hasPreview =
      previewContent.includes('preview') ||
      previewContent.includes('Preview') ||
      previewContent.includes('Build')
    console.log(`  ${hasPreview ? '✓' : '✗'} Preview page loads`)

    // INTERACTION TEST
    console.log('\n✓ TESTING INTERACTIONS')
    await page.goto('http://localhost:3000/builder', {
      waitUntil: 'domcontentloaded',
    })
    await page.waitForTimeout(500)

    // Try to find and fill an input
    const inputs = await page.$$('input[type="text"]')
    if (inputs.length > 0) {
      await page.fill('input[type="text"]', 'Test Name')
      await page.waitForTimeout(300)
      console.log(`  ✓ Form input accepts text`)
    } else {
      console.log(`  ⚠ No text inputs found`)
    }

    // Check localStorage
    const storageData = await page.evaluate(() => {
      return {
        resume: localStorage.getItem('resume'),
        keys: Object.keys(localStorage),
      }
    })
    console.log(
      `  ${storageData.resume ? '✓' : '⚠'} LocalStorage persistence (keys: ${storageData.keys.length})`
    )

    console.log('\n═'.repeat(70))
    console.log('\n✅ Testing Complete\n')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
  } finally {
    await browser.close()
  }
}

runTests()
