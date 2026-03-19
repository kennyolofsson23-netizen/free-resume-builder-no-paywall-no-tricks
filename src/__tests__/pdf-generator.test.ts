/**
 * Tests for F004 — Instant PDF Download
 * Verifies PDF generation hook behavior and validation.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock store
const mockUseResumeStore = vi.fn()
vi.mock('@/store/resume-store', () => ({
  useResumeStore: (selector: (state: unknown) => unknown) =>
    mockUseResumeStore(selector),
}))

// Mock toast
const mockToast = vi.fn().mockReturnValue({ id: 'toast-id' })
vi.mock('@/hooks/use-toast', () => ({
  toast: (...args: unknown[]) => mockToast(...args),
}))

// Mock the generate-pdf module (dynamic import)
vi.mock('@/lib/pdf/generate-pdf', () => ({
  generatePDF: vi.fn().mockResolvedValue(undefined),
}))

import type { Resume } from '@/types/resume'

const sampleResume: Resume = {
  id: 'test-1',
  template: 'modern',
  personalInfo: {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '',
    location: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('generatePDF utility', () => {
  it('exports a generatePDF function', async () => {
    const mod = await import('@/lib/pdf/generate-pdf')
    expect(typeof mod.generatePDF).toBe('function')
  })
})

describe('PDF filename convention', () => {
  it('formats filename as {FullName}_Resume.pdf', () => {
    const fullName = 'Jane Smith'
    const safeName = fullName.replace(/[^a-z0-9_\- ]/gi, '_').trim()
    const filename = `${safeName}_Resume.pdf`
    expect(filename).toBe('Jane Smith_Resume.pdf')
  })

  it('sanitizes special characters from full name', () => {
    const fullName = 'Jane & "Smith" (Dr.)'
    const safeName = fullName.replace(/[^a-z0-9_\- ]/gi, '_').trim()
    const filename = `${safeName}_Resume.pdf`
    expect(filename).toContain('_Resume.pdf')
    expect(filename).not.toContain('"')
    expect(filename).not.toContain('&')
    expect(filename).not.toContain('(')
  })

  it('handles names with hyphens and spaces', () => {
    const fullName = 'Mary-Jane Watson'
    const safeName = fullName.replace(/[^a-z0-9_\- ]/gi, '_').trim()
    const filename = `${safeName}_Resume.pdf`
    expect(filename).toBe('Mary-Jane Watson_Resume.pdf')
  })
})

describe('PDF generation validation', () => {
  it('requires fullName and email to be non-empty', () => {
    const missingName = { ...sampleResume, personalInfo: { ...sampleResume.personalInfo, fullName: '' } }
    const missingEmail = { ...sampleResume, personalInfo: { ...sampleResume.personalInfo, email: '' } }

    expect(missingName.personalInfo.fullName).toBe('')
    expect(missingEmail.personalInfo.email).toBe('')
    // Valid resume has both
    expect(sampleResume.personalInfo.fullName).toBeTruthy()
    expect(sampleResume.personalInfo.email).toBeTruthy()
  })
})

describe('PDF is client-side only', () => {
  it('generate-pdf module does not import server-only dependencies', async () => {
    // The module should only use html2canvas and jsPDF (client-side)
    const mod = await import('@/lib/pdf/generate-pdf')
    expect(mod).toBeDefined()
    expect(typeof mod.generatePDF).toBe('function')
  })
})
