'use client'

import { useResumeStore } from '@/store/resume-store'
import { TemplateRenderer } from '@/components/templates/template-renderer'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobilePreviewSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function MobilePreviewSheet({
  isOpen,
  onClose,
}: MobilePreviewSheetProps) {
  const resume = useResumeStore((state) => state.resume)

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Resume Preview"
      className="fixed inset-0 z-50 flex flex-col bg-muted/95 md:hidden"
    >
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <h2 className="font-semibold text-foreground">Resume Preview</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {resume ? (
          <div className="flex justify-center overflow-hidden">
            <div
              style={{
                transform: 'scale(0.45)',
                transformOrigin: 'top left',
                width: '816px',
                minHeight: '400px',
              }}
            >
              <TemplateRenderer resume={resume} />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>
              Start filling in the form — your resume will appear here as you
              type
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
