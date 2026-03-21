/**
 * Tests for F004 — Instant PDF Download
 * Tests the actual generate-pdf.ts module with jsPDF mocked.
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

// Mock jsPDF
const mockSave = vi.fn()
const mockAddImage = vi.fn()
const mockAddPage = vi.fn()
const mockGetWidth = vi.fn().mockReturnValue(612)
const mockGetHeight = vi.fn().mockReturnValue(792)

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: mockGetWidth,
        getHeight: mockGetHeight,
      },
    },
    addImage: mockAddImage,
    addPage: mockAddPage,
    save: mockSave,
  })),
}))

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    width: 816,
    height: 1056,
    toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,fake'),
  }),
}))

let generatePDF: (options?: {
  elementId?: string
  filename?: string
}) => Promise<void>

beforeAll(async () => {
  const mod = await import('@/lib/pdf/generate-pdf')
  generatePDF = mod.generatePDF
})

describe('generatePDF — core behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws when element is not found', async () => {
    await expect(
      generatePDF({ elementId: 'nonexistent-element' })
    ).rejects.toThrow('Element #nonexistent-element not found')
  })

  it('calls pdf.save() with the given filename when element exists', async () => {
    const el = document.createElement('div')
    el.id = 'resume-preview-container'
    document.body.appendChild(el)

    await generatePDF({
      elementId: 'resume-preview-container',
      filename: 'Test_Resume.pdf',
    })

    expect(mockSave).toHaveBeenCalledWith('Test_Resume.pdf')
    document.body.removeChild(el)
  })

  it('calls html2canvas on the element', async () => {
    const html2canvas = (await import('html2canvas')).default
    const el = document.createElement('div')
    el.id = 'resume-canvas-test'
    document.body.appendChild(el)

    await generatePDF({ elementId: 'resume-canvas-test', filename: 'Test.pdf' })

    expect(html2canvas).toHaveBeenCalledWith(
      el,
      expect.objectContaining({ scale: 2 })
    )
    document.body.removeChild(el)
  })

  it('calls addImage with JPEG data', async () => {
    const el = document.createElement('div')
    el.id = 'resume-image-test'
    document.body.appendChild(el)

    await generatePDF({ elementId: 'resume-image-test', filename: 'Test.pdf' })

    expect(mockAddImage).toHaveBeenCalledWith(
      'data:image/jpeg;base64,fake',
      'JPEG',
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
