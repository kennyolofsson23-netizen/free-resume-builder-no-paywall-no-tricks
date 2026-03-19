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
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>

        <p className="mb-3 text-center text-sm text-muted-foreground">
          © 2025 Free Resume Builder. Built with privacy in mind. Zero data
          collection.
        </p>
        <p className="text-center text-xs text-muted-foreground">
          We may earn a commission from partner links. This never affects our
          pricing (which is free).
        </p>
      </div>
    </footer>
  )
}
