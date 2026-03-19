'use client'

import * as React from 'react'
import { useResumeStore } from '@/store/resume-store'
import { BuilderLayout } from '@/components/builder/builder-layout'
import { TEMPLATE_LIST } from '@/lib/constants'
import type { ResumeTemplate } from '@/types/resume'

export default function BuilderPage() {
  const resume = useResumeStore((state) => state.resume)
  const loadFromLocalStorage = useResumeStore(
    (state) => state.loadFromLocalStorage
  )
  const updateTemplate = useResumeStore((state) => state.updateTemplate)

  React.useEffect(() => {
    // Load from localStorage (creates new resume if nothing stored)
    loadFromLocalStorage()
  }, [loadFromLocalStorage])

  React.useEffect(() => {
    if (!resume) return

    // Apply ?template=X URL param if valid
    const searchParams = new URLSearchParams(window.location.search)
    const templateParam = searchParams.get('template')
    if (templateParam) {
      const isValid = TEMPLATE_LIST.some((t) => t.id === templateParam)
      if (isValid) {
        updateTemplate(templateParam as ResumeTemplate)
      }
    }
  }, [resume, updateTemplate])

  if (!resume) {
    return (
      <main
        id="main-content"
        className="flex min-h-screen items-center justify-center bg-background"
      >
        <p className="text-muted-foreground text-sm">Loading your resume…</p>
      </main>
    )
  }

  return <BuilderLayout />
}
