/**
 * Tests for src/hooks/use-keyboard-shortcuts.ts
 *
 * Covers:
 * - Ctrl+Z fires undo when not in a text input
 * - Ctrl+Y / Ctrl+Shift+Z fires redo when not in a text input
 * - Shortcuts are NOT intercepted when INPUT / TEXTAREA / SELECT is focused
 * - Shortcuts do nothing when disabled (enabled: false)
 * - Hook returns undo / redo / canUndo / canRedo from the store
 * - Event listener is removed on unmount
 */
/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResumeStore } from '@/store/resume-store'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

// ---------------------------------------------------------------------------
// Store reset before every test
// ---------------------------------------------------------------------------
beforeEach(() => {
  useResumeStore.setState({ resume: null, pastStates: [], futureStates: [] })
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Helper — dispatch a synthetic keydown on window, optionally with a fake target
// ---------------------------------------------------------------------------
function fireKey(
  key: string,
  opts: {
    ctrlKey?: boolean
    metaKey?: boolean
    shiftKey?: boolean
    targetTag?: 'BODY' | 'INPUT' | 'TEXTAREA' | 'SELECT'
  } = {}
) {
  const {
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    targetTag = 'BODY',
  } = opts

  // Build a fake target element whose tagName matches targetTag
  const fakeTarget = { tagName: targetTag }

  const event = new KeyboardEvent('keydown', {
    key,
    ctrlKey,
    metaKey,
    shiftKey,
    bubbles: true,
    cancelable: true,
  })

  // Override the read-only `target` property so the hook sees the right tagName
  Object.defineProperty(event, 'target', {
    writable: false,
    value: fakeTarget,
  })

  window.dispatchEvent(event)
}

// ---------------------------------------------------------------------------
// Return value tests
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — return values', () => {
  it('returns undo, redo, canUndo, canRedo functions', () => {
    const { result } = renderHook(() => useKeyboardShortcuts())
    expect(typeof result.current.undo).toBe('function')
    expect(typeof result.current.redo).toBe('function')
    expect(typeof result.current.canUndo).toBe('function')
    expect(typeof result.current.canRedo).toBe('function')
  })

  it('canUndo is false on fresh resume', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })
    const { result } = renderHook(() => useKeyboardShortcuts())
    expect(result.current.canUndo()).toBe(false)
  })

  it('canUndo is true after a change', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    })
    const { result } = renderHook(() => useKeyboardShortcuts())
    expect(result.current.canUndo()).toBe(true)
  })

  it('canRedo is false before any undo', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
    })
    const { result } = renderHook(() => useKeyboardShortcuts())
    expect(result.current.canRedo()).toBe(false)
  })

  it('canRedo is true after an undo', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Test' })
      useResumeStore.getState().undo()
    })
    const { result } = renderHook(() => useKeyboardShortcuts())
    expect(result.current.canRedo()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Ctrl+Z — undo
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — Ctrl+Z undo', () => {
  it('Ctrl+Z triggers undo when canUndo is true (body focused)', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Before Undo' })
    })
    renderHook(() => useKeyboardShortcuts())

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Before Undo'
    )

    act(() => {
      fireKey('z', { ctrlKey: true, targetTag: 'BODY' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })

  it('Ctrl+Z is a no-op when canUndo is false', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
    })
    renderHook(() => useKeyboardShortcuts())

    const resumeBefore = useResumeStore.getState().resume

    act(() => {
      fireKey('z', { ctrlKey: true, targetTag: 'BODY' })
    })

    expect(useResumeStore.getState().resume).toEqual(resumeBefore)
  })

  it('Ctrl+Z does NOT undo when INPUT is focused', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Keep Me' })
    })
    renderHook(() => useKeyboardShortcuts())

    act(() => {
      fireKey('z', { ctrlKey: true, targetTag: 'INPUT' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Keep Me'
    )
  })

  it('Ctrl+Z does NOT undo when TEXTAREA is focused', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore
        .getState()
        .updatePersonalInfo({ fullName: 'Textarea Safe' })
    })
    renderHook(() => useKeyboardShortcuts())

    act(() => {
      fireKey('z', { ctrlKey: true, targetTag: 'TEXTAREA' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Textarea Safe'
    )
  })

  it('Ctrl+Z does NOT undo when SELECT is focused', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Select Safe' })
    })
    renderHook(() => useKeyboardShortcuts())

    act(() => {
      fireKey('z', { ctrlKey: true, targetTag: 'SELECT' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Select Safe'
    )
  })
})

