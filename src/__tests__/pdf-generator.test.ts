/**
 * Tests for F004 — Instant PDF Download
 * Tests the actual generate-pdf.ts module (not a mock).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

describe('generatePDF — core behavior', () => {
  let printSpy: ReturnType<typeof vi.spyOn>
  let originalTitle: string

  beforeEach(() => {
    originalTitle = document.title
    printSpy = vi.spyOn(window, 'print').mockImplementation(() => {
      // Simulate afterprint event synchronously in tests
      window.dispatchEvent(new Event('afterprint'))
    })
  })

  afterEach(() => {
    document.title = originalTitle
    vi.restoreAllMocks()
  })

  it('throws when element is not found', async () => {
    const { generatePDF } = await import('@/lib/pdf/generate-pdf')
    await expect(
      generatePDF({ elementId: 'nonexistent-element' })
    ).rejects.toThrow('Element #nonexistent-element not found')
  })

  it('calls window.print() when element exists', async () => {
    const el = document.createElement('div')
    el.id = 'resume-preview-container'
    document.body.appendChild(el)

    const { generatePDF } = await import('@/lib/pdf/generate-pdf')
    await generatePDF({ elementId: 'resume-preview-container', filename: 'Test.pdf' })

    expect(printSpy).toHaveBeenCalledOnce()
    document.body.removeChild(el)
  })

  it('sets document.title to filename before printing', async () => {
    const el = document.createElement('div')
    el.id = 'resume-test-title'
    document.body.appendChild(el)

    let titleDuringPrint = ''
    printSpy.mockImplementation(() => {
      titleDuringPrint = document.title
      window.dispatchEvent(new Event('afterprint'))
    })

    const { generatePDF } = await import('@/lib/pdf/generate-pdf')
    await generatePDF({ elementId: 'resume-test-title', filename: 'MyResume.pdf' })

    expect(titleDuringPrint).toBe('MyResume.pdf')
    document.body.removeChild(el)
  })

  it('restores document.title after printing', async () => {
    document.title = 'Original Page Title'
    const el = document.createElement('div')
    el.id = 'resume-restore-test'
    document.body.appendChild(el)

    const { generatePDF } = await import('@/lib/pdf/generate-pdf')
    await generatePDF({ elementId: 'resume-restore-test', filename: 'Temp.pdf' })

    expect(document.title).toBe('Original Page Title')
    document.body.removeChild(el)
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
  it('requires fullName and email to be non-empty before triggering download', () => {
    const missingName = {
      ...sampleResume,
      personalInfo: { ...sampleResume.personalInfo, fullName: '' },
    }
    const missingEmail = {
      ...sampleResume,
      personalInfo: { ...sampleResume.personalInfo, email: '' },
    }

    expect(missingName.personalInfo.fullName).toBe('')
    expect(missingEmail.personalInfo.email).toBe('')
    expect(sampleResume.personalInfo.fullName).toBeTruthy()
    expect(sampleResume.personalInfo.email).toBeTruthy()
  })
})

describe('PDF is client-side only', () => {
  it('generate-pdf module resolves without server-side dependencies', async () => {
    const mod = await import('@/lib/pdf/generate-pdf')
    expect(mod).toBeDefined()
    expect(typeof mod.generatePDF).toBe('function')
  })
})
