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
    <div className="fixed inset-0 z-50 flex flex-col bg-muted/95 md:hidden">
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
          <div
            style={{
              transform: 'scale(0.45)',
              transformOrigin: 'top center',
              width: '816px',
              marginLeft: '-220px',
            }}
          >
            <TemplateRenderer resume={resume} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>Fill in your details to preview your resume</p>
          </div>
        )}
      </div>
    </div>
  )
}
