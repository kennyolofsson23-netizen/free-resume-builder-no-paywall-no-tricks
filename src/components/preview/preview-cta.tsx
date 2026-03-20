'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'

interface PreviewCtaProps {
  templateName?: string
}

export function PreviewCta({ templateName }: PreviewCtaProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-50 w-full bg-blue-600 text-white shadow-md',
        'px-4 py-3'
      )}
    >
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="font-semibold text-sm sm:text-base">
            This resume was built with Free Resume Builder
          </span>
          {templateName && (
            <span className="text-blue-200 text-xs sm:text-sm hidden sm:inline">
              — {templateName} template
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-row gap-2">
            <button
              onClick={() => window.print()}
              className={cn(
                'inline-block bg-white text-blue-600 font-bold text-sm sm:text-base',
                'px-5 py-2 rounded-full whitespace-nowrap',
                'hover:bg-blue-50 transition-colors'
              )}
            >
              Download PDF
            </button>
            <Link
              href="/builder"
              className={cn(
                'inline-block bg-white text-blue-600 font-bold text-sm sm:text-base',
                'px-5 py-2 rounded-full whitespace-nowrap',
                'hover:bg-blue-50 transition-colors'
              )}
            >
              Build Your Own Resume — It&apos;s Free
            </Link>
          </div>
          <span className="text-blue-200 text-xs">
            No account required. No paywall. Ever.
          </span>
        </div>
      </div>
    </div>
  )
}
