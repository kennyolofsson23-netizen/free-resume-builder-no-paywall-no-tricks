'use client'

import * as React from 'react'
import { ChevronDown, ChevronRight, GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

interface SectionEntryProps {
  title: string
  subtitle?: string
  onDelete: () => void
  children: React.ReactNode
  isDragging?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function SectionEntry({
  title,
  subtitle,
  onDelete,
  children,
  isDragging = false,
  dragHandleProps,
}: SectionEntryProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsExpanded((prev) => !prev)
    }
  }

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
                <span className="text-muted-foreground italic">Untitled</span>
              )}
            </p>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </button>

        {/* Delete button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="shrink-0 text-muted-foreground hover:text-destructive"
          aria-label="Delete entry"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">{children}</div>
      )}
    </div>
  )
}
