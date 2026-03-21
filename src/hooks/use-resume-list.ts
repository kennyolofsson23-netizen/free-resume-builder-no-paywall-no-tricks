'use client'
import { useState, useCallback, useEffect } from 'react'
import { useResumeStore } from '@/store/resume-store'
import { RESUMES_STORAGE_KEY, STORAGE_KEY } from '@/lib/constants'
import { resumeSchema } from '@/lib/schemas/resume-schema'

interface ResumeListItem {
  id: string
  name: string
  template: string
  updatedAt: string
}

export function useResumeList() {
  const currentResume = useResumeStore((state) => state.resume)
  const setResume = useResumeStore((state) => state.setResume)
  const createNewResume = useResumeStore((state) => state.createNewResume)

  const [resumeList, setResumeList] = useState<ResumeListItem[]>([])

  // Load list from localStorage
  const loadList = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(RESUMES_STORAGE_KEY)
      if (stored) {
        setResumeList(JSON.parse(stored))
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    loadList()
  }, [loadList])

  // Save current resume to the list
  const saveCurrentToList = useCallback(() => {
    if (!currentResume) return
    const item: ResumeListItem = {
      id: currentResume.id,
      name: currentResume.personalInfo.fullName || 'My Resume',
      template: currentResume.template,
      updatedAt: currentResume.updatedAt,
    }
    setResumeList((prev) => {
      const existing = prev.findIndex((r) => r.id === item.id)
      const next =
        existing >= 0
          ? prev.map((r, i) => (i === existing ? item : r))
          : [...prev, item]
      try {
        localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore quota errors */
      }
      return next
    })
    // Also save full resume data keyed by ID
    try {
      localStorage.setItem(
        `resume-${currentResume.id}`,
        JSON.stringify(currentResume)
      )
    } catch {
      /* ignore */
    }
  }, [currentResume])

  // Switch to a different resume
  const switchToResume = useCallback(
    (id: string) => {
      try {
        const stored = localStorage.getItem(`resume-${id}`)
        if (stored) {
          const rawParsed: unknown = JSON.parse(stored)
          const result = resumeSchema.safeParse(rawParsed)
          if (!result.success) return
          setResume(result.data)
          try {
            localStorage.setItem(STORAGE_KEY, stored) // update active resume
          } catch {
            /* ignore quota errors */
          }
        }
      } catch {
        /* ignore */
      }
    },
    [setResume]
  )

  // Delete a resume from the list
  const deleteResume = useCallback((id: string) => {
    localStorage.removeItem(`resume-${id}`)
    setResumeList((prev) => {
      const next = prev.filter((r) => r.id !== id)
      try {
        localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore quota errors */
      }
      return next
    })
  }, [])

  // Create a brand new resume and add it to the list
  const createAndSwitch = useCallback(() => {
    // Save current first
    saveCurrentToList()
    // Create new
    createNewResume()
  }, [saveCurrentToList, createNewResume])

  return {
    resumeList,
    saveCurrentToList,
    switchToResume,
    deleteResume,
    createAndSwitch,
    loadList,
  }
}
