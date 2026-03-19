import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          {/* Anti-paywall badge */}
          <div className="mb-6 inline-block rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 ring-1 ring-red-400/40">
            Unlike Zety — PDF download is ALWAYS free
          </div>

          {/* H1 */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Free Resume Builder —{' '}
            <span className="text-blue-400">No Paywall, No Tricks</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Professional templates. Real-time preview. Instant PDF download.{' '}
            <span className="font-medium text-slate-100">
              No email. No account.
            </span>{' '}
            No &ldquo;$1.95 trial&rdquo; that auto-renews at $25.90/month.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Build Your Resume — It&apos;s Free
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              See Templates
            </Link>
          </div>

          {/* Trust checkmarks */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            {[
              'No account required',
              'No credit card',
              'Download PDF instantly',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-slate-300"
              >
                <Check
                  className="h-4 w-4 flex-shrink-0 text-green-400"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative background blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 transform"
      >
        <div className="h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>
    </section>
  )
}
