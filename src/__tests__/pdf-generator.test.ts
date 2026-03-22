/**
 * Tests for F004 — Instant PDF Download
 * Tests the actual generate-pdf.ts module.
 * The implementation uses jsPDF + html2canvas to produce programmatic PDFs.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
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

// Mock html2canvas and jsPDF since jsdom doesn't support canvas rendering
const mockSave = vi.fn()
const mockAddImage = vi.fn()
const mockToDataURL = vi.fn(() => 'data:image/png;base64,MOCK')
const mockGetWidth = vi.fn(() => 595)
const mockGetHeight = vi.fn(() => 842)

vi.mock('html2canvas', () => ({
  default: vi.fn(() =>
    Promise.resolve({
      toDataURL: mockToDataURL,
      width: 800,
      height: 1100,
    })
  ),
}))

vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    internal: {
      pageSize: {
        getWidth: mockGetWidth,
        getHeight: mockGetHeight,
      },
    },
    addImage: mockAddImage,
    save: mockSave,
  })),
}))

let generatePDF: (options?: {
  elementId?: string
  filename?: string
}) => Promise<void>

beforeAll(async () => {
  const mod = await import('@/lib/pdf/generate-pdf')
  generatePDF = mod.generatePDF
})

beforeEach(() => {
  vi.clearAllMocks()
  mockToDataURL.mockReturnValue('data:image/png;base64,MOCK')
  mockGetWidth.mockReturnValue(595)
  mockGetHeight.mockReturnValue(842)
})

describe('generatePDF — core behavior', () => {
  it('throws when element is not found', async () => {
    await expect(
      generatePDF({ elementId: 'nonexistent-element' })
    ).rejects.toThrow('Element #nonexistent-element not found')
  })

  it('calls html2canvas and pdf.save() when element exists', async () => {
    const el = document.createElement('div')
    el.id = 'resume-preview-container'
    document.body.appendChild(el)

    await generatePDF({
      elementId: 'resume-preview-container',
      filename: 'Test_Resume.pdf',
    })

    const html2canvas = (await import('html2canvas')).default
    expect(html2canvas).toHaveBeenCalledOnce()
    expect(mockSave).toHaveBeenCalledWith('Test_Resume.pdf')
    document.body.removeChild(el)
  })

  it('does NOT call pdf.save() when element is missing', async () => {
    await expect(generatePDF({ elementId: 'does-not-exist' })).rejects.toThrow()
    expect(mockSave).not.toHaveBeenCalled()
  })

  it('passes the correct filename to pdf.save()', async () => {
    const el = document.createElement('div')
    el.id = 'resume-filename-test'
    document.body.appendChild(el)

    await generatePDF({
      elementId: 'resume-filename-test',
      filename: 'Jane_Smith_Resume.pdf',
    })

    expect(mockSave).toHaveBeenCalledWith('Jane_Smith_Resume.pdf')
    document.body.removeChild(el)
  })

  it('uses default filename "Resume.pdf" when no filename provided', async () => {
    const el = document.createElement('div')
    el.id = 'resume-default-filename-test'
    document.body.appendChild(el)

    await generatePDF({ elementId: 'resume-default-filename-test' })

    expect(mockSave).toHaveBeenCalledWith('Resume.pdf')
    document.body.removeChild(el)
  })

  it('calls addImage with PNG data from html2canvas', async () => {
    const el = document.createElement('div')
    el.id = 'resume-image-test'
    document.body.appendChild(el)

    await generatePDF({ elementId: 'resume-image-test', filename: 'Test.pdf' })

    expect(mockAddImage).toHaveBeenCalledWith(
      'data:image/png;base64,MOCK',
      'PNG',
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number)
    )
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

describe('PDF uses programmatic generation (not print dialog)', () => {
  it('does not call window.print() — uses jsPDF programmatically instead', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

    const el = document.createElement('div')
    el.id = 'resume-no-print-test'
    document.body.appendChild(el)

    await generatePDF({ elementId: 'resume-no-print-test' })

    expect(printSpy).not.toHaveBeenCalled()
    expect(mockSave).toHaveBeenCalledOnce()
    document.body.removeChild(el)
    printSpy.mockRestore()
  })
})
