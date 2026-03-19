'use client'

import * as React from 'react'
import {
  Download,
  FileText,
  Share2,
  Upload,
  FileDown,
  Plus,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Loader2,
  Check,
} from 'lucide-react'
import { useResumeStore } from '@/store/resume-store'
import { TEMPLATE_LIST } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import { usePdfGenerator } from '@/hooks/use-pdf-generator'
import { useShareableLink } from '@/hooks/use-shareable-link'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { toast } from '@/hooks/use-toast'
import type { ResumeTemplate } from '@/types/resume'

export function BuilderToolbar() {
  const resume = useResumeStore((state) => state.resume)
  const updateTemplate = useResumeStore((state) => state.updateTemplate)
  const updateAccentColor = useResumeStore((state) => state.updateAccentColor)
  const createNewResume = useResumeStore((state) => state.createNewResume)
  const exportAsJSON = useResumeStore((state) => state.exportAsJSON)
  const importFromJSON = useResumeStore((state) => state.importFromJSON)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { downloadPDF, status: pdfStatus, isGenerating } = usePdfGenerator()
  const { generateLink, isCopied } = useShareableLink()
  const { undo, redo, canUndo, canRedo } = useKeyboardShortcuts({
    enabled: true,
  })

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTemplate(e.target.value as ResumeTemplate)
  }

  const handleNewResume = () => {
    if (
      confirm(
        'Start a new resume? Your current resume will be saved in the list — nothing will be lost.'
      )
    ) {
      createNewResume()
    }
  }

  const handleExportJSON = () => {
    const json = exportAsJSON()
    if (!json) return
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const name = resume?.personalInfo?.fullName?.trim() || 'resume'
    a.href = url
    a.download = `${name.replace(/[^a-z0-9_\- ]/gi, '_')}_resume.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: 'Resume exported',
      description:
        'Saved as a JSON file. Import it anytime to pick up where you left off.',
    })
  }

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const success = importFromJSON(text)
      if (success) {
        toast({
          title: 'Resume imported',
          description:
            'All your data has been loaded. Everything looks just as you left it.',
        })
      } else {
        toast({
          title: 'Import failed',
          description:
            'That file couldn\u2019t be read. Make sure it\u2019s a JSON file exported from this builder \u2014 nothing else was changed.',
          variant: 'destructive',
        })
      }
    }
    reader.readAsText(file)
    // Reset input so same file can be imported again
    e.target.value = ''
  }

  // Templates that support accent colors
  const supportsAccentColor = resume?.template
    ? ['modern', 'creative', 'professional'].includes(resume.template)
    : false

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background px-4 py-2">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground hidden sm:inline">
          Free Resume Builder
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo()}
            aria-label="Undo (Ctrl+Z)"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo()}
            aria-label="Redo (Ctrl+Shift+Z)"
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Separator */}
        <div
          className="hidden h-5 w-px bg-border sm:block"
          aria-hidden="true"
        />

        {/* Template selector */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="template-selector"
            className="text-xs text-muted-foreground whitespace-nowrap hidden md:inline"
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

        {/* Accent color picker (only for templates that support it) */}
        {supportsAccentColor && (
          <ColorPicker
            value={resume?.accentColor ?? '#2563eb'}
            onChange={updateAccentColor}
          />
        )}

        {/* Separator */}
        <div
          className="hidden h-5 w-px bg-border sm:block"
          aria-hidden="true"
        />

        {/* Share link */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateLink}
          aria-label="Copy shareable link"
          title="Share"
        >
          {isCopied ? (
            <>
              <LinkIcon className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </Button>

        {/* Import JSON */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="sr-only"
          onChange={handleImportJSON}
          aria-label="Import JSON"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Import resume from JSON file"
          title="Import resume from JSON file"
        >
          <Upload className="mr-1.5 h-4 w-4" />
          <span className="hidden md:inline">Import</span>
        </Button>

        {/* Export JSON */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleExportJSON}
          aria-label="Export resume as JSON backup"
          title="Export resume as JSON backup"
        >
          <FileDown className="mr-1.5 h-4 w-4" />
          <span className="hidden md:inline">Export</span>
        </Button>

        {/* New Resume */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleNewResume}
          aria-label="Create a new resume"
          title="Create a new resume"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span className="hidden md:inline">New</span>
        </Button>

        {/* Separator */}
        <div
          className="hidden h-5 w-px bg-border sm:block"
          aria-hidden="true"
        />

        {/* Download PDF button */}
        <Button
          type="button"
          size="sm"
          onClick={downloadPDF}
          disabled={pdfStatus === 'generating'}
          aria-label="Download PDF"
        >
          {pdfStatus === 'generating' && (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          )}
          {pdfStatus === 'success' && <Check className="mr-1.5 h-4 w-4" />}
          {(pdfStatus === 'idle' || pdfStatus === 'error') && (
            <Download className="mr-1.5 h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {pdfStatus === 'generating'
              ? 'Building your PDF…'
              : pdfStatus === 'success'
                ? 'PDF downloaded!'
                : pdfStatus === 'error'
                  ? 'Try again'
                  : 'Download PDF'}
          </span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>
    </header>
  )
}
