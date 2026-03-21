// Quick test of core module exports
const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Free Resume Builder...\n')

// Test 1: Check if all required files exist
const requiredFiles = [
  'src/store/resume-store.ts',
  'src/lib/schemas/resume-schema.ts',
  'src/app/builder/page.tsx',
  'src/app/page.tsx',
  'src/lib/pdf/generate-pdf.ts',
  'src/hooks/use-shareable-link.ts',
  'src/hooks/use-auto-save.ts',
]

console.log('✅ File Structure Check:')
let fileCheckPass = true
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, file))
  console.log(`  ${exists ? '✓' : '✗'} ${file}`)
  if (!exists) fileCheckPass = false
})

// Test 2: Check template files
const templateFiles = [
  'src/components/templates/modern-template.tsx',
  'src/components/templates/classic-template.tsx',
  'src/components/templates/minimal-template.tsx',
  'src/components/templates/creative-template.tsx',
  'src/components/templates/professional-template.tsx',
]

console.log('\n✅ Template Files Check:')
let templateCheckPass = true
templateFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(__dirname, file))
  console.log(`  ${exists ? '✓' : '✗'} ${file}`)
  if (!exists) templateCheckPass = false
})

// Test 3: Check constants define templates
const constantsPath = path.join(__dirname, 'src/lib/constants.ts')
const constantsContent = fs.readFileSync(constantsPath, 'utf8')
const hasTemplates =
  constantsContent.includes('TEMPLATES') ||
  constantsContent.includes('templates')
console.log(`\n✅ Constants File:
  ${hasTemplates ? '✓' : '✗'} TEMPLATES array defined`)

// Test 4: Verify test coverage
const testFiles = fs
  .readdirSync(path.join(__dirname, 'src/__tests__'))
  .filter((f) => f.endsWith('.test.ts') || f.endsWith('.test.tsx'))
console.log(`\n✅ Test Coverage: ${testFiles.length} test files found`)

console.log('\n📊 Result:')
console.log(`  Files: ${fileCheckPass ? 'PASS' : 'FAIL'}`)
console.log(`  Templates: ${templateCheckPass ? 'PASS' : 'FAIL'}`)
console.log(
  `  Overall: ${fileCheckPass && templateCheckPass ? 'PASS ✓' : 'FAIL ✗'}`
)
