/**
 * Tests for the usePdfGenerator hook.
 * Covers: validation logic, status state machine, toast notifications,
 * and the PDF download flow.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResumeStore } from '@/store/resume-store'

// ---------------------------------------------------------------------------
// Mocks (must be declared before imports that use them)
// ---------------------------------------------------------------------------

const mockToast = vi.fn()
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: vi.fn(() => ({
    toasts: [],
    toast: mockToast,
    dismiss: vi.fn(),
  })),
}))

const mockGeneratePDF = vi.fn().mockResolvedValue(undefined)
vi.mock('@/lib/pdf/generate-pdf', () => ({
  generatePDF: (...args: unknown[]) => mockGeneratePDF(...args),
}))

import { usePdfGenerator } from '@/hooks/use-pdf-generator'

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const validResume = {
  id: 'pdf-test-1',
  template: 'modern' as const,
  personalInfo: {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
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

beforeEach(() => {
  useResumeStore.setState({
    resume: null,
    pastStates: [],
    futureStates: [],
  })
  vi.clearAllMocks()
  mockGeneratePDF.mockResolvedValue(undefined)
})

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe('usePdfGenerator — initial state', () => {
  it('starts with status "idle"', () => {
    const { result } = renderHook(() => usePdfGenerator())
    expect(result.current.status).toBe('idle')
  })

  it('isGenerating is false initially', () => {
    const { result } = renderHook(() => usePdfGenerator())
    expect(result.current.isGenerating).toBe(false)
  })

  it('exposes downloadPDF function', () => {
    const { result } = renderHook(() => usePdfGenerator())
    expect(typeof result.current.downloadPDF).toBe('function')
  })
})

// ---------------------------------------------------------------------------
// Validation — downloadPDF when resume is missing / invalid
// ---------------------------------------------------------------------------

describe('usePdfGenerator — validation: no resume', () => {
  it('shows destructive toast when resume is null', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
  })

  it('does not call generatePDF when resume is null', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockGeneratePDF).not.toHaveBeenCalled()
  })

  it('stays in idle status when resume is null', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(result.current.status).toBe('idle')
  })
})

describe('usePdfGenerator — validation: missing fullName', () => {
  it('shows destructive toast when fullName is empty', async () => {
    useResumeStore.setState({
      resume: {
        ...validResume,
        personalInfo: { ...validResume.personalInfo, fullName: '' },
      },
      pastStates: [],
      futureStates: [],
    })

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
    expect(mockGeneratePDF).not.toHaveBeenCalled()
  })

  it('shows destructive toast when fullName is whitespace only', async () => {
    useResumeStore.setState({
      resume: {
        ...validResume,
        personalInfo: { ...validResume.personalInfo, fullName: '   ' },
      },
      pastStates: [],
      futureStates: [],
    })

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
  })
})

describe('usePdfGenerator — validation: missing email', () => {
  it('shows destructive toast when email is empty', async () => {
    useResumeStore.setState({
      resume: {
        ...validResume,
        personalInfo: { ...validResume.personalInfo, email: '' },
      },
      pastStates: [],
      futureStates: [],
    })

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
    expect(mockGeneratePDF).not.toHaveBeenCalled()
  })

  it('shows destructive toast when email is whitespace only', async () => {
    useResumeStore.setState({
      resume: {
        ...validResume,
        personalInfo: { ...validResume.personalInfo, email: '   ' },
      },
      pastStates: [],
      futureStates: [],
    })

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
  })
})

// ---------------------------------------------------------------------------
// Successful PDF generation
// ---------------------------------------------------------------------------

describe('usePdfGenerator — successful download', () => {
  beforeEach(() => {
    useResumeStore.setState({
      resume: validResume,
      pastStates: [],
      futureStates: [],
    })
  })

  it('calls generatePDF when resume has fullName and email', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockGeneratePDF).toHaveBeenCalledOnce()
  })

  it('passes resume object to generatePDF', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockGeneratePDF).toHaveBeenCalledWith(
      expect.objectContaining({
        resume: expect.objectContaining({ id: validResume.id }),
      })
    )
  })

  it('passes filename containing the person name to generatePDF', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockGeneratePDF).toHaveBeenCalledWith(
      expect.objectContaining({ filename: expect.stringContaining('Jane') })
    )
  })

  it('filename ends with _Resume.pdf', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    const call = mockGeneratePDF.mock.calls[0]?.[0] as { filename: string }
    expect(call?.filename).toMatch(/_Resume\.pdf$/)
  })

  it('sets status to "success" after successful generation', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(result.current.status).toBe('success')
  })

  it('shows success toast after generation', async () => {
    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'PDF downloaded!' })
    )
  })

  it('resets status to "idle" after 2 seconds', async () => {
    vi.useFakeTimers()

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(result.current.status).toBe('success')

    act(() => {
      vi.advanceTimersByTime(2001)
    })

    expect(result.current.status).toBe('idle')

    vi.useRealTimers()
  })
})

// ---------------------------------------------------------------------------
// Failed PDF generation
// ---------------------------------------------------------------------------

describe('usePdfGenerator — failed download', () => {
  beforeEach(() => {
    useResumeStore.setState({
      resume: validResume,
      pastStates: [],
      futureStates: [],
    })
  })

  it('sets status to "error" when generatePDF rejects', async () => {
    mockGeneratePDF.mockRejectedValueOnce(new Error('Canvas failed'))

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(result.current.status).toBe('error')
  })

  it('shows destructive toast when generation fails', async () => {
    mockGeneratePDF.mockRejectedValueOnce(new Error('Canvas failed'))

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'PDF generation failed',
        variant: 'destructive',
      })
    )
  })

  it('resets status to "idle" after 3 seconds on error', async () => {
    vi.useFakeTimers()
    mockGeneratePDF.mockRejectedValueOnce(new Error('Canvas failed'))

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(result.current.status).toBe('error')

    act(() => {
      vi.advanceTimersByTime(3001)
    })

    expect(result.current.status).toBe('idle')

    vi.useRealTimers()
  })

  it('isGenerating is false after a failed download', async () => {
    mockGeneratePDF.mockRejectedValueOnce(new Error('Canvas failed'))

    const { result } = renderHook(() => usePdfGenerator())

    await act(async () => {
      await result.current.downloadPDF()
    })

    expect(result.current.isGenerating).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// isGenerating flag
// ---------------------------------------------------------------------------

describe('usePdfGenerator — isGenerating flag', () => {
  it('isGenerating is true while PDF is being generated', async () => {
    useResumeStore.setState({
      resume: validResume,
      pastStates: [],
      futureStates: [],
    })

    // Use a promise we control to pause generation
    let resolveGeneration!: () => void
    mockGeneratePDF.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveGeneration = resolve
        })
    )

    const { result } = renderHook(() => usePdfGenerator())

    // Start download without awaiting
    let downloadPromise: Promise<void>
    act(() => {
      downloadPromise = result.current.downloadPDF()
    })

    // At this point, generation is in progress
    expect(result.current.isGenerating).toBe(true)

    // Resolve and finish
    await act(async () => {
      resolveGeneration()
      await downloadPromise
    })

    expect(result.current.isGenerating).toBe(false)
  })
})
