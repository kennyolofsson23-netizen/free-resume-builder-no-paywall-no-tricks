'use client'

import { useRef, useEffect, useState } from 'react'
import { useResumeStore } from '@/store/resume-store'
import { TemplateRenderer } from '@/components/templates/template-renderer'

export function PreviewPanel() {
  const resume = useResumeStore((state) => state.resume)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48 // subtract padding
        const newScale = Math.min(1, containerWidth / 816)
        setScale(newScale)
      }
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (!resume) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-muted/40">
        {/* Scale indicator */}
        <div className="shrink-0 border-b border-border bg-background px-4 py-2">
          <p className="text-xs text-muted-foreground">
            Live Preview &mdash; exactly what you&apos;ll download
          </p>
        </div>
        <div
          ref={containerRef}
          className="flex flex-1 items-center justify-center bg-muted/30 p-6"
        >
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Start typing — your resume will appear here instantly
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!resume.personalInfo.fullName) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-muted/40">
        {/* Scale indicator */}
        <div className="shrink-0 border-b border-border bg-background px-4 py-2">
          <p className="text-xs text-muted-foreground">
            Live Preview &mdash; exactly what you&apos;ll download
          </p>
        </div>
        <div
          ref={containerRef}
          className="flex flex-1 items-center justify-center bg-muted/30 p-6"
        >
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">
              Your resume updates as you type
            </p>
            <p className="text-sm">
              Enter your name in Personal Info to see it take shape
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-muted/40">
      {/* Scale indicator */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-2">
        <p className="text-xs text-muted-foreground">
          Live Preview &mdash; exactly what you&apos;ll download
        </p>
      </div>

      {/* Preview Area */}
      <div
        ref={containerRef}
        className="flex flex-1 items-start justify-center overflow-y-auto bg-muted/30 p-6"
      >
        <div
          style={{
            transformOrigin: 'top center',
            transform: `scale(${scale})`,
            width: '816px',
            marginLeft: scale < 1 ? `${(816 * scale - 816) / 2}px` : 'auto',
            marginRight: scale < 1 ? `${(816 * scale - 816) / 2}px` : 'auto',
          }}
        >
          <div className="shadow-xl">
            <TemplateRenderer resume={resume} />
          </div>
        </div>
      </div>
    </div>
  )
}
