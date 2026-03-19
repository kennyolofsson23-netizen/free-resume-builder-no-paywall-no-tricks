import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Logo + tagline */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="text-lg font-bold text-foreground hover:text-foreground/80"
            >
              Free Resume Builder
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Made to be the anti-Zety.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              No paywall. No subscription. No tricks.
            </p>
          </div>

          {/* Right: Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <li>
                <Link
                  href="/builder"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/free-resume-builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 space-y-2">
          <p className="text-xs text-muted-foreground">
            This site earns commission from affiliate links. PDF download is
            always free, always.
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Free Resume Builder
          </p>
        </div>
      </div>
    </footer>
  )
}
