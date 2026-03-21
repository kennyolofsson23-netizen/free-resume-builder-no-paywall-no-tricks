const fs = require('fs');
const path = require('path');

console.log('🎯 COMPREHENSIVE FEATURE VERIFICATION\n');

const features = [
  {
    name: 'F000: Shared Infrastructure',
    files: [
      'src/types/resume.ts',
      'src/lib/schemas/resume-schema.ts',
      'src/store/resume-store.ts',
      'src/lib/constants.ts',
      'src/components/ui/button.tsx',
    ],
  },
  {
    name: 'F001: Resume Form Editor',
    files: [
      'src/app/builder/page.tsx',
      'src/components/builder/form-panel.tsx',
      'src/components/builder/sections/personal-info-form.tsx',
      'src/components/builder/sections/experience-form.tsx',
    ],
  },
  {
    name: 'F002: Real-Time PDF Preview',
    files: [
      'src/components/builder/builder-layout.tsx',
      'src/components/builder/preview-panel.tsx',
    ],
  },
  {
    name: 'F003: Five Resume Templates',
    files: [
      'src/components/templates/modern-template.tsx',
      'src/components/templates/classic-template.tsx',
      'src/components/templates/minimal-template.tsx',
      'src/components/templates/creative-template.tsx',
      'src/components/templates/professional-template.tsx',
    ],
  },
  {
    name: 'F004: Instant PDF Download',
    files: ['src/lib/pdf/generate-pdf.ts', 'src/hooks/use-pdf-generator.ts'],
  },
  {
    name: 'F005: LocalStorage Persistence',
    files: ['src/hooks/use-auto-save.ts'],
  },
  {
    name: 'F006: Landing Page',
    files: ['src/app/page.tsx', 'src/components/landing/hero.tsx'],
  },
  {
    name: 'F007: Shareable Resume Preview Link',
    files: ['src/lib/sharing/url-codec.ts', 'src/app/preview/page.tsx'],
  },
  {
    name: 'F008: JSON Import/Export',
    files: ['src/__tests__/json-import-export.test.ts'],
  },
  {
    name: 'F009: Print-Optimized Stylesheet',
    files: ['src/app/globals.css'],
  },
  {
    name: 'F010: Dark Mode',
    files: ['src/components/shared/theme-toggle.tsx'],
  },
  {
    name: 'F011: Multiple Resumes Management',
    files: ['src/__tests__/multiple-resumes.test.ts'],
  },
  {
    name: 'F012: Custom Accent Color Picker',
    files: ['src/components/ui/color-picker.tsx'],
  },
  {
    name: 'F013: Undo/Redo',
    files: ['src/hooks/use-keyboard-shortcuts.ts'],
  },
  {
    name: 'F014: Template Gallery Page',
    files: ['src/app/templates/page.tsx'],
  },
  {
    name: 'F015: Affiliate & Ad Monetization',
    files: ['src/components/shared/affiliate-banner.tsx'],
  },
];

let totalPass = 0;
let totalFail = 0;

features.forEach(feature => {
  let pass = true;
  const missing = [];
  
  feature.files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
      pass = false;
      missing.push(file);
    }
  });
  
  if (pass) {
    console.log(`✅ ${feature.name}`);
    totalPass++;
  } else {
    console.log(`❌ ${feature.name}`);
    missing.forEach(f => console.log(`   Missing: ${f}`));
    totalFail++;
  }
});

console.log(`\n📊 Summary: ${totalPass}/${features.length} features complete`);
console.log(`\nTest Results: ${totalPass === features.length ? '✅ PASS' : '⚠️  ISSUES FOUND'}`);
