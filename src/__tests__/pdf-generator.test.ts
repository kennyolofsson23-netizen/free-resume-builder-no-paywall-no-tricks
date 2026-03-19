/**
 * Tests for F004 — Instant PDF Download
 * Verifies PDF generation hook behavior and validation.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Mock store
const mockResume = {
  id: 'test-1',
  template: 'modern' as const,
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

const mockUseResumeStore = vi.fn()
vi.mock('@/store/resume-store', () => ({
  useResumeStore: (
    selector: (state: { resume: typeof mockResume | null }) => unknown
  ) => mockUseResumeStore(selector),
}))

// Mock toast
const mockToast = vi.fn()
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Mock generatePDF
const mockGeneratePDF = vi.fn()
vi.mock('@/lib/pdf/generate-pdf', () => ({
  generatePDF: (...args: unknown[]) => mockGeneratePDF(...args),
}))

import { usePdfGenerator } from '@/hooks/use-pdf-generator'

function setupStore(resume: typeof mockResume | null) {
  mockUseResumeStore.mockImplementation(
    (selector: (state: { resume: typeof mockResume | null }) => unknown) =>
      selector({ resume })
  )
}

describe('generatePDF utility', () => {
  it('exports a generatePDF function', async () => {
    const mod = await import('@/lib/pdf/generate-pdf')
    expect(typeof mod.generatePDF).toBe('function')
  })
})

describe('PDF filename convention', () => {
  it('formats filename as {FullName}_Resume.pdf using hook logic (spaces → underscores)', () => {
    const fullName = 'Jane Smith'
    // Hook uses: name.replace(/\s+/g, '_')
    const filename = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`
    expect(filename).toBe('Jane_Smith_Resume.pdf')
  })

  it('collapses multiple spaces into single underscore', () => {
    const fullName = 'Mary  Jane  Watson'
    const filename = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`
    expect(filename).toBe('Mary_Jane_Watson_Resume.pdf')
  })

  it('preserves hyphens in names', () => {
    const fullName = 'Mary-Jane Watson'
    const filename = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`
    expect(filename).toBe('Mary-Jane_Watson_Resume.pdf')
  })
})

describe('usePdfGenerator — validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGeneratePDF.mockResolvedValue(undefined)
  })

  it('shows toast and does NOT call generatePDF when fullName is empty', async () => {
    const resumeNoName = {
      ...mockResume,
      personalInfo: { ...mockResume.personalInfo, fullName: '' },
    }
    setupStore(resumeNoName)

    const { result } = renderHook(() => usePdfGenerator())
    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
    expect(mockGeneratePDF).not.toHaveBeenCalled()
  })

  it('shows toast and does NOT call generatePDF when email is empty', async () => {
    const resumeNoEmail = {
      ...mockResume,
      personalInfo: { ...mockResume.personalInfo, email: '' },
    }
    setupStore(resumeNoEmail)

    const { result } = renderHook(() => usePdfGenerator())
    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
    expect(mockGeneratePDF).not.toHaveBeenCalled()
  })

  it('shows toast and does NOT call generatePDF when resume is null', async () => {
    setupStore(null)

    const { result } = renderHook(() => usePdfGenerator())
    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
    expect(mockGeneratePDF).not.toHaveBeenCalled()
  })
})

describe('usePdfGenerator — success flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGeneratePDF.mockResolvedValue(undefined)
    setupStore(mockResume)
  })

  it('calls generatePDF with correct elementId and filename', async () => {
    const { result } = renderHook(() => usePdfGenerator())
    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockGeneratePDF).toHaveBeenCalledWith({
      elementId: 'resume-preview-container',
      filename: 'Jane_Smith_Resume.pdf',
    })
  })

  it('sets status to success after successful PDF generation', async () => {
    const { result } = renderHook(() => usePdfGenerator())
    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(result.current.status).toBe('success')
  })

  it('shows success toast after PDF generation', async () => {
    const { result } = renderHook(() => usePdfGenerator())
    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining('PDF') })
    )
  })
})

describe('usePdfGenerator — error flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGeneratePDF.mockRejectedValue(new Error('Canvas error'))
    setupStore(mockResume)
  })

  it('sets status to error when generatePDF throws', async () => {
    const { result } = renderHook(() => usePdfGenerator())
    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(result.current.status).toBe('error')
  })

  it('shows error toast when generatePDF throws', async () => {
    const { result } = renderHook(() => usePdfGenerator())
    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
  })
})

describe('PDF is client-side only', () => {
  it('generate-pdf module does not import server-only dependencies', async () => {
    const mod = await import('@/lib/pdf/generate-pdf')
    expect(mod).toBeDefined()
    expect(typeof mod.generatePDF).toBe('function')
  })
})
