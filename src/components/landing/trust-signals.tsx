export function TrustSignals() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
          Why Choose a Free Builder?
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Zety</h3>
            <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              Locks PDF download behind $29.99/month
            </div>
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              <span className="font-semibold">Us:</span> PDF download is completely free
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Resume.com</h3>
            <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              Requires account creation
            </div>
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              <span className="font-semibold">Us:</span> No account, no email needed
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Canva</h3>
            <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              Requires internet + account
            </div>
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              <span className="font-semibold">Us:</span> Works offline, zero tracking
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-muted/50 p-8 text-center">
          <p className="text-lg font-bold text-foreground">
            We believe your resume data belongs to you — not us. Zero data collection. Zero tracking. Zero paywall.
          </p>
        </div>
      </div>
    </section>
  )
}
