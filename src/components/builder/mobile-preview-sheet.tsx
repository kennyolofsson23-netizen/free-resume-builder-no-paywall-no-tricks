'use client'

import { useRef, useState, useEffect } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.42)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) {
        setScale(entry.contentRect.width / 816)
      }
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!isOpen) return

    // Save previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Move focus into modal
    closeButtonRef.current?.focus()

    const dialog = dialogRef.current
    if (!dialog) return

    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'))

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown)
      // Restore focus on close
      previousFocusRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Resume Preview"
      className="fixed inset-0 z-50 flex flex-col bg-muted/95 md:hidden"
    >
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <h2 className="font-semibold text-foreground">Resume Preview</h2>
        <Button
          ref={closeButtonRef}
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        {resume ? (
          <div
            style={{
              transformOrigin: 'top center',
              transform: `scale(${scale})`,
              width: '816px',
              marginLeft: scale < 1 ? `${(816 * scale - 816) / 2}px` : 'auto',
              marginRight: scale < 1 ? `${(816 * scale - 816) / 2}px` : 'auto',
            }}
          >
            <TemplateRenderer resume={resume} />
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
