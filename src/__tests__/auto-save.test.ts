/// <reference types="vitest/globals" />
import { vi } from 'vitest'
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
  it('calls saveToLocalStorage after debounce when resume changes', () => {
    // Render hook first so subscription is set up before store mutations
    const { result } = renderHook(() => useAutoSave(500))

    // Initially not saving
    expect(result.current.isSaving).toBe(false)

    // Create a resume (this will be picked up by the hook's subscription)
    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const saveSpy = vi.spyOn(useResumeStore.getState(), 'saveToLocalStorage')

    // Trigger a resume change
    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Test User' })
    })

    // Advance timers past the debounce
    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(saveSpy).toHaveBeenCalled()
    expect(result.current.lastSaved).toBeInstanceOf(Date)
  })

  it('debounces multiple rapid changes into a single save', () => {
    // Render hook first so subscription is set up before store mutations
    renderHook(() => useAutoSave(500))

    act(() => {
      useResumeStore.getState().createNewResume()
    })

    const saveSpy = vi.spyOn(useResumeStore.getState(), 'saveToLocalStorage')

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
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Should have been called once (debounced)
    expect(saveSpy).toHaveBeenCalledTimes(1)
  })

  it('shows toast warning when save fails due to QuotaExceededError', () => {
    // Render hook first so subscription is set up before store mutations
    renderHook(() => useAutoSave(500))

    act(() => {
      useResumeStore.getState().createNewResume()
    })

    // Make saveToLocalStorage throw a QuotaExceededError DOMException
    vi.spyOn(
      useResumeStore.getState(),
      'saveToLocalStorage'
    ).mockImplementation(() => {
      const err = new DOMException('QuotaExceededError', 'QuotaExceededError')
      throw err
    })

    act(() => {
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Fail Test' })
    })

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
      })
    )
  })
})
