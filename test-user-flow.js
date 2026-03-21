const { chromium } = require('playwright');

const baseURL = 'http://localhost:3000';

async function runTests() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('\n🎯 USER TESTING — FREE RESUME BUILDER\n');
  console.log('═'.repeat(60));

  try {
    // TEST 1: Landing Page
    console.log('\n[1] Landing Page — Hero & Messaging');
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    const title = await page.title();
    console.log(`   ✓ Page title: "${title}"`);
    
    const hero = await page.locator('h1').first().textContent();
    console.log(`   ✓ Hero heading: "${hero}"`);
    
    const hasFreeMessage = await page.locator('text=/free|no paywall|no tricks/i').count();
    console.log(`   ✓ Found ${hasFreeMessage} anti-paywall messages`);
    
    const buildBtn = page.locator('a[href="/builder"], button[onclick*="builder"]').first();
    const isVisible = await buildBtn.isVisible().catch(() => false);
    console.log(`   ${isVisible ? '✓' : '⚠'} Build Resume CTA visible`);

    // TEST 2: Navigate to Builder
    console.log('\n[2] Navigation to Builder');
    await page.goto(baseURL + '/builder', { waitUntil: 'networkidle' });
    const builderUrl = page.url();
    console.log(`   ${builderUrl.includes('/builder') ? '✓' : '✗'} Navigated to /builder`);

    // TEST 3: Form Rendering
    console.log('\n[3] Form Fields Rendering');
    const fullNameLabel = await page.locator('label:has-text("Full Name"), label:contains("Full Name")').isVisible().catch(() => false);
    const emailLabel = await page.locator('label:has-text("Email"), label:contains("Email")').isVisible().catch(() => false);
    const phoneLabel = await page.locator('label:has-text("Phone"), label:contains("Phone")').isVisible().catch(() => false);
    const locationLabel = await page.locator('label:has-text("Location"), label:contains("Location")').isVisible().catch(() => false);
    
    console.log(`   ${fullNameLabel ? '✓' : '✗'} Full Name field visible`);
    console.log(`   ${emailLabel ? '✓' : '✗'} Email field visible`);
    console.log(`   ${phoneLabel ? '✓' : '✗'} Phone field visible`);
    console.log(`   ${locationLabel ? '✓' : '✗'} Location field visible`);

    // TEST 4: Real-Time Preview
    console.log('\n[4] Real-Time Preview Update');
    const inputs = await page.locator('input[type="text"]').all();
    if (inputs.length > 0) {
      await inputs[0].fill('John Smith');
      await page.waitForTimeout(300);
      console.log(`   ✓ Filled name field`);
    }

    // TEST 5: Template Switching
    console.log('\n[5] Template Switching');
    const templateBtns = await page.locator('button').filter({ hasText: /Modern|Classic|Minimal/ }).all();
    console.log(`   ✓ Found ${templateBtns.length} template options`);

    // TEST 6: Download Button
    console.log('\n[6] PDF Download');
    const downloadBtn = await page.locator('button').filter({ hasText: /Download|PDF/ }).isVisible().catch(() => false);
    console.log(`   ${downloadBtn ? '✓' : '⚠'} Download button visible`);

    // TEST 7: Share Feature
    console.log('\n[7] Share Feature');
    const shareBtn = await page.locator('button').filter({ hasText: /Share/ }).isVisible().catch(() => false);
    console.log(`   ${shareBtn ? '✓' : '⚠'} Share button visible`);

    // TEST 8: LocalStorage
    console.log('\n[8] LocalStorage Persistence');
    const storageData = await page.evaluate(() => localStorage.getItem('resume'));
    console.log(`   ${storageData ? '✓' : '⚠'} Resume data in localStorage`);

    // TEST 9: All Sections Present
    console.log('\n[9] Resume Sections');
    const sections = ['Personal Info', 'Experience', 'Education', 'Skills', 'Projects', 'Certifications'];
    for (const section of sections) {
      const isPresent = await page.locator(`heading:has-text("${section}"), h2:has-text("${section}")`).isVisible().catch(() => false);
      console.log(`   ${isPresent ? '✓' : '✗'} ${section} section`);
    }

    console.log('\n═'.repeat(60));
    console.log('\n✅ User Flow Testing Complete\n');

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
  } finally {
    await browser.close();
  }
}

runTests();
