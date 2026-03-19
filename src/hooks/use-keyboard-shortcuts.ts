'use client'

import * as React from 'react'
import { useResumeStore } from '@/store/resume-store'

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
}

/**
 * useKeyboardShortcuts - registers keyboard shortcuts for undo, redo, and save.
 *
 * Shortcuts:
 * - Ctrl+Z / Cmd+Z        → undo
 * - Ctrl+Shift+Z / Cmd+Shift+Z → redo
 * - Ctrl+S / Cmd+S        → save to localStorage (prevents default browser save)
 */
export function useKeyboardShortcuts({
  enabled = true,
}: UseKeyboardShortcutsOptions = {}) {
  const undo = useResumeStore((state) => state.undo)
  const redo = useResumeStore((state) => state.redo)
  const saveToLocalStorage = useResumeStore((state) => state.saveToLocalStorage)

  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey

      if (!ctrlOrCmd) return

      if (event.key === 'z' || event.key === 'Z') {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
        return
      }

      if (event.key === 's' || event.key === 'S') {
        event.preventDefault()
        saveToLocalStorage()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, undo, redo, saveToLocalStorage])
}
