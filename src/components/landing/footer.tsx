import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <nav
          className="mb-6 flex flex-wrap justify-center gap-6"
          aria-label="Footer navigation"
        >
          <Link
            href="/builder"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Builder
          </Link>
          <Link
            href="/templates"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Templates
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>

        {/* Job board display ad placement */}
        <div className="my-6 flex min-h-[90px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
          <span>
            Advertisement —{' '}
            <a
              href="https://linkedin.com/jobs"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline"
            >
              Browse Jobs on LinkedIn
            </a>
          </span>
        </div>

        <p className="mb-3 text-center text-sm text-muted-foreground">
          © 2026 Free Resume Builder. Zero data collection. No accounts. No
          paywall. Ever.
        </p>
        <p className="text-center text-xs text-muted-foreground">
          We may earn a commission if you click a partner link. This never
          influences what we charge you — which is nothing.
        </p>
      </div>
    </footer>
  )
}
