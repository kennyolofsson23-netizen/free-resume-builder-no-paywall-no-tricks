import { encodeResumeData, decodeResumeData } from '@/lib/sharing/url-codec'
import { SHARE_COMPRESSION_THRESHOLD } from '@/lib/constants'

// ---------------------------------------------------------------------------
// url-codec unit tests
// ---------------------------------------------------------------------------

describe('encodeResumeData / decodeResumeData — roundtrip', () => {
  const sampleData = {
    id: 'test-123',
    template: 'modern',
    personalInfo: {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
    },
  }

  it('roundtrips small data with j: prefix', () => {
    const encoded = encodeResumeData(sampleData)
    expect(encoded.startsWith('j:')).toBe(true)
    const decoded = decodeResumeData(encoded)
    expect(decoded).toEqual(sampleData)
  })

  it('roundtrips large data with c: prefix (compressed)', () => {
    // Build an object whose JSON representation exceeds the threshold
    const largeData = {
      id: 'large-123',
      template: 'modern',
      personalInfo: { fullName: 'Big Resume' },
      // Pad to exceed the compression threshold
      padding: 'x'.repeat(SHARE_COMPRESSION_THRESHOLD + 100),
    }
    const encoded = encodeResumeData(largeData)
    expect(encoded.startsWith('c:')).toBe(true)
    const decoded = decodeResumeData(encoded)
    expect(decoded).toEqual(largeData)
  })

  it('returns null for invalid encoded string', () => {
    expect(decodeResumeData('totally-invalid')).toBeNull()
  })

  it('returns null for corrupted c: payload', () => {
    // "c:" followed by garbage that is not valid deflate data
    expect(decodeResumeData('c:!!!not-valid-base64!!!')).toBeNull()
  })

  it('returns null for corrupted j: payload', () => {
    // "j:" followed by base64 that decodes to non-JSON
    const b64 = btoa('not json at all')
    expect(decodeResumeData('j:' + b64)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(decodeResumeData('')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// useShareableLink hook tests
// ---------------------------------------------------------------------------

import { renderHook, act } from '@testing-library/react'
import { useResumeStore } from '@/store/resume-store'

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: vi.fn(() => ({ toasts: [], toast: vi.fn(), dismiss: vi.fn() })),
}))

import { useShareableLink } from '@/hooks/use-shareable-link'
import { toast } from '@/hooks/use-toast'

beforeEach(() => {
  useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
  vi.clearAllMocks()
})

describe('useShareableLink', () => {
  it('copies URL to clipboard and sets isCopied=true', async () => {
    // Set up a valid resume
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'Test User',
      email: 'test@example.com',
    })

    const clipboardWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: clipboardWriteText },
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useShareableLink())

    await act(async () => {
      await result.current.generateLink()
    })

    expect(clipboardWriteText).toHaveBeenCalledOnce()
    expect(result.current.isCopied).toBe(true)
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Link copied to clipboard!' })
    )
  })

  it('shows error toast when no resume is available', async () => {
    // No resume in store
    const { result } = renderHook(() => useShareableLink())

    await act(async () => {
      await result.current.generateLink()
    })

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
    expect(result.current.isCopied).toBe(false)
  })

  it('shows error toast when clipboard write fails', async () => {
    useResumeStore.getState().createNewResume()

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')),
      },
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useShareableLink())

    await act(async () => {
      await result.current.generateLink()
    })

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    )
    expect(result.current.isCopied).toBe(false)
  })

  it('resets isCopied after 2 seconds', async () => {
    vi.useFakeTimers()

    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({
      fullName: 'Timer Test',
      email: 'timer@example.com',
    })

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useShareableLink())

    await act(async () => {
      await result.current.generateLink()
    })

    expect(result.current.isCopied).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.isCopied).toBe(false)

    vi.useRealTimers()
  })
})
