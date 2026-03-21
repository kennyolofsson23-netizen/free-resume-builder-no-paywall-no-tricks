'use client'
import { useEffect, useCallback } from 'react'
import { useResumeStore } from '@/store/resume-store'

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
}

export function useKeyboardShortcuts({
  enabled = true,
}: UseKeyboardShortcutsOptions = {}) {
  const undo = useResumeStore((state) => state.undo)
  const redo = useResumeStore((state) => state.redo)
  const canUndo = useResumeStore((state) => state.canUndo)
  const canRedo = useResumeStore((state) => state.canRedo)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input/textarea
      const target = e.target as HTMLElement
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        target.tagName
      )

      // navigator.userAgentData is the modern replacement for the deprecated
      // navigator.platform. Cast via intersection type because the UA Client
      // Hints API is not yet in all TypeScript lib versions.
      const nav = navigator as Navigator & {
        userAgentData?: { platform?: string }
      }
      const isMac = (
        typeof nav.userAgentData?.platform === 'string'
          ? nav.userAgentData.platform
          : navigator.userAgent
      )
        .toLowerCase()
        .includes('mac')
      const modKey = isMac ? e.metaKey : e.ctrlKey

      if (modKey && e.key === 'z' && !e.shiftKey) {
        // Only intercept Ctrl+Z when NOT in text input
        // (allow native text undo in inputs)
        if (!isInputFocused) {
          e.preventDefault()
          if (canUndo()) undo()
        }
      }

      if (
        (modKey && e.shiftKey && e.key === 'z') ||
        (modKey && e.key === 'y')
      ) {
        if (!isInputFocused) {
          e.preventDefault()
          if (canRedo()) redo()
        }
      }
    },
    [undo, redo, canUndo, canRedo]
  )

  useEffect(() => {
    if (!enabled) return
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])

  return { undo, redo, canUndo, canRedo }
}
