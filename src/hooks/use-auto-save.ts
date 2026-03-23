'use client'

import * as React from 'react'
import { useResumeStore } from '@/store/resume-store'
import { toast } from '@/hooks/use-toast'

interface UseAutoSaveResult {
  lastSaved: Date | null
  isSaving: boolean
}

export function useAutoSave(debounceMs = 1000): UseAutoSaveResult {
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const resume = useResumeStore((state) => state.resume)
  const saveToLocalStorage = useResumeStore((state) => state.saveToLocalStorage)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = React.useRef(true)

  React.useEffect(() => {
    // Skip saving on the initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!resume) return

    // Clear any pending debounce timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setIsSaving(true)

    timerRef.current = setTimeout(() => {
      try {
        saveToLocalStorage()
        setLastSaved(new Date())
      } catch (err: unknown) {
        const isStorageError =
          err instanceof DOMException &&
          (err.name === 'QuotaExceededError' ||
            err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        if (isStorageError) {
          toast({
            title: 'Auto-save paused',
            description:
              "Your browser's storage is full. Export your resume as JSON to keep a backup.",
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Auto-save Failed',
            description:
              "Couldn't save your progress. Your browser may be in private mode.",
            variant: 'destructive',
          })
        }
      } finally {
        setIsSaving(false)
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [resume, debounceMs, saveToLocalStorage])

  return { lastSaved, isSaving }
}
