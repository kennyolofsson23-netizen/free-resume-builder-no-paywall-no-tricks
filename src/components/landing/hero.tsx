import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mb-6">
            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
              Unlike Zety — we don&apos;t lock your PDF behind a $29.99/month
              subscription
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Free Resume Builder — No Paywall, No Tricks
          </h1>

          <p className="mb-8 text-xl text-slate-300">
            Professional templates. Real-time preview. Instant PDF download.
            <br />
            No email. No account. No &apos;$1.95 trial that auto-renews.&apos;
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/builder"
              aria-label="Start Building — Free"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              Build Your Resume — Free →
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-lg border border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              View Templates
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="text-sm text-slate-400">✓ No account needed</span>
            <span className="text-sm text-slate-400">✓ 100% client-side</span>
            <span className="text-sm text-slate-400">✓ Instant download</span>
          </div>
        </div>
      </div>
    </section>
  )
}
