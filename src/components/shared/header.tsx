'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-slate-900 dark:text-white"
          aria-label="Free Resume Builder — Home"
        >
          ResumeBuilder
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav
          className="hidden items-center gap-6 sm:flex"
          aria-label="Main navigation"
        >
          <Link
            href="/templates"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Templates
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            How It Works
          </Link>
        </nav>

        {/* Right side: CTA + theme toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/builder"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Build Free Resume
          </Link>
        </div>
      </div>
    </header>
  )
}
