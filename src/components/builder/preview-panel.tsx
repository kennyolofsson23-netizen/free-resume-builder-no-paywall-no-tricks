'use client'

import { useResumeStore } from '@/store/resume-store'
import { TemplateRenderer } from '@/components/templates/template-renderer'

export function PreviewPanel() {
  const resume = useResumeStore((state) => state.resume)

  return (
    <div className="flex h-full flex-col overflow-hidden bg-muted/40">
      {/* Scale indicator */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-2">
        <p className="text-xs text-muted-foreground">
          Live Preview &mdash; Scale to fit
        </p>
      </div>

      {/* Preview Area */}
      <div className="flex flex-1 items-start justify-center overflow-y-auto p-6">
        {!resume ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">No resume data yet</p>
          </div>
        ) : (
          <div
            id="resume-preview"
            className="w-full max-w-[680px] bg-white shadow-xl ring-1 ring-black/5"
            style={{ minHeight: '880px' }}
          >
            <TemplateRenderer resume={resume} />
          </div>
        )}
      </div>
    </div>
  )
}
