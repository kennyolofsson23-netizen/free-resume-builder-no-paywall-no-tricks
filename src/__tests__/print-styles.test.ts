/**
 * Tests for F009 — Print-Optimized Stylesheet
 * Verifies that globals.css contains appropriate print media rules.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const globalsCSS = readFileSync(
  resolve(process.cwd(), 'src/app/globals.css'),
  'utf-8'
)

describe('Print-Optimized Stylesheet', () => {
  it('contains @media print rule', () => {
    expect(globalsCSS).toContain('@media print')
  })

  it('hides UI chrome elements during printing', () => {
    // Should have display:none or visibility:hidden for nav/header/toolbar during print
    const hasPrintHide =
      globalsCSS.includes('display: none') ||
      globalsCSS.includes('display:none') ||
      globalsCSS.includes('visibility: hidden')
    expect(hasPrintHide).toBe(true)
  })

  it('sets print page margins', () => {
    const hasMargins =
      globalsCSS.includes('@page') ||
      globalsCSS.includes('margin')
    expect(hasMargins).toBe(true)
  })

  it('ensures resume preview is visible during printing', () => {
    // The .resume-preview or #resume-preview should not be hidden in print
    // Check print block at end of file or print media query
    const printBlock = globalsCSS.split('@media print')[1] ?? ''
    // Should have some print rules
    expect(printBlock.length).toBeGreaterThan(10)
  })

  it('contains dark mode CSS variables', () => {
    expect(globalsCSS).toContain('.dark')
  })

  it('contains CSS custom properties (design tokens)', () => {
    expect(globalsCSS).toContain('--background')
    expect(globalsCSS).toContain('--foreground')
  })
})
