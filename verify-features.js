const fs = require('fs')
const path = require('path')

// Features from FEATURES.json with their required files
const features = {
  'F000 - Shared Infrastructure': [
    'src/types/resume.ts',
    'src/lib/schemas/resume-schema.ts',
    'src/store/resume-store.ts',
    'src/lib/constants.ts',
    'src/lib/cn.ts',
    'src/app/layout.tsx',
  ],
  'F001 - Resume Form Editor': [
    'src/app/builder/page.tsx',
    'src/components/builder/form-panel.tsx',
    'src/components/builder/sections/personal-info-form.tsx',
    'src/components/builder/sections/experience-form.tsx',
    'src/components/builder/sections/education-form.tsx',
    'src/components/builder/sections/skills-form.tsx',
  ],
  'F002 - Real-Time PDF Preview': [
    'src/components/builder/builder-layout.tsx',
    'src/components/builder/preview-panel.tsx',
  ],
  'F003 - Five Resume Templates': [
    'src/components/templates/modern-template.tsx',
    'src/components/templates/classic-template.tsx',
    'src/components/templates/minimal-template.tsx',
    'src/components/templates/creative-template.tsx',
    'src/components/templates/professional-template.tsx',
  ],
  'F004 - Instant PDF Download': [
    'src/lib/pdf/generate-pdf.ts',
    'src/hooks/use-pdf-generator.ts',
  ],
  'F005 - LocalStorage Persistence': ['src/hooks/use-auto-save.ts'],
  'F006 - Landing Page': [
    'src/app/page.tsx',
    'src/components/landing/hero.tsx',
    'src/components/landing/feature-grid.tsx',
  ],
  'F007 - Shareable Resume Link': [
    'src/lib/sharing/url-codec.ts',
    'src/app/preview/page.tsx',
  ],
  'F008 - JSON Import/Export': ['src/__tests__/json-import-export.test.ts'],
  'F009 - Print-Optimized Stylesheet': ['src/app/globals.css'],
  'F010 - Dark Mode': ['src/components/shared/theme-toggle.tsx'],
  'F011 - Multiple Resumes Management': [
    'src/__tests__/multiple-resumes.test.ts',
  ],
  'F012 - Custom Accent Color Picker': ['src/components/ui/color-picker.tsx'],
  'F013 - Undo/Redo': ['src/hooks/use-keyboard-shortcuts.ts'],
  'F014 - Template Gallery Page': ['src/app/templates/page.tsx'],
  'F015 - Affiliate & Ad Monetization': [
    'src/components/shared/affiliate-banner.tsx',
  ],
}

console.log('\n=== FEATURES.json FILE COMPLETENESS CHECK ===\n')

let totalFiles = 0
let foundFiles = 0

Object.entries(features).forEach(([feature, files]) => {
  let featureGood = true
  console.log(`\n${feature}:`)

  files.forEach((file) => {
    totalFiles++
    const fullPath = path.join(__dirname, file)
    const exists = fs.existsSync(fullPath)
    foundFiles += exists ? 1 : 0

    const status = exists ? '✓' : '✗'
    console.log(`  ${status} ${file}`)

    if (!exists) featureGood = false
  })

  console.log(`  ${featureGood ? '✓ COMPLETE' : '⚠ INCOMPLETE'}`)
})

console.log('\n=== SUMMARY ===')
console.log(`\nFound: ${foundFiles}/${totalFiles} feature files`)
const completeness = Math.round((foundFiles / totalFiles) * 100)
console.log(`Completeness: ${completeness}%`)

if (completeness === 100) {
  console.log('\n✓ All feature files are present')
} else {
  console.log(`\n⚠ ${totalFiles - foundFiles} files are missing`)
}
