'use client'
import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/cn'

interface AffiliateBannerProps {
  className?: string
}

export function AffiliateBanner({ className }: AffiliateBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm',
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-muted-foreground shrink-0">
          Sponsored
        </span>
        <span className="text-muted-foreground">
          Want AI-powered writing help?{' '}
          <a
            href="https://kickresume.com/?ref=freeresumebuilder"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Try Kickresume — AI suggestions for every section
            <ExternalLink className="ml-1 inline h-3 w-3" />
          </a>
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss partner banner"
        className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
