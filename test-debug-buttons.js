const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('\n🔍 DEBUGGING MISSING BUTTONS\n');
  
  await page.goto('http://localhost:3000/builder', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  
  // Get all buttons
  const buttons = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    return Array.from(btns).map(b => ({
      text: b.textContent.trim().substring(0, 50),
      title: b.title,
      ariaLabel: b.getAttribute('aria-label'),
      visible: window.getComputedStyle(b).display !== 'none',
    }));
  });
  
  console.log('ALL BUTTONS ON PAGE:');
  buttons.forEach((b, i) => {
    const label = b.text || b.title || b.ariaLabel || '(no label)';
    console.log(`  ${i + 1}. "${label}" (visible: ${b.visible})`);
  });
  
  // Check for "Add" buttons specifically
  console.log('\n\nLooking for "Add" buttons:');
  const addButtons = buttons.filter(b => b.text.toLowerCase().includes('add'));
  if (addButtons.length > 0) {
    addButtons.forEach(b => console.log(`  Found: "${b.text}"`));
  } else {
    console.log('  ❌ NO "Add" buttons found');
  }
  
  // Check for template buttons
  console.log('\n\nLooking for template buttons:');
  const templates = ['Modern', 'Classic', 'Minimal', 'Creative', 'Professional'];
  for (const template of templates) {
    const exists = buttons.some(b => b.text.includes(template));
    console.log(`  ${exists ? '✓' : '✗'} ${template}`);
  }
  
  // Check page content for template names
  const content = await page.content();
  console.log('\n\nChecking HTML content:');
  console.log(`  Has "Modern": ${content.includes('Modern')}`);
  console.log(`  Has "Add": ${content.includes('Add ')}`);
  console.log(`  Has "Experience": ${content.includes('Experience')}`);
  
  await browser.close();
}

test();
