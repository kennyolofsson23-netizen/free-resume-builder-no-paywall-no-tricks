import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResumeStore } from '@/store/resume-store'

// Mock the toast function before importing the hook
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: vi.fn(() => ({ toasts: [], toast: vi.fn(), dismiss: vi.fn() })),
}))

// Import after mocking
import { useAutoSave } from '@/hooks/use-auto-save'
import { toast } from '@/hooks/use-toast'

beforeEach(() => {
  useResumeStore.setState({
    resume: null,
    pastStates: [],
    futureStates: [],
  })
  vi.clearAllMocks()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useAutoSave', () => {
  it('calls saveToLocalStorage after debounce when resume changes', async () => {
    const saveSpy = vi.spyOn(useResumeStore.getState(), 'saveToLocalStorage')

    // Create a resume to start
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const { result } = renderHook(() => useAutoSave(500))

    // Initially not saving
    expect(result.current.isSaving).toBe(false)

    // Trigger a resume change
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Test User' })
    })

    // Advance timers past the debounce
    await act(async () => {
      vi.advanceTimersByTime(600)
    })

    expect(saveSpy).toHaveBeenCalled()
    expect(result.current.lastSaved).toBeInstanceOf(Date)
  })

  it('debounces multiple rapid changes into a single save', async () => {
    const saveSpy = vi.spyOn(useResumeStore.getState(), 'saveToLocalStorage')

    act(() => {
      useResumeStore.getState().createNewResume()
    })

    renderHook(() => useAutoSave(500))

    // Make several rapid changes
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'A' })
    })
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'AB' })
    })
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'ABC' })
    })

    // Advance only partway through the debounce
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Save should not have been called yet
    expect(saveSpy).not.toHaveBeenCalled()

    // Advance past the debounce
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Should have been called once (debounced)
    expect(saveSpy).toHaveBeenCalledTimes(1)
  })

  it('shows toast warning when save fails', async () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    // Make saveToLocalStorage throw
    vi.spyOn(
      useResumeStore.getState(),
      'saveToLocalStorage'
    ).mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    renderHook(() => useAutoSave(500))

    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Fail Test' })
    })

    await act(async () => {
      vi.advanceTimersByTime(600)
    })

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Could not save. Storage may be full.',
        variant: 'destructive',
      })
    )
  })
})
