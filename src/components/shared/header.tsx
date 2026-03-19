'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-white dark:bg-slate-900">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / site name */}
        <Link
          href="/"
          className="text-lg font-bold text-slate-900 dark:text-white"
          aria-label="Free Resume Builder — Home"
        >
          Free Resume Builder
        </Link>

        {/* Main navigation */}
        <nav className="flex items-center gap-4" aria-label="Main navigation">
          {/* Templates link  hidden on mobile */}
          <Link
            href="/templates"
            className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white sm:block"
          >
            Templates
          </Link>

          <ThemeToggle />

          {/* Build Resume CTA  always visible */}
          <Link
            href="/builder"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Build My Resume
          </Link>
        </nav>
      </div>
    </header>
  )
}
