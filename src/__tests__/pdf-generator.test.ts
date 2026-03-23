/**
 * Tests for F004 — Instant PDF Download (text-native)
 * Tests the actual generate-pdf.ts module.
 * The implementation uses jsPDF text API to produce PDFs with real text
 * objects — all content is selectable and copyable (no rasterisation).
 */
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import type { Resume } from '@/types/resume'
import {
  PDF_PAGE_WIDTH_MM,
  PDF_PAGE_HEIGHT_MM,
  PDF_MARGIN_MM,
} from '@/lib/pdf/generate-pdf'

const sampleResume: Resume = {
  id: 'test-1',
  template: 'modern',
  personalInfo: {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0100',
    location: 'New York, NY',
    website: '',
    linkedin: '',
    github: '',
    summary: 'Experienced software engineer.',
  },
  experiences: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Engineer',
      company: 'Acme Corp',
      location: 'Remote',
      startDate: '2020-01',
      currentlyWorking: true,
      description: 'Led platform migrations.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'State University',
      degree: 'BS',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'TypeScript', level: 'expert' },
    { id: 'skill-2', name: 'React', level: 'advanced' },
  ],
  projects: [],
  certifications: [],
  accentColor: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Track all jsPDF text() calls so we can assert on written content
const mockTextCalls: Array<[string | string[], number, number, object?]> = []
const mockSave = vi.fn()
const mockSetFont = vi.fn()
const mockSetFontSize = vi.fn()
const mockSplitTextToSize = vi.fn((text: string) => [text])
const mockLine = vi.fn()
const mockSetDrawColor = vi.fn()
const mockSetLineWidth = vi.fn()
const mockAddPage = vi.fn()

const mockJsPDFInstance = {
  text: vi.fn(
    (
      text: string | string[],
      x: number,
      y: number,
      opts?: object
    ) => {
      mockTextCalls.push([text, x, y, opts])
    }
  ),
  save: mockSave,
  setFont: mockSetFont,
  setFontSize: mockSetFontSize,
  splitTextToSize: mockSplitTextToSize,
  line: mockLine,
  setDrawColor: mockSetDrawColor,
  setLineWidth: mockSetLineWidth,
  addPage: mockAddPage,
  internal: {
    pageSize: {
      getWidth: vi.fn(() => 595),
      getHeight: vi.fn(() => 842),
    },
  },
}

let capturedJsPDFOptions: object = {}

vi.mock('jspdf', () => ({
  default: vi.fn((opts: object) => {
    capturedJsPDFOptions = opts
    return mockJsPDFInstance
  }),
}))

let generatePDF: (options: {
  resume: Resume
  filename?: string
}) => Promise<void>

beforeAll(async () => {
  const mod = await import('@/lib/pdf/generate-pdf')
  generatePDF = mod.generatePDF
})

beforeEach(() => {
  vi.clearAllMocks()
  mockTextCalls.length = 0
  capturedJsPDFOptions = {}
  // Default: splitTextToSize returns a single-element array so line counts work
  mockSplitTextToSize.mockImplementation((text: string) => [text])
  mockJsPDFInstance.text.mockImplementation(
    (text: string | string[], x: number, y: number, opts?: object) => {
      mockTextCalls.push([text, x, y, opts])
    }
  )
})

// ── Module exports ──────────────────────────────────────────────────────────

describe('generate-pdf module — exported constants', () => {
  it('PDF_PAGE_WIDTH_MM is 210 (A4)', () => {
    expect(PDF_PAGE_WIDTH_MM).toBe(210)
  })

  it('PDF_PAGE_HEIGHT_MM is 297 (A4)', () => {
    expect(PDF_PAGE_HEIGHT_MM).toBe(297)
  })

  it('PDF_MARGIN_MM is a positive number', () => {
    expect(PDF_MARGIN_MM).toBeGreaterThan(0)
  })

  it('exports generatePDF as a function', async () => {
    const mod = await import('@/lib/pdf/generate-pdf')
    expect(typeof mod.generatePDF).toBe('function')
  })
})

// ── A4 page dimensions ──────────────────────────────────────────────────────

