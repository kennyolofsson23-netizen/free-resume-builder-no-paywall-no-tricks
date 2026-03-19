'use client'
import { useState, useCallback, useEffect } from 'react'
import { useResumeStore } from '@/store/resume-store'
import { RESUMES_STORAGE_KEY, STORAGE_KEY } from '@/lib/constants'
import type { Resume } from '@/types/resume'

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
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { loadList() }, [loadList])

  // Save current resume to the list
  const saveCurrentToList = useCallback(() => {
    if (!currentResume) return
    const item: ResumeListItem = {
      id: currentResume.id,
      name: currentResume.personalInfo.fullName || 'Untitled Resume',
      template: currentResume.template,
      updatedAt: currentResume.updatedAt,
    }
    setResumeList((prev) => {
      const existing = prev.findIndex((r) => r.id === item.id)
      const next = existing >= 0
        ? prev.map((r, i) => (i === existing ? item : r))
        : [...prev, item]
      localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(next))
      return next
    })
    // Also save full resume data keyed by ID
    try {
      localStorage.setItem(`resume-${currentResume.id}`, JSON.stringify(currentResume))
    } catch { /* ignore */ }
  }, [currentResume])

  // Switch to a different resume
  const switchToResume = useCallback((id: string) => {
    try {
      const stored = localStorage.getItem(`resume-${id}`)
      if (stored) {
        const parsed = JSON.parse(stored) as Resume
        setResume(parsed)
        localStorage.setItem(STORAGE_KEY, stored) // update active resume
      }
    } catch { /* ignore */ }
  }, [setResume])

  // Delete a resume from the list
  const deleteResume = useCallback((id: string) => {
    localStorage.removeItem(`resume-${id}`)
    setResumeList((prev) => {
      const next = prev.filter((r) => r.id !== id)
      localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(next))
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
