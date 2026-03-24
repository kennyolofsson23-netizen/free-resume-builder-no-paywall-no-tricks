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

          <p id="tool-description" className="mb-4 text-xl text-slate-300">
            The <strong className="text-white">Free Resume Builder</strong> is an{' '}
            <strong className="text-white">open-source, browser-based tool</strong>{' '}
            that lets you create a professional resume in under 10 minutes. Choose
            from <strong className="text-white">5 ATS-friendly templates</strong>,
            fill in your details with a real-time preview, and{' '}
            <strong className="text-white">download a print-ready PDF in seconds</strong>{' '}
            — with no account, no email, and no payment required at any step.
          </p>

          <p className="mb-8 text-base text-slate-400">
            All resume data is stored locally in your browser using{' '}
            <strong className="text-slate-300">local storage</strong> — nothing is
            sent to a server. The PDF is generated{' '}
            <strong className="text-slate-300">client-side</strong> using your
            browser&apos;s built-in rendering engine and available for instant
            download. Over <strong className="text-slate-300">98% of modern browsers</strong>{' '}
            are supported.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/builder"
              aria-label="Start Building — It's Free"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              Build Your Resume — It&apos;s Free
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-lg border border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse Templates
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="text-sm text-slate-400">✓ No account needed</span>
            <span className="text-sm text-slate-400">
              ✓ Your data never leaves your browser
            </span>
            <span className="text-sm text-slate-400">
              ✓ PDF downloads in seconds
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
