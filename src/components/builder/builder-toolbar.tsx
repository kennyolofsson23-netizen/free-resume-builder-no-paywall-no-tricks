'use client'

import * as React from 'react'
import { Download, FileText } from 'lucide-react'
import { useResumeStore } from '@/store/resume-store'
import { TEMPLATE_LIST } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import type { ResumeTemplate } from '@/types/resume'

export function BuilderToolbar() {
  const resume = useResumeStore((state) => state.resume)
  const updateTemplate = useResumeStore((state) => state.updateTemplate)

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTemplate(e.target.value as ResumeTemplate)
  }

  const handleDownloadPDF = () => {
    // Stub: full implementation in F004
    window.print()
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-2">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground hidden sm:inline">
          Resume Builder
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Template selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="template-selector"
            className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline"
          >
            Template:
          </label>
          <select
            id="template-selector"
            value={resume?.template ?? 'modern'}
            onChange={handleTemplateChange}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Select resume template"
          >
            {TEMPLATE_LIST.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Download PDF button (stub) */}
        <Button
          type="button"
          size="sm"
          onClick={handleDownloadPDF}
          aria-label="Download PDF"
        >
          <Download className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>
    </header>
  )
}
