// Quick verification script for advanced features
const fs = require('fs')
const path = require('path')

const checks = [
  {
    name: 'Auto-save hook',
    file: 'src/hooks/use-auto-save.ts',
    shouldExist: true,
  },
  {
    name: 'Color picker component',
    file: 'src/components/ui/color-picker.tsx',
    shouldExist: true,
  },
  {
    name: 'Dark mode tests',
    file: 'src/__tests__/dark-mode.test.ts',
    shouldExist: true,
  },
  {
    name: 'JSON import/export tests',
    file: 'src/__tests__/json-import-export.test.ts',
    shouldExist: true,
  },
  {
    name: 'Undo/redo tests',
    file: 'src/__tests__/undo-redo.test.ts',
    shouldExist: true,
  },
  {
    name: 'Print styles in globals.css',
    file: 'src/app/globals.css',
    shouldExist: true,
    contentCheck: '@media print',
  },
  {
    name: 'PDF generator',
    file: 'src/lib/pdf/generate-pdf.ts',
    shouldExist: true,
  },
  {
    name: 'Shareable link codec',
    file: 'src/lib/sharing/url-codec.ts',
    shouldExist: true,
  },
  {
    name: 'Template gallery page',
    file: 'src/app/templates/page.tsx',
    shouldExist: true,
  },
  {
    name: 'Preview page (sharing)',
    file: 'src/app/preview/page.tsx',
    shouldExist: true,
  },
]

console.log('\n=== FEATURE FILE VERIFICATION ===\n')

let allGood = true
checks.forEach((check) => {
  const filePath = path.join(__dirname, check.file)
  const exists = fs.existsSync(filePath)

  if (exists && check.contentCheck) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const hasContent = content.includes(check.contentCheck)
    const status = hasContent ? '✓' : '⚠'
    console.log(`${status} ${check.name}: EXISTS with "${check.contentCheck}"`)
    if (!hasContent) allGood = false
  } else {
    const status = exists ? '✓' : '✗'
    console.log(`${status} ${check.name}: ${exists ? 'EXISTS' : 'MISSING'}`)
    if (!exists && check.shouldExist) allGood = false
  }
})

console.log('\n=== SUMMARY ===')
if (allGood) {
  console.log('✓ All expected feature files are present')
  process.exit(0)
} else {
  console.log('✗ Some feature files are missing')
  process.exit(1)
}
