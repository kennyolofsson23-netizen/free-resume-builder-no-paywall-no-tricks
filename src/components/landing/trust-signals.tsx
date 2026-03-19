export function TrustSignals() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
          Other builders call themselves free. They&apos;re not.
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          They show you a polished preview, then charge you to download it. We don&apos;t.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Zety</h3>
            <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              ✗ PDF locked behind $29.99/month — after you&apos;ve spent 45 minutes building it
            </div>
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              <span className="font-semibold">Us:</span> Download your PDF the moment it&apos;s ready. Always free.
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Resume.io
            </h3>
            <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              ✗ Requires an account and payment info to access your finished resume
            </div>
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              <span className="font-semibold">Us:</span> No account. No credit card. No hidden step.
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Canva
            </h3>
            <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              ✗ Requires a Google account and an internet connection just to open a template
            </div>
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              <span className="font-semibold">Us:</span> Works offline. Zero sign-in. Zero tracking.
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-muted/50 p-8 text-center">
          <p className="text-lg font-bold text-foreground">
            Your resume data belongs to you — not us.
          </p>
          <p className="mt-2 text-muted-foreground">
            We collect nothing. Store nothing. Charge nothing. The PDF download is free because it should be.
          </p>
        </div>
      </div>
    </section>
  )
}
