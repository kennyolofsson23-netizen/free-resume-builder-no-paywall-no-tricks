'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

const DISMISSED_KEY = 'affiliate-banner-dismissed'

interface AffiliateBannerProps {
  variant?: 'sidebar' | 'inline'
}

export function AffiliateBanner({ variant = 'inline' }: AffiliateBannerProps) {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid layout shift

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DISMISSED_KEY)
      if (!stored) {
        setDismissed(false)
      }
    } catch {
      // localStorage may not be available
    }
  }, [])

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // ignore
    }
    setDismissed(true)
  }

  if (dismissed) {
    return null
  }

  if (variant === 'sidebar') {
    return (
      <div
        className={cn(
          'relative rounded-lg border border-gray-200 bg-gray-50 p-4',
          'flex flex-col gap-2 text-sm'
        )}
      >
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
        <p className="font-medium text-gray-800 pr-5">
          Want AI-powered writing suggestions?
        </p>
        <a
          href="https://www.kickresume.com/?utm_source=free-resume-builder&utm_medium=affiliate"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Try Kickresume &rarr;
        </a>
        <p className="text-xs text-gray-400">
          Affiliate link — helps keep this tool free
        </p>
      </div>
    )
  }

  // inline variant
  return (
    <div
      className={cn(
        'relative rounded-lg border border-gray-200 bg-gray-50 px-4 py-3',
        'flex flex-row items-center justify-between gap-4 text-sm'
      )}
    >
      <div className="flex flex-row items-center gap-4 min-w-0">
        <p className="font-medium text-gray-800 whitespace-nowrap">
          Want AI-powered writing suggestions?
        </p>
        <a
          href="https://www.kickresume.com/?utm_source=free-resume-builder&utm_medium=affiliate"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors whitespace-nowrap"
        >
          Try Kickresume &rarr;
        </a>
        <p className="text-xs text-gray-400 hidden sm:block">
          Affiliate link — helps keep this tool free
        </p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}
