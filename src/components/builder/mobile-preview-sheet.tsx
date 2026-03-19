'use client'

import { X } from 'lucide-react'
import { useResumeStore } from '@/store/resume-store'
import { TemplateRenderer } from '@/components/templates/template-renderer'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface MobilePreviewSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function MobilePreviewSheet({
  isOpen,
  onClose,
}: MobilePreviewSheetProps) {
  const resume = useResumeStore((state) => state.resume)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-full max-w-screen-sm flex-col overflow-hidden p-0 sm:rounded-lg">
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-semibold">
              Resume Preview
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-muted/40 p-4">
          {!resume ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No resume data yet
              </p>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[600px] bg-white shadow-md">
              <TemplateRenderer resume={resume} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