// ---------------------------------------------------------------------------
// Ctrl+Y — redo
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — Ctrl+Y redo', () => {
  it('Ctrl+Y triggers redo when canRedo is true', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Redo Me' })
      useResumeStore.getState().undo()
    })
    renderHook(() => useKeyboardShortcuts())

    act(() => {
      fireKey('y', { ctrlKey: true, targetTag: 'BODY' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Redo Me'
    )
  })

  it('Ctrl+Y is a no-op when canRedo is false', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'No Redo' })
    })
    renderHook(() => useKeyboardShortcuts())

    const resumeBefore = useResumeStore.getState().resume

    act(() => {
      fireKey('y', { ctrlKey: true, targetTag: 'BODY' })
    })

    expect(useResumeStore.getState().resume).toEqual(resumeBefore)
  })

  it('Ctrl+Y does NOT redo when INPUT is focused', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Input Guard' })
      useResumeStore.getState().undo()
    })
    renderHook(() => useKeyboardShortcuts())

    act(() => {
      fireKey('y', { ctrlKey: true, targetTag: 'INPUT' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })
})

// ---------------------------------------------------------------------------
// Ctrl+Shift+Z — redo (alternative shortcut)
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — Ctrl+Shift+Z redo', () => {
  it('Ctrl+Shift+Z triggers redo when canRedo is true', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'ShiftZ Redo' })
      useResumeStore.getState().undo()
    })
    renderHook(() => useKeyboardShortcuts())

    act(() => {
      fireKey('z', { ctrlKey: true, shiftKey: true, targetTag: 'BODY' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'ShiftZ Redo'
    )
  })

  it('Ctrl+Shift+Z does NOT redo when TEXTAREA is focused', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Shift Guard' })
      useResumeStore.getState().undo()
    })
    renderHook(() => useKeyboardShortcuts())

    act(() => {
      fireKey('z', { ctrlKey: true, shiftKey: true, targetTag: 'TEXTAREA' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })
})

// ---------------------------------------------------------------------------
// enabled: false — disables all interception
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — enabled: false', () => {
  it('Ctrl+Z does not trigger undo when disabled', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Disabled' })
    })
    renderHook(() => useKeyboardShortcuts({ enabled: false }))

    act(() => {
      fireKey('z', { ctrlKey: true, targetTag: 'BODY' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Disabled'
    )
  })

  it('Ctrl+Y does not trigger redo when disabled', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore
        .getState()
        .updatePersonalInfo({ fullName: 'Disabled Redo' })
      useResumeStore.getState().undo()
    })
    renderHook(() => useKeyboardShortcuts({ enabled: false }))

    act(() => {
      fireKey('y', { ctrlKey: true, targetTag: 'BODY' })
    })

    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe('')
  })
})

// ---------------------------------------------------------------------------
// Cleanup: event listener removed on unmount
// ---------------------------------------------------------------------------

describe('useKeyboardShortcuts — cleanup on unmount', () => {
  it('does not respond to Ctrl+Z after hook is unmounted', () => {
    act(() => {
      useResumeStore.getState().createNewResume()
      useResumeStore.getState().updatePersonalInfo({ fullName: 'Pre-Unmount' })
    })
    const { unmount } = renderHook(() => useKeyboardShortcuts())

    unmount()

    act(() => {
      fireKey('z', { ctrlKey: true, targetTag: 'BODY' })
    })

    // Undo should NOT have fired after unmount
    expect(useResumeStore.getState().resume?.personalInfo.fullName).toBe(
      'Pre-Unmount'
    )
  })
})
