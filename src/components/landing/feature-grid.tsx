import { Download, Eye, Layout, Shield, UserX, WifiOff } from 'lucide-react'

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          Built for job seekers who&apos;ve been burned before
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Every feature you need. None of the paywalls, dark patterns, or
          surprise charges.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              See every change instantly
            </h3>
            <p className="text-muted-foreground">
              Your resume preview updates as you type. What you see is exactly
              what you&apos;ll download — no surprises.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-green-100 p-3">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              One click. Your PDF. Done.
            </h3>
            <p className="text-muted-foreground">
              Hit Download and get your file in seconds. No waiting. No email
              confirmation. No &ldquo;upgrade to download&rdquo; wall.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3">
              <Layout className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              5 ATS-friendly templates, all free
            </h3>
            <p className="text-muted-foreground">
              Modern, Classic, Minimal, Creative, Professional — all built to
              pass applicant tracking systems. Switch templates in one click.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-amber-100 p-3">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Your resume stays on your device
            </h3>
            <p className="text-muted-foreground">
              We have no server. Your data never leaves your browser — not while
              you type, not when you download, not ever.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-slate-100 p-3">
              <UserX className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Zero sign-up friction
            </h3>
            <p className="text-muted-foreground">
              Open the builder and start typing. No account, no email, no
              password. Your progress saves automatically.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 inline-block rounded-lg bg-slate-100 p-3">
              <WifiOff className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Works even without internet
            </h3>
            <p className="text-muted-foreground">
              Once the page loads, you can disconnect and keep building.
              Everything runs locally in your browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
