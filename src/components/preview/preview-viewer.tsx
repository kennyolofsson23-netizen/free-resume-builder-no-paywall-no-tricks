'use client'

import type { Resume } from '@/types/resume'
import { TemplateRenderer } from '@/components/templates/template-renderer'
import { cn } from '@/lib/cn'

interface PreviewViewerProps {
  resume: Resume
}

export function PreviewViewer({ resume }: PreviewViewerProps) {
  return (
    <div className={cn('min-h-screen bg-gray-100 flex items-start justify-center py-8 px-4')}>
      <div
        className={cn(
          'resume-preview',
          'bg-white shadow-xl w-full max-w-[816px]',
          'min-h-[1056px]'
        )}
      >
        <TemplateRenderer resume={resume} />
      </div>
    </div>
  )
}
