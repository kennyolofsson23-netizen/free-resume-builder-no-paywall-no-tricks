/**
 * Tests for useKeyboardShortcuts hook.
 * Verifies Ctrl+Z (undo), Ctrl+Shift+Z (redo), Ctrl+Y (redo),
 * and correct behavior when typing in form fields.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResumeStore } from '@/store/resume-store'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

beforeEach(() => {
  useResumeStore.setState({
    resume: null,
    pastStates: [],
    futureStates: [],
  })
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Dispatch a keydown event on window (no focused form element).
 * target.tagName will be undefined → hook treats it as a non-input context.
 */
function dispatchWindowKeydown(
  key: string,
  mods: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean } = {}
) {
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      ctrlKey: mods.ctrlKey ?? false,
      metaKey: mods.metaKey ?? false,
      shiftKey: mods.shiftKey ?? false,
      bubbles: true,
    })
  )
}

/**
 * Dispatch a keydown event on a specific element so the hook sees
 * that element as e.target (simulates typing in a form field).
 */
function dispatchElementKeydown(
  el: HTMLElement,
  key: string,
  mods: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean } = {}
) {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      ctrlKey: mods.ctrlKey ?? false,
      metaKey: mods.metaKey ?? false,
      shiftKey: mods.shiftKey ?? false,
      bubbles: true,
    })
  )
}

// ---------------------------------------------------------------------------
// Return values
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — return values', () => {
  it('returns undo, redo, canUndo, canRedo functions', () => {
    useResumeStore.getState().createNewResume()
    const { result } = renderHook(() => useKeyboardShortcuts())

    expect(typeof result.current.undo).toBe('function')
    expect(typeof result.current.redo).toBe('function')
    expect(typeof result.current.canUndo).toBe('function')
    expect(typeof result.current.canRedo).toBe('function')
  })

  it('canUndo returns false on a fresh resume', () => {
    useResumeStore.getState().createNewResume()
    const { result } = renderHook(() => useKeyboardShortcuts())
    expect(result.current.canUndo()).toBe(false)
  })

  it('canRedo returns false on a fresh resume', () => {
    useResumeStore.getState().createNewResume()
    const { result } = renderHook(() => useKeyboardShortcuts())
    expect(result.current.canRedo()).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Ctrl+Z — undo
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — Ctrl+Z (undo)', () => {
  it('Ctrl+Z triggers undo when there is history', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts())

    act(() => {
      dispatchWindowKeydown('z', { ctrlKey: true })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })

  it('Ctrl+Z does nothing when there is no undo history', () => {
    useResumeStore.getState().createNewResume()

    renderHook(() => useKeyboardShortcuts())

    // Should not throw
    act(() => {
      dispatchWindowKeydown('z', { ctrlKey: true })
    })

    // Still at initial state
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })

  it('Ctrl+Z can be called multiple times in sequence', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'First' })
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Second' })

    renderHook(() => useKeyboardShortcuts())

    act(() => {
      dispatchWindowKeydown('z', { ctrlKey: true })
    })
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'First'
    )

    act(() => {
      dispatchWindowKeydown('z', { ctrlKey: true })
    })
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })
})

// ---------------------------------------------------------------------------
// Ctrl+Shift+Z — redo
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — Ctrl+Shift+Z (redo)', () => {
  it('Ctrl+Shift+Z triggers redo after an undo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })
    useResumeStore.getState().undo()

    renderHook(() => useKeyboardShortcuts())

    act(() => {
      dispatchWindowKeydown('z', { ctrlKey: true, shiftKey: true })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })

  it('Ctrl+Shift+Z does nothing when there is no redo history', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts())

    // No undo has been performed, so redo stack is empty
    act(() => {
      dispatchWindowKeydown('z', { ctrlKey: true, shiftKey: true })
    })

    // Still 'Jane'
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })
})

// ---------------------------------------------------------------------------
// Ctrl+Y — redo (Windows convention)
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — Ctrl+Y (redo)', () => {
  it('Ctrl+Y triggers redo after an undo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Redo Me' })
    useResumeStore.getState().undo()

    renderHook(() => useKeyboardShortcuts())

    act(() => {
      dispatchWindowKeydown('y', { ctrlKey: true })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Redo Me'
    )
  })

  it('Ctrl+Y does nothing when redo stack is empty', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts())

    act(() => {
      dispatchWindowKeydown('y', { ctrlKey: true })
    })

    // Unchanged
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })
})

// ---------------------------------------------------------------------------
// Input element guard — does NOT intercept when typing in form fields
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — does not intercept inside INPUT', () => {
  it('Ctrl+Z from INPUT element does not trigger undo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts())

    const input = document.createElement('input')
    document.body.appendChild(input)

    act(() => {
      dispatchElementKeydown(input, 'z', { ctrlKey: true })
    })

    document.body.removeChild(input)

    // Jane should still be there — undo was NOT triggered
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })

  it('Ctrl+Z from TEXTAREA element does not trigger undo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts())

    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)

    act(() => {
      dispatchElementKeydown(textarea, 'z', { ctrlKey: true })
    })

    document.body.removeChild(textarea)

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })

  it('Ctrl+Z from SELECT element does not trigger undo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts())

    const select = document.createElement('select')
    document.body.appendChild(select)

    act(() => {
      dispatchElementKeydown(select, 'z', { ctrlKey: true })
    })

    document.body.removeChild(select)

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })

  it('Ctrl+Shift+Z from INPUT does not trigger redo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })
    useResumeStore.getState().undo()

    renderHook(() => useKeyboardShortcuts())

    const input = document.createElement('input')
    document.body.appendChild(input)

    act(() => {
      dispatchElementKeydown(input, 'z', { ctrlKey: true, shiftKey: true })
    })

    document.body.removeChild(input)

    // Redo was NOT triggered — should still be empty
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })
})

// ---------------------------------------------------------------------------
// Disabled mode
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — disabled option', () => {
  it('does not register a listener when enabled=false', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts({ enabled: false }))

    act(() => {
      dispatchWindowKeydown('z', { ctrlKey: true })
    })

    // Should still be 'Jane' because shortcuts are disabled
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })

  it('still returns undo/redo even when disabled', () => {
    useResumeStore.getState().createNewResume()
    const { result } = renderHook(() =>
      useKeyboardShortcuts({ enabled: false })
    )
    expect(typeof result.current.undo).toBe('function')
    expect(typeof result.current.redo).toBe('function')
  })
})

// ---------------------------------------------------------------------------
// Unrelated keys are ignored
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — unrelated keys are ignored', () => {
  it('Ctrl+S does not trigger anything', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts())

    act(() => {
      dispatchWindowKeydown('s', { ctrlKey: true })
    })

    // No change
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })

  it('pressing "z" without Ctrl does not trigger undo', () => {
    useResumeStore.getState().createNewResume()
    useResumeStore.getState().updatePersonalInfo({ fullName: 'Jane' })

    renderHook(() => useKeyboardShortcuts())

    act(() => {
      dispatchWindowKeydown('z')
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('Jane')
  })
})
