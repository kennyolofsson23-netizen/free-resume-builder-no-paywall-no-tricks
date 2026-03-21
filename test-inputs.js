const { chromium } = require('playwright')

async function test() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('\n🔍 DEBUGGING INPUT DETECTION\n')

  await page.goto('http://localhost:3000/builder', {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForTimeout(1000)

  // Get all input types
  const inputInfo = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input')
    return {
      total: inputs.length,
      types: Array.from(inputs).map((i) => i.type),
      ids: Array.from(inputs).map((i) => i.id),
      placeholders: Array.from(inputs).map((i) => i.placeholder),
      visible: Array.from(inputs).filter((i) => {
        const style = window.getComputedStyle(i)
        return style.display !== 'none' && style.visibility !== 'hidden'
      }).length,
    }
  })

  console.log('Input Elements Found:')
  console.log(`  Total inputs: ${inputInfo.total}`)
  console.log(`  Visible inputs: ${inputInfo.visible}`)
  console.log(`  Types: ${[...new Set(inputInfo.types)].join(', ')}`)
  console.log(`  IDs: ${inputInfo.ids.slice(0, 5).join(', ')}`)
  console.log(
    `  Placeholders: ${inputInfo.placeholders
      .filter((p) => p)
      .slice(0, 3)
      .join(', ')}`
  )

  // Try different selectors
  const selectors = [
    'input',
    'input[type="text"]',
    'input[type="email"]',
    '[role="textbox"]',
    'textarea',
    'label',
  ]

  console.log('\nElement Count by Selector:')
  for (const selector of selectors) {
    const count = await page.locator(selector).count()
    console.log(`  ${selector}: ${count}`)
  }

  // Get page structure
  const structure = await page.evaluate(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    return {
      headings: Array.from(headings)
        .map((h) => h.textContent.trim())
        .slice(0, 10),
      mainContent: document
        .querySelector('main')
        ?.textContent?.substring(0, 100),
    }
  })

  console.log('\nPage Structure:')
  console.log(`  Headings: ${structure.headings.slice(0, 3).join(' | ')}`)
  console.log(
    `  Main content starts with: ${structure.mainContent?.substring(0, 50)}...`
  )

  await browser.close()
}

test()
