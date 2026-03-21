'use client'

import * as React from 'react'
import { ChevronDown, ChevronRight, GripVertical, Trash2 } from 'lucide-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

interface SectionEntryProps {
  title: string
  subtitle?: string
  onDelete: () => void
  children: React.ReactNode
  defaultOpen?: boolean
  isDragging?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function SectionEntry({
  title,
  subtitle,
  onDelete,
  children,
  defaultOpen = true,
  isDragging = false,
  dragHandleProps,
}: SectionEntryProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultOpen)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsExpanded((prev) => !prev)
    }
  }

  const displayTitle = title || 'Untitled entry'

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card transition-shadow',
        isDragging && 'shadow-lg ring-2 ring-primary/30'
      )}
    >
      <div className="flex items-center gap-2 p-3">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
          role="button"
          tabIndex={0}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Expand/collapse toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          onKeyDown={handleKeyDown}
          className="flex flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {title || (
                <span className="text-muted-foreground italic">
                  Untitled entry
                </span>
              )}
            </p>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </button>

        {/* Delete button with confirmation */}
        <AlertDialog.Root
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialog.Trigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${displayTitle}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
              <div className="flex flex-col space-y-2">
                <AlertDialog.Title className="text-lg font-semibold text-foreground">
                  Remove &ldquo;{displayTitle}&rdquo;?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-sm text-muted-foreground">
                  This entry will be permanently removed. You can use Ctrl+Z to
                  undo if you change your mind.
                </AlertDialog.Description>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <AlertDialog.Cancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button variant="destructive" onClick={onDelete}>
                    Remove
                  </Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>

      {isExpanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">{children}</div>
      )}
    </div>
  )
}