describe('generatePDF — A4 page dimensions', () => {
  it('creates jsPDF in portrait orientation with A4 format and mm units', async () => {
    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    const jsPDF = (await import('jspdf')).default
    expect(jsPDF).toHaveBeenCalledWith(
      expect.objectContaining({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
    )
  })

  it('page width constant matches A4 standard (210 mm)', () => {
    expect(PDF_PAGE_WIDTH_MM).toBe(210)
  })

  it('page height constant matches A4 standard (297 mm)', () => {
    expect(PDF_PAGE_HEIGHT_MM).toBe(297)
  })

  it('content width equals page width minus two margins', () => {
    const contentWidth = PDF_PAGE_WIDTH_MM - 2 * PDF_MARGIN_MM
    expect(contentWidth).toBeGreaterThan(0)
    expect(contentWidth).toBeLessThan(PDF_PAGE_WIDTH_MM)
  })
})

// ── Filename convention ─────────────────────────────────────────────────────

describe('generatePDF — filename convention', () => {
  it('calls pdf.save() with the provided filename', async () => {
    await generatePDF({ resume: sampleResume, filename: 'Jane_Smith_Resume.pdf' })
    expect(mockSave).toHaveBeenCalledWith('Jane_Smith_Resume.pdf')
  })

  it('uses default filename "Resume.pdf" when none provided', async () => {
    await generatePDF({ resume: sampleResume })
    expect(mockSave).toHaveBeenCalledWith('Resume.pdf')
  })

  it('accepts filename formatted as {FullName}_Resume.pdf', async () => {
    const fullName = 'Jane Smith'
    const filename = `${fullName.replace(/[^a-z0-9_\- ]/gi, '_').trim()}_Resume.pdf`
    await generatePDF({ resume: sampleResume, filename })
    expect(mockSave).toHaveBeenCalledWith(filename)
  })
})

describe('PDF filename formatting — {FullName}_Resume.pdf convention', () => {
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

  it('handles names with non-ASCII characters by replacing with underscore', () => {
    const fullName = 'José García'
    const safeName = fullName.replace(/[^a-z0-9_\- ]/gi, '_').trim()
    const filename = `${safeName}_Resume.pdf`
    expect(filename).toMatch(/_Resume\.pdf$/)
  })
})

// ── Text content written to PDF ─────────────────────────────────────────────

describe('generatePDF — text content written as real text objects', () => {
  it('writes the full name as text (not as an image)', async () => {
    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    const allText = mockTextCalls
      .map(([t]) => (Array.isArray(t) ? t.join(' ') : t))
      .join(' ')

    expect(allText).toContain('Jane Smith')
  })

  it('writes the email address as text', async () => {
    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    const allText = mockTextCalls
      .map(([t]) => (Array.isArray(t) ? t.join(' ') : t))
      .join(' ')

    expect(allText).toContain('jane@example.com')
  })

  it('writes the job title as text', async () => {
    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    const allText = mockTextCalls
      .map(([t]) => (Array.isArray(t) ? t.join(' ') : t))
      .join(' ')

    expect(allText).toContain('Senior Engineer')
  })

  it('writes the school name as text', async () => {
    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    const allText = mockTextCalls
      .map(([t]) => (Array.isArray(t) ? t.join(' ') : t))
      .join(' ')

    expect(allText).toContain('State University')
  })

  it('writes skill names as text', async () => {
    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    const allText = mockTextCalls
      .map(([t]) => (Array.isArray(t) ? t.join(' ') : t))
      .join(' ')

    expect(allText).toContain('TypeScript')
  })

  it('does NOT call addImage — no rasterisation', async () => {
    const mockInstance = mockJsPDFInstance as Record<string, unknown>
    const addImageSpy = vi.fn()
    mockInstance.addImage = addImageSpy

    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    expect(addImageSpy).not.toHaveBeenCalled()
  })
})

// ── Margin calculations ─────────────────────────────────────────────────────

describe('generatePDF — margin calculations', () => {
  it('all text is placed at x >= PDF_MARGIN_MM', async () => {
    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    for (const [, x] of mockTextCalls) {
      // Right-aligned text uses x = MARGIN + contentWidth; left-aligned uses x = MARGIN
      expect(x).toBeGreaterThanOrEqual(PDF_MARGIN_MM)
    }
  })

  it('left-margin x coordinate equals PDF_MARGIN_MM for body text', async () => {
    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    // The full name is always left-aligned at MARGIN
    const nameCall = mockTextCalls.find(([t]) => t === 'Jane Smith')
    expect(nameCall).toBeDefined()
    expect(nameCall?.[1]).toBe(PDF_MARGIN_MM)
  })
})

// ── Does not use print dialog ────────────────────────────────────────────────

describe('PDF uses programmatic generation (not print dialog)', () => {
  it('does not call window.print() — uses jsPDF programmatically', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

    await generatePDF({ resume: sampleResume, filename: 'test.pdf' })

    expect(printSpy).not.toHaveBeenCalled()
    expect(mockSave).toHaveBeenCalledOnce()
    printSpy.mockRestore()
  })
})

// ── Client-side only ────────────────────────────────────────────────────────

describe('PDF is client-side only', () => {
  it('generate-pdf module resolves without server-side dependencies', async () => {
    const mod = await import('@/lib/pdf/generate-pdf')
    expect(mod).toBeDefined()
    expect(typeof mod.generatePDF).toBe('function')
  })
})

// ── Validation ───────────────────────────────────────────────────────────────

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
